// File: src/agents/core/alert-manager.ts
// Purpose: Alert management and notification system for monitoring
// Phase: PASSO 7.4 - Monitoring & Alerting

import axios, { AxiosInstance } from 'axios';
import { Logger } from './logger';

enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

enum AlertStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  agentId?: string;
  workflowId?: string;
  source: string;
  timestamp: Date;
  resolvedAt?: Date;
  acknowledgedAt?: Date;
  metadata: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (data: Record<string, any>) => boolean;
  severity: AlertSeverity;
  enabled: boolean;
  notificationChannels: string[]; // 'slack', 'email', 'pagerduty'
}

interface SlackConfig {
  webhookUrl: string;
  channelDefault: string;
  mentionOnCritical?: string; // @oncall or user ID
}

interface EmailConfig {
  smtpServer: string;
  smtpPort: number;
  from: string;
  recipients: string[];
}

class AlertManager {
  private logger: Logger;
  private alerts: Map<string, Alert>;
  private alertRules: Map<string, AlertRule>;
  private slackClient?: AxiosInstance;
  private slackConfig?: SlackConfig;
  private emailConfig?: EmailConfig;
  private readonly MAX_ALERTS = 1000;

  constructor(logger: Logger) {
    this.logger = logger;
    this.alerts = new Map();
    this.alertRules = new Map();
  }

  /**
   * Configure Slack notifications
   */
  configureSlack(config: SlackConfig): void {
    this.slackConfig = config;
    this.slackClient = axios.create({
      baseURL: '',
      timeout: 10000,
    });

    this.logger.info('alert-manager', 'ALERTS', 'Slack configured for notifications');
  }

  /**
   * Configure email notifications
   */
  configureEmail(config: EmailConfig): void {
    this.emailConfig = config;
    this.logger.info('alert-manager', 'ALERTS', 'Email configured for notifications');
  }

