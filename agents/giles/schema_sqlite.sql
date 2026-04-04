-- =====================================================
-- SCHEMA SQLITE DO GILES - Alexandria
-- Banco: Alexandria/giles.db
-- =====================================================

-- Habilitar foreign keys
PRAGMA foreign_keys = ON;

-- =====================================================
-- TABELA PRINCIPAL: KNOWLEDGE (Chunks + Metadados)
-- =====================================================
CREATE TABLE IF NOT EXISTS knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chunk_id TEXT UNIQUE NOT NULL,
    
    -- Conteúdo
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text', -- text, code, markdown, json
    
    -- Embedding vetorial (JSON array)
    embedding TEXT,  -- JSON: [0.1, 0.2, ...]
    
    -- Metadados Hierárquicos (Taxonomia)
    dominio TEXT NOT NULL,      -- Pai
    categoria TEXT NOT NULL,    -- Filho  
    subcategoria TEXT,          -- Neto
    
    -- Tags e Palavras-chave (JSON arrays)
    tags TEXT DEFAULT '[]',     -- ["tag1", "tag2"]
    keywords TEXT DEFAULT '[]', -- ["keyword1", "keyword2"]
    
    -- Ontologia - Relações
    pai_id INTEGER REFERENCES knowledge(id) ON DELETE SET NULL,
    relacionamentos TEXT DEFAULT '[]', -- JSON: [{"tipo": "depende_de", "alvo_id": 123}]
    
    -- Entidades identificadas
    entidades TEXT DEFAULT '[]', -- JSON: [{"nome": "OpenClaw", "tipo": "sistema"}]
    
    -- Fonte e Rastreabilidade
    source_file TEXT,
    source_type TEXT,           -- file, conversation, url, document
    file_hash TEXT,             -- SHA256 para deduplicação
    chunk_index INTEGER,
    total_chunks INTEGER,
    
    -- Contexto e Autoria
    autor TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_origem DATETIME,       -- Quando o conteúdo original foi criado
    
    -- Qualidade e Confiança
    confianca REAL CHECK (confianca >= 0 AND confianca <= 1),
    qualidade INTEGER CHECK (qualidade >= 1 AND qualidade <= 5),
    revisado INTEGER DEFAULT 0, -- 0=false, 1=true
    
    -- Acesso e Permissões
    visibilidade TEXT DEFAULT 'public', -- public, private, restricted
    owner_id TEXT
);

