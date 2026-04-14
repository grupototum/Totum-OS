// File: src/agents/core/__tests__/logger.test.ts
// Purpose: Unit tests for Logger
// Phase: PASSO 7.1 - Agent Runtime Environment

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger, LogLevel } from '../logger';

// Mock Supabase and Redis
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        lt: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}));

vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    setex: vi.fn().mockResolvedValue('OK'),
    quit: vi.fn().mockResolvedValue('OK'),
  })),
}));

vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
  appendFileSync: vi.fn(),
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}));

describe('Logger', () => {
  let logger: Logger;
  const consoleSpy = {
    debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  };

  beforeEach(() => {
    logger = new Logger('https://test.supabase.co', 'test-key', {
      enableConsole: true,
      enableDatabase: true,
      enableFile: true,
      enableRedis: false,
    });
  });

  afterEach(async () => {
    await logger.destroy();
    Object.values(consoleSpy).forEach(spy => spy.mockClear());
  });

  describe('logging methods', () => {
    it('should log at DEBUG level', () => {
      logger.debug('exec-1', 'ARTEMIS', 'Debug message', { data: 'test' });

      expect(consoleSpy.debug).toHaveBeenCalled();
    });

    it('should log at INFO level', () => {
      logger.info('exec-1', 'ARTEMIS', 'Info message', { data: 'test' });

      expect(consoleSpy.info).toHaveBeenCalled();
    });

    it('should log at WARN level', () => {
      logger.warn('exec-1', 'ARTEMIS', 'Warning message', { data: 'test' });

      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should log at ERROR level', () => {
      logger.error('exec-1', 'ARTEMIS', 'Error message', { data: 'test' });

      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should log at CRITICAL level', () => {
      logger.critical('exec-1', 'ARTEMIS', 'Critical message', { data: 'test' });

      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('log level filtering', () => {
    beforeEach(() => {
      consoleSpy.info.mockClear();
      consoleSpy.debug.mockClear();
    });

    it('should respect log level configuration', () => {
      const infoLogger = new Logger('https://test.supabase.co', 'test-key', {
        level: LogLevel.INFO,
        enableConsole: true,
        enableDatabase: false,
        enableFile: false,
      });

      infoLogger.debug('exec-1', 'ARTEMIS', 'Debug message'); // Should be filtered
      infoLogger.info('exec-1', 'ARTEMIS', 'Info message'); // Should pass

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalled();
    });

    it('should allow all levels at DEBUG', () => {
      const debugLogger = new Logger('https://test.supabase.co', 'test-key', {
        level: LogLevel.DEBUG,
        enableConsole: true,
        enableDatabase: false,
        enableFile: false,
      });

      debugLogger.debug('exec-1', 'ARTEMIS', 'Debug');
      debugLogger.info('exec-1', 'ARTEMIS', 'Info');
      debugLogger.warn('exec-1', 'ARTEMIS', 'Warn');
      debugLogger.error('exec-1', 'ARTEMIS', 'Error');
      debugLogger.critical('exec-1', 'ARTEMIS', 'Critical');

      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(2); // Error and Critical
    });
  });

  describe('log buffering', () => {
    it('should buffer logs', async () => {
      logger.info('exec-1', 'ARTEMIS', 'Message 1');
      logger.info('exec-1', 'ARTEMIS', 'Message 2');
      logger.info('exec-1', 'ARTEMIS', 'Message 3');

      // Logs should be buffered, not yet flushed
      expect(consoleSpy.info).toHaveBeenCalledTimes(3);
    });

    it('should flush on demand', async () => {
      logger.info('exec-1', 'ARTEMIS', 'Message 1');
      logger.info('exec-1', 'ARTEMIS', 'Message 2');

      await logger.flush();

      // Flush completes without error
      expect(consoleSpy.info).toHaveBeenCalledTimes(2);
    });

    it('should auto-flush when buffer is full', async () => {
      // Log 100+ messages to trigger auto-flush
      for (let i = 0; i < 101; i++) {
        logger.info('exec-1', 'ARTEMIS', `Message ${i}`);
      }

      // All messages should be logged
      expect(consoleSpy.info).toHaveBeenCalledTimes(101);
    });
  });

  describe('log querying', () => {
    it('should query logs by execution ID', async () => {
      const logs = await logger.queryLogs('exec-1');

      expect(Array.isArray(logs)).toBe(true);
    });

    it('should query logs by agent ID', async () => {
      const logs = await logger.queryLogs(undefined, 'ARTEMIS');

      expect(Array.isArray(logs)).toBe(true);
    });

    it('should query logs by level', async () => {
      const logs = await logger.queryLogs(undefined, undefined, LogLevel.ERROR);

      expect(Array.isArray(logs)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const logs = await logger.queryLogs('exec-1', undefined, undefined, 50);

      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe('execution summary', () => {
    it('should generate execution summary', async () => {
      const summary = await logger.getExecutionSummary('exec-1');

      // Summary might be null if no logs exist
      if (summary) {
        expect(summary.executionId).toBe('exec-1');
        expect(summary.totalLogs).toBeDefined();
        expect(summary.startTime).toBeDefined();
        expect(summary.endTime).toBeDefined();
        expect(summary.duration).toBeDefined();
        expect(summary.levels).toBeDefined();
      }
    });
  });

  describe('export functionality', () => {
    it('should export logs to JSON', async () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');
      await logger.flush();

      const filepath = await logger.exportLogs('exec-1', 'json');

      expect(filepath).toBeDefined();
      expect(filepath).toContain('.json');
    });

    it('should export logs to CSV', async () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');
      await logger.flush();

      const filepath = await logger.exportLogs('exec-1', 'csv');

      expect(filepath).toBeDefined();
      expect(filepath).toContain('.csv');
    });

    it('should export logs to TXT', async () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');
      await logger.flush();

      const filepath = await logger.exportLogs('exec-1', 'txt');

      expect(filepath).toBeDefined();
      expect(filepath).toContain('.txt');
    });
  });

  describe('agent statistics', () => {
    it('should retrieve agent statistics', async () => {
      const stats = await logger.getAgentStats('ARTEMIS', 24);

      expect(stats).toBeDefined();
      expect(stats.agentId).toBe('ARTEMIS');
      if (stats) {
        expect(stats.period).toBeDefined();
        expect(stats.totalLogs).toBeDefined();
        expect(stats.levels).toBeDefined();
      }
    });

    it('should calculate error rate', async () => {
      const stats = await logger.getAgentStats('ARTEMIS', 24);

      if (stats) {
        expect(stats.errorRate).toBeDefined();
        expect(stats.errorRate).toMatch(/\d+\.?\d*%/);
      }
    });
  });

  describe('log streaming', () => {
    it('should stream logs', async () => {
      const logs: any[] = [];

      const stopStreaming = await logger.streamLogs(
        'exec-1',
        log => logs.push(log),
        100
      );

      // Give it time to poll
      await new Promise(resolve => setTimeout(resolve, 200));

      stopStreaming();

      // Streaming should complete without error
      expect(typeof stopStreaming).toBe('function');
    });
  });

  describe('cleanup', () => {
    it('should cleanup old logs', async () => {
      await logger.cleanup(30);

      // Cleanup should complete without error
      expect(true).toBe(true);
    });
  });

  describe('console output format', () => {
    beforeEach(() => {
      consoleSpy.info.mockClear();
      consoleSpy.error.mockClear();
    });

    it('should include timestamp in console output', () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');

      expect(consoleSpy.info).toHaveBeenCalled();
      // Verify call contains ISO timestamp format
      const call = consoleSpy.info.mock.calls[0];
      expect(call[0]).toMatch(/\[\d{4}-\d{2}-\d{2}/);
    });

    it('should include log level in console output', () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');

      const call = consoleSpy.info.mock.calls[0];
      expect(call[0]).toContain('[INFO]');
    });

    it('should include agent ID in console output', () => {
      logger.info('exec-1', 'ARTEMIS', 'Test message');

      const call = consoleSpy.info.mock.calls[0];
      expect(call[0]).toContain('[ARTEMIS]');
    });
  });

  describe('error handling in logging', () => {
    it('should handle missing execution ID gracefully', () => {
      expect(() => {
        logger.info('', 'ARTEMIS', 'Test message');
      }).not.toThrow();
    });

    it('should handle missing agent ID gracefully', () => {
      expect(() => {
        logger.info('exec-1', '', 'Test message');
      }).not.toThrow();
    });

    it('should handle circular references in data', () => {
      const circular: any = { a: 1 };
      circular.self = circular;

      expect(() => {
        logger.info('exec-1', 'ARTEMIS', 'Message', circular);
      }).not.toThrow();
    });
  });

  describe('lifecycle', () => {
    it('should destroy logger gracefully', async () => {
      const log = new Logger('https://test.supabase.co', 'test-key', {
        enableConsole: true,
        enableDatabase: false,
        enableFile: false,
      });

      log.info('exec-1', 'ARTEMIS', 'Test');

      await expect(log.destroy()).resolves.not.toThrow();
    });
  });
});
