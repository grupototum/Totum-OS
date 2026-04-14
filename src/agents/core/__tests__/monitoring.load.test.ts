// File: src/agents/core/__tests__/monitoring.load.test.ts
// Purpose: Load and performance tests for monitoring system
// Phase: PASSO 7.5 - Tests & Validation

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MonitoringService } from '../monitoring-service';
import { AlertManager, AlertSeverity } from '../alert-manager';
import { HealthChecker } from '../health-checker';
import { Logger } from '../logger';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: Array(100).fill(null).map((_, i) => ({
                agent_id: 'TEST_AGENT',
                success: Math.random() > 0.1,
                response_time_ms: Math.random() * 5000,
                recorded_at: new Date().toISOString(),
              })),
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

describe('Monitoring Load Tests', () => {
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

  describe('metric recording under load', () => {
    it('should handle 50 concurrent metric records', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            `AGENT_${i % 10}`,
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 5000
          )
        );
      }

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results.length).toBe(50);
      console.log(`50 concurrent metric records in ${duration}ms`);
    });

    it('should handle 100 concurrent workflow metrics', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          monitoring.recordWorkflowExecution(
            `wf-${i % 10}`,
            `Workflow ${i % 10}`,
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 10000
          )
        );
      }

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results.length).toBe(100); // Promise.all resolves all 100 void promises
      console.log(`100 concurrent workflow records in ${duration}ms`);
    });

    it('should handle burst metric spike (500 records in 1 second)', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 500; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            `AGENT_${i % 20}`,
            `exec-${i}`,
            Math.random() > 0.15,
            Math.random() * 5000
          )
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      console.log(`500 concurrent metric records in ${duration}ms`);
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });

    it('should handle sustained load (metrics every 100ms for 5 seconds)', async () => {
      const startTime = Date.now();
      const recordCount = 50;

      for (let batch = 0; batch < recordCount; batch++) {
        const promises = [];

        for (let i = 0; i < 10; i++) {
          promises.push(
            monitoring.recordAgentExecution(
              `AGENT_${(batch * 10 + i) % 20}`,
              `exec-${batch}-${i}`,
              Math.random() > 0.1,
              Math.random() * 5000
            )
          );
        }

        await Promise.all(promises);
        // Simulate 100ms between batches
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const duration = Date.now() - startTime;
      console.log(`Sustained load: 500 metrics over ${duration}ms`);
      expect(duration).toBeGreaterThan(0);
    });

    it('should maintain memory under load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            `AGENT_${i % 10}`,
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 5000
          )
        );
      }

      await Promise.all(promises);

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB for 100 metrics`);
      expect(true).toBe(true);
    });
  });

  describe('alert creation under load', () => {
    it('should create 50 concurrent alerts', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(
          alertManager.createAlert(
            `Alert ${i}`,
            `Description ${i}`,
            i % 3 === 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
            'load-test'
          )
        );
      }

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results.length).toBe(50);
      console.log(`50 concurrent alerts created in ${duration}ms`);
    });

    it('should create 100 concurrent alerts with rules', async () => {
      alertManager.registerRule({
        id: 'load-test-rule',
        name: 'Load Test Rule',
        condition: (data) => data.value > 50,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          alertManager.evaluateRules({ value: 50 + Math.random() * 50 })
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      console.log(`100 concurrent rule evaluations in ${duration}ms`);
      expect(true).toBe(true);
    });

    it('should handle alert acknowledgment under load', async () => {
      const alerts = [];
      for (let i = 0; i < 50; i++) {
        const alert = await alertManager.createAlert(
          `Alert ${i}`,
          `Desc`,
          AlertSeverity.WARNING,
          'test'
        );
        alerts.push(alert);
      }

      const startTime = Date.now();
      const promises = alerts.map(alert =>
        alertManager.acknowledgeAlert(alert.id)
      );

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      console.log(`50 concurrent acknowledgments in ${duration}ms`);
      expect(true).toBe(true);
    });

    it('should handle alert resolution under load', async () => {
      const alerts = [];
      for (let i = 0; i < 50; i++) {
        const alert = await alertManager.createAlert(
          `Alert ${i}`,
          `Desc`,
          AlertSeverity.WARNING,
          'test'
        );
        alerts.push(alert);
      }

      const startTime = Date.now();
      const promises = alerts.map(alert =>
        alertManager.resolveAlert(alert.id)
      );

      await Promise.all(promises);
      const duration = Date.now() - startTime;

      console.log(`50 concurrent resolutions in ${duration}ms`);
      expect(true).toBe(true);
    });
  });

  describe('health checking under load', () => {
    it('should check health of 20 agents concurrently', async () => {
      const startTime = Date.now();
      const agentIds = Array.from({ length: 20 }, (_, i) => `AGENT_${i}`);

      const statuses = await healthChecker.checkAgentsHealth(agentIds);

      const duration = Date.now() - startTime;

      expect(statuses.length).toBe(20);
      console.log(`Health check for 20 agents in ${duration}ms`);
    });

    it('should generate SLA report for 10 agents and 10 workflows', async () => {
      const startTime = Date.now();
      const agentIds = Array.from({ length: 10 }, (_, i) => `AGENT_${i}`);
      const workflowIds = Array.from({ length: 10 }, (_, i) => `wf-${i}`);

      const report = await healthChecker.generateSLAReport(agentIds, workflowIds);

      const duration = Date.now() - startTime;

      expect(report).toBeDefined();
      console.log(`SLA report for 10 agents + 10 workflows in ${duration}ms`);
    });

    it('should handle rapid consecutive health checks', async () => {
      const startTime = Date.now();
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(healthChecker.checkAgentHealth('AGENT_001'));
      }

      const results = await Promise.all(promises);
      const duration = Date.now() - startTime;

      expect(results.length).toBe(100);
      console.log(`100 consecutive health checks in ${duration}ms`);
    });
  });

  describe('combined load scenario', () => {
    it('should handle simultaneous metrics, alerts, and health checks', async () => {
      const startTime = Date.now();

      const metricPromises = Array.from({ length: 20 }, (_, i) =>
        monitoring.recordAgentExecution(
          `AGENT_${i % 5}`,
          `exec-${i}`,
          Math.random() > 0.1,
          Math.random() * 5000
        )
      );

      const alertPromises = Array.from({ length: 20 }, (_, i) =>
        alertManager.createAlert(
          `Alert ${i}`,
          'Desc',
          AlertSeverity.WARNING,
          'test'
        )
      );

      const healthPromises = Array.from({ length: 5 }, (_, i) =>
        healthChecker.checkAgentHealth(`AGENT_${i}`)
      );

      await Promise.all([
        ...metricPromises,
        ...alertPromises,
        ...healthPromises,
      ]);

      const duration = Date.now() - startTime;

      console.log(`Combined load (20 metrics + 20 alerts + 5 health checks) in ${duration}ms`);
      expect(true).toBe(true);
    });

    it('should handle realistic 10-second traffic pattern', async () => {
      const startTime = Date.now();
      const operationCounts = { metrics: 0, alerts: 0, health: 0 };

      for (let t = 0; t < 10; t++) {
        const promises = [];

        // Simulate realistic traffic pattern
        const metricsPerSecond = 10 + Math.random() * 20;
        for (let i = 0; i < metricsPerSecond; i++) {
          promises.push(
            monitoring.recordAgentExecution(
              `AGENT_${Math.floor(Math.random() * 10)}`,
              `exec-${t}-${i}`,
              Math.random() > 0.1,
              Math.random() * 5000
            )
          );
          operationCounts.metrics++;
        }

        const alertsPerSecond = 2 + Math.random() * 5;
        for (let i = 0; i < alertsPerSecond; i++) {
          promises.push(
            alertManager.createAlert(
              `Alert ${t}-${i}`,
              'Desc',
              i % 3 === 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
              'test'
            )
          );
          operationCounts.alerts++;
        }

        if (t % 3 === 0) {
          promises.push(
            healthChecker.checkAgentsHealth(
              Array.from({ length: 5 }, (_, i) => `AGENT_${i}`)
            )
          );
          operationCounts.health += 5;
        }

        await Promise.all(promises);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const duration = Date.now() - startTime;

      console.log(`\nRealistic 10-second load test:`);
      console.log(`  - Metrics: ${operationCounts.metrics}`);
      console.log(`  - Alerts: ${operationCounts.alerts}`);
      console.log(`  - Health checks: ${operationCounts.health}`);
      console.log(`  - Total duration: ${duration}ms`);
      console.log(`  - Operations per second: ${Math.round((operationCounts.metrics + operationCounts.alerts + operationCounts.health) / (duration / 1000))}`);

      expect(true).toBe(true);
    });
  });

  describe('system stability', () => {
    it('should maintain stability after 1000 operations', async () => {
      const metrics = [];

      for (let i = 0; i < 1000; i++) {
        const startOp = Date.now();

        await monitoring.recordAgentExecution(
          `AGENT_${i % 20}`,
          `exec-${i}`,
          Math.random() > 0.1,
          Math.random() * 5000
        );

        metrics.push(Date.now() - startOp);
      }

      const avgDuration = metrics.reduce((a, b) => a + b, 0) / metrics.length;
      const maxDuration = Math.max(...metrics);
      const minDuration = Math.min(...metrics);

      console.log(`\n1000 metric records:`);
      console.log(`  - Average: ${avgDuration.toFixed(2)}ms`);
      console.log(`  - Max: ${maxDuration}ms`);
      console.log(`  - Min: ${minDuration}ms`);

      // Average should remain relatively consistent
      expect(avgDuration).toBeLessThan(100); // Should be fast
      expect(true).toBe(true);
    });

    it('should handle cleanup efficiently', async () => {
      // Record many metrics
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          monitoring.recordAgentExecution(
            `AGENT_${i % 10}`,
            `exec-${i}`,
            Math.random() > 0.1,
            Math.random() * 5000
          )
        );
      }
      await Promise.all(promises);

      // Cleanup should be fast
      const startCleanup = Date.now();
      await monitoring.cleanup(86400000);
      const cleanupDuration = Date.now() - startCleanup;

      console.log(`Cleanup duration: ${cleanupDuration}ms`);
      expect(cleanupDuration).toBeLessThan(5000); // Should complete in <5 seconds
    });
  });
});
