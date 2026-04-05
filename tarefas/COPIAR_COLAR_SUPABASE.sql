-- =============================================================================
-- SQL PARA SUPABASE - CRIAR TABELA TAREFAS E INSERIR TAREFAS PENDENTES
-- Execute no SQL Editor: https://cgpkfhrqprqptvehatad.supabase.co/project/sql
-- =============================================================================

-- 1. CRIAR TABELA TAREFAS (se não existir)
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
    prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
    responsavel TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    departamento TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICA DE ACESSO (permitir all para autenticados)
DROP POLICY IF EXISTS "Allow all" ON public.tarefas;
CREATE POLICY "Allow all" ON public.tarefas
    FOR ALL USING (true) WITH CHECK (true);

-- 4. INSERIR TAREFAS
INSERT INTO public.tarefas (
    titulo,
    descricao,
    status,
    prioridade,
    responsavel,
    deadline,
    departamento,
    tags
) VALUES (
    'Configurar N8N Workflow Keep-Alive para Supabase',
    'Criar workflow no N8N que executa query a cada 3 dias para evitar pausa do projeto Supabase Free. Inclui notificações Telegram (sucesso/erro). Arquivo: tarefas/n8n_workflow_supabase_keepalive.json',
    'pendente',
    'media',
    'Israel',
    '2026-04-10T23:59:59+08:00',
    'Infra',
    ARRAY['n8n', 'supabase', 'automation', 'keep-alive']
), (
    'Instalar CyberPanel no VPS Stark',
    'Instalar painel de hospedagem CyberPanel para gerenciar sites de clientes. Manter Docker existente. Seguir guia em tarefas/GUIA_INSTALACAO_CYBERPANEL.md',
    'pendente',
    'alta',
    'Israel',
    '2026-04-07T23:59:59+08:00',
    'Infra',
    ARRAY['cyberpanel', 'hosting', 'vps', 'painel-controle']
);

-- 5. VERIFICAR INSERÇÃO
SELECT * FROM public.tarefas ORDER BY prioridade DESC, deadline ASC;