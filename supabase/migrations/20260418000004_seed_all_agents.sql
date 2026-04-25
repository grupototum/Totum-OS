-- Seed all Totum agents: Tier 1 (5), Tier 2 (10), Tier 3 (24), Totum Custom (18)
-- 57 agents total — idempotent via ON CONFLICT (slug)

-- ── TIER 1 — Laboratório (5 agentes) ────────────────────────────────────────
INSERT INTO public.agents (name, role, emoji, status, category, agent_group, slug, description, tasks, daily_tasks, success_rate)
VALUES
  ('LOKI',       'Especialista em Vendas B2B e CRM',              '🦊', 'standby', 'comercial',  'tier1', 'loki',       'Qualifica leads, propõe estratégias de fechamento e otimiza funis de conversão.',   0, 0, 0),
  ('MINERVA',    'Analista de Dados e BI Estratégico',            '🦉', 'standby', 'analytics',  'tier1', 'minerva',    'Transforma dados brutos em insights acionáveis para decisões de negócio.',          0, 0, 0),
  ('ARCHIMEDES', 'Arquiteto de Sistemas e Design Thinking',       '🔧', 'standby', 'tech',       'tier1', 'archimedes', 'Cria soluções técnicas elegantes e brainstorms arquiteturais complexos.',           0, 0, 0),
  ('SHERLOCK',   'Investigador e Pesquisador Profundo',           '🕵️', 'standby', 'analytics',  'tier1', 'sherlock',   'Encontra informações ocultas e conecta fatos aparentemente não relacionados.',     0, 0, 0),
  ('EINSTEIN',   'Gênio Criativo e Inovador',                     '⚛️', 'standby', 'criacao',    'tier1', 'einstein',   'Gera conceitos revolucionários e soluções fora da caixa para qualquer desafio.',   0, 0, 0)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  role        = EXCLUDED.role,
  emoji       = EXCLUDED.emoji,
  category    = EXCLUDED.category,
  agent_group = EXCLUDED.agent_group,
  description = EXCLUDED.description;

-- ── TIER 2 — Mid (10 agentes) ────────────────────────────────────────────────
INSERT INTO public.agents (name, role, emoji, status, category, agent_group, slug, description, tasks, daily_tasks, success_rate)
VALUES
  ('WANDA',       'Content Creator para Redes Sociais',             '📱', 'standby', 'social',     'tier2', 'wanda',       'Gera posts engajadores e adapta conteúdo para qualquer plataforma social.',       0, 0, 0),
  ('KVIRTUALOSO', 'Creator de Conteúdo Musical e Cultural',         '🎵', 'standby', 'criacao',    'tier2', 'kvirtualoso', 'Especialista em viralização, trends musicais e conteúdo cultural.',               0, 0, 0),
  ('SCRIVO',      'Copywriter Profissional',                        '✍️', 'standby', 'criacao',    'tier2', 'scrivo',      'Cria copy persuasivo e eficaz para qualquer canal de marketing.',                 0, 0, 0),
  ('VISU',        'Designer e Especialista em Imagens via IA',      '🎨', 'standby', 'criacao',    'tier2', 'visu',        'Design, Stable Diffusion prompts e direções visuais criativas.',                  0, 0, 0),
  ('AUDITOR',     'Especialista em BI e Auditoria de Dados',        '📊', 'standby', 'analytics',  'tier2', 'auditor',     'Audita dados e processos, identifica inconsistências e gera relatórios.',         0, 0, 0),
  ('PABLO',       'Especialista em Prospecting no LinkedIn',        '🔗', 'standby', 'comercial',  'tier2', 'pablo',       'Encontra e qualifica prospects ideais no LinkedIn para geração de leads B2B.',    0, 0, 0),
  ('ANALYST',     'Analista de Tendências de Mercado',              '📈', 'standby', 'analytics',  'tier2', 'analyst',     'Prepara relatórios estratégicos e analisa tendências de mercado.',                0, 0, 0),
  ('MENTOR',      'Mentor Virtual para Desenvolvimento Profissional','🎓', 'standby', 'suporte',    'tier2', 'mentor',      'Ajuda no desenvolvimento profissional e pessoal com guidance personalizado.',     0, 0, 0),
  ('GUARDIAN',    'Especialista em Compliance e Governança',        '🛡️', 'standby', 'suporte',    'tier2', 'guardian',    'Garante conformidade com políticas, regulamentos e boas práticas.',              0, 0, 0),
  ('TRANSLATOR',  'Especialista em Tradução e Localização',         '🌐', 'standby', 'suporte',    'tier2', 'translator',  'Tradução multi-idioma com contexto cultural e localização inteligente.',          0, 0, 0)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  role        = EXCLUDED.role,
  emoji       = EXCLUDED.emoji,
  category    = EXCLUDED.category,
  agent_group = EXCLUDED.agent_group,
  description = EXCLUDED.description;

