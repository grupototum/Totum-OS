-- =====================================================
-- SCHEMA DO GILES - Cientista da Informação
-- Supabase PostgreSQL + pgvector
-- =====================================================

-- Habilitar extensão pgvector
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: KNOWLEDGE (Chunks + Metadados)
-- =====================================================
CREATE TABLE giles_knowledge (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id VARCHAR(100) UNIQUE NOT NULL,
    
    -- Conteúdo
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text', -- text, code, markdown, json
    
    -- Embedding vetorial (1536 dim = OpenAI, 768 = all-MiniLM, 1024 = Gemini)
    embedding VECTOR(1536),
    
    -- Metadados Hierárquicos (Taxonomia)
    dominio VARCHAR(100) NOT NULL,      -- Pai
    categoria VARCHAR(100) NOT NULL,    -- Filho  
    subcategoria VARCHAR(100),          -- Neto
    
    -- Tags e Palavras-chave
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    
    -- Ontologia - Relações
    pai_id UUID REFERENCES giles_knowledge(id) ON DELETE SET NULL,
    relacionamentos JSONB DEFAULT '[]', -- [{"tipo": "depende_de", "alvo_id": "uuid"}]
    
    -- Entidades identificadas
    entidades JSONB DEFAULT '[]',       -- [{"nome": "OpenClaw", "tipo": "sistema"}]
    
    -- Fonte e Rastreabilidade
    source_file VARCHAR(500),
    source_type VARCHAR(50),            -- file, conversation, url, document
    file_hash VARCHAR(64),              -- SHA256 para deduplicação
    chunk_index INTEGER,
    total_chunks INTEGER,
    
    -- Contexto e Autoria
    autor VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    data_origem TIMESTAMPTZ,            -- Quando o conteúdo original foi criado
    
    -- Qualidade e Confiança
    confianca FLOAT CHECK (confianca >= 0 AND confianca <= 1),
    qualidade INTEGER CHECK (qualidade >= 1 AND qualidade <= 5),
    revisado BOOLEAN DEFAULT FALSE,
    
    -- Acesso e Permissões
    visibilidade VARCHAR(20) DEFAULT 'public', -- public, private, restricted
    owner_id VARCHAR(100),
    
    -- Busca e Indexação
    search_vector TSVECTOR,             -- Para full-text search
    language VARCHAR(10) DEFAULT 'pt'
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice vetorial para busca por similaridade (IVFFlat = bom balanceio)
CREATE INDEX idx_giles_embedding ON giles_knowledge 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Índices para filtros comuns
CREATE INDEX idx_giles_dominio ON giles_knowledge(dominio);
CREATE INDEX idx_giles_categoria ON giles_knowledge(categoria);
CREATE INDEX idx_giles_subcategoria ON giles_knowledge(subcategoria);
CREATE INDEX idx_giles_tags ON giles_knowledge USING GIN(tags);
CREATE INDEX idx_giles_keywords ON giles_knowledge USING GIN(keywords);
CREATE INDEX idx_giles_source ON giles_knowledge(source_file);
CREATE INDEX idx_giles_created ON giles_knowledge(created_at);
CREATE INDEX idx_giles_pai ON giles_knowledge(pai_id);
CREATE INDEX idx_giles_visibilidade ON giles_knowledge(visibilidade);

-- Índice para full-text search
CREATE INDEX idx_giles_search ON giles_knowledge USING GIN(search_vector);

-- Índice para entidades (JSONB)
CREATE INDEX idx_giles_entidades ON giles_knowledge USING GIN(entidades jsonb_path_ops);

-- Índice para relacionamentos (JSONB)
CREATE INDEX idx_giles_relacionamentos ON giles_knowledge USING GIN(relacionamentos jsonb_path_ops);

-- =====================================================
-- TABELA DE DOMÍNIOS (Taxonomia Controlada)
-- =====================================================
CREATE TABLE giles_dominios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    pai_id UUID REFERENCES giles_dominios(id) ON DELETE SET NULL,
    nivel INTEGER DEFAULT 1,            -- 1=Pai, 2=Filho, 3=Neto
    cor VARCHAR(7) DEFAULT '#3B82F6',  -- Para UI
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed de domínios iniciais da Totum
INSERT INTO giles_dominios (nome, descricao, nivel, cor) VALUES
('Infraestrutura', 'Servidores, redes, cloud, hardware', 1, '#EF4444'),
('Desenvolvimento', 'Software, código, APIs, sistemas', 1, '#3B82F6'),
('Negócios', 'Contratos, clientes, financeiro', 1, '#10B981'),
('Marketing', 'Campanhas, conteúdo, análise', 1, '#F59E0B'),
('Operações', 'Processos, equipe, rotinas', 1, '#8B5CF6'),
('Pessoal', 'Time, cultura, documentação interna', 1, '#EC4899');

-- =====================================================
-- TABELA DE CONSULTAS (Histórico e Analytics)
-- =====================================================
CREATE TABLE giles_consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consulta TEXT NOT NULL,
    consulta_embedding VECTOR(1536),
    resposta TEXT,
    fontes UUID[],                      -- IDs dos chunks usados
    confianca_media FLOAT,
    tempo_resposta_ms INTEGER,
    satisfacao INTEGER,                 -- Feedback do usuário (1-5)
    usuario_id VARCHAR(100),
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_giles_consultas_user ON giles_consultas(usuario_id);
CREATE INDEX idx_giles_consultas_session ON giles_consultas(session_id);
CREATE INDEX idx_giles_consultas_created ON giles_consultas(created_at);

-- =====================================================
-- TABELA DE SINÔNIMOS E ALIASES
-- =====================================================
CREATE TABLE giles_sinonimos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termo VARCHAR(100) NOT NULL,
    sinonimos TEXT[] NOT NULL,
    dominio VARCHAR(100),               -- Opcional: válido só nesse domínio
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seeds de sinônimos comuns
INSERT INTO giles_sinonimos (termo, sinonimos) VALUES
('OpenClaw', ARRAY['openclaw', 'claw', 'TOT', 'assistente']),
('Supabase', ARRAY['supabase', 'postgres', 'pg', 'banco']),
('VPS', ARRAY['vps', 'servidor', 'server', 'host', 'máquina']),
('Docker', ARRAY['docker', 'container', 'contêiner']),
('API', ARRAY['api', 'endpoint', 'interface', 'rest']);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_giles_knowledge_updated_at 
    BEFORE UPDATE ON giles_knowledge 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Gerar search_vector para full-text search
CREATE OR REPLACE FUNCTION giles_generate_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector(NEW.language::regconfig, COALESCE(NEW.content, '')), 'A') ||
        setweight(to_tsvector(NEW.language::regconfig, COALESCE(NEW.dominio, '')), 'B') ||
        setweight(to_tsvector(NEW.language::regconfig, COALESCE(array_to_string(NEW.tags, ' '), '')), 'C') ||
        setweight(to_tsvector(NEW.language::regconfig, COALESCE(array_to_string(NEW.keywords, ' '), '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER giles_search_vector_trigger
    BEFORE INSERT OR UPDATE ON giles_knowledge
    FOR EACH ROW EXECUTE FUNCTION giles_generate_search_vector();

-- Busca híbrida (vetorial + full-text)
CREATE OR REPLACE FUNCTION giles_hybrid_search(
    query_embedding VECTOR(1536),
    query_text TEXT,
    match_count INT DEFAULT 5,
    match_threshold FLOAT DEFAULT 0.7,
    full_text_weight FLOAT DEFAULT 0.3,
    semantic_weight FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    dominio VARCHAR,
    categoria VARCHAR,
    tags TEXT[],
    similarity FLOAT,
    rank_full_text FLOAT,
    score_final FLOAT
) AS $$
DECLARE
    query_tsquery TSQUERY;
BEGIN
    query_tsquery := plainto_tsquery('portuguese', query_text);
    
    RETURN QUERY
    SELECT 
        k.id,
        k.content,
        k.dominio,
        k.categoria,
        k.tags,
        1 - (k.embedding <=> query_embedding) AS similarity,
        ts_rank_cd(k.search_vector, query_tsquery, 32) AS rank_full_text,
        (semantic_weight * (1 - (k.embedding <=> query_embedding))) + 
        (full_text_weight * ts_rank_cd(k.search_vector, query_tsquery, 32)) AS score_final
    FROM giles_knowledge k
    WHERE k.embedding <=> query_embedding < (1 - match_threshold)
       OR k.search_vector @@ query_tsquery
    ORDER BY score_final DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Busca por domínio com filtro
CREATE OR REPLACE FUNCTION giles_search_by_domain(
    query_embedding VECTOR(1536),
    target_dominio VARCHAR,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    categoria VARCHAR,
    tags TEXT[],
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.content,
        k.categoria,
        k.tags,
        1 - (k.embedding <=> query_embedding) AS similarity
    FROM giles_knowledge k
    WHERE k.dominio = target_dominio
    ORDER BY k.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Obter árvore de conhecimento (hierarquia)
CREATE OR REPLACE FUNCTION giles_get_tree(root_id UUID)
RETURNS TABLE (
    id UUID,
    content_preview TEXT,
    dominio VARCHAR,
    categoria VARCHAR,
    nivel INTEGER,
    caminho TEXT[]
) AS $$
WITH RECURSIVE tree AS (
    SELECT 
        k.id,
        LEFT(k.content, 100) as content_preview,
        k.dominio,
        k.categoria,
        0 as nivel,
        ARRAY[k.dominio, k.categoria]::TEXT[] as caminho
    FROM giles_knowledge k
    WHERE k.id = root_id
    
    UNION ALL
    
    SELECT 
        k.id,
        LEFT(k.content, 100),
        k.dominio,
        k.categoria,
        t.nivel + 1,
        t.caminho || k.categoria
    FROM giles_knowledge k
    INNER JOIN tree t ON k.pai_id = t.id
    WHERE t.nivel < 5  -- Limite de profundidade
)
SELECT * FROM tree;
$$ LANGUAGE sql;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS) - Opcional
-- =====================================================

ALTER TABLE giles_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE giles_consultas ENABLE ROW LEVEL SECURITY;

-- Política: usuários só veem conteúdo público ou deles
CREATE POLICY giles_knowledge_select_policy ON giles_knowledge
    FOR SELECT USING (
        visibilidade = 'public' OR owner_id = current_user
    );

-- Política: só dono pode modificar
CREATE POLICY giles_knowledge_modify_policy ON giles_knowledge
    FOR ALL USING (owner_id = current_user);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE giles_knowledge IS 'Repositório central de conhecimento da Totum - chunks com metadados e embeddings';
COMMENT ON COLUMN giles_knowledge.embedding IS 'Vetor de embedding para busca semântica (1536 dim = OpenAI)';
COMMENT ON COLUMN giles_knowledge.search_vector IS 'Índice para full-text search';
COMMENT ON COLUMN giles_knowledge.relacionamentos IS 'JSONB com array de relações: [{tipo, alvo_id, descricao}]';
COMMENT ON COLUMN giles_knowledge.entidades IS 'JSONB com entidades identificadas: [{nome, tipo, referencia}]';

-- =====================================================
-- VIEW RESUMIDA PARA DASHBOARDS
-- =====================================================

CREATE VIEW giles_overview AS
SELECT 
    dominio,
    categoria,
    COUNT(*) as total_documentos,
    COUNT(DISTINCT source_file) as total_fontes,
    AVG(confianca) as confianca_media,
    COUNT(*) FILTER (WHERE revisado = TRUE) as documentos_revisados,
    MAX(created_at) as ultima_atualizacao
FROM giles_knowledge
GROUP BY dominio, categoria
ORDER BY dominio, categoria;

-- View de estatísticas (para API)
CREATE VIEW v_stats AS
SELECT 
    (SELECT COUNT(*) FROM giles_knowledge) as total_knowledge,
    (SELECT COUNT(DISTINCT dominio) FROM giles_knowledge) as total_dominios,
    (SELECT COUNT(DISTINCT autor) FROM giles_knowledge) as total_autores,
    (SELECT COUNT(*) FROM giles_consultas) as total_consultas,
    (SELECT AVG(confianca) FROM giles_knowledge) as confiancia_media_global;

-- View de overview por domínio (alias para compatibilidade)
CREATE VIEW v_knowledge_overview AS
SELECT * FROM giles_overview;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
==========
==
