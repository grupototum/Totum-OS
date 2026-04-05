# LOVABLE PROMPTS COMPLETOS - ESPECIFICAÇÃO TÉCNICA

> Documento técnico para implementação de interface no Lovable.dev  
> Versão: 1.0  
> Data: Abril 2026

---

## 🎨 DESIGN SYSTEM

### Cores
```
Primária:       #f76926 (Laranja)
Primária Hover: #e55a1b
Primária Light: #fff5f0

Secundária:     #1a1a2e (Azul escuro)
Secundária Light: #2d2d44

Background:     #fafafa
Surface:        #ffffff
Border:         #e5e5e5

Text Primary:   #1a1a2e
Text Secondary: #6b7280
Text Muted:     #9ca3af

Success:        #10b981
Warning:        #f59e0b
Error:          #ef4444
Info:           #3b82f6
```

### Tipografia
```
Fonte: Inter (Google Fonts)
H1: 32px / 700 / -0.02em
H2: 24px / 600 / -0.01em
H3: 20px / 600 / 0
H4: 16px / 600 / 0
Body: 14px / 400 / 0.01em
Small: 12px / 400 / 0
```

### Espaçamentos
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

### Border Radius
```
sm: 6px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

### Sombras
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.07)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

---

## 📌 PROMPT 1: DASHBOARD DE AGENTES

### Contexto
Dashboard principal de visão geral de todos os agentes de IA do sistema, exibindo status em tempo real, estatísticas de uso e ações rápidas.

### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (64px)                                                    │
│ [Logo]  Dashboard de Agentes                [Notificações] [User]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STATS BAR (4 cards)                                      │    │
│  │ [Total Agentes] [Ativos] [Execuções Hoje] [Taxa Sucesso] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ FILTERS & ACTIONS BAR                                    │    │
│  │ [Search ___] [Status ▼] [Categoria ▼]  [+ Novo Agente]  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ GRID DE AGENTES (8 cards - 4 colunas desktop, 2 tablet) │    │
│  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                        │    │
│  │ │ A1  │ │ A2  │ │ A3  │ │ A4  │                        │    │
│  │ └─────┘ └─────┘ └─────┘ └─────┘                        │    │
│  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                        │    │
│  │ │ A5  │ │ A6  │ │ A7  │ │ A8  │                        │    │
│  │ └─────┘ └─────┘ └─────┘ └─────┘                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ GRÁFICO DE USO (últimos 7 dias) + AÇÕES RÁPIDAS         │    │
│  │ [AreaChart]                         [Quick Actions List]│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Detalhados

#### 1. HEADER
```typescript
interface HeaderProps {
  title: string;
  notifications: number;
  user: { name: string; avatar: string };
}
```
- **Altura**: 64px
- **Background**: #ffffff
- **Border-bottom**: 1px solid #e5e5e5
- **Sombra**: sm
- **Logo**: 32x32px, ícone laranja #f76926
- **Título**: 20px / 600 / #1a1a2e
- **Ícone Notificações**: Bell, 20px, badge vermelho com número
- **Avatar**: 36x36px, border-radius: full

#### 2. STATS BAR (4 CARDS)
```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  change: number; // percentual
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
}
```

**Card de Estatística:**
- **Background**: #ffffff
- **Padding**: 20px
- **Border-radius**: 12px
- **Border**: 1px solid #e5e5e5
- **Sombra**: sm
- **Hover**: sm → md, border-color: #f76926 (transição 200ms ease)

**Conteúdo:**
- Ícone: 40x40px, background #fff5f0, border-radius: 10px, ícone #f76926 (24px)
- Valor: 28px / 700 / #1a1a2e
- Label: 14px / 400 / #6b7280
- Variação: badge com ícone trend (up: #10b981, down: #ef4444)

**Cards:**
1. **Total Agentes**: Users icon, valor: "8", change: +12%
2. **Agentes Ativos**: Activity icon, valor: "6", change: +5%
3. **Execuções Hoje**: Zap icon, valor: "1.247", change: +23%
4. **Taxa de Sucesso**: CheckCircle icon, valor: "98.5%", change: +1.2%

#### 3. FILTERS & ACTIONS BAR
```typescript
interface FilterBarProps {
  searchQuery: string;
  statusFilter: 'all' | 'active' | 'inactive' | 'error';
  categoryFilter: string;
}
```

**Container:**
- **Display**: flex, justify-between, align-center
- **Padding**: 16px 0
- **Gap**: 16px

**Search Input:**
- **Width**: 280px
- **Height**: 40px
- **Background**: #ffffff
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 8px
- **Padding**: 0 16px 0 40px (ícone Search left: 12px)
- **Placeholder**: "Buscar agentes..."
- **Focus**: border-color #f76926, ring 2px rgba(247,105,38,0.2)

**Dropdowns:**
- **Width**: 140px
- **Height**: 40px
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 8px
- **Icon**: ChevronDown, 16px
- **Hover**: border-color #d1d5db

**Botão Novo Agente:**
- **Height**: 40px
- **Padding**: 0 20px
- **Background**: #f76926
- **Color**: #ffffff
- **Border-radius**: 8px
- **Font**: 14px / 600
- **Icon**: Plus (16px, left)
- **Hover**: background #e55a1b, transform: translateY(-1px)
- **Active**: transform: translateY(0)

#### 4. AGENTE CARD
```typescript
interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'paused';
  category: string;
  executionsToday: number;
  successRate: number;
  lastActivity: string;
  avatar: string;
}
```

**Card Container:**
- **Background**: #ffffff
- **Padding**: 20px
- **Border-radius**: 16px
- **Border**: 1px solid #e5e5e5
- **Sombra**: sm
- **Hover**: sm → lg, border-color: #f76926, transform: translateY(-2px)
- **Transição**: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- **Cursor**: pointer

**Header do Card:**
- **Display**: flex, justify-between
- Avatar: 48x48px, border-radius: 12px
- Status Indicator: 10px circle, position: absolute top-right of avatar
  - active: #10b981 (com pulse animation)
  - inactive: #9ca3af
  - error: #ef4444 (com pulse animation)
  - paused: #f59e0b
- Menu: 3 dots vertical, 16px, opacity 0.6 → 1 on hover

**Body do Card:**
- Nome: 16px / 600 / #1a1a2e, line-clamp: 1
- Descrição: 13px / 400 / #6b7280, line-clamp: 2, margin-top: 4px
- Categoria: Badge, 11px / 500 / #f76926, bg #fff5f0, padding 4px 10px, border-radius: full

**Stats do Card:**
- **Display**: flex, gap: 16px
- **Margin-top**: 16px
- **Padding-top**: 16px
- **Border-top**: 1px solid #f3f4f6
- Item: flex column
  - Label: 11px / 400 / #9ca3af
  - Valor: 14px / 600 / #1a1a2e

**Footer do Card:**
- **Margin-top**: 12px
- Última atividade: 12px / 400 / #9ca3af, Clock icon (12px)

**8 Agentes de Exemplo:**
1. **Ana** - Assistente de Atendimento (active)
2. **Bruno** - Qualificador de Leads (active)
3. **Carla** - Copywriter de Ads (active)
4. **Diego** - Analista de Dados (paused)
5. **Elisa** - Gestora de CRM (active)
6. **Felipe** - Gerador de Conteúdo (active)
7. **Gabriela** - Especialista em SEO (error)
8. **Henrique** - Analista Financeiro (inactive)

#### 5. GRÁFICO DE USO + AÇÕES RÁPIDAS

**Container:**
- **Display**: grid, grid-cols: 2fr 1fr
- **Gap**: 24px

**Gráfico (AreaChart):**
- **Height**: 280px
- **Background**: #ffffff
- **Padding**: 24px
- **Border-radius**: 16px
- **Border**: 1px solid #e5e5e5
- Dados: 7 dias (execuções por dia)
- Cor da área: rgba(247,105,38,0.1)
- Cor da linha: #f76926 (2px)
- Pontos: 6px, #f76926, hover: 8px
- Eixos: #9ca3af, 12px
- Tooltip: bg #1a1a2e, color #fff, border-radius: 8px

**Ações Rápidas:**
- **Background**: #ffffff
- **Padding**: 24px
- **Border-radius**: 16px
- **Border**: 1px solid #e5e5e5

**Título**: "Ações Rápidas", 16px / 600 / #1a1a2e

**Lista de Ações:**
```typescript
interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
}
```
- Item: flex, align-center, gap: 12px, padding: 12px, border-radius: 10px
- Hover: background #f9fafb
- Ícone: 36x36px container, bg #fff5f0, ícone #f76926 (18px)
- Label: 14px / 500 / #1a1a2e
- Description: 12px / 400 / #6b7280

**Ações:**
1. [Play] Executar todos os agentes
2. [Pause] Pausar agentes ativos
3. [Settings] Configurar horários
4. [FileText] Exportar relatório

### Estados

#### Loading State
- Skeleton cards: 8 cards com shimmer effect
- Stats: 4 skeleton rectangles
- Chart: skeleton area

#### Empty State
- Ícone: Bot (64px, #e5e5e5)
- Título: "Nenhum agente encontrado"
- Descrição: "Crie seu primeiro agente para começar"
- Botão: "+ Criar Agente"

#### Error State
- Ícone: AlertCircle (64px, #ef4444)
- Título: "Erro ao carregar agentes"
- Descrição: "Tente recarregar a página"
- Botão: "Tentar novamente"

### Responsividade
```
Desktop (≥1280px): 4 colunas de cards
Tablet (≥768px): 2 colunas de cards
Mobile (<768px): 1 coluna de cards, stats em scroll horizontal
```

### Animações
```css
/* Card hover */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Status pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Page load stagger */
animation: fadeInUp 300ms ease-out;
animation-delay: calc(var(--index) * 50ms);
```

---

## 📌 PROMPT 2: PÁGINA DE CADASTRO DE CLIENTE (5 ETAPAS)

### Contexto
Wizard de cadastro de cliente em 5 etapas com validação em tempo real, salvamento automático e preview do perfil sendo construído.

### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER SIMPLIFICADO (56px)                                       │
│ [Logo]  Cadastro de Cliente                    [Salvar Rascunho]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ STEP INDICATOR (5 steps)                                │    │
│  │ ──○────○────○────○────●──                               │    │
│  │  1    2    3    4    5                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────┐  ┌───────────────────────────────┐  │
│  │                        │  │                               │  │
│  │   FORMULÁRIO (etapa    │  │   PREVIEW CARD                │  │
│  │    atual)              │  │   (perfil sendo construído)   │  │
│  │                        │  │                               │  │
│  │   [Campos...]          │  │   [Avatar] [Nome]             │  │
│  │                        │  │   [Progress: 60%]             │  │
│  │                        │  │   [Dados preenchidos]         │  │
│  │                        │  │                               │  │
│  └────────────────────────┘  └───────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ NAVIGATION BAR                                           │    │
│  │ [Voltar]                          [Continuar → / Finalizar]  │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Detalhados

#### 1. STEP INDICATOR
```typescript
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  steps: Array<{
    label: string;
    description: string;
    status: 'completed' | 'current' | 'pending';
  }>;
}
```

**Container:**
- **Display**: flex, justify-center
- **Padding**: 32px 0
- **Background**: #ffffff

**Step Item:**
- **Display**: flex column, align-center
- **Width**: 120px

**Circle:**
- **Size**: 36px
- **Border-radius**: full
- **Font**: 14px / 600
- **States:**
  - completed: bg #f76926, color #fff, icon Check (16px)
  - current: bg #f76926, color #fff, ring 4px rgba(247,105,38,0.2)
  - pending: bg #ffffff, color #9ca3af, border 2px solid #e5e5e5

**Label:**
- **Margin-top**: 8px
- **Font**: 13px / 500
- **Color**: current=#1a1a2e, others=#6b7280

**Conector:**
- **Width**: 60px
- **Height**: 2px
- **States:** completed=#f76926, pending=#e5e5e5

**Steps:**
1. Dados Básicos
2. Contexto de Negócio
3. Público-alvo
4. Identidade Visual
5. Contexto Operacional

#### 2. ETAPA 1: DADOS BÁSICOS
```typescript
interface Step1Data {
  nome: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  website: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  responsavel: {
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
  };
}
```

**Layout:**
- **Grid**: 2 colunas (desktop), 1 coluna (mobile)
- **Gap**: 20px
- **Padding**: 32px

**Campos:**

| Campo | Tipo | Largura | Validação |
|-------|------|---------|-----------|
| Nome da Empresa | text | 100% | required, min 3 |
| Nome Fantasia | text | 100% | - |
| CNPJ | mask | 50% | validação CNPJ |
| Email | email | 50% | validação email |
| Telefone | tel | 50% | mask (99) 99999-9999 |
| Website | url | 50% | - |
| CEP | mask | 33% | auto-fill endereço |
| Rua | text | 67% | - |
| Número | text | 33% | - |
| Complemento | text | 33% | - |
| Bairro | text | 34% | - |
| Cidade | text | 50% | - |
| Estado | select | 50% | UF |

**Título da Seção:** "Responsável pelo Contrato" (divider acima)

| Campo | Tipo | Largura | Validação |
|-------|------|---------|-----------|
| Nome | text | 50% | required |
| Cargo | text | 50% | - |
| Email | email | 50% | required |
| Telefone | tel | 50% | - |

**Input Styling:**
- **Height**: 44px
- **Background**: #ffffff
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 10px
- **Padding**: 0 16px
- **Font**: 14px / 400
- **Placeholder**: #9ca3af
- **Focus**: border #f76926, ring 3px rgba(247,105,38,0.15)
- **Error**: border #ef4444, message abaixo 12px #ef4444
- **Icon left**: 20px, color #9ca3af, margin-left: 12px

#### 3. ETAPA 2: CONTEXTO DE NEGÓCIO
```typescript
interface Step2Data {
  ramoAtividade: string;
  tempoMercado: string;
  porte: 'pequeno' | 'medio' | 'grande';
  faturamentoAnual: string;
  numeroFuncionarios: number;
  descricaoNegocio: string;
  propostaValor: string;
  diferenciais: string[];
  principaisProdutos: string[];
  concorrentes: string[];
  desafios: string[];
  objetivos: string[];
}
```

**Layout:**
- **Grid**: 2 colunas para campos curtos
- **Full width**: textarea

**Campos:**

| Campo | Tipo | Largura |
|-------|------|---------|
| Ramo de Atividade | select | 50% |
| Tempo no Mercado | select | 50% |
| Porte da Empresa | radio group | 100% |
| Faturamento Anual | select | 50% |
| Nº de Funcionários | number | 50% |

**Textarea "Descreva o negócio":**
- **Height**: 120px
- **Resize**: vertical
- **Max-length**: 500 (contador: 0/500)

**Textarea "Proposta de Valor":**
- **Height**: 100px

**Tags Input (Diferenciais):**
- **Componente customizado**
- **Placeholder**: "Digite e pressione Enter"
- **Tag**: bg #fff5f0, color #f76926, border-radius: full, padding 4px 12px
- **Remove**: X icon (12px) on hover

**Checkbox Group (Objetivos):**
- [ ] Aumentar vendas
- [ ] Captar leads
- [ ] Fidelizar clientes
- [ ] Expandir marca
- [ ] Reduzir custos operacionais
- [ ] Melhorar atendimento
- Layout: grid 2 colunas

#### 4. ETAPA 3: PÚBLICO-ALVO (MAPA SEMÂNTICO)
```typescript
interface Step3Data {
  segmentacao: 'b2b' | 'b2c' | 'b2b2c' | 'outro';
  perfilClienteIdeal: {
    demographics: {
      idadeMin: number;
      idadeMax: number;
      genero: 'todos' | 'masculino' | 'feminino';
      renda: string;
      escolaridade: string;
      localizacao: string[];
    };
    psychographics: {
      interesses: string[];
      valores: string[];
      comportamentos: string[];
      dores: string[];
      necessidades: string[];
      objecoes: string[];
    };
  };
  personas: Array<{
    nome: string;
    avatar: string;
    descricao: string;
    caracteristicas: string[];
  }>;
  jornadaCompra: string[];
}
```

**Layout Visual - Mapa Semântico:**

```
┌─────────────────────────────────────────────────────────┐
│ MAPA SEMÂNTICO DO PÚBLICO-ALVO                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │ DEMOGRAFIA  │    │ PSICOGRAFIA │    │  COMPORT.   │ │
│  │             │    │             │    │             │ │
│  │ • Idade     │◄──►│ • Interesses│◄──►│ • Jornada   │ │
│  │ • Gênero    │    │ • Valores   │    │ • Canais    │ │
│  │ • Renda     │    │ • Dores     │    │ • Touchp.   │ │
│  │ • Local     │    │ • Needs     │    │             │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│         ▲                   ▲                   ▲       │
│         └───────────────────┴───────────────────┘       │
│                      [PERSONAS]                         │
│              ┌─────┐ ┌─────┐ ┌─────┐                   │
│              │ P1  │ │ P2  │ │ P3  │                   │
│              └─────┘ └─────┘ └─────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Visualização de Nós (Nodes):**
- **Node**: 140x100px, bg #ffffff, border 2px solid #e5e5e5, border-radius: 12px
- **Título**: 13px / 600 / #1a1a2e
- **Itens**: bullet list, 11px / 400 / #6b7280
- **Hover**: border #f76926, sombra md
- **Conexões**: SVG lines entre os nós, stroke #e5e5e5, stroke-width 2
- **Active Node**: border #f76926, bg #fff5f0

