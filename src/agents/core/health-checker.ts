// File: src/agents/core/health-checker.ts
// Purpose: Health checks and SLA validation for agents and workflows
// Phase: PASSO 7.4 - Monitoring & Alerting

import { Logger } from './logger';
import { MonitoringService, AgentMetrics, WorkflowMetrics } from './monitoring-service';

interface SLATarget {
  successRateMinPercent: number;
  responseTimeMaxMs: number;
  uptimeMinPercent: number;
  errorRateMaxPercent: number;
  p95ResponseTimeMaxMs?: number;
  p99ResponseTimeMaxMs?: number;
}

interface HealthStatus {
  componentId: string;
  componentType: 'agent' | 'workflow';
  healthy: boolean;
  healthScore: number; // 0-100
  checks: {
    successRate: { pass: boolean; value: number; target: number };
    responseTime: { pass: boolean; value: number; target: number };
    uptime: { pass: boolean; value: number; target: number };
    errorRate: { pass: boolean; value: number; target: number };
  };
  failures: string[];
  lastChecked: Date;
}

interface SLAReport {
  period: string;
  reportDate: Date;
  agents: HealthStatus[];
  workflows: HealthStatus[];
  systemHealth: number;
  breaches: Array<{
    component: string;
    metric: string;
    target: number;
    actual: number;
    severity: 'warning' | 'critical';
  }>;
}

class HealthChecker {
  private logger: Logger;
  private monitoringService: MonitoringService;
  private slaTargets: Map<string, SLATarget>;
  private lastCheckTimes: Map<string, Date>;
  private readonly DEFAULT_SLA: SLATarget = {
    successRateMinPercent: 95,
    responseTimeMaxMs: 5000,
    uptimeMinPercent: 99.5,
    errorRateMaxPercent: 5,
    p95ResponseTimeMaxMs: 8000,
    p99ResponseTimeMaxMs: 10000,
  };

  constructor(logger: Logger, monitoringService: MonitoringService) {
    this.logger = logger;
    this.monitoringService = monitoringService;
    this.slaTargets = new Map();
    this.lastCheckTimes = new Map();
  }

  /**
   * Set SLA target for component
   */
  setSLATarget(componentId: string, target: Partial<SLATarget>): void {
    this.slaTargets.set(componentId, {
      ...this.DEFAULT_SLA,
      ...target,
    });

    this.logger.info('health-checker', 'SLA', `SLA target set for ${componentId}`, {
      target: this.slaTargets.get(componentId),
    });
  }

  /**
   * Get SLA target for component
   */
  getSLATarget(componentId: string): SLATarget {
    return this.slaTargets.get(componentId) || this.DEFAULT_SLA;
  }

