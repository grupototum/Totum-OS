# API Reference

## Overview

elizaOS provides a comprehensive REST API for programmatic access to all features. Use the API to build custom integrations, automate workflows, or embed elizaOS functionality into your applications.

**Base URL**: `https://api.elizaos.io/v1`  
**Authentication**: Bearer token (JWT)  
**Rate Limit**: 100 requests/minute (standard tier)  
**Response Format**: JSON

---

## Authentication

All API requests require an authentication token.

### Getting Your API Key

```
1. Go to Settings → API Keys
2. Click "Generate New Key"
3. Name the key (e.g., "Mobile App Integration")
4. Copy key (shown only once)
5. Use in requests
```

### Using API Key

```bash
# Include in header
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.elizaos.io/v1/agents

# Or in request body
{
  "api_key": "YOUR_API_KEY"
}
```

### Token Expiration

- API keys don't expire
- Tokens from login expire in 24 hours
- Refresh token to get new access token

---

## Agents API

### List All Agents

```
GET /agents
```

**Parameters**:
```
- limit: Max results (default: 20, max: 100)
- offset: Pagination offset (default: 0)
- category: Filter by category
- status: Filter by status (active, inactive)
- search: Search by name/description
```

**Response**:
```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "content-writer",
      "role": "Blog Post Writer",
      "description": "Writes blog posts",
      "model": "gemini",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "config": {
        "temperature": 0.7,
        "max_tokens": 2000
      }
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### Get Agent Details

```
GET /agents/{agentId}
```

**Response**:
```json
{
  "id": "agent-123",
  "name": "content-writer",
  "role": "Blog Post Writer",
  "description": "Writes blog posts",
  "model": "gemini",
  "status": "active",
  "config": {
    "temperature": 0.7,
    "max_tokens": 2000,
    "system_prompt": "You are a..."
  },
  "skills": ["writing", "seo"],
  "executions_count": 156,
  "success_rate": 0.94,
  "avg_execution_time": 12.5
}
```

### Create Agent

```
POST /agents
```

**Request Body**:
```json
{
  "name": "my-new-agent",
  "role": "Content Creator",
  "description": "Creates content",
  "model": "gemini",
  "config": {
    "temperature": 0.7,
    "max_tokens": 2000
  },
  "skills": ["writing"],
  "system_prompt": "You are a..."
}
```

**Response**: Agent object with ID

### Execute Agent

```
POST /agents/{agentId}/execute
```

**Request Body**:
```json
{
  "objective": "Write a blog post about AI",
  "input": "Optional input data",
  "config": {
    "temperature": 0.8,
    "max_tokens": 1500
  }
}
```

**Response**:
```json
{
  "execution_id": "exec-456",
  "status": "running",
  "started_at": "2024-01-15T10:35:00Z",
  "model_used": "gemini",
  "tokens_estimated": 1200
}
```

### Get Execution Status

```
GET /executions/{executionId}
```

**Response**:
```json
{
  "id": "exec-456",
  "agent_id": "agent-123",
  "status": "completed",
  "result": "Blog post content here...",
  "started_at": "2024-01-15T10:35:00Z",
  "completed_at": "2024-01-15T10:38:30Z",
  "duration_seconds": 210,
  "tokens_used": 1150,
  "cost_usd": 0.23
}
```

### Update Agent

```
PATCH /agents/{agentId}
```

**Request Body**: Any fields to update
```json
{
  "description": "Updated description",
  "config": {
    "temperature": 0.5
  }
}
```

### Delete Agent

```
DELETE /agents/{agentId}
```

**Response**:
```json
{
  "success": true,
  "message": "Agent deleted"
}
```

---

## Workflows API

### List Workflows

```
GET /workflows
```

**Parameters**:
```
- limit: Max results
- offset: Pagination offset
- status: active, paused, archived
- search: Search by name
```

**Response**:
```json
{
  "workflows": [
    {
      "id": "workflow-789",
      "name": "Daily Content Pipeline",
      "description": "Generates daily content",
      "status": "active",
      "trigger": "schedule",
      "created_at": "2024-01-15T10:30:00Z",
      "last_run": "2024-01-18T09:00:00Z",
      "next_run": "2024-01-19T09:00:00Z"
    }
  ],
  "total": 15
}
```

### Get Workflow Details

```
GET /workflows/{workflowId}
```

### Create Workflow

```
POST /workflows
```

**Request Body**:
```json
{
  "name": "Lead Qualification",
  "description": "Auto-qualify leads",
  "trigger": {
    "type": "webhook",
    "url": "/webhook/lead-received"
  },
  "steps": [
    {
      "name": "Validate",
      "agent_id": "agent-123",
      "input_mapping": { "data": "$.body" }
    },
    {
      "name": "Score",
      "agent_id": "agent-456",
      "input_mapping": { "validated_data": "$.steps.0.result" }
    }
  ]
}
```

### Execute Workflow

```
POST /workflows/{workflowId}/execute
```

**Request Body**:
```json
{
  "input": {
    "lead_email": "person@example.com",
    "lead_company": "Acme Inc"
  }
}
```

**Response**:
```json
{
  "execution_id": "workflow-exec-123",
  "workflow_id": "workflow-789",
  "status": "running",
  "started_at": "2024-01-18T14:30:00Z"
}
```

### Get Workflow Execution

```
GET /workflow-executions/{executionId}
```

**Response**:
```json
{
  "id": "workflow-exec-123",
  "workflow_id": "workflow-789",
  "status": "completed",
  "started_at": "2024-01-18T14:30:00Z",
  "completed_at": "2024-01-18T14:35:42Z",
  "duration_seconds": 342,
  "results": {
    "lead_score": 85,
    "recommendation": "route_to_sales"
  },
  "step_results": [
    {
      "step": "Validate",
      "status": "completed",
      "output": { "valid": true }
    }
  ]
}
```

### Update Workflow

```
PATCH /workflows/{workflowId}
```

### Delete Workflow

```
DELETE /workflows/{workflowId}
```

---

## Alexandria API

### List Documents

```
GET /alexandria/documents
```

**Parameters**:
```
- limit: Max results (default: 20)
- offset: Pagination offset
- category: Filter by category
- tags: Filter by tags (comma-separated)
- search: Search query
```

**Response**:
```json
{
  "documents": [
    {
      "id": "doc-111",
      "title": "Q3 Sales Report",
      "category": "reports",
      "tags": ["sales", "q3", "2024"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "size_bytes": 245680,
      "content_preview": "Q3 showed strong growth..."
    }
  ],
  "total": 237
}
```

### Get Document

```
GET /alexandria/documents/{documentId}
```

**Parameters**:
```
- include_content: Include full content (true/false)
```

### Upload Document

```
POST /alexandria/documents
```

**Headers**:
```
Content-Type: multipart/form-data
```

**Body**:
```
- file: File to upload
- title: Document title
- category: Document category
- tags: Comma-separated tags
- description: Document description
```

**Response**:
```json
{
  "id": "doc-112",
  "title": "New Document",
  "status": "processing",
  "upload_date": "2024-01-18T14:30:00Z"
}
```

### Search Documents

```
POST /alexandria/search
```

**Request Body**:
```json
{
  "query": "Q3 revenue trends",
  "limit": 10,
  "filters": {
    "category": "reports",
    "date_from": "2024-01-01"
  }
}
```

**Response**:
```json
{
  "results": [
    {
      "document_id": "doc-111",
      "title": "Q3 Sales Report",
      "relevance_score": 0.94,
      "snippet": "Q3 revenue increased 23% YoY to $4.2M..."
    }
  ],
  "total": 5
}
```

### Chat with GILES

```
POST /alexandria/chat
```

**Request Body**:
```json
{
  "message": "What was our Q3 revenue?",
  "context": "alexandria"
}
```

**Response**:
```json
{
  "answer": "According to the Q3 Sales Report, revenue was $4.2M, representing a 23% increase year-over-year.",
  "sources": [
    {
      "document_id": "doc-111",
      "title": "Q3 Sales Report",
      "relevance": 0.98
    }
  ],
  "confidence": 0.92
}
```

### Delete Document

```
DELETE /alexandria/documents/{documentId}
```

---

## Skills API

### List Skills

```
GET /skills
```

**Response**:
```json
{
  "skills": [
    {
      "id": "skill-001",
      "name": "Article Writer",
      "category": "content",
      "description": "Writes articles",
      "version": "1.0"
    }
  ],
  "total": 42
}
```

### Get Skill Details

```
GET /skills/{skillId}
```

### Use Skill

```
POST /skills/{skillId}/execute
```

**Request Body**:
```json
{
  "input": "Data for the skill"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with ID 'xyz' not found",
    "details": {
      "agent_id": "xyz"
    }
  }
}
```

### Common Error Codes

```
200 OK - Success
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - Missing/invalid auth
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
429 Too Many Requests - Rate limited
500 Server Error - Internal error
```

### Handling Errors

```javascript
try {
  const response = await fetch('/api/agents/123', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error.code);
    // Handle error appropriately
  }
  
  const data = await response.json();
} catch (error) {
  console.error('Network error:', error);
}
```

---

## Rate Limiting

### Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705602000
```

