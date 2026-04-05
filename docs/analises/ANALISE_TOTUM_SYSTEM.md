# 🔍 ANÁLISE DO TOTUM-SYSTEM
## Integração com Agentes de IA

**Repositório:** https://github.com/grupototum/totum-system  
**Análise realizada em:** 2026-04-01  
**Analisado por:** Claude (Totum)

---

## 📊 VISÃO GERAL DO SISTEMA

O `totum-system` é um ERP completo construído com:
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Autenticação:** Supabase Auth
- **Infra:** Preparado para deploy no Stark (VPS)

---

## 🏗️ ESTRUTURA EXISTENTE

### Módulos Principais:

| Módulo | Arquivo | Funcionalidade | Status |
|--------|---------|----------------|--------|
| **Clientes** | `Clients.tsx` | Listagem, cadastro, filtros, status | ✅ Completo |
| **Central do Cliente** | `ClientHub.tsx` | Hub unificado do cliente | ✅ Completo |
| **Tarefas** | `Tasks.tsx` | Gestão de tarefas e checklists | ✅ Completo |
| **Projetos** | `Projects.tsx` | Gestão de projetos | ✅ Completo |
| **Financeiro** | `Financial.tsx` | MRR, receitas, despesas | ✅ Completo |
| **Dashboard Executivo** | `ExecutiveDashboard.tsx` | KPIs e métricas | ✅ Completo |
| **Contratos** | `Contracts.tsx` | Gestão de contratos | ✅ Completo |
| **Entregas** | `Fulfillment.tsx` | Acompanhamento de entregas | ✅ Completo |
| **Produtos/Pacotes** | `Products.tsx`, `Packages.tsx` | Catálogo de serviços | ✅ Completo |
| **Configurações** | `SettingsPage.tsx`, `AdminSettings.tsx` | Config do sistema | ✅ Completo |
| **Permissões** | `UsersPermissions.tsx` | RBAC (controle de acesso) | ✅ Completo |
| **Biblioteca POP** | `PopLibrary.tsx` | Documentação de processos | ✅ Completo |
| **SLA** | `SlaRules.tsx` | Regras de SLA | ✅ Completo |
| **Importação** | `DataImport.tsx` | Importação de dados | ✅ Completo |
| **Relatórios** | `Reports.tsx` | Relatórios diversos | ✅ Completo |

---

## 🔗 OPORTUNIDADES DE INTEGRAÇÃO

### 1. INTEGRAÇÃO: Agentes ↔ Central do Cliente

**O que já existe:**
- ClientHub com tabs: Entregas, Contratos, Cobranças, Timeline, Análise, Pendências
- Sistema de clientes com status, planos, MRR
- Timeline de eventos

**O que falta para integrar os Agentes:**

```typescript
// Novas tabs no ClientHub:
tabs = [
  ...tabs_existentes,
  { value: "agents", label: "Agentes Ativos", icon: Bot },      // NOVO
  { value: "workflows", label: "Workflows", icon: Workflow },   // NOVO
  { value: "conversations", label: "Conversas", icon: MessageSquare } // NOVO
]
```

**Implementação sugerida:**
- Criar tabela `client_agents` no Supabase
- Cada registro: cliente_id, agente_id, status, configurações
- Exibir no ClientHub quais agentes atendem aquele cliente
- Mostrar histórico de interações por agente

---

### 2. INTEGRAÇÃO: Dashboard de Agentes

**Nova página:** `/agents` ou `/ia/agents`

**Componentes necessários:**
- Grid de cards (8 agentes)
- Status em tempo real (online/offline/pausado)
- Estatísticas de uso
- Toggle para ativar/desativar agentes por cliente
- Configuração de parâmetros (temperatura, modelo, etc)

