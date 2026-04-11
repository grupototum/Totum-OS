#!/usr/bin/env node
/**
 * Alexandria RAG Migration Script
 * Aplica migration 002_alexandria_rag.sql via Supabase API
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncGtmYnJxcHJxcHR2ZWhhdGFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDA4NjQwMCwiZXhwIjoyMDU5NjYyNDAwfQ.service_key_placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const MIGRATION_SQL = `
-- 1. Ativar extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabela: rag_documents
CREATE TABLE IF NOT EXISTS rag_documents (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 type TEXT NOT NULL CHECK (type IN ('design_system', 'pops', 'slas', 'client_info', 'execution_history')),
 title TEXT NOT NULL,
 content TEXT NOT NULL,
 metadata JSONB DEFAULT '{}',
 embedding vector(1536),
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rag_documents_type ON rag_documents(type);
CREATE INDEX IF NOT EXISTS idx_rag_documents_embedding ON rag_documents USING ivfflat (embedding vector_cosine_ops);

-- 3. Tabela: rag_context
CREATE TABLE IF NOT EXISTS rag_context (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 agent_id TEXT NOT NULL REFERENCES agents_config(agent_id),
 execution_id TEXT NOT NULL,
 query TEXT NOT NULL,
 context TEXT NOT NULL,
 documents_used JSONB DEFAULT '[]',
 similarity_score DECIMAL(3, 2),
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rag_context_agent_id ON rag_context(agent_id);
CREATE INDEX IF NOT EXISTS idx_rag_context_execution_id ON rag_context(execution_id);

-- 4. RLS Policies
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all" ON rag_documents FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON rag_context FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated" ON rag_context FOR INSERT TO authenticated WITH CHECK (true);
`;

async function applyMigration() {
  console.log('🚀 Aplicando Migration Alexandria RAG...\n');
  
  try {
    // Verificar se tabelas já existem
    const { data: existingTables, error: checkError } = await supabase
      .from('rag_documents')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code !== '42P01') {
      console.log('❌ Erro ao verificar tabelas:', checkError.message);
      process.exit(1);
    }
    
    if (existingTables) {
      console.log('⚠️  Tabelas já existem. Pulando criação...');
    } else {
      console.log('📋 Criando tabelas...');
      // Aplicar SQL via RPC (precisa da função exec_sql configurada no Supabase)
      const { error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });
      if (error) {
        console.log('❌ Erro ao aplicar migration:', error.message);
        console.log('\n💡 Alternativa: Cole o SQL manualmente no SQL Editor do Supabase:');
        console.log('   1. Acesse: https://supabase.com/dashboard/project/cgpkfhrqprqptvehatad/sql-editor');
        console.log('   2. Cole o conteúdo de: migrations/002_alexandria_rag.sql');
        process.exit(1);
      }
      console.log('✅ Tabelas criadas com sucesso!');
    }
    
    // Inserir dados iniciais
    console.log('\n📥 Inserindo documentos iniciais...');
    
    const documents = [
      {
        type: 'design_system',
        title: 'Totum Design System',
        content: 'Paleta de cores: Laranja primário (#FF6B35), Azul secundário (#004E89), Neutro (#F5F5F5). Tipografia: Roboto (sans-serif). Tom de voz: Profissional, inovador, direto. Sempre usar emoji relevante no começo de mensagens importantes.',
        metadata: { version: '1.0', tags: ['colors', 'typography', 'tone'] }
      },
      {
        type: 'pops',
        title: 'POP: Conteúdo Social',
        content: 'Sempre incluir hashtag #IA em posts sobre inteligência artificial. Usar no máximo 3 hashtags. Incluir call-to-action no final. Posts devem ter 150-280 caracteres. Usar emojis relacionados ao tema.',
        metadata: { department: 'marketing', tags: ['social', 'content'] }
      },
      {
        type: 'slas',
        title: 'SLA: Tempo de Resposta',
        content: 'Agentes devem responder em menos de 5 segundos. Se análise complexa: máximo 30 segundos. Erros devem ser tratados graciosamente com mensagem ao usuário.',
        metadata: { severity: 'high', tags: ['performance', 'reliability'] }
      },
      {
        type: 'client_info',
        title: 'Totum Digital - Perfil do Cliente',
        content: 'Totum Digital é agência de marketing inovadora focada em IA. Principais serviços: automação, análise de dados, estratégia digital. Público-alvo: empresas tech de 10-500 pessoas. Tons: inovador, data-driven, executor.',
        metadata: { client_name: 'Totum Digital', tags: ['client', 'profile'] }
      }
    ];
    
    for (const doc of documents) {
      const { error: insertError } = await supabase
        .from('rag_documents')
        .upsert(doc, { onConflict: 'title' });
      
      if (insertError) {
        console.log(`   ⚠️  ${doc.title}: ${insertError.message}`);
      } else {
        console.log(`   ✅ ${doc.title}`);
      }
    }
    
    // Verificar tabelas
    console.log('\n📊 Verificando tabelas:');
    const { data: ragDocs, error: countError } = await supabase
      .from('rag_documents')
      .select('*');
    
    if (countError) {
      console.log('   ❌ rag_documents:', countError.message);
    } else {
      console.log(`   ✅ rag_documents: ${ragDocs.length} documentos`);
    }
    
    const { data: ragCtx, error: ctxError } = await supabase
      .from('rag_context')
      .select('id')
      .limit(1);
    
    if (ctxError && ctxError.code !== '42P01') {
      console.log('   ❌ rag_context:', ctxError.message);
    } else {
      console.log('   ✅ rag_context: tabela existe');
    }
    
    console.log('\n🎉 Migration Alexandria RAG completa!\n');
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    process.exit(1);
  }
}

applyMigration();
