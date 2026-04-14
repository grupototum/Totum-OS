// File: src/agents/core/error-handler.ts
// Purpose: Comprehensive error handling, recovery, and retry strategies
// Phase: PASSO 7.1 - Agent Runtime Environment

import { createClient } from '@supabase/supabase-js';
import { ContextManager, ExecutionContext } from './context-manager';

enum ErrorCategory {
  TIMEOUT = 'TIMEOUT',
  NETWORK = 'NETWORK',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_INPUT = 'INVALID_INPUT',
  AGENT_ERROR = 'AGENT_ERROR',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  DEPENDENCY_FAILURE = 'DEPENDENCY_FAILURE',
  UNKNOWN = 'UNKNOWN',
}

interface ErrorClassification {
  category: ErrorCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
  backoffMultiplier: number;
  maxRetries: number;
}

interface AgentError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  executionId: string;
  agentId: string;
  originalError: Error;
  retryable: boolean;
  retryCount: number;
  retryDelay: number;
  fallbackAgent?: string;
  metadata: Record<string, any>;
}

interface RecoveryStrategy {
  type: 'retry' | 'fallback' | 'cancel' | 'manual_intervention';
  configuration: Record<string, any>;
  priority: number;
}

class ErrorHandler {
  private supabase: any;
  private contextManager: ContextManager;
  private errorClassifications: Map<string, ErrorClassification>;
  private fallbackStrategies: Map<ErrorCategory, RecoveryStrategy[]>;
  private readonly RETRY_DELAY_BASE = 1000; // 1 second
  private readonly MAX_RETRY_DELAY = 32000; // 32 seconds

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    contextManager: ContextManager
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.contextManager = contextManager;
    this.errorClassifications = new Map();
    this.fallbackStrategies = new Map();

