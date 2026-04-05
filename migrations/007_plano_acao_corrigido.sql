-- ============================================================
-- CORREÇÃO: SQL com trigger compatível
-- ============================================================

-- 1. TABELA MILESTONES (com coluna atualizado_em para compatibilidade)
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) DEFAULT 'plano_acao' CHECK (tipo IN ('plano_acao', 'projeto', 'sprint', 'campanha')),
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'arquivado', 'pausado')),
    data_inicio DATE,
    data_fim DATE,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.milestones IS 'Milestones para agrupar tarefas (Plano de Ação, Projetos)';

-- Índices
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_tipo ON public.milestones(tipo);

-- RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Milestones visíveis para usuários autenticados" ON public.milestones;
CREATE POLICY "Milestones visíveis para usuários autenticados"
    ON public.milestones FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Milestones podem ser criados por usuários autenticados" ON public.milestones;
CREATE POLICY "Milestones podem ser criados por usuários autenticados"
    ON public.milestones FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Milestones podem ser atualizados" ON public.milestones;
CREATE POLICY "Milestones podem ser atualizados"
    ON public.milestones FOR UPDATE TO authenticated USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;

-- 2. COLUNAS NA TABELA TAREFAS (adicionar só se não existir)
DO $$
BEGIN
    -- milestone_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'milestone_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN milestone_id UUID REFERENCES public.milestones(id);
    END IF;

    -- data_inicio (para Gantt)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'data_inicio') THEN
        ALTER TABLE public.tarefas ADD COLUMN data_inicio DATE;
    END IF;

    -- data_fim (para Gantt)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'data_fim') THEN
        ALTER TABLE public.tarefas ADD COLUMN data_fim DATE;
    END IF;

    -- progresso (0-100)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'progresso') THEN
        ALTER TABLE public.tarefas ADD COLUMN progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100);
    END IF;

    -- dependencias (array de UUIDs)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'dependencias') THEN
        ALTER TABLE public.tarefas ADD COLUMN dependencias UUID[] DEFAULT '{}';
    END IF;

    -- agente_id (se for tarefa de agente)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'agente_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN agente_id VARCHAR(50);
    END IF;

    -- recorrencia (diaria, semanal, mensal)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'recorrencia') THEN
        ALTER TABLE public.tarefas ADD COLUMN recorrencia VARCHAR(20);
    END IF;

    -- horario_execucao (para agentes)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'horario_execucao') THEN
        ALTER TABLE public.tarefas ADD COLUMN horario_execucao TIME;
    END IF;

    -- params (JSON para configuração de agentes)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'params') THEN
        ALTER TABLE public.tarefas ADD COLUMN params JSONB DEFAULT '{}';
    END IF;
END $$;

-- Índice para milestone_id
CREATE INDEX IF NOT EXISTS idx_tarefas_milestone_id ON public.tarefas(milestone_id) WHERE milestone_id IS NOT NULL;

-- 3. FUNÇÃO DE TRIGGER CORRIGIDA (verifica se coluna existe)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Tenta atualizar 'atualizado_em' se existir
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = TG_TABLE_NAME AND column_name = 'atualizado_em') THEN
        NEW.atualizado_em = timezone('utc'::text, now());
    END IF;
    
    -- Tenta atualizar 'updated_at' se existir
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = TG_TABLE_NAME AND column_name = 'updated_at') THEN
        NEW.updated_at = timezone('utc'::text, now());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para milestones
DROP TRIGGER IF EXISTS trigger_atualizar_milestones_updated_at ON public.milestones;
CREATE TRIGGER trigger_atualizar_milestones_updated_at
    BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. CRIAR MILESTONE "PLANO DE AÇÃO 2025"
INSERT INTO public.milestones (titulo, descricao, tipo, status, data_inicio, cor)
VALUES (
    'Plano de Ação 2025',
    'Milestone principal para organização de todas as tarefas da Totum',
    'plano_acao',
    'ativo',
    CURRENT_DATE,
    '#3B82F6'
)
ON CONFLICT DO NOTHING;

-- 5. MIGRAR TAREFAS EXISTENTES PARA O MILESTONE
UPDATE public.tarefas 
SET milestone_id = (SELECT id FROM public.milestones WHERE titulo = 'Plano de Ação 2025' LIMIT 1)
WHERE milestone_id IS NULL;

-- 6. ATUALIZAR VALORES DEFAULT
UPDATE public.tarefas SET tipo = 'unica' WHERE tipo IS NULL;
UPDATE public.tarefas SET responsavel = 'Israel' WHERE responsavel IS NULL OR responsavel = '';
UPDATE public.tarefas SET progresso = 0 WHERE progresso IS NULL;
UPDATE public.tarefas SET dependencias = '{}' WHERE dependencias IS NULL;
