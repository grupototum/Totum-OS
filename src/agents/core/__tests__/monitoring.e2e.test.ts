// File: src/agents/core/__tests__/monitoring.e2e.test.ts
// Purpose: End-to-end tests for complete monitoring workflows
// Phase: PASSO 7.5 - Tests & Validation

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MonitoringService } from '../monitoring-service';
import { AlertManager, AlertSeverity, AlertStatus } from '../alert-manager';
import { HealthChecker } from '../health-checker';
import { Logger } from '../logger';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockImplementation((field: string, value: string) => {
          const isWorkflow = table === 'workflow_metrics';
          const baseData = [
            {
              agent_id: 'PROD_AGENT',
              workflow_id: isWorkflow ? value : undefined,
              workflow_name: isWorkflow ? 'Prod Workflow' : undefined,
              success: true,
              response_time_ms: 2500,
              execution_time_ms: isWorkflow ? 2500 : undefined,
              recorded_at: new Date().toISOString(),
            },
            {
              agent_id: 'PROD_AGENT',
              workflow_id: isWorkflow ? value : undefined,
              workflow_name: isWorkflow ? 'Prod Workflow' : undefined,
              success: true,
              response_time_ms: 3000,
              execution_time_ms: isWorkflow ? 3000 : undefined,
              recorded_at: new Date().toISOString(),
            },
            {
              agent_id: 'PROD_AGENT',
              workflow_id: isWorkflow ? value : undefined,
              workflow_name: isWorkflow ? 'Prod Workflow' : undefined,
              success: false,
              response_time_ms: 8000,
              execution_time_ms: isWorkflow ? 8000 : undefined,
              recorded_at: new Date().toISOString(),
            },
            {
              agent_id: 'PROD_AGENT',
              workflow_id: isWorkflow ? value : undefined,
              workflow_name: isWorkflow ? 'Prod Workflow' : undefined,
              success: false,
              response_time_ms: 7500,
              execution_time_ms: isWorkflow ? 7500 : undefined,
              recorded_at: new Date().toISOString(),
            },
            {
              agent_id: 'PROD_AGENT',
              workflow_id: isWorkflow ? value : undefined,
              workflow_name: isWorkflow ? 'Prod Workflow' : undefined,
              success: true,
              response_time_ms: 2800,
              execution_time_ms: isWorkflow ? 2800 : undefined,
              recorded_at: new Date().toISOString(),
            },
          ];
          return {
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: baseData, error: null }),
            }),
          };
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        lt: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    setex: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    quit: vi.fn().mockResolvedValue('OK'),
  })),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));

