# 🗺️ ROADMAP UNIFICADO - TOTUM MISSION CONTROL

> **Princípio:** Frontend Primeiro → Backend depois → Integrações por último

---

## 📐 ESTRUTURA DO ROADMAP

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   FASE 1          FASE 2           FASE 3           FASE 4                  │
│   (4 semanas)     (3 semanas)      (4 semanas)      (5 semanas)             │
│                                                                             │
│   🎨 FRONTEND     ⚙️ BACKEND       🔌 INTEGRAÇÕES   🎛️ MISSION CONTROL      │
│       │              │                  │                  │                │
│       ▼              ▼                  ▼                  ▼                │
│   ┌─────────┐    ┌─────────┐      ┌─────────┐      ┌─────────────────┐     │
│   │ 7 Chat  │ →  │ Auth    │  →   │ Tools   │  →   │ Tasks Board     │     │
│   │ Pages   │    │ + DB    │      │ + APIs  │      │ Content Pipeline│     │
│   │ + Hub   │    │ + API   │      │ + Webh. │      │ Office View     │     │
│   └─────────┘    └─────────┘      └─────────┘      │ Team Structure  │     │
│                                                    └─────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 🎨 FASE 1: FRONTEND COMPLETO (4 semanas)

## Semana 1: Fundação Visual

### Dia 1-2: Setup e Estrutura
- [ ] Configurar rotas `/agents/:id` para cada agente
- [ ] Criar componente base `AgentLayout` (header, sidebar, main area)
- [ ] Setup do Design System (cores, tipografia, spacing)

### Dia 3-4: Componentes de Chat
- [ ] `ChatInterface` - Container principal
- [ ] `MessageBubble` - Bolhas de mensagem (user/agente)
- [ ] `ChatInput` - Input com auto-resize
- [ ] `ChatSidebar` - Histórico de conversas

### Dia 5: Hub de Agentes (atualização)
- [ ] Cards clicáveis → navegação para chat
- [ ] Animações de hover/click
- [ ] Status visual (online/offline)

**Entregável:** Navegação entre Hub e páginas de agentes funcionando

---

## Semana 2: Páginas dos 7 Agentes

### Dia 1-2: Agente Kimi (protótipo)
- [ ] Página completa com chat
- [ ] Personalidade definida
- [ ] Welcome message
- [ ] Mock de respostas

### Dia 3-4: Demais Agentes
- [ ] Radar de Insights
- [ ] Gestor de Tráfego
- [ ] Planejamento Social
- [ ] Atendente Totum
- [ ] SDR Comercial
- [ ] Radar de Anúncios

### Dia 5: Polish e Consistência
- [ ] Cores diferentes por agente
- [ ] Ícones e avatares
- [ ] Animações (Framer Motion)
- [ ] Responsividade

**Entregável:** 7 páginas de chat 100% funcionais (visualmente)

---

## Semana 3: Dashboard Core

### Dia 1-2: Dashboard Layout
- [ ] Sidebar de navegação
- [ ] Header com user info
- [ ] Grid system para widgets
- [ ] Dark mode completo

### Dia 3-4: Dashboard Widgets
- [ ] Overview Cards (VPS, GitHub, IAs)
- [ ] App Status List
- [ ] Activity Log
- [ ] Resource Usage (mock)

### Dia 5: Admin Panel
- [ ] Gerenciamento de usuários
- [ ] Permissões (Admin/Moderador/User)
- [ ] Convites

**Entregável:** Dashboard visual completo (dados mockados)

---

## Semana 4: Features Avançadas (Frontend)

### Dia 1-2: Tasks Board (Kanban)
```
┌─────────┬─────────┬─────────┬─────────┐
│ BACKLOG │  TODO   │   DOING │  DONE   │
│    5    │    3    │    2    │    8    │
├─────────┼─────────┼─────────┼─────────┤
│ [Card]  │ [Card]  │ [Card]  │ [Card]  │
│ [Card]  │ [Card]  │ [Card]  │ [Card]  │
└─────────┴─────────┴─────────┴─────────┘
```
- [ ] Drag-and-drop (react-beautiful-dnd)
- [ ] Cards com título, descrição, assignee
- [ ] Filtros e busca

### Dia 3-4: Content Pipeline
```
┌────────┬──────────┬───────────┬─────────┬─────────┐
│ IDEAS  │ SCRIPT   │ THUMBNAIL │ FILMING │ EDITING │
│   3    │    2     │     1     │    2    │    4    │
└────────┴──────────┴───────────┴─────────┴─────────┘
```
- [ ] Colunas configuráveis
- [ ] Cards com conteúdo rico
- [ ] Upload de imagens

### Dia 5: Polish Fase 1
- [ ] Animações de transição
- [ ] Loading states
- [ ] Empty states
- [ ] Tooltips e help

