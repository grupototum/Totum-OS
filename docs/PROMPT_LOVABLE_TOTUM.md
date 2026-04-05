# 🎯 PROMPT MASTER PARA LOVABLE
## Reconstrução Completa do Totum Apps - Mission Control

---

## 📋 CONTEXTO DO PROJETO

**Repositório de Referência:** https://github.com/grupototum/apps_totum

Este é um projeto existente que precisa ser recriado do zero no Lovable com melhorias significativas. Use o repositório como referência de funcionalidades, mas reconstrua com arquitetura moderna e todos os novos recursos.

**Tipo de Aplicação:** SaaS Multi-tenant - Hub Central de Agentes de IA
**Público-alvo:** Agências de marketing, gestores de tráfego, social media managers
**Tom:** Profissional, moderno, escuro com acentos laranja

---

## 🎨 DESIGN SYSTEM (Obrigatório)

### Cores
```css
/* Primária */
--primary: #f76926;           /* Laranja vibrante Totum */
--primary-hover: #e55a1b;
--primary-light: rgba(247, 105, 38, 0.1);

/* Fundos Dark */
--bg-dark: #0e0e0e;           /* Background principal */
--bg-card: #1a1919;           /* Cards e containers */
--bg-elevated: #242424;       /* Hover e estados elevados */

/* Fundos Light (modo claro) */
--bg-light: #fff8f7;
--bg-card-light: #f3eceb;

/* Textos */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-muted: rgba(255, 255, 255, 0.5);
--text-dark: #1a1a1a;         /* Para modo claro */

/* Estados */
--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;
--info: #3b82f6;
```

### Tipografia
- **Headlines:** Plus Jakarta Sans (600, 700)
- **Body:** Inter (400, 500, 600)
- **Labels/Captions:** Manrope (500)

### Componentes Base
- **Cards:** Border-radius 16px, backdrop-blur, border sutil (rgba(255,255,255,0.1))
- **Botões:** Border-radius 12px, padding 12px 24px, shadow sutil no hover
- **Inputs:** Border-radius 12px, border 1px rgba(255,255,255,0.2), focus ring laranja
- **Sidebar:** Width 280px, colapsável em mobile com overlay

### Layout
- **Max-width:** 1440px centralizado
- **Grid:** 12 colunas, gap 24px
- **Padding:** px-4 sm:px-6 lg:px-8
- **Responsivo:** Mobile-first, breakpoints: sm(640), md(768), lg(1024), xl(1280)

---

## 🏗️ ARQUITETURA DE DADOS

### Tabelas Principais

#### 1. users
```sql
id: uuid (PK)
email: varchar (unique)
password_hash: varchar
name: varchar
role: enum('master', 'admin', 'user')
is_active: boolean
created_at: timestamp
avatar_url: varchar (nullable)
```

#### 2. clients (para Radar Estratégico - 1 cliente = 1 agente)
```sql
id: uuid (PK)
user_id: uuid (FK)
name: varchar
nicho: varchar
persona: text
tom_de_voz: text
arquetipo: varchar
circulo_dourado: json
redes_sociais: json
objetivos: text[]
restricoes: text[]
logo_url: varchar
is_active: boolean
created_at: timestamp
```

#### 3. client_plans (PDFs de planejamentos anteriores)
```sql
id: uuid (PK)
client_id: uuid (FK)
file_name: varchar
file_url: varchar
file_type: varchar
uploaded_at: timestamp
```

#### 4. conversations (chat histórico)
```sql
id: uuid (PK)
user_id: uuid (FK)
agent_type: enum('atendente', 'trafego', 'radar', 'kimi')
title: varchar
status: enum('active', 'archived')
created_at: timestamp
updated_at: timestamp
```

#### 5. messages
```sql
id: uuid (PK)
conversation_id: uuid (FK)
role: enum('user', 'assistant', 'system')
content: text
metadata: json (para dados estruturados)
created_at: timestamp
```

