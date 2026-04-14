// File: src/agents/core/context-manager.ts
// Purpose: Manage execution context, memory, state for autonomous agents
// Phase: PASSO 7.1 - Agent Runtime Environment

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

interface MemoryEntry {
  key: string;
  value: any;
  timestamp: Date;
  ttl?: number; // seconds
}

interface ExecutionContext {
  agentId: string;
  executionId: string;
  parentExecutionId?: string;
  objective: string;
  division: string;
  startTime: Date;
  endTime?: Date;

  // Memory (short + long term)
  shortTermMemory: Map<string, any>;
  longTermMemory: MemoryEntry[];

  // State tracking
  currentPhase: 'planning' | 'executing' | 'reporting' | 'completed' | 'failed';
  completedTasks: Task[];
  failedTasks: Task[];
  pendingTasks: Task[];

  // Context
  userContext: any;
  environmentVariables: Record<string, string>;
  metadata: Record<string, any>;

  // Execution stats
  totalDuration?: number;
  taskCount: number;
  successCount: number;
  failureCount: number;
}

class ContextManager {
  private supabase: any;
  private redis: Redis;
  private contextCache: Map<string, ExecutionContext>;
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly REDIS_PREFIX = 'context:';

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    redisUrl: string = 'redis://localhost:6379'
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.redis = new Redis(redisUrl);
    this.contextCache = new Map();
  }

  /**
   * Create a new execution context
   */
  async create(
    agentId: string,
    objective: string,
    division: string,
    parentExecutionId?: string,
    userContext?: any
  ): Promise<ExecutionContext> {
    const executionId = `exec-${agentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const context: ExecutionContext = {
      agentId,
      executionId,
      parentExecutionId,
      objective,
      division,
      startTime: new Date(),
      shortTermMemory: new Map(),
      longTermMemory: [],
      currentPhase: 'planning',
      completedTasks: [],
      failedTasks: [],
      pendingTasks: [],
      userContext: userContext || {},
      environmentVariables: this.loadEnvironmentVariables(),
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
      },
      taskCount: 0,
      successCount: 0,
      failureCount: 0,
    };

    // Cache in memory and Redis
    this.contextCache.set(executionId, context);
    await this.cacheToRedis(executionId, context);

    // Log creation
    await this.logContextEvent(executionId, 'CREATED', {
      agentId,
      objective,
      division,
      parentExecutionId,
    });

    return context;
  }

  /**
   * Get execution context by ID
   */
  async get(executionId: string): Promise<ExecutionContext | null> {
    // Check memory cache first
    if (this.contextCache.has(executionId)) {
      return this.contextCache.get(executionId) || null;
    }

    // Check Redis
    const cached = await this.redis.get(`${this.REDIS_PREFIX}${executionId}`);
    if (cached) {
      const context = this.deserializeContext(JSON.parse(cached));
      this.contextCache.set(executionId, context);
      return context;
    }

    // Fallback to database
    return this.retrieveFromDatabase(executionId);
  }

  /**
   * Update context (partial update)
   */
  async update(
    executionId: string,
    updates: Partial<ExecutionContext>
  ): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    // Merge updates
    const updated: ExecutionContext = {
      ...context,
      ...updates,
      // Preserve these as they should be merged, not replaced
      shortTermMemory: updates.shortTermMemory || context.shortTermMemory,
      longTermMemory: updates.longTermMemory || context.longTermMemory,
      completedTasks: updates.completedTasks || context.completedTasks,
      failedTasks: updates.failedTasks || context.failedTasks,
      pendingTasks: updates.pendingTasks || context.pendingTasks,
    };

    // Update caches
    this.contextCache.set(executionId, updated);
    await this.cacheToRedis(executionId, updated);

    // Persist to database asynchronously
    this.persistToDatabase(executionId, updated).catch(err => {
      console.error(`Failed to persist context ${executionId}:`, err);
    });
  }

  /**
   * Save context completely
   */
  async save(context: ExecutionContext): Promise<void> {
    const executionId = context.executionId;

    // Update cache
    this.contextCache.set(executionId, context);
    await this.cacheToRedis(executionId, context);

    // Persist to database
    await this.persistToDatabase(executionId, context);

    await this.logContextEvent(executionId, 'SAVED', {
      phase: context.currentPhase,
      taskCount: context.taskCount,
      successCount: context.successCount,
      failureCount: context.failureCount,
    });
  }

  /**
   * Retrieve context from database
   */
  async retrieve(executionId: string): Promise<ExecutionContext | null> {
    return this.get(executionId);
  }

  /**
   * Add task to context
   */
  async addTask(executionId: string, task: Task): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    context.pendingTasks.push(task);
    context.taskCount++;

    await this.update(executionId, {
      pendingTasks: context.pendingTasks,
      taskCount: context.taskCount,
    });
  }

  /**
   * Mark task as completed
   */
  async completeTask(executionId: string, taskId: string, result: any): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    const taskIndex = context.pendingTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const task = context.pendingTasks.splice(taskIndex, 1)[0];
    task.status = 'completed';
    task.result = result;
    task.endTime = new Date();

    context.completedTasks.push(task);
    context.successCount++;

    await this.update(executionId, {
      pendingTasks: context.pendingTasks,
      completedTasks: context.completedTasks,
      successCount: context.successCount,
    });
  }

  /**
   * Mark task as failed
   */
  async failTask(executionId: string, taskId: string, error: string): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    const taskIndex = context.pendingTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const task = context.pendingTasks.splice(taskIndex, 1)[0];
    task.status = 'failed';
    task.error = error;
    task.endTime = new Date();

    context.failedTasks.push(task);
    context.failureCount++;

    await this.update(executionId, {
      pendingTasks: context.pendingTasks,
      failedTasks: context.failedTasks,
      failureCount: context.failureCount,
    });
  }

  /**
   * Store value in short-term memory
   */
  async setMemory(executionId: string, key: string, value: any): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    context.shortTermMemory.set(key, value);
    await this.update(executionId, { shortTermMemory: context.shortTermMemory });
  }

  /**
   * Retrieve value from short-term memory
   */
  async getMemory(executionId: string, key: string): Promise<any> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    return context.shortTermMemory.get(key);
  }

  /**
   * Store value in long-term memory (with persistence)
   */
  async setLongTermMemory(
    executionId: string,
    key: string,
    value: any,
    ttl?: number
  ): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    const entry: MemoryEntry = {
      key,
      value,
      timestamp: new Date(),
      ttl,
    };

    context.longTermMemory.push(entry);
    await this.update(executionId, { longTermMemory: context.longTermMemory });

    // Also persist to database
    const { error } = await this.supabase
      .from('agent_long_term_memory')
      .insert({
        execution_id: executionId,
        key,
        value: JSON.stringify(value),
        ttl,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to persist long-term memory:', error);
    }
  }

  /**
   * Retrieve from long-term memory
   */
  async getLongTermMemory(executionId: string, key: string): Promise<any> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    const entry = context.longTermMemory.find(m => m.key === key);
    return entry?.value;
  }

  /**
   * Update execution phase
   */
  async setPhase(
    executionId: string,
    phase: ExecutionContext['currentPhase']
  ): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    context.currentPhase = phase;
    await this.update(executionId, { currentPhase: phase });
    await this.logContextEvent(executionId, `PHASE_${phase.toUpperCase()}`, {});
  }

  /**
   * Complete execution and finalize context
   */
  async complete(executionId: string): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    context.endTime = new Date();
    context.currentPhase = 'completed';
    context.totalDuration = context.endTime.getTime() - context.startTime.getTime();

    await this.save(context);
    await this.logContextEvent(executionId, 'COMPLETED', {
      duration: context.totalDuration,
      successCount: context.successCount,
      failureCount: context.failureCount,
    });
  }

  /**
   * Cancel execution
   */
  async cancel(executionId: string, reason: string): Promise<void> {
    const context = await this.get(executionId);
    if (!context) {
      throw new Error(`Context not found: ${executionId}`);
    }

    context.currentPhase = 'failed';
    context.endTime = new Date();
    context.metadata.cancelReason = reason;

    await this.save(context);
    await this.logContextEvent(executionId, 'CANCELLED', { reason });
  }

  /**
   * Get execution summary
   */
  async getSummary(executionId: string): Promise<any> {
    const context = await this.get(executionId);
    if (!context) {
      return null;
    }

    return {
      executionId: context.executionId,
      agentId: context.agentId,
      division: context.division,
      objective: context.objective,
      phase: context.currentPhase,
      startTime: context.startTime,
      endTime: context.endTime,
      totalDuration: context.totalDuration,
      taskCount: context.taskCount,
      successCount: context.successCount,
      failureCount: context.failureCount,
      successRate: context.taskCount > 0
        ? (context.successCount / context.taskCount * 100).toFixed(2) + '%'
        : '0%',
    };
  }

  /**
   * Clean up old contexts (>24 hours)
   */
  async cleanup(): Promise<void> {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [executionId, context] of this.contextCache.entries()) {
      if (now - context.startTime.getTime() > maxAge) {
        this.contextCache.delete(executionId);
        await this.redis.del(`${this.REDIS_PREFIX}${executionId}`);
      }
    }
  }

  // Private helper methods

  private loadEnvironmentVariables(): Record<string, string> {
    return {
      ELIZAOS_API_URL: process.env.ELIZAOS_API_URL || '',
      AGENT_TIMEOUT: process.env.AGENT_TIMEOUT || '30000',
      MAX_RETRIES: process.env.MAX_RETRIES || '2',
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    };
  }

  private async cacheToRedis(executionId: string, context: ExecutionContext): Promise<void> {
    try {
      const serialized = this.serializeContext(context);
      await this.redis.setex(
        `${this.REDIS_PREFIX}${executionId}`,
        this.CACHE_TTL,
        JSON.stringify(serialized)
      );
    } catch (error) {
      console.error('Redis cache error:', error);
    }
  }

  private serializeContext(context: ExecutionContext): any {
    return {
      ...context,
      startTime: context.startTime.toISOString(),
      endTime: context.endTime?.toISOString(),
      shortTermMemory: Array.from(context.shortTermMemory.entries()),
      longTermMemory: context.longTermMemory,
      completedTasks: context.completedTasks,
      failedTasks: context.failedTasks,
      pendingTasks: context.pendingTasks,
    };
  }

  private deserializeContext(data: any): ExecutionContext {
    const context: ExecutionContext = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      shortTermMemory: new Map(data.shortTermMemory || []),
      longTermMemory: data.longTermMemory || [],
      completedTasks: data.completedTasks || [],
      failedTasks: data.failedTasks || [],
      pendingTasks: data.pendingTasks || [],
    };
    return context;
  }

  private async persistToDatabase(executionId: string, context: ExecutionContext): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('agent_execution_contexts')
        .upsert({
          execution_id: executionId,
          agent_id: context.agentId,
          division: context.division,
          objective: context.objective,
          current_phase: context.currentPhase,
          start_time: context.startTime.toISOString(),
          end_time: context.endTime?.toISOString(),
          total_duration: context.totalDuration,
          task_count: context.taskCount,
          success_count: context.successCount,
          failure_count: context.failureCount,
          metadata: JSON.stringify(context.metadata),
          user_context: JSON.stringify(context.userContext),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Database persistence error:', error);
      }
    } catch (error) {
      console.error('Failed to persist context to database:', error);
    }
  }

  private async retrieveFromDatabase(executionId: string): Promise<ExecutionContext | null> {
    try {
      const { data, error } = await this.supabase
        .from('agent_execution_contexts')
        .select('*')
        .eq('execution_id', executionId)
        .single();

      if (error || !data) {
        return null;
      }

      const context: ExecutionContext = {
        agentId: data.agent_id,
        executionId: data.execution_id,
        objective: data.objective,
        division: data.division,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        shortTermMemory: new Map(),
        longTermMemory: [],
        currentPhase: data.current_phase,
        completedTasks: [],
        failedTasks: [],
        pendingTasks: [],
        userContext: JSON.parse(data.user_context || '{}'),
        environmentVariables: this.loadEnvironmentVariables(),
        metadata: JSON.parse(data.metadata || '{}'),
        taskCount: data.task_count,
        successCount: data.success_count,
        failureCount: data.failure_count,
        totalDuration: data.total_duration,
      };

      this.contextCache.set(executionId, context);
      return context;
    } catch (error) {
      console.error('Database retrieval error:', error);
      return null;
    }
  }

  private async logContextEvent(
    executionId: string,
    eventType: string,
    data: any
  ): Promise<void> {
    try {
      await this.supabase
        .from('agent_context_events')
        .insert({
          execution_id: executionId,
          event_type: eventType,
          data: JSON.stringify(data),
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Failed to log context event:', error);
    }
  }

  /**
   * Destroy the context manager and clean up resources
   */
  async destroy(): Promise<void> {
    this.contextCache.clear();
    if (this.redisClient && this.redisClient.disconnect) {
      this.redisClient.disconnect();
    }
  }
}

export { ContextManager, ExecutionContext, Task, MemoryEntry };
