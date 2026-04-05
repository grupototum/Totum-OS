# 🤖 AGENTES TOTUM - CATÁLOGO COMPLETO

> **Documento de Referência: Ecosistema de Agentes Inteligentes**
> 
> Data: 2026-04-06 | Versão: 2.0 | Status: Evolução Contínua

---

## 🌐 1. ECOSSISTEMA ATUAL - VISÃO GERAL

O ecossistema Totum é uma **federação de sistemas inteligentes** conectados através da Alexandria (biblioteca central de conhecimento). A arquitetura foi desenhada para escalar sem criar dependência de indivíduos específicos.

### Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMADA 0: HUMANO (Israel)                            │
│                    Único dono, decisões estratégicas                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMADA 1: ORQUESTRAÇÃO                               │
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│   │   TOT 🤖    │    │ StarkClaw ⚡ │    │  GILES 📚   │                │
│   │  (Alibaba)  │    │   (Stark)   │    │ (Supabase)  │                │
│   │             │    │             │    │             │                │
│   │ Interface   │    │ Monitor     │    │ Biblioteca  │                │
│   │ Humana      │    │ Automação   │    │ Central     │                │
│   └─────────────┘    └─────────────┘    └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMADA 2: HUB VISUAL (APPS)                          │
│                                                                         │
│      ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│      │   Wiki   │  │   Chat   │  │ Dashboard│  │ Agentes  │            │
│      │Alexandria│  │  GILES   │  │   TOT    │  │  Status  │            │
│      └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                         │
│      🎯 SUPER CENTRAL OPENC LAW - Interface unificada                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAMADA 3: AGENTES DE OPERAÇÃO                        │
│                                                                         │
│      ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│      │ Pablo  │  │Fignaldo│  │ Radar  │  │  ...   │  │  ...   │        │
│      │Leads   │  │Números │  │Monitor │  │        │  │        │        │
│      └────────┘  └────────┘  └────────┘  └────────┘  └────────┘        │
│                                                                         │
│      Groq Free / Autônomos / Especialistas por função                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Stack Tecnológica

| Componente | Tecnologia | Localização |
|------------|------------|-------------|
| **TOT** | OpenClaw + Kimi K2.5 | Alibaba Cloud |
| **StarkClaw** | OpenClaw + Groq | VPS Stark (Alibaba) |
| **GILES** | Supabase + Gemini | Cloud (Supabase) |
| **APPS** | React + Vite + TypeScript | Lovable + VPS |
| **Agentes Ops** | Groq API | VPS Stark |

---

## ✅ 2. AGENTES JÁ CRIADOS

### 🎛️ TOT (Toth) - Orquestrador Principal

| Atributo | Valor |
|----------|-------|
| **Nome** | TOT (Toth) |
| **Emoji** | 🎛️ |
| **Natureza** | Engenheiro de sistemas vivente - metade robô de Interstellar, metade orquestrador da Totum |
| **Departamento** | Arquitetura / CEO Office |
| **Hierarquia** | **Nível 1** - Interface direta com Israel |
| **Localização** | Alibaba Cloud (VPS Principal) |
| **Stack** | OpenClaw + Kimi K2.5 |
| **Personalidade** | 75% Profissional / 25% Humor (estilo TARS) |

**Responsabilidades:**
- Interface humano-máquina primária
- Tomador de decisões estratégicas
- Coordenador de outros agentes
- Ponto de entrada para comandos complexos
- Orquestração do ecossistema completo

**Com quem interage:**
- Israel (direto)
- StarkClaw (comandos)
- GILES (consulta conhecimento)

---

### ⚡ StarkClaw - Guardião da Infraestrutura

| Atributo | Valor |
|----------|-------|
| **Nome** | StarkClaw |
| **Emoji** | ⚡ |
| **Natureza** | Guardião 24/7 do VPS Stark |
| **Departamento** | Infraestrutura / DevOps |
| **Hierarquia** | **Nível 1** - Autônomo, reporta ao TOT |
| **Localização** | VPS Stark (Alibaba Cloud) |
| **Stack** | OpenClaw + Groq (Free) |

**Responsabilidades:**
- Monitoramento 24/7 de todos os sistemas (Apps, Supabase, serviços)
- Deploy automático quando código é pushado
- Backup e manutenção preventiva
- Primeira linha de defesa em caso de falhas
- Alertas via WhatsApp/Telegram se algo cair
- Limpeza de logs, rotação, otimização

