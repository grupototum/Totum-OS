# 🎛️ Arquitetura de Agentes elizaOS-Compatível — Apps Totum

**Status**: MVP Architecture Ready  
**Data**: April 2026  
**Objetivo**: Condensar sistema disperso de agentes em 2 páginas unificadas com suporte total a elizaOS Character Files + Alexandria integration.

---

## 📌 Resumo Executivo

### Transformação
- **Hoje**: `agents_config` genérico (id, name, personality, instructions, channels, is_active)
- **Amanhã**: Character File elizaOS-compatível + wrapper adapter
- **Output**: JSON exportável para elizaOS Runtime + UI Dashboard/Editor

### Pilares
1. **Supabase** como fonte de verdade (PostgreSQL + pgvector para Alexandria)
2. **elizaOS Character File** como formato padrão
3. **Adapter pattern** transforma dados DB em Character instances
4. **Alexandria** como knowledge base persistente (RAG)
5. **Dashboard + Editor** em 2 páginas, hot reload em runtime

---

## 🔧 TypeScript Types (elizaOS-Compatible)

### 1. Core Character Interface

```typescript
// src/types/agents-elizaos.ts

import { UUID } from 'crypto';

/**
 * elizaOS Character — Define agente completo
 * Compatível com elizaOS Character File format
 * Referência: https://docs.elizaos.ai/agents/character-interface
 */
export interface ElizaCharacter {
  // ===== IDENTIDADE =====
  id: string;
  name: string;
  username?: string;
  bio: string | string[]; // Array para variações de resposta
  lore?: string[];
  adjectives?: string[];
  
  // ===== SISTEMA & COMPORTAMENTO =====
  system?: string; // System prompt (pode ter múltiplas variações)
  systemPrompts?: string[]; // Para randomização
  
  // ===== MODELAGEM COGNITIVA =====
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
  
  // ===== CONHECIMENTO (RAG) =====
  knowledge?: Array<string | KnowledgeItem>;
  
  // ===== EXEMPLOS DE MENSAGEM =====
  messageExamples?: MessageExample[][];
  
  // ===== PLUGINS =====
  plugins?: string[];
  
  // ===== CLIENTES (Discord, Telegram, etc) =====
  clients?: string[];
  
  // ===== CONFIGURAÇÃO DE MODELO LLM =====
  modelProvider?: string; // 'openai' | 'anthropic' | 'groq' | 'ollama'
  models?: string[]; // ['gpt-4', 'claude-3-sonnet', etc]
  
  // ===== CONFIGURAÇÕES ESPECÍFICAS =====
  settings?: Record<string, any>;
  
  // ===== METADATA INTERNA =====
  createdAt?: number;
  updatedAt?: number;
}

export interface KnowledgeItem {
  path: string;
  shared?: boolean; // true = todos agentes acessam, false = apenas este agente
}

export interface MessageExample {
  user: string;
  content: { text: string };
}

/**
 * Agent Runtime Instance — elizaOS Character em execução
 */
export interface ElizaAgent extends ElizaCharacter {
  enabled?: boolean;
  status?: 'active' | 'inactive' | 'error';
  createdAt: number;
  updatedAt: number;
  
  // Runtime state
  last_execution?: string;
  error_message?: string;
}
```

---

### 2. Totum Agent Config — Wrapper do elizaOS Character

