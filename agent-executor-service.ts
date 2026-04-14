/**
 * Agent Executor Service
 * Core execution engine for elizaOS agents
 */

import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  AgentExecutionRequest,
  AgentExecutionResponse,
  AgentExecutionError,
  AgentConfig,
  ExecutionContext,
  RetryPolicy,
  TimeoutConfig,
  ErrorClassification,
  LogEntry,
  HealthStatus,
} from "./agent-executor-types";

export class AgentExecutorService {
  private elizaOSBaseUrl: string;
  private elizaOSApiKey: string;
  private supabaseUrl: string;
  private supabaseKey: string;
  private redisClient: any; // Redis client
  private agentConfigs: Map<string, AgentConfig>;
  private executionContexts: Map<string, ExecutionContext>;
  private healthStatus: Map<string, HealthStatus>;
  private retryPolicy: RetryPolicy;
  private timeoutConfig: TimeoutConfig;

  constructor(config: {
    elizaOSUrl: string;
    elizaOSKey: string;
    supabaseUrl: string;
    supabaseKey: string;
    redisClient: any;
    agentConfigs: AgentConfig[];
  }) {
    this.elizaOSBaseUrl = config.elizaOSUrl;
    this.elizaOSApiKey = config.elizaOSKey;
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
    this.redisClient = config.redisClient;

    // Initialize agent configs
    this.agentConfigs = new Map();
    config.agentConfigs.forEach((cfg) => {
      this.agentConfigs.set(cfg.agent_id, cfg);
    });

    // Initialize data structures
    this.executionContexts = new Map();
    this.healthStatus = new Map();

    // Set default policies
    this.retryPolicy = {
      maxRetries: 2,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterFactor: 0.1,
      retryableErrors: [
        ErrorClassification.TIMEOUT,
        ErrorClassification.NETWORK,
        ErrorClassification.RATE_LIMIT,
      ],
    };

    this.timeoutConfig = {
      defaultTimeoutMs: 30000,
      maxTimeoutMs: 60000,
      warningThresholdPercent: 80,
    };

    // Initialize health status for all agents
    this.initializeHealthStatus();
  }

