
-- Create logs_execucao_agente table
CREATE TABLE IF NOT EXISTS public.logs_execucao_agente (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tarefa_id uuid REFERENCES public.tarefas(id) ON DELETE CASCADE,
  agente_id text NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  resultado text,
  erro text,
  duracao_ms integer,
  iniciado_em timestamp with time zone DEFAULT now(),
  finalizado_em timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.logs_execucao_agente ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can view logs" ON public.logs_execucao_agente
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert logs" ON public.logs_execucao_agente
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can manage logs" ON public.logs_execucao_agente
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs_execucao_agente;

-- Add execution columns to tarefas
ALTER TABLE public.tarefas
  ADD COLUMN IF NOT EXISTS proxima_execucao timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ultima_execucao timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ultimo_resultado text;
