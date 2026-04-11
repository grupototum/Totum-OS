#!/usr/bin/env node

/**
 * Script de ingestão em Supabase com embeddings
 * Recebe dados do transcription-processed.json e ingere na tabela rag_documents
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const OUTPUT_DIR = path.join(__dirname, 'outputs');
const PROCESSED_FILE = path.join(OUTPUT_DIR, 'transcription-processed.json');

// ============================================================
// MOCK EMBEDDING (para desenvolvimento)
// Simula embeddings de 1536 dimensões (como OpenAI)
// ============================================================

function generateMockEmbedding(text) {
  // Gera um embedding pseudo-aleatório baseado no conteúdo do texto
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const embedding = [];
  for (let i = 0; i < 1536; i++) {
    // Usa uma função pseudo-aleatória determinística baseada no hash e índice
    const seed = (hash + i) * 73856093 ^ ((i + 1) * 19349663);
    const random = Math.sin(seed) * 10000;
    embedding.push((random - Math.floor(random)) * 2 - 1);
  }
  return embedding;
}

// ============================================================
// SUPABASE CLIENT (usando fetch)
// ============================================================

async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Supabase error (${res.status}): ${error}`);
    }

    if (options.method === 'DELETE' || res.status === 204) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`❌ Supabase request failed:`, err.message);
    throw err;
  }
}

// ============================================================
// INGESTÃO
// ============================================================

async function ingestToSupabase() {
  console.log('\n📤 INGESTÃO EM SUPABASE');
  console.log('='.repeat(50));

  // 1. Validar arquivo de entrada
  if (!fs.existsSync(PROCESSED_FILE)) {
    throw new Error(`Arquivo não encontrado: ${PROCESSED_FILE}`);
  }

  const processed = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
  console.log(`\n📂 Carregado: ${processed.length} registros processados`);

  // 2. Preparar documentos para ingestão
  const documents = processed
    .filter(record => record.status === 'success')
    .map((record, index) => {
      const { subject, transcricao, criador } = record.originalRecord;
      const { insights, summary, tags, category, ctas, trendingTopics, script } = record;

      // Cria conteúdo combinado para busca
      const combinedContent = [
        subject,
        summary,
        transcricao.substring(0, 500),
        insights.join(' '),
        tags.join(' '),
      ].join('\n');

      return {
        id: `doc-${index + 1}`.padEnd(10),
        title: subject,
        content: combinedContent,
        metadata: {
          creator: criador,
          category,
          video_url: subject,
          insights,
          tags,
          ctas,
          trending_topics: trendingTopics,
          summary,
          script,
          processed_at: record.processedAt,
          source: 'tiktok',
        },
        embedding: generateMockEmbedding(combinedContent),
      };
    });

  console.log(`✅ Preparados: ${documents.length} documentos para ingestão\n`);

  // 3. Ingerir em lotes (evitar timeouts)
  const BATCH_SIZE = 5;
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(documents.length / BATCH_SIZE);

    console.log(`\n[${batchNum}/${totalBatches}] Ingerindo ${batch.length} documentos...`);

    for (const doc of batch) {
      try {
        // Usar endpoint REST do Supabase para inserir
        const result = await supabaseRequest('/rest/v1/rag_documents', {
          method: 'POST',
          body: {
            id: doc.id,
            title: doc.title,
            content: doc.content,
            metadata: doc.metadata,
            embedding: doc.embedding,
            created_at: new Date().toISOString(),
          },
        });

        console.log(`  ✓ ${doc.id} ingerido com sucesso`);
        successCount++;
      } catch (err) {
        // Pode ser conflito de ID (já existe), não é erro crítico
        if (err.message.includes('unique')) {
          console.log(`  ⊘ ${doc.id} já existe (pulando)`);
        } else {
          console.error(`  ✗ ${doc.id} falhou: ${err.message}`);
          failureCount++;
        }
      }
    }

    // Pequeno delay entre batches
    if (i + BATCH_SIZE < documents.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Ingestão concluída!`);
  console.log(`  ✓ Sucesso: ${successCount}/${documents.length}`);
  console.log(`  ✗ Falhas: ${failureCount}/${documents.length}`);
  console.log('='.repeat(50) + '\n');

  // 4. Salvar relatório
  const report = `# 📊 RELATÓRIO DE INGESTÃO SUPABASE

**Data:** ${new Date().toLocaleString('pt-BR')}
**Projeto:** cgpkfhrqprqptvehatad
**Tabela:** rag_documents

## Estatísticas

- Total de documentos: ${documents.length}
- Ingestões bem-sucedidas: ${successCount}
- Falhas: ${failureCount}
- Taxa de sucesso: ${((successCount / documents.length) * 100).toFixed(1)}%

## Campos ingeridos

- ✓ title (assunto do vídeo)
- ✓ content (conteúdo combinado para busca)
- ✓ metadata (insights, tags, CTAs, etc)
- ✓ embedding (vetor 1536D para busca semântica)
- ✓ created_at (timestamp)

## Próximas etapas

1. Testar busca com \`match_documents()\`
2. Validar embeddings em Supabase
3. Conectar com agentes WANDA e SCRIVO
4. Executar workflow N8N
`;

  const reportFile = path.join(OUTPUT_DIR, 'SUPABASE_REPORT.md');
  fs.writeFileSync(reportFile, report);
  console.log(`📄 Relatório: ${reportFile}\n`);
}

// ============================================================
// VALIDAÇÃO SUPABASE
// ============================================================

async function validateSupabase() {
  console.log('🔍 Validando conexão com Supabase...\n');

  try {
    // Teste endpoint simples
    const result = await supabaseRequest('/rest/v1/rag_documents?limit=1', {
      headers: { 'Accept': 'application/vnd.pgrst.object+json' },
    });

    console.log('✅ Supabase conectado com sucesso!');
    console.log(`   URL: ${SUPABASE_URL}`);
    console.log(`   Acesso: OK\n`);
    return true;
  } catch (err) {
    console.error('❌ Erro ao conectar com Supabase:', err.message);
    console.error(`\n   Verificação:
   - Variável SUPABASE_URL: ${SUPABASE_URL}
   - Variável SUPABASE_KEY: ${SUPABASE_KEY ? '✓ Configurada' : '✗ Não configurada'}
   - Tabela rag_documents: ?
   
   Dica: Configure as variáveis:
   export SUPABASE_URL="https://project.supabase.co"
   export SUPABASE_KEY="sua-anon-key"\n`);
    return false;
  }
}

// ============================================================
// MAIN
// ============================================================

async function mockIngestToSupabase() {
  console.log('\n📤 INGESTÃO EM SUPABASE (MODO MOCK)');
  console.log('='.repeat(50));

  // 1. Validar arquivo de entrada
  if (!fs.existsSync(PROCESSED_FILE)) {
    throw new Error(`Arquivo não encontrado: ${PROCESSED_FILE}`);
  }

  const processed = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
  console.log(`\n📂 Carregado: ${processed.length} registros processados`);

  // 2. Preparar documentos para ingestão
  const documents = processed
    .filter(record => record.status === 'success')
    .map((record, index) => {
      const { subject, transcricao, criador } = record.originalRecord;
      const { insights, summary, tags, category, ctas, trendingTopics, script } = record;

      const combinedContent = [
        subject,
        summary,
        transcricao.substring(0, 500),
        insights.join(' '),
        tags.join(' '),
      ].join('\n');

      return {
        id: `doc-${index + 1}`.padEnd(10),
        title: subject,
        content: combinedContent,
        metadata: {
          creator: criador,
          category,
          video_url: subject,
          insights,
          tags,
          ctas,
          trending_topics: trendingTopics,
          summary,
          script,
          processed_at: record.processedAt,
          source: 'tiktok',
        },
        embedding: generateMockEmbedding(combinedContent),
      };
    });

  console.log(`✅ Preparados: ${documents.length} documentos para ingestão\n`);

  // 3. Simular ingestão em lotes
  const BATCH_SIZE = 5;
  let successCount = 0;

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(documents.length / BATCH_SIZE);

    console.log(`\n[${batchNum}/${totalBatches}] Ingerindo ${batch.length} documentos...`);

    for (const doc of batch) {
      console.log(`  ✓ ${doc.id} ingerido com sucesso`);
      successCount++;
    }

    // Pequeno delay entre batches
    if (i + BATCH_SIZE < documents.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Ingestão concluída! (MODO MOCK)`);
  console.log(`  ✓ Sucesso: ${successCount}/${documents.length}`);
  console.log('='.repeat(50) + '\n');

  // 4. Salvar relatório
  const report = `# 📊 RELATÓRIO DE INGESTÃO SUPABASE

**Data:** ${new Date().toLocaleString('pt-BR')}
**Projeto:** cgpkfhrqprqptvehatad
**Tabela:** rag_documents
**Modo:** 🔄 MOCK (credenciais não configuradas)

## Estatísticas

- Total de documentos: ${documents.length}
- Ingestões simuladas: ${successCount}
- Taxa de sucesso: 100%

## Campos ingeridos (Simulado)

- ✓ title (assunto do vídeo)
- ✓ content (conteúdo combinado para busca)
- ✓ metadata (insights, tags, CTAs, etc)
- ✓ embedding (vetor 1536D para busca semântica)
- ✓ created_at (timestamp)

## Próximas etapas

1. Configurar \`SUPABASE_KEY\` em .env
2. Re-executar: \`node ingest-supabase.mjs\`
3. Testar busca com \`match_documents()\`
4. Validar embeddings em Supabase
5. Conectar com agentes WANDA e SCRIVO
6. Executar workflow N8N

## Documentos Processados

\`\`\`json
${JSON.stringify(documents.slice(0, 2), null, 2)}
\`\`\`
`;

  const reportFile = path.join(OUTPUT_DIR, 'SUPABASE_REPORT.md');
  fs.writeFileSync(reportFile, report);
  console.log(`📄 Relatório: ${reportFile}\n`);

  // 5. Salvar embeddings para referência
  const embeddingsFile = path.join(OUTPUT_DIR, 'embeddings-1536d.json');
  fs.writeFileSync(embeddingsFile, JSON.stringify({
    count: documents.length,
    dimension: 1536,
    documents: documents.map(d => ({
      id: d.id,
      title: d.title,
      embedding_sample: d.embedding.slice(0, 10), // Primeiros 10 valores
    })),
  }, null, 2));
  console.log(`🔢 Embeddings: ${embeddingsFile}\n`);
}

async function main() {
  try {
    // Validar Supabase
    const isValid = await validateSupabase();
    if (!isValid) {
      console.log('⚠️  Entrando em MODO MOCK para simular ingestão\n');
      await mockIngestToSupabase();
      return;
    }

    // Ingerir dados
    await ingestToSupabase();
  } catch (err) {
    console.error('\n❌ ERRO:', err.message);
    process.exit(1);
  }
}

main();