**Estrutura da tabela `agents`:**
```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  codename TEXT UNIQUE, -- controlador, cartografo, vendedor, etc
  personality JSONB, -- configuração de personalidade
  triggers JSONB[], -- array de gatilhos
  slas JSONB,
  kpis JSONB,
  status TEXT DEFAULT 'active',
  config JSONB, -- configurações técnicas
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 3. INTEGRAÇÃO: Workflows de Agentes

**Nova página:** `/workflows` ou `/ia/workflows`

**Funcionalidades:**
- Visualização de workflows ativos por cliente
- Editor visual de workflows (node-based)
- Execução manual de workflows
- Logs de execução
- Métricas de sucesso/falha

**Estrutura da tabela `workflows`:**
```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  definition JSONB, -- definição do workflow (nodes, edges)
  status TEXT DEFAULT 'draft', -- draft, active, paused, archived
  trigger_type TEXT, -- webhook, schedule, manual, event
  schedule TEXT, -- cron expression (se aplicável)
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  status TEXT, -- running, completed, failed, cancelled
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  input JSONB,
  output JSONB,
  logs JSONB[],
  error_message TEXT
);
```

---

### 4. INTEGRAÇÃO: Sync de Central de Clientes

**O sistema já tem Clientes com:**
- Dados básicos (nome, email, telefone, CNPJ)
- Status (ativo, pausado, cancelado)
- Contratos e planos
- Usuário responsável (assigned_user_id)
- Tipo de cliente (client_types)

**O que precisamos adicionar para os Agentes:**

```sql
-- Campos adicionais na tabela clients:
ALTER TABLE clients ADD COLUMN IF NOT EXISTS 
  mapa_semantico JSONB, -- dados do Cartógrafo
  key_visual JSONB, -- dados do Diretor de Arte
  contexto_negocio TEXT, -- descrição detalhada
  publico_alvo JSONB, -- segmentação
  tom_voz TEXT, -- formal/descontraído/etc
  sla_esperado TEXT, -- 1h, 2h, 4h, etc
  canais_atendimento TEXT[], -- whatsapp, email, etc
  crm_integrado TEXT, -- kommo, hubspot, etc
  agentes_ativos UUID[]; -- referências aos agentes
```

---

### 5. INTEGRAÇÃO: Execução de Agentes (Edge Functions)

**Novas Supabase Edge Functions:**

```
supabase/functions/
├── agent-executor/          # Executor principal de agentes
├── agent-controlador/       # Lógica do Controlador
├── agent-cartografo/        # Lógica do Cartógrafo
├── agent-vendedor/          # Lógica do Vendedor
├── agent-diretor-arte/      # Lógica do Diretor de Arte
├── agent-crm/               # Lógica do Especialista CRM
├── agent-orquestrador/      # Lógica do Orquestrador TARS
├── workflow-engine/         # Motor de workflows
├── n8n-webhook/             # Webhook para n8n
└── kommo-integration/       # Integração Kommo
```

---

## 🎯 PLANO DE INTEGRAÇÃO PRÁTICA

### Fase 1: Setup de Dados (Dias 1-3)

1. **Criar tabelas no Supabase:**
   - `agents` - cadastro dos 8 agentes
   - `client_agents` - relação cliente-agente
   - `workflows` - definição de workflows
   - `workflow_executions` - logs de execução
   - `agent_conversations` - histórico de conversas

2. **Seed data:**
   ```sql
   INSERT INTO agents (name, codename, personality, status) VALUES
   ('Controlador Totum', 'controlador', '{...}', 'active'),
   ('Cartógrafo Totum', 'cartografo', '{...}', 'active'),
   ('Vendedor Totum', 'vendedor', '{...}', 'active'),
   ('Diretor de Arte', 'diretor_arte', '{...}', 'active'),
   ('Especialista CRM', 'especialista_crm', '{...}', 'active'),
   ('Orquestrador TARS', 'orquestrador', '{...}', 'active'),
   ('Atendente Totum', 'atendente', '{...}', 'active'),
   ('Gestor de Tráfego', 'gestor_trafego', '{...}', 'active');
   ```

### Fase 2: Frontend (Dias 4-7)

1. **Nova página:** `/agents` (Dashboard de Agentes)
   - Grid de cards com os 8 agentes
   - Status, estatísticas, ações
   - Integrar com tabela `agents`

2. **Modificar:** `ClientHub.tsx`
   - Adicionar tabs: Agentes, Workflows, Conversas
   - Mostrar agentes ativos para aquele cliente
   - Permitir ativar/desativar agentes

3. **Nova página:** `/workflows`
   - Lista de workflows por cliente
   - Editor visual (pode usar biblioteca como ReactFlow)
   - Logs de execução

### Fase 3: Backend (Dias 8-12)

1. **Edge Functions:**
   - `agent-executor` - endpoint genérico para executar qualquer agente
   - `workflow-engine` - orquestrador de workflows
   - Integrações específicas (n8n, Kommo)

2. **Hooks/Triggers:**
   - Trigger no Supabase para eventos (novo cliente, nova tarefa, etc)
   - Acionar agentes automaticamente via gatilhos

### Fase 4: Sincronização (Dias 13-15)

1. **Importar dados existentes:**
   - Sincronizar clientes do sistema com os agentes
   - Criar workflows padrão para cada tipo de cliente
   - Configurar gatilhos automáticos

2. **Testes:**
   - Testar execução de agentes
   - Verificar logs e métricas
   - Validar integrações

---

## 🔌 APIs DE INTEGRAÇÃO

### Endpoints necessários:

```typescript
// /api/agents
GET    /agents              // Lista todos os agentes
GET    /agents/:id          // Detalhes de um agente
POST   /agents/:id/execute  // Executa agente com payload
GET    /agents/:id/logs     // Logs do agente