```typescript
/**
 * AgentConfig Estendido — Nossa camada sobre Character
 * Salvo em agents_config table
 */
export interface TotumAgentConfig {
  // ===== CHAVE PRIMÁRIA =====
  id: string; // UUID
  agent_id: string; // Nome único (slug)
  
  // ===== IDENTIDADE ELIZAOS =====
  name: string;
  bio: string;
  lore?: string;
  adjectives?: string[];
  emoji?: string;
  
  // ===== SISTEMA & INSTRUÇÕES =====
  system_prompt: string;
  system_prompt_variations?: string[]; // Para randomização
  
  // ===== MODELO & TIER =====
  tier: 1 | 2 | 3; // Laboratório (Claude/Gemini), Mid (Groq), Fábrica (Ollama)
  model_override?: string; // ex: 'gpt-4', 'claude-3-sonnet'
  temperature?: number; // 0.0 - 1.0
  max_tokens?: number;
  
  // ===== SKILLS (Pipeline de execução) =====
  skills: AgentSkillConfig[];
  
  // ===== CANAIS =====
  channels: ChannelConfig[];
  
  // ===== CONHECIMENTO (Alexandria) =====
  knowledge_enabled?: boolean;
  knowledge_sources?: string[]; // IDs dos documentos em Alexandria
  rag_mode?: 'static' | 'dynamic'; // Cache vs real-time
  
  // ===== PLUGINS ELIZAOS =====
  plugins?: string[];
  
  // ===== STATUS & LIFECYCLE =====
  is_active: boolean;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  
  // ===== METADATA =====
  description?: string;
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
  config: Record<string, string | number | boolean>;
  // Discord
  token?: string;
  allowed_servers?: string[];
  // Telegram
  bot_token?: string;
  allowed_groups?: string[];
  // Policies
  respond_to_dms?: boolean;
  respond_to_groups?: boolean;
  respond_to_mentions?: boolean;
}
```

---

### 3. API Requests/Responses

```typescript
/**
 * Requisições de criação/edição de agente
 */
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
  character?: ElizaCharacter; // elizaOS Character File
  errors?: string[];
}

/**
 * Exportar agente para elizaOS
 */
export interface ExportAgentRequest {
  agent_id: string;
  format: 'json' | 'typescript'; // JSON para armazenar, TS para código
}

export interface ExportAgentResponse {
  success: boolean;
  character: ElizaCharacter;
  json: string;
  typescript?: string;
}
```

---

### 4. Dashboard & Listing

```typescript
/**
 * Visão simplificada para dashboard
 */
export interface AgentCard {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'offline' | 'error';
  tier: 1 | 2 | 3;
  channels: Array<{ type: string; enabled: boolean }>;
  
  // Métricas
  messages_today?: number;
  success_rate?: number;
  uptime?: number;
  
  // Actions rápidas
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
```

---

## 🗄️ Supabase Schema (Atualizado)

### SQL Migrations

```sql
-- migrations/agents_elizaos_refactor.sql

-- ===== EXTEND: agents_config table =====
ALTER TABLE agents_config ADD COLUMN IF NOT EXISTS
  bio TEXT NOT NULL DEFAULT '',
  lore TEXT,
  adjectives TEXT[], -- Array de adjetivos
  system_prompt_variations TEXT[], -- Sistema prompt randomizado
  temperature NUMERIC(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  tier SMALLINT NOT NULL DEFAULT 2,
  knowledge_enabled BOOLEAN DEFAULT false,
  knowledge_sources TEXT[] DEFAULT '{}',
  rag_mode VARCHAR(20) DEFAULT 'static',
  plugins TEXT[] DEFAULT '{}',
  exported_character JSONB; -- Cache do elizaOS Character File

-- ===== NEW TABLE: agent_channels =====
CREATE TABLE IF NOT EXISTS agent_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents_config(id) ON DELETE CASCADE,
  channel_type VARCHAR(50) NOT NULL, -- 'discord', 'telegram', 'twitter'
  is_enabled BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, channel_type)
);

-- ===== NEW TABLE: agent_skills_config =====
CREATE TABLE IF NOT EXISTS agent_skills_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents_config(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  custom_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, skill_id)
);

-- ===== EXTEND: Alexandria integration =====
CREATE TABLE IF NOT EXISTS agent_knowledge_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents_config(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  access_level VARCHAR(20) DEFAULT 'read', -- 'read' | 'read_write'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(agent_id, document_id)
);

-- ===== NEW TABLE: agent_executions =====
CREATE TABLE IF NOT EXISTS agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents_config(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL, -- 'pending', 'running', 'success', 'error'
  execution_id VARCHAR(100) NOT NULL UNIQUE, -- exec_[timestamp]_[random]
  input TEXT,
  output JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  INDEX agent_status_idx (agent_id, status),
  INDEX created_at_idx (created_at DESC)
);

-- ===== INDEX: agents_config extensão =====
CREATE INDEX IF NOT EXISTS agents_tier_idx ON agents_config(tier);
CREATE INDEX IF NOT EXISTS agents_status_idx ON agents_config(status);
```

