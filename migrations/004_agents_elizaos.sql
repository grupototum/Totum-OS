-- ============================================
-- MIGRAÇÃO: Sistema de Agentes elizaOS
-- Cria tabelas para gerenciamento de agentes compatíveis com elizaOS
-- ============================================

-- ============================================
-- 1. TABELA: agents_config
-- Configuração principal dos agentes elizaOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.agents_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '🤖',
    bio TEXT NOT NULL DEFAULT '',
    lore TEXT,
    adjectives TEXT[] DEFAULT '{}',
    system_prompt TEXT NOT NULL DEFAULT '',
    system_prompt_variations TEXT[] DEFAULT '{}',
    tier SMALLINT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3)),
    model_override TEXT,
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2000,
    knowledge_enabled BOOLEAN DEFAULT false,
    knowledge_sources TEXT[] DEFAULT '{}',
    rag_mode VARCHAR(20) DEFAULT 'static',
    plugins TEXT[] DEFAULT '{"@elizaos/plugin-bootstrap"}',
    exported_character JSONB,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'maintenance')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para agents_config
CREATE INDEX IF NOT EXISTS idx_agents_config_agent_id ON public.agents_config(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_config_tier ON public.agents_config(tier);
CREATE INDEX IF NOT EXISTS idx_agents_config_status ON public.agents_config(status);
CREATE INDEX IF NOT EXISTS idx_agents_config_is_active ON public.agents_config(is_active);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_agents_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_agents_config_updated_at ON public.agents_config;
CREATE TRIGGER trigger_agents_config_updated_at
    BEFORE UPDATE ON public.agents_config
    FOR EACH ROW
    EXECUTE FUNCTION update_agents_config_updated_at();

-- ============================================
-- 2. TABELA: agent_channels
-- Configuração de canais por agente (Telegram, Discord, etc)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents_config(id) ON DELETE CASCADE,
    channel_type VARCHAR(50) NOT NULL CHECK (channel_type IN ('telegram', 'discord', 'twitter', 'whatsapp', 'email')),
    is_enabled BOOLEAN DEFAULT true,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(agent_id, channel_type)
);

-- Índices para agent_channels
CREATE INDEX IF NOT EXISTS idx_agent_channels_agent_id ON public.agent_channels(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_channels_type ON public.agent_channels(channel_type);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_agent_channels_updated_at ON public.agent_channels;
CREATE TRIGGER trigger_agent_channels_updated_at
    BEFORE UPDATE ON public.agent_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_agents_config_updated_at();

-- ============================================
-- 3. TABELA: agent_skills_config
-- Skills configuradas para cada agente
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_skills_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents_config(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
    position INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    custom_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(agent_id, skill_id)
);

-- Índice para agent_skills_config
CREATE INDEX IF NOT EXISTS idx_agent_skills_agent_id ON public.agent_skills_config(agent_id);

-- ============================================
-- 4. TABELA: agent_knowledge_access
-- Controle de acesso a documentos do Alexandria
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_knowledge_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents_config(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.rag_documents(id) ON DELETE CASCADE,
    access_level VARCHAR(20) DEFAULT 'read' CHECK (access_level IN ('read', 'read_write')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(agent_id, document_id)
);

-- Índice para agent_knowledge_access
CREATE INDEX IF NOT EXISTS idx_agent_knowledge_agent_id ON public.agent_knowledge_access(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_knowledge_doc_id ON public.agent_knowledge_access(document_id);

-- ============================================
-- 5. TABELA: agent_executions
-- Log de execuções dos agentes
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.agents_config(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'success', 'error')),
    execution_id VARCHAR(100) NOT NULL UNIQUE,
    input TEXT,
    output JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    tokens_used INTEGER,
    channel_type VARCHAR(50),
    external_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Índices para agent_executions
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON public.agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON public.agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON public.agent_executions(created_at DESC);

-- ============================================
-- 6. POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.agents_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_skills_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_knowledge_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler
CREATE POLICY "Authenticated users can read agents"
    ON public.agents_config
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage agents"
    ON public.agents_config
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agent_channels"
    ON public.agent_channels
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agent_skills"
    ON public.agent_skills_config
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agent_knowledge"
    ON public.agent_knowledge_access
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage agent_executions"
    ON public.agent_executions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 7. COMENTÁRIOS
-- ============================================
COMMENT ON TABLE public.agents_config IS 'Configuração de agentes elizaOS';
COMMENT ON TABLE public.agent_channels IS 'Canais de comunicação configurados para cada agente';
COMMENT ON TABLE public.agent_skills_config IS 'Skills atribuídas aos agentes';
COMMENT ON TABLE public.agent_knowledge_access IS 'Acesso a documentos do Alexandria por agente';
COMMENT ON TABLE public.agent_executions IS 'Log de execuções dos agentes';