**Entregável:** Tasks Board + Content Pipeline visuais

---

**🎯 CHECKPOINT FASE 1:**
- [ ] 7 páginas de chat completas
- [ ] Dashboard com widgets
- [ ] Tasks Board (Kanban)
- [ ] Content Pipeline
- [ ] Design System consistente
- [ ] 100% responsivo
- [ ] Animações suaves
- [ ] Dados mockados funcionando

---

# ⚙️ FASE 2: BACKEND E AUTENTICAÇÃO (3 semanas)

## Semana 5: Auth e Database

### Dia 1-2: Supabase Setup
- [ ] Projeto criado
- [ ] Auth configurado (email/google)
- [ ] Políticas de segurança (RLS)

### Dia 3-4: Database Schema
```sql
-- Tabelas principais
- users (perfil, preferências)
- conversations (chat history)
- messages (individual messages)
- agents (configurações)
- tasks (Tasks Board)
- content_items (Content Pipeline)
```

### Dia 5: API Routes
- [ ] `/api/auth/*` - Autenticação
- [ ] `/api/conversations` - CRUD conversas
- [ ] `/api/messages` - CRUD mensagens

---

## Semana 6: Chat Backend

### Dia 1-2: OpenAI/Groq Integration
- [ ] Setup API keys (cofre seguro)
- [ ] Endpoint `/api/chat`
- [ ] Streaming de respostas

### Dia 3-4: Agent Personalities
- [ ] System prompts por agente
- [ ] Context management
- [ ] Memory (últimas 10 mensagens)

### Dia 5: Real-time
- [ ] Supabase Realtime
- [ ] Updates em tempo real
- [ ] Typing indicators

---

## Semana 7: Backend Features

### Dia 1-2: Tasks Board Backend
- [ ] CRUD de tarefas
- [ ] Drag-and-drop persistence
- [ ] Assignees e labels

### Dia 3-4: Content Pipeline Backend
- [ ] CRUD de itens
- [ ] Upload de arquivos (Storage)
- [ ] Status transitions

### Dia 5: Testing e Polish
- [ ] Testes de integração
- [ ] Error handling
- [ ] Rate limiting

---

**🎯 CHECKPOINT FASE 2:**
- [ ] Auth funcionando
- [ ] Database completo
- [ ] Chat com IA real
- [ ] Histórico persistente
- [ ] Tasks Board funcional
- [ ] Content Pipeline funcional
- [ ] API documentada

---

# 🔌 FASE 3: INTEGRAÇÕES (4 semanas)

## Semana 8: Tools Framework

### Dia 1-2: Tool System
```typescript
interface Tool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}
```

### Dia 3-4: Tools Básicas
- [ ] `search_web` - Busca na web
- [ ] `read_file` - Ler arquivos
- [ ] `write_note` - Salvar notas
- [ ] `schedule_reminder` - Lembretes

### Dia 5: Tool Calling
- [ ] Detecção de intenção
- [ ] Execução de tools
- [ ] Apresentação de resultados

---

## Semana 9: Google Integrations

### Dia 1-2: Google Drive
- [ ] OAuth setup
- [ ] Listar arquivos
- [ ] Ler documentos

### Dia 3-4: Google Sheets
- [ ] Ler/criar planilhas
- [ ] Escrever dados
- [ ] Formatação

### Dia 5: Google Calendar
- [ ] Ver eventos
- [ ] Criar eventos
- [ ] Check disponibilidade

---

## Semana 10: RAG e Documentos

### Dia 1-2: ChromaDB Setup
- [ ] Vector database
- [ ] Embedding function
- [ ] Collections

### Dia 2-3: Document Processing
- [ ] Upload PDF/DOCX/TXT
- [ ] Chunking
- [ ] Embeddings

### Dia 4-5: RAG Pipeline
- [ ] Semantic search
- [ ] Context injection
- [ ] Citações

---

## Semana 11: Webhooks e Automação

### Dia 1-2: Webhook System
- [ ] Receber webhooks
- [ ] Processar eventos
- [ ] Responder a triggers

### Dia 3-4: Scheduled Tasks
- [ ] Cron jobs
- [ ] Heartbeats
- [ ] Recurring tasks

### Dia 5: Notifications
- [ ] Email (Resend)
- [ ] Slack
- [ ] Discord

---

**🎯 CHECKPOINT FASE 3:**
- [ ] Tools framework
- [ ] Integrações Google
- [ ] RAG funcionando
- [ ] Webhooks ativos
- [ ] Scheduled tasks
- [ ] Notificações

---

# 🎛️ FASE 4: MISSION CONTROL AVANÇADO (5 semanas)

## Semana 12: Office View (Visual)

