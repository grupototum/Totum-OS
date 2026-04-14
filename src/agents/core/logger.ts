// File: src/agents/core/logger.ts
// Purpose: Comprehensive logging system for agent execution, monitoring, and debugging
// Phase: PASSO 7.1 - Agent Runtime Environment

import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  executionId: string;
  agentId: string;
  message: string;
  data?: Record<string, any>;
  source?: string;
  metadata?: Record<string, any>;
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableDatabase: boolean;
  enableFile: boolean;
  enableRedis: boolean;
  filePath?: string;
  redisTTL?: number;
}

class Logger {
  private supabase: any;
  private redis: Redis | null;
  private config: LogConfig;
  private logBuffer: LogEntry[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds
  private flushTimer: NodeJS.Timeout | null = null;
  private logFilePath: string;
  private logLevelPriority: Map<LogLevel, number>;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    config: Partial<LogConfig> = {},
    redisUrl?: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.redis = redisUrl ? new Redis(redisUrl) : null;

    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableDatabase: true,
      enableFile: true,
      enableRedis: !!redisUrl,
      filePath: process.env.LOG_FILE_PATH || './logs/agent-execution.log',
      redisTTL: 86400, // 24 hours
      ...config,
    };

    this.logFilePath = this.config.filePath || './logs/agent-execution.log';
    this.ensureLogDirectory();

    this.logLevelPriority = new Map([
      [LogLevel.DEBUG, 1],
      [LogLevel.INFO, 2],
      [LogLevel.WARN, 3],
      [LogLevel.ERROR, 4],
      [LogLevel.CRITICAL, 5],
    ]);