**Edição de Nó (Drawer lateral):**
- **Width**: 400px
- **Background**: #ffffff
- **Sombra**: xl
- **Header**: Título do nó + Close icon
- **Content**: Form fields específicos do nó
- **Footer**: Salvar alterações

**Criação de Persona:**
- **Card**: 200px, bg gradient #fff5f0 → #ffffff
- **Avatar**: upload circular, 80px
- **Nome**: input 16px bold
- **Descrição**: textarea 60px
- **Tags**: características como chips

#### 5. ETAPA 4: KEY VISUAL / IDENTIDADE
```typescript
interface Step4Data {
  logo: {
    principal: File;
    alternativa: File;
    favicon: File;
  };
  cores: {
    primaria: string;
    secundaria: string;
    terciaria: string;
    neutras: string[];
  };
  tipografia: {
    titulos: string;
    corpo: string;
  };
  tomVoz: 'formal' | 'informal' | 'tecnico' | 'divertido' | 'inspirador';
  elementosVisuais: string[];
  restricoes: string;
  guiaMarca: File;
  referenciasVisuais: File[];
}
```

**Upload de Logo:**
- **Área**: 200x120px, dashed border 2px #e5e5e5, border-radius: 12px
- **Ícone**: UploadCloud (32px, #9ca3af)
- **Texto**: "Arraste ou clique para upload"
- **Formatos**: SVG, PNG, JPG (máx 5MB)
- **Preview**: thumbnail 120px com remove button

**Color Picker:**
- **Display**: flex gap 16px
- **Swatch**: 48x48px, border-radius: 10px, cursor pointer
- **Selected**: ring 3px #f76926
- **Picker**: Input type color customizado
- **Hex input**: 100px width

**Paleta Sugerida (gerada automaticamente):**
- Grid de 5 cores baseadas na cor primária
- Cada cor: swatch + hex value + copy button

**Tipografia:**
- Select: Google Fonts (carregado via API)
- Preview: "Aa" em tamanho 48px da fonte selecionada
- Pesos disponíveis: checkbox group

**Tom de Voz (Cards Selecionáveis):**
- **Card**: 140px, border 2px, border-radius: 12px
- **Icon**: 32px Lucide
- **Label**: 14px / 500
- **States:**
  - default: border #e5e5e5, bg #ffffff
  - selected: border #f76926, bg #fff5f0
- **Opções:**
  - Formal (Briefcase icon)
  - Informal (Coffee icon)
  - Técnico (Code icon)
  - Divertido (Smile icon)
  - Inspirador (Sparkles icon)

#### 6. ETAPA 5: CONTEXTO OPERACIONAL
```typescript
interface Step5Data {
  canaisAtendimento: Array<{
    canal: 'whatsapp' | 'email' | 'telefone' | 'chat' | 'instagram' | 'facebook';
    ativo: boolean;
    horarioFuncionamento: string;
    tempoResposta: string;
  }>;
  horarioComercial: {
    inicio: string;
    fim: string;
    dias: string[];
    fusioHorario: string;
  };
  equipe: Array<{
    nome: string;
    funcao: string;
    horario: string;
  }>;
  processos: {
    onboarding: string;
    qualificacao: string;
    fechamento: string;
    posVenda: string;
  };
  sistemasIntegracao: string[];
  kpisImportantes: string[];
  automacoesExistentes: string;
  observacoes: string;
}
```

**Canais de Atendimento (Toggle Cards):**
- **Card**: flex justify-between, padding 16px, border-radius: 10px
- **Icon + Nome**: WhatsApp, Email, Telefone, Chat, Instagram, Facebook
- **Toggle Switch**: 44x24px, bg #e5e5e5 → #f76926 quando ativo
- **Quando ativo**: expande para mostrar horário e SLA

**Horário Comercial:**
- Time picker (início/fim)
- Dias da semana: botões toggle (D S T Q Q S S)
- Select: Fuso horário

**Processos (Timeline Vertical):**
```
●─── Onboarding
│    [Textarea]
│
●─── Qualificação
│    [Textarea]
│
●─── Fechamento
│    [Textarea]
│
●─── Pós-venda
     [Textarea]
```
- Bolinha: 12px, bg #f76926 quando preenchido
- Linha: 2px, bg #e5e5e5 → #f76926 quando etapas conectadas preenchidas

#### 7. PREVIEW CARD (Sidebar)

**Container:**
- **Width**: 320px
- **Position**: sticky, top: 24px
- **Background**: #ffffff
- **Border-radius**: 16px
- **Border**: 1px solid #e5e5e5
- **Sombra**: md

**Header:**
- **Padding**: 20px
- **Border-bottom**: 1px solid #e5e5e5
- Título: "Preview do Perfil", 14px / 600
- Subtítulo: "Atualizado em tempo real", 12px / 400 / #9ca3af

**Avatar Preview:**
- **Size**: 80px, border-radius: full
- **Background**: gradient com cor primária do cliente
- **Iniciais**: 28px / 700 / #ffffff

**Info Preview:**
- Nome: 16px / 600, line-clamp: 1
- Segmento: 13px / 400 / #6b7280

**Progress Bar:**
- **Height**: 8px, border-radius: full
- **Background track**: #e5e5e5
- **Fill**: gradient #f76926 → #ff8a5c
- **Percentage**: 14px / 700 / #f76926

**Campos Preenchidos:**
- Lista com checkmarks
- Cada item: label + status (check/circle)
- Check: verde quando completo

#### 8. NAVIGATION BAR

**Container:**
- **Position**: fixed bottom (mobile) / flex (desktop)
- **Height**: 72px
- **Background**: #ffffff
- **Border-top**: 1px solid #e5e5e5
- **Padding**: 0 32px
- **Display**: flex, justify-between, align-center

**Botão Voltar:**
- **Variant**: ghost/outline
- **Icon**: ArrowLeft
- **Disabled**: na etapa 1

**Botão Continuar:**
- **Background**: #f76926
- **Padding**: 12px 24px
- **Border-radius**: 10px
- **Icon**: ArrowRight (direita)
- **Loading state**: Spinner quando processando

**Botão Finalizar (última etapa):**
- **Background**: #10b981
- **Icon**: Check
- **Confirmação**: Modal "Confirmar cadastro?"

### Validações por Etapa

| Etapa | Campos Obrigatórios | Validações |
|-------|---------------------|------------|
| 1 | Nome, CNPJ, Email, Responsável | CNPJ válido, Email válido, Telefone formatado |
| 2 | Ramo, Descrição | Mínimo 100 caracteres na descrição |
| 3 | Segmentação, 1 Persona | Persona completa |
| 4 | Logo, Cor Primária, Tom de Voz | Logo formatos aceitos |
| 5 | 1 Canal ativo, Horário | Horário válido |

### Salvamento Automático
- Debounce de 3 segundos após última digitação
- Toast: "Rascunho salvo" (bottom-right)
- Badge "Salvo" no header quando sincronizado
- Recuperação ao retornar à página

---

## 📌 PROMPT 3: PERFIL DO AGENTE (DETALHE)

### Contexto
Página de detalhamento completo de um agente específico, exibindo personalidade, configurações, KPIs e relacionamentos em uma interface tabbed rica.

### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER COM BREADCRUMB                                            │
│ Dashboard / Agentes / Ana - Assistente de Atendimento           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ AGENTE HEADER CARD                                       │    │
│  │ [Avatar grande]  [Nome + Status + Categoria]  [Ações]   │    │
│  │                  [Stats rápidos]                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ TAB NAVIGATION                                           │    │
│  │ [Visão Geral] [Personalidade] [Gatilhos] [KPIs] [Relac.]│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ TAB CONTENT                                              │    │
│  │                                                          │    │
│  │ [Conteúdo varia por tab selecionada]                    │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Detalhados

#### 1. AGENTE HEADER CARD
```typescript
interface AgentHeaderProps {
  agent: {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'error' | 'paused';
    category: string;
    avatar: string;
    createdAt: string;
    version: string;
    executionsTotal: number;
    successRate: number;
    avgResponseTime: string;
  };
}
```

**Container:**
- **Background**: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)
- **Padding**: 32px
- **Border-radius**: 0 0 24px 24px
- **Color**: #ffffff

