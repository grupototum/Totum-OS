-- =====================================================
-- DIAGNÓSTICO: Verificar estado atual das tabelas
-- Execute isso primeiro no SQL Editor do Supabase
-- =====================================================

-- 1. Verificar se as tabelas existem
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tarefas', 'projetos', 'comentarios_tarefa');

-- 2. Se a tabela tarefas existe, ver suas colunas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tarefas';

-- 3. Verificar se há constraints/checks na tabela tarefas
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.tarefas'::regclass;

-- 4. Verificar RLS (Row Level Security)
SELECT 
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname IN ('tarefas', 'projetos', 'comentarios_tarefa');

-- =====================================================
-- SOLUÇÃO: Remover tudo e recriar do zero
-- ⚠️ CUIDADO: Isso vai apagar TODOS os dados!
-- =====================================================

-- Desabilitar RLS temporariamente (para evitar conflitos)
ALTER TABLE IF EXISTS public.comentarios_tarefa DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tarefas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projetos DISABLE ROW LEVEL SECURITY;

-- Remover políticas se existirem
DROP POLICY IF EXISTS "Tarefas visíveis para usuários autenticados" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser criadas por usuários autenticados" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser atualizadas pelo responsável ou criador" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser deletadas pelo criador" ON public.tarefas;
DROP POLICY IF EXISTS "Comentários visíveis para usuários autenticados" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser criados por usuários autenticados" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser atualizados pelo autor" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser deletados pelo autor" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Projetos visíveis para usuários autenticados" ON public.projetos;
DROP POLICY IF EXISTS "Projetos podem ser criados por usuários autenticados" ON public.projetos;
DROP POLICY IF EXISTS "Projetos podem ser atualizados pelo responsável" ON public.projetos;

-- Remover triggers
DROP TRIGGER IF EXISTS trigger_atualizar_tarefas_updated_at ON public.tarefas;
DROP TRIGGER IF EXISTS trigger_atualizar_projetos_updated_at ON public.projetos;
DROP TRIGGER IF EXISTS trigger_atualizar_comentarios_updated_at ON public.comentarios_tarefa;

-- Remover função
DROP FUNCTION IF EXISTS public.atualizar_updated_at();

-- Remover tabelas em cascata (com cuidado!)
DROP TABLE IF EXISTS public.comentarios_tarefa CASCADE;
DROP TABLE IF EXISTS public.tarefas CASCADE;
DROP TABLE IF EXISTS public.projetos CASCADE;

-- Remover do realtime
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.tarefas;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.projetos;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.comentarios_tarefa;

-- =====================================================
-- AGORA RECRIAR TUDO (SQL original)
-- =====================================================

-- 1. TABELA: projetos
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'arquivado')),
    cor VARCHAR(7) DEFAULT '#3B82F6',
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    data_inicio DATE,
    data_fim DATE,
    responsavel_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.projetos IS 'Projetos de trabalho da Totum';
COMMENT ON COLUMN public.projetos.cor IS 'Cor hexadecimal para identificação visual do projeto';

