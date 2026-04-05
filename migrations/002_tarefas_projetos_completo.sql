-- =====================================================
-- MIGRAÇÃO: Criar tabelas de Tarefas e Projetos
-- Apps Totum - Supabase
-- Data: 2026-04-04
-- =====================================================

-- =====================================================
-- 1. TABELA: projetos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'arquivado')),
    cor VARCHAR(7) DEFAULT '#3B82F6', -- Hex color para identificação visual
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    data_inicio DATE,
    data_fim DATE,
    responsavel_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários da tabela
COMMENT ON TABLE public.projetos IS 'Projetos de trabalho da Totum';
COMMENT ON COLUMN public.projetos.cor IS 'Cor hexadecimal para identificação visual do projeto';

-- =====================================================
-- 2. TABELA: tarefas (DROP e RECRIAR com schema correto)
-- =====================================================

-- Primeiro, remover a tabela antiga se existir (CUIDADO: perde dados)
-- Se quiser preservar dados, fazer backup primeiro
DROP TABLE IF EXISTS public.comentarios_tarefa CASCADE;
DROP TABLE IF EXISTS public.tarefas CASCADE;

-- Criar tabela tarefas com schema completo
CREATE TABLE public.tarefas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    
    -- Status e tipo
    status VARCHAR(50) DEFAULT 'a_fazer' CHECK (status IN ('a_fazer', 'fazendo', 'revisao', 'concluida', 'arquivada')),
    tipo VARCHAR(50) DEFAULT 'tarefa' CHECK (tipo IN ('tarefa', 'bug', 'feature', 'melhoria', 'documentacao', 'pesquisa')),
    
    -- Prioridade
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    
    -- Relacionamentos
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
    responsavel_id UUID REFERENCES auth.users(id),
    criado_por UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Posicionamento (para Kanban)
    posicao INTEGER DEFAULT 0,
    coluna_kanban VARCHAR(50) DEFAULT 'a_fazer' CHECK (coluna_kanban IN ('a_fazer', 'fazendo', 'revisao', 'concluida')),
    
    -- Tags (array de strings)
    tags TEXT[] DEFAULT '{}',
    
    -- Datas
    data_inicio DATE,
    data_vencimento DATE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    
    -- Subtarefas (JSONB para flexibilidade)
    subtarefas JSONB DEFAULT '[]',
    -- Exemplo de estrutura: [{"id": "1", "titulo": "Subtarefa 1", "concluida": false}, ...]
    
    -- Anexos/Referências
    anexos TEXT[] DEFAULT '{}',
    
    -- Metadados
    tempo_estimado_minutos INTEGER,
    tempo_real_minutos INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários
COMMENT ON TABLE public.tarefas IS 'Tarefas do sistema de gestão da Totum';
COMMENT ON COLUMN public.tarefas.posicao IS 'Posição ordinal para ordenação no Kanban';
COMMENT ON COLUMN public.tarefas.subtarefas IS 'Array JSON de subtarefas com id, titulo, concluida';
COMMENT ON COLUMN public.tarefas.tags IS 'Array de tags para categorização';

-- =====================================================
-- 3. TABELA: comentarios_tarefa
-- =====================================================
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

-- =====================================================
-- 4. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices em tarefas
CREATE INDEX idx_tarefas_projeto_id ON public.tarefas(projeto_id);
CREATE INDEX idx_tarefas_status ON public.tarefas(status);
CREATE INDEX idx_tarefas_responsavel ON public.tarefas(responsavel_id);
CREATE INDEX idx_tarefas_data_vencimento ON public.tarefas(data_vencimento);
CREATE INDEX idx_tarefas_coluna_kanban ON public.tarefas(coluna_kanban);
CREATE INDEX idx_tarefas_posicao ON public.tarefas(posicao);
CREATE INDEX idx_tarefas_tags ON public.tarefas USING GIN(tags);

-- Índices em comentarios
CREATE INDEX idx_comentarios_tarefa_id ON public.comentarios_tarefa(tarefa_id);
CREATE INDEX idx_comentarios_autor ON public.comentarios_tarefa(autor_id);

-- Índices em projetos
CREATE INDEX idx_projetos_status ON public.projetos(status);
CREATE INDEX idx_projetos_responsavel ON public.projetos(responsavel_id);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios_tarefa ENABLE ROW LEVEL SECURITY;

-- Políticas para projetos
CREATE POLICY "Projetos visíveis para usuários autenticados"
    ON public.projetos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Projetos podem ser criados por usuários autenticados"
    ON public.projetos FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = responsavel_id OR responsavel_id IS NULL);

CREATE POLICY "Projetos podem ser atualizados pelo responsável"
    ON public.projetos FOR UPDATE
    TO authenticated
    USING (auth.uid() = responsavel_id OR responsavel_id IS NULL);

-- Políticas para tarefas
CREATE POLICY "Tarefas visíveis para usuários autenticados"
    ON public.tarefas FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Tarefas podem ser criadas por usuários autenticados"
    ON public.tarefas FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser atualizadas pelo responsável ou criador"
    ON public.tarefas FOR UPDATE
    TO authenticated
    USING (auth.uid() = responsavel_id OR auth.uid() = criado_por);

CREATE POLICY "Tarefas podem ser deletadas pelo criador"
    ON public.tarefas FOR DELETE
    TO authenticated
    USING (auth.uid() = criado_por);

-- Políticas para comentários
CREATE POLICY "Comentários visíveis para usuários autenticados"
    ON public.comentarios_tarefa FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Comentários podem ser criados por usuários autenticados"
    ON public.comentarios_tarefa FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser atualizados pelo autor"
    ON public.comentarios_tarefa FOR UPDATE
    TO authenticated
    USING (auth.uid() = autor_id);

CREATE POLICY "Comentários podem ser deletados pelo autor"
    ON public.comentarios_tarefa FOR DELETE
    TO authenticated
    USING (auth.uid() = autor_id);

-- =====================================================
-- 6. REALTIME (ALTERAÇÕES EM TEMPO REAL)
-- =====================================================

-- Adicionar tabelas ao publication do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.projetos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tarefas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comentarios_tarefa;

-- =====================================================
-- 7. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION public.atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER trigger_atualizar_projetos_updated_at
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_updated_at();

CREATE TRIGGER trigger_atualizar_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_updated_at();

CREATE TRIGGER trigger_atualizar_comentarios_updated_at
    BEFORE UPDATE ON public.comentarios_tarefa
    FOR EACH ROW
    EXECUTE FUNCTION public.atualizar_updated_at();

-- =====================================================
-- 8. DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir projeto de exemplo
INSERT INTO public.projetos (titulo, descricao, cor, status, prioridade)
VALUES 
    ('Implementação Agentes Totum', 'Projeto de criação e integração dos agentes de IA', '#3B82F6', 'ativo', 'alta'),
    ('Design System', 'Padronização visual do Apps Totum', '#10B981', 'ativo', 'media');

-- Inserir tarefas de exemplo
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

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
