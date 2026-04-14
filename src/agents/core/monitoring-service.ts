// File: src/agents/core/monitoring-service.ts
// Purpose: Real-time monitoring and metrics collection for agent orchestration
// Phase: PASSO 7.4 - Monitoring & Alerting

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import { Logger } from './logger';

interface MetricPoint {
  timestamp: Date;
  value: number;
  labels: Record<string, string>;
}

interface AgentMetrics {
  agentId: string;
  successCount: number;
  failureCount: number;
  successRate: number;
  averageResponseTimeMs: number;
  maxResponseTimeMs: number;
  minResponseTimeMs: number;
  p95ResponseTimeMs: number;
  p99ResponseTimeMs: number;
  errorRate: number;
  uptimePercent: number;
  lastExecutionTime?: Date;
  lastError?: string;
}

interface WorkflowMetrics {
  workflowId: string;
  name: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageExecutionTimeMs: number;
  totalDurationMs: number;
  lastExecutionStatus?: string;
  lastExecutionTime?: Date;
}

interface SystemMetrics {
  timestamp: Date;
  totalAgents: number;
  healthyAgents: number;
  degradedAgents: number;
  unhealthyAgents: number;
  totalWorkflows: number;
  activeWorkflows: number;
  averageSuccessRate: number;
  averageResponseTimeMs: number;
  systemHealthScore: number; // 0-100
}

class MonitoringService {
  private supabase: any;
  private redis: Redis;
  private logger: Logger;
  private metricsCache: Map<string, MetricPoint[]>;
  private alertThresholds: Map<string, number>;
  private readonly METRICS_RETENTION = 86400000; // 24 hours
  private readonly REDIS_PREFIX = 'metrics:';
  private readonly MAX_POINTS_PER_METRIC = 1440; // 1 day at 1-minute intervals

  constructor(supabaseUrl: string, supabaseKey: string, logger: Logger, redisUrl?: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.redis = redisUrl ? new Redis(redisUrl) : new Redis();
    this.logger = logger;
    this.metricsCache = new Map();
    this.alertThresholds = new Map([
      ['agent_success_rate', 0.85], // 85% minimum
      ['agent_response_time', 10000], // 10 seconds maximum
      ['workflow_success_rate', 0.90], // 90% minimum
      ['system_health_score', 70], // 70 minimum
      ['error_rate', 0.15], // 15% maximum
    ]);
  }

  /**
   * Record agent execution metric
   */
  async recordAgentExecution(
    agentId: string,
    executionId: string,
    success: boolean,
    responseTimeMs: number,
    error?: string
  ): Promise<void> {
    try {
      const metric = {
        agent_id: agentId,
        execution_id: executionId,
        success,
        response_time_ms: responseTimeMs,
        error,
        recorded_at: new Date().toISOString(),
      };

      // Store in Supabase
      const { error: dbError } = await this.supabase
        .from('agent_metrics')
        .insert(metric);

      if (dbError) {
        this.logger.error('monitoring', 'MONITORING', 'Failed to record agent metric', {
          agentId,
          error: dbError.message,
        });
      }

      // Cache in memory
      const key = `agent:${agentId}`;
      if (!this.metricsCache.has(key)) {
        this.metricsCache.set(key, []);
      }

      const points = this.metricsCache.get(key)!;
      points.push({
        timestamp: new Date(),
        value: responseTimeMs,
        labels: {
          agentId,
          status: success ? 'success' : 'failure',
        },
      });

      // Keep only recent points
      if (points.length > this.MAX_POINTS_PER_METRIC) {
        points.shift();
      }

      // Cache in Redis for real-time access
      await this.redis.setex(
        `${this.REDIS_PREFIX}${key}`,
        3600,
        JSON.stringify(points)
      );
    } catch (error) {
      this.logger.error('monitoring', 'MONITORING', 'Error recording agent execution', {
        error: (error as Error).message,
      });
    }
  }

