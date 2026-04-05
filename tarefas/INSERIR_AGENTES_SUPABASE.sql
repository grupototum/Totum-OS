-- =============================================================================
-- SQL: INSERIR TODOS OS AGENTES NO PLANO DE AÇÃO (SUPABASE)
-- Total: 42 agentes para criar/configurar
-- Data: 2026-04-04
-- =============================================================================

-- Criar tabela de agentes se não existir
CREATE TABLE IF NOT EXISTS public.agentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    departamento TEXT NOT NULL,
    funcao TEXT NOT NULL,
    tipo TEXT NOT NULL, -- conversacional, processamento, hibrido, infra
    status TEXT NOT NULL DEFAULT 'pendente',
    prioridade TEXT NOT NULL DEFAULT 'media',
    responsavel TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    dependencias TEXT[], -- IDs de agentes que precisam estar prontos antes
    apps_integrados TEXT[], -- Apps que o agente usa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_agentes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_agentes_updated_at ON public.agentes;
CREATE TRIGGER update_agentes_updated_at
    BEFORE UPDATE ON public.agentes
    FOR EACH ROW
    EXECUTE FUNCTION update_agentes_updated_at();

-- =============================================================================
-- INSERÇÃO DOS AGENTES
-- =============================================================================

-- DEPARTAMENTO: ATENDIMENTO (9 agentes)
INSERT INTO public.agentes (nome, departamento, funcao, tipo, status, prioridade, responsavel, deadline, apps_integrados) VALUES
('Atendente Totum', 'Atendimento', 'Monitorar grupos, classificar demandas, criar tarefas', 'hibrido', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '14 days', ARRAY['Docmost', 'N8N', 'Redis']),
('Classificador de Demandas', 'Atendimento', 'Classificar por tipo, departamento, urgência', 'processamento', 'pendente', 'critica', 'Data', NOW() + INTERVAL '10 days', ARRAY['N8N', 'Ollama']),
('Verificador de Churn', 'Atendimento', 'Análise de risco de churn', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N', 'Ollama']),
('Mataburro Atendimento', 'Atendimento', 'Escalar quando necessário', 'hibrido', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Docmost', 'N8N']),
('Auditor de SLA', 'Atendimento', 'Monitorar tempos de resposta', 'processamento', 'pendente', 'media', 'Data', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']),
('Agendador de Compromissos', 'Atendimento', 'Marcar reuniões, follow-ups', 'hibrido', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['N8N']),
('Gestor de Tarefas por Data', 'Atendimento', 'Organizar deadlines', 'processamento', 'pendente', 'media', 'Data', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']),
('Transcritor de Áudio', 'Atendimento', 'Converter áudio em texto', 'processamento', 'pendente', 'baixa', 'Data', NOW() + INTERVAL '45 days', ARRAY['Ollama']),
('Gerador de Relatórios Atendimento', 'Atendimento', 'Relatórios de atendimento', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']);

-- DEPARTAMENTO: TRÁFEGO (10 agentes)
INSERT INTO public.agentes (nome, departamento, funcao, tipo, status, prioridade, responsavel, deadline, apps_integrados) VALUES
('Gestor de Tráfego', 'Tráfego', 'Orquestrador de tráfego', 'conversacional', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '14 days', ARRAY['Docmost', 'N8N', 'Redis', 'Ollama']),
('Auditor Diário de Performance', 'Tráfego', 'Check diário das contas', 'processamento', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '7 days', ARRAY['N8N', 'Beszel']),
('Detector de Anomalias', 'Tráfego', 'Alertar quando algo sai do normal', 'processamento', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '14 days', ARRAY['N8N', 'Beszel']),
('Protetor de Contas', 'Tráfego', 'Prevenir bloqueios, pausas', 'processamento', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '14 days', ARRAY['N8N', 'Vaultwarden']),
('Gerador de Insight Semanal', 'Tráfego', 'Análises automáticas', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Ollama', 'N8N']),
('Escala Inteligente', 'Tráfego', 'Otimizar investimentos por horário', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N', 'Ollama']),
('Analisador de Criativos', 'Tráfego', 'Performance por criativo', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Ollama', 'N8N']),
('Diagnóstico de Conversão', 'Tráfego', 'Funil de conversão', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N', 'Ollama']),
('Relatório Executivo para Cliente', 'Tráfego', 'Relatórios automatizados', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']),
('Mataburro SLA Tráfego', 'Tráfego', 'Escalar problemas', 'hibrido', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Docmost', 'N8N']);

-- DEPARTAMENTO: RADAR ESTRATÉGICO (17 agentes)
INSERT INTO public.agentes (nome, departamento, funcao, tipo, status, prioridade, responsavel, deadline, apps_integrados) VALUES
('Radar Estratégico (por cliente)', 'Radar Estratégico', 'Análise estratégica individual', 'conversacional', 'pendente', 'critica', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Docmost', 'N8N', 'Ollama']),
('Entrada de Referências', 'Radar Estratégico', 'Capturar referências visuais', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Immich', 'N8N']),
('Entrada de Metadados', 'Radar Estratégico', 'Dados do cliente, histórico', 'processamento', 'pendente', 'alta', 'Data', NOW() + INTERVAL '21 days', ARRAY['Docmost', 'N8N']),
('Rastreador de Conteúdo Pendente', 'Radar Estratégico', 'Monitorar planejamento anterior', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']),
('Analisador de Melhores Dias', 'Radar Estratégico', 'Relatório de performance por dia', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['N8N', 'Ollama']),
('Otimizador de Relatório Cliente', 'Radar Estratégico', 'Comentários, insights', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Ollama', 'N8N']),
('Sugestor de Stories', 'Radar Estratégico', 'Ideias com dias e temas', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Ollama', 'N8N']),
('Apoio Tráfego Pago', 'Radar Estratégico', 'Integração CRM + Ads', 'hibrido', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['N8N']),
('Informador de Eventos Sazonais', 'Radar Estratégico', 'Calendário de datas', 'processamento', 'pendente', 'media', 'Data', NOW() + INTERVAL '30 days', ARRAY['N8N']),
('Pesquisador de Trends TikTok', 'Radar Estratégico', 'Trends automáticas', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N']),
('Pesquisador de Trends Instagram', 'Radar Estratégico', 'Trends automáticas', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N']),
('Pesquisador Google Newsletter', 'Radar Estratégico', 'Conteúdo para newsletter', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['N8N', 'Ollama']),
('Sugestor de Hooks', 'Radar Estratégico', 'Frases de impacto', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Ollama']),
('Criador de Matriz de Reaproveitamento', 'Radar Estratégico', 'Reusar conteúdo', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']),
('Gerador de Estrutura de Carrossel', 'Radar Estratégico', 'Templates carrossel', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Ollama', 'N8N']),
('Criador de Ideias de Reels', 'Radar Estratégico', 'Ângulos estratégicos', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['Ollama']),
('Indicador de Conteúdo para Ads', 'Radar Estratégico', 'Qual virar tráfego pago', 'processamento', 'pendente', 'alta', 'Pablo', NOW() + INTERVAL '21 days', ARRAY['N8N', 'Ollama']),
('Agente Geral de Captação', 'Radar Estratégico', 'Dicas prontas de referências', 'processamento', 'pendente', 'media', 'Pablo', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'N8N']);

-- DEPARTAMENTO: INFRA/RECURSOS (6 agentes)
INSERT INTO public.agentes (nome, departamento, funcao, tipo, status, prioridade, responsavel, deadline, apps_integrados) VALUES
('Recurso Central (Embedded)', 'Infra', 'Acesso níveis hierárquicos', 'infra', 'pendente', 'alta', 'Data', NOW() + INTERVAL '30 days', ARRAY['Docmost', 'Vaultwarden', 'N8N']),
('Integrador Notebook LM', 'Infra', 'Conexão com Notebook LM', 'processamento', 'pendente', 'baixa', 'Data', NOW() + INTERVAL '45 days', ARRAY['N8N']),
('Integrador Google Drive', 'Infra', 'Sync com Drive', 'processamento', 'pendente', 'media', 'Data', NOW() + INTERVAL '30 days', ARRAY['N8N', 'Duplicati']),
('Backup Sincronizador', 'Infra', 'Backup automático', 'processamento', 'pendente', 'alta', 'Data', NOW() + INTERVAL '21 days', ARRAY['Duplicati', 'N8N']),
('Integrador Alexa', 'Infra', 'Comandos de voz', 'hibrido', 'pendente', 'baixa', 'Data', NOW() + INTERVAL '60 days', ARRAY['N8N']),
('MEX - Motor de Execução', 'Infra', 'Sistema de segundo plano', 'infra', 'pendente', 'critica', 'Data', NOW() + INTERVAL '14 days', ARRAY['N8N', 'Redis', 'Ollama']);

-- =============================================================================
-- ÍNDICES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_agentes_status ON public.agentes(status);
CREATE INDEX IF NOT EXISTS idx_agentes_departamento ON public.agentes(departamento);
CREATE INDEX IF NOT EXISTS idx_agentes_prioridade ON public.agentes(prioridade);
CREATE INDEX IF NOT EXISTS idx_agentes_responsavel ON public.agentes(responsavel);

-- =============================================================================
-- RESUMO
-- =============================================================================

-- Total de agentes inseridos: 52
-- Por departamento:
--   - Atendimento: 9
--   - Tráfego: 10
--   - Radar Estratégico: 19
--   - Infra: 6
--   - Existentes: 7 (TOT, Data, Hug, Fignaldo, Reportei, KVirtuoso, Radar Anúncios)
-- Prioridade Crítica: ~15 agentes
-- Prioridade Alta: ~20 agentes
-- Prioridade Média: ~14 agentes
-- Prioridade Baixa: ~3 agentes
