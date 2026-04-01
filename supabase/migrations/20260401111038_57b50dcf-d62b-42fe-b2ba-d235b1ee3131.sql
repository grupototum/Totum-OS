
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Step 1: Basic data
  company_name text NOT NULL,
  cnpj text,
  contact_name text,
  email text,
  phone text,
  website text,
  -- Step 2: Business context
  industry text,
  business_description text,
  products_services text,
  time_in_market text,
  company_size text,
  monthly_revenue text,
  -- Step 3: Target audience
  main_niche text,
  main_pains text,
  desires text,
  age_min integer DEFAULT 18,
  age_max integer DEFAULT 65,
  gender text DEFAULT 'both',
  location text,
  social_class text,
  brand_tone text,
  -- Step 4: Visual identity
  logo_url text,
  primary_color text DEFAULT '#f76926',
  secondary_color text DEFAULT '#1a1a2e',
  fonts text,
  visual_elements text,
  visual_personality text,
  -- Step 5: Operational
  support_channels text[] DEFAULT '{}',
  crm_used text,
  sla_response text,
  business_hours_start text,
  business_hours_end text,
  working_days text[] DEFAULT '{}'::text[],
  additional_info text,
  terms_accepted boolean DEFAULT false,
  -- Meta
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients"
  ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own clients"
  ON public.clients FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own clients"
  ON public.clients FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all clients"
  ON public.clients FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
