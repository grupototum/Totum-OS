-- =====================================================
-- CORREÇÃO: Reset e Recriação das Tabelas (V3)
-- Apps Totum - Supabase
-- 
-- CHANGELOG V3:
-- - Seção de dados de exemplo COMENTADA (auth.uid() retorna NULL no SQL Editor)
-- - Execute os INSERTs manualmente via aplicação ou após login
-- =====================================================

-- =====================================================
-- 1. LIMPAR TUDO (NA ORDEM CORRETA)
-- =====================================================

-- Remover políticas de tarefas
DROP POLICY IF EXISTS "Tarefas visíveis para usuários autenticados" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser criadas por usuários autenticados" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser atualizadas pelo responsável ou criador" ON public.tarefas;
DROP POLICY IF EXISTS "Tarefas podem ser deletadas pelo criador" ON public.tarefas;

-- Remover políticas de comentarios
DROP POLICY IF EXISTS "Comentários visíveis para usuários autenticados" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser criados por usuários autenticados" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser atualizados pelo autor" ON public.comentarios_tarefa;
DROP POLICY IF EXISTS "Comentários podem ser deletados pelo autor" ON public.comentarios_tarefa;

-- Remover políticas de projetos
DROP POLICY IF EXISTS "Projetos visíveis para usuários autenticados" ON public.projetos;
DROP POLICY IF EXISTS "Projetos podem ser criados por usuários autenticados" ON public.projetos;
DROP POLICY IF EXISTS "Projetos podem ser atualizados pelo responsável" ON public.projetos;

-- Remover triggers
DROP TRIGGER IF EXISTS trigger_atualizar_tarefas_updated_at ON public.tarefas;
DROP TRIGGER IF EXISTS trigger_atualizar_projetos_updated_at ON public.projetos;
DROP TRIGGER IF EXISTS trigger_atualizar_comentarios_updated_at ON public.comentarios_tarefa;

-- Remover função
DROP FUNCTION IF EXISTS public.atualizar_updated_at();

-- Remover tabelas (em ordem: dependências primeiro)
DROP TABLE IF EXISTS public.comentarios_tarefa CASCADE;
DROP TABLE IF EXISTS public.tarefas CASCADE;
DROP TABLE IF EXISTS public.projetos CASCADE;

-- =====================================================
-- 2. RECRIAR TABELAS (SCHEMA COMPLETO)
-- =====================================================

-- TABELA: projetos
CREATE TABLE public.projetos (
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

-- TABELA: tarefas
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

-- TABELA: comentarios_tarefa
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

COMMENT ON TABLE public.comentarios_tarefa IS 'Comentários das tarefas';

-- =====================================================
-- 3. ÍNDICES
-- =====================================================
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

-- =====================================================
-- 4. RLS (ROW LEVEL SECURITY)
-- =====================================================
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_tarefa ENABLE ROW LEVEL SECURITY;

-- Políticas para projetos
CREATE POLICY "Projetos visíveis para usuários autenticados"
    ON public.projetos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Projetos podem ser criados por usuários autenticados"
    ON public.projetos FOR INSERT TO authenticated WITH CHECK (auth.uid() = responsavel_id OR responsavel_id IS NULL);

CREATE POLICY "Projetos podem ser atualizados pelo responsável"
    ON public.projetos FOR UPDATE TO authenticated USING (auth.uid() = responsavel_id OR responsavel_id IS NULL);

-- Políticas para tarefas
CREATE POLICY "Tarefas visíveis para usuários autenticados"
    ON public.tarefas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tarefas podem ser criadas por usuários autenticados"
    ON public.tarefas FOR INSERT TO authenticated WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser atualizadas pelo responsável ou criador"
    ON public.tarefas FOR UPDATE TO authenticated USING (auth.uid() = responsavel_id OR auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser deletadas pelo criador"
    ON public.tarefas FOR DELETE TO authenticated USING (auth.uid() = criado_por);

-- Políticas para comentários
CREATE POLICY "Comentários visíveis para usuários autenticados"
    ON public.comentarios_tarefa FOR SELECT TO authenticated USING (true);

CREATE POLICY "Comentários podem ser criados por usuários autenticados"
    ON public.comentarios_tarefa FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser atualizados pelo autor"
    ON public.comentarios_tarefa FOR UPDATE TO authenticated USING (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser deletados pelo autor"
    ON public.comentarios_tarefa FOR DELETE TO authenticated USING (auth.uid() = autor_id);

-- =====================================================
-- 5. REALTIME
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.projetos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tarefas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comentarios_tarefa;

-- =====================================================
-- 6. FUNÇÕES E TRIGGERS
-- =====================================================
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

-- =====================================================
-- 7. DADOS DE EXEMPLO (COMENTADOS - EXECUTAR MANUALMENTE)
-- =====================================================
-- ⚠️  IMPORTANTE: auth.uid() retorna NULL no SQL Editor
--     Execute estes INSERTs via aplicação ou após fazer login
--
-- INSERT INTO public.projetos (titulo, descricao, cor, status, prioridade)
-- VALUES 
--     ('Implementação Agentes Totum', 'Projeto de criação e integração dos agentes de IA', '#3B82F6', 'ativo', 'alta'),
--     ('Design System', 'Padronização visual do Apps Totum', '#10B981', 'ativo', 'media');
--
-- INSERT INTO public.tarefas (titulo, descricao, status, tipo, prioridade, coluna_kanban, tags, projeto_id, criado_por)
-- SELECT 
--     'Criar agente Transcritor',
--     'Implementar sistema de transcrição de vídeos local',
--     'a_fazer',
--     'feature',
--     'alta',
--     'a_fazer',
--     ARRAY['agente', 'transcricao', 'video'],
--     id,
--     auth.uid()  -- ← REQUER SESSÃO AUTENTICADA!
-- FROM public.projetos WHERE titulo = 'Implementação Agentes Totum';
-- =====================================================
