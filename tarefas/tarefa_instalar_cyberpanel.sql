-- Tarefa: Instalar CyberPanel no VPS Stark
-- Prioridade: Alta
-- Responsável: Israel (com suporte TOT)
-- Deadline: 2026-04-07

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

-- Instruções resumidas:
-- 1. Acessar VPS via SSH: ssh root@187.127.4.140
-- 2. Executar: wget -O installer.sh https://cyberpanel.net/install.sh
-- 3. Executar: chmod +x installer.sh && ./installer.sh
-- 4. Selecionar Opção 1 (OpenLiteSpeed - gratuito)
-- 5. Aguardar 15-30 minutos
-- 6. Anotar URL, usuário e senha exibidos
-- 7. Acessar: https://187.127.4.140:8090
-- 8. Alterar senha padrão
-- 9. Configurar SSL Let's Encrypt

-- Arquivo detalhado: /root/.openclaw/workspace/tarefas/GUIA_INSTALACAO_CYBERPANEL.md