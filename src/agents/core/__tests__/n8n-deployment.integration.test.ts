// File: src/agents/core/__tests__/n8n-deployment.integration.test.ts
// Purpose: Integration tests for n8n deployment
// Phase: PASSO 7.3 - n8n Cloud Integration

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { N8nIntegration } from '../n8n-integration';
import { N8nWorkflowBuilder } from '../n8n-workflow-builder';
import { N8nDeploymentOrchestrator } from '../n8n-deployment-orchestrator';
import { Logger } from '../logger';
import { ContextManager } from '../context-manager';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn().mockResolvedValue({ data: { id: 'wf-123', execution_id: 'exec-123', status: 'success' } }),
      get: vi.fn().mockResolvedValue({ data: { id: 'wf-123', active: true } }),
      patch: vi.fn().mockResolvedValue({ data: { id: 'wf-123' } }),
      delete: vi.fn().mockResolvedValue({ data: {} }),
    })),
  },
}));

// Mock Supabase and Redis
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    setex: vi.fn().mockResolvedValue('OK'),
    quit: vi.fn().mockResolvedValue('OK'),
    disconnect: vi.fn(),
  })),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));

describe('n8n Deployment Integration', () => {
  let n8nClient: N8nIntegration;
  let orchestrator: N8nDeploymentOrchestrator;
  let logger: Logger;
  let contextManager: ContextManager;

  beforeEach(() => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: false,
      enableDatabase: false,
      enableFile: false,
    });

    contextManager = new ContextManager(
      'https://test.supabase.co',
      'test-key',
      'redis://localhost:6379'
    );

    n8nClient = new N8nIntegration(
      'https://n8n.example.com',
      'test-api-key',
      logger,
      contextManager
    );

    orchestrator = new N8nDeploymentOrchestrator(n8nClient, logger);
  });

  describe('workflow builder', () => {
    it('should create basic workflow with webhook trigger', () => {
      const builder = new N8nWorkflowBuilder('Test Workflow', 'Test Description');
      builder.addWebhookTrigger('/webhook/test');
      builder.addAgentNode('agent-1', 'ARTEMIS', { elizaOsUrl: 'http://localhost:3001', apiKey: 'test-key' });

      const workflow = builder.build();

      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.nodes.length).toBeGreaterThan(0);
      expect(workflow.nodes[0].type).toBe('n8n-nodes-base.webhook');
    });

    it('should create workflow with cron trigger', () => {
      const builder = new N8nWorkflowBuilder('Scheduled Workflow');
      builder.addCronTrigger('0 9 * * *');
      builder.addAgentNode('agent-1', 'ARTEMIS', { elizaOsUrl: 'http://localhost:3001', apiKey: 'test-key' });

      const workflow = builder.build();

      expect(workflow.nodes[0].type).toBe('n8n-nodes-base.cron');
    });

    it('should add agent execution nodes', () => {
      const builder = new N8nWorkflowBuilder('Agent Workflow');
      builder
        .addWebhookTrigger('/webhook')
        .addAgentNode('agent-1', 'ARTEMIS', 'http://localhost:3001', 'api-key', 30)
        .connect('webhook-trigger', 'agent-1');

      const workflow = builder.build();

      expect(workflow.nodes.length).toBe(2);
      expect(workflow.nodes[1].type).toBe('n8n-nodes-base.httpRequest');
    });

    it('should connect nodes properly', () => {
      const builder = new N8nWorkflowBuilder('Connection Test');
      builder
        .addWebhookTrigger('/webhook')
        .addAgentNode('agent-1', 'ARTEMIS', 'http://localhost:3001', 'api-key')
        .addSlackNotification('slack-1', '#alerts', 'cred-123', 'Task completed')
        .connect('webhook-trigger', 'agent-1')
        .connect('agent-1', 'slack-1');

      const workflow = builder.build();

      expect(workflow.connections['webhook-trigger']).toBeDefined();
      expect(workflow.connections['agent-1']).toBeDefined();
    });

    it('should support conditional branching', () => {
      const builder = new N8nWorkflowBuilder('Conditional Workflow');
      builder
        .addWebhookTrigger('/webhook')
        .addAgentNode('agent-1', 'ARTEMIS', 'http://localhost:3001', 'api-key')
        .addConditionalNode('if-node', 'Check score')
        .addSlackNotification('success-slack', '#wins', 'cred-123', 'Success!')
        .addSlackNotification('failure-slack', '#failures', 'cred-123', 'Failed')
        .connect('webhook-trigger', 'agent-1')
        .connect('agent-1', 'if-node')
        .connectConditional('if-node', 'success-slack', 'failure-slack');

      const workflow = builder.build();

      expect(workflow.nodes.length).toBe(5);
      expect(workflow.connections['if-node'].length).toBe(2);
    });

    it('should support parallel execution', () => {
      const builder = new N8nWorkflowBuilder('Parallel Workflow');
      builder
        .addWebhookTrigger('/webhook')
        .addAgentNode('agent-1', 'ARTEMIS', 'http://localhost:3001', 'api-key')
        .addAgentNode('agent-2', 'LOKI', 'http://localhost:3001', 'api-key')
        .addAgentNode('agent-3', 'WANDA', 'http://localhost:3001', 'api-key')
        .connect('webhook-trigger', 'agent-1')
        .connectParallel('agent-1', ['agent-2', 'agent-3']);

      const workflow = builder.build();

      expect(workflow.connections['agent-1'].length).toBe(2);
    });

    it('should add database logging nodes', () => {
      const builder = new N8nWorkflowBuilder('Logging Workflow');
      builder
        .addWebhookTrigger('/webhook')
        .addPostgresLogging('postgres-log', 'cred-123', 'agent_executions', {
          execution_id: '={{$json.execution_id}}',
          status: '={{$json.status}}',
          timestamp: '={{$now.toISOString()}}',
        })
        .connect('webhook-trigger', 'postgres-log');

      const workflow = builder.build();

      expect(workflow.nodes.some(n => n.type === 'n8n-nodes-base.postgres')).toBe(true);
    });

    it('should build from definition', () => {
      const definition = {
        name: 'Test Workflow',
        description: 'Test',
        trigger: {
          type: 'webhook' as const,
          config: { path: '/test' },
        },
        nodes: [
          {
            nodeId: 'agent-1',
            agentId: 'ARTEMIS',
            type: 'agent' as const,
            parameters: {
              elizaOsUrl: 'http://localhost:3001',
              apiKey: 'test-key',
            },
          },
        ],
        connections: [
          { from: 'webhook-trigger', to: 'agent-1' },
        ],
      };

      const workflow = N8nWorkflowBuilder.fromDefinition(definition);

      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.nodes.length).toBeGreaterThan(0);
    });

    it('should export to JSON', () => {
      const builder = new N8nWorkflowBuilder('JSON Test');
      builder.addWebhookTrigger('/webhook');
      builder.addAgentNode('agent-1', 'ARTEMIS', { elizaOsUrl: 'http://localhost:3001', apiKey: 'test-key' });

      const json = builder.toJSON();

      expect(typeof json).toBe('string');
      expect(json).toContain('JSON Test');
      expect(json).toContain('webhook-trigger');
    });

    it('should validate workflow completeness', () => {
      const builder = new N8nWorkflowBuilder('Invalid Workflow');

      expect(() => builder.build()).toThrow('Workflow must have at least one trigger');
    });
  });

  describe('n8n integration', () => {
    it('should deploy workflow', async () => {
      const builder = new N8nWorkflowBuilder('Deploy Test');
      builder.addWebhookTrigger('/test');
      builder.addAgentNode('agent-1', 'ARTEMIS', { elizaOsUrl: 'http://localhost:3001', apiKey: 'test-key' });
      const workflow = builder.build();

      const workflowId = await n8nClient.deployWorkflow('Test Workflow', workflow, {
        webhookPath: '/test',
      });

      expect(workflowId).toBe('wf-123');
    });

    it('should execute workflow', async () => {
      const ctx = await contextManager.create('N8N', 'test execution', 'integration', undefined, { initial: true });

      const execution = await n8nClient.executeWorkflow(ctx.executionId, 'wf-123', {
        message: 'test',
      });

      expect(execution.id).toBeDefined();
      expect(execution.status).toBe('running');
    });

    it('should get workflow status', async () => {
      const execution = await n8nClient.getExecutionStatus('wf-123', 'exec-123');

      expect(execution.workflowId).toBe('wf-123');
      expect(execution.id).toBe('exec-123');
    });

    it('should list workflows', async () => {
      const workflows = await n8nClient.listWorkflows();

      expect(Array.isArray(workflows)).toBe(true);
    });

    it('should activate/deactivate workflows', async () => {
      await n8nClient.activateWorkflow('wf-123');
      await n8nClient.deactivateWorkflow('wf-123');

      expect(true).toBe(true); // No error thrown
    });

    it('should setup credentials', async () => {
      const credentialId = await n8nClient.setupCredential('slack', 'slackApi', {
        token: 'xoxb-test',
      });

      expect(credentialId).toBeDefined();
    });

    it('should perform health check', async () => {
      const healthy = await n8nClient.healthCheck();

      expect(typeof healthy).toBe('boolean');
    });
  });

  describe('deployment orchestrator', () => {
    it('should deploy multiple workflows', async () => {
      const workflows = [
        {
          id: 'wf-1',
          name: 'Workflow 1',
          description: 'Test 1',
          definition: {
            name: 'WF-1',
            trigger: { type: 'webhook' as const, config: { path: '/wf1' } },
            nodes: [],
            connections: [],
          },
          config: { webhookPath: '/wf1' },
          active: true,
        },
        {
          id: 'wf-2',
          name: 'Workflow 2',
          description: 'Test 2',
          definition: {
            name: 'WF-2',
            trigger: { type: 'cron' as const, config: { schedule: '0 9 * * *' } },
            nodes: [],
            connections: [],
          },
          config: { cronSchedule: '0 9 * * *' },
          active: true,
        },
      ];

      const summary = await orchestrator.deployAllWorkflows(workflows);

      expect(summary.total).toBe(2);
    });

    it('should skip inactive workflows', async () => {
      const workflows = [
        {
          id: 'wf-1',
          name: 'Active',
          description: 'Active workflow',
          definition: {
            name: 'Active',
            trigger: { type: 'webhook' as const, config: { path: '/test' } },
            nodes: [],
            connections: [],
          },
          config: {},
          active: true,
        },
        {
          id: 'wf-2',
          name: 'Inactive',
          description: 'Inactive workflow',
          definition: {
            name: 'Inactive',
            trigger: { type: 'webhook' as const, config: { path: '/test' } },
            nodes: [],
            connections: [],
          },
          config: {},
          active: false,
        },
      ];

      const summary = await orchestrator.deployAllWorkflows(workflows);

      expect(summary.skipped).toBe(1);
    });

    it('should validate deployments', async () => {
      const validations = await orchestrator.validateDeployments(['wf-123', 'wf-456']);

      expect(validations.size).toBe(2);
    });

    it('should test workflow executions', async () => {
      const workflows = new Map<string, string>([
        ['wf-123', '{"input":"test"}'],
        ['wf-456', '{"input":"test2"}'],
      ]);

      const results = await orchestrator.testWorkflowExecutions(workflows, 5000);

      expect(results.size).toBe(2);
    });

    it('should rollback deployments', async () => {
      const rollbackResults = await orchestrator.rollbackDeployments(['wf-123', 'wf-456']);

      expect(rollbackResults.size).toBe(2);
    });

    it('should monitor workflow health', async () => {
      const healthMetrics = await orchestrator.monitorWorkflowHealth(['wf-123'], {
        sampleSize: 10,
      });

      expect(healthMetrics.size).toBeGreaterThan(0);
    });

    it('should generate deployment report', () => {
      const summary = {
        total: 10,
        successful: 9,
        failed: 1,
        skipped: 0,
        results: [],
        totalTime: 5000,
      };

      const report = orchestrator.generateDeploymentReport(summary);

      expect(report).toContain('Deployment Report');
      expect(report).toContain('10');
      expect(report).toContain('9');
      expect(report).toContain('1');
    });
  });
});