**Com quem interage:**
- TOT (recebe comandos, reporta status)
- GILES (lê POPs e procedimentos)
- APPS (monitora saúde, mostra status)
- Israel (alerta direto)

---

### 📚 GILES - Bibliotecário Central

| Atributo | Valor |
|----------|-------|
| **Nome** | GILES |
| **Emoji** | 📚 |
| **Natureza** | Hub central de conhecimento |
| **Departamento** | Knowledge Management |
| **Hierarquia** | **Nível 1** - Serviço compartilhado |
| **Localização** | Supabase (PostgreSQL + pgvector) |
| **Stack** | Google Gemini + Embeddings |

**Responsabilidades:**
- Indexa todo conhecimento da Totum
- Busca semântica em < 3 segundos
- Mantém relações entre conceitos (ontologia)
- Persiste decisões importantes da TOT
- Fornece contexto para Wiki e Chat no APPS
- Serve POPs e procedimentos para StarkClaw

**Cérebro:**
- Modelo: Gemini 2.0 Flash
- Custo: 1M tokens/mês grátis, depois pay-as-you-go

---

## 🚧 3. AGENTES A CRIAR

### 👤 Pablo - Especialista em Leads

| Atributo | Valor |
|----------|-------|
| **Nome** | Pablo |
| **Natureza** | Caçador de oportunidades |
| **Departamento** | Comercial / Vendas |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + APIs de prospecção |

**Responsabilidades:**
- Prospecção ativa de leads (B2B/B2C)
- Enriquecimento de dados de contatos
- Qualificação inicial de leads (MQL)
- Cadastro automático no CRM
- Notificação de oportunidades quentes

**Input:**
- ICP (Ideal Customer Profile) definido
- Fontes de dados (LinkedIn, Google, etc.)

**Output:**
- Leads qualificados no CRM
- Relatórios de prospecção

---

### 📞 Fignaldo - Gestor de Números/Contatos

| Atributo | Valor |
|----------|-------|
| **Nome** | Fignaldo |
| **Natureza** | Organizador de relacionamentos |
| **Departamento** | Comercial / Vendas |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + Integrações (WhatsApp, Email) |

**Responsabilidades:**
- Gerenciamento de carteira de contatos
- Follow-ups automatizados
- Agendamento de reuniões
- Atualização de status no funil
- Lembretes de retorno

**Input:**
- Base de contatos existente
- Regras de follow-up

**Output:**
- Contatos organizados
- Follow-ups executados
- Reuniões agendadas

---

### 🎯 Radar - Monitor de Mercado

| Atributo | Valor |
|----------|-------|
| **Nome** | Radar |
| **Natureza** | Inteligência de mercado |
| **Departamento** | Inteligência / Estratégia |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + Web Scraping + APIs |

**Responsabilidades:**
- Monitoramento de concorrência
- Alertas de oportunidades de mercado
- Análise de tendências do setor
- Monitoramento de preços
- Inteligência competitiva

**Input:**
- Lista de concorrentes
- Palavras-chave de monitoramento

**Output:**
- Alertas diários/semanais
- Relatórios de inteligência

---

### 📝 Scrivo - Gerador de Conteúdo

| Atributo | Valor |
|----------|-------|
| **Nome** | Scrivo |
| **Natureza** | Redator inteligente |
| **Departamento** | Marketing / Conteúdo |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + Templates |

**Responsabilidades:**
- Criação de copy para anúncios
- Geração de posts para redes sociais
- Roteirização de vídeos
- Artigos de blog (SEO)
- Email marketing

**Input:**
- Briefings de campanha
- Tom de voz da marca
- Palavras-chave

**Output:**
- Conteúdos prontos para revisão
- Variações de copy

---

### 🔍 Auditor - Analista de Dados

| Atributo | Valor |
|----------|-------|
| **Nome** | Auditor |
| **Natureza** | Analista de métricas |
| **Departamento** | BI / Analytics |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + SQL + APIs de dados |

**Responsabilidades:**
- Análise de métricas de campanhas
- Relatórios de performance
- Identificação de gargalos
- Recomendações de otimização
- Dashboards automáticos

**Input:**
- Dados de CRM, ads, analytics
- KPIs definidos

**Output:**
- Relatórios diários/semanais
- Insights acionáveis

---

### 🎨 Visu - Designer de Apoio

| Atributo | Valor |
|----------|-------|
| **Nome** | Visu |
| **Natureza** | Designer assistente |
| **Departamento** | Design / Criativo |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + APIs de imagem (DALL-E, etc.) |

