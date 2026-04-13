/**
 * TYPES: Agents elizaOS System
 * Tipagens compatíveis com elizaOS Character File
 */

// ============================================
// ELIZAOS CHARACTER FILE
// ============================================

export interface ElizaCharacter {
  id: string;
  name: string;
  username?: string;
  bio: string | string[];
  lore?: string[];
  adjectives?: string[];
  system?: string;
  systemPrompts?: string[];
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
  knowledge?: Array<string | KnowledgeItem>;
  messageExamples?: MessageExample[][];
  plugins?: string[];
  clients?: string[];
  modelProvider?: string;
  models?: string[];
  settings?: Record<string, any>;
  createdAt?: number;
  updatedAt?: number;
}

export interface KnowledgeItem {
  path: string;
  shared?: boolean;
}

export interface MessageExample {
  user: string;
  content: { text: string };
}

// ============================================
// TOTUM AGENT CONFIG (Supabase)
// ============================================

export interface TotumAgentConfig {
  id: string;
  agent_id: string;
  name: string;
  bio: string;
  lore?: string;
  adjectives?: string[];
  emoji?: string;
  system_prompt: string;
  system_prompt_variations?: string[];
  tier: 1 | 2 | 3;
  model_override?: string;
  temperature?: number;
  max_tokens?: number;
  skills: AgentSkillConfig[];
  channels: ChannelConfig[];
  knowledge_enabled?: boolean;
  knowledge_sources?: string[];
  rag_mode?: 'static' | 'dynamic';
  plugins?: string[];
  is_active: boolean;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  exported_character?: ElizaCharacter;
  metadata?: {
    tier?: number;
    team?: string;
    category?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface AgentSkillConfig {
  skill_id: string;
  skill_name: string;
  position: number;
  enabled: boolean;
  custom_config?: Record<string, any>;
}

export interface ChannelConfig {
  type: 'discord' | 'telegram' | 'twitter' | 'whatsapp' | 'email';
  enabled: boolean;
  config: {
    token?: string;
    bot_token?: string;
    [key: string]: any;
  };
}

// ============================================
// DASHBOARD / LISTING
// ============================================

export interface AgentCard {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'offline' | 'error';
  tier: 1 | 2 | 3;
  channels: Array<{ type: string; enabled: boolean }>;
  messages_today?: number;
  success_rate?: number;
  uptime?: number;
  last_execution?: string;
  next_scheduled?: string;
}

export interface AgentMetrics {
  total_agents: number;
  online_agents: number;
  offline_agents: number;
  avg_success_rate: number;
  messages_today: number;
  agents_by_tier: {
    tier_1: number;
    tier_2: number;
    tier_3: number;
  };
  agents_by_channel: Record<string, number>;
}

// ============================================
// API REQUESTS/RESPONSES
// ============================================

export interface CreateAgentRequest {
  name: string;
  bio: string;
  tier: 1 | 2 | 3;
  system_prompt: string;
  skills: AgentSkillConfig[];
  channels: ChannelConfig[];
  knowledge_sources?: string[];
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {
  id: string;
}

export interface AgentResponse {
  success: boolean;
  agent: TotumAgentConfig;
  character?: ElizaCharacter;
  errors?: string[];
}

export interface AgentsListResponse {
  success: boolean;
  agents: AgentCard[];
  total: number;
}

export interface ExportAgentRequest {
  agent_id: string;
  format: 'json' | 'typescript';
}

export interface ExportAgentResponse {
  success: boolean;
  character: ElizaCharacter;
  json: string;
  typescript?: string;
}

export interface TelegramControlRequest {
  action: 'start' | 'stop';
}

export interface TelegramControlResponse {
  success: boolean;
  message: string;
  bot_username?: string;
}

// ============================================
// FORM DATA (Frontend)
// ============================================

export interface AgentFormData {
  id?: string;
  name: string;
  bio: string;
  emoji: string;
  lore: string;
  adjectives: string[];
  system_prompt: string;
  tier: 1 | 2 | 3;
  temperature: number;
  max_tokens: number;
  channels: ChannelConfig[];
  knowledge_sources: string[];
  rag_mode: 'static' | 'dynamic';
  plugins: string[];
}
