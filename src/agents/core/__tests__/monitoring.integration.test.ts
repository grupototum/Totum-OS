// File: src/agents/core/__tests__/monitoring.integration.test.ts
// Purpose: Integration tests for monitoring, alerting, and health checking
// Phase: PASSO 7.5 - Tests & Validation

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MonitoringService } from '../monitoring-service';
import { AlertManager, AlertSeverity, AlertStatus } from '../alert-manager';
import { HealthChecker } from '../health-checker';
import { Logger } from '../logger';

// Mock Supabase and Redis
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [
                {
                  agent_id: 'ARTEMIS',
                  success: true,
                  response_time_ms: 3000,
                  recorded_at: new Date().toISOString(),
                },
                {
                  agent_id: 'ARTEMIS',
                  success: true,
                  response_time_ms: 3500,
                  recorded_at: new Date().toISOString(),
                },
                {
                  agent_id: 'ARTEMIS',
                  success: false,
                  response_time_ms: 5000,
                  recorded_at: new Date().toISOString(),
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        lt: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn().mockResolvedValue({ data: {} }),
    })),
  },
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

describe('Monitoring Integration Tests', () => {
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

    monitoring = new MonitoringService('https://test.supabase.co', 'test-key', logger, 'redis://localhost:6379');
    alertManager = new AlertManager(logger);
    healthChecker = new HealthChecker(logger, monitoring);
  });

  describe('metrics collection flow', () => {
    it('should record agent execution metric', async () => {
      await monitoring.recordAgentExecution('ARTEMIS', 'exec-1', true, 3000);

      expect(true).toBe(true); // No error thrown
    });

    it('should record workflow execution metric', async () => {
      await monitoring.recordWorkflowExecution('wf-001', 'Lead Intake', 'exec-1', true, 5000);

      expect(true).toBe(true); // No error thrown
    });

    it('should retrieve agent metrics', async () => {
      const metrics = await monitoring.getAgentMetrics('ARTEMIS');

      expect(metrics).toBeDefined();
      if (metrics) {
        expect(metrics.agentId).toBe('ARTEMIS');
        expect(metrics.successRate).toBeGreaterThan(0);
      }
    });

    it('should calculate metrics correctly', async () => {
      const metrics = await monitoring.getAgentMetrics('ARTEMIS');

      if (metrics) {
        // Based on 2 successes, 1 failure
        expect(metrics.successRate).toBeCloseTo(66.67, 1);
        expect(metrics.successCount).toBe(2);
        expect(metrics.failureCount).toBe(1);
        expect(metrics.averageResponseTimeMs).toBeGreaterThan(0);
      }
    });
  });

  describe('alert creation and management', () => {
    it('should create alert', async () => {
      const alert = await alertManager.createAlert(
        'Test Alert',
        'This is a test alert',
        AlertSeverity.WARNING,
        'test-system'
      );

      expect(alert.id).toBeDefined();
      expect(alert.title).toBe('Test Alert');
      expect(alert.status).toBe(AlertStatus.OPEN);
    });

    it('should acknowledge alert', async () => {
      const alert = await alertManager.createAlert(
        'Test Alert',
        'Description',
        AlertSeverity.WARNING,
        'test'
      );

      const acknowledged = await alertManager.acknowledgeAlert(alert.id);

      expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);
    });

    it('should resolve alert', async () => {
      const alert = await alertManager.createAlert(
        'Test Alert',
        'Description',
        AlertSeverity.WARNING,
        'test'
      );

      const resolved = await alertManager.resolveAlert(alert.id);

      expect(resolved?.status).toBe(AlertStatus.RESOLVED);
    });

    it('should register and evaluate rules', async () => {
      alertManager.registerRule({
        id: 'test-rule',
        name: 'Test Rule',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 150 });

      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should get active alerts', async () => {
      await alertManager.createAlert(
        'Alert 1',
        'Description',
        AlertSeverity.WARNING,
        'test'
      );

      await alertManager.createAlert(
        'Alert 2',
        'Description',
        AlertSeverity.CRITICAL,
        'test'
      );

      const active = alertManager.getActiveAlerts();

      expect(active.length).toBe(2);
    });

    it('should get alert statistics', () => {
      const stats = alertManager.getAlertStatistics();

      expect(stats.totalAlerts).toBeGreaterThanOrEqual(0);
      expect(stats.openAlerts).toBeGreaterThanOrEqual(0);
    });
  });

  describe('health checking and SLA validation', () => {
    it('should check agent health', async () => {
      healthChecker.setSLATarget('ARTEMIS', {
        successRateMinPercent: 90,
        responseTimeMaxMs: 5000,
        uptimeMinPercent: 99,
        errorRateMaxPercent: 10,
      });

      const status = await healthChecker.checkAgentHealth('ARTEMIS');

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

    it('should identify SLA breaches', async () => {
      healthChecker.setSLATarget('ARTEMIS', {
        successRateMinPercent: 95,
        responseTimeMaxMs: 2000,
        uptimeMinPercent: 99.5,
        errorRateMaxPercent: 2,
      });

      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      // Should have failures due to low success rate
      expect(status.failures.length).toBeGreaterThan(0);
    });

    it('should detect degradation', async () => {
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      if (status.healthScore < 80 && status.healthScore >= 50) {
        expect(healthChecker.isDegraded(status)).toBe(true);
      }
    });

    it('should check multiple agents', async () => {
      const statuses = await healthChecker.checkAgentsHealth(['ARTEMIS', 'LOKI', 'WANDA']);

      expect(statuses.length).toBe(3);
      statuses.forEach(status => {
        expect(status.componentType).toBe('agent');
        expect(status.healthScore).toBeGreaterThanOrEqual(0);
      });
    });

    it('should generate SLA report', async () => {
      const report = await healthChecker.generateSLAReport(['ARTEMIS'], ['wf-001']);

      expect(report.agents.length).toBeGreaterThan(0);
      expect(report.reportDate).toBeDefined();
      expect(report.systemHealth).toBeGreaterThanOrEqual(0);
    });
  });

  describe('monitoring workflow', () => {
    it('should integrate monitoring and alerts', async () => {
      // Record metrics
      await monitoring.recordAgentExecution('ARTEMIS', 'exec-1', true, 3000);

      // Register alert rule based on metrics
      alertManager.registerRule({
        id: 'success-rate-rule',
        name: 'Low Success Rate',
        condition: (data) => data.successRate < 90,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      // Get metrics and evaluate rules
      const metrics = await monitoring.getAgentMetrics('ARTEMIS');
      if (metrics) {
        const alerts = await alertManager.evaluateRules({
          successRate: metrics.successRate,
          agentId: 'ARTEMIS',
        });

        // If success rate is low, alert should be created
        if (metrics.successRate < 90) {
          expect(alerts.length).toBeGreaterThan(0);
        }
      }
    });

    it('should integrate monitoring and health checking', async () => {
      // Record metrics
      await monitoring.recordAgentExecution('ARTEMIS', 'exec-1', true, 3000);
      await monitoring.recordAgentExecution('ARTEMIS', 'exec-2', false, 5000);

      // Check health
      const status = await healthChecker.checkAgentHealth('ARTEMIS');

      expect(status.checks.successRate.value).toBeGreaterThan(0);
      expect(status.checks.responseTime.value).toBeGreaterThan(0);
    });

    it('should handle monitoring → alert → acknowledgment flow', async () => {
      // Create alert
      const alert = await alertManager.createAlert(
        'Test Issue',
        'Something went wrong',
        AlertSeverity.CRITICAL,
        'monitoring'
      );

      // Check health
      let status = await healthChecker.checkAgentHealth('ARTEMIS');
      expect(status).toBeDefined();

      // Acknowledge alert
      const acknowledged = await alertManager.acknowledgeAlert(alert.id);
      expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);

      // Resolve alert
      const resolved = await alertManager.resolveAlert(alert.id);
      expect(resolved?.status).toBe(AlertStatus.RESOLVED);
    });
  });

  describe('performance under load', () => {
    it('should handle multiple metrics simultaneously', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            'ARTEMIS',
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 5000
          )
        );
      }

      await Promise.all(promises);

      expect(promises.length).toBe(10);
    });

    it('should handle alert creation under load', async () => {
      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(
          alertManager.createAlert(
            `Alert ${i}`,
            'Test description',
            i % 3 === 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
            'load-test'
          )
        );
      }

      const alerts = await Promise.all(promises);

      expect(alerts.length).toBe(50);
    });

    it('should cleanup old alerts efficiently', () => {
      const initialCount = alertManager.getActiveAlerts().length;

      // Clear alerts older than 0ms (all)
      const cleared = alertManager.clearOldAlerts(0);

      expect(cleared).toBeGreaterThanOrEqual(0);
    });
  });

  describe('prometheus export', () => {
    it('should export metrics in prometheus format', async () => {
      const output = await monitoring.exportPrometheus(['ARTEMIS']);

      expect(typeof output).toBe('string');
      expect(output).toContain('agent_success_rate');
      expect(output).toContain('ARTEMIS');
    });
  });
});
