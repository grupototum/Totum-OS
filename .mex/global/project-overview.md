# Project Overview
## Apps Totum - Hub Central de Agentes

---

## 🎯 Visão

Apps Totum é o ecossistema de agentes de IA que potencializa o Grupo Totum. Cada app é um agente especializado em uma função de negócio.

---

## 🏗️ Arquitetura

### Stack Tecnológica
```
Frontend:     React 18 + TypeScript
Styling:      Tailwind CSS + shadcn/ui
State:        React Query + Context API
Backend:      tRPC + Drizzle ORM
Database:     SQLite (local) / PostgreSQL (prod)
Build:        Vite
Auth:         Supabase Auth (planejado)
```

### Estrutura de Pastas
```
apps_totum/
├── src/
│   ├── components/ui/     # Componentes shadcn
│   ├── pages/             # Páginas (Login, Hub)
│   ├── hooks/             # Custom hooks
│   ├── contexts/          # React contexts
│   ├── integrations/      # APIs e MCPs
│   └── lib/               # Utilitários
├── .mex/                  # Contexto MEX
├── public/                # Assets estáticos
└── ...config files
```

---

## 📱 Apps

### Atendente Totum 💬
Bot de atendimento multi-canal (Telegram, futuramente WhatsApp).

**Status:** 🟢 Online  
**Stack:** Python + Ollama/Groq + SQLite  
**Features:**
- Roteamento inteligente
- Base de conhecimento
- Transcrição de áudio
- Criação de tarefas

### Gestor de Tráfego 📊
Gestão automatizada de campanhas Meta Ads.

**Status:** 🟡 Standby  
**Features planejadas:**
- Auditoria diária
- Pausa automática em anomalias
- Relatórios executivos
- Análise de criativos

### Radar Estratégico 🎯
Inteligência de mercado e análise de concorrência.

**Status:** 🟡 Standby  
**Features planejadas:**
- Monitoramento de concorrentes
- Trends TikTok/Instagram
- Sugestão de conteúdo
- Matriz de reaproveitamento

---

## 🔧 Infraestrutura

### VPS Atuais
| VPS | Especificação | Função | Status |
|-----|---------------|--------|--------|
| VPS 7GB | 2 vCPU / 7GB RAM | OpenClaw + Bot + Coordenação | 🟢 Online |
| VPS KVM4 | 4 vCPU / 16GB RAM | IA Local + Hospedagem | 🟡 Aguardando |

### Git Workflow
```
Lovable/Antigravity → GitHub → VPS/Mac (sync automático)
```

---

## 👥 Time (Trindade)

Sistema de agentes de IA para gerenciamento do projeto:

- **Miguel** (Arquiteto) - Estratégia técnica
- **Liz** (Guardiã) - Qualidade e operações  
- **Jarvis** (Executor) - Implementação

---

## 📊 Métricas

### Custos Mensais (Meta)
- IAs: ~R$ 660
- Ferramentas: ~R$ 494
- Hospedagem: ~R$ 60
- **Total:** ~R$ 1.214

### Receitas
- Meta: Sistemas gerando receita recorrente

---

## 🎯 Roadmap

### Fase 1 (Atual)
- ✅ Bot Atendente no ar
- ✅ MEX instalado
- 🔄 Dashboard unificado

### Fase 2
- Gestor de Tráfego MVP
- Radar Estratégico MVP
- Context Hub online

### Fase 3
- Domínio próprio
- Multi-tenant
- n8n integrado

---

*Documentação v1.0 - Apps Totum*