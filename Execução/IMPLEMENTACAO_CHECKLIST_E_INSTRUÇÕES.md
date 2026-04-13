# 🚀 Implementação: Agentes elizaOS — Apps Totum

**Status**: Arquitetura PRONTA | Código SCAFFOLD | Pronto para Lovable  
**Estimado**: 2-3 sprints (80-120 horas de dev)  

---

## 📌 O Que Foi Entregue

### 1. **Arquitetura Completa** (`AGENTES_ELIZAOS_ARQUITETURA_COMPLETA.md`)
✅ Tipos TypeScript elizaOS-compatíveis  
✅ Schema Supabase (migrations SQL)  
✅ Adapter pattern (Supabase ↔ elizaOS)  
✅ Fluxos de usuário end-to-end  
✅ Dashboard + Editor wireframes (Mermaid)  

### 2. **Código Scaffold React** (`AGENTES_COMPONENTES_SCAFFOLD.tsx`)
✅ Dashboard Page + componentes  
✅ Editor Page + form com abas  
✅ Live preview chat  
✅ Hooks de integração  
✅ Estrutura pronta para Lovable  

### 3. **Estrutura de Dados**
✅ TotumAgentConfig (Supabase)  
✅ ElizaCharacter (elizaOS)  
✅ AgentCard (Dashboard)  
✅ Tipos de execução e canais  

---

## 🎯 Checklist de Implementação

### FASE 1: Backend & Banco de Dados (Sprint 1)

#### SQL Migrations
```
[ ] Criar arquivo: migrations/agents_elizaos_refactor.sql
[ ] Extend agents_config table:
    [ ] bio TEXT
    [ ] lore TEXT
    [ ] adjectives TEXT[]
    [ ] system_prompt_variations TEXT[]
    [ ] temperature NUMERIC(3,2)
    [ ] max_tokens INTEGER
    [ ] tier SMALLINT
    [ ] knowledge_enabled BOOLEAN
    [ ] knowledge_sources TEXT[]
    [ ] rag_mode VARCHAR(20)
    [ ] plugins TEXT[]
    [ ] exported_character JSONB
[ ] Create agent_channels table
[ ] Create agent_skills_config table
[ ] Create agent_knowledge_access table
[ ] Create agent_executions table
[ ] Create indexes para performance
[ ] Rodar migrations no Supabase
[ ] Validar schema com SELECT * FROM agents_config LIMIT 1
```

#### API Endpoints (Node.js/Express)
```
[ ] POST /api/agents
    [ ] Validar campos obrigatórios
    [ ] AgentAdapter.toElizaCharacter()
    [ ] Salvar em agents_config + agent_channels
    [ ] Retornar agentId

[ ] GET /api/agents
    [ ] Listar com paginação (limit, offset)
    [ ] Filtrar por tier, status, search
    [ ] Retornar AgentCard[]

[ ] GET /api/agents/:id
    [ ] Retornar TotumAgentConfig completo
    [ ] Incluir Character File
    [ ] Incluir canais e skills

[ ] PATCH /api/agents/:id
    [ ] Atualizar agents_config
    [ ] Regenerar Character File cache
    [ ] Dispatch webhook hot-reload (opcional MVP)

[ ] DELETE /api/agents/:id
    [ ] Soft delete (is_active = false)
    [ ] Ou hard delete com confirmação

[ ] GET /api/agents/:id/export
    [ ] Exportar character.json
    [ ] Exportar character.ts

[ ] POST /api/agents/:id/test
    [ ] Executar agente com input teste
    [ ] Retornar output + duration

[ ] POST /api/agents/:id/knowledge
    [ ] POST: associar documentos Alexandria
    [ ] DELETE: remover acesso a documentos
```

#### Services (TypeScript)
```
[ ] src/lib/agents/adapter.ts
    [ ] AgentAdapter.toElizaCharacter()
    [ ] AgentAdapter.fromElizaCharacter()
    [ ] defaultModelForTier()

[ ] src/services/agents.service.ts
    [ ] createAgent()
    [ ] getAgents()
    [ ] getAgent()
    [ ] updateAgent()
    [ ] deleteAgent()
    [ ] exportAgent()

[ ] src/services/export.service.ts
    [ ] exportAsJSON()
    [ ] exportAsTypeScript()
```

---

### FASE 2: Frontend React (Sprint 1-2)

