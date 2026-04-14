# 📡 API Reference — elizaOS Agent Orchestration System

**Complete REST API documentation**

---

## Base URL

```
Development:  http://localhost:3000/api
Production:   http://187.127.4.140:3000/api
Staging:      http://staging.elizaos.local:3000/api
```

---

## Authentication

All API requests require JWT token in headers:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/agents
```

**Obtaining Token**:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {id, email, roles}
}
```

**Token Expiry**: 1 hour (refresh available)

---

## Core Endpoints

### Health Check

**Check System Health**

```http
GET /health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-04-14T10:30:00Z",
  "agents": {
    "online": 56,
    "offline": 1,
    "degraded": 2
  },
  "workflows": {
    "active": 15,
    "queued": 3,
    "failed": 0
  },
  "database": "connected",
  "cache": "connected",
  "uptime_seconds": 86400
}
```

---

## Agents Endpoints

### List Agents

**Get all agents with filtering**

```http
GET /agents?division=DIV-001&status=online&page=1&limit=20
```

**Query Parameters**:
- `division` (string): Filter by division ID
- `status` (string): `online|offline|degraded`
- `page` (number): Page number (1-based)
- `limit` (number): Results per page (1-100, default 20)
- `sort` (string): `name|status|lastExecution`

**Response** (200 OK):
```json
{
  "agents": [
    {
      "id": "LOKI",
      "name": "Lead Qualificationist",
      "division": "DIV-001",
      "bio": "Qualifies and scores leads",
      "tier": "enterprise",
      "status": "online",
      "lastExecution": "2026-04-14T10:25:00Z",
      "metrics": {
        "successRate": 96.5,
        "avgResponseTime": 2450,
        "executionCount": 1250
      }
    },
    // ... more agents
  ],
  "total": 57,
  "page": 1,
  "pageSize": 20
}
```

---

### Get Agent Details

**Retrieve specific agent information**

```http
GET /agents/LOKI
```

**Response** (200 OK):
```json
{
  "id": "LOKI",
  "name": "Lead Qualificationist",
  "division": "DIV-001",
  "bio": "Analyzes and qualifies leads based on engagement and profile",
  "tier": "enterprise",
  "status": "online",
  "lastExecution": "2026-04-14T10:25:00Z",
  "capabilities": [
    "lead_qualification",
    "lead_scoring",
    "company_analysis",
    "competitor_assessment"
  ],
  "metrics": {
    "successRate": 96.5,
    "avgResponseTime": 2450,
    "p95ResponseTime": 3200,
    "p99ResponseTime": 4100,
    "executionCount": 1250,
    "errorCount": 45,
    "uptimePercent": 96.5
  },
  "sla": {
    "successRateMinPercent": 95,
    "responseTimeMaxMs": 5000,
    "uptimeMinPercent": 99.5
  }
}
```

---

### Execute Agent

**Run an agent with objective and context**

```http
POST /agents/LOKI/execute
Content-Type: application/json

{
  "objective": "Qualifique João Silva como lead de alto valor",
  "context": {
    "leadId": "123",
    "source": "website",
    "budget": 100000,
    "timeline": "3 months"
  },
  "timeout": 600,
  "priority": "high"
}
```

**Request Fields**:
- `objective` (required, string): What to do
- `context` (optional, object): Additional context
- `timeout` (optional, number): Max seconds (default 300)
- `priority` (optional, string): `critical|high|normal|low`

**Response** (202 Accepted):
```json
{
  "executionId": "exec-abc123def456",
  "agentId": "LOKI",
  "status": "running",
  "objective": "Qualifique João Silva como lead de alto valor",
  "startTime": "2026-04-14T10:30:00Z",
  "estimatedCompletionTime": "2026-04-14T10:32:30Z"
}
```

**Polling for Results**:
```http
GET /executions/exec-abc123def456
```

**Response** (200 OK, still running):
```json
{
  "id": "exec-abc123def456",
  "agentId": "LOKI",
  "status": "running",
  "progress": 65,
  "currentTask": "Analyzing company profile",
  "startTime": "2026-04-14T10:30:00Z",
  "elapsedSeconds": 45
}
```

**Response** (200 OK, completed):
```json
{
  "id": "exec-abc123def456",
  "agentId": "LOKI",
  "status": "completed",
  "progress": 100,
  "result": {
    "lead_name": "João Silva",
    "qualification_score": 8.5,
    "recommendation": "high_priority",
    "reasoning": "Strong fit: Enterprise budget, quick timeline, tech background",
    "next_steps": ["Schedule discovery call", "Prepare pricing proposal"]
  },
  "startTime": "2026-04-14T10:30:00Z",
  "endTime": "2026-04-14T10:32:15Z",
  "executionTimeSeconds": 135,
  "metrics": {
    "tokensUsed": 2845,
    "cost": 0.23,
    "apiCallsCount": 4
  }
}
```

