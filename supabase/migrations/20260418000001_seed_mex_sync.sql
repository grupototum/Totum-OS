
-- Seed initial MEX sync entries so the MEX Status widget has data to display.
-- These entries reflect the current state of the MEX context system components.

INSERT INTO public.mex_sync (label, status, last_sync) VALUES
  ('Contexto Global',  'synced',  '2026-04-18'),
  ('Bot Atendente',    'synced',  '2026-04-18'),
  ('Agentes IA',       'synced',  '2026-04-18'),
  ('Context Hub',      'syncing', NULL)
ON CONFLICT DO NOTHING;
