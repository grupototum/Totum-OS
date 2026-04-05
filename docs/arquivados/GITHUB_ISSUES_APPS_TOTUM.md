# 📋 GITHUB ISSUES - APPS TOTUM OFICIAL
> Lista completa de tarefas para implementação do sistema de agentes

---

## 🏷️ Labels Sugeridos

```
- `fase-1` - Setup e Infraestrutura
- `fase-2` - Frontend e UI
- `fase-3` - Backend e APIs
- `fase-4` - Agentes e IA
- `fase-5` - Deploy e Go Live
- `prioridade-alta` - Blocker/Crítico
- `prioridade-media` - Importante
- `prioridade-baixa` - Nice to have
- `integracao` - Integrações externas
- `agente` - Relacionado a agentes de IA
```

---

## 📌 ISSUES PARA CRIAR

### 🏗️ FASE 1: SETUP E INFRAESTRUTURA

#### Issue #1: [FASE-1] Configurar tabelas do sistema de agentes no Supabase
**Labels:** `fase-1`, `prioridade-alta`, `database`
**Assignee:** Jarvis/Felipe

**Descrição:**
Criar as tabelas necessárias para o sistema de agentes de IA:

**Tabelas:**
- [ ] `agents` - Cadastro dos 8 agentes (Miguel, Liz, Jarvis, Controlador, Cartógrafo, Vendedor, Diretor Arte, Especialista CRM)
- [ ] `workflows` - Definição de workflows dos agentes
- [ ] `workflow_executions` - Execuções em andamento/concluídas
- [ ] `agent_conversations` - Histórico de conversas
- [ ] `client_agents` - Relacionamento cliente-agente

**Campos obrigatórios:**
```sql
-- agents
- id, name, codename, personality_json, status, created_at

-- workflows  
- id, agent_id, name, trigger, steps, status

-- workflow_executions
- id, workflow_id, client_id, status, started_at, completed_at

-- agent_conversations
- id, agent_id, client_id, message, response, context

-- client_agents
- id, client_id, agent_id, relationship_type
```

---

#### Issue #2: [FASE-1] Configurar Edge Functions para execução de agentes
**Labels:** `fase-1`, `prioridade-alta`, `backend`
**Assignee:** Jarvis/Felipe

**Descrição:**
Criar Edge Functions no Supabase para orquestração dos agentes:

**Functions:**
- [ ] `agent-executor` - Executa ações dos agentes
- [ ] `workflow-engine` - Gerencia fluxos de trabalho
- [ ] `agent-webhook` - Recebe eventos externos (n8n, Kommo)
- [ ] `agent-auth` - Autenticação de agentes

**Stack:**
- Deno/TypeScript
- Integração com OpenAI/Claude API
- Webhooks para n8n

---

#### Issue #3: [FASE-1] Configurar variáveis de ambiente para agentes
**Labels:** `fase-1`, `prioridade-alta`, `config`
**Assignee:** Jarvis/Felipe

**Descrição:**
Adicionar variáveis necessárias ao `.env`:

```env
# APIs de IA
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=

# Integrações
N8N_WEBHOOK_URL=
KOMMO_API_KEY=
KOMMO_SUBDOMAIN=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# VPS
STARK_VPS_IP=
STARK_SSH_KEY=

# Outros
TELEGRAM_BOT_TOKEN=
OPIK_API_KEY=
```

---

### 🎨 FASE 2: FRONTEND E UI

#### Issue #4: [FASE-2] Criar página /agents (Dashboard de Agentes)
**Labels:** `fase-2`, `prioridade-alta`, `frontend`, `ui`
**Assignee:** Frontend Team

**Descrição:**
Criar nova página para gerenciamento dos 8 agentes:

**Funcionalidades:**
- [ ] Grid dos 8 agentes com avatar e status
- [ ] Indicador de status (online/offline/ocupado)
- [ ] Cards com personalidade resumida
- [ ] Botão para ver detalhes do agente
- [ ] Estatísticas de uso (conversas, workflows executados)
- [ ] Toggle para ativar/desativar agente

