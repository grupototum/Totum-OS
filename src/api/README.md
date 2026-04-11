# Agents API Documentation

API client e endpoints para gerenciar agentes, executar tarefas e gerenciar skills.

## Base URL

```
/api/agents
```

## Endpoints

### 1. Execute Agent

Executa um agente com um input específico.

**Request:**
```
POST /api/agents/:agentId/execute
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "input": "string (required)",
  "context": {
    // optional object
  },
  "execution_mode": "string (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "agentId": "string",
  "agentName": "string",
  "status": "completed | failed | running | pending",
  "startTime": "ISO 8601 timestamp",
  "endTime": "ISO 8601 timestamp (optional)",
  "totalDuration": "number (ms)",
  "steps": [
    {
      "id": "string",
      "skillName": "string",
      "skillEmoji": "string",
      "status": "success | error | pending | running",
      "startTime": "ISO 8601 timestamp",
      "duration": "number (ms)",
      "tokensUsed": "number (optional)",
      "costTokens": "number (optional)",
      "input": "string (optional)",
      "output": "string (optional)",
      "errorMessage": "string (optional)",
      "order": "number"
    }
  ],
  "totalTokensUsed": "number",
  "totalCost": "number"
}
```

**Example:**
```typescript
const result = await executeAgent('agent-123', 'Hello, how are you?', {
  context: { userId: 'user-456' },
  execution_mode: 'fast'
});
```

---

### 2. Get Agent Config

Obtém a configuração atual de um agente.

**Request:**
```
GET /api/agents/:agentId/config
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "emoji": "string",
  "modelOverride": "string (optional)",
  "systemPrompt": "string",
  "status": "online | offline | idle | maintenance",
  "created_at": "ISO 8601 timestamp (optional)",
  "updated_at": "ISO 8601 timestamp (optional)"
}
```

**Example:**
```typescript
const config = await fetchAgentConfig('agent-123');
```

---

### 3. Update Agent Config

Atualiza a configuração de um agente.

**Request:**
```
PATCH /api/agents/:agentId/config
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "string (optional)",
  "emoji": "string (optional)",
  "model_override": "string (optional)",
  "system_prompt": "string (optional)",
  "status": "online | offline | idle | maintenance (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "emoji": "string",
  "modelOverride": "string",
  "systemPrompt": "string",
  "status": "online | offline | idle | maintenance",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

**Example:**
```typescript
const updated = await saveAgentConfig('agent-123', {
  name: 'Novo Nome',
  emoji: '🎯',
  model_override: 'gpt-4-turbo',
  status: 'online'
});
```

---

### 4. Add Skill to Agent

Adiciona uma skill a um agente.

**Request:**
```
POST /api/agents/:agentId/skills
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "skill_id": "string (required)",
  "position": "number (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "skill": {
    "id": "string",
    "name": "string",
    "emoji": "string",
    "category": "string",
    "cost": "number",
    "successRate": "number",
    "description": "string (optional)"
  }
}
```

**Example:**
```typescript
const skill = await addSkill('agent-123', 'skill-send-email', 2);
```

---

### 5. Remove Skill from Agent

Remove uma skill de um agente.

**Request:**
```
DELETE /api/agents/:agentId/skills/:skillId
```

**Response:**
```json
{
  "success": true,
  "message": "Skill removida com sucesso"
}
```

**Example:**
```typescript
await removeSkill('agent-123', 'skill-send-email');
```

---

### 6. Reorder Agent Skills

Reordena as skills de um agente.

**Request:**
```
PUT /api/agents/:agentId/skills/reorder
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "skillIds": ["string", "string", "string"]
}
```

**Response:**
```json
{
  "success": true,
  "skills": [
    {
      "id": "string",
      "name": "string",
      "emoji": "string",
      "category": "string",
      "cost": "number",
      "successRate": "number"
    }
  ]
}
```

**Example:**
```typescript
const skills = await reorderSkills('agent-123', [
  'skill-analyze',
  'skill-send-email',
  'skill-create-task'
]);
```

---

## Error Handling

Todos os endpoints seguem um padrão de tratamento de erros:

```json
{
  "status": 400,
  "message": "Error message",
  "details": "Additional error details"
}
```

### Status Codes

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado
- `204 No Content` - Sucesso sem conteúdo
- `400 Bad Request` - Parâmetros inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Não autorizado
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

### Error Handling Example

```typescript
try {
  const result = await executeAgent('agent-123', 'test');
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

---

## Client Usage

### Import

```typescript
import {
  executeAgent,
  fetchAgentConfig,
  saveAgentConfig,
  addSkill,
  removeSkill,
  reorderSkills,
  agentAPIClient
} from '@/api/agents';
```

### Configuration

Para usar a API com um baseUrl diferente:

```typescript
agentAPIClient.setBaseUrl('https://api.example.com');
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

---

## Types

```typescript
// Agent Configuration
interface AgentConfig {
  id: string;
  name: string;
  emoji: string;
  modelOverride?: string;
  systemPrompt: string;
  status: 'online' | 'offline' | 'idle' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

// Skill
interface Skill {
  id: string;
  name: string;
  emoji: string;
  category: string;
  cost: number;
  successRate: number;
  description?: string;
  agentId?: string;
}

// Execution Result
interface ExecutionResult {
  id: string;
  agentId: string;
  agentName: string;
  status: 'completed' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime?: string;
  totalDuration: number;
  steps: ExecutionStep[];
  totalTokensUsed: number;
  totalCost: number;
}

// Execution Step
interface ExecutionStep {
  id: string;
  skillName: string;
  skillEmoji: string;
  status: 'success' | 'error' | 'pending' | 'running';
  startTime: string;
  endTime?: string;
  duration: number;
  tokensUsed?: number;
  costTokens?: number;
  input?: string;
  output?: string;
  errorMessage?: string;
  order: number;
}
```

---

## Examples

Veja [agents.examples.ts](./agents.examples.ts) para mais exemplos de uso.

---

## Testing

```typescript
import { agentAPIClient } from '@/api/agents';

// Mock API response
agentAPIClient.setBaseUrl('http://localhost:3000');

// Test execution
async function testAPI() {
  try {
    const result = await executeAgent('test-agent', 'test input');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```
