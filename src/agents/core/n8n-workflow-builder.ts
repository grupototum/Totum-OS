// File: src/agents/core/n8n-workflow-builder.ts
// Purpose: Build and construct n8n workflows from agent definitions
// Phase: PASSO 7.3 - n8n Cloud Integration

import { N8nWorkflow, N8nNode, N8nConnection } from './n8n-integration';

interface NodeConfig {
  nodeId: string;
  agentId?: string;
  type: 'agent' | 'conditional' | 'webhook' | 'cron' | 'slack' | 'postgres' | 'http' | 'if';
  displayName?: string;
  position?: [number, number];
  parameters?: Record<string, any>;
}

interface WorkflowDefinition {
  name: string;
  description?: string;
  trigger: {
    type: 'webhook' | 'cron';
    config: Record<string, any>;
  };
  nodes: NodeConfig[];
  connections: Array<{
    from: string;
    to: string;
    type?: 'main' | 'error';
  }>;
}

class N8nWorkflowBuilder {
  private workflow: N8nWorkflow;
  private nodePositions: Map<string, [number, number]>;
  private nodeCounter: number;

  constructor(workflowName: string, description?: string) {
    this.workflow = {
      id: '',
      name: workflowName,
      active: false,
      nodes: [],
      connections: {},
      settings: {
        description,
        saveManualExecutions: true,
        executionOrder: 'v1',
      },
    };
    this.nodePositions = new Map();
    this.nodeCounter = 0;
  }

  /**
   * Add webhook trigger node
   */
  addWebhookTrigger(webhookPath: string, methods: string[] = ['POST']): N8nWorkflowBuilder {
    const nodeId = 'webhook-trigger';
    const node: N8nNode = {
      id: nodeId,
      name: 'Webhook Trigger',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        path: webhookPath,
        httpMethod: methods[0],
        responseMode: 'lastNode',
        responseData: '={{$json}}',
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, [250, 300]);

    return this;
  }

