# 🤖 PROMPT OTIMIZADO PARA LOVABLE
## Totum Apps - Plataforma de Agentes para Equipes

---

## 🎯 CONCEITO PRINCIPAL (Copie e Cole)

```
Crie um SaaS chamado "Totum Apps" - uma plataforma onde minha equipe entra para 
usar recursos de IA e conversar com agentes especializados. Cada agente tem 
personalidade, função específica e recursos próprios.

O design é dark mode premium com laranja #f76926 como cor primária, 
fundo #0e0e0e, cards #1a1919, fonte Plus Jakarta Sans.
```

---

## 🏠 ESTRUTURA DA PLATAFORMA

### 1. CENTRAL DE AGENTES (Hub Principal)
**Página inicial após login** - Grid de cards mostrando todos os agentes disponíveis:

```
┌─────────────────────────────────────────┐
│  🤖 SEUS AGENTES DISPONÍVEIS            │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌────────────┐        │
│  │ 👤         │  │ 📊         │        │
│  │ ATENDENTE  │  │ TRÁFEGO    │        │
│  │ TOTUM      │  │ GESTOR     │        │
│  │            │  │            │        │
│  │ Suporte    │  │ Performance│        │
│  │ [Abrir]    │  │ [Abrir]    │        │
│  └────────────┘  └────────────┘        │
│                                         │
│  ┌────────────┐  ┌────────────┐        │
│  │ 🎯         │  │ 🧠         │        │
│  │ RADAR      │  │ KIMI       │        │
│  │ ESTRATÉGICO│  │ OPENCLAW   │        │
│  │            │  │            │        │
│  │ Planejamento│ │ Executivo  │        │
│  │ [Abrir]    │  │ [Abrir]    │        │
│  └────────────┘  └────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🤖 AGENTE 1: ATENDENTE TOTUM

### Interface: Chat de Suporte
```
Crie uma interface de chat estilo WhatsApp para o "Atendente Totum":

HEADER:
- Avatar do agente (ícone de fone de ouvido)
- Nome: "Atendente Totum"
- Status: "Online"
- Menu de 3 pontos (configurações)

SIDEBAR ESQUERDA:
- Lista de conversas/tickets
- Filtros: Todos, Pendentes, Urgentes
- Botão "Nova Conversa" (verde)

ÁREA DE CHAT:
- Balões de mensagem (usuário à direita, agente à esquerda)
- Input com botões: 
  📎 Anexar arquivo
  🎙️ Gravar áudio
  😊 Emoji
  ➤ Enviar

BARRA DE FERRAMENTAS ABAIXO DO INPUT:
[🤖 Classificar] [⚡ Criar Tarefa] [📅 Agendar] [🔄 Transferir]

RECURSOS DO AGENTE (botoes de ação rápida no chat):
- "Classificar Demanda" → Abre modal com:
  * Tipo: Dúvida | Reclamação | Solicitação
  * Departamento: Suporte | Comercial | Técnico | Financeiro
  * Urgência: 1-5 estrelas

- "Verificar Risco de Churn" → Mostra score 0-100 com alerta visual

- "Mataburro" → Respostas automáticas de FAQ

- "Auditor de SLA" → Mostra tempo de resposta e alerta se próximo do limite

- "Agendador" → Integração com Google Calendar

- "Gestor de Tarefas" → Kanban de tarefas criadas

- "Transcrever Áudio" → Quando recebe áudio, mostra botão para transcrever

- "Gerar Relatório" → Exporta métricas do atendimento
```

### Tela do Agente Atendente
**Rota:** `/agente/atendente`

Componentes:
- Chat interface completo
- Sidebar de conversas
- Modal "Nova Tarefa" (título, descrição, departamento, urgência, data, responsável)
- Badge de "Risco de Churn" quando detectado
- Indicador de SLA (tempo restante)

---

## 📊 AGENTE 2: GESTOR DE TRÁFEGO

### Interface: Dashboard Analítico
```
Crie um dashboard de performance chamado "Gestor de Tráfego":

HEADER:
- Título: "Gestor de Tráfego"
- Seletor de período: Hoje | 7 dias | 30 dias | Personalizado
- Botão "+ Adicionar Conta"

