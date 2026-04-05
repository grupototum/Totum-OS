# 🤖 ESQUEMA N8N-STYLE - HIERARQUIA DE AGENTES TOTUM

## 🎨 DESIGN SYSTEM VISUAL

### Cores por Tipo:
| Tipo | Cor | Hex |
|------|-----|-----|
| Conversacional | Azul | #3B82F6 |
| Processamento | Verde | #10B981 |
| Híbrido | Roxo | #8B5CF6 |
| Infra | Laranja | #F59E0B |
| Orquestrador | Vermelho | #EF4444 |

### Cores por Prioridade:
| Prioridade | Cor | Badge |
|------------|-----|-------|
| 🔴 Crítica | Vermelho | `bg-red-500` |
| 🟠 Alta | Laranja | `bg-orange-500` |
| 🟡 Média | Amarelo | `bg-yellow-500` |
| 🟢 Baixa | Verde | `bg-green-500` |

### Status Visual:
| Status | Ícone | Cor |
|--------|-------|-----|
| ✅ Ativo | 🟢 | Green |
| 🔄 Em Desenvolvimento | 🟡 | Yellow |
| ⏳ Pendente | ⚪ | Gray |
| 🆕 Novo | ⭐ | Blue + Pulse |

---

## 🏗️ ESTRUTURA DO NODE (Componente)

```typescript
interface AgentNode {
  id: string;                    // UUID do agente
  nome: string;                  // Nome exibido
  tipo: 'conversacional' | 'processamento' | 'hibrido' | 'infra' | 'orquestrador';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  status: 'ativo' | 'desenvolvimento' | 'pendente' | 'novo';
  departamento: string;
  responsavel: string;
  
  // Visual N8N
  position: { x: number; y: number };
  inputs: InputPort[];           // Portas de entrada
  outputs: OutputPort[];         // Portas de saída
  
  // Dados
  funcao: string;
  apps_integrados: string[];
  dependencias: string[];        // IDs de agentes que precisam estar prontos
  
  // Métricas
  uso_7dias?: number;
  creditos_gastos?: number;
  tarefas_concluidas?: number;
  
  // Timestamps
  created_at: string;
  isNew: boolean;                // Badge "New"
}

interface InputPort {
  id: string;
  label: string;
  type: 'data' | 'trigger' | 'context';
  required: boolean;
  connectedTo?: string;          // ID do output conectado
}

interface OutputPort {
  id: string;
  label: string;
  type: 'data' | 'action' | 'notification';
  connectedTo?: string[];        // IDs dos inputs conectados
}
```

---