  /**
   * Register an alert rule
   */
  registerRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
    this.logger.info('alert-manager', 'ALERTS', `Alert rule registered: ${rule.name}`);
  }

  /**
   * Create an alert
   */
  async createAlert(
    title: string,
    description: string,
    severity: AlertSeverity,
    source: string,
    metadata: Record<string, any> = {}
  ): Promise<Alert> {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      severity,
      status: AlertStatus.OPEN,
      source,
      agentId: metadata.agentId,
      workflowId: metadata.workflowId,
      timestamp: new Date(),
      metadata,
    };

    this.alerts.set(alert.id, alert);

    // Keep only recent alerts
    if (this.alerts.size > this.MAX_ALERTS) {
      const firstKey = this.alerts.keys().next().value;
      if (firstKey) {
        this.alerts.delete(firstKey);
      }
    }

    // Log alert
    this.logger.warn(
      metadata.agentId || 'system',
      'ALERT',
      `${title} [${severity.toUpperCase()}]`,
      metadata
    );

    // Send notifications
    await this.sendNotifications(alert);

    return alert;
  }

  /**
   * Evaluate rules and create alerts
   */
  async evaluateRules(data: Record<string, any>): Promise<Alert[]> {
    const newAlerts: Alert[] = [];

    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(data)) {
          const alert = await this.createAlert(
            rule.name,
            `Rule triggered: ${rule.name}`,
            rule.severity,
            'rule-engine',
            { ruleName: rule.name, data }
          );

          // Notify via configured channels
          for (const channel of rule.notificationChannels) {
            await this.notifyChannel(alert, channel);
          }

          newAlerts.push(alert);
        }
      } catch (error) {
        this.logger.error('alert-manager', 'ALERTS', `Rule evaluation failed: ${rule.name}`, {
          error: (error as Error).message,
        });
      }
    }

    return newAlerts;
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy?: string): Promise<Alert | null> {
    const alert = this.alerts.get(alertId);
    if (!alert) return null;

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedAt = new Date();

    this.logger.info(
      'alert-manager',
      'ALERTS',
      `Alert acknowledged: ${alertId}`,
      { acknowledgedBy }
    );

    return alert;
  }

  /**
   * Resolve alert
   */
  async resolveAlert(alertId: string, resolvedBy?: string): Promise<Alert | null> {
    const alert = this.alerts.get(alertId);
    if (!alert) return null;

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();

    this.logger.info('alert-manager', 'ALERTS', `Alert resolved: ${alertId}`, { resolvedBy });

    return alert;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(agentId?: string, severity?: AlertSeverity): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => {
      if (alert.status !== AlertStatus.OPEN) return false;
      if (agentId && alert.agentId !== agentId) return false;
      if (severity && alert.severity !== severity) return false;
      return true;
    });
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit: number = 100): Alert[] {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get alert statistics
   */
  getAlertStatistics(timeWindowMs: number = 3600000): {
    totalAlerts: number;
    openAlerts: number;
    acknowledgedAlerts: number;
    resolvedAlerts: number;
    bySeverity: Record<string, number>;
  } {
    const cutoffTime = Date.now() - timeWindowMs;
    const recentAlerts = Array.from(this.alerts.values()).filter(
      a => a.timestamp.getTime() > cutoffTime
    );

    const stats = {
      totalAlerts: recentAlerts.length,
      openAlerts: recentAlerts.filter(a => a.status === AlertStatus.OPEN).length,
      acknowledgedAlerts: recentAlerts.filter(a => a.status === AlertStatus.ACKNOWLEDGED).length,
      resolvedAlerts: recentAlerts.filter(a => a.status === AlertStatus.RESOLVED).length,
      bySeverity: {
        info: recentAlerts.filter(a => a.severity === AlertSeverity.INFO).length,
        warning: recentAlerts.filter(a => a.severity === AlertSeverity.WARNING).length,
        critical: recentAlerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
      },
    };

    return stats;
  }

  /**
   * Clear resolved alerts older than specified time
   */
  clearOldAlerts(olderThanMs: number = 86400000): number { // Default: 24 hours
    const cutoffTime = Date.now() - olderThanMs;
    let cleared = 0;

    for (const [id, alert] of this.alerts.entries()) {
      if (
        alert.status === AlertStatus.RESOLVED &&
        alert.resolvedAt &&
        alert.resolvedAt.getTime() < cutoffTime
      ) {
        this.alerts.delete(id);
        cleared++;
      }
    }

    return cleared;
  }

  // Private helper methods

  private async sendNotifications(alert: Alert): Promise<void> {
    if (alert.severity === AlertSeverity.INFO) {
      return; // Don't notify for info level
    }

    // Slack notification for warning and critical
    if (this.slackConfig) {
      await this.notifySlack(alert);
    }

    // Email notification for critical only
    if (alert.severity === AlertSeverity.CRITICAL && this.emailConfig) {
      await this.notifyEmail(alert);
    }
  }

  private async notifyChannel(alert: Alert, channel: string): Promise<void> {
    switch (channel.toLowerCase()) {
      case 'slack':
        if (this.slackConfig) {
          await this.notifySlack(alert);
        }
        break;
      case 'email':
        if (this.emailConfig) {
          await this.notifyEmail(alert);
        }
        break;
      case 'pagerduty':
        await this.notifyPagerDuty(alert);
        break;
      default:
        this.logger.warn('alert-manager', 'ALERTS', `Unknown notification channel: ${channel}`);
    }
  }

  private async notifySlack(alert: Alert): Promise<void> {
    if (!this.slackClient || !this.slackConfig) return;

    try {
      const color =
        alert.severity === AlertSeverity.CRITICAL
          ? '#FF0000'
          : alert.severity === AlertSeverity.WARNING
            ? '#FFA500'
            : '#00FF00';

      const mention =
        alert.severity === AlertSeverity.CRITICAL && this.slackConfig.mentionOnCritical
          ? `<${this.slackConfig.mentionOnCritical}> `
          : '';

      const payload = {
        channel: this.slackConfig.channelDefault,
        text: `${mention}${alert.title}`,
        attachments: [
          {
            color,
            title: alert.title,
            text: alert.description,
            fields: [
              {
                title: 'Severity',
                value: alert.severity.toUpperCase(),
                short: true,
              },
              {
                title: 'Source',
                value: alert.source,
                short: true,
              },
              {
                title: 'Time',
                value: alert.timestamp.toISOString(),
                short: false,
              },
            ],
          },
        ],
      };

      await this.slackClient.post(this.slackConfig.webhookUrl, payload);

      this.logger.info(
        'alert-manager',
        'SLACK_NOTIFICATION',
        `Alert notified to Slack: ${alert.id}`
      );
    } catch (error) {
      this.logger.error('alert-manager', 'SLACK_NOTIFICATION', 'Failed to send Slack notification', {
        error: (error as Error).message,
        alertId: alert.id,
      });
    }
  }

  private async notifyEmail(alert: Alert): Promise<void> {
    if (!this.emailConfig) return;

    try {
      // Email notification would be sent here
      // For now, just log it
      this.logger.info('alert-manager', 'EMAIL_NOTIFICATION', `Alert would be sent via email: ${alert.id}`);
    } catch (error) {
      this.logger.error('alert-manager', 'EMAIL_NOTIFICATION', 'Failed to send email notification', {
        error: (error as Error).message,
        alertId: alert.id,
      });
    }
  }

  private async notifyPagerDuty(alert: Alert): Promise<void> {
    try {
      // PagerDuty notification would be sent here
      // For now, just log it
      this.logger.info('alert-manager', 'PAGERDUTY_NOTIFICATION', `Alert would be sent to PagerDuty: ${alert.id}`);
    } catch (error) {
      this.logger.error('alert-manager', 'PAGERDUTY_NOTIFICATION', 'Failed to send PagerDuty notification', {
        error: (error as Error).message,
        alertId: alert.id,
      });
    }
  }
}

export {
  AlertManager,
  Alert,
  AlertRule,
  AlertSeverity,
  AlertStatus,
  SlackConfig,
  EmailConfig,
};