**Avatar:**
- **Size**: 96px
- **Border**: 4px solid rgba(255,255,255,0.2)
- **Border-radius**: 20px
- **Sombra**: xl

**Info Principal:**
- Nome: 28px / 700
- Descrição: 15px / 400 / rgba(255,255,255,0.8), max-width 600px
- Badge Status: pill com dot animado
  - active: bg rgba(16,185,129,0.2), color #10b981
  - paused: bg rgba(245,158,11,0.2), color #f59e0b
  - error: bg rgba(239,68,68,0.2), color #ef4444
- Badge Categoria: bg rgba(247,105,38,0.2), color #f76926

**Stats Rápidos:**
- **Display**: flex, gap: 32px
- **Margin-top**: 24px
- **Divider**: 1px solid rgba(255,255,255,0.1)

| Stat | Label | Valor |
|------|-------|-------|
| Total Execuções | execuções | "12.5K" |
| Taxa de Sucesso | sucesso | "98.2%" |
| Tempo Médio | resposta | "1.2s" |
| Versão | versão | "v2.3.1" |

**Ações (top-right):**
- [Editar] pencil icon
- [Pausar/Ativar] pause/play icon
- [Configurações] settings icon
- [Mais] 3-dots → dropdown: Duplicar, Exportar, Deletar

