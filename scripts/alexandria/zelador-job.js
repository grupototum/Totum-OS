#!/usr/bin/env node
/**
 * Alexandria Zelador - Job Noturno de Manutenção
 * 
 * Executado às 04:00 CST como parte do Protocolo "Eu Vou Dormir"
 * 
 * Responsabilidades:
 * 1. Detectar chunks órfãos (sem tags ou domínio)
 * 2. Identificar duplicatas semânticas
 * 3. Sugerir unificações de domínios
 * 4. Gerar relatório de Knowledge Gaps
 * 5. Atualizar cache local
 */

const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
  SIMILARITY_THRESHOLD: 0.85,  // Para detectar duplicatas
  ORPHAN_AGE_DAYS: 7,          // Chunks sem tags por mais de X dias
  GAP_THRESHOLD: 0.7,          // Score abaixo disso = Knowledge Gap
  MIN_QUERY_COUNT: 3           // Mínimo de queries para reportar gap
};

let supabaseClient = null;

function initSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios');
  }
  
  supabaseClient = createClient(url, key);
  return supabaseClient;
}

/**
 * 1. Detectar chunks órfãos
 * Chunks sem tags, sem domínio definido, ou criados há mais de X dias
 */
async function detectOrphanChunks() {
  console.error('🔍 Fase 1: Detectando chunks órfãos...');
  
  if (!supabaseClient) initSupabase();
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CONFIG.ORPHAN_AGE_DAYS);
  
  const { data, error } = await supabaseClient
    .from('giles_knowledge')
    .select('id, doc_id, content, tags, dominio, created_at')
    .or(`tags.is.null,tags.eq.[],dominio.is.null`)
    .lt('created_at', cutoffDate.toISOString())
    .limit(100);
  
  if (error) {
    console.error('   ❌ Erro:', error.message);
    return [];
  }
  
  console.error(`   ⚠️  ${data.length} chunks órfãos encontrados`);
  
  return data.map(chunk => ({
    type: 'orphan',
    id: chunk.id,
    doc_id: chunk.doc_id,
    preview: chunk.content.slice(0, 100) + '...',
    issue: !chunk.tags || chunk.tags.length === 0 ? 'sem_tags' : 'sem_dominio',
    suggestion: 'Adicionar tags e domínio manualmente ou via heurística'
  }));
}

/**
 * 2. Detectar duplicatas semânticas
 * Chunks com conteúdo similar no mesmo domínio
 */
async function detectDuplicates() {
  console.error('🔍 Fase 2: Detectando duplicatas...');
  
  // Query para encontrar conteúdos similares
  // Usa a função de similaridade de vetores do pgvector
  const { data, error } = await supabaseClient.rpc('giles_find_similar_chunks', {
    threshold: CONFIG.SIMILARITY_THRESHOLD
  });
  
  if (error) {
    // Se a RPC não existir ainda, fazer query alternativa
    console.error('   ⚠️  RPC não disponível, usando método alternativo...');
    return await detectDuplicatesFallback();
  }
  
  console.error(`   ⚠️  ${data.length} possíveis duplicatas encontradas`);
  
  return data.map(dup => ({
    type: 'duplicate',
    chunk_a: dup.chunk_a_id,
    chunk_b: dup.chunk_b_id,
    similarity: dup.similarity,
    suggestion: 'Unificar chunks ou marcar um como deprecated'
  }));
}

/**
 * Fallback para detecção de duplicatas (sem RPC)
 */
async function detectDuplicatesFallback() {
  // Busca chunks por domínio e compara títulos/seções
  const { data, error } = await supabaseClient
    .from('giles_knowledge')
    .select('id, doc_id, section_path, dominio')
    .limit(1000);
  
  if (error) return [];
  
  const duplicates = [];
  const seen = new Map();
  
  for (const chunk of data) {
    const key = `${chunk.dominio}:${chunk.section_path}`;
    if (seen.has(key)) {
      duplicates.push({
        type: 'duplicate_path',
        chunk_a: seen.get(key),
        chunk_b: chunk.id,
        path: chunk.section_path,
        suggestion: 'Verificar se são conteúdos idênticos ou apenas mesmo título'
      });
    } else {
      seen.set(key, chunk.id);
    }
  }
  
  console.error(`   ⚠️  ${duplicates.length} duplicatas de path encontradas`);
  return duplicates;
}

/**
 * 3. Sugerir unificações de domínios
 * Detecta domínios similares (ex: "infra" vs "infraestrutura")
 */
async function suggestDomainMerges() {
  console.error('🔍 Fase 3: Analisando domínios...');
  
  const { data, error } = await supabaseClient
    .from('giles_dominios')
    .select('id, nome, descricao, pai_id');
  
  if (error) {
    console.error('   ❌ Erro:', error.message);
    return [];
  }
  
  const merges = [];
  const dominios = data.map(d => d.nome.toLowerCase());
  
  // Heurística simples: detectar abreviações
  const abbrMap = {
    'infra': 'infraestrutura',
    'rh': 'recursos humanos',
    'ti': 'tecnologia',
    'adm': 'administrativo',
    'fin': 'financeiro',
    'com': 'comercial'
  };
  
  for (const dominio of dominios) {
    for (const [abbr, full] of Object.entries(abbrMap)) {
      if (dominio === abbr && dominios.includes(full)) {
        merges.push({
          type: 'domain_merge',
          from: abbr,
          to: full,
          reason: 'abreviacao',
          suggestion: `Unificar "${abbr}" em "${full}"`
        });
      }
    }
  }
  
  console.error(`   💡 ${merges.length} sugestões de merge de domínios`);
  return merges;
}

