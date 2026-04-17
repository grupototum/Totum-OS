CREATE TABLE IF NOT EXISTS public.pops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  departamento TEXT NOT NULL DEFAULT 'Geral',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','deprecated')),
  sla_horas INTEGER DEFAULT 24,
  responsavel TEXT,
  versao TEXT DEFAULT '1.0',
  conteudo TEXT,
  tags TEXT[] DEFAULT '{}',
  criado_por TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read pops" ON public.pops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert pops" ON public.pops FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update pops" ON public.pops FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete pops" ON public.pops FOR DELETE TO authenticated USING (true);

-- Seed data
INSERT INTO public.pops (titulo, departamento, status, sla_horas, responsavel, descricao) VALUES
('Onboarding de Novos Clientes', 'Operações', 'approved', 48, 'Israel', 'Processo completo de integração de novos clientes à plataforma Totum.'),
('Procedimento de Vendas B2B', 'Comercial', 'approved', 24, 'Time Comercial', 'Fluxo de qualificação, proposta e fechamento de clientes B2B.'),
('Criação de Campanha Social', 'Marketing', 'review', 8, 'Pablo (Agente)', 'Workflow automatizado de criação e publicação de conteúdo nas redes.'),
('Deploy em Produção', 'Tecnologia', 'approved', 4, 'Israel', 'Checklist de segurança e procedimentos para deploy em ambiente de produção.'),
('Processo de Recrutamento', 'RH', 'draft', 72, 'Gestão', 'Triagem, entrevista e onboarding de novos membros do time.')
ON CONFLICT DO NOTHING;
