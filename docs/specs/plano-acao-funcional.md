# ESPECIFICAÇÃO: Plano de Ação Funcional

## 🎯 OBJETIVO
Transformar a página "Plano de Ação" do Apps Totum em um sistema real de gestão de tarefas com kanban, atribuições e atualização automática.

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────┐
│         APPS TOTUM (Frontend)           │
│  ┌─────────────────────────────────┐    │
│  │        PLANO DE AÇÃO            │    │
│  │  ┌─────┐ ┌─────┐ ┌─────┐       │    │
│  │  │TODO │ │DOING│ │DONE │       │    │
│  │  └─────┘ └─────┘ └─────┘       │    │
│  │                                 │    │
│  │  [Kanban com Drag & Drop]       │    │
│  └─────────────────────────────────┘    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         STARK API (Backend)             │
│  ├─ GET    /api/tarefas                 │
│  ├─ POST   /api/tarefas                 │
│  ├─ PATCH  /api/tarefas/:id             │
│  ├─ DELETE /api/tarefas/:id             │
│  └─ POST   /api/tarefas/:id/mover       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         SUPABASE (Database)             │
│  Tabela: tarefas                        │
└─────────────────────────────────────────┘
```

## 📊 ESTRUTURA DO BANCO

### Tabela: `tarefas`

```sql
create table tarefas (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descricao text,
  responsavel text not null, -- 'Israel', 'TOT', 'Pablo Marçal', 'Hug', etc
  status text not null default 'pendente', -- pendente, em_andamento, concluido
  prioridade text not null default 'media', -- urgente, alta, media, baixa
  departamento text, -- tech, design, marketing, operacoes
  data_criacao timestamp with time zone default now(),
  data_atualizacao timestamp with time zone default now(),
  data_deadline timestamp with time zone,
  data_conclusao timestamp with time zone,
  parent_id uuid references tarefas(id), -- para subtarefas
  ordem integer default 0, -- para ordenar no kanban
  tags text[], -- array de tags
  criado_por text default 'Israel',
  foreign key (parent_id) references tarefas(id) on delete cascade
);

-- Índices para performance
create index idx_tarefas_status on tarefas(status);
create index idx_tarefas_responsavel on tarefas(responsavel);
create index idx_tarefas_departamento on tarefas(departamento);
create index idx_tarefas_parent on tarefas(parent_id);
```

## 🔌 API ENDPOINTS

### 1. Listar Tarefas
```http
GET /api/tarefas
Query params:
  ?status=pendente
  ?responsavel=Israel
  ?departamento=tech
  ?parent_id=null (tarefas raiz)

Response:
{
  "tarefas": [
    {
      "id": "uuid",
      "titulo": "string",
      "descricao": "string",
      "responsavel": "Israel|TOT|Pablo Marçal|Hug",
      "status": "pendente|em_andamento|concluido",
      "prioridade": "urgente|alta|media|baixa",
      "departamento": "tech|design|marketing|operacoes",
      "data_deadline": "2026-04-10T00:00:00Z",
      "subtarefas": [...]
    }
  ]
}
```

### 2. Criar Tarefa
```http
POST /api/tarefas
Body:
{
  "titulo": "Instalar Ollama",
  "descricao": "Configurar Ollama no servidor dedicado",
  "responsavel": "Israel",
  "prioridade": "media",
  "departamento": "tech",
  "data_deadline": "2026-04-10",
  "parent_id": null // ou uuid da tarefa pai
}

Response: { "id": "uuid", ... }
```

### 3. Atualizar Tarefa
```http
PATCH /api/tarefas/:id
Body:
{
  "status": "em_andamento",
  "responsavel": "TOT"
}
```

### 4. Mover Tarefa (Kanban)
```http
POST /api/tarefas/:id/mover
Body:
{
  "novo_status": "concluido",
  "nova_ordem": 5
}
```

### 5. Deletar Tarefa
```http
DELETE /api/tarefas/:id
```

## 🎨 COMPONENTES FRONTEND (React)

### 1. KanbanBoard
```tsx
interface KanbanBoardProps {
  tarefas: Tarefa[];
  onMoverTarefa: (id: string, novoStatus: Status, novaOrdem: number) => void;
  onAbrirDetalhes: (tarefa: Tarefa) => void;
}

// Colunas: A Fazer | Em Andamento | Concluído
```

### 2. TarefaCard
```tsx
interface TarefaCardProps {
  tarefa: Tarefa;
  onDragStart: () => void;
  corPrioridade: string;
  avatarResponsavel: string;
}
```

### 3. NovaTarefaModal
```tsx
interface NovaTarefaModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriar: (tarefa: NovaTarefa) => void;
  responsaveis: string[];
  departamentos: string[];
}
```

### 4. Filtros
```tsx
interface FiltrosProps {
  filtros: {
    responsavel: string | null;
    departamento: string | null;
    prioridade: string | null;
  };
  onMudarFiltro: (campo: string, valor: string | null) => void;
}
```

## 🔄 FLUXO DE TRABALHO

### Quando TOT cria uma tarefa:
1. Detecta criação via execução
2. Chama `POST /api/tarefas`
3. Atualiza estado do kanban
4. Notifica Israel (badge, notificação, etc.)

### Quando Israel move no kanban:
1. Drag & drop no card
2. Chama `POST /api/tarefas/:id/mover`
3. Atualiza ordem e status
4. Reordena cards na coluna

### Quando TOT atualiza automaticamente:
1. TOT executa tarefa em background
2. Chama `PATCH /api/tarefas/:id`
3. Status muda para "concluido"
4. Kanban atualiza em tempo real (WebSocket ou polling)

## 📁 ESTRUTURA DE ARQUIVOS

```
apps-totum/
├── src/
│   ├── components/
│   │   └── plano-acao/
│   │       ├── KanbanBoard.tsx
│   │       ├── TarefaCard.tsx
│   │       ├── NovaTarefaModal.tsx
│   │       ├── Filtros.tsx
│   │       └── TarefaDetalhes.tsx
│   ├── hooks/
│   │   └── useTarefas.ts
│   ├── services/
│   │   └── tarefasApi.ts
│   ├── types/
│   │   └── tarefa.ts
│   └── pages/
│       └── PlanoAcao.tsx
└── supabase/
    └── migrations/
        └── 001_create_tarefas.sql
```

## 🎨 DESIGN SYSTEM

### Cores por Status
- **A Fazer:** `#94a3b8` (cinza)
- **Em Andamento:** `#3b82f6` (azul)
- **Concluído:** `#22c55e` (verde)

### Cores por Prioridade
- **Urgente:** `#ef4444` (vermelho)
- **Alta:** `#f97316` (laranja)
- **Média:** `#eab308` (amarelo)
- **Baixa:** `#64748b` (cinza)

### Avatares por Responsável
- **Israel:** 👤
- **TOT:** 🤖
- **Pablo Marçal:** 🌙
- **Hug:** 🔍

## 🚀 IMPLEMENTAÇÃO

### Passo 1: Banco de Dados (5 min)
```sql
-- Executar no Supabase SQL Editor
[SQL da tabela tarefas acima]
```

### Passo 2: API Stark (20 min)
Criar endpoints em `/opt/stark-api/routes/tarefas.js`

### Passo 3: Frontend (1-2 horas)
Implementar componentes React seguindo design system existente

### Passo 4: Integração (30 min)
Conectar tudo e testar

---

**Total estimado:** 2-3 horas de trabalho  
**Complexidade:** Média  
**Prioridade:** 🔴 Alta
