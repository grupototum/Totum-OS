
-- VPS usage history (hourly snapshots)
CREATE TABLE public.vps_usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vps_name text NOT NULL,
  ram integer NOT NULL DEFAULT 0,
  cpu integer NOT NULL DEFAULT 0,
  disk integer NOT NULL DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vps_usage_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view vps_usage_history" ON public.vps_usage_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vps_usage_history" ON public.vps_usage_history FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Cost history (monthly)
CREATE TABLE public.cost_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  ia numeric NOT NULL DEFAULT 0,
  tools numeric NOT NULL DEFAULT 0,
  hosting numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.cost_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view cost_history" ON public.cost_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage cost_history" ON public.cost_history FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Activity stats (daily)
CREATE TABLE public.activity_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  requests integer NOT NULL DEFAULT 0,
  messages integer NOT NULL DEFAULT 0,
  deployments integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.activity_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view activity_stats" ON public.activity_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage activity_stats" ON public.activity_stats FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
