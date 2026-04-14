# N8N CLOUD INTEGRATION - COMPLETE DEPLOYMENT GUIDE

**Status**: 🚀 INICIANDO  
**Timeline**: Dias 5-6 (48 horas)  
**Target**: 20 workflows, 37 agentes, 10 credenciais

---

## 📋 PRÉ-REQUISITOS

✅ n8n Cloud account criada (PASSO D)  
✅ Credenciais preparadas (10 tipos)  
✅ elizaOS API validada  
✅ Supabase projeto configurado  
✅ Webhook URLs definidas

---

## 🔧 FASE 3: N8N INTEGRATION (Dias 5-6)

### ETAPA 1: Preparar 20 Workflows para n8n (Dia 5 - 4h)

#### WF-001 a WF-011: Workflows Core

**WF-001: Lead Intake Analysis (ARTEMIS)**
```json
{
  "name": "Lead Intake Analysis (ARTEMIS)",
  "active": true,
  "trigger": {
    "type": "webhook",
    "path": "leads/intake"
  },
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "config": {
        "httpMethod": "POST",
        "path": "leads/intake"
      }
    },
    {
      "name": "Execute ARTEMIS",
      "type": "n8n-nodes-base.httpRequest",
      "config": {
        "method": "POST",
        "url": "https://api.elizaos.local/agents/ARTEMIS/execute",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {{env.ELIZAOS_API_KEY}}"
        },
        "body": {
          "message": "{{$json.lead_data}}",
          "context": {
            "source": "{{$json.source}}",
            "timestamp": "{{$now.toISOString()}}"
          }
        },
        "timeout": 30
      }
    },
    {
      "name": "IF Score > 7.5",
      "type": "n8n-nodes-base.if",
      "config": {
        "conditions": {
          "number": [{
            "value1": "{{$json.response.score}}",
            "operation": "greaterThan",
            "value2": 7.5
          }]
        }
      }
    },
    {
      "name": "Slack Hot Lead",
      "type": "n8n-nodes-base.slack",
      "config": {
        "channel": "#sales-hot-leads",
        "text": "🔥 Hot Lead: {{$json.response.name}} (Score: {{$json.response.score}}/10)"
      }
    },
    {
      "name": "Pipedrive Update",
      "type": "n8n-nodes-base.pipedrive",
      "config": {
        "operation": "create",
        "resource": "deal",
        "title": "{{$json.response.name}}",
        "stage": "qualified"
      }
    },
    {
      "name": "Log to Supabase",
      "type": "n8n-nodes-base.postgres",
      "config": {
        "query": "INSERT INTO agent_executions (agent_id, status, input, output, tokens_used, duration_ms, model, success_score) VALUES ('ARTEMIS', 'completed', $1, $2, $3, $4, $5, $6)",
        "parameters": [
          "{{JSON.stringify($json.input)}}",
          "{{JSON.stringify($json.response)}}",
          "{{$json.response.tokens_used || 0}}",
          "{{Date.now() - $json.startTime}}",
          "{{$json.response.model}}",
          "{{$json.response.score}}"
        ]
      }
    }
  ]
}
```

