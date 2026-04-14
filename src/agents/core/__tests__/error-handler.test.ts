// File: src/agents/core/__tests__/error-handler.test.ts
// Purpose: Unit tests for ErrorHandler
// Phase: PASSO 7.1 - Agent Runtime Environment

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorHandler, ErrorCategory, AgentError } from '../error-handler';
import { ContextManager } from '../context-manager';

// Mock Supabase
const createMockChainable = (finalValue: any = { data: [], error: null }) => {
  const promise = Promise.resolve(finalValue);
  const chainable: any = function() { return promise; };
  chainable.then = promise.then.bind(promise);
  chainable.catch = promise.catch.bind(promise);
  chainable.eq = vi.fn().mockReturnValue(chainable);
  chainable.gte = vi.fn().mockReturnValue(chainable);
  chainable.order = vi.fn().mockReturnValue(chainable);
  chainable.limit = vi.fn().mockReturnValue(chainable);
  return chainable;
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockImplementation(() => createMockChainable()),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    setex: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    quit: vi.fn().mockResolvedValue('OK'),
  })),
}));

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let contextManager: ContextManager;

  beforeEach(() => {
    contextManager = new ContextManager(
      'https://test.supabase.co',
      'test-key',
      'redis://localhost:6379'
    );
    errorHandler = new ErrorHandler('https://test.supabase.co', 'test-key', contextManager);
  });

  describe('error classification', () => {
    it('should classify timeout errors', () => {
      const error = new Error('Request timeout ECONNABORTED');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.TIMEOUT);
      expect(classification.retryable).toBe(true);
      expect(classification.maxRetries).toBe(3);
    });

    it('should classify network errors', () => {
      const error = new Error('ENOTFOUND hostname');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.NETWORK);
      expect(classification.retryable).toBe(true);
      expect(classification.maxRetries).toBe(4);
    });

    it('should classify rate limit errors', () => {
      const error = new Error('429 Too Many Requests');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(classification.retryable).toBe(true);
      expect(classification.maxRetries).toBe(5);
    });

    it('should classify authentication errors', () => {
      const error = new Error('401 Unauthorized - Invalid token');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(classification.retryable).toBe(false);
      expect(classification.maxRetries).toBe(0);
    });

    it('should classify authorization errors', () => {
      const error = new Error('403 Forbidden - Permission denied');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.AUTHORIZATION);
      expect(classification.retryable).toBe(false);
      expect(classification.maxRetries).toBe(0);
    });

    it('should classify invalid input errors', () => {
      const error = new Error('400 Bad Request - Invalid argument');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.INVALID_INPUT);
      expect(classification.retryable).toBe(false);
      expect(classification.maxRetries).toBe(0);
    });

    it('should classify resource exhausted errors', () => {
      const error = new Error('503 Service Unavailable - Resource exhausted');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.RESOURCE_EXHAUSTED);
      expect(classification.retryable).toBe(true);
      expect(classification.maxRetries).toBe(3);
    });

    it('should classify agent errors', () => {
      const error = new Error('500 Internal Server Error');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.AGENT_ERROR);
      expect(classification.retryable).toBe(true);
      expect(classification.maxRetries).toBe(3);
    });

    it('should classify unknown errors', () => {
      const error = new Error('Some random error');
      const classification = errorHandler.classifyError(error);

      expect(classification.category).toBe(ErrorCategory.UNKNOWN);
      expect(classification.retryable).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle and classify errors', async () => {
      const error = new Error('Request timeout');
      const agentError = await errorHandler.handleError(
        error,
        'exec-123',
        'ARTEMIS',
        0
      );

      expect(agentError).toBeDefined();
      expect(agentError.executionId).toBe('exec-123');
      expect(agentError.agentId).toBe('ARTEMIS');
      expect(agentError.message).toBe('Request timeout');
      expect(agentError.retryCount).toBe(0);
    });

    it('should track retry count', async () => {
      const error = new Error('Network error');
      const agentError = await errorHandler.handleError(
        error,
        'exec-123',
        'ARTEMIS',
        2
      );

      expect(agentError.retryCount).toBe(2);
    });

    it('should set fallback agent if provided', async () => {
      const error = new Error('Agent failed');
      const agentError = await errorHandler.handleError(
        error,
        'exec-123',
        'ARTEMIS',
        0,
        'LOKI'
      );

      expect(agentError.fallbackAgent).toBe('LOKI');
    });

    it('should generate unique error codes', async () => {
      const error = new Error('Test error');
      const agentError1 = await errorHandler.handleError(error, 'exec-1', 'ARTEMIS', 0);
      const agentError2 = await errorHandler.handleError(error, 'exec-2', 'ARTEMIS', 0);

      expect(agentError1.code).not.toBe(agentError2.code);
    });
  });

  describe('retry delay calculation', () => {
    it('should calculate exponential backoff', () => {
      const delay0 = errorHandler.calculateRetryDelay(0, 2);
      const delay1 = errorHandler.calculateRetryDelay(1, 2);
      const delay2 = errorHandler.calculateRetryDelay(2, 2);

      expect(delay0).toBeLessThan(delay1);
      expect(delay1).toBeLessThan(delay2);
    });

    it('should cap maximum delay', () => {
      const delay = errorHandler.calculateRetryDelay(10, 2);
      // Should be capped at 32 seconds (32000ms)
      expect(delay).toBeLessThanOrEqual(35200); // Allow for jitter
    });

    it('should apply jitter to avoid thundering herd', () => {
      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(errorHandler.calculateRetryDelay(1, 2));
      }

      // Should have variation due to jitter
      const minDelay = Math.min(...delays);
      const maxDelay = Math.max(...delays);
      expect(maxDelay).toBeGreaterThan(minDelay);
    });

    it('should respect backoff multiplier', () => {
      const delay_2x = errorHandler.calculateRetryDelay(1, 2);
      const delay_3x = errorHandler.calculateRetryDelay(1, 3);

      // 3x multiplier should generally result in longer delays
      expect(delay_3x).toBeGreaterThan(delay_2x * 0.8); // Allow for jitter variance
    });
  });

  describe('retryability checks', () => {
    it('should identify retryable errors', async () => {
      const error = new Error('Timeout error');
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 0);

      expect(errorHandler.isRetryable(agentError)).toBe(true);
    });

    it('should identify non-retryable errors', async () => {
      const error = new Error('401 Unauthorized');
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 0);

      expect(errorHandler.isRetryable(agentError)).toBe(false);
    });

    it('should fail retryability if max retries exceeded', async () => {
      const error = new Error('Timeout error');
      // Max retries for timeout is 3
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 3);

      expect(errorHandler.isRetryable(agentError)).toBe(false);
    });
  });

  describe('error formatting', () => {
    it('should format error for display', async () => {
      const error = new Error('Test error message');
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 1);

      const formatted = errorHandler.formatErrorForDisplay(agentError);

      expect(formatted).toContain('UNKNOWN'); // Category
      expect(formatted).toContain('Test error message');
      expect(formatted).toContain('exec-123');
      expect(formatted).toContain('ARTEMIS');
      expect(formatted).toContain('1/');
    });
  });

  describe('recovery strategy', () => {
    it('should suggest retry for retryable errors', async () => {
      const error = new Error('Network timeout');
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 0);

      const context: any = {
        executionId: 'exec-123',
        agentId: 'ARTEMIS',
        currentPhase: 'executing',
      };

      const strategy = await errorHandler.getRecoveryStrategy(agentError, context);

      expect(strategy.type).toBe('retry');
      expect(strategy.configuration.delay).toBeDefined();
      expect(strategy.configuration.retryCount).toBe(1);
    });

    it('should suggest fallback when fallback agent available and retries exhausted', async () => {
      const error = new Error('Agent failed');
      const agentError = await errorHandler.handleError(
        error,
        'exec-123',
        'ARTEMIS',
        0,
        'LOKI'
      );

      // Exhaust retries
      agentError.retryCount = 999;

      const context: any = {
        executionId: 'exec-123',
        agentId: 'ARTEMIS',
        currentPhase: 'executing',
      };

      const strategy = await errorHandler.getRecoveryStrategy(agentError, context);

      expect(strategy.type).toBe('fallback');
    });

    it('should suggest cancel for non-retryable errors', async () => {
      const error = new Error('401 Unauthorized');
      const agentError = await errorHandler.handleError(error, 'exec-123', 'ARTEMIS', 0);

      const context: any = {
        executionId: 'exec-123',
        agentId: 'ARTEMIS',
        currentPhase: 'executing',
      };

      const strategy = await errorHandler.getRecoveryStrategy(agentError, context);

      expect(strategy.type).toBe('cancel');
    });
  });

  describe('error statistics', () => {
    it('should retrieve error statistics', async () => {
      const stats = await errorHandler.getErrorStats(24);

      expect(stats).toBeDefined();
      expect(stats.timeRange).toBe('Last 24 hours');
      expect(stats.totalErrors).toBeDefined();
    });

    it('should filter by agent ID', async () => {
      const stats = await errorHandler.getErrorStats(24, 'ARTEMIS');

      expect(stats).toBeDefined();
      expect(stats.timeRange).toContain('24');
    });
  });

  describe('error trends', () => {
    it('should retrieve error trends', async () => {
      const trends = await errorHandler.getErrorTrends('ARTEMIS');

      expect(trends).toBeDefined();
      expect(trends.agentId).toBe('ARTEMIS');
    });
  });
});