## 🎯 LAYOUT N8N-STYLE (Canvas)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANVAS N8N-STYLE                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    TOOLBAR SUPERIOR                                  │    │
│  │  [+ Agente] [🔍] [💾] [🔄] [⚙️] [📊] [🎬 Executar]                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SIDEBAR ESQUERDA (Biblioteca)                                       │    │
│  │  ┌─────────────────────────────────────┐                            │    │
│  │  │ 🔍 Buscar agentes...               │                            │    │
│  │  └─────────────────────────────────────┘                            │    │
│  │                                                                      │    │
│  │  📁 DEPARTAMENTOS                                                   │    │
│  │  ▼ Atendimento (9)          ▶ Tráfego (10)                          │    │
│  │  ▼ Radar Estratégico (19)   ▶ Infra (6)                             │    │
│  │                                                                      │    │
│  │  🎯 PRIORIDADES                                                     │    │
│  │  🔴 Crítica (15)           🟠 Alta (20)                              │    │
│  │  🟡 Média (14)             🟢 Baixa (3)                              │    │
│  │                                                                      │    │
│  │  ⭐ STATUS                                                          │    │
│  │  ✅ Ativo (7)              🔄 Em Dev (5)                             │    │
│  │  ⏳ Pendente (40)          🆕 Novo (52)                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         CANVAS (Área Principal)                      │    │
│  │                                                                      │    │
│  │                         ┌─────────────┐                              │    │
│  │                         │     TOT     │                              │    │
│  │                         │  🔴 Nível 0 │                              │    │
│  │                         │ Orquestrador│                              │    │
│  │                         └──────┬──────┘                              │    │
│  │                                │                                     │    │
│  │        ┌───────────────────────┼───────────────────────┐            │    │
│  │        │                       │                       │            │    │
│  │        ▼                       ▼                       ▼            │    │
│  │  ┌──────────┐           ┌──────────┐           ┌──────────┐        │    │
│  │  │   DATA   │           │ FIGNALDO │           │   HUG    │        │    │
│  │  │🟣 Nível 1│           │🟢 Nível 1│           │🟢 Nível 1│        │    │
│  │  │ Program  │           │ Design   │           │ Radar    │        │    │
│  │  └────┬─────┘           └────┬─────┘           └────┬─────┘        │    │
│  │       │                      │                      │              │    │
│  │       ▼                      ▼                      ▼              │    │
│  │  ┌──────────┐           ┌──────────┐           ┌──────────┐        │    │
│  │  │Atendente │           │  Radar   │           │  Reportei│        │    │
│  │  │🔴 Nível 2│           │🔴 Nível 2│           │🔴 Nível 2│        │    │
│  │  │  Totum   │           │Estratégico│          │  Meta    │        │    │
│  │  └──────────┘           └──────────┘           └──────────┘        │    │
│  │                                                                      │    │
│  │  [ZOOM: 100%]  [🖱️ Pan]  [📐 Grid]  [🎯 Fit]                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SIDEBAR DIREITA (Propriedades) - Aparece ao selecionar node         │    │
│  │                                                                      │    │
│  │  📋 PROPRIEDADES DO AGENTE                                          │    │
│  │  Nome: [________________]                                           │    │
│  │  Tipo: [Conversacional ▼]                                           │    │
│  │  Prioridade: [🔴 Crítica ▼]                                          │    │
│  │  Status: [⏳ Pendente ▼]                                             │    │
│  │  Responsável: [Pablo ▼]                                             │    │
│  │                                                                      │    │
│  │  📊 MÉTRICAS                                                        │    │
│  │  Uso 7 dias: ████████░░ 80%                                         │    │
│  │  Créditos: R$ 45,00                                                 │    │
│  │  Tarefas: 12/15                                                     │    │
│  │                                                                      │    │
│  │  🔌 CONEXÕES                                                        │    │
│  │  Entradas: 2 conectadas                                             │    │
│  │  Saídas: 3 conectadas                                               │    │
│  │                                                                      │    │
│  │  [🗑️ Excluir] [💾 Salvar]                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 SISTEMA DE CONEXÕES (N8N-Style)

### Tipos de Conexão:
```
Input (Esquerda)              Output (Direita)
┌──────────┐                  ┌──────────┐
│  ● Data  │ ───────────────→ │ Data ●   │
│  ● Trigger│ ───────────────→ │ Action ● │
│  ● Context│ ───────────────→ │ Notify ● │
└──────────┘                  └──────────┘
```

### Fluxos Possíveis:
1. **Trigger → Action**: Agente A detecta → Agente B executa
2. **Data → Process**: Agente A gera dados → Agente B processa
3. **Context → Decision**: Contexto → Agente decide → Múltiplos outputs

---

## 🎨 COMPONENTE REACT (Exemplo)

