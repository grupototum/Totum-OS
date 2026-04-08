/**
 * Skills Service
 * Gerencia o registry de skills e configurações de agentes
 */

import { supabase } from '@/integrations/supabase/client';
import skillsRegistry from '@/lib/skills-registry.json';
import type { 
  Skill, 
  AgentConfig, 
  AgentSkillConfig,
  SkillFilter 
} from '@/types/agents';

// ============================================
// SKILLS REGISTRY (JSON)
// ============================================

const skillsMap = new Map<string, Skill>(
  Object.entries(skillsRegistry as Record<string, Skill>)
);

/**
 * Carrega todas as skills do registry
 */
export function loadSkillsRegistry(): Map<string, Skill> {
  return skillsMap;
}

/**
 * Busca uma skill pelo ID
 */
export function getSkillById(id: string): Skill | undefined {
  return skillsMap.get(id);
}

/**
 * Lista todas as skills com filtro opcional
 */
export function listSkills(filter?: SkillFilter): Skill[] {
  let skills = Array.from(skillsMap.values());
  
  if (filter?.category) {
    skills = skills.filter(s => s.category === filter.category);
  }
  
  if (filter?.status) {
    skills = skills.filter(s => s.status === filter.status);
  }
  
  if (filter?.model) {
    skills = skills.filter(s => s.model_preference === filter.model);
  }
  
  if (filter?.search) {
    const search = filter.search.toLowerCase();
    skills = skills.filter(s => 
      s.name.toLowerCase().includes(search) ||
      s.description.toLowerCase().includes(search)
    );
  }
  
  return skills;
}

/**
 * Lista categorias únicas de skills
 */
export function getSkillCategories(): string[] {
  const categories = new Set<string>();
  skillsMap.forEach(skill => categories.add(skill.category));
  return Array.from(categories);
}

/**
 * Calcula custo total de um array de skills
 */
export function calculateSkillsCost(skillIds: string[]): number {
  return skillIds.reduce((total, id) => {
    const skill = getSkillById(id);
    return total + (skill?.cost_per_call || 0);
  }, 0);
}

/**
 * Estima duração total de um array de skills
 */
export function estimateSkillsDuration(skillIds: string[]): number {
  return skillIds.reduce((total, id) => {
    const skill = getSkillById(id);
    return total + (skill?.estimated_duration_ms || 0);
  }, 0);
}

// ============================================
// AGENT CONFIG (SUPABASE)
// ============================================

/**
 * Busca configuração de um agente
 */
export async function getAgentConfig(agentId: string): Promise<AgentConfig | null> {
  const { data, error } = await (supabase as any)
    .from('agents_config')
    .select('*')
    .eq('agent_id', agentId)
    .single();
  
  if (error) {
    console.error('Error fetching agent config:', error);
    return null;
  }
  
  return data as AgentConfig;
}

/**
 * Busca configuração de todos os agentes
 */
export async function getAllAgentConfigs(): Promise<AgentConfig[]> {
  const { data, error } = await (supabase as any)
    .from('agents_config')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching agent configs:', error);
    return [];
  }
  
  return data as AgentConfig[];
}

/**
 * Cria nova configuração de agente
 */
export async function createAgentConfig(
  config: Omit<AgentConfig, 'id' | 'created_at' | 'updated_at'>
): Promise<AgentConfig | null> {
  const { data, error } = await (supabase as any)
    .from('agents_config')
    .insert([config])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating agent config:', error);
    return null;
  }
  
  return data as AgentConfig;
}

/**
 * Atualiza configuração de um agente
 */
export async function updateAgentConfig(
  agentId: string,
  updates: Partial<Omit<AgentConfig, 'id' | 'agent_id' | 'created_at' | 'updated_at'>>
): Promise<AgentConfig | null> {
  const { data, error } = await (supabase as any)
    .from('agents_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('agent_id', agentId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating agent config:', error);
    return null;
  }
  
  return data as AgentConfig;
}

// ============================================
// AGENT SKILLS MANAGEMENT
// ============================================

/**
 * Adiciona uma skill a um agente
 */
export async function addSkillToAgent(
  agentId: string,
  skillId: string,
  position?: number
): Promise<AgentConfig | null> {
  const config = await getAgentConfig(agentId);
  if (!config) return null;
  
  const skills = config.skills || [];
  
  // Verifica se skill já existe
  if (skills.some(s => s.skill_id === skillId)) {
    console.warn(`Skill ${skillId} already exists for agent ${agentId}`);
    return config;
  }
  
  // Verifica se skill existe no registry
  if (!getSkillById(skillId)) {
    console.error(`Skill ${skillId} not found in registry`);
    return null;
  }
  
  skills.push({
    skill_id: skillId,
    position: position ?? skills.length,
  });
  
  return updateAgentConfig(agentId, { skills });
}

/**
 * Remove uma skill de um agente
 */
export async function removeSkillFromAgent(
  agentId: string,
  skillId: string
): Promise<AgentConfig | null> {
  const config = await getAgentConfig(agentId);
  if (!config) return null;
  
  const skills = (config.skills || []).filter(s => s.skill_id !== skillId);
  
  // Reordena positions
  skills.forEach((s, idx) => {
    s.position = idx;
  });
  
  return updateAgentConfig(agentId, { skills });
}

/**
 * Reordena skills de um agente
 */
export async function reorderAgentSkills(
  agentId: string,
  skillIds: string[]
): Promise<AgentConfig | null> {
  const config = await getAgentConfig(agentId);
  if (!config) return null;
  
  const skills: AgentSkillConfig[] = skillIds.map((skill_id, position) => ({
    skill_id,
    position,
  }));
  
  return updateAgentConfig(agentId, { skills });
}

/**
 * Move uma skill para uma nova posição
 */
export async function moveSkillPosition(
  agentId: string,
  skillId: string,
  newPosition: number
): Promise<AgentConfig | null> {
  const config = await getAgentConfig(agentId);
  if (!config) return null;
  
  const skills = [...(config.skills || [])];
  const currentIndex = skills.findIndex(s => s.skill_id === skillId);
  
  if (currentIndex === -1) return config;
  
  // Remove da posição atual
  const [skill] = skills.splice(currentIndex, 1);
  
  // Insere na nova posição
  skills.splice(newPosition, 0, skill);
  
  // Atualiza positions
  skills.forEach((s, idx) => {
    s.position = idx;
  });
  
  return updateAgentConfig(agentId, { skills });
}

/**
 * Busca skills completas de um agente (com dados do registry)
 */
export async function getAgentSkills(agentId: string): Promise<Array<Skill & { position: number }>> {
  const config = await getAgentConfig(agentId);
  if (!config) return [];
  
  return (config.skills || [])
    .map(s => {
      const skill = getSkillById(s.skill_id);
      if (!skill) return null;
      return { ...skill, position: s.position };
    })
    .filter((s): s is Skill & { position: number } => s !== null)
    .sort((a, b) => a.position - b.position);
}