### Conceito: "The Office Digital"
```
┌─────────────────────────────────────────────────────┐
│  The Office                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│    🖥️        🖥️        🖥️        🖥️              │
│   [Miguel]  [Liz]    [Jarvis]  [Kimi]              │
│   Coding    Review   Deploy    Research            │
│                                                     │
│    🖥️        🖥️        🖥️                         │
│   [Radar]   [Gestor] [Social]                      │
│   Analyzing Optimizing Creating                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Dia 1-2: Office Layout
- [ ] Visualização isométrica ou 2D
- [ ] Mesas e computadores
- [ ] Avatares dos agentes

### Dia 3-4: Status Visualization
- [ ] Agentes "trabalhando" (animações)
- [ ] Indicadores de atividade
- [ ] Click para ver detalhes

### Dia 5: Interactions
- [ ] Click em agente → abrir chat
- [ ] Ver tarefa atual
- [ ] Histórico de atividades

---

## Semana 13: Team Structure

### Conceito: Hierarquia de Agentes
```
Chief of Staff (Diretor)
    ├── Miguel (Arquiteto)
    ├── Liz (Operações)
    └── Jarvis (Executor)
        ├── Radar de Insights
        ├── Gestor de Tráfego
        ├── Planejamento Social
        └── ...
```

### Dia 1-2: Team Page
- [ ] Hierarquia visual
- [ ] Cards de agentes
- [ ] Roles e responsabilidades

### Dia 3-4: Subagent Management
- [ ] Criar subagentes
- [ ] Definir escopos
- [ ] Permissões por nível

### Dia 5: Collaboration
- [ ] Agentes se mencionando (@agente)
- [ ] Transferência de tarefas
- [ ] Contexto compartilhado

---

## Semana 14: n8n Integration

### Dia 1-2: n8n Setup
- [ ] Instância self-hosted
- [ ] Conexão com Apps Totum
- [ ] Webhooks bidirecionais

### Dia 3-4: Workflow Sync
- [ ] Exportar workflows do n8n
- [ ] Visualizar no Apps Totum
- [ ] Trigger de workflows

### Dia 5: Custom Nodes
- [ ] Node "Apps Totum"
- [ ] Node para cada agente
- [ ] Templates de workflows

---

## Semana 15: Langflow Integration

### Dia 1-2: Langflow Setup
- [ ] Instância local/cloud
- [ ] API integration
- [ ] Flow import/export

### Dia 3-4: Agent Studio
- [ ] Criar agentes no Langflow
- [ ] Testar no playground
- [ ] Deploy para Apps Totum

### Dia 5: RAG Studio
- [ ] Upload de documentos
- [ ] Testar queries
- [ ] Ajustar chunking/prompts

---

## Semana 16: Polish e Produção

### Dia 1-2: Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching

### Dia 3-4: Security
- [ ] Audit de segurança
- [ ] Permissões granulares
- [ ] Lixeira (30 dias)

### Dia 5: Documentação
- [ ] User guide
- [ ] API docs
- [ ] Video tutorials

---

**🎯 CHECKPOINT FASE 4:**
- [ ] Office View funcionando
- [ ] Team Structure completa
- [ ] n8n integrado
- [ ] Langflow integrado
- [ ] Performance otimizada
- [ ] Segurança reforçada
- [ ] Documentação completa
- [ ] Pronto para produção!

---

# 📋 FEATURES POR MODULO

## 1. Tasks Board
- [ ] Kanban com colunas customizáveis
- [ ] Drag-and-drop
- [ ] Cards com: título, descrição, assignee, labels, due date
- [ ] Filtros (por agente, status, prioridade)
- [ ] Busca
- [ ] Comentários nos cards
- [ ] Atividades/histórico

## 2. Content Pipeline
- [ ] Pipeline visual (colunas = estágios)
- [ ] Cards de conteúdo ricos
- [ ] Upload de imagens/vídeos
- [ ] Scripts e copy
- [ ] Calendário editorial
- [ ] Integração com redes sociais (futuro)

## 3. Office View
- [ ] Visualização de "escritório"
- [ ] Avatares animados dos agentes
- [ ] Status em tempo real (trabalhando, idle, offline)
- [ ] Click para interagir
- [ ] Atividade recente

## 4. Team Structure
- [ ] Hierarquia de agentes
- [ ] Perfis com roles
- [ ] Responsabilidades
- [ ] Subagentes
- [ ] Permissões por nível

---

# 🎯 CHECKPOINTS SEMANAIS

| Semana | Checkpoint | Teste de Validação |
|--------|------------|-------------------|
| 1 | Setup + Chat base | Navegar entre Hub e 1 agente |
| 2 | 7 Agentes | Todos os chats acessíveis |
| 3 | Dashboard | Ver métricas mockadas |
| 4 | Tasks + Pipeline | Criar 3 tarefas, mover no Kanban |
| 5 | Auth + DB | Login, signup funcionando |
| 6 | Chat real | Enviar mensagem, receber resposta real |
| 7 | Backend completo | Persistência funcionando |
| 8 | Tools | Agente usar tool search_web |
| 9 | Google | Ler arquivo do Drive |
| 10 | RAG | Fazer pergunta sobre PDF uploadado |
| 11 | Webhooks | Trigger de evento externo |
| 12 | Office | Ver agentes "trabalhando" |
| 13 | Team | Criar subagente |
| 14 | n8n | Workflow n8n executar |
| 15 | Langflow | Criar agente no Langflow |
| 16 | Produção | Deploy final |

---

# 🛠️ STACK TECNOLÓGICO

## Frontend
- **Framework:** React + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **Animações:** Framer Motion
- **Drag-Drop:** @dnd-kit ou react-beautiful-dnd
- **Icons:** Lucide React
- **State:** Zustand ou React Query

## Backend
- **Auth/DB:** Supabase
- **API:** Edge Functions (Deno)
- **Realtime:** Supabase Realtime
- **Storage:** Supabase Storage
- **Vector DB:** ChromaDB (self-hosted)

## AI/ML
- **LLM:** Groq (llama-3.1-8b) + OpenAI (backup)
- **Embeddings:** OpenAI text-embedding-3-small
- **Framework:** LangChain

## Integrações
- **Automation:** n8n (self-hosted)
- **Prototyping:** Langflow
- **Google:** Google APIs
- **Comms:** Slack, Discord, Email

## Infraestrutura
- **Hosting:** VPS (Hostinger/Contabo)
- **Container:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Opik + LogRocket

---

# 📝 PROMPTS PARA LOVABLE (FASE 1)

## Prompt 1: Chat Pages
```
Crie 7 páginas de chat, uma para cada agente:
- Radar de Insights (Search icon, cor laranja)
- Gestor de Tráfego (TrendingUp, verde)
- Planejamento Social (Share2, roxo)
- Atendente Totum (Headphones, azul)
- SDR Comercial (UserCheck, rosa)
- Kimi (Bot, ciano)
- Radar de Anúncios (Megaphone, amarelo)

