# 📚 n8n WORKFLOWS — DOCUMENTAÇÃO COMPLETA

**Versão**: 1.0  
**Data**: 2026-04-12  
**Status**: Pronto para Deploy  
**Sistema**: elizaOS + n8n Orchestration

---

## 📑 ÍNDICE

1. [Setup Inicial](#setup-inicial)
2. [Credentials](#credentials)
3. [Workflow 1: Lead Intake](#workflow-1-lead-intake)
4. [Workflow 2: Daily Digest](#workflow-2-daily-digest)
5. [Workflow 3: Social Content](#workflow-3-social-content)
6. [Workflow 4: CRM Sync](#workflow-4-crm-sync)
7. [Workflow 5: Data Cleaning](#workflow-5-data-cleaning)
8. [Monitoring & Alerts](#monitoring--alerts)
9. [Troubleshooting](#troubleshooting)
10. [Deployment Checklist](#deployment-checklist)

---

## 🔧 SETUP INICIAL

### Opção A: n8n Cloud (RECOMENDADO)

```bash
1. Acesse https://n8n.io/cloud
2. Sign up com seu email
3. Confirme email
4. Dashboard aberto ✓

URL Base: https://seu-workspace.app.n8n.cloud
API Key: Gere em Settings → API
```

### Opção B: Self-Hosted (VPS 187.127.4.140)

```bash
# SSH
ssh root@187.127.4.140

# Docker Compose
mkdir -p /root/n8n && cd /root/n8n

# Criar docker-compose.yml (veja arquivo anexo)
# Rodar:
docker-compose up -d

# Acessar:
http://187.127.4.140:5678
```

**Recomendação**: n8n Cloud por ser mais simples e confiável.

---

## 🔐 CREDENTIALS

### 1. elizaOS API

```
Em n8n:
Settings → Credentials → New → HTTP Basic Auth

Name: elizaOS-API
URL: https://apps-totum-oficial.vercel.app
Auth: None (deixar vazio)

Test: POST /api/agents/loki/execute
Expected: 200 OK
```

### 2. Supabase

```
Settings → Credentials → New → Supabase

Name: Supabase-Connection
Project URL: https://cgpkfhrqprqptvehatad.supabase.co
API Key: [sua anon key]

Test: SELECT * FROM agent_executions LIMIT 1
Expected: Retorna dados
```

### 3. Slack

```
Settings → Credentials → New → Slack

Name: Slack-Workspace
Auth: OAuth 2.0 (conectar workspace)
Scopes: chat:write, chat:write.public

Webhook URL: Será gerado automaticamente
```

### 4. NewsAPI (para Daily Digest)

```
Settings → Credentials → New → Generic API

Name: NewsAPI-Key
Key: newsapi_key
Value: [sua chave de newsapi.org]
```

### 5. Twitter API (para Social Content)

```
Settings → Credentials → New → Twitter

Name: Twitter-API
API Key: [sua chave]
API Secret: [sua secret]
Auth: OAuth 2.0
```

### 6. Google Sheets (para Social Content)

```
Settings → Credentials → New → Google Drive

Name: Google-Sheets
Auth: OAuth 2.0 (conectar Google)
Scopes: sheets, drive
```

### 7. Email SMTP

```
Settings → Credentials → New → SMTP

Name: Email-SMTP
Host: smtp.gmail.com (ou seu provedor)
Port: 587
Username: seu@email.com
Password: [app password, não senha normal]
Encryption: TLS
```

### 8. Pipedrive CRM (para CRM Sync)

```
Settings → Credentials → New → Pipedrive

Name: Pipedrive-API
API Token: [seu token]
Company Domain: seu-dominio.pipedrive.com
```

---

## 🎯 WORKFLOW 1: LEAD INTAKE

**Objetivo**: Receber lead → LOKI analisa → Notifica se qualificado

**Diagrama**:
```
[POST /lead-intake] 
    ↓
[LOKI Analyze] 
    ↓
[IF score > 7?]
    ├─ YES → [Slack Notify]
    └─ NO → [Archive]
    ↓
[Log Execution]
```

### Passo a Passo

#### 1. Criar Webhook

```
Em n8n Canvas:
1. Clique "+" → Procure "Webhook"
2. Configure:
   - Method: POST
   - Path: /lead-intake
   - Send Response: Yes (default)
3. Save

Copie a URL do webhook:
https://seu-n8n.cloud/webhook/lead-intake
```

#### 2. Criar HTTP Request (LOKI)

```
1. Clique "+" depois do Webhook
2. Procure "HTTP Request"
3. Configure:
   - Method: POST
   - URL: {{$vars.elizaOS_base_url}}/api/agents/loki/execute
   - Auth: Credentials → elizaOS-API
   - Headers:
     Content-Type: application/json
   - Body (Raw JSON):
{
  "message": "{{$node['Webhook'].json.lead_info}}",
  "context": {
    "source": "n8n",
    "workflow": "lead-intake",
    "timestamp": "{{now().toIso()}}"
  }
}
4. Timeout: 30000ms
5. Save, Rename to "LOKI Analyze"
```

#### 3. Criar IF Condition

```
1. Clique "+" depois de "LOKI Analyze"
2. Procure "IF"
3. Configure:
   - Condition Field: $node['LOKI Analyze'].json.metadata.score
   - Operator: >
   - Value: 7
4. Save
   Cria 2 caminhos: TRUE e FALSE
```

#### 4. TRUE Path: Slack Notification

```
No caminho TRUE:
1. Clique "+" 
2. Procure "Slack"
3. Configure:
   - Credentials: Slack-Workspace
   - Channel: #sales
   - Message Text:
🔥 LEAD QUALIFICADO!

{{$node['LOKI Analyze'].json.response}}

Score: {{$node['LOKI Analyze'].json.metadata.score}}/10
Model: {{$node['LOKI Analyze'].json.metadata.model}}
4. Save
```

#### 5. FALSE Path: Supabase Archive

```
No caminho FALSE:
1. Clique "+"
2. Procure "Supabase"
3. Configure:
   - Credentials: Supabase-Connection
   - Operation: Insert
   - Table: agent_executions
   - Raw: On
   - Values (Raw):
{
  "agent_id": "loki",
  "workflow_name": "lead-intake",
  "status": "archived",
  "input_data": {{$node['Webhook'].json}},
  "output_data": {{$node['LOKI Analyze'].json}},
  "metadata": {
    "reason": "low_score",
    "score": {{$node['LOKI Analyze'].json.metadata.score}}
  },
  "created_at": "{{now().toIso()}}"
}
4. Save
```

#### 6. Testar Workflow

```bash
# Terminal
curl -X POST https://seu-n8n.cloud/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d '{
    "lead_info": "João Silva, CEO da Tech XYZ, 50 func, budget 100k"
  }'

# Esperado:
# ✓ LOKI executa (verá no canvas)
# ✓ Slack notificação chega (ou arquivo se score < 7)
# ✓ Supabase registra em agent_executions
```

---

## 📰 WORKFLOW 2: DAILY DIGEST

**Objetivo**: Todo dia 8h: busca notícias → analisa → formata → envia email

**Trigger**: Cron 08:00 UTC  
**Agentes**: SCRAPER-WEB, ANALYZER, FORMATTER

### Passo a Passo

#### 1. Criar Cron Trigger

```
1. Novo workflow
2. Clique "+" → "Cron"
3. Configure:
   - Cron Expression: 0 8 * * *
   - Timezone: UTC
4. Save (dispara todo dia 8h UTC)
```

#### 2. Get News API

```
1. Clique "+" → "HTTP Request"
2. Configure:
   - Method: GET
   - URL: https://newsapi.org/v2/top-headlines?country=br&apiKey={{$vars.newsapi_key}}&pageSize=10
   - Timeout: 10000ms
3. Save, Rename to "Get News"
```

#### 3. Loop Articles

```
1. Clique "+" → "Loop Over Items"
2. Configure:
   - Items: {{$node['Get News'].json.articles}}
   - Max iterations: 10
3. Save
```

#### 4. For Each: SCRAPER-WEB

```
Inside loop:
1. Clique "+" → "HTTP Request"
2. Configure:
   - Method: POST
   - URL: {{$vars.elizaOS_base_url}}/api/agents/scraper-web/execute
   - Body:
{
  "message": "Extrair conteúdo: {{$items().current().title}} - {{$items().current().url}}",
  "context": {
    "source": "n8n",
    "workflow": "daily-digest"
  }
}
3. Save, Rename to "SCRAPER"
```

#### 5. For Each: ANALYZER

```
1. Clique "+" → "HTTP Request"
2. Configure:
   - Method: POST
   - URL: {{$vars.elizaOS_base_url}}/api/agents/analyzer-metrics/execute
   - Body:
{
  "message": "Fazer análise e insights: {{$node['SCRAPER'].json.response}}",
  "context": {
    "source": "n8n",
    "workflow": "daily-digest"
  }
}
3. Save, Rename to "ANALYZER"
```

#### 6. Aggregate Results

```
1. Depois do loop, clique "+"
2. Procure "Aggregate"
3. Configure:
   - Aggregate Field: {{$node['ANALYZER'].json.response}}
   - Output: Array de todos respostas
4. Save
```

#### 7. FORMATTER

```
1. Clique "+" → "HTTP Request"
2. Configure:
   - Method: POST
   - URL: {{$vars.elizaOS_base_url}}/api/agents/formatter/execute
   - Body:
{
  "message": "Formatar como HTML email bonito para enviar: {{$node['Aggregate'].json}}",
  "context": {
    "source": "n8n",
    "workflow": "daily-digest"
  }
}
3. Save, Rename to "FORMATTER"
```

#### 8. Send Email

```
1. Clique "+" → "Email Send"
2. Configure:
   - Credentials: Email-SMTP
   - To: israel@totumdev.com
   - Subject: 📰 Daily News Digest - {{now().format('YYYY-MM-DD')}}
   - HTML Body: {{$node['FORMATTER'].json.response}}
3. Save
```

---

## 🎨 WORKFLOW 3: SOCIAL CONTENT

**Objetivo**: 2x/semana (seg+qui 14h): gera conteúdo social + prompts imagem

**Trigger**: Cron 14:00 UTC (Monday, Thursday)  
**Agentes**: WANDA, KVIRTUALOSO, VISU

### Rápido

```
[Cron Mon+Thu 14:00]
   ↓
[Twitter Trending Topics]
   ↓
[WANDA ideate]
   ↓
[KVIRTUALOSO write posts]
   ↓
[VISU image prompts]
   ↓
[Google Sheets insert]
   ↓
[Slack notify]
```

**Tempo**: 15 min para criar

---

## 🔄 WORKFLOW 4: CRM SYNC

**Objetivo**: Pipedrive webhook → LOKI analisa → atualiza CRM

**Trigger**: Webhook Pipedrive  
**Agentes**: LOKI, NOTIFIER

### Quick Setup

```
1. Criar Webhook → path: /pipedrive-lead
2. Extract deal info (Pipedrive data)
3. LOKI Execute
4. IF score > 8: label "hot_lead"
5. Else: label "regular_lead"
6. Slack notify team
```

---

## 🧹 WORKFLOW 5: DATA CLEANING

**Objetivo**: Toda noite 23h: limpa dados, valida, deduplica

**Trigger**: Cron 23:00 UTC  
**Agentes**: CLEANER, VALIDATOR, DEDUPE

### Quick Setup

```
1. Cron 23:00 UTC
2. Supabase SELECT yesterday's agent_executions
3. CLEANER remove junk
4. VALIDATOR quality check
5. DEDUPE merge duplicates
6. Archive old records
7. Email admin report
```

---

## 📊 MONITORING & ALERTS

### Logging Automático

Todos workflows DEVEM inserir em `agent_executions`:

```json
{
  "agent_id": "agent-name",
  "workflow_name": "workflow-name",
  "status": "success|error|warning",
  "input_data": {...},
  "output_data": {...},
  "error_message": null,
  "metadata": {
    "tokens_used": 450,
    "duration_ms": 2345,
    "model": "claude"
  },
  "created_at": "ISO timestamp",
  "completed_at": "ISO timestamp"
}
```

### Dashboard elizaOS

```
Novo tab "Agent Executions":
- SELECT * FROM agent_executions
- Filtro: agent, workflow, date range, status
- Gráficos: success rate, latency trend
- Export: CSV, PDF
```

### Alertas em n8n

```
Settings → Alerts:

1. Workflow Error:
   - Send email to israel@totumdev.com
   - Include: workflow name, error message, timestamp

2. High Latency:
   - If execution > 5000ms
   - Log em Slack #devops

3. Failed Executions:
   - If status = error
   - Send summary email 1x/dia
```

---

## 🆘 TROUBLESHOOTING

### Erro: "Agent not found"

```
✗ Problema: POST /api/agents/loki/execute → 404
✓ Solução:

1. Verificar agente existe:
   GET https://apps-totum-oficial.vercel.app/api/agents
   Procura "loki" na lista

2. Se não existe:
   - Criar agente no dashboard elizaOS
   - Ou use outro agente existente

3. Se existe:
   - Verificar URL completa
   - Testar manualmente com curl
```

### Erro: "Supabase connection failed"

```
✗ Problema: Insert em agent_executions falha
✓ Solução:

1. Verificar credenciais:
   Settings → Credentials → Supabase-Connection
   - URL correta?
   - API Key válida?

2. Testar conexão:
   Clique "Test connection"

3. RLS policy:
   Supabase Dashboard → SQL:
   SELECT * FROM information_schema.table_constraints
   WHERE table_name = 'agent_executions'

4. Se RLS bloqueando:
   ALTER TABLE agent_executions DISABLE ROW LEVEL SECURITY;
```

### Erro: "Workflow timeout"

```
✗ Problema: Workflow demora > 5min
✓ Solução:

1. Ver qual node está lento:
   Canvas → Clique node → Ver output

2. Aumentar timeout:
   HTTP nodes: Timeout → 60000ms

3. Se ainda lento:
   - Agente travado?
   - Servidor down?
   - Muitos dados processando?

4. Considerar:
   - Batching (processar em lotes)
   - Parallel execution
   - Caching resultados
```

### Erro: "Slack message not sending"

```
✗ Problema: Slack node falha
✓ Solução:

1. Verificar credenciais:
   - Slack workspace conectado?
   - Token válido?
   - Bot tem permissão?

2. Verificar channel:
   - Channel existe?
   - Spelling correto? (#sales não Sales)
   - Bot membro do channel?

3. Se ainda falha:
   - Testar POST manualmente:
     curl -X POST https://hooks.slack.com/services/XXX \
       -d '{"text":"test"}'

4. Logs:
   n8n Dashboard → Logs → Procura "Slack"
```

### Erro: "Cron não executa"

```
✗ Problema: Workflow agendado não roda
✓ Solução:

1. Verificar toggle:
   Workflow → Ativar (toggle deve estar ON)

2. Verificar cron expression:
   - 0 8 * * * = 8h UTC
   - 0 14 * * 1,4 = seg+qui 14h
   - Use crontab.guru para validar

3. Verificar timezone:
   n8n Settings → Timezone = UTC?

4. Se faltou execução:
   - Ver logs: Workflow → Logs
   - Pode ter erro que bloqueou

5. Manual trigger:
   Clique "Execute workflow" pra testar
```

---

## ✅ DEPLOYMENT CHECKLIST

```
Antes de ATIVAR workflows em produção:

INFRASTRUCTURE:
[ ] n8n rodando e acessível
[ ] HTTPS funciona (se Cloud)
[ ] Backups automáticos ativados
[ ] Monitoramento de uptime

CREDENTIALS:
[ ] elizaOS API testado
[ ] Supabase conexão OK
[ ] Slack workspace conectado
[ ] Email SMTP funcionando
[ ] NewsAPI key válida
[ ] Twitter API conectado
[ ] Google Sheets OAuth OK
[ ] Pipedrive token válido

WORKFLOWS:
[ ] Workflow 1 (Lead Intake) testado
[ ] Workflow 2 (Daily Digest) testado
[ ] Workflow 3 (Social Content) testado
[ ] Workflow 4 (CRM Sync) testado
[ ] Workflow 5 (Data Cleaning) testado

LOGGING & MONITORING:
[ ] agent_executions table OK
[ ] Logging node em todos workflows
[ ] Alertas configurados
[ ] Dashboard elizaOS mostrando execuções
[ ] Email reports funcionando

DOCUMENTATION:
[ ] Todos workflows documentados
[ ] Webhook URLs compartilhadas
[ ] Credenciais backup guardado
[ ] Runbook de emergency criado
[ ] Commits no GitHub

FINAL:
[ ] Teste end-to-end com dados reais
[ ] Monitorar 24h antes de full production
[ ] Status page criado (statuspage.io?)
[ ] Team treinado
[ ] SLA documentado (50+ execuções/dia)
```

---

## 📈 MÉTRICAS DE SUCESSO

```
Diariamente:
- Workflows executados: >50 (meta)
- Taxa de sucesso: >95%
- Latência média: <5s
- Erros: 0-2 máximo

Semanalmente:
- Leads processados: >100
- Conteúdo gerado: 6+ posts
- Dados limpos: 1000+ registros

Mensalmente:
- Custo de execução: <R$ 100 (Cloud plan)
- ROI: R$ 500+ economizado em automação
- Otimizações: 1-2 melhorias implementadas
```

---

## 🚀 PRÓXIMAS VERSÕES

```
V2.0 (semana 3-4):
- Machine Learning para spam detection
- A/B testing em posts
- Dashboard avançado com Grafana
- Webhook rate limiting
- Advanced scheduling

V3.0 (mês 2):
- Integrações HubSpot + Salesforce
- Geração de relatórios PDF
- Versionamento automático workflows
- API webhook management
- Multi-tenant support
```

---

**Documento final. Pronto para implementação! 🚀**

Para dúvidas, consulte [TROUBLESHOOTING](#troubleshooting) ou abra issue no GitHub.