    this.startAutoFlush();
  }

  /**
   * Log at DEBUG level
   */
  debug(executionId: string, agentId: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, executionId, agentId, message, data);
  }

  /**
   * Log at INFO level
   */
  info(executionId: string, agentId: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.INFO, executionId, agentId, message, data);
  }

  /**
   * Log at WARN level
   */
  warn(executionId: string, agentId: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.WARN, executionId, agentId, message, data);
  }

  /**
   * Log at ERROR level
   */
  error(executionId: string, agentId: string, message: string, data?: Record<string, any>): void {
    this.log(LogLevel.ERROR, executionId, agentId, message, data);
  }

  /**
   * Log at CRITICAL level
   */
  critical(
    executionId: string,
    agentId: string,
    message: string,
    data?: Record<string, any>
  ): void {
    this.log(LogLevel.CRITICAL, executionId, agentId, message, data);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    executionId: string,
    agentId: string,
    message: string,
    data?: Record<string, any>
  ): void {
    // Check log level
    if (
      (this.logLevelPriority.get(level) || 0) <
      (this.logLevelPriority.get(this.config.level) || 0)
    ) {
      return;
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      executionId,
      agentId,
      message,
      data,
      source: 'agent-executor',
      metadata: {
        hostname: process.env.HOSTNAME || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      },
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Console output
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Flush if buffer is full
    if (this.logBuffer.length >= this.BUFFER_SIZE) {
      this.flush();
    }
  }

  /**
   * Flush buffered logs to all destinations
   */
  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logs = [...this.logBuffer];
    this.logBuffer = [];

    // Write to database
    if (this.config.enableDatabase) {
      await this.writeToDatabase(logs);
    }

    // Write to file
    if (this.config.enableFile) {
      await this.writeToFile(logs);
    }

    // Write to Redis
    if (this.config.enableRedis && this.redis) {
      await this.writeToRedis(logs);
    }
  }

  /**
   * Query logs with filters
   */
  async queryLogs(
    executionId?: string,
    agentId?: string,
    level?: LogLevel,
    limit: number = 100
  ): Promise<LogEntry[]> {
    try {
      let query = this.supabase.from('agent_logs').select('*');

      if (executionId) {
        query = query.eq('execution_id', executionId);
      }
      if (agentId) {
        query = query.eq('agent_id', agentId);
      }
      if (level) {
        query = query.eq('level', level);
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to query logs:', error);
        return [];
      }

      return (data || []).map(log => ({
        level: log.level as LogLevel,
        timestamp: new Date(log.timestamp),
        executionId: log.execution_id,
        agentId: log.agent_id,
        message: log.message,
        data: JSON.parse(log.data || '{}'),
        source: log.source,
        metadata: JSON.parse(log.metadata || '{}'),
      }));
    } catch (error) {
      console.error('Error querying logs:', error);
      return [];
    }
  }

  /**
   * Get execution log summary
   */
  async getExecutionSummary(executionId: string): Promise<any> {
    try {
      const logs = await this.queryLogs(executionId, undefined, undefined, 1000);

      if (logs.length === 0) {
        return null;
      }

      const levelCounts = {
        DEBUG: 0,
        INFO: 0,
        WARN: 0,
        ERROR: 0,
        CRITICAL: 0,
      };

      const agents = new Set<string>();
      let firstLog = logs[logs.length - 1];
      let lastLog = logs[0];

      logs.forEach(log => {
        levelCounts[log.level]++;
        agents.add(log.agentId);
      });

      return {
        executionId,
        totalLogs: logs.length,
        startTime: firstLog.timestamp,
        endTime: lastLog.timestamp,
        duration: lastLog.timestamp.getTime() - firstLog.timestamp.getTime(),
        levels: levelCounts,
        agents: Array.from(agents),
        hasErrors: levelCounts.ERROR > 0,
        hasCritical: levelCounts.CRITICAL > 0,
      };
    } catch (error) {
      console.error('Failed to get execution summary:', error);
      return null;
    }
  }

  /**
   * Export logs to file
   */
  async exportLogs(
    executionId: string,
    format: 'json' | 'csv' | 'txt' = 'json'
  ): Promise<string> {
    try {
      const logs = await this.queryLogs(executionId, undefined, undefined, 10000);

      const filename = `logs-${executionId}-${Date.now()}.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt'}`;
      const filepath = path.join(this.logFilePath, '..', filename);

      switch (format) {
        case 'json':
          fs.writeFileSync(filepath, JSON.stringify(logs, null, 2));
          break;
        case 'csv':
          const csv = this.logsToCSV(logs);
          fs.writeFileSync(filepath, csv);
          break;
        case 'txt':
          const txt = this.logsToText(logs);
          fs.writeFileSync(filepath, txt);
          break;
      }

      return filepath;
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }

  /**
   * Get agent-specific log statistics
   */
  async getAgentStats(agentId: string, hours: number = 24): Promise<any> {
    try {
      const fromTime = new Date(Date.now() - hours * 60 * 60 * 1000);

      const logs = await this.supabase
        .from('agent_logs')
        .select('*')
        .eq('agent_id', agentId)
        .gte('timestamp', fromTime.toISOString())
        .order('timestamp', { ascending: true });

      if (!logs.data) {
        return null;
      }

      const data = logs.data;
      const levelCounts = { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0, CRITICAL: 0 };

      data.forEach((log: any) => {
        levelCounts[log.level as keyof typeof levelCounts]++;
      });

      const executionIds = new Set(data.map((log: any) => log.execution_id));

      return {
        agentId,
        period: `Last ${hours} hours`,
        totalLogs: data.length,
        levels: levelCounts,
        executionCount: executionIds.size,
        firstLog: data[0]?.timestamp,
        lastLog: data[data.length - 1]?.timestamp,
        errorRate: levelCounts.ERROR > 0 ? ((levelCounts.ERROR / data.length) * 100).toFixed(2) + '%' : '0%',
      };
    } catch (error) {
      console.error('Failed to get agent stats:', error);
      return null;
    }
  }

  /**
   * Stream logs for real-time monitoring
   */
  async streamLogs(
    executionId: string,
    onLog: (entry: LogEntry) => void,
    pollInterval: number = 1000
  ): Promise<() => void> {
    let lastTimestamp = new Date();
    let isStreaming = true;

    const poll = async () => {
      if (!isStreaming) return;

      try {
        const { data, error } = await this.supabase
          .from('agent_logs')
          .select('*')
          .eq('execution_id', executionId)
          .gt('timestamp', lastTimestamp.toISOString())
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Stream error:', error);
        } else if (data && data.length > 0) {
          data.forEach((log: any) => {
            lastTimestamp = new Date(log.timestamp);
            onLog({
              level: log.level as LogLevel,
              timestamp: new Date(log.timestamp),
              executionId: log.execution_id,
              agentId: log.agent_id,
              message: log.message,
              data: JSON.parse(log.data || '{}'),
              source: log.source,
              metadata: JSON.parse(log.metadata || '{}'),
            });
          });
        }
      } catch (error) {
        console.error('Stream poll error:', error);
      }

      if (isStreaming) {
        setTimeout(poll, pollInterval);
      }
    };

    poll();

    // Return function to stop streaming
    return () => {
      isStreaming = false;
    };
  }

  /**
   * Cleanup old logs
   */
  async cleanup(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

      const { error } = await this.supabase
        .from('agent_logs')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup logs:', error);
      } else {
        console.log(`Cleaned up logs older than ${daysToKeep} days`);
      }
    } catch (error) {
      console.error('Error during log cleanup:', error);
    }
  }

  /**
   * Destroy logger and cleanup resources
   */
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
    if (this.redis) {
      await this.redis.quit();
    }
  }

  // Private helper methods

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level}] [${entry.agentId}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.CRITICAL:
        console.error('❌ CRITICAL:', prefix, entry.message, entry.data || '');
        break;
    }
  }

  private async writeToDatabase(logs: LogEntry[]): Promise<void> {
    try {
      const entries = logs.map(log => ({
        level: log.level,
        timestamp: log.timestamp.toISOString(),
        execution_id: log.executionId,
        agent_id: log.agentId,
        message: log.message,
        data: JSON.stringify(log.data || {}),
        source: log.source,
        metadata: JSON.stringify(log.metadata || {}),
      }));

      const { error } = await this.supabase.from('agent_logs').insert(entries);

      if (error) {
        console.error('Failed to write logs to database:', error);
      }
    } catch (error) {
      console.error('Error writing logs to database:', error);
    }
  }

  private async writeToFile(logs: LogEntry[]): Promise<void> {
    try {
      const lines = logs.map(
        log =>
          `${log.timestamp.toISOString()} [${log.level}] [${log.executionId}] [${log.agentId}] ${log.message}${log.data ? ' ' + JSON.stringify(log.data) : ''}`
      );

      fs.appendFileSync(this.logFilePath, lines.join('\n') + '\n');
    } catch (error) {
      console.error('Error writing logs to file:', error);
    }
  }

  private async writeToRedis(logs: LogEntry[]): Promise<void> {
    if (!this.redis) return;

    try {
      for (const log of logs) {
        const key = `logs:${log.executionId}:${Date.now()}`;
        await this.redis.setex(
          key,
          this.config.redisTTL || 86400,
          JSON.stringify({
            level: log.level,
            timestamp: log.timestamp.toISOString(),
            message: log.message,
            agentId: log.agentId,
          })
        );
      }
    } catch (error) {
      console.error('Error writing logs to Redis:', error);
    }
  }

  private ensureLogDirectory(): void {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush().catch(error => console.error('Auto-flush error:', error));
    }, this.FLUSH_INTERVAL);
  }

  private logsToCSV(logs: LogEntry[]): string {
    const headers = ['Timestamp', 'Level', 'ExecutionId', 'AgentId', 'Message', 'Data'];
    const rows = logs.map(log =>
      [
        log.timestamp.toISOString(),
        log.level,
        log.executionId,
        log.agentId,
        `"${log.message}"`,
        `"${JSON.stringify(log.data || {})}"`,
      ].join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  private logsToText(logs: LogEntry[]): string {
    return logs
      .map(
        log =>
          `[${log.timestamp.toISOString()}] [${log.level}] [${log.executionId}] [${log.agentId}]\n${log.message}${log.data ? '\nData: ' + JSON.stringify(log.data, null, 2) : ''}\n`
      )
      .join('\n' + '='.repeat(80) + '\n');
  }
}

export { Logger, LogEntry, LogLevel, LogConfig };
