-- =====================================================
-- CORREÇÃO: Adicionar colunas apenas se não existirem
-- Plano de Ação + Agentes - Tabela Tarefas
-- =====================================================

-- Adicionar coluna milestone_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'milestone_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN milestone_id UUID REFERENCES public.milestones(id);
    END IF;
END $$;

-- Adicionar coluna tipo se não existir (com constraint)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'tipo') THEN
        ALTER TABLE public.tarefas ADD COLUMN tipo VARCHAR(20) DEFAULT 'usuario';
        ALTER TABLE public.tarefas ADD CONSTRAINT check_tarefa_tipo 
            CHECK (tipo IN ('usuario', 'agente', 'sistema'));
    END IF;
END $$;

-- Adicionar coluna responsavel se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'responsavel') THEN
        ALTER TABLE public.tarefas ADD COLUMN responsavel VARCHAR(50) DEFAULT 'Israel';
    END IF;
END $$;

-- Adicionar coluna agente_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'agente_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN agente_id VARCHAR(50);
    END IF;
END $$;

-- Adicionar coluna recorrencia se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'recorrencia') THEN
        ALTER TABLE public.tarefas ADD COLUMN recorrencia VARCHAR(20);
    END IF;
END $$;

-- Adicionar coluna horario_execucao se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'horario_execucao') THEN
        ALTER TABLE public.tarefas ADD COLUMN horario_execucao TIME;
    END IF;
END $$;

-- Adicionar coluna params se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'params') THEN
        ALTER TABLE public.tarefas ADD COLUMN params JSONB DEFAULT '{}';
    END IF;
END $$;

-- Adicionar coluna progresso se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'progresso') THEN
        ALTER TABLE public.tarefas ADD COLUMN progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100);
    END IF;
END $$;

-- Adicionar coluna dependencias se não existir (array de UUIDs)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'dependencias') THEN
        ALTER TABLE public.tarefas ADD COLUMN dependencias UUID[] DEFAULT '{}';
    END IF;
END $$;

-- =====================================================
-- CRIAR TABELA MILESTONES (se não existir)
-- =====================================================
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários
COMMENT ON TABLE public.milestones IS 'Milestones/Projetos para agrupar tarefas (Plano de Ação, Projetos, Sprints)';

-- Índices para milestones
CREATE INDEX IF NOT EXISTS idx_milestones_status ON public.milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_tipo ON public.milestones(tipo);
CREATE INDEX IF NOT EXISTS idx_tarefas_milestone_id ON public.tarefas(milestone_id) WHERE milestone_id IS NOT NULL;

-- RLS para milestones
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Milestones visíveis para usuários autenticados"
    ON public.milestones FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Milestones podem ser criados por usuários autenticados"
    ON public.milestones FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY IF NOT EXISTS "Milestones podem ser atualizados pelo criador"
    ON public.milestones FOR UPDATE TO authenticated USING (auth.uid() = created_by OR created_by IS NULL);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_atualizar_milestones_updated_at
    BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;

-- =====================================================
-- CRIAR MILESTONE "PLANO DE AÇÃO 2025" (exemplo)
-- =====================================================
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

-- =====================================================
-- ATUALIZAR TAREFAS EXISTENTES
-- =====================================================
-- Colocar tarefas existentes no milestone "Plano de Ação"
UPDATE public.tarefas 
SET milestone_id = (SELECT id FROM public.milestones WHERE titulo = 'Plano de Ação 2025' LIMIT 1)
WHERE milestone_id IS NULL;

-- Marcar tarefas existentes como tipo 'usuario' se estiverem vazias
UPDATE public.tarefas SET tipo = 'usuario' WHERE tipo IS NULL;
UPDATE public.tarefas SET responsavel = 'Israel' WHERE responsavel IS NULL OR responsavel = '';
