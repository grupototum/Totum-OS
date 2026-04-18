/**
 * Canonical Agent type — single source of truth.
 * Used by useAgents, useDashboardData, AgentDetail, AgentsDashboard.
 * Do NOT redefine Agent locally in hooks or pages.
 */
import type { AgentRuntimeStatus } from './status';
export type { AgentRuntimeStatus };

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentRuntimeStatus;
  emoji: string;
  category: string | null;
  tasks: number;
  daily_tasks: number | null;
  success_rate: number | null;
  created_at: string;
  slug?: string;
  agent_group?: string;
  description?: string;
  // UI-derived fields (computed on the client)
  parent_id?: string;
  is_orchestrator?: boolean;
  hierarchy_level?: number;
  credits_used?: number;
  tasks_completed?: number;
  type?: string;
}

export interface AgentMetrics {
  totalAgents: number;
  onlineAgents: number;
  totalTasks: number;
  avgSuccessRate: number;
  agentsByType: {
    conversational: number;
    processing: number;
  };
}
