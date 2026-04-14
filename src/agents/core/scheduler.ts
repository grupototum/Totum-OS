// File: src/agents/core/scheduler.ts
// Purpose: Task scheduling and execution coordination for agent workflows
// Phase: PASSO 7.2 - Workflow Engine

import { EventEmitter } from 'events';
import { ContextManager, ExecutionContext, Task } from './context-manager';
import { Logger, LogLevel } from './logger';

interface ScheduledTask {
  id: string;
  executionId: string;
  agentId: string;
  description: string;
  scheduledTime: Date;
  priority: 'low' | 'normal' | 'high' | 'critical';
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelayMs: number;
  };
  dependencies: string[]; // IDs of tasks that must complete first
  timeout: number; // milliseconds
  metadata: Record<string, any>;
}

interface ExecutionQueue {
  pending: ScheduledTask[];
  running: Map<string, ScheduledTask>;
  completed: ScheduledTask[];
  failed: Map<string, { task: ScheduledTask; error: string }>;
}

type TaskCallback = (task: ScheduledTask) => Promise<any>;

class Scheduler extends EventEmitter {
  private contextManager: ContextManager;
  private logger: Logger;
  private queue: ExecutionQueue;
  private taskCallbacks: Map<string, TaskCallback>;
  private runningTasks: Map<string, { timer: NodeJS.Timeout; resolve: any; reject: any }>;
  private isRunning: boolean = false;
  private readonly POLLING_INTERVAL = 1000; // 1 second
  private pollingTimer: NodeJS.Timeout | null = null;

  constructor(contextManager: ContextManager, logger: Logger) {
    super();
    this.contextManager = contextManager;
    this.logger = logger;
    this.queue = {
      pending: [],
      running: new Map(),
      completed: [],
      failed: new Map(),
    };
    this.taskCallbacks = new Map();
    this.runningTasks = new Map();
  }

  /**
   * Register a task callback handler
   */
  registerTaskHandler(agentId: string, callback: TaskCallback): void {
    this.taskCallbacks.set(agentId, callback);
    this.logger.info('scheduler', 'SCHEDULER', `Task handler registered: ${agentId}`);
  }

  /**
   * Add a task to the pending queue
   */
  private enqueueTask(task: ScheduledTask): void {
    this.queue.pending.push(task);
    const priorities = { critical: 4, high: 3, normal: 2, low: 1 };
    this.queue.pending.sort((a, b) => {
      const priorityDiff = (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return a.scheduledTime.getTime() - b.scheduledTime.getTime();
    });
  }

  /**
   * Schedule a task for execution
   */
  async scheduleTask(
    executionId: string,
    agentId: string,
    description: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal',
    dependencies: string[] = [],
    timeout: number = 30000,
    metadata: Record<string, any> = {}
  ): Promise<ScheduledTask> {
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const task: ScheduledTask = {
      id: taskId,
      executionId,
      agentId,
      description,
      scheduledTime: new Date(),
      priority,
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelayMs: 1000,
      },
      dependencies,
      timeout,
      metadata,
    };

    // Add to queue based on priority
    this.enqueueTask(task);

    // Add to context
    await this.contextManager.addTask(executionId, {
      id: taskId,
      description,
      status: 'pending',
    });

    this.logger.info(
      executionId,
      agentId,
      `Task scheduled: ${description}`,
      { taskId, priority }
    );

    this.emit('task:scheduled', task);

    return task;
  }