  /**
   * Check agent health
   */
  async checkAgentHealth(agentId: string): Promise<HealthStatus> {
    try {
      const metrics = await this.monitoringService.getAgentMetrics(agentId);

      if (!metrics) {
        return {
          componentId: agentId,
          componentType: 'agent',
          healthy: false,
          healthScore: 0,
          checks: {
            successRate: { pass: false, value: 0, target: 95 },
            responseTime: { pass: false, value: 0, target: 5000 },
            uptime: { pass: false, value: 0, target: 99.5 },
            errorRate: { pass: false, value: 100, target: 5 },
          },
          failures: ['No metrics available'],
          lastChecked: new Date(),
        };
      }

      const sla = this.getSLATarget(agentId);
      const failures: string[] = [];

      // Check success rate
      const successRatePass = metrics.successRate >= sla.successRateMinPercent;
      if (!successRatePass) {
        failures.push(
          `Success rate below target: ${metrics.successRate}% < ${sla.successRateMinPercent}%`
        );
      }

      // Check response time
      const responseTimePass = metrics.averageResponseTimeMs <= sla.responseTimeMaxMs;
      if (!responseTimePass) {
        failures.push(
          `Response time exceeds target: ${metrics.averageResponseTimeMs}ms > ${sla.responseTimeMaxMs}ms`
        );
      }

      // Check p95 response time
      const p95Pass = !sla.p95ResponseTimeMaxMs || metrics.p95ResponseTimeMs <= sla.p95ResponseTimeMaxMs;
      if (!p95Pass) {
        failures.push(
          `P95 response time exceeds target: ${metrics.p95ResponseTimeMs}ms > ${sla.p95ResponseTimeMaxMs}ms`
        );
      }

      // Check error rate
      const errorRatePass = metrics.errorRate <= sla.errorRateMaxPercent;
      if (!errorRatePass) {
        failures.push(
          `Error rate exceeds target: ${metrics.errorRate}% > ${sla.errorRateMaxPercent}%`
        );
      }

      // Calculate health score
      const healthScore = (
        (successRatePass ? sla.successRateMinPercent : 0) * 0.4 +
        (responseTimePass ? 25 : 0) * 0.4 +
        (errorRatePass ? (100 - sla.errorRateMaxPercent) : 0) * 0.2
      ) / 100 * 100;

      const status: HealthStatus = {
        componentId: agentId,
        componentType: 'agent',
        healthy: failures.length === 0,
        healthScore: Math.max(0, Math.min(100, Math.round(healthScore))),
        checks: {
          successRate: {
            pass: successRatePass,
            value: metrics.successRate,
            target: sla.successRateMinPercent,
          },
          responseTime: {
            pass: responseTimePass,
            value: metrics.averageResponseTimeMs,
            target: sla.responseTimeMaxMs,
          },
          uptime: {
            pass: metrics.uptimePercent >= sla.uptimeMinPercent,
            value: metrics.uptimePercent,
            target: sla.uptimeMinPercent,
          },
          errorRate: {
            pass: errorRatePass,
            value: metrics.errorRate,
            target: sla.errorRateMaxPercent,
          },
        },
        failures,
        lastChecked: new Date(),
      };

      this.lastCheckTimes.set(agentId, status.lastChecked);

      return status;
    } catch (error) {
      this.logger.error('health-checker', 'HEALTH_CHECK', `Failed to check agent health: ${agentId}`, {
        error: (error as Error).message,
      });

      return {
        componentId: agentId,
        componentType: 'agent',
        healthy: false,
        healthScore: 0,
        checks: {
          successRate: { pass: false, value: 0, target: 95 },
          responseTime: { pass: false, value: 0, target: 5000 },
          uptime: { pass: false, value: 0, target: 99.5 },
          errorRate: { pass: false, value: 100, target: 5 },
        },
        failures: [(error as Error).message],
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check workflow health
   */
  async checkWorkflowHealth(workflowId: string): Promise<HealthStatus> {
    try {
      const metrics = await this.monitoringService.getWorkflowMetrics(workflowId);

      if (!metrics) {
        return {
          componentId: workflowId,
          componentType: 'workflow',
          healthy: false,
          healthScore: 0,
          checks: {
            successRate: { pass: false, value: 0, target: 95 },
            responseTime: { pass: false, value: 0, target: 5000 },
            uptime: { pass: false, value: 0, target: 99.5 },
            errorRate: { pass: false, value: 100, target: 5 },
          },
          failures: ['No metrics available'],
          lastChecked: new Date(),
        };
      }

      const sla = this.getSLATarget(workflowId);
      const failures: string[] = [];

      // Check success rate
      const successRatePass = metrics.successRate >= sla.successRateMinPercent;
      if (!successRatePass) {
        failures.push(
          `Success rate below target: ${metrics.successRate}% < ${sla.successRateMinPercent}%`
        );
      }

      // Check execution time
      const responseTimePass = metrics.averageExecutionTimeMs <= sla.responseTimeMaxMs;
      if (!responseTimePass) {
        failures.push(
          `Execution time exceeds target: ${metrics.averageExecutionTimeMs}ms > ${sla.responseTimeMaxMs}ms`
        );
      }

      // Calculate health score
      const healthScore = (
        (successRatePass ? sla.successRateMinPercent : 0) * 0.5 +
        (responseTimePass ? 50 : 0) * 0.5
      ) / 100 * 100;

      const status: HealthStatus = {
        componentId: workflowId,
        componentType: 'workflow',
        healthy: failures.length === 0,
        healthScore: Math.max(0, Math.min(100, Math.round(healthScore))),
        checks: {
          successRate: {
            pass: successRatePass,
            value: metrics.successRate,
            target: sla.successRateMinPercent,
          },
          responseTime: {
            pass: responseTimePass,
            value: metrics.averageExecutionTimeMs,
            target: sla.responseTimeMaxMs,
          },
          uptime: {
            pass: true,
            value: 100,
            target: sla.uptimeMinPercent,
          },
          errorRate: {
            pass: (100 - metrics.successRate) <= sla.errorRateMaxPercent,
            value: 100 - metrics.successRate,
            target: sla.errorRateMaxPercent,
          },
        },
        failures,
        lastChecked: new Date(),
      };

      this.lastCheckTimes.set(workflowId, status.lastChecked);

      return status;
    } catch (error) {
      this.logger.error('health-checker', 'HEALTH_CHECK', `Failed to check workflow health: ${workflowId}`, {
        error: (error as Error).message,
      });

      return {
        componentId: workflowId,
        componentType: 'workflow',
        healthy: false,
        healthScore: 0,
        checks: {
          successRate: { pass: false, value: 0, target: 95 },
          responseTime: { pass: false, value: 0, target: 5000 },
          uptime: { pass: false, value: 0, target: 99.5 },
          errorRate: { pass: false, value: 100, target: 5 },
        },
        failures: [(error as Error).message],
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check health of multiple agents
   */
  async checkAgentsHealth(agentIds: string[]): Promise<HealthStatus[]> {
    const results: HealthStatus[] = [];

    for (const agentId of agentIds) {
      const status = await this.checkAgentHealth(agentId);
      results.push(status);
    }

    return results;
  }

  /**
   * Check health of multiple workflows
   */
  async checkWorkflowsHealth(workflowIds: string[]): Promise<HealthStatus[]> {
    const results: HealthStatus[] = [];

    for (const workflowId of workflowIds) {
      const status = await this.checkWorkflowHealth(workflowId);
      results.push(status);
    }

    return results;
  }

  /**
   * Generate SLA report
   */
  async generateSLAReport(
    agentIds: string[],
    workflowIds: string[],
    period: string = '24h'
  ): Promise<SLAReport> {
    const agents = await this.checkAgentsHealth(agentIds);
    const workflows = await this.checkWorkflowsHealth(workflowIds);

    const breaches = [
      ...agents.flatMap(agent =>
        agent.failures.map(failure => ({
          component: agent.componentId,
          metric: failure.split(':')[0],
          target: 0,
          actual: 0,
          severity: agent.healthScore < 50 ? 'critical' as const : 'warning' as const,
        }))
      ),
      ...workflows.flatMap(workflow =>
        workflow.failures.map(failure => ({
          component: workflow.componentId,
          metric: failure.split(':')[0],
          target: 0,
          actual: 0,
          severity: workflow.healthScore < 50 ? 'critical' as const : 'warning' as const,
        }))
      ),
    ];

    const totalHealthy = [...agents, ...workflows].filter(s => s.healthy).length;
    const systemHealth = (totalHealthy / (agents.length + workflows.length)) * 100;

    return {
      period,
      reportDate: new Date(),
      agents,
      workflows,
      systemHealth: Math.round(systemHealth),
      breaches,
    };
  }

  /**
   * Check if component is degraded
   */
  isDegraded(status: HealthStatus): boolean {
    return status.healthScore < 80 && status.healthScore >= 50;
  }

  /**
   * Check if component is critical
   */
  isCritical(status: HealthStatus): boolean {
    return status.healthScore < 50;
  }
}

export {
  HealthChecker,
  HealthStatus,
  SLATarget,
  SLAReport,
};