### Handling Rate Limits

```javascript
if (response.status === 429) {
  const resetTime = response.headers['X-RateLimit-Reset'];
  const waitSeconds = resetTime - Math.floor(Date.now() / 1000);
  console.log(`Rate limited. Wait ${waitSeconds} seconds`);
  
  // Implement exponential backoff
  setTimeout(() => retryRequest(), waitSeconds * 1000);
}
```

---

## Examples

### Example 1: Create and Execute Agent

```javascript
const apiKey = 'your-api-key';

// 1. Create agent
const createResponse = await fetch('https://api.elizaos.io/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'blog-writer',
    role: 'Content Writer',
    model: 'gemini',
    config: { temperature: 0.7, max_tokens: 2000 }
  })
});

const { id: agentId } = await createResponse.json();

// 2. Execute agent
const execResponse = await fetch(
  `https://api.elizaos.io/v1/agents/${agentId}/execute`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      objective: 'Write blog post about AI'
    })
  }
);

const { execution_id } = await execResponse.json();

// 3. Poll for results
let status = 'running';
while (status === 'running') {
  const statusResponse = await fetch(
    `https://api.elizaos.io/v1/executions/${execution_id}`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  );
  
  const execution = await statusResponse.json();
  status = execution.status;
  
  if (status === 'completed') {
    console.log('Result:', execution.result);
  }
  
  await new Promise(r => setTimeout(r, 1000)); // Wait 1s
}
```

### Example 2: Search Alexandria

```javascript
const searchResponse = await fetch(
  'https://api.elizaos.io/v1/alexandria/search',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: 'Q3 sales performance',
      filters: { category: 'reports' }
    })
  }
);

