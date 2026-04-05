-- Migração: Sistema Completo de Quadro de Tarefas
-- Cria/Atualiza as tabelas necessárias para o sistema de Kanban

-- ============================================
-- 1. TABELA DE PROJETOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT DEFAULT '#78716C',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 2. ATUALIZAR TABELA TAREFAS
-- ============================================

-- Adicionar coluna projeto_id (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'projeto_id') THEN
        ALTER TABLE public.tarefas ADD COLUMN projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Adicionar coluna subtarefas (JSONB) - armazena array de subtarefas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'subtarefas') THEN
        ALTER TABLE public.tarefas ADD COLUMN subtarefas JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Adicionar coluna tags (JSONB) - armazena array de tags
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'tags') THEN
        ALTER TABLE public.tarefas ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Adicionar coluna tipo (unica/projeto)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'tipo') THEN
        ALTER TABLE public.tarefas ADD COLUMN tipo TEXT DEFAULT 'unica' CHECK (tipo IN ('unica', 'projeto'));
    END IF;
END $$;

-- Adicionar coluna posicao (para ordenação no kanban)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'posicao') THEN
        ALTER TABLE public.tarefas ADD COLUMN posicao INTEGER DEFAULT 0;
    END IF;
END $$;

-- Adicionar coluna data_limite (se deadline não existir, senão renomear)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'data_limite') THEN
        -- Se existe deadline, renomear
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'deadline') THEN
            ALTER TABLE public.tarefas RENAME COLUMN deadline TO data_limite;
        ELSE
            ALTER TABLE public.tarefas ADD COLUMN data_limite TIMESTAMP WITH TIME ZONE;
        END IF;
    END IF;
END $$;

-- Adicionar coluna criado_por
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'tarefas' AND column_name = 'criado_por') THEN
        ALTER TABLE public.tarefas ADD COLUMN criado_por UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- ============================================
-- 3. TABELA DE COMENTÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.comentarios_tarefa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tarefa_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
    autor TEXT NOT NULL DEFAULT 'Usuário',
    conteudo TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 4. INDEXES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tarefas_projeto_id ON public.tarefas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_posicao ON public.tarefas(posicao);
CREATE INDEX IF NOT EXISTS idx_tarefas_tipo ON public.tarefas(tipo);
CREATE INDEX IF NOT EXISTS idx_comentarios_tarefa_id ON public.comentarios_tarefa(tarefa_id);

-- ============================================
-- 5. POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_tarefa ENABLE ROW LEVEL SECURITY;

-- Políticas para projetos (permitir acesso autenticado)
CREATE POLICY "Allow authenticated read projetos"
    ON public.projetos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert projetos"
    ON public.projetos FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update projetos"
    ON public.projetos FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete projetos"
    ON public.projetos FOR DELETE
    TO authenticated
    USING (true);

-- Políticas para comentários
CREATE POLICY "Allow authenticated read comentarios"
    ON public.comentarios_tarefa FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert comentarios"
    ON public.comentarios_tarefa FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update comentarios"
    ON public.comentarios_tarefa FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete comentarios"
    ON public.comentarios_tarefa FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- 6. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para tarefas
DROP TRIGGER IF EXISTS update_tarefas_updated_at ON public.tarefas;
CREATE TRIGGER update_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para projetos
DROP TRIGGER IF EXISTS update_projetos_updated_at ON public.projetos;
CREATE TRIGGER update_projetos_updated_at
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. DADOS INICIAIS (OPCIONAL)
-- ============================================
-- Criar alguns projetos de exemplo (se não existirem)
INSERT INTO public.projetos (nome, descricao, cor)
SELECT * FROM (VALUES
    ('Website Totum', 'Desenvolvimento do novo site', '#3B82F6'),
    ('Sistema de Agentes', 'Plataforma de agentes IA', '#8B5CF6'),
    ('CRM Interno', 'Sistema de gestão de clientes', '#10B981')
) AS v(nome, descricao, cor)
WHERE NOT EXISTS (SELECT 1 FROM public.projetos LIMIT 1);
