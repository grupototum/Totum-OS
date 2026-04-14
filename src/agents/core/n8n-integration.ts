// File: src/agents/core/n8n-integration.ts
// Purpose: Integration layer for n8n Cloud workflow deployment and orchestration
// Phase: PASSO 7.3 - n8n Cloud Integration

import axios, { AxiosInstance } from 'axios';
import { Logger } from './logger';
import { ContextManager } from './context-manager';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, N8nConnection[]>;
  settings?: Record<string, any>;
}

interface N8nNode {
  id: string;
  name: string;
  type: 'n8n-nodes-base.http' | 'n8n-nodes-base.if' | 'n8n-nodes-base.slack' | 'n8n-nodes-base.postgres' | string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

interface N8nConnection {
  node: string;
  type: 'main' | 'error' | 'success';
  index?: number;
}

interface N8nExecution {
  id: string;
  workflowId: string;
  status: 'new' | 'running' | 'success' | 'error' | 'unknown';
  startTime: Date;
  endTime?: Date;
  data: any;
  error?: string;
}

interface WorkflowDeploymentConfig {
  webhookPath?: string;
  cronSchedule?: string;
  credentials: Record<string, string>;
  timeout?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

class N8nIntegration {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private logger: Logger;
  private contextManager: ContextManager;
  private workflowCache: Map<string, N8nWorkflow>;
  private executionCache: Map<string, N8nExecution>;
  private credentialMap: Map<string, string>; // Maps credential names to n8n credential IDs

