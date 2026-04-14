// File: src/agents/core/n8n-deployment-orchestrator.ts
// Purpose: Orchestrate deployment of all 20 workflows to n8n Cloud
// Phase: PASSO 7.3 - n8n Cloud Integration

import { N8nIntegration, WorkflowDeploymentConfig } from './n8n-integration';
import { N8nWorkflowBuilder, WorkflowDefinition } from './n8n-workflow-builder';
import { Logger } from './logger';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  definition: WorkflowDefinition;
  config: WorkflowDeploymentConfig;
  active: boolean;
}

interface DeploymentResult {
  workflowId: string;
  name: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  deploymentTime?: number;
}

interface DeploymentSummary {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  results: DeploymentResult[];
  totalTime: number;
}

class N8nDeploymentOrchestrator {
  private n8nClient: N8nIntegration;
  private logger: Logger;
  private deploymentHistory: Map<string, DeploymentResult>;

  constructor(n8nClient: N8nIntegration, logger: Logger) {
    this.n8nClient = n8nClient;
    this.logger = logger;
    this.deploymentHistory = new Map();
  }

  /**
   * Deploy all workflows
   */
  async deployAllWorkflows(workflows: WorkflowTemplate[]): Promise<DeploymentSummary> {
    const startTime = Date.now();
    const results: DeploymentResult[] = [];

    this.logger.info('orchestrator', 'DEPLOYMENT', `Starting deployment of ${workflows.length} workflows`);

    for (const workflow of workflows) {
      if (!workflow.active) {
        results.push({
          workflowId: workflow.id,
          name: workflow.name,
          status: 'skipped',
        });
        continue;
      }

      const result = await this.deployWorkflow(workflow);
      results.push(result);
    }

    const summary = this.createDeploymentSummary(results, Date.now() - startTime);

    this.logger.info('orchestrator', 'DEPLOYMENT', 'Deployment completed', {
      summary: {
        total: summary.total,
        successful: summary.successful,
        failed: summary.failed,
        skipped: summary.skipped,
        totalTime: summary.totalTime,
      },
    });

    return summary;
  }

  /**
   * Deploy a single workflow
   */
  private async deployWorkflow(workflow: WorkflowTemplate): Promise<DeploymentResult> {
    const startTime = Date.now();

    try {
      this.logger.info('orchestrator', 'DEPLOYMENT', `Deploying: ${workflow.name}`);

      // Build workflow from definition
      const builtWorkflow = N8nWorkflowBuilder.fromDefinition(workflow.definition);

      // Deploy to n8n
      const workflowId = await this.n8nClient.deployWorkflow(
        workflow.name,
        builtWorkflow,
        workflow.config
      );

      // Validate deployment
      const deployed = await this.n8nClient.getWorkflow(workflowId);
      if (!deployed) {
        throw new Error('Deployment validation failed');
      }

      const result: DeploymentResult = {
        workflowId,
        name: workflow.name,
        status: 'success',
        deploymentTime: Date.now() - startTime,
      };

      this.deploymentHistory.set(workflowId, result);

      return result;
    } catch (error) {
      const result: DeploymentResult = {
        workflowId: workflow.id,
        name: workflow.name,
        status: 'failed',
        error: (error as Error).message,
        deploymentTime: Date.now() - startTime,
      };

      this.deploymentHistory.set(workflow.id, result);

      this.logger.error(
        'orchestrator',
        'DEPLOYMENT',
        `Failed to deploy: ${workflow.name}`,
        { error: result.error }
      );

      return result;
    }
  }

  /**
   * Validate all deployments
   */
  async validateDeployments(workflowIds: string[]): Promise<Map<string, boolean>> {
    const validations = new Map<string, boolean>();

    this.logger.info('orchestrator', 'VALIDATION', `Validating ${workflowIds.length} workflows`);

    for (const workflowId of workflowIds) {
      try {
        const workflow = await this.n8nClient.getWorkflow(workflowId);
        const isValid = workflow !== null && workflow.active;
        validations.set(workflowId, isValid);

        if (!isValid) {
          this.logger.warn('orchestrator', 'VALIDATION', `Validation failed: ${workflowId}`);
        }
      } catch (error) {
        validations.set(workflowId, false);
        this.logger.error('orchestrator', 'VALIDATION', `Validation error: ${workflowId}`, {
          error: (error as Error).message,
        });
      }
    }

    return validations;
  }