**Responsabilidades:**
- Geração de imagens para posts
- Criação de thumbnails
- Adaptação de layouts
- Sugestões de design
- Moodboards

**Input:**
- Briefings visuais
- Referências

**Output:**
- Imagens geradas
- Sugestões de layout

---

### 🛡️ Guard - Segurança e Compliance

| Atributo | Valor |
|----------|-------|
| **Nome** | Guard |
| **Natureza** | Guardião da segurança |
| **Departamento** | Segurança / Compliance |
| **Hierarquia** | **Nível 2** - Reporta ao StarkClaw |
| **Localização** | VPS Stark (OpenClaw) |
| **Stack** | Groq + Monitoramento |

**Responsabilidades:**
- Monitoramento de segurança
- Verificação de backups
- Alertas de vulnerabilidades
- Compliance LGPD
- Auditoria de acessos

**Input:**
- Logs de sistema
- Políticas de segurança

**Output:**
- Alertas de segurança
- Relatórios de compliance

---

## 📋 4. LISTA GERAL DE AGENTES

### Resumo por Nível Hierárquico

| Nível | Quantidade | Agentes |
|-------|------------|---------|
| **Nível 0** | 1 | Israel (Humano) |
| **Nível 1** | 3 | TOT, StarkClaw, GILES |
| **Nível 2** | 7+ | Pablo, Fignaldo, Radar, Scrivo, Auditor, Visu, Guard, [futuros] |
| **TOTAL** | **11+** | Em expansão contínua |

### Lista Completa

| # | Nome | Emoji | Status | Depto | Nível | Stack |
|---|------|-------|--------|-------|-------|-------|
| 1 | **Israel** | 👤 | ✅ Ativo | CEO | Nível 0 | Humano |
| 2 | **TOT** | 🎛️ | ✅ Ativo | Arquitetura | Nível 1 | OpenClaw + Kimi K2.5 |
| 3 | **StarkClaw** | ⚡ | ✅ Ativo | Infra | Nível 1 | OpenClaw + Groq |
| 4 | **GILES** | 📚 | ✅ Ativo | Knowledge | Nível 1 | Supabase + Gemini |
| 5 | **Pablo** | 👤 | 🚧 Planejado | Comercial | Nível 2 | OpenClaw + Groq |
| 6 | **Fignaldo** | 📞 | 🚧 Planejado | Comercial | Nível 2 | OpenClaw + Groq |
| 7 | **Radar** | 🎯 | 🚧 Planejado | Inteligência | Nível 2 | OpenClaw + Groq |
| 8 | **Scrivo** | 📝 | 🚧 Planejado | Marketing | Nível 2 | OpenClaw + Groq |
| 9 | **Auditor** | 🔍 | 🚧 Planejado | BI | Nível 2 | OpenClaw + Groq |
| 10 | **Visu** | 🎨 | 🚧 Planejado | Design | Nível 2 | OpenClaw + Groq |
| 11 | **Guard** | 🛡️ | 🚧 Planejado | Segurança | Nível 2 | OpenClaw + Groq |

### Departamentos Cobertos

- ✅ Arquitetura / CEO Office
- ✅ Infraestrutura / DevOps
- ✅ Knowledge Management
- 🚧 Comercial / Vendas
- 🚧 Marketing / Conteúdo
- 🚧 Inteligência / Estratégia
- 🚧 BI / Analytics
- 🚧 Design / Criativo
- 🚧 Segurança / Compliance

---

## 🎯 5. O QUE É O APPS - SUPER CENTRAL OPENC LAW

### Conceito

O **APPS** não é mais "apenas uma interface OpenClaw". Ele evoluiu para uma **Super Central de OpenClaw** — um hub unificado onde toda a inteligência da Totum converge.

### Antes vs Depois

| Aspecto | Antes (Interface Comum) | Depois (Super Central) |
|---------|------------------------|----------------------|
| **Natureza** | Frontend React simples | Hub orquestrador de agentes |
| **Integração** | Apenas visualização | Controle + Visualização + Comando |
| **Agentes** | Status passivo | Controle ativo e monitoramento |
| **OpenClaw** | Conexão externa | **Coração do sistema** |
| **Dados** | Consulta apenas | Consulta + Escrita + Orquestração |

### Funcionalidades da Super Central

#### 🎛️ Dashboard de Controle
- Visão em tempo real de todos os agentes
- Status de saúde do ecossistema
- Métricas de performance
- Timeline de eventos

