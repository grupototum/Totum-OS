-- 🌙 Protocolo "Eu Vou Dormir" - Inserção de Novos Agentes
-- Data: 2026-04-04
-- Autor: TOT (Totum Operative Technology)

-- ============================================
-- 1. AGENTE GIT (GitHub Scout)
-- ============================================
INSERT INTO public.agentes (
    nome,
    slug,
    descricao,
    arquivo_script,
    arquivo_documentacao,
    tipo,
    status,
    horario_execucao,
    output_path,
    config_json,
    criado_em,
    atualizado_em
) VALUES (
    'GIT - GitHub Scout',
    'git-scout',
    'Monitora repositórios trending no GitHub relevantes para Totum. Busca por automation, n8n, supabase, ai-agents, low-code e CRM.',
    'scripts/git_scout.py',
    'agents/git.md',
    'scout',
    'ativo',
    '22:30',
    '/tmp/openclaw/git_scout_report.md',
    '{
        "keywords": ["automation", "n8n", "supabase", "ai-agent", "low-code", "crm", "workflow", "productivity"],
        "min_stars_daily": 20,
        "github_api": "https://api.github.com",
        "cache_file": "/tmp/openclaw/git_scout_cache.json",
        "rate_limit_delay": 1
    }'::jsonb,
    NOW(),
    NOW()
);

-- ============================================
-- 2. AGENTE SABIÁ (Trend Brasil)
-- ============================================
INSERT INTO public.agentes (
    nome,
    slug,
    descricao,
    arquivo_script,
    arquivo_documentacao,
    tipo,
    status,
    horario_execucao,
    output_path,
    config_json,
    criado_em,
    atualizado_em
) VALUES (
    'SABIÁ - Trend Brasil',
    'sabia-br',
    'Monitora tendências no Brasil sobre automação, marketing digital, produtividade e IA. Eco do que brasileiros estão buscando.',
    'scripts/trend_br.py',
    'agents/sabia.md',
    'trend',
    'ativo',
    '22:30',
    '/tmp/openclaw/sabia_report.md',
    '{
        "fontes": ["google_trends_br", "reddit_br", "noticias_tech_br"],
        "subreddits": ["brasil", "desenvolvimento", "marketingdigital"],
        "sites_noticias": ["techtudo", "g1_tech", "canaltech", "tecmundo"],
        "monitored_terms": ["automação", "n8n", "make", "zapier", "chatbot", "marketing digital", "produtividade", "notion", "ai", "inteligência artificial", "automação whatsapp"],
        "cache_file": "/tmp/openclaw/sabia_cache.json",
        "rate_limit_delay": 1
    }'::jsonb,
    NOW(),
    NOW()
);

-- ============================================
-- 3. AGENTE RADAR (Trend Global)
-- ============================================
INSERT INTO public.agentes (
    nome,
    slug,
    descricao,
    arquivo_script,
    arquivo_documentacao,
    tipo,
    status,
    horario_execucao,
    output_path,
    config_json,
    criado_em,
    atualizado_em
) VALUES (
    'RADAR - Trend Global',
    'radar-global',
    'Monitora tendências globais em IA, frameworks de agentes, ferramentas no-code/low-code e automação empresarial.',
    'scripts/trend_global.py',
    'agents/radar.md',
    'trend',
    'ativo',
    '22:30',
    '/tmp/openclaw/radar_report.md',
    '{
        "fontes": ["github_trending", "hacker_news", "product_hunt", "reddit_tech"],
        "subreddits": ["MachineLearning", "OpenAI", "LocalLLaMA", "automation", "productivity"],
        "categorias_monitoradas": ["ai-agents", "llm-local", "automation", "crm", "low-code"],
        "horizon_mapping": {"imediato": "0-3m", "6m": "3-6m", "12m": "6-12m"},
        "cache_file": "/tmp/openclaw/radar_cache.json",
        "rate_limit_delay": 1
    }'::jsonb,
    NOW(),
    NOW()
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Listar todos os agentes ativos
SELECT 
    id,
    nome,
    slug,
    tipo,
    status,
    horario_execucao
FROM public.agentes
WHERE status = 'ativo'
ORDER BY criado_em DESC;