---

## 🔌 Adapter Pattern — Supabase → elizaOS

```typescript
// src/lib/agents/adapter.ts

/**
 * Converte TotumAgentConfig → ElizaCharacter
 * Permite exportar/reimportar de elizaOS sem perda
 */
export class AgentAdapter {
  
  /**
   * Supabase → elizaOS Character
   */
  static toElizaCharacter(totum: TotumAgentConfig): ElizaCharacter {
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
        all: [
          'Be concise and clear',
          'Use technical terms accurately',
        ],
        chat: [
          'Be conversational',
          'Ask clarifying questions',
        ],
        post: [
          'Keep engaging',
          'Use relevant hashtags',
        ],
      },
      
      // Knowledge
      knowledge: (totum.knowledge_sources || []).map(id => ({
        path: `alexandria:${id}`,
        shared: false,
      })),
      
      // Plugins
      plugins: totum.plugins || [
        '@elizaos/plugin-bootstrap',
        // Add based on tier
        ...(totum.tier === 1 
          ? ['@elizaos/plugin-anthropic'] 
          : totum.tier === 2 
          ? ['@elizaos/plugin-groq'] 
          : ['@elizaos/plugin-ollama']),
      ],
      
      // Clients
      clients: totum.channels
        .filter(c => c.enabled)
        .map(c => c.type),
      
      // Model
      modelProvider: totum.model_override?.split('-')[0]?.toLowerCase() || 
        (totum.tier === 1 ? 'anthropic' : totum.tier === 2 ? 'groq' : 'ollama'),
      models: [totum.model_override || this.defaultModelForTier(totum.tier)],
      
      // Settings
      settings: {
        temperature: totum.temperature,
        max_tokens: totum.max_tokens,
        tier: totum.tier,
        channels: Object.fromEntries(
          totum.channels.map(c => [c.type, c.config])
        ),
      },
      
      createdAt: new Date(totum.created_at).getTime(),
      updatedAt: new Date(totum.updated_at).getTime(),
    };
  }
  
  /**
   * elizaOS Character → Supabase
   */
  static fromElizaCharacter(char: ElizaCharacter, existingId?: string): Partial<TotumAgentConfig> {
    return {
      id: existingId || char.id,
      agent_id: char.username || char.name.toLowerCase(),
      name: char.name,
      bio: typeof char.bio === 'string' ? char.bio : char.bio?.[0] || '',
      lore: typeof char.lore === 'string' 
        ? char.lore 
        : char.lore?.[0],
      adjectives: char.adjectives,
      system_prompt: char.system || '',
      system_prompt_variations: char.systemPrompts,
      model_override: char.models?.[0],
      plugins: char.plugins,
    };
  }
  
  private static defaultModelForTier(tier: number): string {
    if (tier === 1) return 'claude-3-5-sonnet';
    if (tier === 2) return 'groq-mixtral';
    return 'ollama-qwen3-coder';
  }
}
```

---

## 🎨 React Component Structure

### File Organization

