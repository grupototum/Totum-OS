-- =============================================================================
-- EXECUTAR NO SUPABASE - PLANO DE AÇÃO TOTUM
-- Data: 2026-04-04
-- Execute este script no SQL Editor do Supabase Dashboard
-- URL: https://app.supabase.com/project/_/sql/new
-- =============================================================================

-- =============================================================================
-- 1. CRIAR TABELA TAREFAS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL DEFAULT 'pendente',
  responsavel text NOT NULL,
  prioridade text NOT NULL DEFAULT 'media',
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON public.tarefas(responsavel);
CREATE INDEX IF NOT EXISTS idx_tarefas_prioridade ON public.tarefas(prioridade);
CREATE INDEX IF NOT EXISTS idx_tarefas_deadline ON public.tarefas(deadline);

-- =============================================================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Allow all read" ON public.tarefas 
  FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "Allow insert for authenticated" ON public.tarefas 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated" ON public.tarefas 
  FOR UPDATE TO authenticated 
  USING (true);

CREATE POLICY "Allow delete for authenticated" ON public.tarefas 
  FOR DELETE TO authenticated 
  USING (true);

-- =============================================================================
-- 4. TRIGGER PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_tarefas_updated_at ON public.tarefas;
CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON public.tarefas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- 5. INSERIR TAREFAS DO PLANO DE AÇÃO (9 TAREFAS)
-- =============================================================================

-- TAREFA 1: Criar Agente Reportei (PRIORIDADE 1 - Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Agente Reportei',
  'Implementar agente para substituir ferramenta paga (R$ 30/mês). POP: /agents/pops/reportei-pop.md | IA recomendada: Manus (acesso ao Meta Business Suite) | Departamento: Dev | Tempo estimado: 4-6 horas | Checklist: Criar app no Facebook Developers, Configurar Meta Business API, Implementar coleta de métricas, Criar template de relatório, Configurar envio automatizado (N8N + WhatsApp), Testar com conta real',
  'pendente',
  'Pablo',
  'critica',
  now() + interval '3 days',
  now(),
  now()
);

-- TAREFA 2: Criar Agente Fignaldo (PRIORIDADE 1 - Design/Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Agente Fignaldo',
  'Agente de prototipagem a partir de Design Systems. POP: /agents/pops/fignaldo-pop.md | Departamento: Design/Dev | Tempo estimado: 6-8 horas | Checklist: Criar interface de upload de Design System, Implementar análise de cores/tipografia, Integrar com Claude API para geração de código, Criar preview em tempo real, Sistema de exportação (HTML/CSS), Testar com Design System da Totum',
  'pendente',
  'Pablo',
  'critica',
  now() + interval '5 days',
  now(),
  now()
);

-- TAREFA 3: Criar Radar de Anúncios (PRIORIDADE 1 - Marketing/Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Radar de Anúncios',
  'Monitorar anúncios de concorrentes + integração AdSpy. POP: /agents/pops/radar-anuncios-pop.md | Departamento: Marketing/Dev | Tempo estimado: 8-10 horas | Checklist: Criar script de scraping Meta Ads Library, Implementar análise com Claude API, Criar dashboard de visualização, Configurar alertas diários (WhatsApp), Integrar com dados do AdSpy (manual upload), Testar com concorrentes reais',
  'pendente',
  'Pablo',
  'critica',
  now() + interval '7 days',
  now(),
  now()
);

-- TAREFA 4: Criar KVirtuoso (PRIORIDADE 1 - Design/Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar KVirtuoso',
  'Gerador de 100-200 postagens a partir de Key Visual. POP: /agents/pops/kvirtuoso-pop.md | Departamento: Design/Dev | Tempo estimado: 10-12 horas | Checklist: Criar interface de upload de KV, Integrar com Leonardo.AI / Ideogram, Implementar variações de formato (feed, story, carrossel), Criar sistema de aprovação/rejeição, Export em batch, Testar com campanha real',
  'pendente',
  'Pablo',
  'critica',
  now() + interval '10 days',
  now(),
  now()
);

