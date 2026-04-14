# 🚀 PASSO D — PLANO DE EXECUÇÃO COMPLETO

**Data Inicio**: 2026-04-12  
**Status**: 🔴 EM PROGRESSO  
**Objetivo**: Implementar orquestração n8n com 39 agentes elizaOS

---

## 📊 RESUMO EXECUTIVO

| Fase | Tarefa | Tempo | Status |
|------|--------|-------|--------|
| **1** | Setup n8n + Credenciais | 1 dia | ⏳ |
| **2** | API Integration elizaOS | 1 dia | ⏳ |
| **3** | Workflow 1: Lead Intake | 1-2 dias | ⏳ |
| **4** | Workflows 2-5: Essenciais | 3-5 dias | ⏳ |
| **5** | Logging + Monitoring | 2-3 dias | ⏳ |
| **6** | Documentação + QA | 2 dias | ⏳ |
| **TOTAL** | Sistema Completo | **1-2 semanas** | 🔄 |

---

## 🎯 FASE 1: SETUP N8N

### 1.1 Decisão: Cloud vs Self-Hosted

```
RECOMENDAÇÃO: n8n Cloud (n8n.io/cloud)

Razões:
✅ Zero configuração de infraestrutura
✅ HTTPS automático (importante para webhooks)
✅ Free tier: 50 execuções/mês
✅ Pro tier: $25/mês (workflows ilimitados)
✅ Suporte oficial
✅ Backups automáticos
```

### 1.2 Passos de Setup

```
1. Acessar https://n8n.io/cloud
2. Sign up com email: israel@totumdev.com
3. Confirmar email
4. Dashboard aberto ✓
5. Anotar: Base URL (https://xxx.app.n8n.cloud)
6. Anotar: API Key (Admin Settings → API)
```

### 1.3 Credenciais Necessárias

```
Integração com:
☐ elizaOS (URL base: https://apps-totum-oficial.vercel.app)
☐ Supabase (para logging em agent_executions)
☐ Slack (webhooks para notificações)
☐ Email (SMTP para relatórios)
☐ APIs Externas (NewsAPI, Twitter, etc)

Armazenar em n8n:
- elizaOS API base URL
- Supabase connection string
- Slack Bot Token
- Email SMTP credentials
```

---

## 🎯 FASE 2: API INTEGRATION

### 2.1 Testar Endpoint Crítico

```bash
# Test POST /api/agents/:id/execute

curl -X POST https://apps-totum-oficial.vercel.app/api/agents/loki/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Novo lead: João Silva, empresa Tech XYZ",
    "context": {
      "source": "n8n",
      "workflow": "lead-analysis",
      "timestamp": "2026-04-12T10:00:00Z"
    }
  }'

# Resposta esperada:
{
  "success": true,
  "response": "Análise: João é qualified lead. Score 8.5/10...",
  "metadata": {
    "agent_id": "loki",
    "tokens_used": 450,
    "model": "claude",
    "duration_ms": 2345,
    "score": 8.5
  }
}
```

### 2.2 Criar n8n Credentials

```
Em n8n Dashboard:
1. Settings → Credentials
2. New → HTTP Basic Auth
   Name: elizaOS-API
   URL: https://apps-totum-oficial.vercel.app
   (leave auth blank if no auth needed yet)
3. Test connection
4. Save
```

---

## 🎯 FASE 3: WORKFLOW 1 - LEAD INTAKE

**Objetivo**: Receber lead → Analisar com LOKI → Notificar

**Trigger**: Webhook POST /lead-intake  
**Agentes**: LOKI  
**Output**: Slack notification + Supabase log

### 3.1 Canvas Nodes

```
[Webhook] 
    ↓
[LOKI Execute] (HTTP POST /api/agents/loki/execute)
    ↓
[IF Score > 7?]
    ├─ TRUE → [Slack Notify] + [Log Success]
    └─ FALSE → [Archive] + [Log Low Score]
    ↓
[End]
```

### 3.2 Node Details

#### Node 1: Webhook
```
- Method: POST
- Path: /lead-intake
- Authentication: None (public)
- Auto-generate webhook URL
```

#### Node 2: LOKI Execute
```
- Type: HTTP Request
- Method: POST
- URL: {{$vars.elizaOS_base_url}}/api/agents/loki/execute
- Headers:
  Content-Type: application/json
- Body (JSON):
{
  "message": "{{$node['Webhook'].json.lead_info}}",
  "context": {
    "source": "n8n",
    "workflow": "lead-intake",
    "timestamp": "{{now().toIso()}}"
  }
}
- Timeout: 30s
```

#### Node 3: IF Condition
```
- Condition: $node['LOKI Execute'].json.metadata.score > 7
- Type: Number
- Comparison: greater than
- Value: 7
```

#### Node 4a: Slack Notify (TRUE path)
```
- Type: Slack
- Webhook URL: [connect Slack workspace]
- Message:
  "🔥 LEAD QUALIFICADO!
  
  {{$node['LOKI Execute'].json.response}}
  
  Score: {{$node['LOKI Execute'].json.metadata.score}}/10"
- Channel: #sales
```

#### Node 4b: Archive (FALSE path)
```
- Type: Supabase
- Operation: Insert
- Table: agent_executions
- Record:
  {
    "agent_id": "loki",
    "workflow_name": "lead-intake",
    "status": "archived",
    "input_data": $node['Webhook'].json,
    "output_data": $node['LOKI Execute'].json,
    "created_at": "{{now().toIso()}}"
  }
```

