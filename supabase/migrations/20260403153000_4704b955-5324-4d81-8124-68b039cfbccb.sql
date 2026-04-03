
-- Create tarefas table
CREATE TABLE public.tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  responsavel TEXT,
  prioridade TEXT NOT NULL DEFAULT 'media',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage tarefas"
ON public.tarefas
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view all tarefas
CREATE POLICY "Authenticated users can view tarefas"
ON public.tarefas
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert tarefas
CREATE POLICY "Authenticated users can insert tarefas"
ON public.tarefas
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update tarefas
CREATE POLICY "Authenticated users can update tarefas"
ON public.tarefas
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tarefas;
