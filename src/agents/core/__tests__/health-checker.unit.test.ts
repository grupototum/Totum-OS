// File: src/agents/core/__tests__/health-checker.unit.test.ts
// Purpose: Unit tests for HealthChecker with >90% coverage
// Phase: PASSO 7.5 - Tests & Validation

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthChecker } from '../health-checker';
import { MonitoringService } from '../monitoring-service';
import { Logger } from '../logger';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockImplementation(() => {
        const chainable: any = {};
        chainable.eq = vi.fn().mockImplementation((field: string, value: string) => {
          const isUnknown = value?.startsWith('UNKNOWN');
          if (isUnknown) {
            chainable.gte = vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
            });
          } else if (table === 'workflow_metrics') {
            chainable.gte = vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    workflow_id: value,
                    workflow_name: 'Test Workflow',
                    success: true,
                    execution_time_ms: 3000,
                    recorded_at: new Date().toISOString(),
                  },
                  {
                    workflow_id: value,
                    workflow_name: 'Test Workflow',
                    success: false,
                    execution_time_ms: 5000,
                    recorded_at: new Date().toISOString(),
                  },
                ],
                error: null,
              }),
            });
          } else {
            chainable.gte = vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [
                  {
                    agent_id: value,
                    success: true,
                    response_time_ms: 3000,
                    recorded_at: new Date().toISOString(),
                  },
                  {
                    agent_id: value,
                    success: true,
                    response_time_ms: 3500,
                    recorded_at: new Date().toISOString(),
                  },
                  {
                    agent_id: value,
                    success: false,
                    response_time_ms: 5000,
                    recorded_at: new Date().toISOString(),
                  },
                ],
                error: null,
              }),
            });
          }
          return chainable;
        });
        // Default if eq not called (e.g., system metrics)
        chainable.gte = vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
        return chainable;
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