```
src/
├── pages/
│   ├── agents/
│   │   ├── index.tsx              # Dashboard (Página 1)
│   │   ├── [id]/
│   │   │   └── edit.tsx           # Editor (Página 2)
│   │   └── new.tsx                # Redirect to [id]/edit
│   
├── components/
│   ├── agents/
│   │   ├── Dashboard/
│   │   │   ├── AgentGrid.tsx      # Grid de cards
│   │   │   ├── AgentCard.tsx      # Card individual
│   │   │   ├── FilterBar.tsx      # Busca + filtros
│   │   │   └── TemplateSection.tsx # Templates pré-configurados
│   │   │
│   │   ├── Editor/
│   │   │   ├── AgentForm.tsx      # Form wrapper + tabs
│   │   │   ├── IdentityTab.tsx    # Nome, bio, lore, avatár
│   │   │   ├── CapabilitiesTab.tsx# Grid de plugins
│   │   │   ├── ChannelsTab.tsx    # Config Discord/Telegram
│   │   │   ├── BrainTab.tsx       # LLM settings
│   │   │   ├── AlexandriaTab.tsx  # Knowledge base
│   │   │   ├── ActionsTab.tsx     # Workflows
│   │   │   ├── SystemPromptEditor.tsx # Code editor (Monaco)
│   │   │   └── LivePreview.tsx    # Chat em tempo real
│   │   │
│   │   └── Common/
│   │       ├── AgentStatus.tsx    # Badge online/offline
│   │       ├── PluginGrid.tsx     # Seletor de plugins
│   │       ├── ChannelConfig.tsx  # Config por canal
│   │       └── AlexandriaConnect.tsx # Integração Alexandria
│   
├── hooks/
│   ├── useAgentForm.ts            # Gerenciar estado do form
│   ├── useAgentExecution.ts       # Executar agente
│   ├── useAlexandria.ts           # Integração com base de docs
│   └── useAgentHotReload.ts       # Hot reload em runtime
│
├── services/
│   ├── agents.service.ts          # CRUD agentes
│   ├── adapter.service.ts         # elizaOS converter
│   └── export.service.ts          # Exportar character.json
│
└── types/
    └── agents-elizaos.ts          # Tipos compartilhados
```

---

## 🚀 Fluxos Principais

### Fluxo 1: Criar Novo Agente

```
Dashboard (index.tsx)
  ↓
Click "Novo Agente" 
  ↓
Redirect: /agents/new → /agents/[new-uuid]/edit
  ↓
AgentForm carrega em modo CREATE
  ↓
Usuário preenche:
  - Identidade (nome, bio, emoji)
  - Capacidades (plugins)
  - Canais (Discord token, etc)
  - Cérebro (modelo, temp)
  - Alexandria (conectar docs)
  ↓
Click "Publicar"
  ↓
useAgentForm.submit()
  ↓
AgentAdapter.toElizaCharacter() → Character File
  ↓
POST /api/agents (salva em agents_config + agent_channels + agent_skills_config)
  ↓
TOT Bridge dispara webhook para iniciar agente em runtime (opcional)
  ↓
Redirect: /agents/[id] (Dashboard atualiza)
```

### Fluxo 2: Editar Agente + Hot Reload

```
Dashboard
  ↓
Click em card de agente
  ↓
/agents/[id]/edit carrega dados
  ↓
AgentForm em modo EDIT
  ↓
Usuário altera system_prompt
  ↓
LivePreview atualiza em tempo real
  ↓
Click "Salvar"
  ↓
PATCH /api/agents/[id] 
  ↓
Backend:
  1. Update agents_config
  2. Regenerate Character File (cache)
  3. Dispatch hot-reload event (POST /webhook/agent/reload)
  4. TOT Bridge aplica mudanças em runtime
  ↓
Usuário vê agent status → "Reloading..." → "Online"
```

### Fluxo 3: Integração Alexandria

```
AgentForm → AlexandriaTab
  ↓
☑ "Conectar Alexandria"
  ↓
useAlexandria.getDocuments()
  ↓
Fetch: GET /api/alexandria/documents?access=read
  ↓
Renderiza lista de docs acessíveis
  ↓
Usuário seleciona documentos relevantes
  ↓
POST /api/agents/[id]/knowledge
  ↓
Backend:
  1. Insert agent_knowledge_access rows
  2. Update agents_config.knowledge_sources
  3. If rag_mode='dynamic': configure knowledge plugin
  ↓
Agent now has RAG context
```

---

## 📊 Exemplo: Conversão Character

### Antes (Supabase)

```json
{
  "id": "uuid-loki",
  "agent_id": "loki",
  "name": "LOKI",
  "bio": "Sales CRM agent specializing in lead qualification",
  "system_prompt": "You are a sales assistant...",
  "tier": 1,
  "model_override": "claude-3-5-sonnet",
  "status": "online",
  "created_at": "2025-04-01T10:00:00Z"
}
```

### Depois (elizaOS Character File)