  constructor(
    baseUrl: string,
    apiKey: string,
    logger: Logger,
    contextManager: ContextManager
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
    this.logger = logger;
    this.contextManager = contextManager;
    this.workflowCache = new Map();
    this.executionCache = new Map();
    this.credentialMap = new Map();

    // Initialize axios client
    this.client = axios.create({
      baseURL: `${this.baseUrl}/api/v1`,
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Deploy a workflow to n8n Cloud
   */
  async deployWorkflow(
    workflowName: string,
    workflow: N8nWorkflow,
    config: WorkflowDeploymentConfig
  ): Promise<string> {
    try {
      // Prepare workflow for deployment
      const deploymentPayload = {
        name: workflowName,
        nodes: workflow.nodes,
        connections: workflow.connections,
        active: true,
        settings: {
          ...workflow.settings,
          ...config,
        },
      };

      // Create or update workflow
      const response = await this.client.post('/workflows', deploymentPayload);
      const workflowId = response.data.id;

      // Cache the workflow
      this.workflowCache.set(workflowId, {
        ...workflow,
        id: workflowId,
        name: workflowName,
      });

      // Setup webhook if specified
      if (config.webhookPath) {
        await this.setupWebhookTrigger(workflowId, config.webhookPath);
      }

      // Setup cron schedule if specified
      if (config.cronSchedule) {
        await this.setupCronTrigger(workflowId, config.cronSchedule);
      }

      this.logger.info('n8n-integration', 'N8N_DEPLOYMENT', `Workflow deployed: ${workflowName}`, {
        workflowId,
        webhookPath: config.webhookPath,
        cronSchedule: config.cronSchedule,
      });

      return workflowId;
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N_DEPLOYMENT', `Failed to deploy workflow: ${workflowName}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Trigger workflow execution
   */
  async executeWorkflow(
    executionId: string,
    workflowId: string,
    inputData: Record<string, any> = {}
  ): Promise<N8nExecution> {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        data: inputData,
      });

      const execution: N8nExecution = {
        id: response.data.execution_id,
        workflowId,
        status: 'running',
        startTime: new Date(),
        data: response.data,
      };

      // Cache execution
      this.executionCache.set(execution.id, execution);

      // Store in context
      await this.contextManager.setMemory(executionId, `n8n_execution_${execution.id}`, execution);

      this.logger.info(executionId, 'N8N', `Workflow triggered: ${workflowId}`, {
        n8nExecutionId: execution.id,
      });

      return execution;
    } catch (error) {
      this.logger.error(executionId, 'N8N', `Failed to execute workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Get execution status
   */
  async getExecutionStatus(workflowId: string, executionId: string): Promise<N8nExecution> {
    try {
      // Check cache first
      const cached = this.executionCache.get(executionId);
      if (cached && Date.now() - cached.startTime.getTime() < 60000) {
        // Cache valid for 1 minute
        return cached;
      }

      const response = await this.client.get(`/workflows/${workflowId}/executions/${executionId}`);

      const execution: N8nExecution = {
        id: executionId,
        workflowId,
        status: response.data.status || 'unknown',
        startTime: new Date(response.data.startTime),
        endTime: response.data.endTime ? new Date(response.data.endTime) : undefined,
        data: response.data.data || {},
        error: response.data.error,
      };

      this.executionCache.set(executionId, execution);

      return execution;
    } catch (error) {
      this.logger.error(
        'n8n-integration',
        'N8N',
        `Failed to get execution status: ${executionId}`,
        {
          error: (error as Error).message,
        }
      );
      throw error;
    }
  }

  /**
   * Wait for workflow execution to complete
   */
  async waitForExecution(
    workflowId: string,
    executionId: string,
    timeoutMs: number = 60000,
    pollIntervalMs: number = 1000
  ): Promise<N8nExecution> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const execution = await this.getExecutionStatus(workflowId, executionId);

      if (execution.status === 'success' || execution.status === 'error') {
        return execution;
      }

      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(`Workflow execution timeout after ${timeoutMs}ms`);
  }

  /**
   * List all workflows
   */
  async listWorkflows(options: { skip?: number; take?: number } = {}): Promise<any[]> {
    try {
      const response = await this.client.get('/workflows', {
        params: {
          skip: options.skip || 0,
          take: options.take || 100,
        },
      });

      return response.data.data || [];
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', 'Failed to list workflows', {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Get workflow details
   */
  async getWorkflow(workflowId: string): Promise<N8nWorkflow | null> {
    try {
      // Check cache
      if (this.workflowCache.has(workflowId)) {
        return this.workflowCache.get(workflowId) || null;
      }

      const response = await this.client.get(`/workflows/${workflowId}`);

      const workflow: N8nWorkflow = {
        id: response.data.id,
        name: response.data.name,
        active: response.data.active,
        nodes: response.data.nodes,
        connections: response.data.connections,
        settings: response.data.settings,
      };

      this.workflowCache.set(workflowId, workflow);

      return workflow;
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', `Failed to get workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      return null;
    }
  }

  /**
   * Update workflow
   */
  async updateWorkflow(workflowId: string, updates: Partial<N8nWorkflow>): Promise<void> {
    try {
      await this.client.patch(`/workflows/${workflowId}`, {
        name: updates.name,
        nodes: updates.nodes,
        connections: updates.connections,
        active: updates.active,
      });

      // Invalidate cache
      this.workflowCache.delete(workflowId);

      this.logger.info('n8n-integration', 'N8N', `Workflow updated: ${workflowId}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', `Failed to update workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Activate workflow
   */
  async activateWorkflow(workflowId: string): Promise<void> {
    try {
      await this.client.patch(`/workflows/${workflowId}`, { active: true });
      this.workflowCache.delete(workflowId);
      this.logger.info('n8n-integration', 'N8N', `Workflow activated: ${workflowId}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', `Failed to activate workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Deactivate workflow
   */
  async deactivateWorkflow(workflowId: string): Promise<void> {
    try {
      await this.client.patch(`/workflows/${workflowId}`, { active: false });
      this.workflowCache.delete(workflowId);
      this.logger.info('n8n-integration', 'N8N', `Workflow deactivated: ${workflowId}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', `Failed to deactivate workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: string): Promise<void> {
    try {
      await this.client.delete(`/workflows/${workflowId}`);
      this.workflowCache.delete(workflowId);
      this.logger.info('n8n-integration', 'N8N', `Workflow deleted: ${workflowId}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N', `Failed to delete workflow: ${workflowId}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Get execution history
   */
  async getExecutionHistory(
    workflowId: string,
    options: { skip?: number; take?: number; status?: string } = {}
  ): Promise<any[]> {
    try {
      const params: any = {
        skip: options.skip || 0,
        take: options.take || 50,
      };

      if (options.status) {
        params.status = options.status;
      }

      const response = await this.client.get(`/workflows/${workflowId}/executions`, { params });

      return response.data.data || [];
    } catch (error) {
      this.logger.error(
        'n8n-integration',
        'N8N',
        `Failed to get execution history for: ${workflowId}`,
        {
          error: (error as Error).message,
        }
      );
      throw error;
    }
  }

  /**
   * Get execution logs
   */
  async getExecutionLogs(workflowId: string, executionId: string): Promise<any[]> {
    try {
      const response = await this.client.get(
        `/workflows/${workflowId}/executions/${executionId}/logs`
      );

      return response.data.logs || [];
    } catch (error) {
      this.logger.error(
        'n8n-integration',
        'N8N',
        `Failed to get execution logs: ${executionId}`,
        {
          error: (error as Error).message,
        }
      );
      return [];
    }
  }

  /**
   * Setup credentials
   */
  async setupCredential(
    name: string,
    type: string,
    data: Record<string, any>
  ): Promise<string> {
    try {
      const response = await this.client.post('/credentials', {
        name,
        type,
        data,
      });

      const credentialId = response.data.id;
      this.credentialMap.set(name, credentialId);

      this.logger.info('n8n-integration', 'N8N_CREDENTIALS', `Credential set up: ${name}`, {
        type,
        credentialId,
      });

      return credentialId;
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N_CREDENTIALS', `Failed to setup credential: ${name}`, {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Get credential ID by name
   */
  getCredentialId(name: string): string | null {
    return this.credentialMap.get(name) || null;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N_HEALTH', 'Health check failed', {
        error: (error as Error).message,
      });
      return false;
    }
  }

  // Private helper methods

  private async setupWebhookTrigger(workflowId: string, webhookPath: string): Promise<void> {
    try {
      await this.client.post(`/workflows/${workflowId}/webhooks`, {
        path: webhookPath,
        method: 'POST',
      });

      this.logger.info('n8n-integration', 'N8N_WEBHOOKS', `Webhook setup: ${webhookPath}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N_WEBHOOKS', 'Failed to setup webhook', {
        error: (error as Error).message,
      });
    }
  }

  private async setupCronTrigger(workflowId: string, cronSchedule: string): Promise<void> {
    try {
      await this.client.post(`/workflows/${workflowId}/crons`, {
        schedule: cronSchedule,
      });

      this.logger.info('n8n-integration', 'N8N_CRONS', `Cron trigger setup: ${cronSchedule}`);
    } catch (error) {
      this.logger.error('n8n-integration', 'N8N_CRONS', 'Failed to setup cron trigger', {
        error: (error as Error).message,
      });
    }
  }
}

export {
  N8nIntegration,
  N8nWorkflow,
  N8nNode,
  N8nConnection,
  N8nExecution,
  WorkflowDeploymentConfig,
};