**Response** (200 OK, failed):
```json
{
  "id": "exec-abc123def456",
  "agentId": "LOKI",
  "status": "failed",
  "error": {
    "code": "NETWORK_ERROR",
    "message": "Failed to fetch lead data: timeout after 30s",
    "retryable": true
  },
  "startTime": "2026-04-14T10:30:00Z",
  "endTime": "2026-04-14T10:30:35Z",
  "executionTimeSeconds": 35
}
```

---

### Get Execution Status

**Check status of running execution**

```http
GET /executions/exec-abc123def456
```

Same response as above based on current status.

---

### Get Execution History

**List past executions for an agent**

```http
GET /agents/LOKI/executions?limit=10&status=completed&startDate=2026-04-01
```

**Query Parameters**:
- `limit` (number): Results limit (default 20)
- `status` (string): `completed|failed|cancelled`
- `startDate` (string): ISO 8601 date
- `endDate` (string): ISO 8601 date

**Response** (200 OK):
```json
{
  "executions": [
    {
      "id": "exec-123",
      "status": "completed",
      "startTime": "2026-04-14T10:30:00Z",
      "endTime": "2026-04-14T10:32:15Z",
      "executionTimeSeconds": 135,
      "cost": 0.23
    },
    // ... more executions
  ],
  "total": 1250,
  "limit": 10
}
```

---

## Workflow Endpoints

### List Workflows

**Get all orchestrated workflows**

```http
GET /workflows?status=active
```

**Response** (200 OK):
```json
{
  "workflows": [
    {
      "id": "wf-lead-intake",
      "name": "Lead Intake",
      "status": "active",
      "n8nWorkflowId": "n8n-123",
      "triggers": ["webhook", "schedule"],
      "agents": ["LOKI", "APOLLO"],
      "lastExecution": "2026-04-14T10:25:00Z",
      "executionCount": 156,
      "successRate": 97.4
    },
    // ... more workflows
  ],
  "total": 20,
  "active": 11,
  "paused": 9
}
```

---

### Trigger Workflow

**Execute a workflow**

```http
POST /workflows/wf-lead-intake/execute
Content-Type: application/json

{
  "data": {
    "leadName": "João Silva",
    "leadEmail": "joao@example.com",
    "company": "Tech Corp",
    "source": "website"
  }
}
```

**Response** (202 Accepted):
```json
{
  "workflowExecutionId": "wfe-abc123",
  "workflowId": "wf-lead-intake",
  "status": "running",
  "startTime": "2026-04-14T10:30:00Z"
}
```

---

### Get Workflow Status

**Check workflow execution status**

```http
GET /workflows/wf-lead-intake/executions/wfe-abc123
```

**Response** (200 OK):
```json
{
  "id": "wfe-abc123",
  "workflowId": "wf-lead-intake",
  "status": "completed",
  "startTime": "2026-04-14T10:30:00Z",
  "endTime": "2026-04-14T10:35:15Z",
  "duration": 315,
  "nodes": [
    {
      "name": "Webhook Trigger",
      "status": "completed",
      "duration": 0
    },
    {
      "name": "LOKI Agent",
      "status": "completed",
      "duration": 135
    },
    {
      "name": "Conditional",
      "status": "completed",
      "duration": 0
    },
    {
      "name": "APOLLO Agent",
      "status": "completed",
      "duration": 120
    },
    {
      "name": "Slack Notification",
      "status": "completed",
      "duration": 2
    }
  ],
  "result": {
    "leadQualification": {score: 8.5, tier: "high"},
    "dealSize": 250000,
    "nextSteps": ["Schedule meeting"]
  }
}
```

---

## Monitoring Endpoints

### System Health

```http
GET /health
```