-- TAREFA 5: Commitar Correções de Bugs no GitHub (PRIORIDADE 2 - Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Commitar Correções de Bugs no GitHub',
  'Subir para o GitHub as correções dos bugs 1 e 3. Arquivos: AgentsDashboard.tsx, AppLayout.tsx, AppSidebar.tsx, useTarefas.ts | Status: Aguardando execução do subagente Bug 2 | Departamento: Dev | Tempo estimado: 10 minutos | Checklist: Esperar subagente terminar Bug 2, Fazer git add de todos os arquivos corrigidos, Commit com mensagem descritiva, Push para origin main, Verificar sincronização no Lovable',
  'pendente',
  'Pablo',
  'alta',
  now() + interval '1 day',
  now(),
  now()
);

-- TAREFA 6: Instalar Ollama no Servidor Dedicado (PRIORIDADE 2 - Infra)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Instalar Ollama no Servidor Dedicado',
  'Configurar IA local no i5-2400. Guia: /tarefas/instalar-ollama-servidor-dedicado.md | Responsável: Israel (acesso físico ao servidor) | Departamento: Infra | Tempo estimado: 30 minutos | Checklist: Instalar Ollama via script, Baixar qwen2.5:7b, Baixar nomic-embed-text, Testar chat local, Configurar acesso remoto (se necessário)',
  'pendente',
  'Israel',
  'alta',
  now() + interval '2 days',
  now(),
  now()
);

-- TAREFA 7: Testar Runway Gen-3 (PRIORIDADE 3 - Testes)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Testar Runway Gen-3',
  'Avaliar qualidade de geração de vídeo. Guia: /tarefas/testar-runway-gen3.md | Departamento: Testes | Tempo estimado: 2-3 horas | Checklist: Acessar Runway Gen-3, Testar 3-5 prompts diferentes, Avaliar qualidade vs custo, Comparar com alternativas (Pika, HeyGen), Documentar resultados',
  'pendente',
  'Data',
  'media',
  now() + interval '7 days',
  now(),
  now()
);

-- TAREFA 8: Configurar Figma AI (PRIORIDADE 3 - Testes/Design)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Configurar Figma AI',
  'Avaliar Figma AI nativo para Design System. Guia: /tarefas/configurar-figma-ai-design-system.md | Departamento: Testes/Design | Tempo estimado: 3-4 horas | Checklist: Ativar Figma AI na conta, Testar geração de componentes, Avaliar criação de protótipos, Comparar com Stitch do Google, Documentar capacidades',
  'pendente',
  'Data',
  'media',
  now() + interval '7 days',
  now(),
  now()
);

-- TAREFA 9: Criar Dashboard de Gastos (PRIORIDADE 3 - Dev)
INSERT INTO public.tarefas (titulo, descricao, status, responsavel, prioridade, deadline, created_at, updated_at)
VALUES (
  'Criar Dashboard de Gastos',
  'Página no Apps Totum para monitorar gastos mensais. Contexto: Orçamento R$ 1.500/mês | Departamento: Dev | Tempo estimado: 4-6 horas | Checklist: Criar tabela `gastos_mensais` no Supabase, Criar componente DashboardGastos.tsx, Integrar com gráficos (Recharts), Configurar alertas de limite, Testar com dados reais',
  'pendente',
  'Hug',
  'media',
  now() + interval '5 days',
  now(),
  now()
);

-- =============================================================================
-- 6. VERIFICAR INSERÇÕES
-- =============================================================================

SELECT 
  COUNT(*) as total_tarefas,
  COUNT(CASE WHEN prioridade = 'critica' THEN 1 END) as criticas,
  COUNT(CASE WHEN prioridade = 'alta' THEN 1 END) as altas,
  COUNT(CASE WHEN prioridade = 'media' THEN 1 END) as medias
FROM public.tarefas;

SELECT 
  titulo,
  responsavel,
  prioridade,
  deadline::date as prazo
FROM public.tarefas
ORDER BY 
  CASE prioridade 
    WHEN 'critica' THEN 1 
    WHEN 'alta' THEN 2 
    WHEN 'media' THEN 3 
    ELSE 4 
  END,
  deadline;