**WF-003: Social Content Generator (ECHO+CREATOR)**
```json
{
  "name": "Social Content Generator (ECHO+CREATOR)",
  "active": true,
  "trigger": {
    "type": "cron",
    "expression": "0 14 * * 1,4"
  },
  "nodes": [
    {
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "config": {
        "cronExpression": "0 14 * * 1,4"
      }
    },
    {
      "name": "Get Trending Topics",
      "type": "n8n-nodes-base.twitter",
      "config": {
        "operation": "getTrends",
        "location": "worldwide"
      }
    },
    {
      "name": "Execute ECHO",
      "type": "n8n-nodes-base.httpRequest",
      "config": {
        "method": "POST",
        "url": "https://api.elizaos.local/agents/ECHO/execute",
        "body": {
          "message": "Analyze trends: {{$json.trends}}",
          "context": {"analysis_type": "strategic_planning"}
        }
      }
    },
    {
      "name": "Execute WANDA",
      "type": "n8n-nodes-base.httpRequest",
      "config": {
        "method": "POST",
        "url": "https://api.elizaos.local/agents/WANDA/execute",
        "body": {
          "message": "{{$json.strategy}} - Create content ideas",
          "context": {"trends": "{{$json.trends}}"}
        }
      }
    },
    {
      "name": "Execute CREATOR",
      "type": "n8n-nodes-base.httpRequest",
      "config": {
        "method": "POST",
        "url": "https://api.elizaos.local/agents/CREATOR/execute",
        "body": {
          "message": "Optimize for LinkedIn: {{$json.ideas}}",
          "context": {"platform": "linkedin"}
        }
      }
    },
    {
      "name": "Execute VISU",
      "type": "n8n-nodes-base.httpRequest",
      "config": {
        "method": "POST",
        "url": "https://api.elizaos.local/agents/VISU/execute",
        "body": {
          "descriptions": "{{$json.image_prompts}}"
        }
      }
    },
    {
      "name": "Insert Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "config": {
        "operation": "insert",
        "sheetId": "{{env.GOOGLE_SHEET_ID}}",
        "range": "A:E",
        "values": [
          ["{{$json.content}}", "social", "{{$json.image_url}}", "{{new Date()}}", "pending"]
        ]
      }
    },
    {
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "config": {
        "channel": "#content-team",
        "text": "📱 {{$json.count}} posts criados para semana"
      }
    }
  ]
}
```

**[Continuar com WF-004 até WF-017...]**

#### WF-012 a WF-017: Specialized Workflows (Esboço)

```
WF-012: Opportunity Match (SOLVER)
WF-013: Product Roadmap (ARCHITECT)
WF-014: A/B Testing (ANALYZER-EXP)
WF-015: Crisis Response (GUARDIAN+LOKI)
WF-016: Lead Nurture Sequence
WF-017: Quarterly Business Review
WF-018, 19, 20: Reserved for Future
```

### ETAPA 2: Configurar 10 Credenciais (Dia 5 - 2h)

```bash
1. elizaOS API
   └─ Type: HTTP Basic Auth / Bearer Token
   └─ Token: {{env.ELIZAOS_API_KEY}}

2. Supabase
   └─ Type: Postgres
   └─ Host: {{env.SUPABASE_HOST}}
   └─ Database: postgres
   └─ User: {{env.SUPABASE_USER}}
   └─ Password: {{env.SUPABASE_PASSWORD}}

3. Slack
   └─ Type: Slack
   └─ Bot Token: {{env.SLACK_BOT_TOKEN}}

4. NewsAPI
   └─ Type: HTTP Bearer
   └─ Token: {{env.NEWSAPI_KEY}}

5. Twitter API v2
   └─ Type: HTTP Bearer
   └─ Token: {{env.TWITTER_API_KEY}}

6. Google Sheets
   └─ Type: OAuth2
   └─ Connect via UI
   └─ Authorize n8n account

7. Email SMTP
   └─ Type: Email
   └─ Host: {{env.SMTP_HOST}}
   └─ Port: {{env.SMTP_PORT}}
   └─ User: {{env.SMTP_USER}}
   └─ Password: {{env.SMTP_PASSWORD}}

8. Pipedrive
   └─ Type: Pipedrive
   └─ API Token: {{env.PIPEDRIVE_TOKEN}}

9. LinkedIn API
   └─ Type: OAuth2
   └─ Connect via UI
   └─ Authorize account

10. App Store Connect
    └─ Type: HTTP Bearer
    └─ Token: {{env.APP_STORE_TOKEN}}
```

### ETAPA 3: Deploy Workflows to n8n Cloud (Dia 6 - 4h)

**Processo**:
1. Login n8n.io dashboard
2. Create new workflow para cada WF (WF-001 a WF-017)
3. Copiar JSON definitions
4. Configure credenciais
5. Test cada workflow
6. Ativar (set active=true)
7. Verificar webhook URLs

