-- Add missing columns to agents table (idempotent)
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS agent_group text DEFAULT 'geral';
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS description text;

-- Unique index on slug (skip if already exists)
CREATE UNIQUE INDEX IF NOT EXISTS agents_slug_key ON public.agents (slug) WHERE slug IS NOT NULL;

-- ── 10 agents from agency-agents (MIT license) ────────────────────────────────
-- DNAs loaded from DNAS_AGENCY_AGENTS/aa-*.md at runtime via agentDnaLoader.ts
INSERT INTO public.agents (name, role, emoji, status, category, agent_group, slug, description, tasks, daily_tasks, success_rate)
VALUES
  ('SEO Specialist',         'Especialista em SEO Técnico e Estratégia Orgânica',       '🔍', 'standby', 'marketing',   'paid-media', 'seo-specialist',      'SEO técnico, clusters de conteúdo, link building e rankings.',          0, 0, 0),
  ('PPC Strategist',         'Estrategista de Mídia Paga Google/Meta/Amazon',            '💰', 'standby', 'trafego',     'paid-media', 'ppc-strategist',      'Arquitetura de contas, bidding e Performance Max.',                     0, 0, 0),
  ('Paid Social Strategist', 'Estrategista de Social Ads (Meta, LinkedIn, TikTok)',      '📱', 'standby', 'trafego',     'paid-media', 'paid-social',         'Audiências cross-platform e funil de conversão social.',                0, 0, 0),
  ('Ad Creative Strategist', 'Criador de Copy e Criativos para Anúncios',               '✍️', 'standby', 'criacao',     'paid-media', 'ad-creative',         'RSA, Meta creative, Performance Max assets e UGC.',                    0, 0, 0),
  ('Tracking Specialist',    'Especialista em GTM, GA4 e Measurement',                  '📡', 'standby', 'trafego',     'paid-media', 'tracking-specialist', 'Implementação e auditoria de tracking, CAPI e conversions.',            0, 0, 0),
  ('Content Creator',        'Criador de Conteúdo Multi-Plataforma',                    '📝', 'standby', 'criacao',     'marketing',  'content-creator',     'Editorial calendars, storytelling e SEO content.',                     0, 0, 0),
  ('Instagram Curator',      'Curador de Estratégia Visual para Instagram',              '📸', 'standby', 'social',      'marketing',  'instagram-curator',   'Stories, Reels, estética visual e community building.',                 0, 0, 0),
  ('TikTok Strategist',      'Estrategista de Conteúdo Viral no TikTok',                '🎵', 'standby', 'social',      'marketing',  'tiktok-strategist',   'Algoritmo TikTok, tendências virais e audiência Gen Z/Millennial.',     0, 0, 0),
  ('Analytics Reporter',     'Analista de Dados, BI e KPIs',                            '📊', 'standby', 'analytics',   'support',    'analytics-reporter',  'Dashboards, SQL, forecasting e insights acionáveis.',                   0, 0, 0),
  ('Outbound Strategist',    'Especialista em Prospecção Signal-Based',                 '🎯', 'standby', 'comercial',   'sales',      'outbound-strategist', 'Multi-channel sequences, ICP targeting e frameworks de cold outreach.', 0, 0, 0)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  role        = EXCLUDED.role,
  emoji       = EXCLUDED.emoji,
  category    = EXCLUDED.category,
  agent_group = EXCLUDED.agent_group,
  description = EXCLUDED.description;