#### Components
```
[ ] src/pages/agents/index.tsx
    [ ] Layout básico
    [ ] Integração useAgents hook

[ ] src/pages/agents/[id]/edit.tsx
    [ ] Carregamento de dados
    [ ] Routing para /agents/new

[ ] src/components/agents/Dashboard/
    [ ] AgentGrid.tsx ✓ (scaffold pronto)
    [ ] AgentCard.tsx ✓ (scaffold pronto)
    [ ] FilterBar.tsx ✓ (scaffold pronto)
    [ ] TemplateSection.tsx ✓ (scaffold pronto)

[ ] src/components/agents/Editor/
    [ ] AgentForm.tsx ✓ (scaffold pronto)
    [ ] IdentityTab.tsx ✓ (scaffold pronto)
    [ ] CapabilitiesTab.tsx (implement)
    [ ] ChannelsTab.tsx (implement)
    [ ] BrainTab.tsx (implement)
    [ ] AlexandriaTab.tsx (implement)
    [ ] ActionsTab.tsx (implement)
    [ ] SystemPromptEditor.tsx (Monaco/CodeMirror)
    [ ] LivePreview.tsx ✓ (scaffold pronto)
```

#### Hooks
```
[ ] src/hooks/useAgents.ts ✓ (scaffold pronto)
    [ ] Fetch /api/agents
    [ ] Caching com SWR ou React Query

[ ] src/hooks/useAgentForm.ts ✓ (scaffold pronto)
    [ ] Submit logic
    [ ] Validação

[ ] src/hooks/useAlexandria.ts (create)
    [ ] getDocuments()
    [ ] getAccessibleDocs(agentId)
    [ ] addKnowledge()
    [ ] removeKnowledge()

[ ] src/hooks/useAgentHotReload.ts (create)
    [ ] Subscribe to agent/reload events
    [ ] Update status em tempo real
```

#### State Management
```
[ ] Decidir: Redux, Zustand, Context API?
[ ] Agent form state (compartilhado entre abas)
[ ] Filtro state (dashboard)
[ ] UI state (loading, error, success)
```

---

### FASE 3: Integração & QA (Sprint 2-3)

#### Hot Reload (opcional para MVP)
```
[ ] TOT Bridge webhook handler
    [ ] POST /webhook/agent/reload
    [ ] Validar signature
    [ ] Dispatch evento para agente em runtime

[ ] Frontend listener
    [ ] useAgentHotReload hook
    [ ] Status badge "Reloading..." → "Online"
```

#### Alexandria Integration
```
[ ] API GET /api/alexandria/documents
    [ ] Listar docs acessíveis ao agente
    [ ] Filtrar por permission level

[ ] Database agent_knowledge_access
    [ ] Salvar acesso a documentos
    [ ] Validar que apenas authorized docs são usados

[ ] RAG (MVP: static cache)
    [ ] Carregar docs uma vez ao criar agente
    [ ] Adicionar ao knowledge do Character File
```

#### Validações
```
[ ] Frontend:
    [ ] Nome é obrigatório
    [ ] Bio é obrigatório
    [ ] System prompt é obrigatório
    [ ] Pelo menos 1 canal ativado
    [ ] API keys para canais (Telegram token, Discord token)

[ ] Backend:
    [ ] Verificar campos obrigatórios
    [ ] Validar tokens (testar API antes de salvar)
    [ ] Sanitizar inputs
    [ ] Checar permissões (agente X acessa doc Y?)
```

#### Testes
```
[ ] Unit:
    [ ] AgentAdapter.toElizaCharacter()
    [ ] AgentAdapter.fromElizaCharacter()

[ ] Integration:
    [ ] Criar agente → Supabase → elizaOS Character
    [ ] Atualizar agente → regenerar character
    [ ] Deletar agente → limpar relacionamentos

[ ] E2E (Cypress/Playwright):
    [ ] Dashboard: listar agentes
    [ ] Dashboard: buscar/filtrar
    [ ] Editor: criar agente novo
    [ ] Editor: editar agente existente
    [ ] Editor: publicar agente

[ ] Manual:
    [ ] Exportar character.json
    [ ] Importar no elizaOS runtime
    [ ] Agente responde em Discord/Telegram
```

---

### FASE 4: Polishing & Deployment (Sprint 3)

#### UX/UI
```
[ ] Dark mode já suportado?
[ ] Responsive (mobile, tablet, desktop)
[ ] Loading states em todas as actions
[ ] Error messages claras
[ ] Success toasts
[ ] Confirmação antes de deletar
```

#### Performance
```
[ ] Dashboard: lazy load agentes (paginação)
[ ] Editor: debounce saves
[ ] Character export: cache result
[ ] Agent list: memoize components
```

#### Documentação
```
[ ] README: Como usar o Dashboard
[ ] README: Como criar agente
[ ] README: Como exportar para elizaOS
[ ] Comentários em código (partes não-óbvias)
```