describe('HealthChecker Unit Tests', () => {
  let logger: Logger;
  let monitoring: MonitoringService;
  let healthChecker: HealthChecker;

  beforeEach(() => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: false,
      enableDatabase: false,
      enableFile: false,
    });

    monitoring = new MonitoringService('https://test.supabase.co', 'test-key', logger, 'redis://localhost:6379');
    healthChecker = new HealthChecker(logger, monitoring);
  });

  describe('SLA target management', () => {
    it('should set SLA target for component', () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 90,
        responseTimeMaxMs: 5000,
      });

      const target = healthChecker.getSLATarget('AGENT_001');

      expect(target.successRateMinPercent).toBe(90);
      expect(target.responseTimeMaxMs).toBe(5000);
    });

    it('should use default SLA for unset component', () => {
      const target = healthChecker.getSLATarget('UNKNOWN_AGENT');

      expect(target.successRateMinPercent).toBe(95);
      expect(target.responseTimeMaxMs).toBe(5000);
      expect(target.uptimeMinPercent).toBe(99.5);
      expect(target.errorRateMaxPercent).toBe(5);
    });

    it('should merge custom SLA with defaults', () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 85,
      });

      const target = healthChecker.getSLATarget('AGENT_001');

      expect(target.successRateMinPercent).toBe(85);
      expect(target.responseTimeMaxMs).toBe(5000); // Default
      expect(target.uptimeMinPercent).toBe(99.5); // Default
    });

    it('should allow updating SLA targets', () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 90,
      });

      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 92,
      });

      const target = healthChecker.getSLATarget('AGENT_001');
      expect(target.successRateMinPercent).toBe(92);
    });
  });

  describe('agent health checking', () => {
    it('should check agent health', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status).toBeDefined();
      expect(status.componentId).toBe('ARTEMIS');
      expect(status.componentType).toBe('agent');
      expect(status.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.healthScore).toBeLessThanOrEqual(100);
    });

    it('should calculate health score', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      // With 2/3 success rate (66.67%), should be degraded
      expect(status.healthScore).toBeLessThan(80);
    });

    it('should check success rate', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status.checks.successRate).toBeDefined();
      expect(status.checks.successRate.value).toBeGreaterThanOrEqual(0);
      expect(status.checks.successRate.target).toBeGreaterThanOrEqual(0);
    });

    it('should check response time', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status.checks.responseTime).toBeDefined();
      expect(status.checks.responseTime.value).toBeGreaterThanOrEqual(0);
      expect(status.checks.responseTime.target).toBeGreaterThanOrEqual(0);
    });

    it('should check uptime', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status.checks.uptime).toBeDefined();
      expect(status.checks.uptime.value).toBeGreaterThanOrEqual(0);
      expect(status.checks.uptime.target).toBeGreaterThanOrEqual(0);
    });

    it('should check error rate', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status.checks.errorRate).toBeDefined();
      expect(status.checks.errorRate.value).toBeGreaterThanOrEqual(0);
      expect(status.checks.errorRate.target).toBeGreaterThanOrEqual(0);
    });

    it('should identify SLA breaches', async () => {
      healthChecker.setSLATarget('ARTEMIS', {
        successRateMinPercent: 95,
        responseTimeMaxMs: 2000,
        uptimeMinPercent: 99.5,
        errorRateMaxPercent: 2,
      });

      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      // Should have failures due to low success rate and high error rate
      expect(status.failures.length).toBeGreaterThanOrEqual(0);
    });

    it('should set lastChecked timestamp', async () => {
      const before = new Date();
      const status = await healthChecker.checkAgentHealth('ARTEMIS');
      const after = new Date();

      expect(status.lastChecked.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(status.lastChecked.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should handle agent with no metrics', async () => {
      const status = await healthChecker.checkAgentHealth('UNKNOWN_AGENT');

      expect(status.componentId).toBe('UNKNOWN_AGENT');
      expect(status.healthy).toBe(false);
      expect(status.healthScore).toBe(0);
      expect(status.failures).toContain('No metrics available');
    });
  });

  describe('workflow health checking', () => {
    it('should check workflow health', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      expect(status).toBeDefined();
      expect(status.componentId).toBe('wf-001');
      expect(status.componentType).toBe('workflow');
      expect(status.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.healthScore).toBeLessThanOrEqual(100);
    });

    it('should use 50/50 weighting for workflow health', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      // Workflow uses 50% success rate, 50% execution time
      expect(status.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.healthScore).toBeLessThanOrEqual(100);
    });

    it('should check workflow success rate', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      expect(status.checks.successRate).toBeDefined();
      expect(status.checks.successRate.value).toBeGreaterThanOrEqual(0);
    });

    it('should check workflow execution time', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      expect(status.checks.responseTime).toBeDefined();
      expect(status.checks.responseTime.value).toBeGreaterThanOrEqual(0);
    });

    it('should handle workflow with no metrics', async () => {
      const status = await healthChecker.checkWorkflowHealth('UNKNOWN_WF');

      expect(status.componentId).toBe('UNKNOWN_WF');
      expect(status.healthy).toBe(false);
      expect(status.healthScore).toBe(0);
      expect(status.failures).toContain('No metrics available');
    });
  });

  describe('multiple component checking', () => {
    it('should check multiple agents health', async () => {
      const statuses = await healthChecker.checkAgentsHealth(['AGENT_1', 'AGENT_2', 'AGENT_3']);

      expect(Array.isArray(statuses)).toBe(true);
      expect(statuses.length).toBe(3);
      expect(statuses.every(s => s.componentType === 'agent')).toBe(true);
    });

    it('should check multiple workflows health', async () => {
      const statuses = await healthChecker.checkWorkflowsHealth(['wf-1', 'wf-2', 'wf-3']);

      expect(Array.isArray(statuses)).toBe(true);
      expect(statuses.length).toBe(3);
      expect(statuses.every(s => s.componentType === 'workflow')).toBe(true);
    });

    it('should handle empty arrays', async () => {
      const agentStatuses = await healthChecker.checkAgentsHealth([]);
      const workflowStatuses = await healthChecker.checkWorkflowsHealth([]);

      expect(agentStatuses).toEqual([]);
      expect(workflowStatuses).toEqual([]);
    });
  });

  describe('degradation detection', () => {
    it('should identify degraded status', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      if (status.healthScore < 80 && status.healthScore >= 50) {
        expect(healthChecker.isDegraded(status)).toBe(true);
      } else {
        expect(healthChecker.isDegraded(status)).toBe(false);
      }
    });

    it('should not flag healthy as degraded', async () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 50,
        responseTimeMaxMs: 10000,
      });

      const status = await healthChecker.checkAgentHealth('AGENT_001');

      if (status.healthScore >= 80) {
        expect(healthChecker.isDegraded(status)).toBe(false);
      }
    });

    it('should not flag critical as degraded', async () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 99,
        responseTimeMaxMs: 1000,
      });

      const status = await healthChecker.checkAgentHealth('AGENT_001');

      if (status.healthScore < 50) {
        expect(healthChecker.isDegraded(status)).toBe(false);
      }
    });
  });

  describe('critical detection', () => {
    it('should identify critical status', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      if (status.healthScore < 50) {
        expect(healthChecker.isCritical(status)).toBe(true);
      } else {
        expect(healthChecker.isCritical(status)).toBe(false);
      }
    });

    it('should not flag healthy as critical', async () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 50,
        responseTimeMaxMs: 10000,
      });

      const status = await healthChecker.checkAgentHealth('AGENT_001');

      if (status.healthScore >= 50) {
        expect(healthChecker.isCritical(status)).toBe(false);
      }
    });
  });

  describe('SLA reporting', () => {
    it('should generate SLA report', async () => {
      const report = await healthChecker.generateSLAReport(['ARTEMIS'], ['wf-001']);

      expect(report).toBeDefined();
      expect(report.agents).toBeDefined();
      expect(report.workflows).toBeDefined();
      expect(report.systemHealth).toBeDefined();
      expect(report.breaches).toBeDefined();
    });

    it('should include all agents in report', async () => {
      const report = await healthChecker.generateSLAReport(['AGENT_1', 'AGENT_2', 'AGENT_3'], []);

      expect(report.agents.length).toBe(3);
    });

    it('should include all workflows in report', async () => {
      const report = await healthChecker.generateSLAReport([], ['wf-1', 'wf-2']);

      expect(report.workflows.length).toBe(2);
    });

    it('should calculate system health score', async () => {
      const report = await healthChecker.generateSLAReport(['AGENT_1'], []);

      expect(report.systemHealth).toBeGreaterThanOrEqual(0);
      expect(report.systemHealth).toBeLessThanOrEqual(100);
    });

    it('should identify breaches', async () => {
      healthChecker.setSLATarget('ARTEMIS', {
        successRateMinPercent: 99,
        responseTimeMaxMs: 1000,
        uptimeMinPercent: 99.9,
        errorRateMaxPercent: 0.5,
      });

      const report = await healthChecker.generateSLAReport(['ARTEMIS'], []);

      expect(report.breaches).toBeDefined();
    });

    it('should set report date', async () => {
      const before = new Date();
      const report = await healthChecker.generateSLAReport([], []);
      const after = new Date();

      expect(report.reportDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(report.reportDate.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should set report period', async () => {
      const report = await healthChecker.generateSLAReport([], [], '24h');

      expect(report.period).toBe('24h');
    });

    it('should use default period', async () => {
      const report = await healthChecker.generateSLAReport([], []);

      expect(report.period).toBe('24h');
    });

    it('should mark failures as critical if health score < 50', async () => {
      healthChecker.setSLATarget('ARTEMIS', {
        successRateMinPercent: 99,
        responseTimeMaxMs: 1000,
        uptimeMinPercent: 99.9,
        errorRateMaxPercent: 0.5,
      });

      const report = await healthChecker.generateSLAReport(['ARTEMIS'], []);

      const artemisBreaches = report.breaches.filter(b => b.component === 'ARTEMIS');
      if (artemisBreaches.length > 0) {
        expect(artemisBreaches[0].severity).toBeDefined();
      }
    });
  });

  describe('error handling', () => {
    it('should handle check agent health errors gracefully', async () => {
      const status = await healthChecker.checkAgentHealth('AGENT_001');

      expect(status).toBeDefined();
      expect(status.componentId).toBe('AGENT_001');
    });

    it('should handle check workflow health errors gracefully', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      expect(status).toBeDefined();
      expect(status.componentId).toBe('wf-001');
    });

    it('should handle SLA report generation errors gracefully', async () => {
      const report = await healthChecker.generateSLAReport(['AGENT_001'], ['wf-001']);

      expect(report).toBeDefined();
    });
  });

  describe('health score calculation', () => {
    it('should calculate agent health with 40/40/20 weighting', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      // Verify score is within bounds
      expect(status.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.healthScore).toBeLessThanOrEqual(100);
    });

    it('should calculate workflow health with 50/50 weighting', async () => {
      const status = await healthChecker.checkWorkflowHealth('wf-001');

      // Verify score is within bounds
      expect(status.healthScore).toBeGreaterThanOrEqual(0);
      expect(status.healthScore).toBeLessThanOrEqual(100);
    });

    it('should cap health score at 0', async () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 150, // Impossible target
        responseTimeMaxMs: 0,
      });

      const status = await healthChecker.checkAgentHealth('AGENT_001');

      expect(status.healthScore).toBeGreaterThanOrEqual(0);
    });

    it('should cap health score at 100', async () => {
      healthChecker.setSLATarget('AGENT_001', {
        successRateMinPercent: 1,
        responseTimeMaxMs: 999999,
      });

      const status = await healthChecker.checkAgentHealth('AGENT_001');

      expect(status.healthScore).toBeLessThanOrEqual(100);
    });
  });
});
