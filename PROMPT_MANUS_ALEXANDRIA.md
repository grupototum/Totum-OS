# 🎯 PROMPT PARA MANUS — Integração Alexandria + Supabase

## 📋 OBJETIVO
Integrar o sistema Alexandria (dashboard OpenClaw) ao banco de dados Supabase do projeto "Grupo Totum" para torná-lo funcional e persistente.

---

## 🔗 CONEXÃO SUPABASE (CRÍTICO)

### Credenciais do Projeto
```
SUPABASE_URL=https://lmracjgunkmjocqejuyg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcmFjamd1bmttam9jcWVqdXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTUyMTYsImV4cCI6MjA1OTMzMTIxNn0.q6aqT2np5gM5QQjwD0IN0qC9HC_6yR3UpyBe8vxUOc0
```

### Tabelas Existentes (Schema Giles)
```sql
-- Tabelas principais:
- giles_knowledge (chunks de conhecimento + embeddings)
- giles_dominios (taxonomia hierárquica)
- giles_consultas (logs de consultas)
- giles_sinonimos (sinônimos para busca)

-- Funções RPC disponíveis:
- giles_hybrid_search() — busca híbrida vetorial + full-text
- giles_search_by_domain() — busca por domínio
- giles_get_tree() — árvore hierárquica
```

### O que precisa fazer:
1. [ ] Configurar cliente Supabase no projeto Alexandria
2. [ ] Criar variáveis de ambiente para as credenciais
3. [ ] Testar conexão com uma query simples
4. [ ] Criar endpoints/funções para:
   - Inserir conhecimento no banco
   - Consultar conhecimento (usando giles_hybrid_search)
   - Listar domínios/categorias
   - Logar consultas em giles_consultas

---

## 🤖 INTEGRAÇÃO COM APIs de IA

### 1. GOOGLE / GEMINI (PRIORIDADE #1)
**Para:** Gerar embeddings e respostas da IA

**Setup necessário:**
```bash
# Instalar SDK
npm install @google/generative-ai

# Variável de ambiente necessária:
GOOGLE_API_KEY=sua_chave_aqui
GOOGLE_GENERATIVE_AI_MODEL=gemini-1.5-pro-latest
```

**Funcionalidades:**
- [ ] Criar módulo `src/services/geminiService.ts`
- [ ] Função `generateEmbedding(text)` → retorna vetor 768d
- [ ] Função `generateResponse(prompt, context)` → resposta da IA
- [ ] Função `analyzeDocument(content)` → análise e extração de metadados

### 2. OUTRAS IAs (prepare os locais)
Crie estrutura pronta para:
```
src/services/
├── geminiService.ts      ✅ Implementar primeiro
├── openaiService.ts      📝 Estrutura preparada
├── groqService.ts        📝 Estrutura preparada
├── kimiService.ts        📝 Estrutura preparada
└── ollamaService.ts      📝 Estrutura preparada (local)
```

Para cada uma, criar:
- Variável de ambiente no `.env.example`
- Função de teste de conexão
- Métodos: `generateEmbedding()`, `generateResponse()`, `getModels()`

---

## 🏗️ ARQUITETURA SUGERIDA

### Estrutura de Pastas
```
alexandria/
├── src/
│   ├── config/
│   │   ├── supabase.ts          # Configuração Supabase
│   │   └── ai-providers.ts      # Configuração das IAs
│   │
│   ├── services/
│   │   ├── geminiService.ts     # Google/Gemini
│   │   ├── knowledgeService.ts  # CRUD no Supabase
│   │   ├── searchService.ts     # Busca híbrida
│   │   └── agentService.ts      # Comunicação entre agentes
│   │
│   ├── components/
│   │   ├── KnowledgeUploader.tsx   # Upload de documentos
│   │   ├── SearchInterface.tsx     # Interface de busca
│   │   ├── AgentChat.tsx           # Chat com agentes
│   │   └── KnowledgeGraph.tsx      # Visualização gráfica
│   │
│   ├── hooks/
│   │   ├── useKnowledge.ts      # Hook para conhecimento
│   │   ├── useSearch.ts         # Hook para busca
│   │   └── useAgents.ts         # Hook para agentes
│   │
│   └── pages/
│       ├── dashboard.tsx        # Dashboard principal
│       ├── knowledge/           # Gestão de conhecimento
│       ├── agents/              # Gestão de agentes
│       └── search/              # Busca avançada
│
├── .env.example                 # Template de variáveis
└── supabase/                    # Migrations adicionais
    └── functions.sql            # Funções personalizadas
```

---

