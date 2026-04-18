/**
 * Status enums — single source of truth
 * Centraliza todos os status types do sistema para evitar divergência.
 */

// ── Agent Runtime Status ─────────────────────────────────────────────
// Usado em: dashboard, hub, cards de agente, useAgents, AgentDetail
// Fonte canônica: types/agent.ts (re-exporta daqui)
export type AgentRuntimeStatus = 'online' | 'offline' | 'idle' | 'error' | 'maintenance';

// ── Agent Config Status ──────────────────────────────────────────────
// Usado em: agents_config (Alexandria view), editor de agentes
export type AgentConfigStatus = 'active' | 'inactive' | 'testing';

// ── Skill Status ─────────────────────────────────────────────────────
// Usado em: skills registry, SkillsCentral, SkillCard
export type SkillStatus = 'active' | 'inactive' | 'deprecated' | 'beta';

// ── Execution Status ─────────────────────────────────────────────────
// Usado em: useAgentExecution, ExecutionLog
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'error';