// /api/workflows
GET    /workflows                    // Lista workflows
POST   /workflows                    // Cria workflow
GET    /workflows/:id                // Detalhes
PUT    /workflows/:id                // Atualiza
DELETE /workflows/:id                // Remove
POST   /workflows/:id/execute        // Executa manualmente
GET    /workflows/:id/executions     // Histórico

// /api/clients/:id/agents
GET    /clients/:id/agents           // Agentes do cliente
POST   /clients/:id/agents           // Adiciona agente ao cliente
DELETE /clients/:id/agents/:agentId  // Remove agente do cliente

// /api/n8n/webhook
POST   /n8n/webhook                  // Recebe webhooks do n8n

// /api/kommo/webhook
POST   /kommo/webhook                // Recebe webhooks do Kommo
```

---

## 📦 COMPONENTES REUTILIZÁVEIS

O sistema já tem uma biblioteca rica de componentes:

```
src/components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── select.tsx
├── tabs.tsx
├── toast.tsx
├── tooltip.tsx
└── ... (30+ componentes)
```

**Reutilizar para:**
- Cards de agentes
- Forms de configuração
- Modais de execução
- Toast notifications
- Tooltips informativos

---

## 🎨 DESIGN SYSTEM COMPATÍVEL

O sistema usa:
- **Cores:** Configuráveis via CSS variables
- **Fonte:** Inter (mesmo que sugerimos para agentes)
- **Border-radius:** Consistente (8px, 12px)
- **Sombras:** Sistema de shadows
- **Animações:** Framer Motion

**Ajuste necessário:** Adicionar cor laranja #f76926 como primary color

---

## ⚡ PRÓXIMOS PASSOS IMEDIATOS

1. **Clone o sistema localmente**
   ```bash
git clone https://github.com/grupototum/totum-system.git
   cd totum-system
   npm install
   ```

2. **Configure o Supabase local**
   ```bash
   supabase link --project-ref seu-project-id
   supabase db push
   ```

3. **Adicione as tabelas de agentes** (migrations)

4. **Crie a página `/agents`** usando os prompts do Lovable

5. **Modifique o `ClientHub.tsx`** para incluir tabs de agentes

6. **Deploy no Stark**
   ```bash
   npm run build
   # Configurar nginx no Stark para servir o build
   ```

---

## 🎯 RESUMO DA INTEGRAÇÃO

| Aspecto | Status | Ação |
|---------|--------|------|
| Clientes | ✅ Pronto | Usar tabela existente + campos novos |
| Central do Cliente | ✅ Pronto | Adicionar 3 tabs |
| Dashboard de Agentes | ❌ Não existe | Criar nova página |
| Workflows | ❌ Não existe | Criar nova página + tabelas |
| Execução de Agentes | ❌ Não existe | Criar Edge Functions |
| Integração n8n/Kommo | ❌ Não existe | Criar webhooks |
| Design System | ✅ Parcial | Ajustar cor primária |

---

## 💡 RECOMENDAÇÃO FINAL

**A integração é viável e altamente benéfica!**

O sistema `totum-system` já tem:
- ✅ Estrutura sólida de clientes
- ✅ Central do cliente completa
- ✅ Autenticação e permissões
- ✅ Dashboard executivo
- ✅ Biblioteca de POPs (Bíblia já está lá!)
- ✅ Gestão financeira

**Precisa adicionar:**
- 🆕 Módulo de Agentes (8 agentes)
- 🆕 Módulo de Workflows
- 🆕 Edge Functions para execução
- 🆕 Integrações n8n/Kommo

**Estimativa:** 15 dias para integração completa

---

*Análise concluída. Sistema pronto para integração!* 🚀
