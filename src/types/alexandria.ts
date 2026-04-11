// Tipos principais do sistema Alexandria

export interface RagDocument {
  id: string;
  type: 'design_system' | 'pops' | 'slas' | 'client_info' | 'execution_history';
  title: string;
  content: string;
  is_global: boolean;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  model_preference?: string;
  cost_per_call?: number;
  success_rate?: number;
  prompt_template?: string;
  status: 'active' | 'inactive' | 'beta';
  version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Agent {
  agent_id: string;
  name: string;
  emoji: string;
  tier: number;
  model_override?: string;
  system_prompt: string;
  skills: string[]; // IDs das skills
  metadata?: Record<string, any>;
  status: 'active' | 'inactive' | 'testing';
  created_at?: string;
  updated_at?: string;
}

export interface AlexandriaStats {
  totalDocuments: number;
  totalSkills: number;
  totalAgents: number;
  activeAgents: number;
}

export interface AlexandriaContextData {
  documents: RagDocument[];
  skills: Skill[];
  agents: Agent[];
  stats: AlexandriaStats;
}
