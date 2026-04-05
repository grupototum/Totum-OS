-- ============================================================
-- TABELA DE LOGS DE EXECUÇÃO DOS AGENTES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.logs_execucao_agente (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tarefa_id UUID REFERENCES public.tarefas(id) ON DELETE CASCADE,
    agente_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('sucesso', 'erro', 'executando')),
    mensagem TEXT,
    output JSONB DEFAULT '{}',
    iniciado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    finalizado_em TIMESTAMP WITH TIME ZONE,
    duracao_segundos INTEGER
);

-- Comentários
COMMENT ON TABLE public.logs_execucao_agente IS 'Logs de execução das tarefas dos agentes';

-- Índices
CREATE INDEX IF NOT EXISTS idx_logs_execucao_tarefa ON public.logs_execucao_agente(tarefa_id);
CREATE INDEX IF NOT EXISTS idx_logs_execucao_agente ON public.logs_execucao_agente(agente_id);
CREATE INDEX IF NOT EXISTS idx_logs_execucao_status ON public.logs_execucao_agente(status);
CREATE INDEX IF NOT EXISTS idx_logs_execucao_data ON public.logs_execucao_agente(iniciado_em DESC);

-- RLS
ALTER TABLE public.logs_execucao_agente ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Logs visíveis para usuários autenticados" ON public.logs_execucao_agente;
CREATE POLICY "Logs visíveis para usuários autenticados"
    ON public.logs_execucao_agente FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Logs podem ser criados por usuários autenticados" ON public.logs_execucao_agente;
CREATE POLICY "Logs podem ser criados por usuários autenticados"
    ON public.logs_execucao_agente FOR INSERT TO authenticated WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs_execucao_agente;

-- Atualizar tabela tarefas para garantir colunas de agente
DO $$
BEGIN
    -- proxima_execucao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'proxima_execucao') THEN
        ALTER TABLE public.tarefas ADD COLUMN proxima_execucao TIMESTAMP WITH TIME ZONE;
    END IF;

    -- ultima_execucao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'ultima_execucao') THEN
        ALTER TABLE public.tarefas ADD COLUMN ultima_execucao TIMESTAMP WITH TIME ZONE;
    END IF;

    -- ultimo_resultado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'ultimo_resultado') THEN
        ALTER TABLE public.tarefas ADD COLUMN ultimo_resultado JSONB DEFAULT '{}';
    END IF;
END $$;
