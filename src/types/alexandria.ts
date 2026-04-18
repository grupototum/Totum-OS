/**
 * Tipos canônicos do sistema Alexandria
 * Fonte única da verdade para RAG, Skills e Agents da Alexandria.
 * Os tipos de rag.ts foram aqui consolidados — não usar rag.ts.
 */

// ============================================================
// RAG — Documentos e Contexto
// ============================================================

export interface RagDocument {
  id: string;
  type: 'design_system' | 'pops' | 'slas' | 'client_info' | 'execution_history';
  title: string;
  content: string;
  is_global?: boolean;
  metadata?: Record<string, any>;
  embedding?: number[] | null;
  created_at: string;
  updated_at?: string;
}

export interface RagContext {
  id: string;
  agent_id: string;
  execution_id: string;
  query: string;
  context: string;
  documents_used: string[];
  similarity_score: number;
  created_at: string;
}

export interface RagSearchResult {
  document: RagDocument;
  similarity: number;
}

export interface RagQueryOptions {
  type?: string;
  limit?: number;
  threshold?: number;
  maxContextTokens?: number;
}

// ============================================================
// SKILLS
// ============================================================

// Canonical Skill type lives in agents.ts — re-exported here for backward compatibility
export type { Skill } from './agents';

// ============================================================
// AGENTS (Alexandria view — tabela agents_config)
// ============================================================

import type { AgentConfigStatus } from './status';

export interface AgentSkillRef {
  skill_id: string;
  skill_name?: string;
  position?: number;
  enabled?: boolean;
}

export interface Agent {
  agent_id: string;
  name: string;
  emoji: string;
  tier: number;
  model_override?: string;
  system_prompt: string;
  skills: string[] | AgentSkillRef[];
  metadata?: Record<string, any>;
  status: AgentConfigStatus;
  created_at?: string;
  updated_at?: string;
}

/** Normaliza skills independente de virem como string[] ou AgentSkillRef[] */
export function normalizeSkillIds(skills: Agent['skills']): string[] {
  if (!skills || skills.length === 0) return [];
  if (typeof skills[0] === 'string') return skills as string[];
  return (skills as AgentSkillRef[]).map(s => s.skill_id);
}

// ============================================================
// STATS & CONTEXT
// ============================================================

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