```typescript
export const character: Character = {
  id: "uuid-loki",
  name: "LOKI",
  username: "loki",
  bio: "Sales CRM agent specializing in lead qualification",
  system: "You are a sales assistant...",
  models: ["claude-3-5-sonnet"],
  plugins: [
    "@elizaos/plugin-bootstrap",
    "@elizaos/plugin-anthropic",
    "@elizaos/plugin-discord",
    "@elizaos/plugin-telegram"
  ],
  clients: ["discord", "telegram"],
  settings: {
    temperature: 0.7,
    max_tokens: 2000,
    tier: 1,
  },
  knowledge: [
    { path: "alexandria:doc-sales-process", shared: false },
    { path: "alexandria:doc-customer-data", shared: false }
  ]
};
```

---

## 🔐 Segurança

- **API Keys**: Criptografadas em `agent_channels.config` (Supabase Vault)
- **Permissões**: `agent_knowledge_access` governa quais docs cada agente acessa
- **Auditoria**: `agent_executions` registra todas as execuções com timestamps
- **Hot Reload**: Validar webhook signature antes de aplicar mudanças

---

## 📈 Roadmap: MVP → V2

### MVP (Nesta iteração)

- [x] Dashboard simples com grid de agentes
- [x] Editor unificado (abas)
- [x] Identidade + 1 canal (Telegram)
- [x] LLM básico (provider + modelo)
- [x] Alexandria leitura (cache estático)
- [x] Exportar character.json
- [ ] Hot reload em runtime (opcional para MVP)

### V2 (Próximas iterações)

- [ ] Múltiplos canais simultâneos
- [ ] Todos os plugins elizaOS
- [ ] Workflows avançados (ações customizadas)
- [ ] RAG dinâmico (buscar docs em tempo real)
- [ ] Análise de métricas (sucesso rate, latência)
- [ ] Repositório de templates (clonar agentes)
- [ ] Integração n8n (orquestração de workflows)

---

## 🎯 Checklist de Implementação

### Backend (API)

- [ ] `POST /api/agents` — criar agente
- [ ] `GET /api/agents` — listar com paginação/filtro
- [ ] `GET /api/agents/:id` — detalhe + character file
- [ ] `PATCH /api/agents/:id` — atualizar
- [ ] `DELETE /api/agents/:id` — deletar
- [ ] `POST /api/agents/:id/export` — exportar character.json
- [ ] `POST /api/agents/:id/test` — executar teste
- [ ] `POST /api/agents/:id/knowledge` — associar documentos

### Frontend (React)

- [ ] `/agents` — Dashboard page
- [ ] `/agents/[id]/edit` — Editor page
- [ ] Componentes dashboard (grid, cards, filtro)
- [ ] Componentes editor (form, tabs, preview)
- [ ] Integração com Alexandria hook
- [ ] Validação de campos obrigatórios
- [ ] Toast/feedback de sucesso/erro
- [ ] Loading states

### Database

- [ ] Migration: extend agents_config
- [ ] Migration: create agent_channels
- [ ] Migration: create agent_skills_config
- [ ] Migration: create agent_knowledge_access
- [ ] Migration: create agent_executions
- [ ] Índices de performance

### Testes

- [ ] Unit: AgentAdapter conversão
- [ ] Integration: Supabase CRUD
- [ ] E2E: Dashboard → Editor → Publicar → Online

---

## 📚 Referências

- elizaOS Docs: https://docs.elizaos.ai
- Character Interface: https://docs.elizaos.ai/agents/character-interface
- Plugins: https://docs.elizaos.ai/core/plugins
- Alexandria (internal): Sistema de conhecimento do Totum
- TOT Bridge: Webhook connectors para runtime

---

## 🤔 Próximas Perguntas

1. **Hot reload**: Quão importante é aplicar mudanças sem reiniciar o agente?
2. **Alexandria sync**: Cache estático é suficiente para MVP ou precisa ser dinâmico?
3. **Tiers**: Bloquear criação de agents tier 1 apenas para Laboratório, ou deixar livre?
4. **Templates**: Fornecer 3-5 templates pré-configurados na listagem?

---

**Próximo passo**: Gerar código scaffold dos componentes React e hooks.
