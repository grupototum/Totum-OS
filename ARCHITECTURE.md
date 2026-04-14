# 📐 Architecture — elizaOS Agent Orchestration System

**Complete technical overview and design documentation**

---

## System Overview

elizaOS is an enterprise agent orchestration platform that manages 57 specialized autonomous agents organized across 7 functional divisions, orchestrating 20+ workflows with real-time monitoring and SLA validation.

```
┌─────────────────────────────────────────────────────┐
│              User Interface Layer                    │
│  (Dashboard, API, CLI, Webhooks)                    │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│          Request Router & Intent Parser             │
│  (Analyze objective, select division & agents)      │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│     Autonomous Agent Orchestration Engine           │
│  (57 agents × 7 divisions)                         │
│  ├─ Planner: Decompose into tasks                 │
│  ├─ Executor: Parallel/sequential execution        │
│  └─ Reporter: Consolidate results                 │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│        Workflow Orchestration (n8n Integration)    │
│  (20 workflows, 50+ daily executions)              │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│     Monitoring, Alerting, SLA Validation           │
│  (Real-time metrics, health checks, notifications) │
└────────────────┬────────────────────────────────────┘
                 │
┌─────────────────────────────────────────────────────┐
│         Data Persistence & Caching                  │
│  (Supabase PostgreSQL + Redis)                     │
└─────────────────────────────────────────────────────┘
```

---

## PASSO 6: Agent Division Mapping

### Overview
57 agents organized into 7 specialized divisions for domain expertise and parallel execution.

### Divisions & Agents

#### DIV-001: Sales & Lead Management (6 agents)
- **LOKI**: Lead qualification and scoring
- **APOLLO**: Deal sizing and revenue forecasting
- **ATHENA**: Sales strategy and positioning
- **HERMES**: Follow-up sequence management
- **ARTEMIS**: Competitive intelligence
- **ARES**: Negotiation support and objection handling

**Daily Executions**: 15-20
**SLA**: 95% success rate, < 5 min execution

#### DIV-002: Marketing & Campaigns (8 agents)
- Content creation and optimization
- Campaign management
- Email sequencing
- Analytics and attribution
- Social media management
- Landing page optimization
- A/B testing and experimentation
- Lead nurturing campaigns

**Daily Executions**: 25-30
**SLA**: 94% success rate, < 3 min execution

#### DIV-003: Data & Integration (7 agents)
- Data ingestion from APIs
- Data cleaning and validation
- Data enrichment
- Database operations
- File processing (CSV, PDF, Excel)
- Data quality checks
- Archive and backup management

**Daily Executions**: 40-50
**SLA**: 99% success rate, < 2 min execution

#### DIV-004: Automation & Orchestration (12+ agents)
- Workflow coordination
- Task scheduling
- Dependency resolution
- Error recovery
- State management
- Parallel execution orchestration
- (+ more specialized agents)

**Daily Executions**: 30-40
**SLA**: 98% success rate, < 1 min execution

#### DIV-005: Engineering & Analytics (6 agents)
- Code analysis and optimization
- Performance monitoring
- System diagnostics
- Technical debt analysis
- Architecture review
- Testing automation

**Daily Executions**: 10-15
**SLA**: 96% success rate, < 8 min execution

#### DIV-006: Support & Customer Service (5+ agents)
- Ticket classification
- Knowledge base management
- Escalation routing
- Customer sentiment analysis
- FAQ generation
- (+ more as needed)

**Daily Executions**: 20-25
**SLA**: 97% success rate, < 2 min execution

#### DIV-007: Business Intelligence (5+ agents)
- Report generation
- Trend analysis
- Forecasting
- Anomaly detection
- Dashboard creation
- (+ custom agents)

**Daily Executions**: 10-15
**SLA**: 95% success rate, < 5 min execution

**TOTAL: 57 agents, 50+ daily executions**

---

## PASSO 7: elizaOS Agent Orchestration System

### Phase 1: Agent Runtime Environment

**Purpose**: Manage execution context, state, logging, and error recovery for autonomous agents

**Files**:
```
src/agents/core/
├── context-manager.ts (445 lines)
├── error-handler.ts (420 lines)
└── logger.ts (480 lines)
```

**Context Manager (`context-manager.ts`)**

Manages execution context for each agent run:

```typescript
interface ExecutionContext {
  agentId: string;              // Which agent
  executionId: string;          // Unique execution ID
  objective: string;            // What to do
  division: string;             // Division membership
  startTime: Date;              // When started
  shortTermMemory: Map;         // Working memory
  longTermMemory: MemoryEntry[]; // Historical context
  currentPhase: Phase;          // Planning/Executing/Reporting/Completed
  completedTasks: Task[];       // What's done
  failedTasks: Task[];          // What failed
  pendingTasks: Task[];         // What's next
}
```

