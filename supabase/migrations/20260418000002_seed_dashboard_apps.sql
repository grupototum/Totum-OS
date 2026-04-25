-- Seed dashboard_apps with the Totum ecosystem apps
INSERT INTO dashboard_apps (name, status, icon, description, sort_order)
VALUES
  ('Apps Totum',     'online',  '🌐', 'Plataforma principal',          1),
  ('Supabase DB',    'online',  '🗄️', 'PostgreSQL + Realtime',         2),
  ('Agentes IA',     'online',  '🤖', 'ElizaOS + Claude',              3),
  ('Alexandria RAG', 'online',  '📚', 'Base de conhecimento',          4),
  ('VPS 7GB',        'online',  '🖥️', 'Servidor principal Alibaba',    5),
  ('VPS KVM4',       'online',  '💻', 'Servidor secundário',           6),
  ('GitHub CI/CD',   'online',  '🔄', 'Deploy automático Vercel',      7),
  ('Ollama LLM',     'standby', '🧠', 'IA local (HTTP only)',          8)
ON CONFLICT DO NOTHING;