  /**
   * Test workflow executions
   */
  async testWorkflowExecutions(
    workflows: Map<string, string>, // workflowId -> inputData
    timeout: number = 60000
  ): Promise<Map<string, { success: boolean; executionTime: number; error?: string }>> {
    const testResults = new Map<
      string,
      { success: boolean; executionTime: number; error?: string }
    >();

    this.logger.info('orchestrator', 'TESTING', `Testing ${workflows.size} workflows`);

    for (const [workflowId, inputData] of workflows.entries()) {
      const startTime = Date.now();

      try {
        const execution = await this.n8nClient.executeWorkflow(
          'test-execution',
          workflowId,
          typeof inputData === 'string' ? JSON.parse(inputData) : inputData
        );

        const completed = await this.n8nClient.waitForExecution(
          workflowId,
          execution.id,
          timeout
        );

        const result = {
          success: completed.status === 'success',
          executionTime: Date.now() - startTime,
        };

        if (completed.status === 'error') {
          result.error = completed.error;
        }

        testResults.set(workflowId, result);

        this.logger.info('orchestrator', 'TESTING', `Test completed: ${workflowId}`, {
          status: completed.status,
          executionTime: result.executionTime,
        });
      } catch (error) {
        testResults.set(workflowId, {
          success: false,
          executionTime: Date.now() - startTime,
          error: (error as Error).message,
        });

        this.logger.error('orchestrator', 'TESTING', `Test failed: ${workflowId}`, {
          error: (error as Error).message,
        });
      }
    }

    return testResults;
  }

  /**
   * Rollback deployments
   */
  async rollbackDeployments(workflowIds: string[]): Promise<Map<string, boolean>> {
    const rollbackResults = new Map<string, boolean>();

    this.logger.warn('orchestrator', 'ROLLBACK', `Rolling back ${workflowIds.length} workflows`);

    for (const workflowId of workflowIds) {
      try {
        await this.n8nClient.deactivateWorkflow(workflowId);
        rollbackResults.set(workflowId, true);

        this.logger.info('orchestrator', 'ROLLBACK', `Rollback successful: ${workflowId}`);
      } catch (error) {
        rollbackResults.set(workflowId, false);

        this.logger.error('orchestrator', 'ROLLBACK', `Rollback failed: ${workflowId}`, {
          error: (error as Error).message,
        });
      }
    }

    return rollbackResults;
  }

  /**
   * Monitor workflow health
   */
  async monitorWorkflowHealth(
    workflowIds: string[],
    options: { sampleSize?: number; timeWindow?: number } = {}
  ): Promise<
    Map<
      string,
      {
        successRate: number;
        averageExecutionTime: number;
        lastExecutionStatus: string;
      }
    >
  > {
    const healthMetrics = new Map<
      string,
      {
        successRate: number;
        averageExecutionTime: number;
        lastExecutionStatus: string;
      }
    >();

    const sampleSize = options.sampleSize || 10;

    for (const workflowId of workflowIds) {
      try {
        const executions = await this.n8nClient.getExecutionHistory(workflowId, {
          take: sampleSize,
        });

        const successful = executions.filter((e: any) => e.status === 'success').length;
        const successRate = (successful / executions.length) * 100;

        const totalTime = executions.reduce((sum: number, e: any) => {
          const start = new Date(e.startTime).getTime();
          const end = e.endTime ? new Date(e.endTime).getTime() : start;
          return sum + (end - start);
        }, 0);

        const averageExecutionTime = executions.length > 0 ? totalTime / executions.length : 0;
        const lastExecution = executions[0];

        healthMetrics.set(workflowId, {
          successRate,
          averageExecutionTime,
          lastExecutionStatus: lastExecution?.status || 'unknown',
        });
      } catch (error) {
        this.logger.error('orchestrator', 'MONITORING', `Failed to monitor: ${workflowId}`, {
          error: (error as Error).message,
        });
      }
    }

    return healthMetrics;
  }

  /**
   * Export deployment report
   */
  generateDeploymentReport(summary: DeploymentSummary): string {
    const report = `
# n8n Deployment Report

## Summary
- Total Workflows: ${summary.total}
- Successful: ${summary.successful}
- Failed: ${summary.failed}
- Skipped: ${summary.skipped}
- Total Time: ${(summary.totalTime / 1000).toFixed(2)}s

## Results
${summary.results
  .map(
    r =>
      `- ${r.name} (${r.workflowId}): ${r.status}${r.error ? ` - ${r.error}` : ''}${r.deploymentTime ? ` - ${r.deploymentTime}ms` : ''}`
  )
  .join('\n')}

## Status
${summary.failed > 0 ? '⚠️ Some workflows failed during deployment' : '✅ All workflows deployed successfully'}
    `;

    return report;
  }

  // Private helper methods

  private createDeploymentSummary(
    results: DeploymentResult[],
    totalTime: number
  ): DeploymentSummary {
    return {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      results,
      totalTime,
    };
  }
}

export {
  N8nDeploymentOrchestrator,
  WorkflowTemplate,
  DeploymentResult,
  DeploymentSummary,
};