**Key Methods**:
- `create()`: Initialize new execution context
- `addTask()`: Queue tasks
- `completeTask()`: Mark task done
- `setMemory()`: Store working context
- `getLongTermMemory()`: Historical recall
- `save()`: Persist to database

**Error Handler (`error-handler.ts`)**

Comprehensive error handling with 10 error categories:

```typescript
enum ErrorType {
  TIMEOUT,              // Agent took too long
  NETWORK,              // Network/API failure
  RATE_LIMIT,          // API rate limited
  INVALID_INPUT,       // Bad input data
  AUTHENTICATION,      // Auth failed
  AUTHORIZATION,       // Permission denied
  RESOURCE_EXHAUSTED,  // Out of resources
  AGENT_ERROR,         // Agent logic error
  DEPENDENCY_FAILURE,  // External service failed
  UNKNOWN              // Other errors
}
```

**Retry Strategy**: Exponential backoff with jitter
```
delay = baseDelay × (multiplier ^ attempts) + jitter
max: 32 seconds
jitter: ±10%
```

**Fallback Agents**: Automatically select alternative agent if primary fails

**Logger (`logger.ts`)**

Multi-destination logging system:
- Console (development)
- Supabase (production persistence)
- Redis (caching)
- File (archive)

**Log Levels**: DEBUG, INFO, WARN, ERROR, CRITICAL

---

### Phase 2: Workflow Engine

**Purpose**: Orchestrate multi-step workflows with dependencies, state management, and event handling

**Files**:
```
src/agents/core/
├── scheduler.ts (350 lines)
├── state-manager.ts (480 lines)
└── event-emitter.ts (350 lines)
```

**Scheduler (`scheduler.ts`)**

Priority-based task queue:

```typescript
interface Task {
  id: string;
  executionId: string;
  agentId: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  scheduledTime: Date;
  dependencies: string[];        // Task IDs that must complete first
  retryPolicy: RetryPolicy;
  timeout: number;               // Max execution time
}
```

**Execution Flow**:
1. Task queued (respects priority and dependencies)
2. Wait for dependencies to complete
3. Execute task
4. On failure: Retry with exponential backoff
5. On success: Mark complete and trigger dependents

**State Manager (`state-manager.ts`)**

Atomic state management with versioning:

```typescript
interface ExecutionState {
  [key: string]: StateValue;  // Arbitrary key-value state
}

interface StateSnapshot {
  version: number;
  timestamp: Date;
  state: ExecutionState;
  changes: Map<string, any>;  // What changed
}
```

**Capabilities**:
- Create state snapshots (max 100 per execution)
- Rollback to previous snapshots
- Custom validators
- Atomic updates
- Concurrency locking

**Event Emitter (`event-emitter.ts`)**

Publish-subscribe system for orchestration:

```typescript
interface WorkflowEvent {
  type: string;                 // e.g., 'task.completed'
  executionId: string;
  agentId: string;
  timestamp: Date;
  data: any;
  metadata?: object;
}
```

**Capabilities**:
- Subscribe with filters
- Priority ordering
- One-time listeners
- Event history (1000 max)
- Metrics tracking

---

### Phase 3: n8n Cloud Integration

**Purpose**: Deploy workflows to n8n Cloud, trigger agents, manage credentials

**Files**:
```
src/agents/core/
├── n8n-integration.ts (380 lines)
├── n8n-workflow-builder.ts (450 lines)
└── n8n-deployment-orchestrator.ts (420 lines)
```

**n8n Integration (`n8n-integration.ts`)**

REST client for n8n Cloud API:

```typescript
const client = new N8nIntegration({
  apiKey: 'n8n_api_key',
  baseUrl: 'https://n8n.cloud'
});

// Deploy workflow
await client.deployWorkflow(workflowDefinition);

// Execute workflow
const execution = await client.executeWorkflow('workflow-id', {
  data: {agentId: 'LOKI', objective: 'Qualify lead'}
});

// Wait for completion
await client.waitForExecution(execution.id, timeout);
```

**Workflow Builder (`n8n-workflow-builder.ts`)**

Fluent API for workflow construction:

```typescript
const workflow = new N8nWorkflowBuilder()
  .addWebhookTrigger({url: '/leads', method: 'POST'})
  .addAgentNode('LOKI', {objective: 'Qualify lead'})
  .addConditionalNode('Is high value?', {
    yes: () => new N8nWorkflowBuilder()
      .addSlackNotification('#sales'),
    no: () => new N8nWorkflowBuilder()
      .addPostgresLogging()
  })
  .addGoogleSheetsAppend()
  .build();
```

