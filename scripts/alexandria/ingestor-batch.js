#!/usr/bin/env node
/**
 * Alexandria Ingestor Batch
 * 
 * Pipeline completo: chunk → embed → upload com rate limiting
 */

const fs = require('fs');
const path = require('path');
const { processDocument } = require('./chunker');

// Configuração de rate limiting
const CONFIG = {
  BATCH_SIZE: 50,
  BATCH_DELAY_MS: 1000,
  MAX_RETRIES: 3,
  RETRY_BASE_DELAY_MS: 2000,
  EMBEDDING_PROVIDER: process.env.EMBEDDING_PROVIDER || 'google',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'text-embedding-004'
};

// Placeholder para cliente Supabase (será implementado com @supabase/supabase-js)
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
 * Gera embeddings para um batch de chunks
 * (Placeholder - implementar integração com Google/OpenAI)
 */
async function generateEmbeddings(chunks) {
  const texts = chunks.map(c => c.content);
  
  // TODO: Implementar chamada real à API de embeddings
  // Por enquanto, retorna mock para testes
  console.error(`🔮 Gerando embeddings para ${chunks.length} chunks...`);
  
  // Simula delay da API
  await sleep(500);
  
  // Mock embeddings (vetores de 768 dimensões com valores aleatórios)
  return chunks.map(() => {
    return Array(768).fill(0).map(() => (Math.random() - 0.5) * 2);
  });
}

/**
 * Verifica se chunk já existe (por hash)
 */
async function checkExistingHashes(hashes) {
  if (!supabaseClient) initSupabase();
  
  const { data, error } = await supabaseClient
    .from('giles_knowledge')
    .select('id')
    .in('id', hashes);
  
  if (error) {
    console.error('Erro ao verificar hashes:', error);
    return new Set();
  }
  
  return new Set(data.map(d => d.id));
}

/**
 * Faz upload de batch para Supabase
 */
async function uploadBatch(chunks) {
  if (!supabaseClient) initSupabase();
  
  const { error } = await supabaseClient
    .from('giles_knowledge')
    .upsert(chunks, { onConflict: 'id' });
  
  if (error) {
    throw new Error(`Upload falhou: ${error.message}`);
  }
  
  return chunks.length;
}

/**
 * Sleep utilitário
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Processa ingestão com rate limiting
 */