#### 2. TAB NAVIGATION
```typescript
interface TabProps {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}
```

**Tabs:**
1. **Visão Geral** (LayoutDashboard icon)
2. **Personalidade** (UserCircle icon) - badge: "3 traits"
3. **Gatilhos & SLAs** (Zap icon)
4. **KPIs & Métricas** (BarChart3 icon)
5. **Relacionamentos** (Network icon)

**Container:**
- **Background**: #ffffff
- **Border-bottom**: 1px solid #e5e5e5
- **Position**: sticky, top: 0
- **Z-index**: 10

**Tab Item:**
- **Padding**: 16px 24px
- **Font**: 14px / 500
- **Color**: #6b7280 → #1a1a2e (active)
- **Border-bottom**: 2px transparent → #f76926 (active)
- **Icon**: 18px, margin-right: 8px
- **Hover**: color #1a1a2e, background #f9fafb
- **Active**: color #f76926

#### 3. TAB: VISÃO GERAL

**Grid de 2 colunas:**

**Coluna Esquerda:**

**Card "Sobre este Agente"**
- **Background**: #ffffff
- **Padding**: 24px
- **Border-radius**: 16px
- **Border**: 1px solid #e5e5e5

**Descrição Completa:**
- Título: 16px / 600
- Texto: 14px / 400 / #374151, line-height 1.7