See [Health Check](#health-check) section above.

---

### Metrics

**Get system-wide metrics**

```http
GET /metrics?period=24h&division=DIV-001
```

**Query Parameters**:
- `period` (string): `1h|6h|24h|7d|30d` (default: 24h)
- `division` (string): Filter by division
- `agent` (string): Filter by agent

**Response** (200 OK):
```json
{
  "period": "24h",
  "startTime": "2026-04-13T10:30:00Z",
  "endTime": "2026-04-14T10:30:00Z",
  "summary": {
    "totalExecutions": 1847,
    "successfulExecutions": 1792,
    "failedExecutions": 55,
    "successRate": 97.0,
    "avgExecutionTime": 2.5,
    "totalCost": 124.35,
    "costPerExecution": 0.067
  },
  "byAgent": {
    "LOKI": {
      "executions": 245,
      "successRate": 96.5,
      "avgExecutionTime": 2.4,
      "cost": 18.45
    },
    // ... more agents
  },
  "byDivision": {
    "DIV-001": {
      "executions": 350,
      "successRate": 96.8,
      "avgExecutionTime": 2.5,
      "cost": 28.50
    },
    // ... more divisions
  }
}
```

---

### Agent Metrics

**Get metrics for specific agent**

```http
GET /agents/LOKI/metrics?period=24h
```

**Response** (200 OK):
```json
{
  "agentId": "LOKI",
  "period": "24h",
  "metrics": {
    "executions": 245,
    "successRate": 96.5,
    "avgResponseTime": 2450,
    "p95ResponseTime": 3200,
    "p99ResponseTime": 4100,
    "minResponseTime": 890,
    "maxResponseTime": 5200,
    "errorCount": 9,
    "errorRate": 3.5,
    "totalCost": 18.45,
    "costPerExecution": 0.075,
    "uptime": 96.5
  }
}
```

---

### Alerts

**Get active alerts**

```http
GET /alerts?severity=critical&status=open
```

**Query Parameters**:
- `severity` (string): `info|warning|critical`
- `status` (string): `open|acknowledged|resolved`
- `agent` (string): Filter by agent

**Response** (200 OK):
```json
{
  "alerts": [
    {
      "id": "alert-123",
      "title": "LOKI High Latency",
      "severity": "warning",
      "status": "open",
      "createdAt": "2026-04-14T10:15:00Z",
      "agent": "LOKI",
      "metric": "response_time",
      "value": 5400,
      "threshold": 5000
    },
    // ... more alerts
  ],
  "total": 3,
  "open": 2,
  "acknowledged": 1,
  "resolved": 0
}
```

---

### SLA Report

**Generate SLA compliance report**

```http
GET /reports/sla?period=7d&agents=LOKI,APOLLO
```

**Response** (200 OK):
```json
{
  "period": "7d",
  "reportDate": "2026-04-14T10:30:00Z",
  "summary": {
    "systemHealth": 94.2,
    "breachCount": 2,
    "breachDuration": 45
  },
  "agents": [
    {
      "agentId": "LOKI",
      "healthScore": 96.5,
      "status": "healthy",
      "metrics": {
        "successRate": 96.5,
        "avgResponseTime": 2450,
        "uptime": 99.8
      },
      "sla": {
        "successRate": {target: 95, actual: 96.5, status: "pass"},
        "responseTime": {target: 5000, actual: 2450, status: "pass"},
        "uptime": {target: 99.5, actual: 99.8, status: "pass"}
      },
      "breaches": []
    },
    // ... more agents
  ]
}
```

---

## Error Handling

### Error Response Format

All errors return JSON with consistent format:

```json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent LOKI not found",
    "details": {
      "agentId": "LOKI",
      "availableAgents": ["APOLLO", "ATHENA", ...]
    },
    "timestamp": "2026-04-14T10:30:00Z",
    "traceId": "trace-abc123"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request completed |
| 202 | Accepted | Agent execution started |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Agent/workflow not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Internal error |
| 503 | Unavailable | Service down |

### Common Error Codes

```
AGENT_NOT_FOUND
WORKFLOW_NOT_FOUND
EXECUTION_NOT_FOUND
INVALID_OBJECTIVE
TIMEOUT
AUTHENTICATION_FAILED
RATE_LIMIT_EXCEEDED
SERVICE_UNAVAILABLE
INTERNAL_ERROR
```

---

## Rate Limiting

**Limits** (per API key):
- 100 requests/minute per agent
- 1,000 requests/hour
- 10,000 requests/day

**Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1713096600
```

**Rate Limit Exceeded Response** (429):
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 15
  }
}
```

---

## Webhooks

### Register Webhook

```http
POST /webhooks/register
Content-Type: application/json

{
  "event": "agent.execution.completed",
  "url": "https://your-domain.com/webhook",
  "secret": "your-webhook-secret",
  "active": true
}
```

### Webhook Events

Available events:
- `agent.execution.started`
- `agent.execution.completed`
- `agent.execution.failed`
- `agent.execution.cancelled`
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `alert.created`
- `alert.acknowledged`
- `alert.resolved`
- `sla.breach`
- `sla.recovered`

### Webhook Payload

```json
{
  "event": "agent.execution.completed",
  "timestamp": "2026-04-14T10:32:15Z",
  "data": {
    "executionId": "exec-abc123",
    "agentId": "LOKI",
    "status": "completed",
    "duration": 135,
    "cost": 0.23,
    "result": {...}
  },
  "signature": "sha256=..."
}
```

---

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${process.env.ELIZAOS_TOKEN}`
  }
});

// Execute agent
const execution = await client.post('/agents/LOKI/execute', {
  objective: 'Qualifique João Silva',
  context: {source: 'website'}
});

console.log('Execution ID:', execution.data.executionId);

// Poll for results
const result = await client.get(
  `/executions/${execution.data.executionId}`
);

console.log('Result:', result.data);
```

### Python

```python
import requests

client = requests.Session()
client.headers.update({
    'Authorization': f'Bearer {os.environ["ELIZAOS_TOKEN"]}'
})

# Execute agent
response = client.post('http://localhost:3000/api/agents/LOKI/execute', json={
    'objective': 'Qualifique João Silva',
    'context': {'source': 'website'}
})

execution_id = response.json()['executionId']

# Get result
result = client.get(f'http://localhost:3000/api/executions/{execution_id}')
print(result.json())
```

### cURL

```bash
# Execute agent
curl -X POST http://localhost:3000/api/agents/LOKI/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Qualifique João Silva",
    "context": {"source": "website"}
  }'

# Get status
curl http://localhost:3000/api/executions/exec-abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**API Version**: 1.0
**Last Updated**: 2026-04-14
**Status**: Production Ready ✅