**Design:** Usar shadcn/ui + Tailwind (cor #f76926)

---

#### Issue #5: [FASE-2] Modificar ClientHub para incluir abas de Agentes
**Labels:** `fase-2`, `prioridade-alta`, `frontend`, `integracao`
**Assignee:** Frontend Team

**Descrição:**
Adicionar 3 novas abas no ClientHub existente:

**Novas Abas:**
- [ ] **Agentes Ativos** - Lista de agentes ativos para o cliente
- [ ] **Workflows** - Workflows em execução para o cliente
- [ ] **Conversas** - Histórico de conversas com agentes

**Integração:**
- Usar dados da tabela `client_agents`
- Mostrar contexto do cliente para o agente

---

#### Issue #6: [FASE-2] Criar componente de chat com agente
**Labels:** `fase-2`, `prioridade-media`, `frontend`, `ui`
**Assignee:** Frontend Team

**Descrição:**
Interface de chat para conversar com agentes:

**Features:**
- [ ] Interface tipo chat (WhatsApp/Discord style)
- [ ] Mostrar nome e avatar do agente
- [ ] Contexto do cliente visível para o agente
- [ ] Histórico de mensagens
- [ ] Anexos (imagens, documentos)
- [ ] Indicador de "digitando..."

---

#### Issue #7: [FASE-2] Implementar design system com cor #f76926
**Labels:** `fase-2`, `prioridade-media`, `ui`
**Assignee:** Frontend Team

**Descrição:**
Ajustar o design system existente para usar a cor da Totum:

**Ajustes:**
- [ ] Atualizar `tailwind.config.ts` (primary: #f76926)
- [ ] Ajustar componentes shadcn/ui
- [ ] Verificar contraste e acessibilidade
- [ ] Atualizar logo e favicon

---

### ⚙️ FASE 3: BACKEND E APIs

#### Issue #8: [FASE-3] Criar API para execução de agentes
**Labels:** `fase-3`, `prioridade-alta`, `backend`, `api`
**Assignee:** Jarvis/Felipe

**Descrição:**
Endpoints para interação com agentes:

**Endpoints:**
```
POST /api/agents/:id/execute
POST /api/agents/:id/chat
GET /api/agents/:id/status
GET /api/clients/:id/agents
POST /api/workflows/:id/trigger
GET /api/workflows/:id/status
```

**Autenticação:** JWT + RBAC

---

#### Issue #9: [FASE-3] Implementar sistema de contexto para agentes
**Labels:** `fase-3`, `prioridade-alta`, `backend`, `agente`
**Assignee:** Jarvis/Felipe

**Descrição:**
Sistema de contexto que alimenta os agentes com informações do cliente:

**Contexto incluído:**
- [ ] Dados do cliente (nome, empresa, plano)
- [ ] Histórico de interações
- [ ] Mapa semântico do negócio
- [ ] Entregas pendentes
- [ ] Contratos ativos
- [ ] Preferências e anotações

**Integração:** Usar tabela `clients` existente + novos campos

---

#### Issue #10: [FASE-3] Configurar webhooks para n8n e Kommo
**Labels:** `fase-3`, `prioridade-media`, `integracao`, `webhook`
**Assignee:** Jarvis/Felipe

**Descrição:**
Integração com ferramentas externas:

**Webhooks:**
- [ ] Novo lead no Kommo → dispara agente Vendedor
- [ ] Nova mensagem no WhatsApp → dispara agente Atendente
- [ ] Tarefa atrasada → dispara agente Liz
- [ ] Erro no sistema → dispara agente Jarvis

**Config:**
- n8n workflows
- Kommo API integration
- Webhook signatures para segurança

---

### 🤖 FASE 4: AGENTES E IA

#### Issue #11: [FASE-4] Implementar personalidade do Miguel (Israel)
**Labels:** `fase-4`, `prioridade-alta`, `agente`
**Assignee:** AI/ML Team

**Descrição:**
Implementar agente Miguel baseado no Israel:

**Referência:** `PERSONALIDADE_MIGUEL_REAL.md`

**Implementar:**
- [ ] 12 gatilhos de ativação
- [ ] Tom de comunicação (visionário, intenso)
- [ ] Relacionamentos com Liz e Jarvis
- [ ] KPIs de monitoramento
- [ ] Integração com decisões estratégicas

**Prompt base:** Usar ODA, L99 para decisões complexas

---

#### Issue #12: [FASE-4] Implementar personalidade da Liz (Mylena)
**Labels:** `fase-4`, `prioridade-alta`, `agente`
**Assignee:** AI/ML Team

**Descrição:**
Implementar agente Liz baseado na Mylena:

**Referência:** `PERSONALIDADE_LIZ_REAL.md`

**Implementar:**
- [ ] 12 gatilhos de ativação (validação, auditoria, etc)
- [ ] Tom de comunicação (guardiã, organizada)
- [ ] Sistema de aprovações
- [ ] Alertas de SLA
- [ ] Gestão de carga de trabalho

---

#### Issue #13: [FASE-4] Implementar personalidade do Jarvis (Felipe)
**Labels:** `fase-4`, `prioridade-alta`, `agente`
**Assignee:** AI/ML Team

**Descrição:**
Implementar agente Jarvis baseado no Felipe:

**Referência:** `PERSONALIDADE_JARVIS_REAL.md`

**Implementar:**
- [ ] 12 gatilhos de ativação (bugs, deploys, etc)
- [ ] Tom de comunicação (técnico, pragmático)
- [ ] Integração com sistema técnico
- [ ] Resolução de incidentes
- [ ] Code review automático

---

#### Issue #14: [FASE-4] Implementar agente Orquestrador (TARS)
**Labels:** `fase-4`, `prioridade-alta`, `agente`
**Assignee:** AI/ML Team

**Descrição:**
Implementar agente Orquestrador baseado no TARS de Interstellar:

**Referência:** `PERSONALIDADE_ORQUESTRADOR_TOTUM.md`

**Implementar:**
- [ ] Coordenação de múltiplos agentes
- [ ] Roteamento de tarefas
- [ ] Monitoramento de workflows
- [ ] Humor ajustável (40% com Miguel, 80% com Jarvis)
- [ ] Probabilidades de sucesso em tempo real

---

#### Issue #15: [FASE-4] Implementar demais agentes especialistas
**Labels:** `fase-4`, `prioridade-media`, `agente`
**Assignee:** AI/ML Team

**Descrição:**
Implementar os 4 agentes especialistas restantes:

**Agentes:**
- [ ] **Controlador** - ADM/Financeiro
- [ ] **Cartógrafo** - Mapa Semântico/Inteligência
- [ ] **Vendedor** - Comercial/Fechamento
- [ ] **Diretor de Arte** - Criação/Design
- [ ] **Especialista CRM** - Automações/n8n

**Referências:** Arquivos `PERSONALIDADE_*.md`

---

#### Issue #16: [FASE-4] Criar sistema de memória para agentes
**Labels:** `fase-4`, `prioridade-media`, `agente`, `feature`
**Assignee:** AI/ML Team

**Descrição:**
Implementar memória de longo prazo para agentes:

**Features:**
- [ ] Memória de conversas anteriores
- [ ] Aprendizado com interações
- [ ] Contexto persistente entre sessões
- [ ] Preferências do usuário
- [ ] Histórico de decisões

**Tecnologia:** Claude Min skill ou vector DB (ChromaDB)

---

### 🚀 FASE 5: DEPLOY E GO LIVE

#### Issue #17: [FASE-5] Configurar deploy no VPS Stark
**Labels:** `fase-5`, `prioridade-alta`, `deploy`, `infra`
**Assignee:** Jarvis/Felipe

**Descrição:**
Configurar o VPS Stark para hospedar o sistema:

**Tarefas:**
- [ ] Configurar servidor (Ubuntu + Docker)
- [ ] Setup de SSL (Let's Encrypt)
- [ ] Configurar Nginx reverse proxy
- [ ] Setup de CI/CD (GitHub Actions)
- [ ] Configurar backups automáticos
- [ ] Monitoramento (Uptime + Logs)

**Stack:**
- VPS: Stark (IP a definir)
- Docker + Docker Compose
- Nginx
- PM2 (process manager)

---

#### Issue #18: [FASE-5] Migrar dados do sistema antigo
**Labels:** `fase-5`, `prioridade-alta`, `migracao`, `database`
**Assignee:** Jarvis/Felipe

**Descrição:**
Migrar dados do sistema atual para o novo:

**Dados:**
- [ ] Clientes
- [ ] Contratos
- [ ] Projetos
- [ ] Tarefas
- [ ] Usuários
- [ ] Configurações

**Processo:**
1. Exportar do sistema antigo
2. Transformar para novo schema
3. Validar integridade
4. Importar para novo Supabase
5. Testar consistência

---

#### Issue #19: [FASE-5] Criar documentação técnica
**Labels:** `fase-5`, `prioridade-media`, `docs`
**Assignee:** Tech Team

**Descrição:**
Documentar o sistema para manutenção:

**Documentação:**
- [ ] README.md atualizado
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Guia de deploy
- [ ] Guia de troubleshooting
- [ ] Documentação de agentes
- [ ] Runbook de incidentes

---

#### Issue #20: [FASE-5] Testes end-to-end antes do go live
**Labels:** `fase-5`, `prioridade-alta`, `testing`
**Assignee:** QA Team

**Descrição:**
Testar todo o sistema antes de colocar em produção:

**Testes:**
- [ ] Testes unitários (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] Testes de integração (APIs)
- [ ] Testes de carga
- [ ] Testes de segurança
- [ ] Testes dos agentes (cenários reais)

**Critérios de aceitação:**
- 90%+ coverage
- 0 bugs críticos
- SLA de resposta < 2s
- Uptime 99.9%

---

## 📅 MILESTONES SUGERIDOS

### Milestone 1: Fase 1 - Setup (Semana 1)
**Data:** DD/MM/AAAA
**Issues:** #1, #2, #3
**Objetivo:** Infraestrutura pronta

### Milestone 2: Fase 2 - Frontend (Semanas 2-3)
**Data:** DD/MM/AAAA
**Issues:** #4, #5, #6, #7
**Objetivo:** UI completa e integrada

### Milestone 3: Fase 3 - Backend (Semanas 3-4)
**Data:** DD/MM/AAAA
**Issues:** #8, #9, #10
**Objetivo:** APIs funcionando

### Milestone 4: Fase 4 - Agentes (Semanas 4-6)
**Data:** DD/MM/AAAA
**Issues:** #11, #12, #13, #14, #15, #16
**Objetivo:** 8 agentes implementados

### Milestone 5: Fase 5 - Go Live (Semana 6)
**Data:** DD/MM/AAAA
**Issues:** #17, #18, #19, #20
**Objetivo:** Sistema em produção

---

## 🎯 CRITÉRIOS DE SUCESSO

- [ ] 8 agentes funcionando (Miguel, Liz, Jarvis, TARS, Controlador, Cartógrafo, Vendedor, Diretor Arte, Especialista CRM)
- [ ] Sistema no ar no VPS Stark
- [ ] Integração com n8n e Kommo
- [ ] 90%+ test coverage
- [ ] Documentação completa
- [ ] 0 bugs críticos

---

*Documento criado em: 2026-04-01*
*Baseado em: ANÁLISE_TOTUM_SYSTEM.md, PLANO_IMPLEMENTACAO_30DIAS.md*