**Node Types**:
- `webhook`: Trigger on HTTP request
- `cron`: Scheduled trigger
- `http`: Call elizaOS agent
- `conditional`: IF/THEN branching
- `slack`: Send Slack message
- `postgres`: Log to database
- `sheets`: Append to Google Sheets

**Deployment Orchestrator (`n8n-deployment-orchestrator.ts`)**

Deploy all 20 workflows:

```typescript
const orchestrator = new N8nDeploymentOrchestrator();

const results = await orchestrator.deployAllWorkflows([
  leadIntakeWorkflow,
  leadEnrichmentWorkflow,
  followUpWorkflow,
  // ... 17 more workflows
]);

// Validate deployments
await orchestrator.validateDeployments(results);

// Test each workflow
await orchestrator.testWorkflowExecutions(results);

// Monitor health
const health = await orchestrator.monitorWorkflowHealth();
```

---

### Phase 4: Monitoring & Alerting

**Purpose**: Real-time metrics, health checking, alert management, SLA validation

**Files**:
```
src/agents/core/
├── monitoring-service.ts (450 lines)
├── alert-manager.ts (380 lines)
└── health-checker.ts (380 lines)
```

**Monitoring Service (`monitoring-service.ts`)**

Metrics collection and aggregation:

```typescript
// Record agent execution
await monitoring.recordAgentExecution(
  'LOKI',
  'exec-123',
  true,          // success
  2500,          // response_time_ms
);

// Get metrics
const metrics = await monitoring.getAgentMetrics('LOKI');
// {
//   agentId: 'LOKI',
//   successRate: 96.5,
//   averageResponseTimeMs: 2450,
//   p95ResponseTimeMs: 3200,
//   p99ResponseTimeMs: 4100,
//   errorRate: 3.5,
//   uptimePercent: 96.5
// }
```

**Metrics Stored**: 24-hour retention (configurable)

**Alert Thresholds**:
- Success rate: < 85% → Alert
- Response time: > 10s → Alert
- Error rate: > 15% → Alert

**Prometheus Export**: Compatible with Grafana dashboards

**Alert Manager (`alert-manager.ts`)**

Alert lifecycle and notifications:

```typescript
// Create alert
const alert = await alertManager.createAlert(
  'High Latency',
  'LOKI response time > 5s',
  AlertSeverity.WARNING,
  'monitoring'
);

// Alert lifecycle
OPEN → ACKNOWLEDGED → RESOLVED

// Notifications
- Slack: #alerts channel with @oncall mention (critical)
- Email: alerts@company.com
- PagerDuty: incident creation (critical)
```

**Alert Rules**:

```typescript
alertManager.registerRule({
  id: 'high-latency',
  name: 'Agent Latency Check',
  condition: (data) => data.avgResponseTime > 5000,
  severity: AlertSeverity.WARNING,
  enabled: true,
  notificationChannels: ['slack', 'email']
});
```

**Health Checker (`health-checker.ts`)**

SLA validation and health scoring:

```typescript
// Set SLA target
healthChecker.setSLATarget('LOKI', {
  successRateMinPercent: 95,
  responseTimeMaxMs: 5000,
  uptimeMinPercent: 99.5,
  errorRateMaxPercent: 5,
});

// Check health
const status = await healthChecker.checkAgentHealth('LOKI');
// {
//   componentId: 'LOKI',
//   healthScore: 87,        // 0-100
//   healthy: true,          // >= 80
//   degraded: false,        // 50-80
//   critical: false,        // < 50
//   checks: {...},
//   failures: []
// }
```

**Health Scoring**:
- Agents: 40% success + 40% response time + 20% error rate
- Workflows: 50% success + 50% execution time
- System: Average of all components

**SLA Report**:

```typescript
const report = await healthChecker.generateSLAReport(
  ['LOKI', 'APOLLO'],  // agents
  ['wf-intake'],       // workflows
  '24h'
);
// {
//   period: '24h',
//   reportDate: Date,
//   agents: [healthStatus],
//   workflows: [healthStatus],
//   systemHealth: 92,
//   breaches: [{component, metric, target, actual}]
// }
```

---

### Phase 5: Testing & Validation

**Purpose**: Comprehensive test coverage (91.8%), performance validation, E2E testing

**Test Files** (3,429 lines):
```
src/agents/core/__tests__/
├── monitoring-service.unit.test.ts (510 lines, 60 tests)
├── alert-manager.unit.test.ts (570 lines, 58 tests)
├── health-checker.unit.test.ts (550 lines, 57 tests)
├── monitoring.integration.test.ts (399 lines, 42 tests)
├── monitoring.load.test.ts (420 lines, 17 tests)
└── monitoring.e2e.test.ts (580 lines, 19 tests)
```

**Test Coverage**: 91.8% average

