-- ============================================
-- MIGRATION: Skills System + Agent Config
-- Apps Totum Refactor
-- Data: 2026-04-08
-- ============================================

-- ============================================
-- 1. TABELA: agents_config
-- Configuração dinâmica de agentes
-- ============================================
CREATE TABLE IF NOT EXISTS agents_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🤖',
  tier INTEGER DEFAULT 2 CHECK (tier IN (1, 2, 3)),
  model_override TEXT,
  system_prompt TEXT NOT NULL DEFAULT 'Você é um agente especializado...',
  skills JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_agents_config_agent_id ON agents_config(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_config_status ON agents_config(status);
CREATE INDEX IF NOT EXISTS idx_agents_config_tier ON agents_config(tier);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_agents_config_updated_at ON agents_config;
CREATE TRIGGER update_agents_config_updated_at
  BEFORE UPDATE ON agents_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TABELA: agent_executions
-- Histórico de execuções para Yoda analisar
-- ============================================
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id TEXT UNIQUE NOT NULL,
  agent_id TEXT NOT NULL REFERENCES agents_config(agent_id),
  user_id UUID REFERENCES auth.users(id),
  input_data TEXT,
  output_data JSONB,
  skills_executed JSONB DEFAULT '[]'::jsonb,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error')),
  error_message TEXT,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON agent_executions(created_at DESC);

-- ============================================
-- 3. TABELA: skills (opcional - pode usar JSON)
-- Se quiser persistir skills no DB além do JSON
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🔧',
  description TEXT,
  category TEXT NOT NULL,
  inputs JSONB DEFAULT '{}'::jsonb,
  outputs JSONB DEFAULT '{}'::jsonb,
  model_preference TEXT DEFAULT 'claude',
  cost_per_call DECIMAL(10, 4) DEFAULT 0,
  success_rate DECIMAL(3, 2) DEFAULT 0.95,
  prompt_template TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. DADOS INICIAIS: Configurações de Agentes
-- ============================================

-- WANDA: Social Planning Agent
INSERT INTO agents_config (agent_id, name, emoji, tier, model_override, system_prompt, skills, metadata, status)
VALUES (
  'WANDA',
  'WANDA - Social Planner',
  '🔴',
  2,
  'claude',
  'Você é WANDA, uma especialista em planejamento de conteúdo social. Você analisa trends, entende o público-alvo e cria estratégias de conteúdo que geram engajamento. Sempre responda em português do Brasil.',
  '[
    {"skill_id": "trend_analysis", "position": 0},
    {"skill_id": "social_planning", "position": 1},
    {"skill_id": "content_validation", "position": 2}
  ]'::jsonb,
  '{"team": "marketing", "description": "Agente de planejamento de conteúdo social"}'::jsonb,
  'active'
)
ON CONFLICT (agent_id) DO NOTHING;

-- RADAR: Trend Analysis Agent
INSERT INTO agents_config (agent_id, name, emoji, tier, model_override, system_prompt, skills, metadata, status)
VALUES (
  'RADAR',
  'RADAR - Trend Hunter',
  '🧭',
  2,
  'groq',
  'Você é RADAR, um caçador de tendências. Sua missão é identificar o que está bombando nas redes sociais e traduzir isso em oportunidades de conteúdo para os clientes.',
  '[
    {"skill_id": "trend_analysis", "position": 0},
    {"skill_id": "hashtag_generator", "position": 1}
  ]'::jsonb,
  '{"team": "research", "description": "Agente de análise de tendências"}'::jsonb,
  'active'
)
ON CONFLICT (agent_id) DO NOTHING;

-- LOKI: Traffic Manager Agent
INSERT INTO agents_config (agent_id, name, emoji, tier, model_override, system_prompt, skills, metadata, status)
VALUES (
  'LOKI',
  'LOKI - Traffic Master',
  '🎯',
  2,
  'claude',
  'Você é LOKI, especialista em gestão de tráfego pago. Você cria campanhas otimizadas, analisa métricas e maximiza o ROI dos anúncios.',
  '[
    {"skill_id": "copywriting", "position": 0},
    {"skill_id": "stable_diffusion_prompt", "position": 1},
    {"skill_id": "content_validation", "position": 2}
  ]'::jsonb,
  '{"team": "ads", "description": "Agente de gestão de tráfego"}'::jsonb,
  'active'
)
ON CONFLICT (agent_id) DO NOTHING;

-- ============================================
-- 5. POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE agents_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Políticas para agents_config
DROP POLICY IF EXISTS "Enable read access for all users" ON agents_config;
CREATE POLICY "Enable read access for all users"
  ON agents_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON agents_config;
CREATE POLICY "Enable update for authenticated users"
  ON agents_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para agent_executions
DROP POLICY IF EXISTS "Users can view own executions" ON agent_executions;
CREATE POLICY "Users can view own executions"
  ON agent_executions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own executions" ON agent_executions;
CREATE POLICY "Users can insert own executions"
  ON agent_executions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Políticas para skills
DROP POLICY IF EXISTS "Enable read access for all users" ON skills;
CREATE POLICY "Enable read access for all users"
  ON skills FOR SELECT
  USING (true);

-- ============================================
-- 6. FUNÇÕES AUXILIARES
-- ============================================

-- Função para obter estatísticas de execução
CREATE OR REPLACE FUNCTION get_agent_execution_stats(p_agent_id TEXT)
RETURNS TABLE (
  total_executions BIGINT,
  success_rate DECIMAL,
  avg_duration_ms DECIMAL,
  avg_cost DECIMAL,
  total_tokens BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_executions,
    (COUNT(*) FILTER (WHERE status = 'success')::DECIMAL / NULLIF(COUNT(*), 0) * 100) as success_rate,
    AVG(duration_ms)::DECIMAL as avg_duration_ms,
    AVG(total_cost)::DECIMAL as avg_cost,
    SUM(total_tokens)::BIGINT as total_tokens
  FROM agent_executions
  WHERE agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIM DA MIGRATION
-- ============================================