-- Índices para filtros comuns
CREATE INDEX IF NOT EXISTS idx_knowledge_dominio ON knowledge(dominio);
CREATE INDEX IF NOT EXISTS idx_knowledge_categoria ON knowledge(categoria);
CREATE INDEX IF NOT EXISTS idx_knowledge_subcategoria ON knowledge(subcategoria);
CREATE INDEX IF NOT EXISTS idx_knowledge_source ON knowledge(source_file);
CREATE INDEX IF NOT EXISTS idx_knowledge_created ON knowledge(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_pai ON knowledge(pai_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_autor ON knowledge(autor);
CREATE INDEX IF NOT EXISTS idx_knowledge_visibilidade ON knowledge(visibilidade);

-- Índice para busca por conteúdo (LIKE otimizado)
CREATE INDEX IF NOT EXISTS idx_knowledge_content ON knowledge(content);

-- =====================================================
-- FULL-TEXT SEARCH (FTS5)
-- =====================================================
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(
    content,
    content='knowledge',
    content_rowid='id',
    tokenize='porter'  -- Stemming em inglês (ou 'unicode61' para geral)
);

-- Triggers para manter FTS sincronizado
CREATE TRIGGER IF NOT EXISTS knowledge_fts_insert AFTER INSERT ON knowledge BEGIN
    INSERT INTO knowledge_fts(rowid, content) VALUES (NEW.id, NEW.content);
END;

CREATE TRIGGER IF NOT EXISTS knowledge_fts_delete AFTER DELETE ON knowledge BEGIN
    INSERT INTO knowledge_fts(knowledge_fts, rowid, content) VALUES ('delete', OLD.id, OLD.content);
END;

CREATE TRIGGER IF NOT EXISTS knowledge_fts_update AFTER UPDATE ON knowledge BEGIN
    INSERT INTO knowledge_fts(knowledge_fts, rowid, content) VALUES ('delete', OLD.id, OLD.content);
    INSERT INTO knowledge_fts(rowid, content) VALUES (NEW.id, NEW.content);
END;

-- =====================================================
-- TABELA DE DOMÍNIOS (Taxonomia Controlada)
-- =====================================================
CREATE TABLE IF NOT EXISTS dominios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL,
    descricao TEXT,
    pai_id INTEGER REFERENCES dominios(id) ON DELETE SET NULL,
    nivel INTEGER DEFAULT 1,            -- 1=Pai, 2=Filho, 3=Neto
    cor TEXT DEFAULT '#3B82F6',        -- Para UI
    icone TEXT,
    ativo INTEGER DEFAULT 1,            -- 0=false, 1=true
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed de domínios iniciais da Totum
INSERT OR IGNORE INTO dominios (nome, descricao, nivel, cor) VALUES
('Infraestrutura', 'Servidores, redes, cloud, hardware', 1, '#EF4444'),
('Desenvolvimento', 'Software, código, APIs, sistemas', 1, '#3B82F6'),
('Negócios', 'Contratos, clientes, financeiro', 1, '#10B981'),
('Marketing', 'Campanhas, conteúdo, análise', 1, '#F59E0B'),
('Operações', 'Processos, equipe, rotinas', 1, '#8B5CF6'),
('Pessoal', 'Time, cultura, documentação interna', 1, '#EC4899');

-- =====================================================
-- TABELA DE CONSULTAS (Histórico e Analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS consultas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consulta TEXT NOT NULL,
    consulta_embedding TEXT,            -- JSON array
    resposta TEXT,
    fontes TEXT,                        -- JSON: [id1, id2, id3]
    confianca_media REAL,
    tempo_resposta_ms INTEGER,
    satisfacao INTEGER,                 -- Feedback do usuário (1-5)
    usuario_id TEXT,
    session_id TEXT,
    metadata TEXT DEFAULT '{}',         -- JSON extra
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultas_user ON consultas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_session ON consultas(session_id);
CREATE INDEX IF NOT EXISTS idx_consultas_created ON consultas(created_at);

-- =====================================================
-- TABELA DE SINÔNIMOS E ALIASES
-- =====================================================
CREATE TABLE IF NOT EXISTS sinonimos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    termo TEXT NOT NULL,
    sinonimos TEXT NOT NULL,            -- JSON: ["syn1", "syn2"]
    dominio TEXT,                       -- Opcional: válido só nesse domínio
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índice único para evitar duplicatas
CREATE UNIQUE INDEX IF NOT EXISTS idx_sinonimos_termo_dominio ON sinonimos(termo, COALESCE(dominio, ''));

-- Seeds de sinônimos comuns
INSERT OR IGNORE INTO sinonimos (termo, sinonimos) VALUES
('OpenClaw', '["openclaw", "claw", "TOT", "assistente"]'),
('Supabase', '["supabase", "postgres", "pg", "banco"]'),
('VPS', '["vps", "servidor", "server", "host", "máquina"]'),
('Docker', '["docker", "container", "contêiner"]'),
('API', '["api", "endpoint", "interface", "rest"]'),
('Alexandria', '["alexandria", "giles", "knowledge", "base"]');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- Overview por domínio/categoria
CREATE VIEW IF NOT EXISTS v_knowledge_overview AS
SELECT 
    dominio,
    categoria,
    COUNT(*) as total_documentos,
    COUNT(DISTINCT source_file) as total_fontes,
    AVG(confianca) as confianca_media,
    COUNT(*) FILTER (WHERE revisado = 1) as documentos_revisados,
    MAX(created_at) as ultima_atualizacao
FROM knowledge
GROUP BY dominio, categoria
ORDER BY dominio, categoria;

-- Estatísticas gerais
CREATE VIEW IF NOT EXISTS v_stats AS
SELECT
    (SELECT COUNT(*) FROM knowledge) as total_knowledge,
    (SELECT COUNT(*) FROM dominios WHERE ativo = 1) as total_dominios,
    (SELECT COUNT(*) FROM consultas) as total_consultas,
    (SELECT COUNT(DISTINCT autor) FROM knowledge) as total_autores,
    (SELECT COUNT(*) FROM knowledge WHERE created_at >= datetime('now', '-7 days')) as knowledge_ultimos_7dias;

-- =====================================================
-- FUNÇÕES AUXILIARES (simuladas via triggers/aplicação)
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_knowledge_updated_at 
AFTER UPDATE ON knowledge
BEGIN
    UPDATE knowledge SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =====================================================
-- TABELA DE CONFIGURAÇÕES
-- =====================================================
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Configurações padrão
INSERT OR IGNORE INTO config (key, value, description) VALUES
('embedding_model', 'local', 'Modelo de embeddings: local, openai, gemini'),
('embedding_dims', '384', 'Dimensões do vetor de embedding'),
('chunk_size', '500', 'Tamanho médio dos chunks (tokens)'),
('chunk_overlap', '50', 'Sobreposição entre chunks (tokens)'),
('version', '1.0.0', 'Versão do schema'),
('created_at', datetime('now'), 'Data de criação do banco');

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
