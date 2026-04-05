-- ============================================
-- Tabela: tarefas
-- Descrição: Sistema de gerenciamento de tarefas do Apps Totum
-- Criado em: 2026-04-04
-- ============================================

-- Criar enum para status (opcional - pode usar text com check constraint)
-- CREATE TYPE status_tarefa AS ENUM ('pendente', 'em_andamento', 'concluida');
-- CREATE TYPE prioridade_tarefa AS ENUM ('baixa', 'media', 'alta', 'critica');

-- Criar tabela tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
    responsavel TEXT,
    prioridade TEXT NOT NULL DEFAULT 'media'
        CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários nas colunas
COMMENT ON TABLE public.tarefas IS 'Tabela de tarefas do sistema Totum';
COMMENT ON COLUMN public.tarefas.id IS 'Identificador único da tarefa (UUID)';
COMMENT ON COLUMN public.tarefas.titulo IS 'Título da tarefa';
COMMENT ON COLUMN public.tarefas.descricao IS 'Descrição detalhada da tarefa';
COMMENT ON COLUMN public.tarefas.status IS 'Status: pendente, em_andamento, concluida';
COMMENT ON COLUMN public.tarefas.responsavel IS 'Nome ou identificador do responsável';
COMMENT ON COLUMN public.tarefas.prioridade IS 'Prioridade: baixa, media, alta, critica';
COMMENT ON COLUMN public.tarefas.deadline IS 'Data/hora limite para conclusão';
COMMENT ON COLUMN public.tarefas.created_at IS 'Data de criação';
COMMENT ON COLUMN public.tarefas.updated_at IS 'Data da última atualização';

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON public.tarefas(responsavel);
CREATE INDEX IF NOT EXISTS idx_tarefas_prioridade ON public.tarefas(prioridade);
CREATE INDEX IF NOT EXISTS idx_tarefas_deadline ON public.tarefas(deadline);
CREATE INDEX IF NOT EXISTS idx_tarefas_created_at ON public.tarefas(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Política: Permitir todas as operações para usuários autenticados
CREATE POLICY "Permitir todas as operações para usuários autenticados"
    ON public.tarefas
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política: Permitir leitura para anon (se necessário)
-- CREATE POLICY "Permitir leitura para anon"
--     ON public.tarefas
--     FOR SELECT
--     TO anon
--     USING (true);

-- ============================================
-- Dados de exemplo (opcional - para testes)
-- ============================================

-- Inserir tarefas de exemplo
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline)
VALUES 
    (
        'Configurar SSL no VPS Stark', 
        'Instalar e configurar certificado SSL Let\'s Encrypt no servidor', 
        'em_andamento', 
        'Felipe', 
        'alta', 
        NOW() + INTERVAL '3 days'
    ),
    (
        'Integrar n8n com Supabase', 
        'Criar workflows de automação entre n8n e banco de dados', 
        'pendente', 
        'Israel', 
        'media', 
        NOW() + INTERVAL '7 days'
    ),
    (
        'Documentar API', 
        'Criar documentação completa da Stark API', 
        'pendente', 
        'Mylena', 
        'baixa', 
        NOW() + INTERVAL '14 days'
    ),
    (
        'Revisar segurança do sistema', 
        'Auditar permissões e configurar políticas RLS', 
        'pendente', 
        'Felipe', 
        'critica', 
        NOW() + INTERVAL '2 days'
    );

-- ============================================
-- View para estatísticas (opcional)
-- ============================================

CREATE OR REPLACE VIEW public.vw_tarefas_estatisticas AS
SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'pendente') as pendentes,
    COUNT(*) FILTER (WHERE status = 'em_andamento') as em_andamento,
    COUNT(*) FILTER (WHERE status = 'concluida') as concluidas,
    COUNT(*) FILTER (WHERE prioridade = 'critica') as criticas,
    COUNT(*) FILTER (WHERE prioridade = 'alta') as altas,
    COUNT(*) FILTER (WHERE deadline < NOW() AND status != 'concluida') as atrasadas
FROM public.tarefas;