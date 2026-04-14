/**
 * Workflow Engine Service
 * Orchestrates multi-agent workflows
 */

import { v4 as uuidv4 } from "uuid";
import { AgentExecutorService } from "./agent-executor-service";
import {
  AgentExecutionRequest,
  AgentExecutionResponse,
} from "./agent-executor-types";

export interface WorkflowNode {
  id: string;
  type: "agent" | "conditional" | "parallel" | "action";
  config: any;
  input?: any;
  output?: any;
  status?: "pending" | "running" | "success" | "failed";
}

export interface Workflow {
  id: string;
  name: string;
  trigger: {
    type: "webhook" | "cron" | "manual";
    config: any;
  };
  nodes: WorkflowNode[];
  output?: any;
}

export interface WorkflowExecution {
  execution_id: string;
  workflow_id: string;
  status: "pending" | "running" | "success" | "failed";
  started_at: string;
  completed_at?: string;
  nodes_executed: Map<string, any>;
  duration_ms?: number;
  error?: any;
}

export class WorkflowEngine {
  private agentExecutor: AgentExecutorService;
  private workflows: Map<string, Workflow>;
  private executions: Map<string, WorkflowExecution>;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor(
    agentExecutor: AgentExecutorService,
    config: {
      supabaseUrl: string;
      supabaseKey: string;
    }
  ) {
    this.agentExecutor = agentExecutor;
    this.workflows = new Map();
    this.executions = new Map();
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
  }

  /**
   * Register a workflow
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflowId: string,
    input: Record<string, any>
  ): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const executionId = uuidv4();
    const execution: WorkflowExecution = {
      execution_id: executionId,
      workflow_id: workflowId,
      status: "running",
      started_at: new Date().toISOString(),
      nodes_executed: new Map(),
    };

    this.executions.set(executionId, execution);

    try {
      // Execute nodes sequentially
      const context = { input, output: {} };

      for (const node of workflow.nodes) {
        try {
          const result = await this.executeNode(node, context, execution);
          context.output[node.id] = result;
          execution.nodes_executed.set(node.id, {
            status: "success",
            output: result,
          });
        } catch (error) {
          execution.nodes_executed.set(node.id, {
            status: "failed",
            error: error,
          });

          // Check if we should continue on error
          if (node.config?.continueOnError !== true) {
            throw error;
          }
        }
      }

      execution.status = "success";
      execution.completed_at = new Date().toISOString();
      execution.duration_ms =
        new Date(execution.completed_at).getTime() -
        new Date(execution.started_at).getTime();

      // Log workflow execution
      await this.logWorkflowExecution(execution, context.output);

      return execution;
    } catch (error) {
      execution.status = "failed";
      execution.completed_at = new Date().toISOString();
      execution.duration_ms =
        new Date(execution.completed_at).getTime() -
        new Date(execution.started_at).getTime();
      execution.error = error;

      // Log error
      await this.logWorkflowExecution(execution, null);

      throw error;
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    node.status = "running";

    switch (node.type) {
      case "agent":
        return await this.executeAgentNode(node, context, execution);

      case "conditional":
        return await this.executeConditionalNode(node, context, execution);

      case "parallel":
        return await this.executeParallelNode(node, context, execution);

      case "action":
        return await this.executeActionNode(node, context, execution);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Execute agent node
   */
  private async executeAgentNode(
    node: WorkflowNode,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    const { agentId, input: inputTemplate } = node.config;

    // Resolve input template with context
    const input = this.resolveTemplate(inputTemplate, context);

    const request: AgentExecutionRequest = {
      agentId,
      message: input.message,
      context: {
        ...input.context,
        workflow_id: execution.workflow_id,
        execution_id: execution.execution_id,
        node_id: node.id,
      },
      metadata: {
        workflow_id: execution.workflow_id,
        node_id: node.id,
      },
    };

    const response = await this.agentExecutor.execute(request);
    return response;
  }

  /**
   * Execute conditional node
   */
  private async executeConditionalNode(
    node: WorkflowNode,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    const { condition, trueBranch, falseBranch } = node.config;

    // Evaluate condition
    const conditionMet = this.evaluateCondition(condition, context);

    const branch = conditionMet ? trueBranch : falseBranch;

    // Execute branch nodes
    for (const branchNode of branch || []) {
      const result = await this.executeNode(branchNode, context, execution);
      context.output[branchNode.id] = result;
    }

    return { condition_met: conditionMet };
  }