## 💡 APLICAÇÕES SUGERIDAS (para o propósito de Alexandria)

### 1. **Sistema de Busca Inteligente**
```
Input: pergunta em linguagem natural
↓
Gemini gera embedding da query
↓
giles_hybrid_search() no Supabase
↓
Retorna chunks relevantes + metadados
↓
Gemini sintetiza resposta com contexto
```

### 2. **Uploader de Conhecimento**
- Upload de PDFs, Markdown, TXT
- Extração automática de texto
- Geração de embeddings
- Classificação automática por domínio
- Armazenamento no Supabase

### 3. **Chat com Agente Especialista**
- Interface de chat estilo ChatGPT
- Seleção de agente (Miguel, Liz, Jarvis, etc.)
- Contexto recuperado do Giles automaticamente
- Histórico de conversas salvo no Supabase

### 4. **Dashboard de Analytics**
- Quais domínios mais consultados
- Quais agentes mais ativos
- Quais documentos mais acessados
- Timeline de ingestão de conhecimento

### 5. **Sistema de Tags e Relacionamentos**
- Visualização em grafo de conhecimento
- Sugestão automática de relacionamentos
- Navegação por conexões entre documentos

### 6. **API Pública para Agentes**
```typescript
// Endpoint para agentes consultarem Alexandria
POST /api/query
{
  "agent_id": "miguel",
  "query": "Como escalar o sistema?",
  "domain": "infraestrutura",
  "limit": 5
}
```

### 7. **Sync Automático**
- Sincronização com GitHub (docs, READMEs)
- Sincronização com Notion (se usado)
- Sincronização com arquivos locais

### 8. **Sistema de Permissões**
- Quem pode inserir conhecimento
- Quem pode consultar
- Auditoria de acessos

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Conexão Base (prioridade MÁXIMA)
- [ ] Instalar `@supabase/supabase-js`
- [ ] Configurar cliente Supabase com as credenciais acima
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Testar conexão: listar tabelas do schema `public`
- [ ] Criar função de healthcheck do banco

### Fase 2: Integração Google/Gemini
- [ ] Instalar `@google/generative-ai`
- [ ] Configurar variável `GOOGLE_API_KEY`
- [ ] Implementar `generateEmbedding()`
- [ ] Implementar `generateResponse()`
- [ ] Testar com conteúdo de exemplo

### Fase 3: CRUD de Conhecimento
- [ ] Função `insertKnowledge(chunk, metadata)`
- [ ] Função `searchKnowledge(query, domain?)`
- [ ] Função `getKnowledgeById(id)`
- [ ] Função `updateKnowledge(id, updates)`
- [ ] Função `deleteKnowledge(id)`

### Fase 4: Interface
- [ ] Componente de busca com autocomplete
- [ ] Componente de upload de arquivos
- [ ] Componente de visualização de resultados
- [ ] Dashboard com métricas do sistema

### Fase 5: Locais para outras IAs
- [ ] Estrutura de pastas preparada
- [ ] Interfaces TypeScript definidas
- [ ] `.env.example` com placeholders
- [ ] Documentação de como adicionar nova IA

---

## 📁 ARQUIVOS DE REFERÊNCIA

Os seguintes documentos já existem no workspace:
- `/root/.openclaw/workspace/agents/giles/ARQUITETURA.md` — Arquitetura completa
- `/root/.openclaw/workspace/agents/giles/giles_schema_supabase.sql` — Schema SQL
- `/root/.openclaw/workspace/agents/giles/giles-client-supabase.js` — Cliente de exemplo
- `/root/.openclaw/workspace/AGENTES_TOTUM.md` — Documentação dos agentes

---

## 🎯 RESULTADO ESPERADO

Ao final, Alexandria deve ser capaz de:

1. ✅ **Armazenar** conhecimento no Supabase com embeddings
2. ✅ **Buscar** informações usando busca híbrida (vetorial + texto)
3. ✅ **Responder** perguntas usando Gemini como IA
4. ✅ **Gerenciar** múltiplos agentes com contexto persistente
5. ✅ **Escalar** adicionando mais IAs (OpenAI, Groq, etc.)
6. ✅ **Visualizar** dados em dashboard interativo

---

## 🆘 SUPORTE

Se precisar de ajuda:
- Schema completo: `agents/giles/giles_schema_supabase.sql`
- Cliente de exemplo: `agents/giles/giles-client-supabase.js`
- Documentação: `agents/giles/ARQUITETURA.md`

---

**VAMOS LÁ! Transformar Alexandria no cérebro central da Totum.** 🧠⚡
