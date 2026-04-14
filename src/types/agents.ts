/**
 * Skills and Execution Types
 * Core types for skill execution and agent orchestration
 * Agent config types are in agents-elizaos.ts (TotumAgentConfig)
 */

import { AgentSkillConfig } from './agents-elizaos';

// ============================================
// SKILLS
// ============================================

export interface SkillInput {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: any;
  description?: string;
  items?: string; // para arrays
}

export interface SkillOutput {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  version: string;
  category: 'content' | 'research' | 'image' | 'validation' | 'automation' | 'analytics';
  inputs: Record<string, SkillInput>;
  outputs: Record<string, SkillOutput>;
  model_preference: 'claude' | 'groq' | 'gemini' | 'kimi';
  cost_per_call: number;
  success_rate: number;
  prompt_template: string;
  dependencies: string[];
  status: 'active' | 'inactive' | 'deprecated';
  estimated_duration_ms: number;
}

// Re-export unified agent config type from agents-elizaos
export type { TotumAgentConfig as AgentConfig } from './agents-elizaos';
export type { AgentSkillConfig };

// ============================================
// EXECUTION
// ============================================

export interface SkillExecution {
  skill_id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration_ms: number;
  tokens_used?: number;
  cost?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  execution_id: string;
  result: any;
  logs: SkillExecution[];
  total_tokens: number;
  total_cost: number;
  duration_ms: number;
  created_at: string;
}

export interface AgentPayload {
  agent: string;
  skills: Array<{
    id: string;
    prompt: string;
    inputs: Record<string, any>;
    model: string;
  }>;
  system_prompt: string;
  rag_context?: string;
  execution_mode: 'sequential' | 'parallel' | 'conditional';
  context?: {
    client_id?: string;
    project_id?: string;
    user_id?: string;
    extra_context?: any;
  };
}

// ============================================
// API REQUESTS/RESPONSES
// ============================================

export interface ExecuteAgentRequest {
  input: string;
  context?: {
    client_id?: string;
    project_id?: string;
    extra_context?: any;
  };
  execution_mode?: 'sequential' | 'parallel' | 'conditional';
}

export interface ExecuteAgentResponse {
  success: boolean;
  execution_id: string;
  result: any;
  logs: SkillExecution[];
  total_tokens: number;
  total_cost: number;
  duration_ms: number;
}

export interface UpdateAgentConfigRequest {
  name?: string;
  model_override?: string;
  system_prompt?: string;
  status?: 'active' | 'inactive';
}

// ============================================
// AGENT STATE
// ============================================

export type AgentState = 'online' | 'busy' | 'offline' | 'error';

export interface AgentStateUpdate {
  agent_id: string;
  state: AgentState;
  current_execution?: string;
  last_updated: string;
}

// ============================================
// SKILL CATALOG
// ============================================

export interface SkillFilter {
  category?: string;
  status?: 'active' | 'inactive' | 'deprecated';
  model?: string;
  search?: string;
}

export interface SkillCatalogItem extends Skill {
  is_installed?: boolean;
  install_count?: number;
  rating?: number;
}