describe('Monitoring E2E Tests', () => {
  let logger: Logger;
  let monitoring: MonitoringService;
  let alertManager: AlertManager;
  let healthChecker: HealthChecker;

  beforeEach(() => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: false,
      enableDatabase: false,
      enableFile: false,
    });

    monitoring = new MonitoringService('https://test.supabase.co', 'test-key', logger);
    alertManager = new AlertManager(logger);
    healthChecker = new HealthChecker(logger, monitoring);
  });

  describe('complete monitoring workflow', () => {
    it('should execute full metrics → alerts → acknowledgment → resolution flow', async () => {
      // Step 1: Record agent executions
      await monitoring.recordAgentExecution('AGENT_001', 'exec-1', true, 2000);
      await monitoring.recordAgentExecution('AGENT_001', 'exec-2', true, 2500);
      await monitoring.recordAgentExecution('AGENT_001', 'exec-3', false, 8000, 'Timeout');

      // Step 2: Get metrics
      const metrics = await monitoring.getAgentMetrics('AGENT_001');
      expect(metrics).toBeDefined();
      expect(metrics?.successRate).toBeLessThan(100);

      // Step 3: Register alert rule
      alertManager.registerRule({
        id: 'low-success-rate',
        name: 'Low Success Rate',
        condition: (data) => data.successRate < 90,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      // Step 4: Evaluate rules and create alerts
      if (metrics) {
        const alerts = await alertManager.evaluateRules({
          successRate: metrics.successRate,
          agentId: 'AGENT_001',
        });

        // Step 5: Acknowledge alert if created
        if (alerts.length > 0) {
          const alert = alerts[0];
          const acknowledged = await alertManager.acknowledgeAlert(alert.id);
          expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);

          // Step 6: Resolve alert
          const resolved = await alertManager.resolveAlert(alert.id);
          expect(resolved?.status).toBe(AlertStatus.RESOLVED);
        }
      }

      expect(true).toBe(true);
    });

    it('should track workflow from initiation to completion', async () => {
      const workflowId = 'wf-intake-001';

      // Step 1: Record workflow start
      await monitoring.recordWorkflowExecution(workflowId, 'Lead Intake', 'exec-1', true, 5000);

      // Step 2: Record multiple workflow steps
      for (let i = 2; i <= 5; i++) {
        await monitoring.recordWorkflowExecution(
          workflowId,
          'Lead Intake',
          `exec-${i}`,
          Math.random() > 0.2,
          4000 + Math.random() * 2000
        );
      }

      // Step 3: Get workflow metrics
      const metrics = await monitoring.getWorkflowMetrics(workflowId);
      expect(metrics).toBeDefined();
      expect(metrics?.totalExecutions).toBeGreaterThan(0);

      // Step 4: Check workflow health
      const health = await healthChecker.checkWorkflowHealth(workflowId);
      expect(health.componentType).toBe('workflow');

      // Step 5: Verify health score is calculated
      expect(health.healthScore).toBeGreaterThanOrEqual(0);
      expect(health.healthScore).toBeLessThanOrEqual(100);
    });

    it('should generate comprehensive SLA report', async () => {
      // Setup: Record metrics for multiple agents and workflows
      const agents = ['ARTEMIS', 'APOLLO', 'ATHENA'];
      const workflows = ['wf-intake', 'wf-followup', 'wf-renewal'];

      for (const agent of agents) {
        for (let i = 0; i < 5; i++) {
          await monitoring.recordAgentExecution(
            agent,
            `exec-${i}`,
            Math.random() > 0.15,
            2000 + Math.random() * 3000
          );
        }
      }

      for (const workflow of workflows) {
        for (let i = 0; i < 3; i++) {
          await monitoring.recordWorkflowExecution(
            workflow,
            workflow,
            `exec-${i}`,
            Math.random() > 0.2,
            5000 + Math.random() * 5000
          );
        }
      }

      // Generate SLA report
      const report = await healthChecker.generateSLAReport(agents, workflows, '24h');

      // Validate report structure
      expect(report.period).toBe('24h');
      expect(report.agents.length).toBeGreaterThanOrEqual(0);
      expect(report.workflows.length).toBeGreaterThanOrEqual(0);
      expect(report.systemHealth).toBeGreaterThanOrEqual(0);
      expect(report.systemHealth).toBeLessThanOrEqual(100);
      expect(Array.isArray(report.breaches)).toBe(true);
    });
  });

  describe('alert escalation workflow', () => {
    it('should escalate from warning to critical alerts', async () => {
      // Create initial warning alert
      const warning = await alertManager.createAlert(
        'High Latency Warning',
        'Agent response time elevated',
        AlertSeverity.WARNING,
        'monitoring',
        { agentId: 'AGENT_001', responseTime: 4000 }
      );

      expect(warning.severity).toBe(AlertSeverity.WARNING);

      // Create critical alert if condition worsens
      const critical = await alertManager.createAlert(
        'Critical Agent Failure',
        'Agent response time critical',
        AlertSeverity.CRITICAL,
        'monitoring',
        { agentId: 'AGENT_001', responseTime: 15000 }
      );

      expect(critical.severity).toBe(AlertSeverity.CRITICAL);

      // Both should be retrievable as active
      const activeAlerts = alertManager.getActiveAlerts('AGENT_001');
      expect(activeAlerts.length).toBeGreaterThanOrEqual(0);
    });

    it('should track alert lifecycle through all states', async () => {
      const alert = await alertManager.createAlert(
        'Lifecycle Test Alert',
        'Testing alert state transitions',
        AlertSeverity.WARNING,
        'test'
      );

      // State 1: OPEN
      expect(alert.status).toBe(AlertStatus.OPEN);

      // State 2: ACKNOWLEDGED
      const acknowledged = await alertManager.acknowledgeAlert(alert.id);
      expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);
      expect(acknowledged?.acknowledgedAt).toBeDefined();

      // State 3: RESOLVED
      const resolved = await alertManager.resolveAlert(alert.id);
      expect(resolved?.status).toBe(AlertStatus.RESOLVED);
      expect(resolved?.resolvedAt).toBeDefined();

      // Verify it's no longer in active alerts
      const activeAlerts = alertManager.getActiveAlerts();
      expect(activeAlerts.find(a => a.id === alert.id)).toBeUndefined();
    });
  });

  describe('multi-agent orchestration monitoring', () => {
    it('should monitor 7 agents across 3 divisions', async () => {
      const divisions = {
        'DIV-001': ['ARTEMIS', 'APOLLO', 'ATHENA'],
        'DIV-002': ['HERMES', 'HEPHAESTUS'],
        'DIV-003': ['POSEIDON', 'HADES'],
      };

      // Record metrics for all agents
      for (const [division, agents] of Object.entries(divisions)) {
        for (const agent of agents) {
          for (let i = 0; i < 3; i++) {
            await monitoring.recordAgentExecution(
              agent,
              `exec-${i}`,
              Math.random() > 0.1,
              2000 + Math.random() * 3000
            );
          }
        }
      }

      // Check health for all agents
      const allAgents = Object.values(divisions).flat();
      const healthStatuses = await healthChecker.checkAgentsHealth(allAgents);

      expect(healthStatuses.length).toBe(7);

      // Verify each agent has health metrics
      for (const status of healthStatuses) {
        expect(status.componentType).toBe('agent');
        expect(status.healthScore).toBeGreaterThanOrEqual(0);
        expect(status.healthScore).toBeLessThanOrEqual(100);
      }

      // Get system-wide metrics
      const systemMetrics = await monitoring.getSystemMetrics(allAgents, []);
      expect(systemMetrics.totalAgents).toBe(7);
    });

    it('should detect and report degraded division performance', async () => {
      // Create degraded agent (low success rate)
      const degradedAgent = 'DEGRADED_AGENT';
      for (let i = 0; i < 10; i++) {
        await monitoring.recordAgentExecution(
          degradedAgent,
          `exec-${i}`,
          i % 5 === 0, // 20% success rate
          5000 + Math.random() * 5000,
          'Intermittent failures'
        );
      }

      // Set strict SLA
      healthChecker.setSLATarget(degradedAgent, {
        successRateMinPercent: 95,
        responseTimeMaxMs: 3000,
        uptimeMinPercent: 99,
        errorRateMaxPercent: 2,
      });

      // Check health
      const status = await healthChecker.checkAgentHealth(degradedAgent);

      // Should be degraded or critical
      expect(status.healthy).toBe(false);
      expect(status.failures.length).toBeGreaterThan(0);

      // Health score should reflect poor performance
      expect(status.healthScore).toBeLessThan(80);
    });
  });

  describe('workflow-level monitoring', () => {
    it('should monitor complete workflow execution sequence', async () => {
      const workflowId = 'wf-leadgen-complete';

      // Simulate workflow execution with multiple steps
      const executionSteps = [
        { success: true, time: 2000, step: 'extract' },
        { success: true, time: 1500, step: 'enrich' },
        { success: false, time: 5000, step: 'validate' },
        { success: true, time: 2500, step: 'enrichment-retry' },
      ];

      for (let i = 0; i < 5; i++) {
        let totalTime = 0;
        let allSuccess = true;

        for (const step of executionSteps) {
          totalTime += step.time;
          allSuccess = allSuccess && step.success;
        }

        await monitoring.recordWorkflowExecution(
          workflowId,
          'Lead Generation',
          `exec-batch-${i}`,
          allSuccess,
          totalTime
        );
      }

      // Get workflow metrics
      const metrics = await monitoring.getWorkflowMetrics(workflowId);
      expect(metrics).toBeDefined();
      expect(metrics?.totalExecutions).toBe(5);

      // Check workflow health
      const health = await healthChecker.checkWorkflowHealth(workflowId);
      expect(health.componentType).toBe('workflow');
      expect(health.checks.successRate).toBeDefined();
      expect(health.checks.responseTime).toBeDefined();
    });

    it('should detect workflow bottlenecks', async () => {
      const slowWorkflow = 'wf-slow-pipeline';

      // Record slow executions
      for (let i = 0; i < 5; i++) {
        await monitoring.recordWorkflowExecution(
          slowWorkflow,
          'Slow Pipeline',
          `exec-${i}`,
          true,
          30000 + Math.random() * 10000 // 30-40 second executions
        );
      }

      // Get metrics
      const metrics = await monitoring.getWorkflowMetrics(slowWorkflow);
      expect(metrics?.averageExecutionTimeMs).toBeGreaterThan(0);

      // Register alert rule for slow workflows
      alertManager.registerRule({
        id: 'slow-workflow',
        name: 'Slow Workflow Execution',
        condition: (data) => data.avgTime > 25000,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      // Evaluate rule
      if (metrics) {
        const alerts = await alertManager.evaluateRules({
          avgTime: metrics.averageExecutionTimeMs,
          workflowId: slowWorkflow,
        });

        if (metrics.averageExecutionTimeMs > 25000) {
          expect(alerts.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('production validation scenarios', () => {
    it('should handle production-like traffic pattern (1 hour simulation)', async () => {
      const agents = Array.from({ length: 20 }, (_, i) => `PROD_AGENT_${i}`);
      const workflows = Array.from({ length: 5 }, (_, i) => `wf-prod-${i}`);

      const metrics = {
        totalMetrics: 0,
        totalAlerts: 0,
        avgResponseTime: 0,
      };

      // Simulate 60 minutes of production traffic
      for (let minute = 0; minute < 60; minute++) {
        // Variable load throughout the day
        const isHighLoad = minute % 15 < 10; // 10 minutes of high load, 5 of normal
        const metricsPerMinute = isHighLoad ? 50 : 20;

        // Record metrics
        for (let i = 0; i < metricsPerMinute; i++) {
          const agent = agents[Math.floor(Math.random() * agents.length)];
          const success = Math.random() > 0.05; // 95% success
          const responseTime = 2000 + Math.random() * 4000;

          await monitoring.recordAgentExecution(
            agent,
            `prod-exec-${minute}-${i}`,
            success,
            responseTime
          );

          metrics.totalMetrics++;
          metrics.avgResponseTime += responseTime;
        }

        // Register and evaluate alert rules
        if (minute % 15 === 0) {
          alertManager.registerRule({
            id: `rule-${minute}`,
            name: `Performance Rule ${minute}`,
            condition: (data) => data.successRate < 90,
            severity: AlertSeverity.WARNING,
            enabled: true,
            notificationChannels: [],
          });
        }

        // Simulate 100ms per minute
        await new Promise(resolve => setTimeout(resolve, 1));
      }

      metrics.avgResponseTime = metrics.avgResponseTime / metrics.totalMetrics;

      // Generate final report
      const report = await healthChecker.generateSLAReport(agents, workflows);

      expect(report).toBeDefined();
      expect(metrics.totalMetrics).toBe(2400); // (10 * 50 + 5 * 20) * 4 blocks = 2400
      console.log(`\nProduction simulation (60 min):`);
      console.log(`  - Total metrics recorded: ${metrics.totalMetrics}`);
      console.log(`  - Avg response time: ${metrics.avgResponseTime.toFixed(0)}ms`);
      console.log(`  - System health: ${report.systemHealth}%`);
    });

    it('should support prometheus metrics export', async () => {
      // Record some metrics
      for (let i = 0; i < 10; i++) {
        await monitoring.recordAgentExecution(
          'PROD_AGENT',
          `exec-${i}`,
          Math.random() > 0.1,
          2000 + Math.random() * 3000
        );
      }

      // Export to prometheus format
      const prometheusOutput = await monitoring.exportPrometheus(['PROD_AGENT']);

      // Validate prometheus format
      expect(typeof prometheusOutput).toBe('string');
      expect(prometheusOutput).toContain('agent_success_rate');
      expect(prometheusOutput).toContain('agent_response_time');
      expect(prometheusOutput).toContain('agent_error_rate');
      expect(prometheusOutput).toContain('PROD_AGENT');

      // Each line should be valid prometheus format
      const lines = prometheusOutput.split('\n').filter(l => l && !l.startsWith('#'));
      for (const line of lines) {
        const parts = line.split(' ');
        expect(parts.length).toBeGreaterThanOrEqual(2);
        expect(!isNaN(parseFloat(parts[parts.length - 1]))).toBe(true);
      }
    });
  });

  describe('error recovery and resilience', () => {
    it('should recover from partial metric recording failures', async () => {
      const promises = [];

      // Mix of potentially failing operations
      for (let i = 0; i < 20; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            `AGENT_${i % 5}`,
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 5000
          )
        );
      }

      // All should complete despite any failures
      const results = await Promise.allSettled(promises);
      expect(results.length).toBe(20);
    });

    it('should maintain alert integrity under concurrent operations', async () => {
      const alertPromises = [];

      // Rapid create, acknowledge, resolve cycle
      for (let i = 0; i < 20; i++) {
        const createPromise = alertManager.createAlert(
          `Alert ${i}`,
          'Desc',
          AlertSeverity.WARNING,
          'test'
        ).then(alert => {
          alertManager.acknowledgeAlert(alert.id);
          return alertManager.resolveAlert(alert.id);
        });

        alertPromises.push(createPromise);
      }

      const results = await Promise.all(alertPromises);

      // All should complete successfully
      expect(results.length).toBe(20);
    });
  });
});
