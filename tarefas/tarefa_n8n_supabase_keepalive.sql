-- Tarefa: Configurar N8N Workflow Keep-Alive para Supabase
-- Prioridade: Média
-- Responsável: Israel (com suporte TOT)
-- Deadline: 2026-04-10

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

-- Instruções detalhadas para execução:
-- 1. Acessar N8N em http://187.127.4.140:5678
-- 2. Menu → Workflows → Import
-- 3. Copiar conteúdo de: tarefas/n8n_workflow_supabase_keepalive.json
-- 4. Configurar credenciais Supabase (URL e anon key)
-- 5. Configurar credencial Telegram (chat_id e bot token)
-- 6. Salvar e ativar workflow
-- 7. Testar manualmente (Run Once)

-- Arquivo de referência: /root/.openclaw/workspace/tarefas/n8n_workflow_supabase_keepalive.json