/**
 * Agent Executor Types & Interfaces
 * elizaOS Orchestration Layer
 */

export interface AgentExecutionRequest {
  agentId: string;
  message: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
  timeout?: number; // milliseconds
  retryCount?: number;
}

export interface AgentExecutionResponse {
  success: boolean;
  agentId: string;
  response: any;
  score?: number;
  confidence?: number;
  tokens_used?: number;
  execution_id: string;
  duration_ms: number;
  timestamp: string;
  model?: string;
  metadata?: Record<string, any>;
}

export interface AgentExecutionError {
  code: string;
  message: string;
  agentId: string;
  execution_id: string;
  timestamp: string;
  retryable: boolean;
  fallback_agent?: string;
}

export interface AgentConfig {
  agent_id: string;
  agent_name: string;
  type: "MVP-1" | "MVP-2" | "Base-39" | "Tier-3" | "Future";
  timeout_seconds: number;
  retry_attempts: number;
  success_rate_target: number;
  fallback_agent?: string;
  sla_metrics: {
    success_rate_target: number;
    avg_response_time_ms: number;
    max_response_time_ms: number;
    error_rate_max: number;
    availability_uptime_percent: number;
  };
}

export interface ExecutionContext {
  workflow_id: string;
  execution_id: string;
  parent_execution_id?: string;
  chain: ExecutionChainItem[];
  state: Map<string, any>;
  startTime: number;
  timeout: number;
}

export interface ExecutionChainItem {
  agent_id: string;
  timestamp: string;
  duration_ms: number;
  success: boolean;
  error?: string;
  tokens_used?: number;
  output?: any;
}

export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number; // 0-1
  retryableErrors: string[]; // error codes to retry
}

export interface TimeoutConfig {
  defaultTimeoutMs: number;
  maxTimeoutMs: number;
  warningThresholdPercent: number; // 80
}

export interface ErrorHandler {
  classify(error: any): ErrorClassification;
  canRetry(error: ErrorClassification): boolean;
  shouldFallback(error: ErrorClassification): boolean;
}

export enum ErrorClassification {
  TIMEOUT = "TIMEOUT",
  NETWORK = "NETWORK",
  RATE_LIMIT = "RATE_LIMIT",
  INVALID_INPUT = "INVALID_INPUT",
  AGENT_ERROR = "AGENT_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface LogEntry {
  execution_id: string;
  workflow_id: string;
  agent_id: string;
  timestamp: string;
  status: "pending" | "running" | "success" | "failed" | "retrying";
  input?: any;
  output?: any;
  error?: AgentExecutionError;
  tokens_used?: number;
  duration_ms?: number;
  model?: string;
  success_score?: number;
  metadata?: Record<string, any>;
}

export interface HealthStatus {
  agent_id: string;
  status: "healthy" | "degraded" | "unhealthy" | "offline";
  uptime_percent: number;
  last_check: string;
  last_error?: string;
  consecutive_failures: number;
  avg_response_time_ms: number;
  success_rate: number;
  next_retry?: string;
}

export interface AgentPool {
  agents: AgentConfig[];
  healthy: Map<string, HealthStatus>;
  executing: Map<string, ExecutionContext>;
  queue: AgentExecutionRequest[];
  maxConcurrent: number;
}

export interface QueuedExecution {
  request: AgentExecutionRequest;
  queued_at: string;
  priority: number; // 0-10, higher = more important
  retry_count: number;
  last_attempt?: string;
  next_retry?: string;
}