CARDS DE MÉTRICAS (topo):
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 💰          │ │ 📈          │ │ 🖱️          │ │ ⚠️          │
│ Spend Hoje  │ │ ROAS Médio  │ │ CTR Médio   │ │ Alertas     │
│ R$ 1.245,00 │ │ 3.45x       │ │ 2.34%       │ │ 3 ativos    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

GRÁFICO PRINCIPAL:
- Gráfico de linha: Spend vs Conversões ao longo do tempo
- Toggle por plataforma: Meta | Google | TikTok | LinkedIn

TABELA DE CAMPANHAS:
| Campanha        | Plataforma | Status    | Budget  | Spend   | ROAS  | Ações     |
|-----------------|------------|-----------|---------|---------|-------|-----------|
| Black Friday    | Meta       | 🟢 Ativa  | R$ 500  | R$ 450  | 4.2x  | ⏸️ 📊     |
| Lançamento      | Google     | 🟢 Ativa  | R$ 300  | R$ 280  | 2.8x  | ⏸️ 📊     |
| Retargeting     | TikTok     | 🟡 Pausada| R$ 200  | R$ 150  | 1.5x  | ▶️ 📊     |

CARD "ANOMALIAS DETECTADAS":
🔴 Alto: CPC da campanha "Black Friday" subiu 40%
   → Recomendação: Pausar e revisar criativos
   [Aplicar Sugestão]

🟡 Médio: CTR abaixo da média no Google Ads
   → Recomendação: Testar novo headline
   [Ver Detalhes]

RECURSOS DO AGENTE (botoes e funcionalidades):
- "Auditor Diário" → Checagem automática de todas as campanhas
- "Detector de Anomalias" → Alertas automáticos de comportamento fora do padrão
- "Protetor de Contas" → Monitora gasto diário e pausa se exceder
- "Gerar Insight Semanal" → Relatório automático de tendências
- "Escala Inteligente" → Aumenta/diminui budget automaticamente baseado em ROAS
- "Análise de Criativos" → Performance por tipo de criativo
- "Diagnóstico de Conversão" → Análise de funil e gargalos
- "Relatório Executivo" → Gera PDF para cliente
- "Mataburro SLA" → Respostas rápidas para dúvidas comuns
```

### Tela do Agente Gestor de Tráfego
**Rota:** `/agente/trafego`

Componentes:
- KPI cards (4 métricas principais)
- Gráfico de linha com Recharts
- DataTable de campanhas
- Card de anomalias com ações
- Modal "Adicionar Conta"
- Botão "Exportar Relatório"

---

## 🎯 AGENTE 3: RADAR ESTRATÉGICO

### Interface: CRM de Clientes
```
Crie um sistema de gestão de clientes chamado "Radar Estratégico".
CADA CLIENTE TEM SEU PRÓPRIO AGENTE com contexto único.

LAYOUT:
SIDEBAR ESQUERDA (lista de clientes):
- Search: "Buscar cliente..."
- Lista de cards:
  ┌─────────────────────┐
  │ 🏢 Marca X          │
  │ Moda Fitness        │
  │ 12 conteúdos pendentes│
  └─────────────────────┘
- Botão "+ Novo Cliente"

HEADER DO CLIENTE SELECIONADO:
- Logo da marca + Nome
- Badge: Moda Fitness
- Tabs: Dashboard | Calendário | Pesquisa | Relatórios

TAB DASHBOARD:
Cards de estatísticas:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📝           │ │ 📱           │ │ 📊           │
│ 15 conteúdos │ │ 8 publicados │ │ 4.5% engaj.  │
│ planejados   │ │ este mês     │ │ médio        │
└──────────────┘ └──────────────┘ └──────────────┘

Próximos eventos sazonais:
• Dia das Mães (em 15 dias) → [Criar conteúdo]
• Black Friday (em 45 dias)

Gráfico: Melhores dias e horários para postar
(segunda 19h, quarta 12h, sexta 20h)

TAB CALENDÁRIO EDITORIAL:
- Calendário mensal visual
- Cada dia mostra ícones de conteúdos agendados
- Click no dia → Modal "Novo Conteúdo"
- Botão "Gerar Planejamento Automático"

Modal "Novo Conteúdo":
- Tipo: Feed | Story | Reel | Carousel
- Título
- Descrição/Ideia
- Hook sugerido (input com placeholder)
- CTA (Call to Action)
- Data/Hora
- Plataformas: ☑️ Instagram ☑️ TikTok ☐ LinkedIn