-- ── TIER 3 — Fábrica (24 agentes) ────────────────────────────────────────────
INSERT INTO public.agents (name, role, emoji, status, category, agent_group, slug, description, tasks, daily_tasks, success_rate)
VALUES
  ('SCRAPER-WEB',      'Web Scraper Inteligente',                  '🕷️', 'standby', 'tech',      'tier3', 'scraper-web',      'Extrai dados estruturados de qualquer site com web scraping inteligente.',    0, 0, 0),
  ('PROCESSOR-CSV',    'Processador de Arquivos CSV',              '📑', 'standby', 'tech',      'tier3', 'processor-csv',    'Processamento e validação de arquivos CSV em lote.',                         0, 0, 0),
  ('MONITOR-NEWS',     'Monitor de Notícias e Menções',            '📰', 'standby', 'analytics', 'tier3', 'monitor-news',     'Monitora fontes de notícias e alerta sobre keywords e menções de marca.',    0, 0, 0),
  ('SCHEDULER',        'Orquestrador de Tarefas Agendadas',        '⏰', 'standby', 'tech',      'tier3', 'scheduler',        'Agendamento e orquestração de tarefas automáticas.',                         0, 0, 0),
  ('VALIDATOR',        'Validador de Dados e Schemas',             '✅', 'standby', 'tech',      'tier3', 'validator',        'Valida dados contra schemas e regras de negócio definidas.',                 0, 0, 0),
  ('CLEANER',          'Limpador e Normalizador de Dados',         '🧹', 'standby', 'tech',      'tier3', 'cleaner',          'Limpeza e normalização de datasets para processamento downstream.',           0, 0, 0),
  ('TAGGER',           'Auto-Tagger de Conteúdo',                  '🏷️', 'standby', 'tech',      'tier3', 'tagger',           'Classifica e etiqueta conteúdo automaticamente via NLP.',                    0, 0, 0),
  ('FORMATTER',        'Formatador e Conversor de Dados',          '📐', 'standby', 'tech',      'tier3', 'formatter',        'Converte dados entre formatos (JSON, CSV, XML, Markdown, etc).',             0, 0, 0),
  ('LOGGER',           'Logger de Eventos Estruturados',           '📝', 'standby', 'tech',      'tier3', 'logger',           'Registra eventos em formato estruturado para auditoria e debug.',            0, 0, 0),
  ('RETRY-HANDLER',    'Gerenciador de Retentativas',              '🔄', 'standby', 'tech',      'tier3', 'retry-handler',    'Lógica de retry com backoff exponencial para operações falhas.',              0, 0, 0),
  ('EXTRACTOR-PDF',    'Extrator de Texto de PDFs',                '📄', 'standby', 'tech',      'tier3', 'extractor-pdf',    'Extrai e estrutura texto de documentos PDF complexos.',                      0, 0, 0),
  ('SUMMARIZER',       'Sumarizador de Textos',                    '📋', 'standby', 'tech',      'tier3', 'summarizer',       'Cria resumos concisos de textos longos preservando pontos-chave.',           0, 0, 0),
  ('CLASSIFIER',       'Classificador de Conteúdo',                '🎯', 'standby', 'tech',      'tier3', 'classifier',       'Classifica conteúdo em categorias com análise de sentimento.',               0, 0, 0),
  ('ENTITY-EXTRACTOR', 'Extrator de Entidades (NER)',              '🔍', 'standby', 'tech',      'tier3', 'entity-extractor', 'Extrai entidades nomeadas (pessoas, lugares, organizações) de textos.',      0, 0, 0),
  ('DEDUPE',           'Detector e Removedor de Duplicatas',       '🔗', 'standby', 'tech',      'tier3', 'dedupe',           'Identifica e remove registros duplicados ou similares de datasets.',         0, 0, 0),
  ('ENRICHER',         'Enriquecedor de Dados',                    '💎', 'standby', 'tech',      'tier3', 'enricher',         'Adiciona informações contextuais e enriquece registros com dados externos.',  0, 0, 0),
  ('NOTIFIER-EMAIL',   'Notificador por Email',                    '📧', 'standby', 'tech',      'tier3', 'notifier-email',   'Envia notificações e alertas por email de forma automatizada.',              0, 0, 0),
  ('NOTIFIER-SLACK',   'Notificador para Slack',                   '💬', 'standby', 'tech',      'tier3', 'notifier-slack',   'Envia mensagens e notificações para canais Slack.',                          0, 0, 0),
  ('BACKUP-MANAGER',   'Gerenciador de Backups',                   '💾', 'standby', 'tech',      'tier3', 'backup-manager',   'Gerencia rotinas de backup e verificação de integridade de dados.',          0, 0, 0),
  ('QUALITY-CHECKER',  'Verificador de Qualidade de Dados',        '🔎', 'standby', 'tech',      'tier3', 'quality-checker',  'Verifica qualidade e completude de datasets contra métricas definidas.',     0, 0, 0),
  ('TRANSFORMER',      'Transformador e Mapeador de Dados',        '🔁', 'standby', 'tech',      'tier3', 'transformer',      'Transforma e mapeia dados entre estruturas e formatos diferentes.',           0, 0, 0),
  ('ANALYZER-METRICS', 'Analisador de Métricas Operacionais',      '📊', 'standby', 'analytics', 'tier3', 'analyzer-metrics', 'Analisa métricas operacionais e gera relatórios de performance.',            0, 0, 0),
  ('ROUTER',           'Roteador Inteligente de Dados',            '🚦', 'standby', 'tech',      'tier3', 'router',           'Direciona dados para destinos corretos baseado em regras de negócio.',       0, 0, 0),
  ('QUEUE-MANAGER',    'Gerenciador de Filas de Processamento',    '📬', 'standby', 'tech',      'tier3', 'queue-manager',    'Gerencia filas de tarefas com prioridade e controle de concorrência.',       0, 0, 0)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  role        = EXCLUDED.role,
  emoji       = EXCLUDED.emoji,
  category    = EXCLUDED.category,
  agent_group = EXCLUDED.agent_group,
  description = EXCLUDED.description;

