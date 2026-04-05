# TAREFA: Criar Página de Agentes Hierárquica

## 🎯 OBJETIVO
Unificar todas as páginas sobre agentes em uma única página com:
- Visualização hierárquica (N1, N2, etc.)
- Listagem por departamento
- Estrutura de pastas/subpastas (agentes e subagentes)
- Design System atual

## 🏗️ ESTRUTURA VISUAL

```
┌─────────────────────────────────────────┐
│  🤖 AGENTES - TOTUM                     │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  🔍 Filtros: [Todos ▼] [Buscar] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📁 TECNOLOGIA                           │
│  ├─ 🌙 Pablo Marçal (N1)                │
│  │  └─ 🤖 [Subagentes noturnos]         │
│  ├─ 🔍 Hug (N1)                         │
│  │  └─ 📊 Toolify Scanner               │
│  │  └─ 🦾 Hugging Face Radar            │
│  └─ ⚡ Stark (N2)                       │
│                                         │
│  📁 OPERAÇÕES                            │
│  ├─ 🛡️ Sentinela (N1)                   │
│  │  └─ 🔧 Zelador                       │
│  │  └─ 👻 Ghost                         │
│  └─ 📈 Reportei (em desenvolvimento)    │
│                                         │
│  📁 DESIGN                               │
│  ├─ 🎨 Fignaldo (N2)                    │
│  └─ 🖼️ KVirtuoso (N2)                   │
│                                         │
│  📁 MARKETING                            │
│  └─ 📣 Radar de Anúncios + Criador      │
│                                         │
│  [+] Criar Novo Agente                  │
└─────────────────────────────────────────┘
```

## 📊 HIERARQUIA DE AGENTES

### Nível N0 (Orquestrador Principal)
- **TOT** (Eu) - Orquestrador geral

### Nível N1 (Agentes Principais)
| Agente | Função | Departamento | Status |
|--------|--------|--------------|--------|
| Pablo Marçal | Trabalho noturno | Tech | ✅ Ativo |
| Hug | Radar de ferramentas | Tech | ✅ Ativo |
| Sentinela | Monitoramento 24/7 | Operações | ✅ Ativo |

### Nível N2 (Agentes Especializados)
| Agente | Função | Departamento | Status |
|--------|--------|--------------|--------|
| Stark | API e backend | Tech | ✅ Ativo |
| Fignaldo | Design System → Figma | Design | 🔄 Planejado |
| KVirtuoso | Criador de postagens | Design | 🔄 Planejado |
| Reportei | Analytics social | Operações | 🔄 Planejado |

### Subagentes (N3+)
- **Toolify Scanner** (filho do Hug)
- **Hugging Face Radar** (filho do Hug)
- **Zelador** (filho da Sentinela)
- **Ghost** (filho da Sentinela)

## 🎨 COMPONENTES

### 1. TreeView (Estrutura de Pastas)
```tsx
interface TreeViewProps {
  departamentos: Departamento[];
  onSelecionarAgente: (agente: Agente) => void;
  onExpandir: (id: string) => void;
}

// Expansível/colapsável
// Ícones de pasta aberta/fechada
// Indentação por nível
```

### 2. AgenteCard (Miniatura)
```tsx
interface AgenteCardProps {
  nome: string;
  emoji: string;
  nivel: 'N0' | 'N1' | 'N2' | 'N3';
  status: 'ativo' | 'planejado' | 'pausado';
  descricao_curta: string;
  onClick: () => void;
}
```

### 3. AgenteDetalhes (Modal/Página)
```tsx
interface AgenteDetalhesProps {
  agente: Agente;
  subtarefas: Tarefa[];
  logs_recentes: Log[];
  onEditar: () => void;
  onExecutar: () => void;
}
```

## 📁 ESTRUTURA DE DADOS

```typescript
interface Agente {
  id: string;
  nome: string;
  emoji: string;
  nivel: 'N0' | 'N1' | 'N2' | 'N3';
  departamento: 'tech' | 'design' | 'marketing' | 'operacoes';
  descricao: string;
  personalidade: string;
  funcao: string;
  status: 'ativo' | 'planejado' | 'pausado' | 'arquivado';
  parent_id: string | null; // para hierarquia
  responsavel: string; // quem criou/gerencia
  data_criacao: string;
  ultima_atividade: string;
  tarefas_concluidas: number;
  tarefas_pendentes: number;
}

interface Departamento {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  agentes: Agente[];
}
```

## 🔗 INTEGRAÇÕES

### Com Plano de Ação
- Ao clicar em agente, mostrar tarefas atribuídas a ele
- Permitir criar nova tarefa diretamente para o agente

### Com Dashboard
- Card resumo: "X agentes ativos"
- Alerta: "Pablo Marçal trabalhando"

### Com Logs
- Histórico de execuções do agente
- Estatísticas de performance

## 🎨 DESIGN SYSTEM

### Cores por Departamento
- **Tech:** `#3b82f6` (azul)
- **Design:** `#ec4899` (rosa)
- **Marketing:** `#f59e0b` (laranja)
- **Operações:** `#10b981` (verde)

### Badge de Nível
- **N0:** ⭐ Dourado
- **N1:** 🔴 Vermelho
- **N2:** 🟡 Amarelo
- **N3:** 🔵 Azul

### Status
- **Ativo:** 🟢 Pulso suave
- **Planejado:** 🟡 Estático
- **Pausado:** 🔘 Cinza
- **Arquivado:** ⚪ Opaco

## 🚀 IMPLEMENTAÇÃO

### Fase 1: Estrutura (30 min)
1. Criar tabela `agentes` no Supabase
2. Popular com agentes existentes
3. Criar relacionamentos hierárquicos

### Fase 2: API (30 min)
1. Endpoints CRUD para agentes
2. Endpoint para hierarquia (tree)
3. Filtros por departamento/status

### Fase 3: Frontend (1-2 horas)
1. Componente TreeView
2. Componente AgenteCard
3. Página principal com filtros
4. Modal de detalhes

### Fase 4: Integração (30 min)
1. Conectar com Plano de Ação
2. Links nos cards do Dashboard
3. Testes e ajustes

---

**Tempo estimado:** 2-3 horas  
**Prioridade:** 🟡 Média  
**Dependências:** Nenhuma
