
-- Hosting Clients
CREATE TABLE public.hosting_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  domain TEXT,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  monthly_value NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pendente',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hosting_clients" ON public.hosting_clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view hosting_clients" ON public.hosting_clients FOR SELECT TO authenticated
  USING (true);

-- Hosting Subdomains
CREATE TABLE public.hosting_subdomains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.hosting_clients(id) ON DELETE CASCADE NOT NULL,
  subdomain TEXT NOT NULL,
  base_domain TEXT NOT NULL DEFAULT 'grupototum.com',
  full_url TEXT GENERATED ALWAYS AS (subdomain || '.' || base_domain) STORED,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_subdomains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hosting_subdomains" ON public.hosting_subdomains FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view hosting_subdomains" ON public.hosting_subdomains FOR SELECT TO authenticated
  USING (true);

-- Hosting Containers
CREATE TABLE public.hosting_containers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  port INTEGER,
  container_type TEXT DEFAULT 'app',
  status TEXT NOT NULL DEFAULT 'running',
  health_check_url TEXT,
  last_health_check TIMESTAMPTZ,
  last_restart TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_containers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hosting_containers" ON public.hosting_containers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view hosting_containers" ON public.hosting_containers FOR SELECT TO authenticated
  USING (true);

-- Hosting Billing
CREATE TABLE public.hosting_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.hosting_clients(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente',
  paid_at TIMESTAMPTZ,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hosting_billing" ON public.hosting_billing FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view hosting_billing" ON public.hosting_billing FOR SELECT TO authenticated
  USING (true);

-- Hosting Audit Log
CREATE TABLE public.hosting_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT,
  action TEXT NOT NULL,
  target TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hosting_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage hosting_audit_log" ON public.hosting_audit_log FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can view hosting_audit_log" ON public.hosting_audit_log FOR SELECT TO authenticated
  USING (true);