TAB PESQUISA:
Input: "Pesquisar trends no TikTok/Instagram"
Botão: "Analisar Concorrente" (input @usuario)

Seção "Trends em Alta":
- Cards com preview de trends
- Botão "Usar este trend"

Seção "Hooks Fortes":
- Lista copiável de hooks testados
  "Você não vai acreditar no que descobri..."
  "O segredo que ninguém te conta sobre..."
  "Pare de fazer isso agora..."

TAB RELATÓRIOS:
- Lista de relatórios gerados mensalmente
- Botão "Gerar Relatório do Mês"
- Preview com comentários do agente
```

### Formulário "Novo Cliente" (Multi-etapas)
**Wizard de 4 etapas:**

**Etapa 1: Identidade da Marca**
- Nome da marca
- Nicho (select)
- Proposta Única de Valor (textarea)
- Persona alvo (textarea)
- Arquétipo (select: Herói, Mago, Cuidador...)
- Círculo Dourado: Porquê | Como | O quê
- Tom de voz (textarea)
- Redes sociais ativas (checkboxes + @usuario)

**Etapa 2: Performance Histórica**
- Top 3 posts anteriores (links)
- Formatos que funcionam (checkboxes)
- Melhores horários
- Taxa de engajamento média
- Número de seguidores

**Etapa 3: Contexto de Mercado**
- Concorrentes diretos (inputs de @)
- Referências de conteúdo (links)
- Posicionamento atual
- Diferenciais competitivos

**Etapa 4: Operacional**
- Frequência de postagem desejada
- Capacidade de produção
- Restrições de conteúdo
- Produtos em destaque
- Orçamento para tráfego pago
- Upload de planejamentos anteriores (PDF)

### Tela do Agente Radar
**Rota:** `/agente/radar`

Componentes:
- Sidebar de clientes
- Header com tabs
- Dashboard com cards de stats
- Calendário editorial interativo
- Formulário multi-etapas (Stepper)
- Upload de PDFs (Dropzone)

---

## 🧠 AGENTE 4: KIMI/OPENCLAW

### Interface: Chat Executivo
```
Crie um chat avançado chamado "Kimi - Assistente Executivo"
com 3 personalidades diferentes.

HEADER:
- Seletor de Agente (dropdown):
  👤 Miguel (Criativo/Estratégia)
  👤 Liz (Operações/Análise)
  👤 Jarvis (Execução/Técnico)
  🤖 Auto (Escolhe automaticamente)

- Indicador de status:
  🟡 Processando...
  🟢 Pronto

SIDEBAR ESQUERDA:
- Lista de conversas anteriores
- Preview do primeiro texto
- Data da conversa
- Botão "Nova Conversa"

ÁREA DE CHAT:
- Mensagens com avatar da personalidade selecionada
- Cada personalidade tem cor diferente
- Typing indicator quando processando
- Botões de ação inline quando aplicável
  [Criar Tarefa] [Agendar] [Pesquisar]
```

### Tela do Agente Kimi
**Rota:** `/agente/kimi`

Componentes:
- Seletor de personalidade
- Sidebar de histórico
- Chat interface
- Typing indicator
- Botões de ação contextual

---

## 🛠️ RECURSOS CENTRAIS (Menu Lateral)

```
SIDEBAR GLOBAL (visível em todas as páginas):

