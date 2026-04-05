-- Inserção de tarefas no Plano de Ação (Supabase)
-- Data: 2026-04-04
-- Total de tarefas: 9

-- Tarefa 1: Criar Agente Reportei (PRIORIDADE 1 - Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Agente Reportei',
  'Implementar agente para substituir ferramenta paga (R$ 30/mês). POP: /agents/pops/reportei-pop.md | IA recomendada: Manus (acesso ao Meta Business Suite) | Departamento: Dev | Checklist: Criar app no Facebook Developers, Configurar Meta Business API, Implementar coleta de métricas, Criar template de relatório, Configurar envio automatizado (N8N + WhatsApp), Testar com conta real',
  'pendente',
  'Pablo',
  'critica',
  NOW() + INTERVAL '3 days',
  NOW(),
  NOW()
);

-- Tarefa 2: Criar Agente Fignaldo (PRIORIDADE 1 - Design/Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Agente Fignaldo',
  'Agente de prototipagem a partir de Design Systems. POP: /agents/pops/fignaldo-pop.md | Tempo estimado: 6-8 horas | Departamento: Design/Dev | Checklist: Criar interface de upload de Design System, Implementar análise de cores/tipografia, Integrar com Claude API para geração de código, Criar preview em tempo real, Sistema de exportação (HTML/CSS), Testar com Design System da Totum',
  'pendente',
  'Pablo',
  'critica',
  NOW() + INTERVAL '5 days',
  NOW(),
  NOW()
);

-- Tarefa 3: Criar Radar de Anúncios (PRIORIDADE 1 - Marketing/Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Radar de Anúncios',
  'Monitorar anúncios de concorrentes + integração AdSpy. POP: /agents/pops/radar-anuncios-pop.md | Tempo estimado: 8-10 horas | Departamento: Marketing/Dev | Checklist: Criar script de scraping Meta Ads Library, Implementar análise com Claude API, Criar dashboard de visualização, Configurar alertas diários (WhatsApp), Integrar com dados do AdSpy (manual upload), Testar com concorrentes reais',
  'pendente',
  'Pablo',
  'critica',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
);

-- Tarefa 4: Criar KVirtuoso (PRIORIDADE 1 - Design/Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar KVirtuoso',
  'Gerador de 100-200 postagens a partir de Key Visual. POP: /agents/pops/kvirtuoso-pop.md | Tempo estimado: 10-12 horas | Departamento: Design/Dev | Checklist: Criar interface de upload de KV, Integrar com Leonardo.AI / Ideogram, Implementar variações de formato (feed, story, carrossel), Criar sistema de aprovação/rejeição, Export em batch, Testar com campanha real',
  'pendente',
  'Pablo',
  'critica',
  NOW() + INTERVAL '10 days',
  NOW(),
  NOW()
);

-- Tarefa 5: Commitar Correções de Bugs no GitHub (PRIORIDADE 2 - Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Commitar Correções de Bugs no GitHub',
  'Subir para o GitHub as correções dos bugs 1 e 3. Arquivos: AgentsDashboard.tsx, AppLayout.tsx, AppSidebar.tsx, useTarefas.ts | Status: Aguardando execução do subagente Bug 2 | Tempo estimado: 10 minutos | Departamento: Dev | Checklist: Esperar subagente terminar Bug 2, Fazer git add de todos os arquivos corrigidos, Commit com mensagem descritiva, Push para origin main, Verificar sincronização no Lovable',
  'pendente',
  'Pablo',
  'alta',
  NOW() + INTERVAL '1 day',
  NOW(),
  NOW()
);

-- Tarefa 6: Instalar Ollama no Servidor Dedicado (PRIORIDADE 2 - Infra)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Instalar Ollama no Servidor Dedicado',
  'Configurar IA local no i5-2400. Guia: /tarefas/instalar-ollama-servidor-dedicado.md | Responsável: Israel (acesso físico ao servidor) | Tempo estimado: 30 minutos | Departamento: Infra | Checklist: Instalar Ollama via script, Baixar qwen2.5:7b, Baixar nomic-embed-text, Testar chat local, Configurar acesso remoto (se necessário)',
  'pendente',
  'Israel',
  'alta',
  NOW() + INTERVAL '2 days',
  NOW(),
  NOW()
);

-- Tarefa 7: Testar Runway Gen-3 (PRIORIDADE 3 - Testes)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Testar Runway Gen-3',
  'Avaliar qualidade de geração de vídeo. Guia: /tarefas/testar-runway-gen3.md | Tempo estimado: 2-3 horas | Departamento: Testes | Checklist: Acessar Runway Gen-3, Testar 3-5 prompts diferentes, Avaliar qualidade vs custo, Comparar com alternativas (Pika, HeyGen), Documentar resultados',
  'pendente',
  'Data',
  'media',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
);

-- Tarefa 8: Configurar Figma AI (PRIORIDADE 3 - Testes/Design)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Configurar Figma AI',
  'Avaliar Figma AI nativo para Design System. Guia: /tarefas/configurar-figma-ai-design-system.md | Tempo estimado: 3-4 horas | Departamento: Testes/Design | Checklist: Ativar Figma AI na conta, Testar geração de componentes, Avaliar criação de protótipos, Comparar com Stitch do Google, Documentar capacidades',
  'pendente',
  'Data',
  'media',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
);

-- Tarefa 9: Criar Dashboard de Gastos (PRIORIDADE 3 - Dev)
INSERT INTO tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Dashboard de Gastos',
  'Página no Apps Totum para monitorar gastos mensais. Contexto: Orçamento R$ 1.500/mês | Tempo estimado: 4-6 horas | Departamento: Dev | Checklist: Criar tabela `gastos_mensais` no Supabase, Criar componente DashboardGastos.tsx, Integrar com gráficos (Recharts), Configurar alertas de limite, Testar com dados reais',
  'pendente',
  'Hug',
  'media',
  NOW() + INTERVAL '5 days',
  NOW(),
  NOW()
);