#### Deployment
```
[ ] Build otimizado (vite build)
[ ] Testes passando (CI/CD)
[ ] Database migrations rodadas em produção
[ ] APIs testadas
[ ] Deploy em produção
```

---

## 💡 Instruções Passo-a-Passo

### Passo 1: Clonar Scaffold para Apps Totum

```bash
# 1. Copiar types
cp AGENTES_ELIZAOS_ARQUITETURA_COMPLETA.md → Apps_totum_Oficial/docs/

# 2. Copiar tipos TypeScript
mkdir -p src/types
# Implementar interfaces de AGENTES_ELIZAOS_ARQUITETURA_COMPLETA.md

# 3. Copiar componentes
# Usar scaffold de AGENTES_COMPONENTES_SCAFFOLD.tsx como base
# Lovable pode auto-completar com shadcn/ui
```

### Passo 2: Supabase Setup

```sql
-- 1. Rodar migrations
\i migrations/agents_elizaos_refactor.sql

-- 2. Verificar schema
SELECT * FROM agents_config LIMIT 1;
SELECT * FROM agent_channels;
SELECT * FROM agent_skills_config;
SELECT * FROM agent_knowledge_access;

-- 3. Seed (opcional)
-- Inserir 3 agentes de teste (LOKI, WANDA, VISU)
```

### Passo 3: API Development (Node.js)

```javascript
// 1. Criar rotas em api/routes/agents.js
// Basear em scaffold: AGENTES_COMPONENTES_SCAFFOLD.tsx

// 2. Implementar services
// src/services/agents.service.ts

// 3. Testar com curl/Postman
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TestAgent",
    "bio": "Test agent",
    "system_prompt": "You are helpful"
  }'
```

### Passo 4: React Frontend (Lovable)

```bash
# 1. Importar componentes do scaffold
# Use Lovable code generation com: 
#   "Create Dashboard page with AgentGrid, FilterBar"

# 2. Montar arquivo a arquivo
#   - Dashboard page
#   - Editor page
#   - Componentes (cards, form, tabs)
#   - Hooks

# 3. Conectar ao backend
#   - useAgents hook → GET /api/agents
#   - useAgentForm hook → POST/PATCH /api/agents

# 4. Testar manualmente
#   - Criar agente → Salvar em Supabase?
#   - Editar agente → Atualizar no Supabase?
#   - Listar agentes → Aparecem no dashboard?
```

### Passo 5: Elizabeth Adapter

```typescript
// src/lib/agents/adapter.ts
// Implementar conversão bidirecional:
//   TotumAgentConfig ↔ ElizaCharacter

// Testar:
const totum = { name: 'LOKI', bio: '...' };
const eliza = AgentAdapter.toElizaCharacter(totum);
console.log(eliza); // Deve ter name, bio, plugins, clients, etc
```

### Passo 6: Alexandria Integration

```typescript
// src/hooks/useAlexandria.ts
// Buscar documentos acessíveis ao agente
// Salvar acesso na tabela agent_knowledge_access

// AlexandriaTab.tsx
// Mostrar lista de docs
// Usuário clica em checkbox → POST /api/agents/:id/knowledge
```

### Passo 7: QA & Testes

```bash
# Dashboard
- [ ] Listar 3+ agentes
- [ ] Buscar por nome
- [ ] Filtrar por tier
- [ ] Filtrar por status
- [ ] Clicar "Novo Agente" → vai para /agents/new

# Editor
- [ ] Criar agente novo
  - [ ] Preencher Identidade
  - [ ] Selecionar Capacidades (Discord, Telegram)
  - [ ] Adicionar tokens de canais
  - [ ] Escolher modelo (Claude, Groq, Ollama)
  - [ ] Conectar Alexandria docs
  - [ ] Publicar → Salva em Supabase
- [ ] Editar agente existente
  - [ ] Carrega dados pre-preenchidos
  - [ ] Alterar system prompt
  - [ ] Publicar → Atualiza
- [ ] Live preview funciona?

# Character File
- [ ] Exportar character.json
- [ ] Colar em elizaOS → funciona?
```

---

## 📦 Templates Pré-configurados

Ao criar MVP, incluir 4 templates que populam as abas automaticamente:

### 1. **Atendente**
```typescript
{
  name: "Atendente SL",
  bio: "Agente de suporte ao cliente especializado em atendimento",
  tier: 2,
  channels: [{ type: 'telegram', enabled: true }],
  system_prompt: "Você é um agente de atendimento ao cliente..."
}
```