**Características (Tags):**
- Display: flex wrap, gap: 8px
- Tag: bg #f3f4f6, color #4b5563, padding 6px 12px, border-radius: 8px

**Card "Configurações Rápidas"**
- Toggle items:
  - Modo Turbo (respostas mais rápidas)
  - Aprendizado Contínuo
  - Notificações de Erro
  - Modo Debug

**Coluna Direita:**

**Card "Atividade Recente"**
- Timeline vertical
- Items:
  - Icon (executed, error, paused)
  - Descrição
  - Timestamp
  - Link "Ver detalhes"

**Card "Uso nos Últimos 7 Dias"**
- Sparkline chart
- Valor principal: "+23% vs semana anterior"

#### 4. TAB: PERSONALIDADE

**Visualização de Personalidade (Radar Chart):**
- **Dimensions**: 6 eixos
  - Formalidade
  - Criatividade
  - Empatia
  - Proatividade
  - Precisão
  - Entusiasmo
- **Chart**: Radar/Spider chart
- **Cores**: #f76926 (preenchimento rgba), linha 2px
- **Valores**: 0-100 em cada eixo

**Traits de Personalidade (Cards):**

```typescript
interface PersonalityTrait {
  name: string;
  description: string;
  level: 1-10;
  examples: string[];
}
```

**Card de Trait:**
- **Background**: #ffffff
- **Border-left**: 4px solid #f76926
- **Padding**: 20px
- **Border-radius**: 0 12px 12px 0
- **Sombra**: sm

**Conteúdo:**
- Nome: 16px / 600
- Descrição: 14px / 400 / #6b7280
- Slider de nível: 0-10, não editável (view only)
- Exemplos de fala: quote blocks com ícone MessageSquare

**Tom de Voz (Seção):**
- **Visual**: Card grande com ícone representativo
- **Descrição**: Como o agente se comunica
- **Exemplo de Interação**: Chat bubble simulation

**Instruções do Sistema:**
- **Collapsible section**
- **Content**: Texto completo do system prompt
- **Copy button**: top-right

#### 5. TAB: GATILHOS & SLAs

**Gatilhos de Ativação:**

```typescript
interface Trigger {
  id: string;
  type: 'scheduled' | 'event' | 'manual' | 'webhook';
  condition: string;
  schedule?: string;
  status: 'active' | 'paused';
  lastTriggered?: string;
  nextTrigger?: string;
}
```

**Trigger Card:**
- **Border-left**: 4px color by type
  - scheduled: #3b82f6
  - event: #10b981
  - manual: #6b7280
  - webhook: #8b5cf6
- **Icon**: Clock / Zap / Hand / Webhook (20px)
- **Nome**: 15px / 600
- **Condição**: 13px / 400 / #6b7280
- **Status Toggle**: switch
- **Schedule Info**: próxima execução, última execução

**Configurações de SLA:**

```typescript
interface SLA {
  metric: string;
  target: string;
  current: string;
  status: 'meeting' | 'warning' | 'breach';
}
```

**SLA Table:**
| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| Tempo de Resposta | < 2s | 1.2s | 🟢 |
| Taxa de Sucesso | > 95% | 98.2% | 🟢 |
| Disponibilidade | 99.9% | 99.95% | 🟢 |
| Erros/Hora | < 5 | 2 | 🟢 |

**Alertas Configurados:**
- Lista de notificações
- Canal: Email, Slack, SMS
- Condição: trigger

#### 6. TAB: KPIs & MÉTRICAS

**Dashboard de Métricas:**

**Row 1 - Cards Principais:**
- Grid 4 colunas
- Cada card com sparkline mini
- Variação percentual com indicador de cor

**Row 2 - Gráficos:**
- **Esquerda**: Line chart - Execuções ao longo do tempo
- **Direita**: Bar chart - Distribuição por hora do dia

**Row 3 - Tabela de Performance:**
| Data | Execuções | Sucessos | Erros | Taxa | Tempo Médio |
|------|-----------|----------|-------|------|-------------|
| Hoje | 1,247 | 1,225 | 22 | 98.2% | 1.2s |
| Ontem | 1,189 | 1,165 | 24 | 97.9% | 1.3s |

**Filtros de Data:**
- Presets: Hoje, 7 dias, 30 dias, 90 dias, Custom
- Date picker range

#### 7. TAB: RELACIONAMENTOS