  /**
   * Start the scheduler
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('scheduler', 'SCHEDULER', 'Scheduler already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('scheduler', 'SCHEDULER', 'Scheduler started');
    this.emit('scheduler:started');

    this.pollingTimer = setInterval(() => {
      this.processPendingTasks().catch(error => {
        this.logger.error('scheduler', 'SCHEDULER', 'Task processing error', { error: error.message });
      });
    }, this.POLLING_INTERVAL);
  }

  /**
   * Stop the scheduler
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }

    // Wait for running tasks to complete
    await this.waitForRunningTasks();

    this.logger.info('scheduler', 'SCHEDULER', 'Scheduler stopped');
    this.emit('scheduler:stopped');
  }

  /**
   * Process pending tasks
   */
  private async processPendingTasks(): Promise<void> {
    if (this.queue.pending.length === 0) {
      return;
    }

    // Get next task (highest priority first)
    const task = this.getNextTask();
    if (!task) {
      return;
    }

    // Check if dependencies are satisfied
    if (!this.areDependenciesSatisfied(task)) {
      return;
    }

    // Move to running queue
    this.queue.pending = this.queue.pending.filter(t => t.id !== task.id);
    this.queue.running.set(task.id, task);

    this.logger.info(
      task.executionId,
      task.agentId,
      `Executing task: ${task.description}`,
      { taskId: task.id }
    );

    this.emit('task:started', task);

    // Execute task with timeout
    this.executeTaskWithTimeout(task);
  }

  /**
   * Execute task with timeout handling
   */
  private executeTaskWithTimeout(task: ScheduledTask): void {
    const callback = this.taskCallbacks.get(task.agentId);

    if (!callback) {
      this.logger.warn(
        task.executionId,
        task.agentId,
        `No handler registered for agent: ${task.agentId}`
      );
      this.markTaskFailed(task, `No handler registered for ${task.agentId}`);
      return;
    }

    let timeoutHandle: NodeJS.Timeout | null = null;
    let completed = false;

    const promise = callback(task)
      .then(result => {
        if (!completed) {
          completed = true;
          if (timeoutHandle) clearTimeout(timeoutHandle);
          this.markTaskCompleted(task, result);
        }
      })
      .catch(error => {
        if (!completed) {
          completed = true;
          if (timeoutHandle) clearTimeout(timeoutHandle);
          this.markTaskFailed(task, error.message);
        }
      });

    timeoutHandle = setTimeout(() => {
      if (!completed) {
        completed = true;
        this.markTaskFailed(task, `Task timeout after ${task.timeout}ms`);
      }
    }, task.timeout);

    this.runningTasks.set(task.id, {
      timer: timeoutHandle,
      resolve: null,
      reject: null,
    });
  }

  /**
   * Mark task as completed
   */
  private async markTaskCompleted(task: ScheduledTask, result: any): Promise<void> {
    this.queue.running.delete(task.id);
    this.queue.completed.push(task);

    this.logger.info(
      task.executionId,
      task.agentId,
      `Task completed: ${task.description}`,
      { taskId: task.id, result }
    );

    await this.contextManager.completeTask(task.executionId, task.id, result);

    this.emit('task:completed', { task, result });

    // Clean up timeout
    const running = this.runningTasks.get(task.id);
    if (running) {
      clearTimeout(running.timer);
      this.runningTasks.delete(task.id);
    }
  }

  /**
   * Mark task as failed
   */
  private async markTaskFailed(task: ScheduledTask, error: string): Promise<void> {
    this.queue.running.delete(task.id);

    // Check if we should retry
    const retryCount = (task.metadata.retryCount || 0) + 1;

    if (retryCount <= task.retryPolicy.maxRetries) {
      // Reschedule with exponential backoff
      const backoffMs =
        task.retryPolicy.initialDelayMs * Math.pow(task.retryPolicy.backoffMultiplier, retryCount - 1);

      task.metadata.retryCount = retryCount;
      task.scheduledTime = new Date(Date.now() + backoffMs);

      this.queue.pending.push(task);

      this.logger.warn(
        task.executionId,
        task.agentId,
        `Task retry scheduled: ${task.description}`,
        { taskId: task.id, retryCount, backoffMs, error }
      );

      this.emit('task:retried', { task, retryCount, error });
    } else {
      // Mark as permanently failed
      this.queue.failed.set(task.id, { task, error });

      this.logger.error(
        task.executionId,
        task.agentId,
        `Task failed: ${task.description}`,
        { taskId: task.id, error, retriesExhausted: true }
      );

      await this.contextManager.failTask(task.executionId, task.id, error);

      this.emit('task:failed', { task, error });

      // Clean up timeout
      const running = this.runningTasks.get(task.id);
      if (running) {
        clearTimeout(running.timer);
        this.runningTasks.delete(task.id);
      }
    }
  }