#### 6. tasks (tarefas do sistema)
```sql
id: uuid (PK)
user_id: uuid (FK)
title: varchar
description: text
departamento: enum('suporte', 'comercial', 'tecnico', 'financeiro', 'trafego', 'social')
urgencia: int (1-5)
status: enum('pendente', 'em_andamento', 'concluida', 'cancelada')
due_date: timestamp
assigned_to: uuid (FK, nullable)
created_at: timestamp
```

#### 7. ad_campaigns (para Gestor de Tráfego)
```sql
id: uuid (PK)
user_id: uuid (FK)
platform: enum('meta', 'google', 'tiktok', 'linkedin')
campaign_name: varchar
budget: decimal
daily_spend: decimal
status: enum('ativa', 'pausada', 'finalizada')
roas: decimal
ctr: decimal
cpc: decimal
conversions: int
start_date: timestamp
end_date: timestamp
```

#### 8. content_calendar (para Radar Estratégico)
```sql
id: uuid (PK)
client_id: uuid (FK)
content_type: enum('feed', 'story', 'reel', 'carousel')
title: varchar
description: text
scheduled_date: timestamp
status: enum('ideia', 'aprovado', 'producao', 'agendado', 'publicado')
hook: text
cta: text
platforms: text[]
```

#### 9. ai_platform_accounts (custos de IA)
```sql
id: uuid (PK)
user_id: uuid (FK)
platform: varchar (ex: 'Manus Pro', 'Claude', 'Kimi')
account_name: varchar
plan: varchar
total_credits: decimal
used_credits: decimal
renewal_date: timestamp
cost_per_credit: decimal
```

#### 10. insights (Radar de Insights)
```sql
id: uuid (PK)
user_id: uuid (FK)
source_url: varchar
source_type: enum('tiktok', 'artigo', 'newsletter')
content: text
departamento: enum('trafego', 'social', 'comercial', 'geral')
agent_responsavel: varchar
status: enum('novo', 'em_analise', 'aplicado', 'arquivado')
priority: int (1-5)
created_at: timestamp
```

---

## 🖥️ ESTRUTURA DE TELAS