async function ingestDocument(filePath, options = {}) {
  const docId = options.docId || path.basename(filePath, '.md');
  const dominio = options.dominio || 'geral';
  
  console.error(`\n📄 Processando: ${filePath}`);
  console.error(`🆔 Doc ID: ${docId}`);
  console.error(`🏷️  Domínio: ${dominio}`);
  
  // 1. Ler arquivo
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 2. Chunking
  console.error('\n✂️  Fase 1: Chunking semântico...');
  const docData = processDocument(content, docId);
  console.error(`   ${docData.total_chunks} chunks gerados`);
  console.error(`   Tamanho médio: ${Math.round(docData.stats.avg_chunk_size)} chars`);
  
  // 3. Preparar chunks para upload
  const chunksToProcess = docData.chunks.map(chunk => ({
    ...chunk,
    dominio,
    fonte: filePath,
    status: 'pending'
  }));
  
  // 4. Verificar hashes existentes (evita reprocessar)
  console.error('\n🔍 Fase 2: Verificando chunks existentes...');
  const hashes = chunksToProcess.map(c => c.id);
  const existingHashes = await checkExistingHashes(hashes);
  const newChunks = chunksToProcess.filter(c => !existingHashes.has(c.id));
  
  console.error(`   ${existingHashes.size} chunks já existem (pulando)`);
  console.error(`   ${newChunks.length} chunks novos para processar`);
  
  if (newChunks.length === 0) {
    console.error('✅ Nada novo para processar');
    return { processed: 0, skipped: existingHashes.size };
  }
  
  // 5. Gerar embeddings e fazer upload em batches
  console.error('\n☁️  Fase 3: Upload para Supabase...');
  let processed = 0;
  let failed = 0;
  
  for (let i = 0; i < newChunks.length; i += CONFIG.BATCH_SIZE) {
    const batch = newChunks.slice(i, i + CONFIG.BATCH_SIZE);
    const batchNum = Math.floor(i / CONFIG.BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(newChunks.length / CONFIG.BATCH_SIZE);
    
    process.stderr.write(`   Batch ${batchNum}/${totalBatches}... `);
    
    try {
      // Gerar embeddings
      const embeddings = await generateEmbeddings(batch);
      
      // Adicionar embeddings aos chunks
      const chunksWithEmbeddings = batch.map((chunk, idx) => ({
        ...chunk,
        embedding: embeddings[idx],
        status: 'active'
      }));
      
      // Upload
      await uploadBatch(chunksWithEmbeddings);
      processed += batch.length;
      process.stderr.write('✅\n');
      
    } catch (error) {
      process.stderr.write(`❌ ${error.message}\n`);
      failed += batch.length;
      
      // TODO: Implementar retry com exponential backoff
      if (error.message.includes('429')) {
        console.error('   ⏸️  Rate limit atingido, aguardando...');
        await sleep(CONFIG.RETRY_BASE_DELAY_MS);
      }
    }
    
    // Rate limiting entre batches
    if (i + CONFIG.BATCH_SIZE < newChunks.length) {
      await sleep(CONFIG.BATCH_DELAY_MS);
    }
  }
  
  // 6. Relatório final
  console.error('\n📊 Relatório:');
  console.error(`   ✅ Processados: ${processed}`);
  console.error(`   ⏭️  Pulados: ${existingHashes.size}`);
  console.error(`   ❌ Falhas: ${failed}`);
  console.error(`   ⏱️  Tempo: ${(Date.now() - startTime) / 1000}s`);
  
  return { processed, skipped: existingHashes.size, failed };
}

/**
 * Processa múltiplos arquivos
 */
async function ingestDirectory(dirPath, options = {}) {
  const pattern = options.pattern || '*.md';
  const recursive = options.recursive || false;
  
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(dirPath, f));
  
  console.error(`📁 Encontrados ${files.length} arquivos em ${dirPath}`);
  
  const results = { processed: 0, skipped: 0, failed: 0 };
  
  for (const file of files) {
    const result = await ingestDocument(file, options);
    results.processed += result.processed;
    results.skipped += result.skipped;
    results.failed += result.failed;
  }
  
  return results;
}

// CLI
const startTime = Date.now();

const args = process.argv.slice(2);
const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1];
const dirArg = args.find(a => a.startsWith('--dir='))?.split('=')[1];
const docIdArg = args.find(a => a.startsWith('--doc-id='))?.split('=')[1];
const dominioArg = args.find(a => a.startsWith('--dominio='))?.split('=')[1];
const patternArg = args.find(a => a.startsWith('--pattern='))?.split('=')[1];
const recursiveArg = args.includes('--recursive');
const retryArg = args.includes('--retry-failed');

if (!fileArg && !dirArg) {
  console.log(`
Uso: node ingestor-batch.js [opções]

Opções:
  --file=path          Arquivo único para processar
  --dir=path           Pasta para processar em massa
  --doc-id=ID          ID do documento (default: nome do arquivo)
  --dominio=nome       Domínio/categoria do documento
  --pattern=*.md       Padrão de arquivo (default: *.md)
  --recursive          Processar subpastas
  --retry-failed       Tentar reprocessar chunks com falha

Variáveis de ambiente:
  SUPABASE_URL         URL do projeto Supabase
  SUPABASE_ANON_KEY    Chave anônima do Supabase
  EMBEDDING_PROVIDER   google | openai | local
  EMBEDDING_MODEL      Modelo de embeddings

Exemplos:
  node ingestor-batch.js --file=POP-001.md --dominio=atendimento
  node ingestor-batch.js --dir=docs/pops --recursive
  node ingestor-batch.js --dir=docs --dominio=geral --pattern="*.md"
  `);
  process.exit(1);
}

(async () => {
  try {
    if (fileArg) {
      await ingestDocument(fileArg, {
        docId: docIdArg,
        dominio: dominioArg
      });
    } else if (dirArg) {
      await ingestDirectory(dirArg, {
        pattern: patternArg,
        recursive: recursiveArg,
        dominio: dominioArg
      });
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
})();

module.exports = { ingestDocument, ingestDirectory };
