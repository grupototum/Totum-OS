-- Totum OS AI Command Center telemetry

CREATE TABLE IF NOT EXISTS public.agent_chat_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id text,
  agent_id text,
  agent_slug text,
  event_type text NOT NULL DEFAULT 'activity',
  status text NOT NULL DEFAULT 'done',
  summary text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_chat_events_created_at
  ON public.agent_chat_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_chat_events_agent_slug
  ON public.agent_chat_events(agent_slug);

ALTER TABLE public.agent_chat_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read agent_chat_events"
  ON public.agent_chat_events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert agent_chat_events"
  ON public.agent_chat_events FOR INSERT TO authenticated WITH CHECK (true);

COMMENT ON TABLE public.agent_chat_events IS 'Eventos resumidos do AI Command Center: contexto, skill, consultas, respostas e ações dos agentes.';