**Visualização de Rede (Network Graph):**
- **Central Node**: Agente atual (maior, cor #f76926)
- **Connected Nodes**: Agentes relacionados
- **Edges**: tipo de relação
  - colabora_com (azul)
  - substitui (laranja)
  - é_dependente_de (vermelho)
  - é_pai_de (verde)

**Lista de Relacionamentos:**

```typescript
interface Relationship {
  agent: Agent;
  type: 'collaborates' | 'replaces' | 'depends_on' | 'parent_of';
  description: string;
  strength: 1-5; // espessura da linha
}
```

**Card de Relação:**
- Avatar do agente relacionado (40px)
- Nome + categoria
- Badge do tipo de relação
- Força: 1-5 estrelas
- Botão: "Ver agente" → link

**Agentes Relacionados Sugeridos:**
- "Baseado em padrões de uso, estes agentes poderiam se relacionar com Ana..."
- Cards clicáveis para adicionar relação

---

## 📌 PROMPT 4: CENTRAL DE CLIENTES (LISTA E DETALHE)

### Contexto
Interface completa para gestão de clientes, com lista filtrável e página de detalhes com timeline de interações.

### Parte A: LISTA DE CLIENTES

#### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
│ Central de Clientes                              [+ Novo Cliente]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ TOOLBAR (Search + Filters + View Toggle)                │    │
│  │ [🔍 Search] [Status ▼] [Segmento ▼] [📅 Cadastro ▼] [☰│≡]│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ CLIENTE LIST                                            │    │
│  │                                                         │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ [Avatar] Nome Empresa          Status    Segmento   │ │    │
│  │ │         nome@email.com         [Ativo]   [Tecnologia│ │    │
│  │ │         (11) 99999-9999        Último:   ]          │ │    │
│  │ │                                2 dias atrás         │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │                                                         │    │
│  │ [... mais clientes ...]                                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ PAGINATION                                              │    │
│  │ [← Anterior]  1  2  3  ...  10  [Próxima →]             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Componentes Detalhados

**1. TOOLBAR**

**Search:**
- **Width**: 300px
- **Placeholder**: "Buscar por nome, email, CNPJ..."
- **Icon**: Search left, X clear right (quando preenchido)
- **Debounce**: 300ms

**Filters:**
- Status: Select (Ativos, Inativos, Prospects, Todos)
- Segmento: Multi-select dropdown
- Data Cadastro: Date range picker

**View Toggle:**
- Grid view: 3x3 cards
- List view: tabela/linhas (default)
- Kanban view: por status

**2. CLIENTE LIST ITEM**

```typescript
interface ClientListItemProps {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  logo?: string;
  status: 'ativo' | 'inativo' | 'prospect';
  segmento: string;
  dataCadastro: string;
  ultimaInteracao: string;
  agentesAtivos: number;
  valorMensal: number;
}
```

**Row Layout:**
- **Height**: 88px
- **Padding**: 16px 24px
- **Background**: #ffffff
- **Border-bottom**: 1px solid #f3f4f6
- **Hover**: background #f9fafb
- **Cursor**: pointer

**Content (flex, align-center):**

| Elemento | Tamanho | Detalhes |
|----------|---------|----------|
| Avatar | 56x56px | border-radius: 12px, bg gradient com iniciais |
| Info | flex-1 | Nome 16px/600, Email 13px/400/#6b7280, Telefone 13px/400/#9ca3af |
| Status | 100px | Badge pill, cor por status |
| Segmento | 120px | Badge outline, #f76926 |
| Agentes | 80px | Icon + número |
| Valor | 100px | 14px/600, alinhado direita |
| Ações | 40px | 3-dots menu |

**Status Badges:**
- ativo: bg #dcfce7, color #166534, border #86efac
- inativo: bg #f3f4f6, color #6b7280, border #d1d5db
- prospect: bg #fef3c7, color #92400e, border #fcd34d

**3. GRID VIEW (Alternativa)**

**Card de Cliente:**
- **Width**: calc(33.333% - 16px)
- **Background**: #ffffff
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 16px
- **Padding**: 24px
- **Hover**: sm → lg, border #f76926

**Header:**
- Logo: 64px, border-radius: 12px
- Menu 3-dots: top-right

**Body:**
- Nome: 18px / 600, line-clamp: 1
- Segmento: badge

**Footer:**
- Stats: Agentes | Execuções
- Progress bar: "Perfil completo: 85%"

### Parte B: DETALHE DO CLIENTE

#### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB + AÇÕES                                               │
│ Clientes / ACME Tecnologia                        [Editar][⋯]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────┐  ┌───────────────────────────┐  │
│  │                            │  │                           │  │
│  │  PROFILE CARD              │  │  TIMELINE                 │  │
│  │  (info principal)          │  │  (interações)             │  │
│  │                            │  │                           │  │
│  │  [Logo]                    │  │  ●─── Hoje                │  │
│  │  [Nome]                    │  │  │    [Evento]             │  │
│  │  [Dados]                   │  │  │                         │  │
│  │  [Tags]                    │  │  ●─── Ontem               │  │
│  │  [Contatos]                │  │       [Evento]            │  │
│  │                            │  │                           │  │
│  │  [Métricas rápidas]        │  │                           │  │
│  │                            │  │                           │  │
│  └────────────────────────────┘  └───────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ TABS: [Visão Geral] [Agentes] [Documentos] [Config]     │    │
│  │ TAB CONTENT...                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Componentes Detalhados

**1. PROFILE CARD**

**Header:**
- Logo: 120x120px, border-radius: 20px, border 4px #fff, sombra lg
- Background do header: gradient #1a1a2e
- Status indicator: absolute bottom-right of logo

**Nome e Info:**
- Nome fantasia: 24px / 700
- Razão social: 14px / 400 / #6b7280
- CNPJ: 13px / mono / #9ca3af

**Dados de Contato:**
- Grid 2 colunas
- Card por contato: icon + label + valor
- Ícones: Mail, Phone, Globe, MapPin

**Tags de Segmento:**
- Display: flex wrap
- Tag: clickable, bg #fff5f0, hover: darker

**Métricas Rápidas:**
- 3 cards: Agentes Ativos, Execuções Mês, Ticket Médio

**2. TIMELINE DE INTERAÇÕES**

```typescript
interface TimelineEvent {
  id: string;
  type: 'cadastro' | 'agente_criado' | 'agente_executado' | 'contato' | 'documento' | 'nota';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: any;
}
```

**Visualização:**
- Linha vertical central (2px, #e5e5e5)
- Bolinhas coloridas por tipo
  - cadastro: #3b82f6
  - agente: #f76926
  - contato: #10b981
  - documento: #8b5cf6
- Cards lado direito

**Timeline Item:**
- **Timestamp**: 12px / 500 / #9ca3af
- **Título**: 14px / 600
- **Descrição**: 13px / 400 / #6b7280
- **Avatar**: quando há usuário (32px)

**Filtros de Timeline:**
- Todos | Agentes | Contatos | Documentos | Notas
- Date range

**Adicionar Evento:**
- Floating button bottom-right
- Modal: Tipo, Título, Descrição, Anexos

**3. TAB: AGENTES DO CLIENTE**

**Agentes Ativos Table:**
| Agente | Tipo | Status | Execuções | Última | Ações |
|--------|------|--------|-----------|--------|-------|
| Ana | Atendimento | 🟢 | 5.2K | 2min | [Ver] [⚙️] |

**Gráfico de Uso por Agente:**
- Stacked bar chart
- Cores diferentes por agente

**4. TAB: DOCUMENTOS**

**Upload Area:**
- Dropzone grande
- Formatos aceitos: PDF, DOC, XLS, IMG

**Document List:**
- Card por documento
- Thumbnail | Nome | Tamanho | Data | [Download] [🗑️]

**5. TAB: CONFIGURAÇÕES**

**Configurações do Cliente:**
- SLA customizado
- Horário de atendimento
- Canais permitidos
- Integrações ativas

---

## 📌 PROMPT 5: WORKFLOW VISUAL (ORQUESTRAÇÃO)

### Contexto
Interface de criação e visualização de workflows de automação, com editor visual tipo node-based e monitoramento em tempo real.

### Estrutura de Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
│ Workflow: Onboarding de Cliente          [Salvar] [Executar] [⋯]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌───────────────────────────────────────────┐    │
│  │          │  │                                           │    │
│  │ SIDEBAR  │  │         CANVAS (Node Editor)              │    │
│  │          │  │                                           │    │
│  │ • Nodes  │  │    ┌─────┐         ┌─────┐         ┌────┐│    │
│  │ • Tools  │  │    │START│────────►│ AG  │────────►│ END││    │
│  │          │  │    └─────┘         └─────┘         └────┘│    │
│  │          │  │                    ┌─────┐               │    │
│  │          │  │                    │COND │               │    │
│  │          │  │                    └──┬──┘               │    │
│  │          │  │              ┌────────┴────────┐          │    │
│  │          │  │              ▼                 ▼          │    │
│  │          │  │           ┌─────┐          ┌─────┐        │    │
│  │          │  │           │ A   │          │ B   │        │    │
│  │          │  │           └─────┘          └─────┘        │    │
│  │          │  │                                           │    │
│  └──────────┘  └───────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ PROPERTIES PANEL (selecionar node mostra aqui)          │    │
│  │ [Configurações do node selecionado]                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Detalhados

#### 1. SIDEBAR DE NODES

**Categorias de Nodes:**

**Triggers:**
- ⏰ Agendado (Clock icon)
- 🔔 Webhook (Globe icon)
- 📧 Email Recebido (Mail icon)
- 📝 Formulário (FileText icon)

**Agentes:**
- 🤖 Ana - Atendimento
- 🤖 Bruno - Qualificação
- 🤖 Carla - Copywriter
- [+ Ver todos...]

**Lógica:**
- ❓ Condição (If/Else)
- ⏸️ Delay/Espera
- 🔄 Loop
- 📊 Split/Merge
- 🔀 Switch/Case

**Ações:**
- 📧 Enviar Email
- 💬 Enviar WhatsApp
- 📝 Criar Tarefa
- 📊 Atualizar Planilha
- 🔔 Notificação

**Node Draggable:**
- **Width**: 200px
- **Height**: 48px
- **Background**: #ffffff
- **Border**: 1px solid #e5e5e5
- **Border-radius**: 10px
- **Icon**: 20px, left
- **Label**: 13px / 500
- **Hover**: border #f76926, shadow sm
- **Drag**: opacity 0.8, scale 1.02, cursor grabbing

#### 2. CANVAS (NODE EDITOR)

**Grid Background:**
- Dots ou linhas sutis
- Cor: #f3f4f6
- Tamanho: 20px

**Canvas Controls (bottom-right):**
- Zoom: [-] [50%] [+]
- Fit to screen
- Mini-map toggle

**Node no Canvas:**

```typescript
interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config: any;
    status?: 'idle' | 'running' | 'completed' | 'error';
  };
  inputs: Port[];
  outputs: Port[];
}
```

**Node Visual:**
- **Width**: 200px (min)
- **Background**: #ffffff
- **Border**: 2px solid (cor por categoria)
  - Triggers: #3b82f6
  - Agentes: #f76926
  - Lógica: #8b5cf6
  - Ações: #10b981
- **Border-radius**: 12px
- **Sombra**: md

**Header:**
- Color bar: 4px height, full width
- Icon + Label: 14px / 600
- Menu 3-dots

**Body:**
- Descrição resumida da configuração
- Badge de status (quando executando)

**Ports (Conexões):**
- **Size**: 12px
- **Border-radius**: full
- **Background**: #ffffff
- **Border**: 2px solid
- Posição: left (input), right (output)
- Hover: scale 1.3, bg #f76926

**Edges (Linhas):**
- **Stroke**: #9ca3af, 2px
- **Curva**: bezier suave
- **Animated**: quando executando (stroke-dasharray animation)
- **Selected**: stroke #f76926, 3px

**Seleção:**
- Ring: 2px #f76926
- Resize handles nos cantos

#### 3. EXECUÇÃO EM TEMPO REAL

**Execution Mode:**
- Toggle: Design / Execute
- Quando em execução: mostrar progresso em cada node

**Node States:**
- **Idle**: border normal
- **Running**: border #3b82f6, spinner icon, pulse animation
- **Completed**: border #10b981, check icon
- **Error**: border #ef4444, shake animation, X icon

**Edge Animation:**
- Dashed line animada
- Cor: #3b82f6 quando dados passando

**Logs Panel (bottom):**
- Collapsible
- Timeline de execução
- Filtros: All | Info | Warning | Error

#### 4. PROPERTIES PANEL

**Node Selecionado:**

**Header:**
- Icon + Nome do tipo
- ID do node
- Delete button

**Configurações:**
- Form fields específicos do node type
- Validation em tempo real

**Exemplo - Node Agente:**
```
┌─────────────────────────┐
│ 🤖 Agente               │
│ Ana - Atendimento       │
├─────────────────────────┤
│                         │
│ Agente: [Dropdown ▼]    │
│                         │
│ Prompt Adicional:       │
│ [Textarea...]           │
│                         │
│ Timeout: [20s]          │
│                         │
│ Tentativas: [3 ▼]       │
│                         │
│ On Error: [Continue ▼]  │
│                         │
└─────────────────────────┘
```

**Exemplo - Node Condição:**
```
┌─────────────────────────┐
│ ❓ Condição             │
│ If/Else                 │
├─────────────────────────┤
│                         │
│ Variável: [input.data]  │
│                         │
│ Operador: [equals ▼]    │
│                         │
│ Valor: [___]            │
│                         │
│ [+ Adicionar condição]  │
│                         │
│ Saídas:                 │
│ ● Verdadeiro (green)    │
│ ● Falso (red)           │
│                         │
└─────────────────────────┘
```

#### 5. WORKFLOW LIST (Visão de Lista)

**Alternativa ao Editor:**
- Lista de workflows salvos
- Status: Draft | Active | Paused | Error
- Última execução
- Stats: execuções, sucesso

**Quick Stats Cards:**
- Workflows Ativos
- Execuções Hoje
- Taxa de Sucesso
- Tempo Médio

#### 6. APROVAÇÕES

**Sistema de Aprovação em Workflow:**

**Node de Aprovação:**
- Visual: 👤 avatar do aprovador
- Badge: "Aguardando aprovação"

**Aprovação Panel:**
```
┌─────────────────────────┐
│ ⏳ Aprovações Pendentes │
├─────────────────────────┤
│                         │
│ Workflow: Onboarding    │
│ Node: Revisar Proposta  │
│ Solicitado: há 2h       │
│                         │
│ [Contexto da tarefa]    │
│                         │
│ [✅ Aprovar]            │
│ [❌ Rejeitar]           │
│ [💬 Solicitar revisão]  │
│                         │
└─────────────────────────┘
```

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO

### Dashboard de Agentes
- [ ] Visualização em grid de 4 colunas (desktop)
- [ ] Cards com hover animation e status indicator
- [ ] Filtros funcionais (search, status, categoria)
- [ ] Stats cards com variação percentual
- [ ] Gráfico de uso interativo
- [ ] Ações rápidas funcionais
- [ ] Responsivo: 2 colunas tablet, 1 coluna mobile
- [ ] Estados loading, empty e error implementados

### Cadastro de Cliente (5 Etapas)
- [ ] Step indicator funcional e clicável
- [ ] Validação em tempo real por campo
- [ ] Salvamento automático de rascunho
- [ ] Preview card atualizado dinamicamente
- [ ] Navegação entre etapas (voltar/continuar)
- [ ] Validação de etapa antes de avançar
- [ ] Máscaras em CNPJ, telefone, CEP
- [ ] Upload de logo com preview
- [ ] Color picker funcional
- [ ] Criação de múltiplas personas
- [ ] Finalização com modal de confirmação

### Perfil do Agente
- [ ] Header com gradiente e stats
- [ ] Tabs funcionais com transições suaves
- [ ] Radar chart de personalidade
- [ ] Lista de gatilhos com toggle
- [ ] Dashboard de KPIs com filtros de data
- [ ] Network graph de relacionamentos
- [ ] Timeline de atividade
- [ ] Edição inline de configurações

### Central de Clientes
- [ ] Lista com filtros e ordenação
- [ ] Toggle entre views (list/grid/kanban)
- [ ] Busca com debounce
- [ ] Detalhe com tabs
- [ ] Timeline de interações
- [ ] Upload e gestão de documentos
- [ ] Perfil completo do cliente
- [ ] Métricas de uso por cliente

### Workflow Visual
- [ ] Drag & drop de nodes
- [ ] Conexão entre nodes (edges)
- [ ] Canvas pan e zoom
- [ ] Properties panel dinâmico
- [ ] Execução em tempo real
- [ ] Estados visuais (running/completed/error)
- [ ] Logs de execução
- [ ] Sistema de aprovação
- [ ] Validação de workflow
- [ ] Salvamento e versionamento

---

## 📊 REQUISITOS DE DADOS

### Dashboard de Agentes
```typescript
interface DashboardData {
  stats: {
    totalAgentes: number;
    agentesAtivos: number;
    execucoesHoje: number;
    taxaSucesso: number;
    variacoes: Record<string, number>;
  };
  agentes: Agente[];
  graficoUso: Array<{ dia: string; execucoes: number }>;
}
```

### Cadastro de Cliente
```typescript
interface ClienteFormData {
  // Etapa 1
  dadosBasicos: {
    nome: string;
    cnpj: string;
    email: string;
    // ...
  };
  // Etapa 2
  contextoNegocio: {
    ramoAtividade: string;
    descricao: string;
    // ...
  };
  // Etapas 3, 4, 5...
}
```

### Perfil do Agente
```typescript
interface AgenteDetalhe {
  id: string;
  nome: string;
  personalidade: {
    traits: Trait[];
    tomVoz: string;
    radar: Record<string, number>;
  };
  gatilhos: Trigger[];
  slas: SLA[];
  kpis: Metric[];
  relacionamentos: Relacionamento[];
}
```

### Workflow
```typescript
interface Workflow {
  id: string;
  nome: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'active' | 'paused';
  ultimaExecucao?: Execucao;
}
```

---

## 🔗 FLUXOS DE NAVEGAÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│                         DASHBOARD                           │
│                    (Dashboard de Agentes)                   │
└─────────────┬─────────────────────────────┬─────────────────┘
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  NOVO CLIENTE   │           │  PERFIL AGENTE  │
    │   (5 etapas)    │           │    (Detalhe)    │
    └────────┬────────┘           └─────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ CENTRAL CLIENTES│
    │  (Lista/Detalhe)│
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ WORKFLOW VISUAL │
    │(Orquestração)   │
    └─────────────────┘
```

### Navegação Principal
- Sidebar fixa esquerda
- Items: Dashboard, Clientes, Workflows, Configurações
- Collapsible em mobile

### Breadcrumbs
- Sempre visível em páginas internas
- Navegável (clicável)
- Formato: Home / Nível 1 / Nível 2 / Atual

---

## 🚀 IMPLEMENTAÇÃO NO LOVABLE

### Configuração Inicial
1. Criar projeto React + TypeScript
2. Instalar dependências:
   - Tailwind CSS
   - shadcn/ui components
   - Lucide React (ícones)
   - Recharts (gráficos)
   - React Flow (workflow editor)
3. Configurar tema com cores customizadas
4. Importar fonte Inter

### Estrutura de Pastas
```
/src
  /components
    /ui           # shadcn components
    /agents       # AgentCard, AgentGrid, etc
    /clients      # ClientCard, ClientForm, etc
    /workflow     # NodeTypes, EdgeTypes, Canvas
    /charts       # Gráficos customizados
    /layout       # Header, Sidebar, etc
  /pages
    /dashboard
    /clients
    /agents
    /workflows
  /hooks
  /types
  /lib
    /utils.ts
    /constants.ts
```

### Considerações Finais
- Usar Context API para estado global
- Implementar lazy loading para performance
- Adicionar testes E2E para fluxos críticos
- Documentar componentes com Storybook

---

*Documento gerado para implementação técnica no Lovable.dev*
*Versão 1.0 - Abril 2026*