  /**
   * Main execution entry point
   */
  async execute(request: AgentExecutionRequest): Promise<AgentExecutionResponse> {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Get agent config
      const agentConfig = this.agentConfigs.get(request.agentId);
      if (!agentConfig) {
        throw new Error(`Agent ${request.agentId} not found`);
      }

      // Create execution context
      const context: ExecutionContext = {
        workflow_id: request.metadata?.workflow_id || "unknown",
        execution_id: executionId,
        chain: [],
        state: new Map(),
        startTime: startTime,
        timeout:
          request.timeout ||
          agentConfig.timeout_seconds * 1000 ||
          this.timeoutConfig.defaultTimeoutMs,
      };

      this.executionContexts.set(executionId, context);

      // Execute with retry logic
      const response = await this.executeWithRetry(
        request,
        agentConfig,
        context,
        0
      );

      // Update health status
      this.updateHealthStatus(request.agentId, true, Date.now() - startTime);

      // Log execution
      await this.logExecution(executionId, {
        execution_id: executionId,
        workflow_id: context.workflow_id,
        agent_id: request.agentId,
        timestamp: new Date().toISOString(),
        status: "success",
        input: request,
        output: response,
        tokens_used: response.tokens_used,
        duration_ms: Date.now() - startTime,
        model: response.model,
        success_score: response.score,
        metadata: request.metadata,
      });

      return response;
    } catch (error) {
      // Handle error
      const duration = Date.now() - startTime;
      this.updateHealthStatus(request.agentId, false, duration);

      const executionError = this.formatError(
        error,
        request.agentId,
        executionId
      );

      // Log error
      await this.logExecution(executionId, {
        execution_id: executionId,
        workflow_id: request.metadata?.workflow_id || "unknown",
        agent_id: request.agentId,
        timestamp: new Date().toISOString(),
        status: "failed",
        error: executionError,
        duration_ms: duration,
        metadata: request.metadata,
      });

      throw executionError;
    } finally {
      // Cleanup
      this.executionContexts.delete(executionId);
    }
  }

  /**
   * Execute with retry logic
   */
  private async executeWithRetry(
    request: AgentExecutionRequest,
    config: AgentConfig,
    context: ExecutionContext,
    retryCount: number
  ): Promise<AgentExecutionResponse> {
    try {
      // Call elizaOS API
      const response = await this.callElizaOSAgent(request, context);

      // Validate response
      if (!response.data) {
        throw new Error("Invalid response from agent");
      }

      return {
        success: true,
        agentId: request.agentId,
        response: response.data.response || response.data,
        score: response.data.score,
        confidence: response.data.confidence,
        tokens_used: response.data.tokens_used,
        execution_id: context.execution_id,
        duration_ms: Date.now() - context.startTime,
        timestamp: new Date().toISOString(),
        model: response.data.model,
        metadata: response.data.metadata,
      };
    } catch (error) {
      const classification = this.classifyError(error);

      // Check if should retry
      if (
        retryCount < config.retry_attempts &&
        this.retryPolicy.retryableErrors.includes(classification)
      ) {
        // Calculate backoff delay
        const delay = this.calculateBackoffDelay(retryCount);

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Retry
        return this.executeWithRetry(request, config, context, retryCount + 1);
      }

      // Check if should use fallback
      if (
        config.fallback_agent &&
        classification !== ErrorClassification.INVALID_INPUT
      ) {
        const fallbackConfig = this.agentConfigs.get(config.fallback_agent);
        if (fallbackConfig) {
          // Execute fallback agent
          const fallbackRequest: AgentExecutionRequest = {
            ...request,
            agentId: config.fallback_agent,
          };

          const fallbackResponse = await this.executeWithRetry(
            fallbackRequest,
            fallbackConfig,
            context,
            0
          );

          // Mark as fallback
          fallbackResponse.metadata = {
            ...fallbackResponse.metadata,
            fallback_used: true,
            original_agent: request.agentId,
          };

          return fallbackResponse;
        }
      }

      // No more retries or fallback
      throw error;
    }
  }

  /**
   * Call elizaOS API
   */
  private async callElizaOSAgent(
    request: AgentExecutionRequest,
    context: ExecutionContext
  ) {
    const url = `${this.elizaOSBaseUrl}/api/agents/${request.agentId}/execute`;

    const payload = {
      message: request.message,
      context: {
        ...request.context,
        execution_id: context.execution_id,
        workflow_id: context.workflow_id,
      },
      metadata: request.metadata,
    };

    return axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.elizaOSApiKey}`,
      },
      timeout: context.timeout,
    });
  }

  /**
   * Classify error for retry logic
   */
  private classifyError(error: any): ErrorClassification {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return ErrorClassification.TIMEOUT;
    }

    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.message.includes("NETWORK")
    ) {
      return ErrorClassification.NETWORK;
    }

    if (error.response?.status === 429) {
      return ErrorClassification.RATE_LIMIT;
    }

    if (error.response?.status === 400) {
      return ErrorClassification.INVALID_INPUT;
    }

    if (error.response?.status >= 500) {
      return ErrorClassification.AGENT_ERROR;
    }

    return ErrorClassification.UNKNOWN;
  }

  /**
   * Calculate backoff delay with jitter
   */
  private calculateBackoffDelay(retryCount: number): number {
    const exponentialDelay = Math.min(
      this.retryPolicy.initialDelayMs *
        Math.pow(this.retryPolicy.backoffMultiplier, retryCount),
      this.retryPolicy.maxDelayMs
    );

    const jitter =
      exponentialDelay *
      this.retryPolicy.jitterFactor *
      (Math.random() - 0.5) *
      2;

    return exponentialDelay + jitter;
  }

  /**
   * Format error for response
   */
  private formatError(
    error: any,
    agentId: string,
    executionId: string
  ): AgentExecutionError {
    const classification = this.classifyError(error);

    return {
      code: classification,
      message:
        error.message || "Unknown error",
      agentId,
      execution_id: executionId,
      timestamp: new Date().toISOString(),
      retryable: this.retryPolicy.retryableErrors.includes(classification),
      fallback_agent: this.agentConfigs.get(agentId)?.fallback_agent,
    };
  }

  /**
   * Validate request
   */
  private validateRequest(request: AgentExecutionRequest): void {
    if (!request.agentId) {
      throw new Error("agentId is required");
    }

    if (!request.message) {
      throw new Error("message is required");
    }

    if (!this.agentConfigs.has(request.agentId)) {
      throw new Error(`Unknown agent: ${request.agentId}`);
    }
  }

  /**
   * Log execution to Supabase
   */
  private async logExecution(executionId: string, log: LogEntry): Promise<void> {
    try {
      // Insert to Supabase
      const response = await axios.post(
        `${this.supabaseUrl}/rest/v1/agent_executions`,
        log,
        {
          headers: {
            apikey: this.supabaseKey,
            Authorization: `Bearer ${this.supabaseKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Also cache in Redis for fast access
      await this.redisClient.setex(
        `execution:${executionId}`,
        3600, // 1 hour TTL
        JSON.stringify(log)
      );
    } catch (error) {
      console.error("Failed to log execution", error);
      // Don't throw - logging failures shouldn't break execution
    }
  }

  /**
   * Update health status
   */
  private updateHealthStatus(
    agentId: string,
    success: boolean,
    duration: number
  ): void {
    const current = this.healthStatus.get(agentId) || {
      agent_id: agentId,
      status: "healthy",
      uptime_percent: 100,
      last_check: new Date().toISOString(),
      consecutive_failures: 0,
      avg_response_time_ms: 0,
      success_rate: 100,
    };

    if (success) {
      current.consecutive_failures = 0;
      current.avg_response_time_ms =
        (current.avg_response_time_ms * 0.8 + duration * 0.2);
      current.status = "healthy";
    } else {
      current.consecutive_failures++;
      if (current.consecutive_failures >= 3) {
        current.status = "unhealthy";
      } else if (current.consecutive_failures >= 1) {
        current.status = "degraded";
      }
    }

    current.last_check = new Date().toISOString();
    this.healthStatus.set(agentId, current);
  }

  /**
   * Initialize health status
   */
  private initializeHealthStatus(): void {
    this.agentConfigs.forEach((config) => {
      this.healthStatus.set(config.agent_id, {
        agent_id: config.agent_id,
        status: "healthy",
        uptime_percent: 100,
        last_check: new Date().toISOString(),
        consecutive_failures: 0,
        avg_response_time_ms: 0,
        success_rate: 100,
      });
    });
  }

  /**
   * Get health status
   */
  getHealthStatus(agentId: string): HealthStatus | undefined {
    return this.healthStatus.get(agentId);
  }

  /**
   * Get all health statuses
   */
  getAllHealthStatus(): HealthStatus[] {
    return Array.from(this.healthStatus.values());
  }
}
