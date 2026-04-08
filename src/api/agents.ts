/**
 * AGENTS API CLIENT
 */
import type { AgentConfig } from '@/types/agents';
import type { Skill } from '@/types/agents';
import type { ExecutionResult } from '@/types/agents';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '';

class AgentAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API Request failed: ${endpoint}`, message);
      throw new Error(`Failed to fetch ${endpoint}: ${message}`);
    }
  }

  async executeAgent(agentId: string, payload: { input: string; context?: Record<string, unknown>; execution_mode?: string }): Promise<ExecutionResult> {
    return this.request<ExecutionResult>(`/api/agents/${agentId}/execute`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async getAgentConfig(agentId: string): Promise<AgentConfig> {
    return this.request<AgentConfig>(`/api/agents/${agentId}/config`, { method: 'GET' });
  }

  async updateAgentConfig(agentId: string, payload: Partial<{ name: string; emoji: string; model_override: string; system_prompt: string; status: string }>): Promise<AgentConfig> {
    return this.request<AgentConfig>(`/api/agents/${agentId}/config`, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  async addSkillToAgent(agentId: string, payload: { skill_id: string; position?: number }): Promise<{ success: boolean; skill: Skill }> {
    return this.request(`/api/agents/${agentId}/skills`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async removeSkillFromAgent(agentId: string, skillId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/agents/${agentId}/skills/${skillId}`, { method: 'DELETE' });
  }

  async reorderAgentSkills(agentId: string, payload: { skillIds: string[] }): Promise<{ success: boolean; skills: Skill[] }> {
    return this.request(`/api/agents/${agentId}/skills/reorder`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

export const agentAPIClient = new AgentAPIClient();

export async function executeAgent(agentId: string, input: string, options?: { context?: Record<string, unknown>; execution_mode?: string }): Promise<ExecutionResult> {
  return agentAPIClient.executeAgent(agentId, { input, context: options?.context, execution_mode: options?.execution_mode });
}

export async function fetchAgentConfig(agentId: string): Promise<AgentConfig> {
  return agentAPIClient.getAgentConfig(agentId);
}

export async function saveAgentConfig(agentId: string, config: Partial<{ name: string; emoji: string; model_override: string; system_prompt: string; status: string }>): Promise<AgentConfig> {
  return agentAPIClient.updateAgentConfig(agentId, config);
}

export async function addSkill(agentId: string, skillId: string, position?: number): Promise<Skill> {
  const result = await agentAPIClient.addSkillToAgent(agentId, { skill_id: skillId, position });
  return result.skill;
}

export async function removeSkill(agentId: string, skillId: string): Promise<void> {
  await agentAPIClient.removeSkillFromAgent(agentId, skillId);
}

export async function reorderSkills(agentId: string, skillIds: string[]): Promise<Skill[]> {
  const result = await agentAPIClient.reorderAgentSkills(agentId, { skillIds });
  return result.skills;
}

export type { ExecutionResult, AgentConfig, Skill };

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedAPIResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