Cada página deve ter:
- Sidebar com histórico de conversas
- Área de mensagens com scroll
- Input fixo no bottom
- Header com nome e ícone do agente
- Animações Framer Motion
- Design dark mode

Use o design system existente do projeto.
```

## Prompt 2: Tasks Board
```
Crie um Tasks Board estilo Kanban com:
- 4 colunas: Backlog, Todo, Doing, Done
- Cards arrastáveis entre colunas
- Cards com: título, descrição, assignee (avatar), labels coloridas
- Botão "Nova Tarefa" em cada coluna
- Filtros por agente e label
- Busca por texto
- Dark mode
- Animações suaves
```

## Prompt 3: Content Pipeline
```
Crie um Content Pipeline com:
- 5 colunas: Ideas, Script, Thumbnail, Filming, Editing
- Cards de conteúdo com:
  - Título
  - Descrição/roteiro
  - Upload de imagens
  - Status de aprovação
  - Assignee
- Visual de pipeline de produção
- Dark mode
- Animações
```

## Prompt 4: Office View
```
Crie uma "Office View" - visualização de escritório digital:
- Layout 2D ou isométrico
- Mesas com computadores
- Avatares representando cada agente
- Agentes mostram status:
  - 🟢 Online (trabalhando)
  - 🟡 Idle (disponível)
  - 🔴 Offline
- Click no agente abre chat
- Animações sutis (agentes "respirando", etc.)
- Dark mode
```

## Prompt 5: Team Structure
```
Crie uma página Team Structure:
- Hierarquia visual de agentes
- Cards mostrando:
  - Avatar
  - Nome
  - Role (Arquiteto, Executor, etc.)
  - Responsabilidades
  - Subagentes
- Organização em tree ou grid
- Click para ver perfil detalhado
- Dark mode
```

---

# 🚀 PRÓXIMOS PASSOS

## Imediato (Hoje):
1. [ ] Enviar Prompt 1 para Lovable (Chat Pages)
2. [ ] Aguardar entrega
3. [ ] Testar navegação

## Amanhã:
1. [ ] Enviar Prompt 2 (Tasks Board)
2. [ ] Enviar Prompt 3 (Content Pipeline)

## Esta Semana:
1. [ ] Todos os prompts da Fase 1 entregues
2. [ ] Frontend 100% visual
3. [ ] Iniciar Fase 2 (Backend)

---

**Vamos começar?** 🎯
