# 🏛️ ARQUITETURA TOTUM - Estrutura Integrada

**Data:** 2026-04-03  
**Status:** Proposta de arquitetura  

## Visão Geral

Todas as aplicações conectadas via **Supabase** como camada de dados central, com **N8N** como orquestrador de automações, tudo acessível através do **Apps Totum** como interface unificada.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      APPS TOTUM                             │
│              (Interface Unificada - Porta 4175)             │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │  Dashboard│  ADA    │ Claudio │  Clientes│  Config  │   │
│  │  Geral    │  Análise│  Code   │          │          │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  UPIXEL CRM  │ │ TOTUM SYSTEM │ │  STARK API   │
│   (Porta     │ │   (Porta     │ │   (Porta     │
│    4173)     │ │    4174)     │ │    3000)     │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    SUPABASE     │
              │  (PostgreSQL +  │
              │   Realtime +    │
              │    Storage)     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │      N8N        │
              │  (Automações +  │
              │  Integrações)   │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ WhatsApp │ │  Email   │ │  Outros  │
   │  (API)   │ │ (SMTP)   │ │ Serviços │
   └──────────┘ └──────────┘ └──────────┘
```

## Componentes

### 1. UPIXEL CRM (Porta 4173)
- **Função:** Gestão de leads e clientes
- **Banco:** Supabase (tabelas: leads, clients, interactions)
- **Integração:** N8N para automações de follow-up
- **Conexão:** Acessível via Apps Totum

### 2. TOTUM SYSTEM (Porta 4174)
- **Função:** Sistema principal de gestão
- **Banco:** Supabase (tabelas: projects, tasks, users)
- **Integração:** N8N para workflows internos
- **Conexão:** Acessível via Apps Totum

### 3. STARK API (Porta 3000)
- **Função:** API de infraestrutura e agentes
- **Integração:** Comunica com todos os serviços
- **Banco:** SQLite/PostgreSQL próprio
- **Conexão:** Usado por Apps Totum e N8N

### 4. SUPABASE (Camada de Dados)
- **Função:** Banco de dados central PostgreSQL
- **Features:** Realtime subscriptions, Auth, Storage
- **Uso:** Dados compartilhados entre Upixel e Totum
- **Vantagem:** Uma fonte de verdade, sem sincronização complexa

### 5. N8N (Orquestrador)
- **Função:** Automações e integrações
- **Conexões:**
  - Supabase (triggers e queries)
  - WhatsApp API
  - Email (SMTP)
  - Outros serviços (Stripe, etc.)
- **Workflows:**
  - Lead entra → Qualificação automática
  - Tarefa atrasada → Alerta no WhatsApp
  - Pagamento recebido → Ativação automática

### 6. APPS TOTUM (Porta 4175)
- **Função:** Interface unificada
- **Módulos:**
  - Dashboard geral (visão 360°)
  - ADA (análise de código/repos)
  - Claudio Code (coding agent)
  - Clientes (CRM integrado)
  - Projetos (gestão)
  - Tarefas
  - Configurações
- **Conexão:** Consome APIs de Upixel, Totum, Stark

## Fluxos de Dados

### Exemplo 1: Novo Lead
```
Landing Page → Upixel CRM (Supabase)
                    ↓
              N8N (trigger)
                    ↓
           ┌────────┴────────┐
           ▼                 ▼
    Qualificação      WhatsApp Alert
    automática        (time comercial)
           │                 │
           └────────┬────────┘
                    ▼
              Apps Totum
           (Dashboard atualizado)
```

### Exemplo 2: Análise de Código
```
Desenvolvedor → Apps Totum (ADA)
                      ↓
               Claudio Code
               (subagente Claude)
                      ↓
               Stark API
                      ↓
               Análise + Sugestões
                      ↓
               Apps Totum (resultado)
```

## Vantagens desta Arquitetura

| Aspecto | Benefício |
|---------|-----------|
| **Dados** | Uma fonte de verdade (Supabase) |
| **Automação** | N8N conecta tudo sem código |
| **Interface** | Apps Totum unifica a experiência |
| **Escalabilidade** | Cada componente pode escalar independente |
| **Manutenção** | Mudanças isoladas, não quebra tudo |

## Próximos Passos

1. ✅ Configurar N8N (instalar no servidor)
2. ✅ Migrar dados para Supabase (se ainda não estiverem lá)
3. ✅ Criar workflows iniciais no N8N
4. ✅ Integrar Apps Totum com APIs do Upixel/Totum

## Status
⏳ Arquitetura proposta - aguardando validação de Israel