  /**
   * Add cron schedule trigger node
   */
  addCronTrigger(schedule: string): N8nWorkflowBuilder {
    const nodeId = 'cron-trigger';
    const node: N8nNode = {
      id: nodeId,
      name: 'Cron Schedule',
      type: 'n8n-nodes-base.cron',
      typeVersion: 1,
      position: [250, 300],
      parameters: {
        cronExpression: schedule,
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, [250, 300]);

    return this;
  }

  /**
   * Add HTTP request node to call elizaOS agent
   */
  addAgentNode(
    nodeId: string,
    agentId: string,
    elizaOsUrl: string,
    apiKey: string,
    timeout: number = 30
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const node: N8nNode = {
      id: nodeId,
      name: `Execute ${agentId}`,
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4,
      position,
      parameters: {
        url: `${elizaOsUrl}/api/agents/${agentId}/execute`,
        method: 'POST',
        authentication: 'generic',
        genericAuthType: 'httpHeaderAuth',
        httpHeaderAuth: {
          headers: [
            {
              paramName: 'Authorization',
              paramValue: `Bearer ${apiKey}`,
            },
          ],
        },
        sendBody: true,
        bodyParameters: {
          parameters: [
            {
              name: 'message',
              value: '={{$json.body.message || $json.input}}',
            },
            {
              name: 'context',
              value: '={{$json.context || {}}}',
            },
          ],
        },
        options: {
          timeout,
          returnFullResponse: false,
        },
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Add conditional node (IF statement)
   */
  addConditionalNode(
    nodeId: string,
    condition: string,
    displayName?: string
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const node: N8nNode = {
      id: nodeId,
      name: displayName || 'Conditional Branch',
      type: 'n8n-nodes-base.if',
      typeVersion: 1,
      position,
      parameters: {
        conditions: {
          boolean: [
            {
              value1: '={{$json.response.score}}',
              operation: 'gt',
              value2: 7.5,
            },
          ],
          combinator: 'and',
        },
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Add Slack notification node
   */
  addSlackNotification(
    nodeId: string,
    channel: string,
    credentialId: string,
    messageTemplate: string
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const node: N8nNode = {
      id: nodeId,
      name: 'Send to Slack',
      type: 'n8n-nodes-base.slack',
      typeVersion: 2,
      position,
      parameters: {
        authentication: credentialId,
        channel,
        messageType: 'text',
        text: messageTemplate,
        otherOptions: {},
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Add PostgreSQL node for logging
   */
  addPostgresLogging(
    nodeId: string,
    credentialId: string,
    table: string,
    insertData: Record<string, any>
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const node: N8nNode = {
      id: nodeId,
      name: 'Log to Database',
      type: 'n8n-nodes-base.postgres',
      typeVersion: 2,
      position,
      parameters: {
        authentication: credentialId,
        operation: 'insert',
        schema: 'public',
        table,
        columns: Object.keys(insertData),
        values: Object.values(insertData).map(v => `={{${typeof v === 'string' ? v : JSON.stringify(v)}}}`),
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Add Google Sheets node
   */
  addGoogleSheetsAppend(
    nodeId: string,
    credentialId: string,
    spreadsheetId: string,
    range: string,
    values: string[]
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const node: N8nNode = {
      id: nodeId,
      name: 'Append to Google Sheets',
      type: 'n8n-nodes-base.googleSheets',
      typeVersion: 3,
      position,
      parameters: {
        authentication: credentialId,
        operation: 'append',
        spreadsheetId,
        range,
        values: values.map(v => `={{${v}}}`),
      },
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Add custom HTTP node
   */
  addHttpNode(
    nodeId: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    headers?: Record<string, string>,
    body?: Record<string, any>
  ): N8nWorkflowBuilder {
    const position = this.calculateNodePosition(this.nodeCounter++);

    const parameters: any = {
      url,
      method,
      responseMode: 'lastNode',
    };

    if (headers) {
      parameters.headerParameters = {
        parameters: Object.entries(headers).map(([key, value]) => ({
          name: key,
          value,
        })),
      };
    }

    if (body && method !== 'GET' && method !== 'DELETE') {
      parameters.sendBody = true;
      parameters.bodyParameters = {
        parameters: Object.entries(body).map(([key, value]) => ({
          name: key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        })),
      };
    }

    const node: N8nNode = {
      id: nodeId,
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4,
      position,
      parameters,
    };

    this.workflow.nodes.push(node);
    this.nodePositions.set(nodeId, position);

    return this;
  }

  /**
   * Connect two nodes
   */
  connect(fromNodeId: string, toNodeId: string, type: 'main' | 'error' = 'main'): N8nWorkflowBuilder {
    if (!this.workflow.connections[fromNodeId]) {
      this.workflow.connections[fromNodeId] = [];
    }

    this.workflow.connections[fromNodeId].push({
      node: toNodeId,
      type,
    });

    return this;
  }

  /**
   * Create parallel execution (multiple nodes execute simultaneously)
   */
  connectParallel(sourceNodeId: string, targetNodeIds: string[]): N8nWorkflowBuilder {
    for (const targetNodeId of targetNodeIds) {
      this.connect(sourceNodeId, targetNodeId, 'main');
    }
    return this;
  }

  /**
   * Connect with condition (true/false branches)
   */
  connectConditional(
    conditionalNodeId: string,
    trueNodeId: string,
    falseNodeId?: string
  ): N8nWorkflowBuilder {
    // True branch (index 1)
    if (!this.workflow.connections[conditionalNodeId]) {
      this.workflow.connections[conditionalNodeId] = [];
    }

    this.workflow.connections[conditionalNodeId].push({
      node: trueNodeId,
      type: 'main',
    });

    // False branch (index 2) if provided
    if (falseNodeId) {
      this.workflow.connections[conditionalNodeId].push({
        node: falseNodeId,
        type: 'main',
      });
    }

    return this;
  }

  /**
   * Set workflow description
   */
  setDescription(description: string): N8nWorkflowBuilder {
    if (!this.workflow.settings) {
      this.workflow.settings = {};
    }
    this.workflow.settings.description = description;
    return this;
  }

  /**
   * Set workflow tags
   */
  setTags(tags: string[]): N8nWorkflowBuilder {
    if (!this.workflow.settings) {
      this.workflow.settings = {};
    }
    this.workflow.settings.tags = tags;
    return this;
  }

  /**
   * Build the workflow
   */
  build(): N8nWorkflow {
    // Validate workflow has at least one trigger and one action
    const hasTrigger = this.workflow.nodes.some(n =>
      ['n8n-nodes-base.webhook', 'n8n-nodes-base.cron'].includes(n.type)
    );

    if (!hasTrigger) {
      throw new Error('Workflow must have at least one trigger (webhook or cron)');
    }

    if (this.workflow.nodes.length < 2) {
      throw new Error('Workflow must have at least a trigger and an action');
    }

    return this.workflow;
  }

  /**
   * Export workflow to JSON
   */
  toJSON(): string {
    return JSON.stringify(this.build(), null, 2);
  }

  /**
   * Create a workflow from definition
   */
  static fromDefinition(definition: WorkflowDefinition): N8nWorkflow {
    const builder = new N8nWorkflowBuilder(definition.name, definition.description);

    // Add trigger
    if (definition.trigger.type === 'webhook') {
      builder.addWebhookTrigger(definition.trigger.config.path);
    } else if (definition.trigger.type === 'cron') {
      builder.addCronTrigger(definition.trigger.config.schedule);
    }

    // Add nodes
    for (const nodeConfig of definition.nodes) {
      if (nodeConfig.type === 'agent' && nodeConfig.agentId) {
        builder.addAgentNode(
          nodeConfig.nodeId,
          nodeConfig.agentId,
          nodeConfig.parameters?.elizaOsUrl || 'http://localhost:3001',
          nodeConfig.parameters?.apiKey || '',
          nodeConfig.parameters?.timeout || 30
        );
      }
    }

    // Create connections
    for (const connection of definition.connections) {
      builder.connect(connection.from, connection.to, connection.type || 'main');
    }

    return builder.build();
  }

  // Private helper methods

  private calculateNodePosition(index: number): [number, number] {
    const x = 250 + (index % 3) * 300;
    const y = 300 + Math.floor(index / 3) * 200;
    return [x, y];
  }
}

export { N8nWorkflowBuilder, NodeConfig, WorkflowDefinition };