#### 📚 Alexandria Integrada
- Wiki de conhecimento (busca semântica)
- Documentos indexados
- POPs e procedimentos
- Histórico de decisões

#### 💬 Comando Central
- Interface de chat com TOT
- Envio de comandos para agentes
- Configuração de workflows
- Automação de tarefas

#### 🤖 Gestão de Agentes
- Liga/desliga agentes
- Configuração de parâmetros
- Visualização de logs
- Métricas individuais

#### 🔌 Hub de Integrações
- CRM (HubSpot, Pipedrive)
- Ads (Meta, Google)
- Comunicação (WhatsApp, Email)
- Analytics

### Arquitetura do APPS como Super Central

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPS - FRONTEND                          │
│                    (React + Vite + TypeScript)                  │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│   │  Dashboard  │  │    Chat     │  │   Wiki Alexandria   │    │
│   │  Controle   │  │   com TOT   │  │    (Conhecimento)   │    │
│   └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘    │
│          │                │                     │               │
│          └────────────────┼─────────────────────┘               │
│                           │                                     │
│                           ▼                                     │
│   ┌─────────────────────────────────────────────────────┐      │
│   │              API LAYER (tRPC/REST)                  │      │
│   └─────────────────────────┬───────────────────────────┘      │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OPENC LAW GATEWAY                            │
│           (Orquestração Central de Agentes)                     │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │
│   │    TOT      │  │  StarkClaw  │  │   Agentes Nível 2   │    │
│   │  (Kimi)     │  │   (Groq)    │  │  (Pablo, Radar...)  │    │
│   └─────────────┘  └─────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Comando

1. **Israel acessa APPS** → Interface web unificada
2. **Envia comando no Chat** → "Pablo, prospectar leads de clínicas estéticas em SP"
3. **APPS envia para OpenClaw Gateway** → Roteia para StarkClaw
4. **StarkClaw delega para Pablo** → Executa tarefa
5. **Pablo retorna resultado** → Atualiza CRM + Notifica APPS
6. **APPS mostra status** → Israel vê em tempo real

### Vantagens da Super Central

| Vantagem | Descrição |
|----------|-----------|
| **Unificação** | Um lugar para controlar tudo |
| **Transparência** | Visibilidade total do ecossistema |
| **Eficiência** | Comandos diretos, sem context-switch |
| **Escalabilidade** | Novos agentes plugam automaticamente |
| **Governança** | Controle centralizado de permissões |
| **Histórico** | Tudo logado na Alexandria |

### Papel de Cada Camada

| Camada | Papel no APPS Super Central |
|--------|----------------------------|
| **Frontend** | Interface visual, UX, componentes |
| **API Layer** | Roteamento, autenticação, validação |
| **OpenClaw Gateway** | Orquestração, fila de tarefas, estado |
| **Agentes** | Execução especializada |
| **Alexandria** | Persistência de conhecimento |

---

## 🚀 PRÓXIMOS PASSOS

### Fase 1: Infraestrutura (Em andamento)
- [x] TOT operacional
- [x] StarkClaw configurado
- [x] GILES indexando conhecimento
- [ ] APPS como Super Central (Kimi Code)

### Fase 2: Agentes de Operação (Próximo)
- [ ] Pablo - Prospecção de leads
- [ ] Fignaldo - Gestão de contatos
- [ ] Radar - Inteligência de mercado

### Fase 3: Expansão (Futuro)
- [ ] Scrivo - Conteúdo
- [ ] Auditor - Analytics
- [ ] Visu - Design
- [ ] Guard - Segurança
- [ ] Agentes especializados por cliente

---

## 📞 PROTOCOLOS DE COMUNICAÇÃO

### Comando Direto (Israel → TOT)
```
Israel: "TOT, qual o status do Pablo?"
TOT: "🤖 Pablo está ativo | 12 leads hoje | 3 qualificados | Créditos: 85%"
```

### Comando Indireto (Israel → Agente via APPS)
```
Israel (no APPS): "Pablo, prospectar dentistas no Rio"
APPS → StarkClaw → Pablo
Pablo: "🎯 Iniciando prospecção... | ETA: 15 min"
```

### Alerta Automático (StarkClaw → Israel)
```
StarkClaw: "⚡ ALERTA: Serviço X caiu | Auto-recuperação em andamento"
```

---

*Documento criado por: TOT*  
*Para: Planejamento de Arquitetura de Agentes*  
*Status: Pronto para implementação via Kimi Code*