**Webhook URLs Geradas**:
```
POST https://[seu-n8n-instance].app/webhook/leads/intake
POST https://[seu-n8n-instance].app/webhook/crm/pipedrive
POST https://[seu-n8n-instance].app/webhook/crm/opportunity
POST https://[seu-n8n-instance].app/webhook/crisis/detection
```

### ETAPA 4: Setup Triggers & Webhooks (Dia 6 - 2h)

**Cron Triggers**:
- Daily 08:00 UTC: Daily Digest (WF-002)
- Daily 08:00 UTC: Retention Engine (WF-007)
- Every 4h: Brand Monitor (WF-006)
- Every 6h: Community (WF-008)
- Monday & Thursday 08:00 UTC: LinkedIn Content (WF-010)
- Monday & Thursday 14:00 UTC: Social Content (WF-003)
- Tuesday 06:00 + Thursday 18:00 UTC: Email Campaigns (WF-009)
- 1st & 15th 10:00 UTC: ASO (WF-011)
- 1st month 09:00 UTC: Roadmap (WF-013)
- Monday 07:00 UTC: A/B Testing (WF-014)
- 23:00 UTC: Data Cleaning (WF-005)

**Webhook Triggers**:
- /leads/intake → WF-001 (Lead Intake)
- /crm/pipedrive → WF-004 (CRM Sync)
- /crm/opportunity → WF-012 (Opportunity Match)
- /crisis/detection → WF-015 (Crisis Response)

### ETAPA 5: Test Workflows End-to-End (Dia 6 - 2h)

**Checklist**:
```
WF-001: Lead Intake
  [ ] Webhook trigger works
  [ ] ARTEMIS executes correctly
  [ ] Score returned (0-10)
  [ ] IF condition evaluates
  [ ] Slack notification sent
  [ ] Pipedrive deal created (if score > 8)
  [ ] Supabase logged

WF-003: Social Content
  [ ] Cron trigger fires at correct time
  [ ] Twitter API returns trends
  [ ] ECHO executes
  [ ] WANDA generates ideas
  [ ] CREATOR optimizes
  [ ] VISU creates images
  [ ] Google Sheets updated
  [ ] Slack notified

[... Continuar para todos WF ...]
```

### ETAPA 6: Monitoring Integration Setup (Dia 6 - 2h)

```
1. Export execution logs from n8n API
   GET https://api.n8n.cloud/rest/workflows/{id}/executions

2. Sync logs to Supabase
   INSERT INTO workflow_executions (
     workflow_id, execution_id, status, 
     started_at, completed_at, duration_ms
   )

3. Create unified dashboard
   - Real-time metrics
   - Success rate tracking
   - Performance trends
   - Error monitoring

4. Setup alerts in Slack
   - Workflow failures
   - SLA breaches
   - Agent timeouts
```

---

## 🎯 SUCCESS CRITERIA (Dia 6 EOD)

- ✅ 17 workflows deployed to n8n Cloud
- ✅ 10 credential types configured
- ✅ All webhooks active & tested
- ✅ All cron schedules validated
- ✅ End-to-end testing passed
- ✅ Slack notifications working
- ✅ Supabase logging verified
- ✅ Pipedrive integration confirmed
- ✅ Google Sheets insertion working
- ✅ Twitter/LinkedIn APIs connected

---

## 📊 EXPECTED METRICS

After deployment:
- **Active workflows**: 17
- **Daily executions**: ~50
- **Agents utilized**: 37
- **Success rate target**: >95%
- **Avg response time**: <5s
- **Error rate**: <5%

---

## 🚀 PRÓXIMO: FASE 4 - MONITORING & ALERTING

Após n8n setup completo, implementar:
- Real-time dashboard
- Slack alerts
- Health checks
- SLA tracking
- Performance metrics

---

**Status**: ✅ PRONTO PARA DEPLOY
