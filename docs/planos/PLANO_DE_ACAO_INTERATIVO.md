# 📋 PLANO_DE_ACAO_INTERATIVO.md

> Dashboard visual de acompanhamento do Plano de Implementação 30 Dias  
> Design System: Totum (#f76926)  
> Status: Template para implementação no Lovable

---

## 🎨 ESPECIFICAÇÃO VISUAL

### Layout Geral
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Plano de Ação - Implementação Totum Agents        │
│  [Progresso Geral: 45%] [Dias Restantes: 23] [Status: 🟡]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CALENDÁRIO VISUAL (Timeline Horizontal)                    │
│  ━━●━━━━━━━━●━━━━━━━━●━━━━━━━━●━━━━━━━━●━━━━━━━━━━━▶       │
│    D1-7    D8-14   D15-21  D22-28  D29-30                   │
│   [Setup] [Front] [Back] [Agents] [Live]                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 1: SETUP DE INFRAESTRUTURA (Dias 1-7)                │
│  ████████████████████░░░░░░  80%                           │
│                                                             │
│  ◻️ T1.1 Configurar VPS Stark.......................[0%]   │
│  ◻️ T1.2 Instalar Docker e dependências............[0%]    │
│  ◻️ T1.3 Setup banco de dados......................[0%]    │
│  ◻️ T1.4 Configurar CI/CD GitHub Actions...........[0%]    │
│  ◻️ T1.5 Setup ambiente de staging.................[0%]    │
│  ◻️ T1.6 Configurar SSL e domínio..................[0%]    │
│  ◻️ T1.7 Documentação técnica inicial..............[0%]    │
│                                                             │
│  [Ver detalhes] [Marcar tudo como feito]                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 2: FRONTEND LOVABLE (Dias 8-14) 🔄 EM ANDAMENTO      │
│  ██████████████░░░░░░░░░░░░  55%                           │
│                                                             │
│  ☑️ T2.1 Prompt Dashboard Agentes no Lovable........[100%] │
│  ☑️ T2.2 Prompt Cadastro Cliente....................[100%] │
│  ☑️ T2.3 Prompt Perfil Agente.......................[100%] │
│  ◻️ T2.4 Prompt Central Clientes....................[60%]  │
│  ◻️ T2.5 Prompt Workflow Visual.....................[30%]  │
│  ◻️ T2.6 Integração com APIs........................[0%]   │
│  ◻️ T2.7 Testes e ajustes UI/UX.....................[0%]   │
│                                                             │
│  [Ver detalhes] [Marcar tudo como feito]                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 3: BACKEND E APIs (Dias 15-21) ⏳ PENDENTE           │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░  0%                            │
│                                                             │
│  ◻️ T3.1 Criar APIs REST para agentes...............[0%]   │
│  ◻️ T3.2 Integração n8n.............................[0%]   │
│  ◻️ T3.3 Integração Kommo...........................[0%]   │
│  ◻️ T3.4 Webhooks configurados......................[0%]   │
│  ◻️ T3.5 Autenticação e autorização.................[0%]   │
│  ◻️ T3.6 Rate limiting e segurança..................[0%]   │
│  ◻️ T3.7 Documentação API (Swagger).................[0%]   │
│                                                             │
│  [Ver detalhes] [Marcar tudo como feito]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM APLICADO

### Cores
```css
/* Primária */
--totum-primary: #f76926;
--totum-primary-hover: #e55a1b;
--totum-primary-light: #fff5f0;

/* Status */
--status-done: #10b981;      /* Verde - Concluído */
--status-progress: #f76926;  /* Laranja - Em andamento */
--status-pending: #9ca3af;   /* Cinza - Pendente */
--status-blocked: #ef4444;   /* Vermelho - Bloqueado */

/* Backgrounds */
--bg-primary: #fafafa;
--bg-card: #ffffff;
--bg-hover: #f3f4f6;
```

### Tipografia
```css
font-family: 'Inter', sans-serif;

/* Títulos */
--h1: 600 28px/1.2 'Inter';
--h2: 600 20px/1.3 'Inter';
--h3: 600 16px/1.4 'Inter';

/* Corpo */
--body: 400 14px/1.5 'Inter';
--small: 400 12px/1.5 'Inter';

/* Labels */
--label: 500 11px/1.4 'Inter' uppercase;
```

---

## 📊 COMPONENTES DETALHADOS

### 1. HEADER DO PLANO

```typescript
interface HeaderProps {
  title: string;
  overallProgress: number;  // 0-100
  daysRemaining: number;
  status: 'on-track' | 'at-risk' | 'delayed';
}
```

**Visual:**
- Background: gradiente linear(to right, #f76926, #e55a1b)
- Título: branco, 28px, font-weight 600
- Progresso: barra circular com porcentagem no centro
- Dias restantes: badge branco com texto laranja
- Status: emoji indicador (🟢🟡🔴)

---

### 2. TIMELINE/CALENDÁRIO VISUAL

```typescript
interface TimelineProps {
  phases: Phase[];
  currentDay: number;
}

interface Phase {
  id: string;
  name: string;
  days: string;  // "1-7"
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
}
```

**Visual:**
- Linha horizontal conectando todas as fases
- Cada fase é um node circular
- Node ativo: maior, com pulse animation
- Linha preenchida até o ponto atual
- Hover: tooltip com resumo da fase

**Interações:**
- Click no node: scroll suave para a fase
- Hover: mostra datas e progresso

---

### 3. CARD DE FASE

```typescript
interface PhaseCardProps {
  phase: {
    id: string;
    name: string;
    days: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'pending';
    responsible: string;  // "Usuário" | "Claude" | "Ambos"
  };
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  progress: number;
  status: 'done' | 'in-progress' | 'pending' | 'blocked';
  assignee: 'user' | 'claude' | 'both';
  dependencies?: string[];
  estimatedHours: number;
}
```

**Visual:**
- Card com sombra suave (shadow-sm)
- Header com: nome da fase, badge de dias, progresso geral
- Barra de progresso da fase (height: 8px, rounded)
- Lista de tasks com checkbox
- Cada task: checkbox + título + assignee badge + progresso

**Cores por status:**
- ☑️ Concluído: verde, tachado
- 🔄 Em andamento: laranja, animação sutil
- ⏳ Pendente: cinza
- 🚫 Bloqueado: vermelho, ícone de aviso

---

### 4. CHECKLIST DE TAREFAS

**Item de Task:**
```
[☑️] T2.1 Prompt Dashboard Agentes no Lovable
     [██████████] 100%  [Claude]  [2h gastas]
     
[🔄] T2.4 Prompt Central Clientes
     [██████░░░░] 60%   [Ambos]   [4h/6h estimadas]
     
[⏳] T2.6 Integração com APIs
     [░░░░░░░░░░] 0%    [Claude]  [Aguardando T2.5]
```

**Interações:**
- Checkbox: toggle done/pending
- Slider de progresso: 0-100%
- Click: expandir detalhes
- Hover: mostrar dependências

---

### 5. BADGE DE RESPONSÁVEL

```typescript
type Assignee = 'user' | 'claude' | 'both';
```

**Visual:**
- **Usuário:** Badge azul `#3b82f6` com ícone 👤
- **Claude:** Badge roxo `#8b5cf6` com ícone 🤖
- **Ambos:** Badge gradiente laranja com ícone 👥

---

## 📱 RESPONSIVIDADE

### Desktop (>1024px)
- Timeline horizontal no topo
- Cards de fase em coluna única
- Full interatividade

### Tablet (768px-1024px)
- Timeline horizontal compacto
- Cards mantidos
- Checkboxes maiores (touch-friendly)

### Mobile (<768px)
- Timeline vertical (swipe)
- Cards full-width
- Accordion para tasks (expandir/colapsar)
- Floating action button para "Nova Tarefa"

---

## ⚡ FUNCIONALIDADES

### 1. Atualização de Progresso
- Slider interativo 0-100%
- Auto-save ao soltar
- Sincronização em tempo real (se multiusuário)

### 2. Marcar como Feito
- Checkbox principal marca todos
- Animação de confete ao completar fase
- Som sutil (opcional)

### 3. Filtros
- Ver apenas minhas tarefas (Usuário)
- Ver apenas tarefas do Claude
- Ver bloqueadas
- Ver concluídas

### 4. Notificações
- Alerta quando tarefa próxima do prazo
- Notificação quando dependência concluída
- Alerta de bloqueio

### 5. Comentários
- Cada task pode ter thread de comentários
- @mentions funcionais
- Anexos de imagem

---

## 🔧 PROMPT PARA LOVABLE

```
Crie um dashboard de Plano de Ação interativo para gestão de projeto de implementação de sistema multi-agente.

ESTRUTURA:
1. Header com:
   - Título "Plano de Ação - Implementação Totum Agents"
   - Progresso geral circular (45%)
   - Dias restantes (23)
   - Status indicator (🟡 Em andamento)

2. Timeline horizontal com 5 fases:
   - Fase 1: Setup (Dias 1-7) ✅
   - Fase 2: Frontend (Dias 8-14) 🔄
   - Fase 3: Backend (Dias 15-21) ⏳
   - Fase 4: Agentes (Dias 22-28) ⏳
   - Fase 5: Go Live (Dias 29-30) ⏳

3. Cards de cada fase contendo:
   - Header: Nome, dias, progresso geral (barra)
   - Lista de tasks com:
     * Checkbox interativo
     * Código + Título
     * Barra de progresso individual
     * Badge de responsável (Usuário/Claude/Ambos)
   - Botões: "Ver detalhes", "Marcar tudo"

DESIGN SYSTEM:
- Cor primária: #f76926 (laranja Totum)
- Fonte: Inter
- Cards: branco com sombra suave
- Status: Verde (#10b981) concluído, Laranja (#f76926) andamento, Cinza (#9ca3af) pendente
- Animações suaves em todas as transições

FUNCIONALIDADES:
- Checkbox marca task como done/pending
- Slider ajusta porcentagem de progresso
- Filtro por responsável
- Timeline clicável navega para fase
- Responsivo (mobile-first)

DADOS DE EXEMPLO:
Use as tarefas do PLANO_IMPLEMENTACAO_30DIAS.md
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup (Dias 1-7)
- [ ] T1.1 Configurar VPS Stark
- [ ] T1.2 Instalar Docker e dependências
- [ ] T1.3 Setup banco de dados
- [ ] T1.4 Configurar CI/CD GitHub Actions
- [ ] T1.5 Setup ambiente de staging
- [ ] T1.6 Configurar SSL e domínio
- [ ] T1.7 Documentação técnica inicial

### Fase 2: Frontend Lovable (Dias 8-14)
- [ ] T2.1 Prompt Dashboard Agentes no Lovable
- [ ] T2.2 Prompt Cadastro Cliente
- [ ] T2.3 Prompt Perfil Agente
- [ ] T2.4 Prompt Central Clientes
- [ ] T2.5 Prompt Workflow Visual
- [ ] T2.6 Integração com APIs
- [ ] T2.7 Testes e ajustes UI/UX

### Fase 3: Backend e APIs (Dias 15-21)
- [ ] T3.1 Criar APIs REST para agentes
- [ ] T3.2 Integração n8n
- [ ] T3.3 Integração Kommo
- [ ] T3.4 Webhooks configurados
- [ ] T3.5 Autenticação e autorização
- [ ] T3.6 Rate limiting e segurança
- [ ] T3.7 Documentação API (Swagger)

### Fase 4: Agentes Core (Dias 22-28)
- [ ] T4.1 Implementar Controlador
- [ ] T4.2 Implementar Cartógrafo
- [ ] T4.3 Implementar Vendedor
- [ ] T4.4 Implementar Diretor Arte
- [ ] T4.5 Implementar Especialista CRM
- [ ] T4.6 Configurar prompts iniciais
- [ ] T4.7 Testar integrações

### Fase 5: Correções da Análise Crítica (Paralelo)
- [ ] T5.1 Criar Orquestrador TARS
- [ ] T5.2 Definir Matriz de Aprovação Financeira
- [ ] T5.3 Implementar Lead Scoring
- [ ] T5.4 Criar Runbook de Incidentes
- [ ] T5.5 Documentar APIs técnicas

### Fase 6: Research & Inovação (Paralelo)
- [ ] T6.1 Pesquisar Agent Swarms
- [ ] T6.2 Implementar memória em 4 camadas
- [ ] T6.3 Configurar ferramentas (n8n, Kommo AI)
- [ ] T6.4 Adicionar métricas avançadas
- [ ] T6.5 Criar dashboard de monitoramento

### Fase 7: Go Live (Dias 29-30)
- [ ] T7.1 Deploy produção
- [ ] T7.2 Testes finais
- [ ] T7.3 Documentação completa
- [ ] T7.4 Treinamento da equipe

---

## 📊 MÉTRICAS DE ACOMPANHAMENTO

| Métrica | Meta | Atual | Status |
|---------|------|-------|--------|
| Progresso Geral | 100% | 45% | 🟡 |
| Tarefas Concluídas | 37 | 17 | 🟡 |
| Tarefas em Andamento | - | 8 | 🟡 |
| Tarefas Pendentes | 0 | 12 | 🟡 |
| Tarefas Bloqueadas | 0 | 0 | 🟢 |
| Dias Restantes | 0 | 23 | 🟡 |
| Velocidade | 1.6/dia | 1.8/dia | 🟢 |

---

## 🎯 PROXIMAÇÃO DE TAREFAS

### Para Usuário:
1. Revisar e aprovar prompts do Lovable
2. Configurar credenciais VPS
3. Testar dashboard inicial

### Para Claude:
1. Finalizar integrações de APIs
2. Implementar agentes Core
3. Criar documentação técnica

### Para Ambos:
1. Review semanal de progresso
2. Ajustar prioridades conforme necessário
3. Resolver bloqueios em conjunto

---

*"Um plano sem acompanhamento é apenas uma lista de desejos."* - TARS