  /**
   * Execute parallel node
   */
  private async executeParallelNode(
    node: WorkflowNode,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    const { nodes: parallelNodes } = node.config;

    // Execute all nodes in parallel
    const promises = parallelNodes.map((parallelNode) =>
      this.executeNode(parallelNode, context, execution)
    );

    const results = await Promise.all(promises);

    return results;
  }

  /**
   * Execute action node
   */
  private async executeActionNode(
    node: WorkflowNode,
    context: Record<string, any>,
    execution: WorkflowExecution
  ): Promise<any> {
    const { action, config } = node.config;

    switch (action) {
      case "send-slack":
        return await this.sendSlackNotification(config, context);

      case "send-email":
        return await this.sendEmailNotification(config, context);

      case "update-pipedrive":
        return await this.updatePipedrive(config, context);

      case "insert-sheet":
        return await this.insertGoogleSheet(config, context);

      case "log-supabase":
        return await this.logToSupabase(config, context);

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Resolve template with context variables
   */
  private resolveTemplate(
    template: any,
    context: Record<string, any>
  ): any {
    if (typeof template === "string") {
      // Replace {{ variable }} patterns
      return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        return this.getContextValue(key.trim(), context);
      });
    }

    if (Array.isArray(template)) {
      return template.map((item) => this.resolveTemplate(item, context));
    }

    if (typeof template === "object" && template !== null) {
      const resolved: Record<string, any> = {};
      for (const key in template) {
        resolved[key] = this.resolveTemplate(template[key], context);
      }
      return resolved;
    }

    return template;
  }

  /**
   * Get value from context
   */
  private getContextValue(path: string, context: Record<string, any>): any {
    const parts = path.split(".");
    let value: any = context;

    for (const part of parts) {
      if (value && typeof value === "object") {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    // Replace variables with actual values
    let evaluableCondition = condition.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = this.getContextValue(key.trim(), context);
      return JSON.stringify(value);
    });

    // Safely evaluate condition (simplified - in production use a safer evaluator)
    try {
      return Function(`"use strict"; return (${evaluableCondition})`)();
    } catch (error) {
      console.error("Failed to evaluate condition", error);
      return false;
    }
  }

  /**
   * Send Slack notification
   */
  private async sendSlackNotification(
    config: any,
    context: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Slack API call
    console.log("Sending Slack notification", config);
    return { status: "sent" };
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    config: any,
    context: Record<string, any>
  ): Promise<any> {
    // TODO: Implement email sending
    console.log("Sending email", config);
    return { status: "sent" };
  }

  /**
   * Update Pipedrive
   */
  private async updatePipedrive(
    config: any,
    context: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Pipedrive API call
    console.log("Updating Pipedrive", config);
    return { status: "updated" };
  }

  /**
   * Insert Google Sheet
   */
  private async insertGoogleSheet(
    config: any,
    context: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Google Sheets API call
    console.log("Inserting to Google Sheet", config);
    return { status: "inserted" };
  }

  /**
   * Log to Supabase
   */
  private async logToSupabase(
    config: any,
    context: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Supabase logging
    console.log("Logging to Supabase", config);
    return { status: "logged" };
  }

  /**
   * Log workflow execution
   */
  private async logWorkflowExecution(
    execution: WorkflowExecution,
    output: any
  ): Promise<void> {
    try {
      // Insert to Supabase
      const logEntry = {
        workflow_id: execution.workflow_id,
        execution_id: execution.execution_id,
        status: execution.status,
        started_at: execution.started_at,
        completed_at: execution.completed_at,
        duration_ms: execution.duration_ms,
        output: output,
        error: execution.error ? JSON.stringify(execution.error) : null,
        created_at: new Date().toISOString(),
      };

      // TODO: Insert to Supabase workflows_executions table
      console.log("Logged workflow execution", logEntry);
    } catch (error) {
      console.error("Failed to log workflow execution", error);
    }
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }
}
