
CREATE TABLE public.action_plan_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  phase integer NOT NULL DEFAULT 1,
  phase_name text NOT NULL,
  day_start integer NOT NULL DEFAULT 1,
  day_end integer NOT NULL DEFAULT 7,
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  responsible text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.action_plan_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view action_plan_tasks"
  ON public.action_plan_tasks FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update action_plan_tasks"
  ON public.action_plan_tasks FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can manage action_plan_tasks"
  ON public.action_plan_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.action_plan_tasks;
