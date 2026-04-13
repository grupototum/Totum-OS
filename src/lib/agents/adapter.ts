/**
 * ADAPTER PATTERN: Supabase ↔ elizaOS Character File
 * Converte bidirecionalmente entre TotumAgentConfig e ElizaCharacter
 */

import type { TotumAgentConfig, ElizaCharacter, AgentCard } from '@/types/agents-elizaos';

export class AgentAdapter {
  /**
   * Converte TotumAgentConfig (Supabase) → ElizaCharacter (elizaOS)
   */
  static toElizaCharacter(totum: TotumAgentConfig): ElizaCharacter {
    const tierProviders: Record<number, string> = {
      1: 'anthropic',
      2: 'groq',
      3: 'ollama',
    };

    const tierModels: Record<number, string[]> = {
      1: ['claude-3-5-sonnet'],
      2: ['groq-mixtral-8x7b'],
      3: ['ollama-qwen3-coder'],
    };

    const modelProvider = totum.model_override
      ? totum.model_override.split('-')[0].toLowerCase()
      : tierProviders[totum.tier] || 'anthropic';

    const models = totum.model_override
      ? [totum.model_override]
      : tierModels[totum.tier] || ['claude-3-5-sonnet'];

    const plugins = totum.plugins || [
      '@elizaos/plugin-bootstrap',
      ...(totum.tier === 1
        ? ['@elizaos/plugin-anthropic']
        : totum.tier === 2
        ? ['@elizaos/plugin-groq']
        : ['@elizaos/plugin-ollama']),
    ];

    const clients = totum.channels
      .filter((c) => c.enabled)
      .map((c) => c.type);

    const knowledge = (totum.knowledge_sources || []).map((id) => ({
      path: `alexandria:${id}`,
      shared: false,
    }));

    return {
      id: totum.id,
      name: totum.name,
      username: totum.agent_id.toLowerCase(),
      bio: totum.bio,
      lore: totum.lore ? [totum.lore] : [],
      adjectives: totum.adjectives || [],
      system: totum.system_prompt,
      systemPrompts: totum.system_prompt_variations || [totum.system_prompt],
      style: {
        all: ['Be concise and clear', 'Use technical terms accurately'],
        chat: ['Be conversational', 'Ask clarifying questions'],
        post: ['Keep engaging', 'Use relevant hashtags'],
      },
      knowledge,
      plugins,
      clients,
      modelProvider,
      models,
      settings: {
        temperature: totum.temperature ?? 0.7,
        max_tokens: totum.max_tokens ?? 2000,
        tier: totum.tier,
        channels: Object.fromEntries(totum.channels.map((c) => [c.type, c.config])),
      },
      createdAt: new Date(totum.created_at).getTime(),
      updatedAt: new Date(totum.updated_at).getTime(),
    };
  }

  /**
   * Converte ElizaCharacter (elizaOS) → TotumAgentConfig parcial (Supabase)
   */
  static fromElizaCharacter(
    char: ElizaCharacter,
    existingId?: string
  ): Partial<TotumAgentConfig> {
    return {
      id: existingId || char.id,
      agent_id: char.username || char.name.toLowerCase().replace(/\s+/g, '-'),
      name: char.name,
      bio: typeof char.bio === 'string' ? char.bio : char.bio?.[0] || '',
      lore: typeof char.lore === 'string' ? char.lore : char.lore?.[0],
      adjectives: char.adjectives,
      system_prompt: char.system || '',
      system_prompt_variations: char.systemPrompts,
      model_override: char.models?.[0],
      plugins: char.plugins,
      status: 'offline',
      is_active: true,
    };
  }

  /**
   * Converte TotumAgentConfig → AgentCard (Dashboard view)
   */
  static toAgentCard(agent: TotumAgentConfig): AgentCard {
    return {
      id: agent.id,
      name: agent.name,
      emoji: agent.emoji || '🤖',
      status: agent.status,
      tier: agent.tier,
      channels: agent.channels.map((c) => ({
        type: c.type,
        enabled: c.enabled,
      })),
      messages_today: 0,
      success_rate: 0,
      uptime: 0,
    };
  }

  /**
   * Determina o modelo padrão baseado no tier
   */
  static defaultModelForTier(tier: number): string {
    const models: Record<number, string> = {
      1: 'claude-3-5-sonnet',
      2: 'groq-mixtral-8x7b',
      3: 'ollama-qwen3-coder',
    };
    return models[tier] || 'claude-3-5-sonnet';
  }

  /**
   * Gera o slug único para o agente
   */
  static generateAgentId(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Valida se o Character File está completo
   */
  static validateCharacter(char: Partial<ElizaCharacter>): string[] {
    const errors: string[] = [];

    if (!char.name) errors.push('Nome é obrigatório');
    if (!char.bio) errors.push('Bio é obrigatória');
    if (!char.system) errors.push('System prompt é obrigatório');
    if (!char.modelProvider) errors.push('Model provider é obrigatório');

    return errors;
  }
}

export default AgentAdapter;
