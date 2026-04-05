-- =====================================================
-- SQL para criar tabela de tarefas no Supabase
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- URL: https://cgpkfhrqprqptvehatad.supabase.co/project/sql
-- =====================================================

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  prioridade TEXT,
  responsavel TEXT,
  deadline TIMESTAMPTZ,
  departamento TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários nas colunas
COMMENT ON COLUMN public.tarefas.id IS 'ID único da tarefa (UUID)';
COMMENT ON COLUMN public.tarefas.titulo IS 'Título da tarefa';
COMMENT ON COLUMN public.tarefas.descricao IS 'Descrição detalhada';
COMMENT ON COLUMN public.tarefas.status IS 'Status: pendente, em_andamento, concluida, cancelada';
COMMENT ON COLUMN public.tarefas.prioridade IS 'Prioridade: baixa, media, alta, urgente';
COMMENT ON COLUMN public.tarefas.responsavel IS 'Nome do responsável';
COMMENT ON COLUMN public.tarefas.deadline IS 'Data/hora limite';
COMMENT ON COLUMN public.tarefas.departamento IS 'Departamento/área';
COMMENT ON COLUMN public.tarefas.tags IS 'Array de tags';

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Criar política para leitura pública (ajuste conforme necessidade)
CREATE POLICY "Allow public read" ON public.tarefas
  FOR SELECT USING (true);

-- Criar política para inserção pública (ajuste conforme necessidade)
CREATE POLICY "Allow public insert" ON public.tarefas
  FOR INSERT WITH CHECK (true);

-- Criar política para update público (ajuste conforme necessidade)  
CREATE POLICY "Allow public update" ON public.tarefas
  FOR UPDATE USING (true);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_prioridade ON public.tarefas(prioridade);
CREATE INDEX IF NOT EXISTS idx_tarefas_deadline ON public.tarefas(deadline);
CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON public.tarefas(responsavel);

-- Inserir tarefas do Plano de Ação
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
  'Criar workflow no N8N que executa query a cada 3 dias para evitar pausa do projeto Supabase Free. Inclui notificações Telegram (sucesso/erro).',
  'pendente',
  'media',
  'Israel',
  '2026-04-10T23:59:59+08:00',
  'Infra',
  ARRAY['n8n', 'supabase', 'automation', 'keep-alive']
);

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
  'Instalar CyberPanel no VPS Stark',
  'Instalar painel de hospedagem CyberPanel para gerenciar sites de clientes. Seguir guia completo em tarefas/GUIA_INSTALACAO_CYBERPANEL.md.',
  'pendente',
  'alta',
  'Israel',
  '2026-04-07T23:59:59+08:00',
  'Infra',
  ARRAY['cyberpanel', 'hosting', 'vps', 'painel-controle']
);

-- Verificar inserções
SELECT * FROM public.tarefas ORDER BY created_at DESC;