  /**
   * Record workflow execution metric
   */
  async recordWorkflowExecution(
    workflowId: string,
    workflowName: string,
    executionId: string,
    success: boolean,
    executionTimeMs: number,
    error?: string
  ): Promise<void> {
    try {
      const metric = {
        workflow_id: workflowId,
        workflow_name: workflowName,
        execution_id: executionId,
        success,
        execution_time_ms: executionTimeMs,
        error,
        recorded_at: new Date().toISOString(),
      };

      const { error: dbError } = await this.supabase
        .from('workflow_metrics')
        .insert(metric);

      if (dbError) {
        this.logger.error('monitoring', 'MONITORING', 'Failed to record workflow metric', {
          workflowId,
          error: dbError.message,
        });
      }

      // Cache metrics
      const key = `workflow:${workflowId}`;
      if (!this.metricsCache.has(key)) {
        this.metricsCache.set(key, []);
      }

      const points = this.metricsCache.get(key)!;
      points.push({
        timestamp: new Date(),
        value: executionTimeMs,
        labels: {
          workflowId,
          workflowName,
          status: success ? 'success' : 'failure',
        },
      });

      if (points.length > this.MAX_POINTS_PER_METRIC) {
        points.shift();
      }

      await this.redis.setex(
        `${this.REDIS_PREFIX}${key}`,
        3600,
        JSON.stringify(points)
      );
    } catch (error) {
      this.logger.error('monitoring', 'MONITORING', 'Error recording workflow execution', {
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get agent metrics
   */
  async getAgentMetrics(agentId: string, timeWindowMs: number = 3600000): Promise<AgentMetrics | null> {
    try {
      const fromTime = new Date(Date.now() - timeWindowMs).toISOString();

      const { data, error } = await this.supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .gte('recorded_at', fromTime)
        .order('recorded_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return null;
      }

      const total = data.length;
      const successful = data.filter((d: any) => d.success).length;
      const failed = total - successful;
      const successRate = (successful / total) * 100;
      const errorRate = (failed / total) * 100;

      const responseTimes = data
        .map((d: any) => d.response_time_ms)
        .sort((a: number, b: number) => a - b);

      const avgResponseTime = responseTimes.reduce((a: number, b: number) => a + b, 0) / total;

      return {
        agentId,
        successCount: successful,
        failureCount: failed,
        successRate: parseFloat(successRate.toFixed(2)),
        averageResponseTimeMs: Math.round(avgResponseTime),
        maxResponseTimeMs: Math.max(...responseTimes),
        minResponseTimeMs: Math.min(...responseTimes),
        p95ResponseTimeMs: responseTimes[Math.floor(total * 0.95)],
        p99ResponseTimeMs: responseTimes[Math.floor(total * 0.99)],
        errorRate: parseFloat(errorRate.toFixed(2)),
        uptimePercent: parseFloat(successRate.toFixed(2)),
        lastExecutionTime: new Date(data[0].recorded_at),
        lastError: data.find((d: any) => d.error)?.error,
      };
    } catch (error) {
      this.logger.error('monitoring', 'MONITORING', `Failed to get agent metrics: ${agentId}`, {
        error: (error as Error).message,
      });
      return null;
    }
  }

  /**
   * Get workflow metrics
   */
  async getWorkflowMetrics(workflowId: string, timeWindowMs: number = 3600000): Promise<WorkflowMetrics | null> {
    try {
      const fromTime = new Date(Date.now() - timeWindowMs).toISOString();

      const { data, error } = await this.supabase
        .from('workflow_metrics')
        .select('*')
        .eq('workflow_id', workflowId)
        .gte('recorded_at', fromTime)
        .order('recorded_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return null;
      }

      const total = data.length;
      const successful = data.filter((d: any) => d.success).length;
      const failed = total - successful;
      const successRate = (successful / total) * 100;

      const executionTimes = data.map((d: any) => d.execution_time_ms);
      const avgExecutionTime = executionTimes.reduce((a: number, b: number) => a + b, 0) / total;
      const totalDuration = executionTimes.reduce((a: number, b: number) => a + b, 0);

      return {
        workflowId,
        name: data[0].workflow_name,
        totalExecutions: total,
        successfulExecutions: successful,
        failedExecutions: failed,
        successRate: parseFloat(successRate.toFixed(2)),
        averageExecutionTimeMs: Math.round(avgExecutionTime),
        totalDurationMs: totalDuration,
        lastExecutionStatus: data[0].success ? 'success' : 'failed',
        lastExecutionTime: new Date(data[0].recorded_at),
      };
    } catch (error) {
      this.logger.error('monitoring', 'MONITORING', `Failed to get workflow metrics: ${workflowId}`, {
        error: (error as Error).message,
      });
      return null;
    }
  }

  /**
   * Get system-wide metrics
   */
  async getSystemMetrics(
    agentIds: string[],
    workflowIds: string[]
  ): Promise<SystemMetrics> {
    try {
      let totalSuccessRate = 0;
      let totalResponseTime = 0;
      let healthyCount = 0;
      let degradedCount = 0;
      let unhealthyCount = 0;

      // Collect agent metrics
      for (const agentId of agentIds) {
        const metrics = await this.getAgentMetrics(agentId);
        if (metrics) {
          totalSuccessRate += metrics.successRate;
          totalResponseTime += metrics.averageResponseTimeMs;

          if (metrics.successRate >= 95) {
            healthyCount++;
          } else if (metrics.successRate >= 85) {
            degradedCount++;
          } else {
            unhealthyCount++;
          }
        }
      }

      const avgSuccessRate = agentIds.length > 0 ? totalSuccessRate / agentIds.length : 0;
      const avgResponseTime = agentIds.length > 0 ? totalResponseTime / agentIds.length : 0;

      // Calculate health score (0-100)
      const healthScore = Math.max(
        0,
        Math.min(
          100,
          (avgSuccessRate * 0.6) + // 60% based on success rate
          (100 - Math.min(100, (avgResponseTime / 100))) * 0.4 // 40% based on response time
        )
      );

      return {
        timestamp: new Date(),
        totalAgents: agentIds.length,
        healthyAgents: healthyCount,
        degradedAgents: degradedCount,
        unhealthyAgents: unhealthyCount,
        totalWorkflows: workflowIds.length,
        activeWorkflows: workflowIds.length, // Assuming all are active
        averageSuccessRate: parseFloat(avgSuccessRate.toFixed(2)),
        averageResponseTimeMs: Math.round(avgResponseTime),
        systemHealthScore: parseFloat(healthScore.toFixed(2)),
      };
    } catch (error) {
      this.logger.error('monitoring', 'MONITORING', 'Failed to get system metrics', {
        error: (error as Error).message,
      });

      return {
        timestamp: new Date(),
        totalAgents: agentIds.length,
        healthyAgents: 0,
        degradedAgents: 0,
        unhealthyAgents: agentIds.length,
        totalWorkflows: workflowIds.length,
        activeWorkflows: 0,
        averageSuccessRate: 0,
        averageResponseTimeMs: 0,
        systemHealthScore: 0,
      };
    }
  }

  /**
   * Check if metrics exceed thresholds
   */
  async checkThresholds(agentMetrics: AgentMetrics): Promise<string[]> {
    const alerts: string[] = [];

    if (agentMetrics.successRate < (this.alertThresholds.get('agent_success_rate') || 0.85) * 100) {
      alerts.push(`Agent ${agentMetrics.agentId} success rate below threshold: ${agentMetrics.successRate}%`);
    }

    if (agentMetrics.averageResponseTimeMs > (this.alertThresholds.get('agent_response_time') || 10000)) {
      alerts.push(
        `Agent ${agentMetrics.agentId} response time exceeds threshold: ${agentMetrics.averageResponseTimeMs}ms`
      );
    }

    if (agentMetrics.errorRate > (this.alertThresholds.get('error_rate') || 0.15) * 100) {
      alerts.push(`Agent ${agentMetrics.agentId} error rate above threshold: ${agentMetrics.errorRate}%`);
    }

    return alerts;
  }

  /**
   * Set alert threshold
   */
  setAlertThreshold(metric: string, value: number): void {
    this.alertThresholds.set(metric, value);
    this.logger.info(
      'monitoring',
      'ALERTS',
      `Alert threshold updated: ${metric} = ${value}`
    );
  }

  /**
   * Get alert threshold
   */
  getAlertThreshold(metric: string): number | null {
    return this.alertThresholds.get(metric) || null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(key: string, limit: number = 100): MetricPoint[] {
    const points = this.metricsCache.get(key) || [];
    return points.slice(-limit);
  }

  /**
   * Export metrics to Prometheus format
   */
  async exportPrometheus(agentIds: string[]): Promise<string> {
    let prometheusOutput = '# HELP agent_success_rate Agent success rate\n';
    prometheusOutput += '# TYPE agent_success_rate gauge\n';

    for (const agentId of agentIds) {
      const metrics = await this.getAgentMetrics(agentId);
      if (metrics) {
        prometheusOutput += `agent_success_rate{agent_id="${agentId}"} ${metrics.successRate}\n`;
        prometheusOutput += `agent_response_time{agent_id="${agentId}"} ${metrics.averageResponseTimeMs}\n`;
        prometheusOutput += `agent_error_rate{agent_id="${agentId}"} ${metrics.errorRate}\n`;
      }
    }

    return prometheusOutput;
  }

  /**
   * Cleanup old metrics
   */
  async cleanup(olderThanMs: number = this.METRICS_RETENTION): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - olderThanMs).toISOString();

      await this.supabase
        .from('agent_metrics')
        .delete()
        .lt('recorded_at', cutoffDate);

      await this.supabase
        .from('workflow_metrics')
        .delete()
        .lt('recorded_at', cutoffDate);

      this.logger.info('monitoring', 'MAINTENANCE', 'Old metrics cleaned up');
    } catch (error) {
      this.logger.error('monitoring', 'MAINTENANCE', 'Failed to cleanup metrics', {
        error: (error as Error).message,
      });
    }
  }

  /**
   * Destroy service
   */
  async destroy(): Promise<void> {
    this.metricsCache.clear();
    await this.redis.quit();
  }
}

export {
  MonitoringService,
  MetricPoint,
  AgentMetrics,
  WorkflowMetrics,
  SystemMetrics,
};