-- ── TOTUM CUSTOM — 18 agentes especializados ─────────────────────────────────
INSERT INTO public.agents (name, role, emoji, status, category, agent_group, slug, description, tasks, daily_tasks, success_rate)
VALUES
  ('RADAR-SEO',          'SEO Specialist & Search Strategist',              '🔍', 'standby', 'marketing',  'totum', 'radar-seo',          'SEO técnico, clusters de conteúdo e rankings. Especialista em SaaS e B2B.',                     0, 0, 0),
  ('RADAR-GROWTH',       'Growth Hacker & Viral Loop Analyst',              '🚀', 'standby', 'marketing',  'totum', 'radar-growth',       'Identifica oportunidades de crescimento acelerado e viral loops.',                             0, 0, 0),
  ('RADAR-AEO',          'AI Engine Optimization (AEO) Specialist',         '🔮', 'standby', 'marketing',  'totum', 'radar-aeo',          'Otimiza conteúdo para ser citado por ChatGPT, Claude, Gemini e outras IAs.',                    0, 0, 0),
  ('FIGNALDO',           'UI Designer & Visual Strategist',                 '🎨', 'standby', 'criacao',    'totum', 'fignaldo',           'Design systems, interfaces digitais e UX. Conecta estética a resultados de negócio.',           0, 0, 0),
  ('ATLAS',              'Customer Success Manager',                        '🗺️', 'standby', 'comercial',  'totum', 'atlas',              'Retenção, expansão de receita e NPS. Estratégias de onboarding e redução de churn.',            0, 0, 0),
  ('AUDITOR-PAID',       'PPC Campaign Strategist & Paid Media Auditor',    '💰', 'standby', 'trafego',    'totum', 'auditor-paid',       'Auditoria e otimização de Google Ads, Meta Ads e TikTok Ads. Expert em ROAS e CPA.',            0, 0, 0),
  ('BRAND-GUARDIAN',     'Brand Guardian & Identity Consistency Manager',   '🎭', 'standby', 'marketing',  'totum', 'brand-guardian',     'Garante consistência visual e tonal da marca em todos os touchpoints.',                        0, 0, 0),
  ('CHAPLIN',            'Video Optimization Specialist',                   '🎬', 'standby', 'criacao',    'totum', 'chaplin',            'Scripts para YouTube, thumbnails de alto CTR e SEO de vídeo.',                                 0, 0, 0),
  ('COMMUNITY-BUILDER',  'Community Manager & Engagement Specialist',       '👥', 'standby', 'social',     'totum', 'community-builder',  'Constrói e gerencia comunidades online no Reddit, Discord e Slack.',                           0, 0, 0),
  ('CONTENT-STRATEGIST', 'Content Strategist & Editorial Planner',          '📋', 'standby', 'marketing',  'totum', 'content-strategist', 'Editorial calendars, pilares de conteúdo e estratégia de content marketing.',                  0, 0, 0),
  ('EMAIL-SPECIALIST',   'Email Marketing Specialist & Automation Expert',  '📧', 'standby', 'marketing',  'totum', 'email-specialist',   'Automação, segmentação e copy para email. Sequences de nutrição e flows de e-commerce.',       0, 0, 0),
  ('EXPERIMENT-TRACKER', 'A/B Testing & Experimentation Specialist',        '🧪', 'standby', 'analytics',  'totum', 'experiment-tracker', 'Desenha experimentos A/B estatisticamente válidos e constrói cultura data-driven.',            0, 0, 0),
  ('LINKEDIN-CREATOR',   'LinkedIn Content Strategist & B2B Growth',        '💼', 'standby', 'social',     'totum', 'linkedin-creator',   'Posts de alto engajamento, thought leadership e geração de leads B2B no LinkedIn.',            0, 0, 0),
  ('PRODUCT-MANAGER',    'Product Manager & Roadmap Strategist',            '🗂️', 'standby', 'tech',       'totum', 'product-manager',    'Visão de produto, priorização de features e product-led growth.',                              0, 0, 0),
  ('SOLUTIONS-CONSULTANT','Solutions Consultant & Pre-Sales Specialist',    '🧠', 'standby', 'comercial',  'totum', 'solutions-consultant','Consultoria B2B, discovery de necessidades e propostas de valor personalizadas.',              0, 0, 0),
  ('TOT-SOCIAL',         'Twitter/X Engagement Strategist',                 '🐦', 'standby', 'social',     'totum', 'tot-social',         'Threads virais, posting schedule e community building no Twitter/X.',                          0, 0, 0),
  ('VISU-ADS',           'Ad Creative Strategist & Copy Specialist',        '✏️', 'standby', 'trafego',    'totum', 'visu-ads',           'Criativos para Meta, Google e TikTok. Headlines de alto CTR e ângulos de venda persuasivos.',  0, 0, 0),
  ('ASO-SPECIALIST',     'App Store Optimization Specialist',               '📱', 'standby', 'marketing',  'totum', 'aso-specialist',     'Metadados de apps, rankings na App Store e Google Play, growth mobile.',                       0, 0, 0)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  role        = EXCLUDED.role,
  emoji       = EXCLUDED.emoji,
  category    = EXCLUDED.category,
  agent_group = EXCLUDED.agent_group,
  description = EXCLUDED.description;