### 2. **Copywriter**
```typescript
{
  name: "Copywriter AI",
  bio: "Gerador de conteúdo para redes sociais",
  tier: 2,
  channels: [{ type: 'twitter', enabled: true }],
  system_prompt: "Você é um copywriter experiente..."
}
```

### 3. **Pesquisador**
```typescript
{
  name: "Pesquisador",
  bio: "Agente de pesquisa e análise",
  tier: 1,
  channels: [{ type: 'discord', enabled: true }],
  system_prompt: "Você é um pesquisador especializado..."
}
```

### 4. **Analista BI**
```typescript
{
  name: "Analista",
  bio: "Análise de dados e geração de insights",
  tier: 3,
  channels: [{ type: 'email', enabled: true }],
  system_prompt: "Você é um analista de dados..."
}
```

---

## 🔌 Conexão TOT Bridge (Opcional para MVP)

Se quiser hot reload em runtime:

```javascript
// TOT Bridge v2.0 webhook handler
POST /webhook/agent/reload
{
  agent_id: "uuid-loki",
  action: "reload|restart|stop|start",
  changes: {
    system_prompt: "novo prompt",
    temperature: 0.8
  }
}

// Bridge dispara para Kimi Claw (OpenClaw)
// Agente é recarregado em memória sem reiniciar processo
```

---

## 🚫 O Que NÃO Fazer (MVP)

❌ Não implementar RAG dinâmico (versão 2)  
❌ Não criar 39 agentes pré-configurados (deixar criar manualmente)  
❌ Não integrar n8n workflows (MVP usa skills simples)  
❌ Não suportar WhatsApp/Email channels (focar Discord + Telegram)  
❌ Não implementar analytics/dashboard de métricas  

---

## ✅ O Que Fazer (MVP)

✅ Dashboard com CRUD de agentes  
✅ Editor com 6 abas (Identidade, Capacidades, Canais, Cérebro, Alexandria, Ações)  
✅ Exportar character.json compatível elizaOS  
✅ Live preview chat  
✅ Integração Alexandria (leitura)  
✅ Suportar 2 canais: Discord + Telegram  
✅ 4 templates pré-configurados  
✅ Hot reload opcional (se der tempo)  

---

## 📊 Estimativa de Esforço

| Task | Horas | Sprint |
|------|-------|--------|
| SQL Migrations | 8 | 1 |
| API Endpoints | 24 | 1 |
| Dashboard Page | 16 | 1-2 |
| Editor Page | 20 | 1-2 |
| Hooks & Services | 12 | 1-2 |
| Elizabeth Adapter | 8 | 1 |
| Alexandria Integration | 12 | 2 |
| QA & Tests | 20 | 2-3 |
| Polishing & Docs | 8 | 3 |
| **TOTAL** | **128 horas** | **2-3 sprints** |

---

## 🎯 Success Criteria (Definição de Pronto)

- [ ] Dashboard lista todos os agentes com status em tempo real
- [ ] Criar novo agente → salva em Supabase + exporta character.json
- [ ] Editar agente → atualiza Supabase + regenera character.json
- [ ] Alexandria tab mostra docs acessíveis → usuário pode adicionar/remover
- [ ] Live preview funciona (chat com agente antes de publicar)
- [ ] Exportar character.json → coloca em elizaOS e funciona
- [ ] Todos os campos validam (obrigatórios, API keys, etc)
- [ ] Dark mode está OK
- [ ] Mobile responsive
- [ ] Testes cobrem CRUD principal
- [ ] Documentação clara

---

## 🤔 Próximas Perguntas para Israel

1. **Lovable**: Usar código-first ou visual builder? Recomendo código-first com scaffold.
2. **Templates**: Quer fornecer na listagem ou apenas criar manualmente?
3. **Hot reload**: Priority low/medium/high? (MVP pode skipar, V2 implementa)
4. **Alexandria RAG**: Cache estático suficiente ou precisa ser dinâmico?
5. **Executar agente local**: Usar TOT Bridge (requer Kimi Claw rodando) ou apenas API remota?

---

## 📞 Suporte Próximos Passos

1. **Lovable setup**: Israel começa em Lovable, gera componentes
2. **Database**: Israel roda migrations no Supabase
3. **API**: Israel (ou Kimi Code) implementa endpoints
4. **QA**: Israel testa fluxos e dá feedback
5. **Deploy**: Merge em main, deploy em produção

---

**Status**: 🚀 READY TO BUILD

Arquitetura validada, tipos definidos, scaffold pronto. Próximo passo é escrever o código.

---

*Gerado: April 12, 2026 | Claude (Laboratório) | Status: MVP Architecture Complete*
