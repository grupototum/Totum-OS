
-- VPS Servers
CREATE TABLE public.vps_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'online',
  ram integer NOT NULL DEFAULT 0,
  cpu integer NOT NULL DEFAULT 0,
  disk integer NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.vps_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view vps_servers" ON public.vps_servers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vps_servers" ON public.vps_servers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Apps
CREATE TABLE public.dashboard_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'standby',
  icon text DEFAULT '📱',
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.dashboard_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view dashboard_apps" ON public.dashboard_apps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage dashboard_apps" ON public.dashboard_apps FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Agents
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'standby',
  tasks integer NOT NULL DEFAULT 0,
  emoji text DEFAULT '🤖',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view agents" ON public.agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage agents" ON public.agents FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Costs
CREATE TABLE public.dashboard_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  month text NOT NULL DEFAULT to_char(now(), 'YYYY-MM'),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.dashboard_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view dashboard_costs" ON public.dashboard_costs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage dashboard_costs" ON public.dashboard_costs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Activities
CREATE TABLE public.dashboard_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.dashboard_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view dashboard_activities" ON public.dashboard_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage dashboard_activities" ON public.dashboard_activities FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- MEX Sync
CREATE TABLE public.mex_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  status text NOT NULL DEFAULT 'synced',
  last_sync text DEFAULT 'agora',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.mex_sync ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view mex_sync" ON public.mex_sync FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage mex_sync" ON public.mex_sync FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- GitHub config
CREATE TABLE public.github_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'connected',
  repo text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.github_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view github_config" ON public.github_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage github_config" ON public.github_config FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