#### Node 5: Log Success (TRUE path)
```
- Type: Supabase
- Operation: Insert
- Table: agent_executions
- Record:
  {
    "agent_id": "loki",
    "workflow_name": "lead-intake",
    "status": "success",
    "input_data": $node['Webhook'].json,
    "output_data": $node['LOKI Execute'].json,
    "metadata": {"score": $node['LOKI Execute'].json.metadata.score},
    "created_at": "{{now().toIso()}}"
  }
```

### 3.3 Teste

```bash
# Test webhook
curl -X POST https://seu-n8n.cloud/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d '{
    "lead_info": "João Silva, CEO da Tech XYZ, 50 funcionários, budget 100k"
  }'

# Esperado:
# ✓ LOKI executa análise
# ✓ Se score > 7: Slack notification chega
# ✓ Supabase registra execução
```

---

## 🎯 FASE 4: WORKFLOWS 2-5 (ESSENCIAIS)

### Workflow 2: Daily News Digest

**Trigger**: Scheduler (08:00 UTC)  
**Agentes**: SCRAPER-WEB, ANALYZER, FORMATTER  
**Output**: Email com relatório

```
[Cron 08:00 UTC]
    ↓
[NewsAPI GET articles]
    ↓
[For Each article]
    ├─ SCRAPER-WEB extract content
    ├─ ANALYZER create insights
    └─ Format result
    ↓
[FORMATTER create HTML report]
    ↓
[Send Email]
    ↓
[Log execution]
```

### Workflow 3: Social Content Generator

**Trigger**: Scheduler (Mon+Thu 14:00 UTC) OR Manual  
**Agentes**: WANDA, KVIRTUALOSO, VISU  
**Output**: Google Sheets + Slack

```
[Trigger]
    ↓
[Get trending topics (Twitter API)]
    ↓
[WANDA ideate]
    ↓
[KVIRTUALOSO write posts]
    ↓
[VISU generate image prompts]
    ↓
[Insert Google Sheets]
    ↓
[Notify Slack #content]
```

### Workflow 4: CRM Lead Sync

**Trigger**: Webhook (Pipedrive integration)  
**Agentes**: LOKI, NOTIFIER  
**Output**: Pipedrive updated + Slack

```
[Pipedrive Webhook: new deal]
    ↓
[LOKI analyze]
    ↓
[Update Pipedrive with score]
    ↓
[IF score > 8]: Assign specific team
    ↓
[Slack notify team]
    ↓
[Log execution]
```

### Workflow 5: Data Cleaning (Nightly)

**Trigger**: Scheduler (23:00 UTC)  
**Agentes**: CLEANER, VALIDATOR, DEDUPE  
**Output**: Database + Report

```
[Cron 23:00 UTC]
    ↓
[Get yesterday's data from Supabase]
    ↓
[CLEANER: remove duplicates]
    ↓
[VALIDATOR: check quality]
    ↓
[DEDUPE: merge similar records]
    ↓
[Insert cleaned data]
    ↓
[Email report to admins]
```

---

## 🎯 FASE 5: LOGGING & MONITORING

### 5.1 Logging Setup

```
Cada workflow DEVE incluir ao final:

Node: Supabase Insert
├─ Table: agent_executions
├─ Record:
   {
     "agent_id": "agentname",
     "workflow_name": "workflow-name",
     "status": "success|error|warning",
     "input_data": {...},
     "output_data": {...},
     "error_message": null (if success),
     "metadata": {
       "tokens_used": 123,
       "duration_ms": 2345,
       "model": "claude"
     },
     "created_at": "now()",
     "completed_at": "now()"
   }
```

### 5.2 Alerting

```
Configure em n8n Settings:
- Workflow error notifications → email
- High latency alert (>5s)
- Failed executions tracking
- Daily summary report
```

### 5.3 Dashboard View

```
elizaOS Dashboard → New Tab "Agent Executions"
- Show agent_executions table
- Filter by agent, workflow, date range
- Show success rate, avg latency
- Export reports to CSV
```

---

## 📋 ARQUIVOS A CRIAR

```
/Execução/
├── PASSO_D_WORKFLOWS_DEFINITIONS.json    ← Todos 5 workflows
├── N8N_CREDENTIALS_SETUP.md              ← Guia credenciais
├── N8N_WORKFLOWS_DOCUMENTATION.md        ← Docs de cada workflow
├── N8N_API_INTEGRATION_SPEC.md           ← API spec detalhado
├── N8N_MONITORING_DASHBOARD.md           ← Dashboard setup
├── N8N_TROUBLESHOOTING_GUIDE.md          ← Debugging
├── AGENTES_ELIZAOS_EXECUCAO_LOG.md       ← Log de execuções
└── PASSO_D_CHECKLIST_FINAL.md            ← Checklist final
```

---

## 🔧 PRÓXIMAS TAREFAS

- [ ] Setup n8n Cloud account
- [ ] Test elizaOS API endpoints
- [ ] Create Workflow 1: Lead Intake
- [ ] Test Workflow 1 with real data
- [ ] Create Workflows 2-5
- [ ] Setup Supabase logging
- [ ] Configure alerting
- [ ] Create documentation
- [ ] Final testing & QA
- [ ] Deploy to production
- [ ] Monitor for 24 hours
- [ ] Mark PASSO D COMPLETO

---

**Começando agora... 🚀**
