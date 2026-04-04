# data-unifica-agentes-ui

Dashboards para o sistema de agentes da Totum - desenvolvido por Data 🖖

## 🎯 Dashboards Disponíveis

### 1. Dashboard Geral (Visão TOT)
Métricas de todo o ecossistema:
- Agentes ativos/inativos
- Tarefas em execução/fila/concluídas
- Comunicações entre agentes (via N8N)
- Saúde do sistema (Giles, Supabase, etc.)
- Timeline de eventos recentes

### 2. Dashboard por Agente (Visão Individual)
Para cada agente (Miguel, Liz, Jarvis, etc.):
- Tarefas atribuídas a este agente
- Histórico de execuções
- Efetividade/taxa de sucesso
- Créditos/tokens consumidos
- Últimas ações

### 3. Dashboard de Comunicação (N8N)
- Workflows ativos
- Comandos disparados entre agentes
- Fila de mensagens
- Status de integrações
- Erros/falhas de comunicação

### 4. Dashboard de Conhecimento (Giles)
- Documentos indexados
- Consultas realizadas
- Domínios mais acessados
- Crescimento da base de conhecimento

## 🛠️ Stack Tecnológica

- **React** 18.2.0
- **TypeScript** 5.3.3
- **Tailwind CSS** 3.4.1
- **Recharts** 2.12.0
- **Lucide React** (ícones)
- **Vite** 5.1.0

## 📁 Estrutura de Arquivos

```
/src/components/dashboards/
├── DashboardGeral.tsx           # Visão TOT
├── DashboardAgente.tsx          # Visão individual
├── DashboardComunicacao.tsx     # N8N/Integrações
├── DashboardConhecimento.tsx    # Giles/Supabase
├── shared/
│   ├── MetricCard.tsx           # Card de métrica
│   ├── StatusBadge.tsx          # Badge de status
│   └── Timeline.tsx             # Timeline de eventos
└── charts/
    ├── AgentActivityChart.tsx   # Gráfico de atividade
    ├── TaskDistributionChart.tsx # Gráfico de tarefas
    └── CommunicationFlowChart.tsx # Fluxo de comunicação
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📊 Dados

Os dados são mockados inicialmente no arquivo `src/data/mock.ts`.
Futuramente, integrar com:
- Giles API (dados de conhecimento)
- Supabase (dados de tarefas)
- N8N API (workflows e comunicações)

## 🎨 Tema

- **Cor principal:** Light bege (#EAEAE5)
- **Card:** #F5F5F0
- **Texto:** #2C2C2A
- **Sucesso:** #5A8F5A
- **Alerta:** #C4A35A
- **Erro:** #B85C5C
- **Info:** #5A7A9C

## 📝 Integração na Página /agents

```tsx
import { DashboardGeral } from 'data-unifica-agentes-ui';

export default function AgentsPage() {
  return <DashboardGeral />;
}
```

---

Desenvolvido com 🖖 por Data para a Totum
