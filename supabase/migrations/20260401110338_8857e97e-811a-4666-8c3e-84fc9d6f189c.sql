
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS category text DEFAULT 'geral';
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS success_rate numeric DEFAULT 0;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS daily_tasks integer DEFAULT 0;

CREATE TABLE public.agent_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  interactions integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view agent_interactions"
  ON public.agent_interactions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage agent_interactions"
  ON public.agent_interactions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_interactions;
