// File: src/agents/core/event-emitter.ts
// Purpose: Event emission and handling for workflow orchestration
// Phase: PASSO 7.2 - Workflow Engine

import { EventEmitter } from 'events';
import { Logger } from './logger';

type EventHandler<T = any> = (data: T) => Promise<void> | void;
type EventFilter<T = any> = (data: T) => boolean;

interface WorkflowEvent<T = any> {
  type: string;
  executionId: string;
  agentId: string;
  timestamp: Date;
  data: T;
  metadata: Record<string, any>;
}

interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  filter?: EventFilter;
  priority: number;
  retryOnError: boolean;
  maxRetries: number;
}

interface EventMetrics {
  totalEmitted: number;
  totalHandled: number;
  totalErrors: number;
  byType: Map<string, number>;
  averageLatencyMs: number;
}

class WorkflowEventEmitter {
  private eventEmitter: EventEmitter;
  private subscriptions: Map<string, EventSubscription[]>;
  private eventHistory: WorkflowEvent[];
  private logger: Logger;
  private metrics: EventMetrics;
  private readonly MAX_HISTORY = 1000;

  constructor(logger: Logger) {
    this.eventEmitter = new EventEmitter();
    this.subscriptions = new Map();
    this.eventHistory = [];
    this.logger = logger;
    this.metrics = {
      totalEmitted: 0,
      totalHandled: 0,
      totalErrors: 0,
      byType: new Map(),
      averageLatencyMs: 0,
    };

    // Increase max listeners to avoid warnings
    this.eventEmitter.setMaxListeners(100);
  }

  /**
   * Subscribe to an event
   */
  subscribe<T = any>(
    eventType: string,
    handler: EventHandler<T>,
    options: {
      filter?: EventFilter<T>;
      priority?: number;
      retryOnError?: boolean;
      maxRetries?: number;
    } = {}
  ): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler,
      filter: options.filter as EventFilter | undefined,
      priority: options.priority || 0,
      retryOnError: options.retryOnError ?? false,
      maxRetries: options.maxRetries || 3,
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const subs = this.subscriptions.get(eventType)!;
    subs.push(subscription);

    // Sort by priority (higher priority first)
    subs.sort((a, b) => b.priority - a.priority);

    // Register with EventEmitter
    this.eventEmitter.on(eventType, (event: WorkflowEvent) => {
      this.handleEvent(subscription, event);
    });

    this.logger.debug('event-system', 'EventEmitter', `Subscription created: ${eventType}`, {
      subscriptionId,
      priority: subscription.priority,
    });