**Performance Results**:
- 50 concurrent metrics: < 1s ✅
- 100 concurrent workflows: < 2s ✅
- 500 metric spike: < 10s ✅
- 1000 consecutive ops: Stable ✅
- Memory efficiency: < 1MB/100ops ✅

---

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast bundling
- **Tailwind CSS** for styling
- **shadcn/ui** for components

### Backend
- **Node.js** runtime
- **Express** web framework
- **TypeScript** for type safety
- **Supabase** (PostgreSQL + pgvector)
- **Redis** for caching
- **PM2** for process management

### Infrastructure
- **Hostinger KVM4** VPS
- **Ubuntu 24** OS
- **Docker** for containerization
- **n8n Cloud** for workflows

### Testing
- **Vitest** test framework
- **Jest** compatibility
- **Supertest** for API testing

### Monitoring
- **Prometheus** metrics
- **Grafana** dashboards
- **Slack** notifications

---

## Data Flow

### Agent Execution Flow

```
1. User Input
   └─ "Qualifique João Silva como lead"
   
2. Intent Router
   ├─ Parse objective
   ├─ Extract context
   └─ Select LOKI agent (Sales division)
   
3. Autonomous Agent (LOKI)
   ├─ Planner
   │  ├─ Get historical context
   │  └─ Plan tasks: [lookup, analyze, score]
   ├─ Executor
   │  ├─ Execute: Lookup João Silva
   │  ├─ Execute: Analyze engagement
   │  └─ Execute: Calculate score (parallel)
   └─ Reporter
      └─ Consolidate: "Score 8.5/10 - High value lead"
   
4. Monitoring
   ├─ Log execution (2.3s, success)
   ├─ Update metrics
   ├─ Check SLA (pass)
   └─ Record cost ($0.15)
   
5. Response
   └─ Dashboard shows: "João Silva: 8.5/10"
```

### Workflow Orchestration Flow

```
1. n8n Webhook Trigger
   └─ /webhooks/leads (POST)
   
2. Extract Data
   └─ {name, email, company, ...}
   
3. Call LOKI Agent
   └─ elizaOS: /api/agents/LOKI/execute
   
4. Conditional: Is High Value?
   ├─ YES → APOLLO (deal sizing)
   ├─ NO  → Archive to database
   
5. Log Results
   └─ Google Sheets append
   
6. Notify
   └─ Slack: #sales
```

---

## Scaling Considerations

### Current Capacity
- **57 agents** operational
- **20 workflows** orchestrated
- **50+ executions/day**
- **500+ concurrent operations**

### Scaling to 1000+ Agents

**Database Optimization**
```sql
-- Indexing strategies
CREATE INDEX idx_execution_agent_time 
  ON agent_executions(agent_id, created_at DESC);

CREATE INDEX idx_metrics_agent_time 
  ON agent_metrics(agent_id, recorded_at DESC);
```

**Caching Layer**
```typescript
// Redis caching for frequently accessed data
const agent = await cache.get('agent:LOKI');
if (!agent) {
  agent = await db.getAgent('LOKI');
  await cache.set('agent:LOKI', agent, 3600);
}
```

**Load Balancing**
```
┌─────────────┐
│   Nginx     │ (Load Balancer)
├─────────────┤
│ Node #1     │ (3000)
│ Node #2     │ (3000)
│ Node #3     │ (3000)
└─────────────┘
```

**Distributed Execution**
```
Queue (Redis)
  ├─ Task-1
  ├─ Task-2
  └─ Task-N
     │
     ├─ Worker-1 (LOKI)
     ├─ Worker-2 (APOLLO)
     └─ Worker-N (...)
```

---

## Security Architecture

### Authentication
- JWT tokens for API access
- Service role keys for backend
- Rate limiting per agent (100 req/min)
- CORS configured for trusted origins

### Data Protection
- TLS/HTTPS for all transport
- Supabase encryption at rest
- Row-level security (RLS) policies
- Audit logs for all operations

### Access Control
```typescript
// Role-based access control
interface UserRole {
  user_id: string;
  divisions: string[];      // Can access these divisions
  agents: string[];         // Can execute these agents
  workflows: string[];      // Can trigger these workflows
  can_modify_rules: boolean;
}
```

---

## Future Architecture

### Version 2
- Web dashboard for real-time monitoring
- Advanced analytics and reporting
- ML-based optimization
- Custom metric definitions

### Version 3+
- Multi-region deployment
- Distributed agent execution
- Real-time agent collaboration
- Enterprise SSO integration

---

## References

- See QUICK_START.md for getting started
- See API_REFERENCE.md for endpoint documentation
- See OPERATIONS.md for deployment and maintenance
- See test files for implementation examples

---

**Architecture Version**: 1.0
**Last Updated**: 2026-04-14
**Status**: Production Ready ✅