### 1. Tela de Login
**Rota:** `/login`
**Layout:**
- Fundo gradiente escuro (#0e0e0e → #1a1919)
- Card centralizado (max-width 420px)
- Logo Totum no topo
- Formulário: email, senha, botão "Entrar"
- Link "Esqueci minha senha"
- Footer: "Ainda não tem conta? Solicite acesso"

**Funcionalidades:**
- Validação de email
- Toggle mostrar/ocultar senha
- Mensagem de erro amigável
- Redirect após login para `/hub`

### 2. Tela de Registro (via Convite)
**Rota:** `/register?token=XYZ`
**Layout:** Similar ao login
**Campos:**
- Nome completo
- Email (pré-preenchido do convite)
- Senha (mínimo 8 chars, 1 maiúscula, 1 número)
- Confirmar senha
- Checkbox "Aceito os termos"

### 3. Hub Central (Dashboard Principal)
**Rota:** `/hub`
**Layout:**
- Sidebar esquerda (colapsável em mobile)
- Header com: Logo, busca, notificações, avatar do usuário
- Grid de cards de agentes (1 col mobile, 2 tablet, 3 desktop)

**Sidebar:**
- Logo Totum
- Menu: Hub, Custos de IA, Admin (apenas master/admin)
- Filtro por departamento (toggle buttons)
- Footer: versão + logout

**Cards de Agentes (cada card):**
- Ícone do agente (48px, cor primária)
- Nome do agente
- Badge do departamento
- Descrição curta (2 linhas)
- Botão "Abrir" (primário)
- Hover: elevação + shadow

**Agentes a exibir:**
1. Atendente Totum (Suporte)
2. Gestor de Tráfego (Performance)
3. Radar Estratégico (Social Media)
4. Kimi/OpenClaw (Executivo)

### 4. Agente Atendente Totum
**Rota:** `/agentes/atendente`
**Layout:** Chat-style interface

**Sidebar esquerda (colapsável mobile):**
- Lista de conversas/tickets
- Filtros: Todos, Pendentes, Urgentes, Concluídos
- Botão "Nova Conversa"

**Área principal (chat):**
- Header: Título + badges (departamento, urgência)
- Mensagens estilo WhatsApp (balões)
- Input de mensagem com:
  - Botão de anexo (upload áudio/txt)
  - Botão de emoji
  - Campo de texto
  - Botão enviar
- Botão "Transcrever Áudio" (quando há áudio)

**Funcionalidades do Chat:**
- Classificação automática de demandas
- Detecção de risco de churn (alerta visual)
- Botões rápidos: "Criar Tarefa", "Agendar", "Transferir"

**Modal "Nova Tarefa":**
- Título
- Descrição
- Departamento (select)
- Urgência (slider 1-5)
- Data de vencimento
- Assignee (select de usuários)

### 5. Agente Gestor de Tráfego
**Rota:** `/agentes/trafego`
**Layout:** Dashboard analítico

**Header:**
- Título + período seletor (Hoje, 7 dias, 30 dias)
- Botão "Adicionar Conta"

**Cards de Performance (grid):**
- Spend Total do Dia
- ROAS Médio
- CTR Médio
- Alertas Ativos

**Gráfico Principal:**
- Linha temporal de spend vs conversões
- Toggle por plataforma (Meta, Google, TikTok)

**Tabela de Campanhas:**
- Nome | Plataforma | Status | Budget | Spend | ROAS | Ações
- Filtros por plataforma e status
- Botão pausar/play inline

**Card "Anomalias Detectadas":**
- Lista de alertas com severidade (cor)
- Cada item: descrição + recomendação + botão "Aplicar"

**Botão "Gerar Relatório Executivo":**
- Gera PDF com:
  - Resumo executivo
  - Principais métricas
  - Gráficos
  - Recomendações

### 6. Agente Radar Estratégico (1 cliente = 1 agente)
**Rota:** `/agentes/radar`
**Layout:** Similar ao CRM

**Sidebar esquerda:**
- Lista de clientes (cards com foto/logo)
- Botão "+ Novo Cliente"
- Search por nome

**Header do cliente selecionado:**
- Logo + Nome do cliente
- Nicho (badge)
- Tabs: Dashboard, Calendário, Pesquisa, Relatórios

**Tab Dashboard:**
- Cards de estatísticas:
  - Conteúdos planejados este mês
  - Posts publicados
  - Taxa de engajamento
  - Próximos eventos sazonais
- Gráfico: Melhores dias/horários de postagem

**Tab Calendário (Editorial):**
- Calendário mensal visual
- Cada dia mostra conteúdos agendados
- Click no dia: abre modal de criação
- Botão "Gerar Planejamento Automático"

**Modal "Novo Conteúdo":**
- Tipo (Feed, Story, Reel, Carousel)
- Título
- Descrição/Ideia
- Hook sugerido
- CTA
- Data/hora
- Plataformas (checkboxes)

**Tab Pesquisa:**
- Input: "Pesquisar trends no TikTok/Instagram"
- Botão "Analisar Concorrentes" (input de @usuario)
- Seção "Trends em Alta" (cards com preview)
- Seção "Hooks Fortes" (lista copiável)

**Tab Relatórios:**
- Lista de relatórios gerados
- Botão "Gerar Relatório Mensal"
- Preview do relatório com comentários

**Modal "Novo Cliente" (Formulário Multi-etapas):**

**Etapa 1: Identidade da Marca**
- Nome da marca
- Nicho (select com opções ou input)
- Proposta Única de Valor (PUV)
- Persona alvo
- Arquétipo da marca
- Círculo Dourado (Porquê, Como, O quê)
- Características da marca
- Tom de voz
- Redes sociais ativas (checkboxes + inputs de @)

**Etapa 2: Performance Histórica**
- Top 3 posts anteriores (links + métricas)
- Formatos que funcionam (checkboxes)
- Melhores horários (input)
- Taxa de engajamento média
- Número de seguidores

**Etapa 3: Contexto de Mercado**
- Concorrentes diretos (input de @)
- Referências de conteúdo (links)
- Posicionamento atual
- Diferenciais competitivos

**Etapa 4: Operacional**
- Frequência de postagem desejada
- Capacidade de produção
- Restrições de conteúdo
- Produtos/serviços em destaque
- Orçamento para tráfego pago
- Observações gerais

**Upload de Planejamentos Anteriores:**
- Dropzone para PDFs
- Lista de arquivos enviados
- Preview dos PDFs

### 7. Agente Kimi/OpenClaw
**Rota:** `/agentes/kimi`
**Layout:** Chat avançado

**Sidebar esquerda:**
- Lista de conversas anteriores
- Cada item: título + preview + data
- Botão "Nova Conversa"

**Header do chat:**
- Seletor de agente: Miguel (Criativo), Liz (Operações), Jarvis (Executivo), Auto
- Indicador de status: Processando, Analisando, Executando, Pronto

**Área de chat:**
- Mensagens com avatar do agente selecionado
- Typing indicator quando processando
- Botões de ação inline quando aplicável

### 8. Dashboard de Custos de IA
**Rota:** `/custos-ia`
**Layout:** Dashboard financeiro

**Header:**
- Custo total do mês (grande número)
- Comparativo com mês anterior (%)

**Grid de Cards (plataformas):**
Cada card:
- Logo da plataforma
- Nome da conta
- Plano atual
- Barra de progresso (créditos usados/total)
- Custo estimado
- Dias até renovação
- Badge de alerta (se ≤5 dias)

**Gráficos:**
- Barras: Custo por plataforma
- Pizza: Distribuição percentual
- Linha: Evolução diária do mês

**Botão "Adicionar Conta":**
- Modal com formulário:
  - Plataforma (select)
  - Nome da conta
  - Plano
  - Total de créditos
  - Custo por crédito
  - Data de renovação

### 9. Painel Administrativo
**Rota:** `/admin`
**Acesso:** Apenas master e admin

**Tabs:**
- Usuários
- Convites
- Logs de Atividade

**Tab Usuários:**
- Tabela: Nome | Email | Role | Status | Ações
- Botão "Editar" (modal)
- Botão "Desativar/Ativar"
- Filtro por role

**Modal "Editar Usuário":**
- Nome
- Email
- Role (select)
- Ativo (toggle)

**Tab Convites:**
- Botão "Gerar Convite"
- Lista de convites ativos:
  - Email
  - Token (mascarado)
  - Expira em
  - Status
  - Ação "Revogar"

**Modal "Novo Convite":**
- Email
- Role (select)
- Gerar token automaticamente (32 chars)
- Mostrar link completo para compartilhar

---

## 🔧 FUNCIONALIDADES ESPECÍFICAS

### 1. Sistema de Notificações
- Toast notifications (top-right)
- Badge de notificações não lidas no header
- Tipos: info, success, warning, error

### 2. Modo Escuro/Claro
- Toggle no header
- Persistência em localStorage
- Transição suave entre modos

### 3. Responsividade
- Mobile: Sidebar vira drawer (swipe ou botão hamburger)
- Tablet: Grid adaptativo
- Desktop: Layout completo

### 4. Animações
- Page transitions (fade)
- Hover effects em cards (elevação)
- Loading states (skeletons)
- Typing indicator no chat

---

## 🔗 INTEGRAÇÕES NECESSÁRIAS

### 1. Supabase (Backend)
- Autenticação (email/senha)
- Database (PostgreSQL)
- Storage (para uploads de PDFs)
- Real-time subscriptions (para chat)

### 2. OpenAI/Claude API
- Processamento de linguagem natural
- Classificação de demandas
- Geração de conteúdo
- Análise de sentimento

### 3. Google APIs
- Google Calendar (agendamentos)
- Google Drive (backup, Notebook LM)
- Google Sheets (exportação de relatórios)

### 4. Meta APIs (opcional - Fase 2)
- Instagram Basic Display
- WhatsApp Business API

### 5. n8n (opcional - Fase 2)
- Webhooks para automações
- Workflows personalizados

---

## 📱 COMPONENTES REUTILIZÁVEIS

Crie estes componentes no Lovable para reuso:

1. **Card** - Container base com estilo Totum
2. **Button** - Variantes: primary, secondary, ghost, danger
3. **Input** - Text, textarea, select, com ícones
4. **Badge** - Variantes por cor e tamanho
5. **Avatar** - Com fallback de iniciais
6. **Modal** - Com overlay e animação
7. **Sidebar** - Colapsável, com navegação
8. **ChatBubble** - Estilo WhatsApp (user vs assistant)
9. **DataTable** - Com sorting, filtering, pagination
10. **Chart** - Wrapper para gráficos (Recharts)
11. **FileUpload** - Dropzone com preview
12. **MultiStepForm** - Wizard de etapas
13. **Calendar** - Visualização mensal
14. **Toast** - Notificações
15. **Skeleton** - Loading states

---

## 🚀 INSTRUÇÕES ESPECÍFICAS PARA LOVABLE

1. **Comece pelo projeto base:**
   - Crie projeto React + TypeScript + Tailwind
   - Configure as cores do tema (tailwind.config.js)
   - Instale shadcn/ui

2. **Estrutura de pastas:**
   ```
   src/
   ├── components/
   │   ├── ui/           (shadcn components)
   │   ├── layout/       (Sidebar, Header, Layout)
   │   └── agents/       (componentes específicos de cada agente)
   ├── pages/
   │   ├── Login.tsx
   │   ├── Register.tsx
   │   ├── Hub.tsx
   │   ├── Atendente.tsx
   │   ├── Trafego.tsx
   │   ├── Radar.tsx
   │   ├── Kimi.tsx
   │   ├── CustosIA.tsx
   │   └── Admin.tsx
   ├── hooks/
   ├── lib/
   │   ├── supabase.ts
   │   ├── utils.ts
   │   └── constants.ts
   └── types/
   ```

3. **Supabase Setup:**
   - Crie projeto no Supabase
   - Execute as migrations das tabelas
   - Configure auth (email magic link ou password)
   - Copie URL e anon key para variáveis de ambiente

4. **Páginas para criar em ordem:**
   1. Login/Register
   2. Layout base (Sidebar + Header)
   3. Hub (grid de agentes)
   4. Um agente completo (ex: Atendente)
   5. Os demais agentes
   6. Admin

5. **Estado Global:**
   - Use Zustand ou React Context
   - User auth state
   - Tema (dark/light)
   - Sidebar state

---

## ✅ CHECKLIST DE ENTREGA

- [ ] Todas as telas descritas funcionando
- [ ] Autenticação completa (login/register)
- [ ] Dark/light mode funcionando
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Integração com Supabase
- [ ] Pelo menos 1 agente com funcionalidade end-to-end
- [ ] Sistema de notificações
- [ ] Loading states em todas as páginas
- [ ] Error handling amigável
- [ ] Animações suaves

---

## 💡 DICAS PARA MELHOR RESULTADO NO LOVABLE

1. **Seja específico nas cores:** Forneça os hex codes exatos
2. **Forneça referências visuais:** Se tiver screenshots, anexe
3. **Peça por partes:** Comece com o layout base, depois adicione funcionalidades
4. **Teste interativamente:** Use o preview do Lovable para validar
5. **Itere:** Peça ajustes específicos quando necessário
6. **Use o GitHub:** Exporte para o repo `grupototum/apps_totum` quando pronto

---

**Prompt pronto para usar no Lovable! 🚀**
Copie este texto completo e cole no campo de prompt do Lovable.dev
