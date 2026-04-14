// File: src/agents/core/__tests__/context-manager.test.ts
// Purpose: Unit tests for ContextManager
// Phase: PASSO 7.1 - Agent Runtime Environment

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContextManager, ExecutionContext } from '../context-manager';

// Mock Supabase and Redis
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              execution_id: 'test-exec-1',
              agent_id: 'ARTEMIS',
              objective: 'Test objective',
              division: 'DIV-001',
              current_phase: 'planning',
              start_time: new Date().toISOString(),
              task_count: 0,
              success_count: 0,
              failure_count: 0,
              metadata: '{}',
              user_context: '{}',
            },
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
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

describe('ContextManager', () => {
  let contextManager: ContextManager;

  beforeEach(() => {
    contextManager = new ContextManager(
      'https://test.supabase.co',
      'test-key',
      'redis://localhost:6379'
    );
  });

  afterEach(() => {
    // Cleanup
  });

  describe('create', () => {
    it('should create a new execution context', async () => {
      const context = await contextManager.create('ARTEMIS', 'Test objective', 'DIV-001');

      expect(context).toBeDefined();
      expect(context.agentId).toBe('ARTEMIS');
      expect(context.objective).toBe('Test objective');
      expect(context.division).toBe('DIV-001');
      expect(context.currentPhase).toBe('planning');
      expect(context.taskCount).toBe(0);
      expect(context.successCount).toBe(0);
      expect(context.failureCount).toBe(0);
    });

    it('should generate unique execution IDs', async () => {
      const context1 = await contextManager.create('ARTEMIS', 'Test 1', 'DIV-001');
      const context2 = await contextManager.create('ARTEMIS', 'Test 2', 'DIV-001');

      expect(context1.executionId).not.toBe(context2.executionId);
    });

    it('should accept parent execution ID', async () => {
      const context = await contextManager.create(
        'ARTEMIS',
        'Test objective',
        'DIV-001',
        'parent-exec-123'
      );

      expect(context.parentExecutionId).toBe('parent-exec-123');
    });

    it('should accept user context', async () => {
      const userCtx = { userId: '123', role: 'admin' };
      const context = await contextManager.create(
        'ARTEMIS',
        'Test',
        'DIV-001',
        undefined,
        userCtx
      );

      expect(context.userContext).toEqual(userCtx);
    });
  });

  describe('memory management', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should store and retrieve from short-term memory', async () => {
      await contextManager.setMemory(context.executionId, 'key1', { value: 'test' });
      const retrieved = await contextManager.getMemory(context.executionId, 'key1');

      expect(retrieved).toEqual({ value: 'test' });
    });

    it('should store and retrieve from long-term memory', async () => {
      await contextManager.setLongTermMemory(
        context.executionId,
        'decision1',
        { strategy: 'fallback' }
      );
      const retrieved = await contextManager.getLongTermMemory(
        context.executionId,
        'decision1'
      );

      expect(retrieved).toEqual({ strategy: 'fallback' });
    });

    it('should support TTL for long-term memory', async () => {
      await contextManager.setLongTermMemory(
        context.executionId,
        'temp_key',
        { data: 'expires' },
        300
      );

      const ctx = await contextManager.get(context.executionId);
      const entry = ctx?.longTermMemory.find(m => m.key === 'temp_key');

      expect(entry?.ttl).toBe(300);
    });
  });

  describe('task management', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should add task to context', async () => {
      const task = {
        id: 'task-1',
        description: 'Do something',
        status: 'pending' as const,
      };

      await contextManager.addTask(context.executionId, task);
      const updated = await contextManager.get(context.executionId);

      expect(updated?.taskCount).toBe(1);
      expect(updated?.pendingTasks.length).toBe(1);
    });

    it('should mark task as completed', async () => {
      const task = {
        id: 'task-1',
        description: 'Do something',
        status: 'pending' as const,
      };

      await contextManager.addTask(context.executionId, task);
      await contextManager.completeTask(context.executionId, 'task-1', { result: 'success' });
      const updated = await contextManager.get(context.executionId);

      expect(updated?.successCount).toBe(1);
      expect(updated?.completedTasks.length).toBe(1);
      expect(updated?.pendingTasks.length).toBe(0);
    });

    it('should mark task as failed', async () => {
      const task = {
        id: 'task-1',
        description: 'Do something',
        status: 'pending' as const,
      };

      await contextManager.addTask(context.executionId, task);
      await contextManager.failTask(context.executionId, 'task-1', 'Task failed');
      const updated = await contextManager.get(context.executionId);

      expect(updated?.failureCount).toBe(1);
      expect(updated?.failedTasks.length).toBe(1);
      expect(updated?.pendingTasks.length).toBe(0);
    });
  });

  describe('phase management', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should update phase', async () => {
      await contextManager.setPhase(context.executionId, 'executing');
      const updated = await contextManager.get(context.executionId);

      expect(updated?.currentPhase).toBe('executing');
    });

    it('should support all valid phases', async () => {
      const phases = ['planning', 'executing', 'reporting', 'completed', 'failed'] as const;

      for (const phase of phases) {
        await contextManager.setPhase(context.executionId, phase);
        const updated = await contextManager.get(context.executionId);
        expect(updated?.currentPhase).toBe(phase);
      }
    });
  });

  describe('execution lifecycle', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should complete execution', async () => {
      await contextManager.complete(context.executionId);
      const updated = await contextManager.get(context.executionId);

      expect(updated?.currentPhase).toBe('completed');
      expect(updated?.endTime).toBeDefined();
      expect(updated?.totalDuration).toBeDefined();
      expect(updated?.totalDuration).toBeGreaterThan(0);
    });

    it('should cancel execution', async () => {
      const reason = 'User cancelled';
      await contextManager.cancel(context.executionId, reason);
      const updated = await contextManager.get(context.executionId);

      expect(updated?.currentPhase).toBe('failed');
      expect(updated?.metadata.cancelReason).toBe(reason);
    });
  });

  describe('context updates', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should perform partial updates', async () => {
      await contextManager.update(context.executionId, {
        currentPhase: 'executing',
      });

      const updated = await contextManager.get(context.executionId);
      expect(updated?.currentPhase).toBe('executing');
      expect(updated?.objective).toBe('Test'); // Original value preserved
    });

    it('should merge memory updates', async () => {
      await contextManager.setMemory(context.executionId, 'key1', { value: 'test1' });
      await contextManager.setMemory(context.executionId, 'key2', { value: 'test2' });

      const updated = await contextManager.get(context.executionId);
      expect(updated?.shortTermMemory.get('key1')).toEqual({ value: 'test1' });
      expect(updated?.shortTermMemory.get('key2')).toEqual({ value: 'test2' });
    });
  });

  describe('execution summary', () => {
    let context: ExecutionContext;

    beforeEach(async () => {
      context = await contextManager.create('ARTEMIS', 'Test', 'DIV-001');
    });

    it('should generate execution summary', async () => {
      const task = {
        id: 'task-1',
        description: 'Do something',
        status: 'pending' as const,
      };

      await contextManager.addTask(context.executionId, task);
      await contextManager.completeTask(context.executionId, 'task-1', {});
      await contextManager.complete(context.executionId);

      const summary = await contextManager.getSummary(context.executionId);

      expect(summary).toBeDefined();
      expect(summary.executionId).toBe(context.executionId);
      expect(summary.agentId).toBe('ARTEMIS');
      expect(summary.taskCount).toBe(1);
      expect(summary.successCount).toBe(1);
      expect(summary.phase).toBe('completed');
    });

    it('should calculate success rate', async () => {
      const tasks = [
        { id: 'task-1', description: 'Task 1', status: 'pending' as const },
        { id: 'task-2', description: 'Task 2', status: 'pending' as const },
        { id: 'task-3', description: 'Task 3', status: 'pending' as const },
      ];

      for (const task of tasks) {
        await contextManager.addTask(context.executionId, task);
      }

      await contextManager.completeTask(context.executionId, 'task-1', {});
      await contextManager.completeTask(context.executionId, 'task-2', {});
      await contextManager.failTask(context.executionId, 'task-3', 'Failed');
      await contextManager.complete(context.executionId);

      const summary = await contextManager.getSummary(context.executionId);

      expect(summary.successRate).toBe('66.67%');
    });
  });

  describe('error handling', () => {
    it('should throw error when context not found', async () => {
      await expect(contextManager.get('non-existent-id')).resolves.toBeNull();
    });

    it('should throw error when updating non-existent context', async () => {
      await expect(
        contextManager.update('non-existent-id', { currentPhase: 'executing' })
      ).rejects.toThrow('Context not found');
    });

    it('should throw error when completing non-existent context', async () => {
      await expect(contextManager.complete('non-existent-id')).rejects.toThrow(
        'Context not found'
      );
    });
  });
});
