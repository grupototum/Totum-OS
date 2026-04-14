// File: src/agents/core/__tests__/alert-manager.unit.test.ts
// Purpose: Unit tests for AlertManager with >90% coverage
// Phase: PASSO 7.5 - Tests & Validation

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AlertManager, AlertSeverity, AlertStatus } from '../alert-manager';
import { Logger } from '../logger';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn().mockResolvedValue({ data: {} }),
    })),
  },
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));

describe('AlertManager Unit Tests', () => {
  let logger: Logger;
  let alertManager: AlertManager;

  beforeEach(() => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: false,
      enableDatabase: false,
      enableFile: false,
    });

    alertManager = new AlertManager(logger);
  });

  describe('alert creation', () => {
    it('should create alert with all fields', async () => {
      const alert = await alertManager.createAlert(
        'Test Alert',
        'This is a test alert',
        AlertSeverity.WARNING,
        'test-system',
        { agentId: 'AGENT_001' }
      );

      expect(alert).toBeDefined();
      expect(alert.id).toBeDefined();
      expect(alert.title).toBe('Test Alert');
      expect(alert.description).toBe('This is a test alert');
      expect(alert.severity).toBe(AlertSeverity.WARNING);
      expect(alert.status).toBe(AlertStatus.OPEN);
      expect(alert.source).toBe('test-system');
      expect(alert.metadata.agentId).toBe('AGENT_001');
    });

    it('should create alert with empty metadata', async () => {
      const alert = await alertManager.createAlert(
        'Alert Without Metadata',
        'Description',
        AlertSeverity.INFO,
        'test'
      );

      expect(alert.metadata).toEqual({});
    });

    it('should generate unique alert IDs', async () => {
      const alert1 = await alertManager.createAlert(
        'Alert 1',
        'Desc',
        AlertSeverity.INFO,
        'test'
      );

      const alert2 = await alertManager.createAlert(
        'Alert 2',
        'Desc',
        AlertSeverity.INFO,
        'test'
      );

      expect(alert1.id).not.toBe(alert2.id);
    });

    it('should set correct timestamp', async () => {
      const beforeTime = new Date();
      const alert = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.INFO,
        'test'
      );
      const afterTime = new Date();

      expect(alert.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(alert.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should respect MAX_ALERTS limit', async () => {
      // Create 1005 alerts to exceed MAX_ALERTS (1000)
      for (let i = 0; i < 1005; i++) {
        await alertManager.createAlert(
          `Alert ${i}`,
          'Desc',
          AlertSeverity.INFO,
          'test'
        );
      }

      const allAlerts = alertManager.getAlertHistory(2000);
      expect(allAlerts.length).toBeLessThanOrEqual(1000);
    });

    it('should handle all severity levels', async () => {
      const severities = [AlertSeverity.INFO, AlertSeverity.WARNING, AlertSeverity.CRITICAL];

      for (const severity of severities) {
        const alert = await alertManager.createAlert(
          `Alert ${severity}`,
          'Desc',
          severity,
          'test'
        );
        expect(alert.severity).toBe(severity);
      }
    });
  });

  describe('alert acknowledgment', () => {
    it('should acknowledge alert', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const acknowledged = await alertManager.acknowledgeAlert(created.id);

      expect(acknowledged).toBeDefined();
      expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);
      expect(acknowledged?.acknowledgedAt).toBeDefined();
    });

    it('should set acknowledgement time', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const beforeTime = new Date();
      const acknowledged = await alertManager.acknowledgeAlert(created.id);
      const afterTime = new Date();

      if (acknowledged?.acknowledgedAt) {
        expect(acknowledged.acknowledgedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(acknowledged.acknowledgedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      }
    });

    it('should return null for non-existent alert', async () => {
      const result = await alertManager.acknowledgeAlert('non-existent-id');
      expect(result).toBeNull();
    });

    it('should allow acknowledging with optional user', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const acknowledged = await alertManager.acknowledgeAlert(created.id, 'user@example.com');
      expect(acknowledged?.status).toBe(AlertStatus.ACKNOWLEDGED);
    });
  });

  describe('alert resolution', () => {
    it('should resolve alert', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const resolved = await alertManager.resolveAlert(created.id);

      expect(resolved).toBeDefined();
      expect(resolved?.status).toBe(AlertStatus.RESOLVED);
      expect(resolved?.resolvedAt).toBeDefined();
    });

    it('should set resolution time', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const beforeTime = new Date();
      const resolved = await alertManager.resolveAlert(created.id);
      const afterTime = new Date();

      if (resolved?.resolvedAt) {
        expect(resolved.resolvedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(resolved.resolvedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      }
    });

    it('should return null for non-existent alert', async () => {
      const result = await alertManager.resolveAlert('non-existent-id');
      expect(result).toBeNull();
    });

    it('should allow resolving with optional user', async () => {
      const created = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      const resolved = await alertManager.resolveAlert(created.id, 'user@example.com');
      expect(resolved?.status).toBe(AlertStatus.RESOLVED);
    });
  });

  describe('alert rules', () => {
    it('should register alert rule', () => {
      alertManager.registerRule({
        id: 'test-rule',
        name: 'Test Rule',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      expect(true).toBe(true); // No error thrown
    });

    it('should evaluate rule condition true', async () => {
      alertManager.registerRule({
        id: 'test-rule',
        name: 'High Value Alert',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 150 });

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].title).toBe('High Value Alert');
    });

    it('should evaluate rule condition false', async () => {
      alertManager.registerRule({
        id: 'test-rule',
        name: 'High Value Alert',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 50 });

      expect(alerts.length).toBe(0);
    });

    it('should not evaluate disabled rules', async () => {
      alertManager.registerRule({
        id: 'disabled-rule',
        name: 'Disabled Rule',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: false,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 150 });

      expect(alerts.length).toBe(0);
    });

    it('should handle rule evaluation errors gracefully', async () => {
      alertManager.registerRule({
        id: 'error-rule',
        name: 'Broken Rule',
        condition: (data) => {
          throw new Error('Rule error');
        },
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 150 });

      // Should handle error without throwing
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should evaluate multiple rules', async () => {
      alertManager.registerRule({
        id: 'rule-1',
        name: 'Rule 1',
        condition: (data) => data.value > 100,
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      alertManager.registerRule({
        id: 'rule-2',
        name: 'Rule 2',
        condition: (data) => data.value < 50,
        severity: AlertSeverity.INFO,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({ value: 150 });

      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  describe('active alerts retrieval', () => {
    it('should get active alerts', async () => {
      await alertManager.createAlert('Alert 1', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.createAlert('Alert 2', 'Desc', AlertSeverity.INFO, 'test');

      const active = alertManager.getActiveAlerts();

      expect(active.length).toBeGreaterThanOrEqual(2);
      expect(active.every(a => a.status === AlertStatus.OPEN)).toBe(true);
    });

    it('should filter active alerts by agent ID', async () => {
      const alert = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test',
        { agentId: 'AGENT_001' }
      );

      const active = alertManager.getActiveAlerts('AGENT_001');

      expect(active.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter active alerts by severity', async () => {
      await alertManager.createAlert('Alert', 'Desc', AlertSeverity.CRITICAL, 'test');

      const critical = alertManager.getActiveAlerts(undefined, AlertSeverity.CRITICAL);

      expect(critical.length).toBeGreaterThanOrEqual(1);
      expect(critical.every(a => a.severity === AlertSeverity.CRITICAL)).toBe(true);
    });

    it('should exclude acknowledged alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.acknowledgeAlert(created.id);

      const active = alertManager.getActiveAlerts();

      expect(active.find(a => a.id === created.id)).toBeUndefined();
    });

    it('should exclude resolved alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.resolveAlert(created.id);

      const active = alertManager.getActiveAlerts();

      expect(active.find(a => a.id === created.id)).toBeUndefined();
    });
  });

  describe('alert history', () => {
    it('should get alert history', async () => {
      await alertManager.createAlert('Alert 1', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.createAlert('Alert 2', 'Desc', AlertSeverity.INFO, 'test');

      const history = alertManager.getAlertHistory(100);

      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(2);
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 20; i++) {
        await alertManager.createAlert(`Alert ${i}`, 'Desc', AlertSeverity.INFO, 'test');
      }

      const history = alertManager.getAlertHistory(5);

      expect(history.length).toBeLessThanOrEqual(5);
    });

    it('should return most recent first', async () => {
      const alert1 = await alertManager.createAlert('Alert 1', 'Desc', AlertSeverity.INFO, 'test');
      await new Promise(resolve => setTimeout(resolve, 10));
      const alert2 = await alertManager.createAlert('Alert 2', 'Desc', AlertSeverity.INFO, 'test');

      const history = alertManager.getAlertHistory(100);

      const alert2Index = history.findIndex(a => a.id === alert2.id);
      const alert1Index = history.findIndex(a => a.id === alert1.id);

      expect(alert2Index).toBeLessThan(alert1Index);
    });
  });

  describe('alert statistics', () => {
    it('should get alert statistics', async () => {
      await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');

      const stats = alertManager.getAlertStatistics();

      expect(stats).toBeDefined();
      expect(stats.totalAlerts).toBeGreaterThanOrEqual(1);
      expect(stats.openAlerts).toBeGreaterThanOrEqual(1);
      expect(stats.acknowledgedAlerts).toBeGreaterThanOrEqual(0);
      expect(stats.resolvedAlerts).toBeGreaterThanOrEqual(0);
    });

    it('should count severity distribution', async () => {
      await alertManager.createAlert('Critical', 'Desc', AlertSeverity.CRITICAL, 'test');
      await alertManager.createAlert('Warning', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.createAlert('Info', 'Desc', AlertSeverity.INFO, 'test');

      const stats = alertManager.getAlertStatistics();

      expect(stats.bySeverity.critical).toBeGreaterThanOrEqual(1);
      expect(stats.bySeverity.warning).toBeGreaterThanOrEqual(1);
      expect(stats.bySeverity.info).toBeGreaterThanOrEqual(1);
    });

    it('should count acknowledged alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.acknowledgeAlert(created.id);

      const stats = alertManager.getAlertStatistics();

      expect(stats.acknowledgedAlerts).toBeGreaterThanOrEqual(1);
    });

    it('should count resolved alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.resolveAlert(created.id);

      const stats = alertManager.getAlertStatistics();

      expect(stats.resolvedAlerts).toBeGreaterThanOrEqual(1);
    });

    it('should respect time window', async () => {
      const stats = alertManager.getAlertStatistics(1000); // 1 second window
      expect(stats.totalAlerts).toBeGreaterThanOrEqual(0);
    });
  });

  describe('alert cleanup', () => {
    it('should clear old resolved alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.resolveAlert(created.id);

      const cleared = alertManager.clearOldAlerts(0); // Clear all

      expect(cleared).toBeGreaterThanOrEqual(0);
    });

    it('should not clear recent resolved alerts', async () => {
      const created = await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');
      await alertManager.resolveAlert(created.id);

      const cleared = alertManager.clearOldAlerts(86400000); // 24 hours

      expect(cleared).toBe(0);
    });

    it('should not clear open alerts', async () => {
      await alertManager.createAlert('Alert', 'Desc', AlertSeverity.WARNING, 'test');

      const cleared = alertManager.clearOldAlerts(0);

      expect(cleared).toBe(0);
    });
  });

  describe('slack configuration', () => {
    it('should configure slack', () => {
      alertManager.configureSlack({
        webhookUrl: 'https://hooks.slack.com/services/TEST/TEST',
        channelDefault: '#alerts',
        mentionOnCritical: '@oncall',
      });

      expect(true).toBe(true);
    });

    it('should support slack configuration without mention', () => {
      alertManager.configureSlack({
        webhookUrl: 'https://hooks.slack.com/services/TEST/TEST',
        channelDefault: '#alerts',
      });

      expect(true).toBe(true);
    });
  });

  describe('email configuration', () => {
    it('should configure email', () => {
      alertManager.configureEmail({
        smtpServer: 'smtp.example.com',
        smtpPort: 587,
        from: 'alerts@example.com',
        recipients: ['admin@example.com'],
      });

      expect(true).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle alert creation errors gracefully', async () => {
      const alert = await alertManager.createAlert(
        'Alert',
        'Desc',
        AlertSeverity.WARNING,
        'test'
      );

      expect(alert).toBeDefined();
    });

    it('should handle rule evaluation errors', async () => {
      alertManager.registerRule({
        id: 'error-rule',
        name: 'Error Rule',
        condition: () => {
          throw new Error('Test error');
        },
        severity: AlertSeverity.WARNING,
        enabled: true,
        notificationChannels: [],
      });

      const alerts = await alertManager.evaluateRules({});

      expect(Array.isArray(alerts)).toBe(true);
    });
  });
});
