/**
 * AGENTS API CLIENT
 * 
 * API routes para gerenciar agentes, executar tasks e gerenciar skills.
 * Fornece uma interface type-safe para todas as operações de agentes.
 */

import type { AgentConfig } from '@/components/agents/AgentConfigPanel';
import type { Skill } from '@/components/agents/SkillsManager';
import type { ExecutionResult } from '@/components/agents/ExecutionLog';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '';

/**
 * Cliente HTTP com tratamento de erros
 */
class AgentAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`API Request failed: ${endpoint}`, message);
      throw new Error(`Failed to fetch ${endpoint}: ${message}`);
    }
  }

  /**
   * POST /api/agents/:agentId/execute
   * Executa um agente com input específico
   */
  async executeAgent(
    agentId: string,
    payload: {
      input: string;
      context?: Record<string, unknown>;
      execution_mode?: string;
    }
  ): Promise<ExecutionResult> {
    return this.request<ExecutionResult>(
      `/api/agents/${agentId}/execute`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * GET /api/agents/:agentId/config
   * Obtém configuração atual do agente
   */
  async getAgentConfig(agentId: string): Promise<AgentConfig> {
    return this.request<AgentConfig>(
      `/api/agents/${agentId}/config`,
      {
        method: 'GET',
      }
    );
  }

  /**
   * PATCH /api/agents/:agentId/config
   * Atualiza configuração do agente
   */
  async updateAgentConfig(
    agentId: string,
    payload: Partial<{
      name: string;
      emoji: string;
      model_override: string;
      system_prompt: string;
      status: 'online' | 'offline' | 'idle' | 'maintenance';
    }>
  ): Promise<AgentConfig> {
    return this.request<AgentConfig>(
      `/api/agents/${agentId}/config`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * POST /api/agents/:agentId/skills
   * Adiciona uma skill ao agente
   */
  async addSkillToAgent(
    agentId: string,
    payload: {
      skill_id: string;
      position?: number;
    }
  ): Promise<{ success: boolean; skill: Skill }> {
    return this.request<{ success: boolean; skill: Skill }>(
      `/api/agents/${agentId}/skills`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * DELETE /api/agents/:agentId/skills/:skillId
   * Remove uma skill do agente
   */
  async removeSkillFromAgent(
    agentId: string,
    skillId: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/agents/${agentId}/skills/${skillId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * PUT /api/agents/:agentId/skills/reorder
   * Reordena as skills do agente
   */
  async reorderAgentSkills(
    agentId: string,
    payload: {
      skillIds: string[];
    }
  ): Promise<{ success: boolean; skills: Skill[] }> {
    return this.request<{ success: boolean; skills: Skill[] }>(
      `/api/agents/${agentId}/skills/reorder`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  }

  /**
   * Configurar um novo baseUrl (útil para testes)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

// Exportar instância singleton do cliente
export const agentAPIClient = new AgentAPIClient();

/**
 * ENDPOINTS WRAPPER FUNCTIONS
 * Funções utilitárias para usar os endpoints
 */

/**
 * Executa um agente
 */
export async function executeAgent(
  agentId: string,
  input: string,
  options?: {
    context?: Record<string, unknown>;
    execution_mode?: string;
  }
): Promise<ExecutionResult> {
  try {
    return await agentAPIClient.executeAgent(agentId, {
      input,
      context: options?.context,
      execution_mode: options?.execution_mode,
    });
  } catch (error) {
    console.error('Error executing agent:', error);
    throw error;
  }
}

/**
 * Obtém configuração do agente
 */
export async function fetchAgentConfig(agentId: string): Promise<AgentConfig> {
  try {
    return await agentAPIClient.getAgentConfig(agentId);
  } catch (error) {
    console.error('Error fetching agent config:', error);
    throw error;
  }
}

/**
 * Atualiza configuração do agente
 */
export async function saveAgentConfig(
  agentId: string,
  config: Partial<{
    name: string;
    emoji: string;
    model_override: string;
    system_prompt: string;
    status: 'online' | 'offline' | 'idle' | 'maintenance';
  }>
): Promise<AgentConfig> {
  try {
    return await agentAPIClient.updateAgentConfig(agentId, config);
  } catch (error) {
    console.error('Error updating agent config:', error);
    throw error;
  }
}

/**
 * Adiciona uma skill ao agente
 */
export async function addSkill(
  agentId: string,
  skillId: string,
  position?: number
): Promise<Skill> {
  try {
    const result = await agentAPIClient.addSkillToAgent(agentId, {
      skill_id: skillId,
      position,
    });
    return result.skill;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
}

/**
 * Remove uma skill do agente
 */
export async function removeSkill(
  agentId: string,
  skillId: string
): Promise<void> {
  try {
    await agentAPIClient.removeSkillFromAgent(agentId, skillId);
  } catch (error) {
    console.error('Error removing skill:', error);
    throw error;
  }
}

/**
 * Reordena as skills do agente
 */
export async function reorderSkills(
  agentId: string,
  skillIds: string[]
): Promise<Skill[]> {
  try {
    const result = await agentAPIClient.reorderAgentSkills(agentId, {
      skillIds,
    });
    return result.skills;
  } catch (error) {
    console.error('Error reordering skills:', error);
    throw error;
  }
}

/**
 * TIPOS EXPORTADOS
 */
export type { ExecutionResult };
export type { AgentConfig };
export type { Skill };

/**
 * API Response types
 */
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