-- 2. TABELA: tarefas
CREATE TABLE public.tarefas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'a_fazer' CHECK (status IN ('a_fazer', 'fazendo', 'revisao', 'concluida', 'arquivada')),
    tipo VARCHAR(50) DEFAULT 'tarefa' CHECK (tipo IN ('tarefa', 'bug', 'feature', 'melhoria', 'documentacao', 'pesquisa')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
    responsavel_id UUID REFERENCES auth.users(id),
    criado_por UUID REFERENCES auth.users(id) NOT NULL,
    posicao INTEGER DEFAULT 0,
    coluna_kanban VARCHAR(50) DEFAULT 'a_fazer' CHECK (coluna_kanban IN ('a_fazer', 'fazendo', 'revisao', 'concluida')),
    tags TEXT[] DEFAULT '{}',
    data_inicio DATE,
    data_vencimento DATE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    subtarefas JSONB DEFAULT '[]',
    anexos TEXT[] DEFAULT '{}',
    tempo_estimado_minutos INTEGER,
    tempo_real_minutos INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.tarefas IS 'Tarefas do sistema de gestão da Totum';
COMMENT ON COLUMN public.tarefas.posicao IS 'Posição ordinal para ordenação no Kanban';
COMMENT ON COLUMN public.tarefas.subtarefas IS 'Array JSON de subtarefas com id, titulo, concluida';
COMMENT ON COLUMN public.tarefas.tags IS 'Array de tags para categorização';

-- 3. TABELA: comentarios_tarefa
CREATE TABLE public.comentarios_tarefa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tarefa_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES auth.users(id),
    conteudo TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'comentario' CHECK (tipo IN ('comentario', 'atualizacao_status', 'mencao')),
    anexos TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.comentarios_tarefa IS 'Comentários e histórico de atualizações das tarefas';

-- 4. ÍNDICES
CREATE INDEX idx_tarefas_projeto_id ON public.tarefas(projeto_id);
CREATE INDEX idx_tarefas_status ON public.tarefas(status);
CREATE INDEX idx_tarefas_responsavel ON public.tarefas(responsavel_id);
CREATE INDEX idx_tarefas_data_vencimento ON public.tarefas(data_vencimento);
CREATE INDEX idx_tarefas_coluna_kanban ON public.tarefas(coluna_kanban);
CREATE INDEX idx_tarefas_posicao ON public.tarefas(posicao);
CREATE INDEX idx_tarefas_tags ON public.tarefas USING GIN(tags);
CREATE INDEX idx_comentarios_tarefa_id ON public.comentarios_tarefa(tarefa_id);
CREATE INDEX idx_comentarios_autor ON public.comentarios_tarefa(autor_id);
CREATE INDEX idx_projetos_status ON public.projetos(status);
CREATE INDEX idx_projetos_responsavel ON public.projetos(responsavel_id);

-- 5. RLS
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_tarefa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projetos visíveis para usuários autenticados"
    ON public.projetos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Projetos podem ser criados por usuários autenticados"
    ON public.projetos FOR INSERT TO authenticated WITH CHECK (auth.uid() = responsavel_id OR responsavel_id IS NULL);

CREATE POLICY "Projetos podem ser atualizados pelo responsável"
    ON public.projetos FOR UPDATE TO authenticated USING (auth.uid() = responsavel_id OR responsavel_id IS NULL);

CREATE POLICY "Tarefas visíveis para usuários autenticados"
    ON public.tarefas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tarefas podem ser criadas por usuários autenticados"
    ON public.tarefas FOR INSERT TO authenticated WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser atualizadas pelo responsável ou criador"
    ON public.tarefas FOR UPDATE TO authenticated USING (auth.uid() = responsavel_id OR auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser deletadas pelo criador"
    ON public.tarefas FOR DELETE TO authenticated USING (auth.uid() = criado_por);

CREATE POLICY "Comentários visíveis para usuários autenticados"
    ON public.comentarios_tarefa FOR SELECT TO authenticated USING (true);

CREATE POLICY "Comentários podem ser criados por usuários autenticados"
    ON public.comentarios_tarefa FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser atualizados pelo autor"
    ON public.comentarios_tarefa FOR UPDATE TO authenticated USING (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser deletados pelo autor"
    ON public.comentarios_tarefa FOR DELETE TO authenticated USING (auth.uid() = autor_id);

-- 6. REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.projetos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tarefas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comentarios_tarefa;

-- 7. FUNÇÕES E TRIGGERS
CREATE OR REPLACE FUNCTION public.atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_projetos_updated_at
    BEFORE UPDATE ON public.projetos FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();

CREATE TRIGGER trigger_atualizar_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();

CREATE TRIGGER trigger_atualizar_comentarios_updated_at
    BEFORE UPDATE ON public.comentarios_tarefa FOR EACH ROW EXECUTE FUNCTION public.atualizar_updated_at();

-- 8. DADOS DE EXEMPLO
INSERT INTO public.projetos (titulo, descricao, cor, status, prioridade)
VALUES 
    ('Implementação Agentes Totum', 'Projeto de criação e integração dos agentes de IA', '#3B82F6', 'ativo', 'alta'),
    ('Design System', 'Padronização visual do Apps Totum', '#10B981', 'ativo', 'media');

INSERT INTO public.tarefas (titulo, descricao, status, tipo, prioridade, coluna_kanban, tags, projeto_id)
SELECT 
    'Criar agente Transcritor',
    'Implementar sistema de transcrição de vídeos local',
    'a_fazer',
    'feature',
    'alta',
    'a_fazer',
    ARRAY['agente', 'transcricao', 'video'],
    id
FROM public.projetos WHERE titulo = 'Implementação Agentes Totum';