    this.initializeErrorClassifications();
    this.initializeFallbackStrategies();
  }

  /**
   * Classify an error and determine handling strategy
   */
  classifyError(error: Error, context: Partial<ExecutionContext> = {}): ErrorClassification {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Timeout errors
    if (
      message.includes('timeout') ||
      message.includes('econnaborted') ||
      message.includes('deadline exceeded')
    ) {
      return {
        category: ErrorCategory.TIMEOUT,
        severity: 'medium',
        retryable: true,
        backoffMultiplier: 2,
        maxRetries: 3,
      };
    }

    // Network errors
    if (
      message.includes('enotfound') ||
      message.includes('econnrefused') ||
      message.includes('enetunreach') ||
      message.includes('connection refused') ||
      message.includes('getaddrinfo')
    ) {
      return {
        category: ErrorCategory.NETWORK,
        severity: 'high',
        retryable: true,
        backoffMultiplier: 2,
        maxRetries: 4,
      };
    }

    // Rate limit errors (HTTP 429)
    if (
      message.includes('429') ||
      message.includes('too many requests') ||
      message.includes('rate limit')
    ) {
      return {
        category: ErrorCategory.RATE_LIMIT,
        severity: 'medium',
        retryable: true,
        backoffMultiplier: 3,
        maxRetries: 5,
      };
    }

    // Authentication errors
    if (
      message.includes('401') ||
      message.includes('unauthorized') ||
      message.includes('invalid token') ||
      message.includes('expired token')
    ) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        severity: 'high',
        retryable: false,
        backoffMultiplier: 1,
        maxRetries: 0,
      };
    }

    // Authorization errors
    if (
      message.includes('403') ||
      message.includes('forbidden') ||
      message.includes('permission denied')
    ) {
      return {
        category: ErrorCategory.AUTHORIZATION,
        severity: 'high',
        retryable: false,
        backoffMultiplier: 1,
        maxRetries: 0,
      };
    }

    // Invalid input errors
    if (
      message.includes('400') ||
      message.includes('bad request') ||
      message.includes('invalid argument') ||
      message.includes('malformed')
    ) {
      return {
        category: ErrorCategory.INVALID_INPUT,
        severity: 'low',
        retryable: false,
        backoffMultiplier: 1,
        maxRetries: 0,
      };
    }

    // Resource exhausted errors
    if (
      message.includes('503') ||
      message.includes('unavailable') ||
      message.includes('out of memory') ||
      message.includes('resource exhausted')
    ) {
      return {
        category: ErrorCategory.RESOURCE_EXHAUSTED,
        severity: 'critical',
        retryable: true,
        backoffMultiplier: 3,
        maxRetries: 3,
      };
    }

    // Agent errors (5xx)
    if (
      message.includes('500') ||
      message.includes('502') ||
      message.includes('504') ||
      message.includes('internal server error') ||
      message.includes('bad gateway')
    ) {
      return {
        category: ErrorCategory.AGENT_ERROR,
        severity: 'high',
        retryable: true,
        backoffMultiplier: 2,
        maxRetries: 3,
      };
    }

    // Default to unknown
    return {
      category: ErrorCategory.UNKNOWN,
      severity: 'medium',
      retryable: true,
      backoffMultiplier: 2,
      maxRetries: 2,
    };
  }

  /**
   * Handle an error and determine recovery action
   */
  async handleError(
    error: Error,
    executionId: string,
    agentId: string,
    retryCount: number = 0,
    fallbackAgent?: string
  ): Promise<AgentError> {
    const classification = this.classifyError(error);

    const agentError: AgentError = {
      code: `${classification.category}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: error.message,
      category: classification.category,
      severity: classification.severity,
      timestamp: new Date(),
      executionId,
      agentId,
      originalError: error,
      retryable: classification.retryable,
      retryCount,
      retryDelay: this.calculateRetryDelay(retryCount, classification.backoffMultiplier),
      fallbackAgent,
      metadata: {
        stack: error.stack,
        classification,
      },
    };

    // Log error
    await this.logError(agentError);

    // Update context with error information
    const context = await this.contextManager.get(executionId);
    if (context) {
      await this.contextManager.setMemory(executionId, `last_error_${agentId}`, agentError);
    }

    return agentError;
  }

  /**
   * Determine recovery strategy for an error
   */
  async getRecoveryStrategy(
    agentError: AgentError,
    context: ExecutionContext
  ): Promise<RecoveryStrategy> {
    // Check if we should retry
    if (
      agentError.retryable &&
      agentError.retryCount < this.errorClassifications.get(agentError.category.toString())?.maxRetries || 0
    ) {
      return {
        type: 'retry',
        configuration: {
          delay: agentError.retryDelay,
          retryCount: agentError.retryCount + 1,
        },
        priority: 1, // Highest priority
      };
    }

    // Check if fallback agent is available
    if (agentError.fallbackAgent) {
      return {
        type: 'fallback',
        configuration: {
          fallbackAgentId: agentError.fallbackAgent,
          originalAgentId: agentError.agentId,
        },
        priority: 2,
      };
    }

    // Check if we can find alternative strategies based on error category
    const strategies = this.fallbackStrategies.get(agentError.category) || [];
    if (strategies.length > 0) {
      return strategies[0];
    }

    // Default to cancel
    return {
      type: 'cancel',
      configuration: {
        reason: `Unrecoverable error: ${agentError.message}`,
      },
      priority: 4,
    };
  }

  /**
   * Apply recovery strategy
   */
  async applyRecoveryStrategy(
    strategy: RecoveryStrategy,
    agentError: AgentError,
    context: ExecutionContext
  ): Promise<boolean> {
    switch (strategy.type) {
      case 'retry':
        await this.contextManager.setMemory(
          context.executionId,
          `retry_${agentError.agentId}`,
          strategy.configuration
        );
        return true;

      case 'fallback':
        const fallbackTaskId = `fallback-${Date.now()}`;
        await this.contextManager.setMemory(
          context.executionId,
          `fallback_task_${fallbackTaskId}`,
          {
            originalAgent: agentError.agentId,
            fallbackAgent: strategy.configuration.fallbackAgentId,
            reason: agentError.message,
          }
        );
        return true;

      case 'manual_intervention':
        await this.logAlert(
          context.executionId,
          agentError.agentId,
          `Manual intervention required: ${agentError.message}`
        );
        return false;

      case 'cancel':
      default:
        await this.contextManager.failTask(
          context.executionId,
          agentError.agentId,
          agentError.message
        );
        return false;
    }
  }

  /**
   * Calculate retry delay with exponential backoff and jitter
   */
  calculateRetryDelay(retryCount: number, backoffMultiplier: number = 2): number {
    // Exponential backoff: baseDelay * (backoffMultiplier ^ retryCount)
    const exponentialDelay = this.RETRY_DELAY_BASE * Math.pow(backoffMultiplier, retryCount);
    const cappedDelay = Math.min(exponentialDelay, this.MAX_RETRY_DELAY);

    // Add random jitter (±10%)
    const jitter = cappedDelay * (0.9 + Math.random() * 0.2);

    return Math.round(jitter);
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: AgentError): boolean {
    return (
      error.retryable &&
      error.retryCount <
        (this.errorClassifications.get(error.category.toString())?.maxRetries || 0)
    );
  }

  /**
   * Format error for display
   */
  formatErrorForDisplay(error: AgentError): string {
    return `[${error.category}] ${error.message}\nExecution: ${error.executionId}\nAgent: ${error.agentId}\nRetry: ${error.retryCount}/${this.errorClassifications.get(error.category.toString())?.maxRetries || 0}`;
  }

  /**
   * Get error statistics for a time period
   */
  async getErrorStats(
    hours: number = 24,
    agentId?: string
  ): Promise<Record<string, any>> {
    try {
      const fromTime = new Date(Date.now() - hours * 60 * 60 * 1000);

      let query = this.supabase
        .from('agent_errors')
        .select('category, severity, count(*)', { count: 'exact' })
        .gte('timestamp', fromTime.toISOString());

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch error stats:', error);
        return {};
      }

      return {
        timeRange: `Last ${hours} hours`,
        totalErrors: data?.length || 0,
        byCategory: this.groupBy(data || [], 'category'),
        bySeverity: this.groupBy(data || [], 'severity'),
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {};
    }
  }

  /**
   * Get error trends
   */
  async getErrorTrends(agentId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('agent_errors')
        .select('timestamp, category, severity')
        .eq('agent_id', agentId)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Failed to fetch error trends:', error);
        return null;
      }

      // Group by day
      const byDay: Record<string, any> = {};
      (data || []).forEach((entry: any) => {
        const day = new Date(entry.timestamp).toLocaleDateString();
        if (!byDay[day]) {
          byDay[day] = { count: 0, categories: {} };
        }
        byDay[day].count++;
        byDay[day].categories[entry.category] =
          (byDay[day].categories[entry.category] || 0) + 1;
      });

      return {
        agentId,
        period: '7 days',
        dailyBreakdown: byDay,
      };
    } catch (error) {
      console.error('Error fetching trends:', error);
      return null;
    }
  }

  // Private helper methods

  private initializeErrorClassifications(): void {
    this.errorClassifications.set(ErrorCategory.TIMEOUT.toString(), {
      category: ErrorCategory.TIMEOUT,
      severity: 'medium',
      retryable: true,
      backoffMultiplier: 2,
      maxRetries: 3,
    });

    this.errorClassifications.set(ErrorCategory.NETWORK.toString(), {
      category: ErrorCategory.NETWORK,
      severity: 'high',
      retryable: true,
      backoffMultiplier: 2,
      maxRetries: 4,
    });

    this.errorClassifications.set(ErrorCategory.RATE_LIMIT.toString(), {
      category: ErrorCategory.RATE_LIMIT,
      severity: 'medium',
      retryable: true,
      backoffMultiplier: 3,
      maxRetries: 5,
    });

    this.errorClassifications.set(ErrorCategory.INVALID_INPUT.toString(), {
      category: ErrorCategory.INVALID_INPUT,
      severity: 'low',
      retryable: false,
      backoffMultiplier: 1,
      maxRetries: 0,
    });

    this.errorClassifications.set(ErrorCategory.AGENT_ERROR.toString(), {
      category: ErrorCategory.AGENT_ERROR,
      severity: 'high',
      retryable: true,
      backoffMultiplier: 2,
      maxRetries: 3,
    });

    this.errorClassifications.set(ErrorCategory.UNKNOWN.toString(), {
      category: ErrorCategory.UNKNOWN,
      severity: 'medium',
      retryable: true,
      backoffMultiplier: 2,
      maxRetries: 2,
    });
  }

  private initializeFallbackStrategies(): void {
    this.fallbackStrategies.set(ErrorCategory.TIMEOUT, [
      {
        type: 'fallback',
        configuration: { timeout_multiplier: 1.5 },
        priority: 1,
      },
      {
        type: 'manual_intervention',
        configuration: {},
        priority: 2,
      },
    ]);

    this.fallbackStrategies.set(ErrorCategory.RATE_LIMIT, [
      {
        type: 'retry',
        configuration: { delay_multiplier: 2 },
        priority: 1,
      },
    ]);

    this.fallbackStrategies.set(ErrorCategory.NETWORK, [
      {
        type: 'retry',
        configuration: { backoff_multiplier: 2 },
        priority: 1,
      },
      {
        type: 'fallback',
        configuration: { use_cache: true },
        priority: 2,
      },
    ]);

    this.fallbackStrategies.set(ErrorCategory.AGENT_ERROR, [
      {
        type: 'fallback',
        configuration: {},
        priority: 1,
      },
      {
        type: 'manual_intervention',
        configuration: { alert_oncall: true },
        priority: 2,
      },
    ]);
  }

  private async logError(agentError: AgentError): Promise<void> {
    try {
      const { error } = await this.supabase.from('agent_errors').insert({
        code: agentError.code,
        message: agentError.message,
        category: agentError.category,
        severity: agentError.severity,
        execution_id: agentError.executionId,
        agent_id: agentError.agentId,
        retry_count: agentError.retryCount,
        retryable: agentError.retryable,
        metadata: JSON.stringify(agentError.metadata),
        timestamp: agentError.timestamp.toISOString(),
      });

      if (error) {
        console.error('Failed to log error to database:', error);
      }
    } catch (error) {
      console.error('Error logging agent error:', error);
    }
  }

  private async logAlert(executionId: string, agentId: string, message: string): Promise<void> {
    try {
      await this.supabase.from('agent_alerts').insert({
        execution_id: executionId,
        agent_id: agentId,
        message,
        alert_type: 'MANUAL_INTERVENTION_REQUIRED',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log alert:', error);
    }
  }

  private groupBy(array: any[], key: string): Record<string, number> {
    return array.reduce(
      (acc, obj) => {
        acc[obj[key]] = (acc[obj[key]] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }
}

export {
  ErrorHandler,
  ErrorCategory,
  ErrorClassification,
  AgentError,
  RecoveryStrategy,
};