  /**
   * Get next task to execute (priority-based)
   */
  private getNextTask(): ScheduledTask | null {
    if (this.queue.pending.length === 0) {
      return null;
    }

    const now = Date.now();
    const priorities = { critical: 4, high: 3, normal: 2, low: 1 };

    // Sort by priority and scheduled time
    this.queue.pending.sort((a, b) => {
      const priorityDiff =
        (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      return a.scheduledTime.getTime() - b.scheduledTime.getTime();
    });

    // Return first task that's ready to execute
    for (const task of this.queue.pending) {
      if (task.scheduledTime.getTime() <= now) {
        return task;
      }
    }

    return null;
  }

  /**
   * Check if task dependencies are satisfied
   */
  private areDependenciesSatisfied(task: ScheduledTask): boolean {
    if (task.dependencies.length === 0) {
      return true;
    }

    // Check if all dependencies have completed
    return task.dependencies.every(depId => {
      return this.queue.completed.some(t => t.id === depId);
    });
  }

  /**
   * Wait for all running tasks to complete
   */
  private async waitForRunningTasks(): Promise<void> {
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();

    while (this.queue.running.size > 0) {
      if (Date.now() - startTime > maxWaitTime) {
        this.logger.warn(
          'scheduler',
          'SCHEDULER',
          'Timeout waiting for running tasks',
          { runningCount: this.queue.running.size }
        );
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): {
    pending: number;
    running: number;
    completed: number;
    failed: number;
    totalProcessed: number;
  } {
    return {
      pending: this.queue.pending.length,
      running: this.queue.running.size,
      completed: this.queue.completed.length,
      failed: this.queue.failed.size,
      totalProcessed: this.queue.completed.length + this.queue.failed.size,
    };
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): 'pending' | 'running' | 'completed' | 'failed' | 'unknown' {
    if (this.queue.pending.some(t => t.id === taskId)) return 'pending';
    if (this.queue.running.has(taskId)) return 'running';
    if (this.queue.completed.some(t => t.id === taskId)) return 'completed';
    if (this.queue.failed.has(taskId)) return 'failed';
    return 'unknown';
  }

  /**
   * Get execution queue for an execution
   */
  getExecutionQueue(executionId: string): {
    pending: ScheduledTask[];
    running: ScheduledTask[];
    completed: ScheduledTask[];
    failed: Array<{ task: ScheduledTask; error: string }>;
  } {
    return {
      pending: this.queue.pending.filter(t => t.executionId === executionId),
      running: Array.from(this.queue.running.values()).filter(
        t => t.executionId === executionId
      ),
      completed: this.queue.completed.filter(t => t.executionId === executionId),
      failed: Array.from(this.queue.failed.values()).filter(
        t => t.task.executionId === executionId
      ),
    };
  }

  /**
   * Cancel a scheduled task
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const pending = this.queue.pending.find(t => t.id === taskId);
    if (pending) {
      this.queue.pending = this.queue.pending.filter(t => t.id !== taskId);
      this.logger.info(
        pending.executionId,
        pending.agentId,
        `Task cancelled: ${pending.description}`,
        { taskId }
      );
      this.emit('task:cancelled', pending);
      return true;
    }

    return false;
  }

  /**
   * Clear completed and failed tasks
   */
  clearHistory(): void {
    const completedCount = this.queue.completed.length;
    const failedCount = this.queue.failed.size;

    this.queue.completed = [];
    this.queue.failed.clear();

    this.logger.info(
      'scheduler',
      'SCHEDULER',
      `Cleared history: ${completedCount} completed, ${failedCount} failed`
    );
  }

  /**
   * Destroy scheduler
   */
  async destroy(): Promise<void> {
    await this.stop();
    this.removeAllListeners();
  }
}

export { Scheduler, ScheduledTask, ExecutionQueue, TaskCallback };