🏠 Hub (Central de Agentes)
📊 Custos de IA (Dashboard de gastos)
📁 Notebook LM (Integração Google Drive)
💬 Chat Geral
⚙️ Admin (apenas master/admin)
🌙 Toggle Dark/Light Mode
```

### Tela Custos de IA
**Rota:** `/custos-ia`

Cards de plataformas:
```
┌─────────────────────────────────────┐
│ 🎨 Manus Pro                        │
│ Plano: Pro                          │
│ ████████████░░░░░░ 75% usado        │
│ Custo estimado: $45/mês             │
│ ⚠️ Renova em 3 dias                 │
│ [Ver Detalhes]                      │
└─────────────────────────────────────┘
```

Gráficos:
- Barras: Custo por plataforma
- Pizza: Distribuição percentual

---

## 🔐 AUTENTICAÇÃO

### Tela Login
```
Centro da tela (max-width 420px):
- Logo Totum
- Email
- Senha (com olho para mostrar)
- [Entrar] (botão laranja #f76926)
- "Esqueci minha senha"
- "Ainda não tem acesso? Solicite convite"
```

### Tela Registro
```
- Nome completo
- Email (pré-preenchido do convite)
- Senha
- Confirmar senha
- Checkbox "Aceito os termos"
- [Criar Conta]
```

---

## 🎨 ESPECIFICAÇÕES DE DESIGN

```
CORES:
- Primária: #f76926 (laranja)
- Background: #0e0e0e (quase preto)
- Card: #1a1919 (cinza escuro)
- Texto principal: #ffffff
- Texto secundário: rgba(255,255,255,0.7)
- Borda sutil: rgba(255,255,255,0.1)
- Sucesso: #22c55e
- Alerta: #f59e0b
- Perigo: #ef4444

FONTES:
- Títulos: Plus Jakarta Sans, 600-700
- Corpo: Inter, 400-500
- Labels: Manrope, 500

ANIMAÇÕES:
- Hover em cards: elevação + sombra
- Page transitions: fade suave
- Loading: skeletons
```

---

## 📋 CHECKLIST DE FUNCIONALIDADES

Para cada agente, implemente:
- [ ] Interface de chat/dashboard específica
- [ ] Botões de ação rápida
- [ ] Modais para ações complexas
- [ ] Integração com Supabase
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Modo escuro/claro

---

## 💡 DICAS PARA USAR NO LOVABLE

### DICA 1: Divida em 3 Prompts Sequenciais

**Prompt 1 - Fundação:**
```
Crie o Totum Apps com:
- Design system (cores #f76926, #0e0e0e, fonte Plus Jakarta Sans)
- Autenticação (login/register)
- Layout base (sidebar + header)
- Hub com 4 cards de agentes (apenas visuais, sem funcionalidade ainda)
- Integração Supabase
```

**Prompt 2 - Agentes Principais:**
```
Adicione funcionalidades:
- Atendente Totum: chat completo com classificador de demandas
- Gestor de Tráfego: dashboard com gráficos e tabela
- Radar Estratégico: lista de clientes e formulário de novo cliente
```

**Prompt 3 - Polish:**
```
Adicione:
- Kimi/OpenClaw chat
- Dashboard de Custos de IA
- Modo claro/escuro
- Notificações toast
- Responsividade mobile
```

### DICA 2: Use Referências Visuais
- Anexe screenshots do GitHub como referência
- Descreva animações específicas quando necessário
- Peça ajustes iterativos: "Deixe o card mais elevado no hover"

---

## 🚀 PROMPT ÚNICO (Se for usar de uma vez)

COPIE O TEXTO ABAIXO E COLE NO LOVABLE:

```
Crie o "Totum Apps" - uma plataforma SaaS dark mode onde minha equipe 
usa agentes de IA. Design: fundo #0e0e0e, primária #f76926, fonte 
Plus Jakarta Sans.

PÁGINAS:
1. Login/Register com Supabase auth

2. Hub (/hub): Grid de 4 cards:
   - Atendente Totum (suporte)
   - Gestor de Tráfego (performance)
   - Radar Estratégico (planejamento)
   - Kimi OpenClaw (executivo)

3. Atendente Totum (/agente/atendente): 
   Chat estilo WhatsApp com:
   - Sidebar de conversas
   - Botões: Classificar Demanda (modal tipo/departamento/urgência),
     Verificar Churn (score 0-100), Criar Tarefa, Transcrever Áudio

4. Gestor de Tráfego (/agente/trafego):
   Dashboard com:
   - 4 cards KPI (spend, ROAS, CTR, alertas)
   - Gráfico de linha (Recharts)
   - Tabela de campanhas
   - Card "Anomalias Detectadas" com ações

5. Radar Estratégico (/agente/radar):
   CRM com:
   - Sidebar lista de clientes
   - Formulário novo cliente em 4 etapas (wizard)
   - Calendário editorial
   - Tab Pesquisa com trends

6. Kimi (/agente/kimi):
   Chat com seletor de personalidade (Miguel/Liz/Jarvis)

7. Custos de IA (/custos-ia):
   Cards de plataformas com barras de progresso

Sidebar global em todas as páginas.
Modo escuro/claro toggle.
Mobile-first responsivo.
```

---

**PRONTO PARA COPIAR E COLAR! 🚀**