const { results } = await searchResponse.json();
results.forEach(result => {
  console.log(`${result.title}: ${result.snippet}`);
});
```

### Example 3: Webhook Integration

```javascript
// Receive webhook from external system
app.post('/webhook/lead', async (req, res) => {
  const lead = req.body;
  
  // Execute workflow
  const response = await fetch(
    'https://api.elizaos.io/v1/workflows/lead-qualification/execute',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          email: lead.email,
          company: lead.company,
          role: lead.role
        }
      })
    }
  );
  
  const { execution_id } = await response.json();
  res.json({ execution_id });
});
```

---

## SDK

### JavaScript/Node.js

```bash
npm install elizaos
```

```javascript
import { ElizaOS } from 'elizaos';

const client = new ElizaOS({
  apiKey: 'your-api-key'
});

// List agents
const agents = await client.agents.list();

// Execute agent
const execution = await client.agents.execute('agent-123', {
  objective: 'Write blog post'
});

// Poll for results
const result = await execution.wait();
console.log(result);
```

### Python

```bash
pip install elizaos
```

```python
from elizaos import ElizaOS

client = ElizaOS(api_key='your-api-key')

# List agents
agents = client.agents.list()

# Execute agent
execution = client.agents.execute('agent-123', {
    'objective': 'Write blog post'
})

# Wait for results
result = execution.wait()
print(result)
```

---

## Webhooks

### Event Types

```
agent.execution.started
agent.execution.completed
agent.execution.failed
workflow.execution.completed
document.uploaded
search.completed
```

### Setting Up Webhook

```
1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Enter URL to receive events
4. Select events to subscribe
5. Save
```

### Webhook Payload

```json
{
  "event": "agent.execution.completed",
  "timestamp": "2024-01-18T14:35:42Z",
  "data": {
    "execution_id": "exec-456",
    "agent_id": "agent-123",
    "result": "..."
  }
}
```

---

## Best Practices

1. **Always use HTTPS** for API calls
2. **Never commit API keys** to version control
3. **Implement retry logic** for failed requests
4. **Respect rate limits** - use exponential backoff
5. **Cache responses** when possible
6. **Monitor costs** - track token usage
7. **Use webhooks** for asynchronous processing
8. **Validate input** before sending to API

---

## Support

- **API Status**: https://status.elizaos.io
- **Documentation**: https://docs.elizaos.io
- **Support Email**: api-support@elizaos.io

---

*Last Updated: January 2024*