/**
 * 4. Gerar relatório de Knowledge Gaps
 * Consultas com score baixo que indicam falta de documentação
 */
async function generateKnowledgeGapReport() {
  console.error('🔍 Fase 4: Analisando Knowledge Gaps...');
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const { data, error } = await supabaseClient
    .from('giles_consultas')
    .select('query, score, created_at')
    .lt('score', CONFIG.GAP_THRESHOLD)
    .gt('created_at', yesterday.toISOString())
    .order('score', { ascending: true });
  
  if (error) {
    console.error('   ❌ Erro:', error.message);
    return [];
  }
  
  // Agrupa queries similares
  const groups = {};
  for (const row of data) {
    const key = normalizeQuery(row.query);
    if (!groups[key]) {
      groups[key] = { queries: [], count: 0, avgScore: 0 };
    }
    groups[key].queries.push(row.query);
    groups[key].count++;
    groups[key].avgScore += row.score;
  }
  
  // Calcula médias e filtra por mínimo de ocorrências
  const gaps = [];
  for (const [key, group] of Object.entries(groups)) {
    if (group.count >= CONFIG.MIN_QUERY_COUNT) {
      gaps.push({
        type: 'knowledge_gap',
        query: group.queries[0],
        variations: group.queries.slice(1),
        count: group.count,
        avg_score: (group.avgScore / group.count).toFixed(2),
        priority: group.count * (1 - group.avgScore / group.count),
        suggestion: `Criar documentação sobre: "${key}"`
      });
    }
  }
  
  // Ordena por prioridade
  gaps.sort((a, b) => b.priority - a.priority);
  
  console.error(`   ⚠️  ${gaps.length} Knowledge Gaps identificados`);
  return gaps.slice(0, 10); // Top 10
}

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/\b(o|a|os|as|um|uma|de|da|do|para|por|com|em)\b/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

/**
 * 5. Atualizar cache local
 * Espelha metadados do Supabase em SQLite local
 */
async function updateLocalCache() {
  console.error('🔍 Fase 5: Atualizando cache local...');
  
  const { data, error } = await supabaseClient
    .from('giles_knowledge')
    .select('id, doc_id, section_path, dominio, tags, status')
    .eq('status', 'active')
    .limit(5000);
  
  if (error) {
    console.error('   ❌ Erro:', error.message);
    return false;
  }
  
  // Salva em JSON local (placeholder para SQLite futuro)
  const cachePath = path.join(process.cwd(), '.cache', 'alexandria-metadata.json');
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  
  fs.writeFileSync(cachePath, JSON.stringify({
    updated_at: new Date().toISOString(),
    count: data.length,
    chunks: data
  }, null, 2));
  
  console.error(`   💾 ${data.length} chunks em cache local`);
  return true;
}

/**
 * Gera relatório final
 */
function generateReport(issues) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total_issues: issues.length,
      orphans: issues.filter(i => i.type === 'orphan').length,
      duplicates: issues.filter(i => i.type === 'duplicate' || i.type === 'duplicate_path').length,
      domain_merges: issues.filter(i => i.type === 'domain_merge').length,
      knowledge_gaps: issues.filter(i => i.type === 'knowledge_gap').length
    },
    issues: issues
  };
  
  return report;
}

/**
 * Main
 */
async function runZelador(options = {}) {
  console.error('🧹 Alexandria Zelador - Job Noturno');
  console.error(`⏰ Iniciado em: ${new Date().toISOString()}\n`);
  
  if (!supabaseClient) initSupabase();
  
  const allIssues = [];
  
  try {
    // Fase 1: Chunks órfãos
    const orphans = await detectOrphanChunks();
    allIssues.push(...orphans);
    
    // Fase 2: Duplicatas
    const duplicates = await detectDuplicates();
    allIssues.push(...duplicates);
    
    // Fase 3: Merges de domínio
    const merges = await suggestDomainMerges();
    allIssues.push(...merges);
    
    // Fase 4: Knowledge Gaps
    const gaps = await generateKnowledgeGapReport();
    allIssues.push(...gaps);
    
    // Fase 5: Cache
    await updateLocalCache();
    
    // Gera relatório
    const report = generateReport(allIssues);
    
    console.error('\n📊 Relatório Final:');
    console.error(`   Chunks órfãos: ${report.summary.orphans}`);
    console.error(`   Duplicatas: ${report.summary.duplicates}`);
    console.error(`   Merges sugeridos: ${report.summary.domain_merges}`);
    console.error(`   Knowledge Gaps: ${report.summary.knowledge_gaps}`);
    
    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(report, null, 2));
      console.error(`\n💾 Relatório salvo em: ${options.output}`);
    }
    
    if (options.dryRun) {
      console.error('\n🏃 Dry run - nenhuma alteração realizada');
    }
    
    return report;
    
  } catch (error) {
    console.error('\n❌ Erro no Zelador:', error.message);
    throw error;
  }
}

// CLI
const args = process.argv.slice(2);
const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'zelador-report.json';
const dryRunArg = args.includes('--dry-run');

if (args.includes('--help')) {
  console.log(`
Uso: node zelador-job.js [opções]

Opções:
  --output=arquivo.json   Onde salvar o relatório (default: zelador-report.json)
  --dry-run               Simulação sem alterar dados
  --help                  Mostra esta ajuda

Executado automaticamente às 04:00 CST no Protocolo "Eu Vou Dormir"
  `);
  process.exit(0);
}

(async () => {
  try {
    await runZelador({
      output: outputArg,
      dryRun: dryRunArg
    });
  } catch (error) {
    process.exit(1);
  }
})();

module.exports = { runZelador };