```tsx
// AgentNode.tsx
interface Props {
  agent: AgentNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
}

const AgentNode: React.FC<Props> = ({ agent, isSelected, onSelect }) => {
  const getColorByType = (tipo: string) => {
    switch(tipo) {
      case 'conversacional': return 'bg-blue-500';
      case 'processamento': return 'bg-green-500';
      case 'hibrido': return 'bg-purple-500';
      case 'infra': return 'bg-orange-500';
      case 'orquestrador': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={`
        relative w-48 rounded-lg border-2 shadow-lg cursor-pointer
        ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-300'}
        ${getColorByType(agent.tipo)}
      `}
      onClick={() => onSelect(agent.id)}
    >
      {/* Badge New */}
      {agent.isNew && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          🆕 New
        </span>
      )}
      
      {/* Prioridade */}
      <div className={`
        absolute -top-2 -left-2 w-4 h-4 rounded-full border-2 border-white
        ${agent.prioridade === 'critica' ? 'bg-red-500' : ''}
        ${agent.prioridade === 'alta' ? 'bg-orange-500' : ''}
        ${agent.prioridade === 'media' ? 'bg-yellow-500' : ''}
        ${agent.prioridade === 'baixa' ? 'bg-green-500' : ''}
      `} />
      
      {/* Header */}
      <div className="bg-white rounded-t-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {agent.tipo === 'conversacional' && '💬'}
            {agent.tipo === 'processamento' && '⚙️'}
            {agent.tipo === 'hibrido' && '🔀'}
            {agent.tipo === 'infra' && '🔧'}
            {agent.tipo === 'orquestrador' && '🎯'}
          </span>
          <span className="font-semibold text-sm truncate">{agent.nome}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">{agent.departamento}</div>
      </div>
      
      {/* Body */}
      <div className="p-3 text-white text-xs">
        <div className="truncate">{agent.funcao}</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="bg-white/20 px-2 py-1 rounded">{agent.responsavel}</span>
          <StatusBadge status={agent.status} />
        </div>
      </div>
      
      {/* Input Ports (Esquerda) */}
      <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2">
        {agent.inputs.map((input, i) => (
          <div 
            key={input.id}
            className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full hover:border-blue-500 cursor-crosshair"
            title={input.label}
          />
        ))}
      </div>
      
      {/* Output Ports (Direita) */}
      <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 space-y-2">
        {agent.outputs.map((output, i) => (
          <div 
            key={output.id}
            className="w-3 h-3 bg-white border-2 border-gray-400 rounded-full hover:border-green-500 cursor-crosshair"
            title={output.label}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 📋 LISTA POR GUIA (Para Criarmos Juntos)

### 🔴 GUIA 1: AGENTES CRÍTICOS (15 agentes)
**Deadline: Próximas 2 semanas**

| # | Agente | Departamento | Tipo | Responsável |
|---|--------|--------------|------|-------------|
| 1 | **MEX - Motor de Execução** | Infra | Infra | Data |
| 2 | **Atendente Totum** | Atendimento | Híbrido | Pablo |
| 3 | **Classificador de Demandas** | Atendimento | Processamento | Data |
| 4 | **Gestor de Tráfego** | Tráfego | Conversacional | Pablo |
| 5 | **Auditor Diário de Performance** | Tráfego | Processamento | Pablo |
| 6 | **Detector de Anomalias** | Tráfego | Processamento | Pablo |
| 7 | **Protetor de Contas** | Tráfego | Processamento | Pablo |
| 8 | **Radar Estratégico (por cliente)** | Radar | Conversacional | Pablo |
| 9 | **Entrada de Metadados** | Radar | Processamento | Data |
| 10 | **Sugestor de Stories** | Radar | Processamento | Pablo |
| 11 | **Pesquisador de Trends TikTok** | Radar | Processamento | Pablo |
| 12 | **Pesquisador de Trends Instagram** | Radar | Processamento | Pablo |
| 13 | **Sugestor de Hooks** | Radar | Processamento | Pablo |
| 14 | **Criador de Ideias de Reels** | Radar | Processamento | Pablo |
| 15 | **Indicador de Conteúdo para Ads** | Radar | Processamento | Pablo |

### 🟠 GUIA 2: AGENTES ALTA (20 agentes)
**Deadline: 3-4 semanas**

| # | Agente | Departamento | Tipo | Responsável |
|---|--------|--------------|------|-------------|
| 16 | **Verificador de Churn** | Atendimento | Processamento | Pablo |
| 17 | **Mataburro Atendimento** | Atendimento | Híbrido | Pablo |
| 18 | **Mataburro SLA Tráfego** | Tráfego | Híbrido | Pablo |
| 19 | **Gerador de Insight Semanal** | Tráfego | Processamento | Pablo |
| 20 | **Escala Inteligente** | Tráfego | Processamento | Pablo |
| ... | ... | ... | ... | ... |

---

## 🔗 INTEGRAÇÃO COM APPS TOTUM

### Tabela `agentes` no Supabase:
```sql
CREATE TABLE public.agentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    departamento TEXT NOT NULL,
    funcao TEXT NOT NULL,
    tipo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    prioridade TEXT NOT NULL DEFAULT 'media',
    responsavel TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    dependencias TEXT[],
    apps_integrados TEXT[],
    inputs JSONB DEFAULT '[]',
    outputs JSONB DEFAULT '[]',
    uso_7dias INTEGER DEFAULT 0,
    creditos_gastos DECIMAL DEFAULT 0,
    tarefas_concluidas INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

*Design System criado por: TOT + Fignaldo*  
*Data: 2026-04-04*