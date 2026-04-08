-- ============================================
-- MIGRATION: Alexandria RAG System
-- pgvector + Context Embedding
-- Data: 2026-04-08
-- ============================================

-- 1. Ativar extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabela: rag_documents
-- Armazena chunks de conteúdo (Design System, POPs, etc)
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
-- Contexto injetado em execuções (cache)
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

-- 4. Dados iniciais: Design System
INSERT INTO rag_documents (type, title, content, metadata)
VALUES 
(
 'design_system',
 'Totum Design System',
 'Paleta de cores: Laranja primário (#FF6B35), Azul secundário (#004E89), Neutro (#F5F5F5). Tipografia: Roboto (sans-serif). Tom de voz: Profissional, inovador, direto. Sempre usar emoji relevante no começo de mensagens importantes.',
 '{"version": "1.0", "tags": ["colors", "typography", "tone"]}'
),
(
 'pops',
 'POP: Conteúdo Social',
 'Sempre incluir hashtag #IA em posts sobre inteligência artificial. Usar no máximo 3 hashtags. Incluir call-to-action no final. Posts devem ter 150-280 caracteres. Usar emojis relacionados ao tema.',
 '{"department": "marketing", "tags": ["social", "content"]}'
),
(
 'slas',
 'SLA: Tempo de Resposta',
 'Agentes devem responder em menos de 5 segundos. Se análise complexa: máximo 30 segundos. Erros devem ser tratados graciosamente com mensagem ao usuário.',
 '{"severity": "high", "tags": ["performance", "reliability"]}'
),
(
 'client_info',
 'Totum Digital - Perfil do Cliente',
 'Totum Digital é agência de marketing inovadora focada em IA. Principais serviços: automação, análise de dados, estratégia digital. Público-alvo: empresas tech de 10-500 pessoas. Tons: inovador, data-driven, executor.',
 '{"client_name": "Totum Digital", "tags": ["client", "profile"]}'
);

-- 5. RLS Policies
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all" ON rag_documents FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON rag_context FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated" ON rag_context FOR INSERT TO authenticated WITH CHECK (true);

-- 6. Função: calcular embedding (stub - vai usar API externa)
CREATE OR REPLACE FUNCTION generate_embedding(text_input TEXT)
RETURNS vector AS $$
BEGIN
 -- Placeholder: será chamado via app
 -- Em produção: integrar com OpenAI embedding API
 RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger: atualizar updated_at
DROP TRIGGER IF EXISTS update_rag_documents_updated_at ON rag_documents;
CREATE TRIGGER update_rag_documents_updated_at
 BEFORE UPDATE ON rag_documents
 FOR EACH ROW
 EXECUTE FUNCTION update_updated_at_column();