    return subscriptionId;
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [eventType, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        this.eventEmitter.removeAllListeners(eventType);

        // Re-register remaining subscriptions
        for (const sub of subs) {
          this.eventEmitter.on(eventType, (event: WorkflowEvent) => {
            this.handleEvent(sub, event);
          });
        }

        this.logger.debug('event-system', 'EventEmitter', `Subscription removed: ${subscriptionId}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Emit an event
   */
  async emit<T = any>(
    eventType: string,
    executionId: string,
    agentId: string,
    data: T,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const event: WorkflowEvent<T> = {
      type: eventType,
      executionId,
      agentId,
      timestamp: new Date(),
      data,
      metadata,
    };

    // Record in history
    this.recordEvent(event);

    // Update metrics
    this.metrics.totalEmitted++;
    this.metrics.byType.set(eventType, (this.metrics.byType.get(eventType) || 0) + 1);

    // Execute handlers in priority order synchronously
    const subs = this.subscriptions.get(eventType) || [];
    for (const subscription of subs) {
      await this.handleEvent(subscription, event);
    }

    this.logger.debug(executionId, agentId, `Event emitted: ${eventType}`, { metadata });
  }

  /**
   * Emit and wait for completion
   */
  async emitAndWait<T = any>(
    eventType: string,
    executionId: string,
    agentId: string,
    data: T,
    metadata: Record<string, any> = {},
    timeoutMs: number = 30000
  ): Promise<boolean> {
    const event: WorkflowEvent<T> = {
      type: eventType,
      executionId,
      agentId,
      timestamp: new Date(),
      data,
      metadata,
    };

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Event handling timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const handleCompletion = () => {
        clearTimeout(timer);
        resolve(true);
      };

      metadata._resolveHandler = handleCompletion;

      this.emit(eventType, executionId, agentId, data, metadata).then(() => {
        // Wait a bit for handlers to complete
        setTimeout(handleCompletion, 100);
      }).catch(reject);
    });
  }

  /**
   * Once - subscribe to event and unsubscribe after first execution
   */
  once<T = any>(
    eventType: string,
    handler: EventHandler<T>,
    options: { filter?: EventFilter<T>; priority?: number } = {}
  ): string {
    let subscriptionId: string;

    const wrappedHandler = async (data: T) => {
      await handler(data);
      this.unsubscribe(subscriptionId);
    };

    subscriptionId = this.subscribe(eventType, wrappedHandler, {
      ...options,
      retryOnError: false,
    });

    return subscriptionId;
  }

  /**
   * Get event history for an execution
   */
  getExecutionHistory(executionId: string): WorkflowEvent[] {
    return this.eventHistory.filter(e => e.executionId === executionId);
  }

  /**
   * Get event history filtered by type
   */
  getEventsByType(executionId: string, eventType: string): WorkflowEvent[] {
    return this.eventHistory.filter(e => e.executionId === executionId && e.type === eventType);
  }

  /**
   * Get the last event of a type for an execution
   */
  getLastEvent(executionId: string, eventType: string): WorkflowEvent | null {
    const events = this.getEventsByType(executionId, eventType);
    return events.length > 0 ? events[events.length - 1] : null;
  }

  /**
   * Get metrics
   */
  getMetrics(): EventMetrics {
    return {
      ...this.metrics,
      byType: new Map(this.metrics.byType),
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalEmitted: 0,
      totalHandled: 0,
      totalErrors: 0,
      byType: new Map(),
      averageLatencyMs: 0,
    };
  }

  /**
   * Get subscription count
   */
  getSubscriptionCount(eventType?: string): number {
    if (eventType) {
      return this.subscriptions.get(eventType)?.length || 0;
    }

    let total = 0;
    for (const subs of this.subscriptions.values()) {
      total += subs.length;
    }
    return total;
  }

  /**
   * Clear event history
   */
  clearHistory(executionId?: string): void {
    if (executionId) {
      this.eventHistory = this.eventHistory.filter(e => e.executionId !== executionId);
    } else {
      this.eventHistory = [];
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.eventEmitter.removeAllListeners();
    this.subscriptions.clear();
  }

  /**
   * Destroy emitter
   */
  destroy(): void {
    this.eventEmitter.removeAllListeners();
    this.subscriptions.clear();
    this.eventHistory = [];
  }

  // Private helper methods

  private async handleEvent(subscription: EventSubscription, event: WorkflowEvent): Promise<void> {
    // Check filter
    if (subscription.filter && !subscription.filter(event.data)) {
      return;
    }

    const startTime = Date.now();
    let retryCount = 0;

    const executeWithRetry = async (): Promise<void> => {
      try {
        await subscription.handler(event.data);
        this.metrics.totalHandled++;

        // Update latency metric
        const latency = Date.now() - startTime;
        this.updateAverageLatency(latency);

        // Call resolve handler if provided
        if (event.metadata._resolveHandler) {
          event.metadata._resolveHandler();
        }
      } catch (error) {
        this.metrics.totalErrors++;

        if (subscription.retryOnError && retryCount < subscription.maxRetries) {
          retryCount++;
          const backoffMs = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          await executeWithRetry();
        } else {
          this.logger.error(
            event.executionId,
            event.agentId,
            `Event handler error: ${subscription.eventType}`,
            {
              error: (error as Error).message,
              retryCount,
              subscription: subscription.id,
            }
          );
        }
      }
    };

    await executeWithRetry();
  }

  private recordEvent(event: WorkflowEvent): void {
    this.eventHistory.push(event);

    // Keep only last N events
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift();
    }
  }

  private updateAverageLatency(latency: number): void {
    const total = this.metrics.totalHandled;
    this.metrics.averageLatencyMs =
      (this.metrics.averageLatencyMs * (total - 1) + latency) / total;
  }
}

export {
  WorkflowEventEmitter,
  WorkflowEvent,
  EventSubscription,
  EventMetrics,
  EventHandler,
  EventFilter,
};
