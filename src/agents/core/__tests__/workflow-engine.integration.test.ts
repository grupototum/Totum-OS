// File: src/agents/core/__tests__/workflow-engine.integration.test.ts
// Purpose: Integration tests for workflow engine components
// Phase: PASSO 7.2 - Workflow Engine

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContextManager, ExecutionContext } from '../context-manager';
import { Scheduler, ScheduledTask } from '../scheduler';
import { StateManager } from '../state-manager';
import { WorkflowEventEmitter } from '../event-emitter';
import { Logger, LogLevel } from '../logger';

// Mock Supabase and Redis
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        lt: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    setex: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    del: vi.fn().mockResolvedValue(1),
    quit: vi.fn().mockResolvedValue('OK'),
  })),
}));

vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  appendFileSync: vi.fn(),
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));

describe('Workflow Engine Integration', () => {
  let contextManager: ContextManager;
  let scheduler: Scheduler;
  let stateManager: StateManager;
  let eventEmitter: WorkflowEventEmitter;
  let logger: Logger;
  let executionId: string;

  beforeEach(async () => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: false,
      enableDatabase: false,
      enableFile: false,
    });

    contextManager = new ContextManager(
      'https://test.supabase.co',
      'test-key',
      'redis://localhost:6379'
    );

    scheduler = new Scheduler(contextManager, logger);
    stateManager = new StateManager(
      'https://test.supabase.co',
      'test-key',
      logger,
      'redis://localhost:6379'
    );
    eventEmitter = new WorkflowEventEmitter(logger);

    // Create execution context
    const context = await contextManager.create('ARTEMIS', 'Test workflow', 'DIV-001');
    executionId = context.executionId;

    // Initialize state
    await stateManager.initializeState(executionId, {
      status: 'idle',
      tasksCompleted: 0,
      errors: 0,
    });
  });

  afterEach(async () => {
    await contextManager.destroy();
    await stateManager.destroy();
    eventEmitter.destroy();
    await logger.destroy();
  });

  describe('end-to-end workflow execution', () => {
    it('should execute a simple workflow', async () => {
      // Register task handler
      scheduler.registerTaskHandler('ARTEMIS', async (task: ScheduledTask) => {
        return { result: 'success' };
      });

      // Schedule a task
      const task = await scheduler.scheduleTask(
        executionId,
        'ARTEMIS',
        'Execute test task',
        'normal'
      );

      // Start scheduler
      await scheduler.start();

      // Wait for task to complete
      await new Promise(resolve => {
        scheduler.once('task:completed', resolve);
        setTimeout(() => resolve(null), 5000);
      });

      const stats = scheduler.getQueueStats();
      expect(stats.completed).toBeGreaterThan(0);

      await scheduler.stop();
    });

    it('should handle task dependencies', async () => {
      scheduler.registerTaskHandler('ARTEMIS', async () => ({ step: 1 }));
      scheduler.registerTaskHandler('LOKI', async () => ({ step: 2 }));

      // Schedule tasks with dependency
      const task1 = await scheduler.scheduleTask(
        executionId,
        'ARTEMIS',
        'First task',
        'normal'
      );

      const task2 = await scheduler.scheduleTask(
        executionId,
        'LOKI',
        'Second task',
        'normal',
        [task1.id] // Depends on task1
      );

      await scheduler.start();

      // Wait for completion
      await new Promise(resolve => {
        let completed = 0;
        scheduler.on('task:completed', () => {
          completed++;
          if (completed >= 2) resolve(null);
        });
        setTimeout(() => resolve(null), 5000);
      });

      const stats = scheduler.getQueueStats();
      expect(stats.completed).toBe(2);

      await scheduler.stop();
    });

    it('should retry failed tasks', async () => {
      let attempts = 0;

      scheduler.registerTaskHandler('ARTEMIS', async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('First attempt fails');
        }
        return { success: true };
      });

      const task = await scheduler.scheduleTask(
        executionId,
        'ARTEMIS',
        'Retry test',
        'normal'
      );

      await scheduler.start();

      await new Promise(resolve => {
        scheduler.once('task:completed', resolve);
        setTimeout(() => resolve(null), 5000);
      });

      expect(attempts).toBeGreaterThan(1);

      await scheduler.stop();
    });
  });

  describe('state management integration', () => {
    it('should track state changes during workflow', async () => {
      await stateManager.setState(executionId, 'phase', 'planning');
      await stateManager.setState(executionId, 'tasksCompleted', 5);

      const state = stateManager.getState(executionId);
      expect(state?.get('phase')).toBe('planning');
      expect(state?.get('tasksCompleted')).toBe(5);
    });

    it('should support state snapshots', async () => {
      await stateManager.setState(executionId, 'status', 'executing');
      const snapshot1 = await stateManager.createSnapshot(executionId, 'before-processing');

      await stateManager.setState(executionId, 'status', 'completed');
      const snapshot2 = await stateManager.createSnapshot(executionId, 'after-processing');

      const history = stateManager.getSnapshotHistory(executionId);
      expect(history.length).toBeGreaterThanOrEqual(2);
    });

    it('should rollback to previous state', async () => {
      await stateManager.setState(executionId, 'counter', 1);
      const snapshot1 = await stateManager.createSnapshot(executionId);

      await stateManager.setState(executionId, 'counter', 10);
      await stateManager.createSnapshot(executionId);

      await stateManager.rollbackToSnapshot(executionId, snapshot1.version);

      const state = stateManager.getState(executionId);
      expect(state?.get('counter')).toBe(1);
    });

    it('should validate state values', async () => {
      stateManager.registerValidator({
        key: 'score',
        validate: (v) => typeof v === 'number' && v >= 0 && v <= 100,
        errorMessage: 'Score must be between 0 and 100',
      });

      await stateManager.setState(executionId, 'score', 75);
      const state = stateManager.getState(executionId);
      expect(state?.get('score')).toBe(75);

      await expect(
        stateManager.setState(executionId, 'score', 150)
      ).rejects.toThrow('Score must be between 0 and 100');
    });
  });

  describe('event handling integration', () => {
    it('should emit and handle events', async () => {
      const events: any[] = [];

      eventEmitter.subscribe('workflow:started', (data) => {
        events.push(data);
      });

      await eventEmitter.emit('workflow:started', executionId, 'ARTEMIS', { workflowId: 'WF-001' });

      expect(events.length).toBe(1);
      expect(events[0].workflowId).toBe('WF-001');
    });

    it('should support event filtering', async () => {
      const events: any[] = [];

      eventEmitter.subscribe(
        'task:completed',
        (data) => {
          events.push(data);
        },
        {
          filter: (data) => data.status === 'success',
        }
      );

      await eventEmitter.emit('task:completed', executionId, 'ARTEMIS', { status: 'success' });
      await eventEmitter.emit('task:completed', executionId, 'ARTEMIS', { status: 'failed' });

      expect(events.length).toBe(1);
    });

    it('should handle event priorities', async () => {
      const order: string[] = [];

      eventEmitter.subscribe(
        'test:event',
        () => {
          order.push('low');
        },
        { priority: 1 }
      );

      eventEmitter.subscribe(
        'test:event',
        () => {
          order.push('high');
        },
        { priority: 10 }
      );

      await eventEmitter.emit('test:event', executionId, 'ARTEMIS', {});

      // Higher priority should be handled first (or equally)
      expect(order.indexOf('high')).toBeLessThanOrEqual(order.indexOf('low'));
    });

    it('should track event history', async () => {
      await eventEmitter.emit('event1', executionId, 'ARTEMIS', { data: 1 });
      await eventEmitter.emit('event2', executionId, 'ARTEMIS', { data: 2 });
      await eventEmitter.emit('event1', executionId, 'ARTEMIS', { data: 3 });

      const history = eventEmitter.getExecutionHistory(executionId);
      const event1s = eventEmitter.getEventsByType(executionId, 'event1');

      expect(history.length).toBe(3);
      expect(event1s.length).toBe(2);
    });
  });

  describe('context + scheduler + state integration', () => {
    it('should coordinate task execution with state', async () => {
      scheduler.registerTaskHandler('ARTEMIS', async () => {
        const currentCount = (stateManager.getState(executionId)?.get('tasksCompleted') || 0) as number;
        await stateManager.setState(executionId, 'tasksCompleted', currentCount + 1);
        return { success: true };
      });

      await scheduler.scheduleTask(executionId, 'ARTEMIS', 'Task 1', 'normal');
      await scheduler.scheduleTask(executionId, 'ARTEMIS', 'Task 2', 'normal');

      await scheduler.start();

      await new Promise(resolve => {
        let completed = 0;
        scheduler.on('task:completed', () => {
          completed++;
          if (completed >= 2) resolve(null);
        });
        setTimeout(() => resolve(null), 5000);
      });

      const state = stateManager.getState(executionId);
      expect(state?.get('tasksCompleted')).toBe(2);

      await scheduler.stop();
    });

    it('should emit events during task execution', async () => {
      const taskEvents: any[] = [];

      eventEmitter.subscribe('task:completed', (data) => {
        taskEvents.push(data);
      });

      scheduler.registerTaskHandler('ARTEMIS', async (task) => {
        await eventEmitter.emit('task:completed', executionId, task.agentId, {
          taskId: task.id,
          result: 'success',
        });
        return { success: true };
      });

      await scheduler.scheduleTask(executionId, 'ARTEMIS', 'Test task', 'normal');
      await scheduler.start();

      await new Promise(resolve => {
        scheduler.once('task:completed', resolve);
        setTimeout(() => resolve(null), 5000);
      });

      expect(taskEvents.length).toBeGreaterThan(0);

      await scheduler.stop();
    });
  });

  describe('error handling and recovery', () => {
    it('should handle scheduler errors gracefully', async () => {
      scheduler.registerTaskHandler('ARTEMIS', async () => {
        throw new Error('Task execution failed');
      });

      const task = await scheduler.scheduleTask(
        executionId,
        'ARTEMIS',
        'Failing task',
        'normal'
      );

      await scheduler.start();

      await new Promise(resolve => {
        scheduler.once('task:failed', () => resolve(null));
        scheduler.once('task:retried', () => {
          // Also resolve on retry so we can check partial state
          setTimeout(() => resolve(null), 100);
        });
        setTimeout(() => resolve(null), 15000);
      });

      const stats = scheduler.getQueueStats();
      // Task may be in failed or pending (retry) state
      expect(stats.failed + stats.pending).toBeGreaterThan(0);

      await scheduler.stop();
    }, 20000);

    it('should handle state lock contention', async () => {
      const lock1 = await stateManager.acquireLock(executionId, 'owner1', 5000);
      expect(lock1).toBe(true);

      const lock2 = await stateManager.acquireLock(executionId, 'owner2', 5000);
      expect(lock2).toBe(false);

      stateManager.releaseLock(executionId, 'owner1');

      const lock3 = await stateManager.acquireLock(executionId, 'owner2', 5000);
      expect(lock3).toBe(true);
    });
  });

  describe('workflow metrics and monitoring', () => {
    it('should track scheduler metrics', async () => {
      scheduler.registerTaskHandler('ARTEMIS', async () => ({ result: 'ok' }));

      await scheduler.scheduleTask(executionId, 'ARTEMIS', 'Task 1', 'normal');
      await scheduler.scheduleTask(executionId, 'ARTEMIS', 'Task 2', 'normal');

      const stats = scheduler.getQueueStats();
      expect(stats.pending).toBe(2);
      expect(stats.totalProcessed).toBe(0);
    });

    it('should track event metrics', async () => {
      await eventEmitter.emit('test:event', executionId, 'ARTEMIS', { data: 1 });
      await eventEmitter.emit('test:event', executionId, 'ARTEMIS', { data: 2 });

      const metrics = eventEmitter.getMetrics();
      expect(metrics.totalEmitted).toBe(2);
    });
  });
});
