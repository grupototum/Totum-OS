# MEX Routing Table
# Apps Totum - Mapa de Contexto

## 🎯 Visão Geral
Este documento serve como ponto de entrada para qualquer IA trabalhando no Apps Totum.
Use este arquivo para navegar para o contexto específico necessário.

---

## 📁 Estrutura de Contexto

```
.mex/
├── routing.md              <- VOCÊ ESTÁ AQUI
├── mex.config.yaml         <- Configuração do sistema
├── global/                 <- Contexto compartilhado
│   ├── project-overview.md
│   ├── architecture.md
│   ├── design-system.md
│   └── agents-trindade.md
├── apps/                   <- Contexto por app
│   ├── atendente/
│   │   └── context.md
│   ├── gestor-trafego/
│   │   └── context.md
│   └── radar-estrategico/
│       └── context.md
└── curator/                <- Índices e análises
    ├── changelog.md
    └── health-report.md
```

---

## 🚀 Apps Disponíveis

### 💬 Atendente Totum
**Status:** 🟢 Online  
**Descrição:** Bot de atendimento via Telegram com IA local  
**Stack:** Python + Ollama/Llama 3.2 + Opik  
**Contexto:** [apps/atendente/.mex/context.md](./apps/atendente/.mex/context.md)  

**Funcionalidades Principais:**
- Roteamento inteligente de demandas
- Base de conhecimento em SQLite
- Transcrição de áudio (Whisper)
- Monitoramento via Opik

---

### 📊 Gestor de Tráfego
**Status:** 🟡 Standby (aguardando desenvolvimento)  
**Descrição:** Gestão automatizada de anúncios e campanhas  
**Stack:** TypeScript + React + API Meta Ads  
**Contexto:** [apps/gestor-trafego/.mex/context.md](./apps/gestor-trafego/.mex/context.md)

**Funcionalidades Planejadas:**
- Auditoria diária de campanhas
- Detector de anomalias
- Protetor de contas (pausa automática)
- Insights semanais

---

### 🎯 Radar Estratégico
**Status:** 🟡 Standby (aguardando desenvolvimento)  
**Descrição:** Inteligência de mercado e análise de concorrência  
**Stack:** TypeScript + React + APIs diversas  
**Contexto:** [apps/radar-estrategico/.mex/context.md](./apps/radar-estrategico/.mex/context.md)

**Funcionalidades Planejadas:**
- Monitoramento de concorrentes
- Análise de trends (TikTok, Instagram)
- Sugestão de conteúdo
- Melhores dias de postagem

---

## 🧠 A Trindade (Agentes)

Sistema de gerenciamento de IA que decide qual modelo usar:

### 🤖 Miguel (Arquiteto)
- **Função:** Estratégia técnica, arquitetura, decisões estruturais
- **Quando usar:** Planejamento, refactor, escolha de tecnologias
- **IA recomendada:** Claude (análise profunda)

### 👩‍💻 Liz (Guardiã)
- **Função:** Operações, análise, eficiência, qualidade
- **Quando usar:** Code review, debugging, otimização, documentação
- **Personalidade:** Analítica, direta, humor seco
- **IA recomendada:** Kimi (velocidade + precisão)

### 🦾 Jarvis (Executor)
- **Função:** Implementação, automação, tarefas repetitivas
- **Quando usar:** CRUDs, scripts, configurações, deploy
- **IA recomendada:** Groq (velocidade extrema)

**Documentação completa:** [global/agents-trindade.md](./global/agents-trindade.md)

---

## 🎨 Design System

**Cores:**
- Primária: `#f76926` (Laranja Totum)
- Fundo: `#050505` / `#0a0a0a`
- Texto: `#ffffff` / `#a3a3a3`

**Documentação completa:** [global/design-system.md](./global/design-system.md)

---

## 🔧 Arquitetura Técnica

**Stack Principal:**
- Frontend: React + TypeScript + Tailwind
- Backend: tRPC + Drizzle + SQLite
- Build: Vite
- UI: shadcn/ui + Radix

**Documentação completa:** [global/architecture.md](./global/architecture.md)

---

## 🔄 Workflow de Desenvolvimento

```
Lovable (estrutura/integrações) 
    ↓
GitHub (push automático)
    ↓
Notifica Mac + VPS (sync)
    ↓
Antigravity (manutenção/correções)
    ↓
Totum Claw (coordenação)
```

---

## 📊 Status do Sistema

| Componente | Status |
|------------|--------|
| VPS 7GB (OpenClaw) | 🟢 Online |
| VPS KVM4 (16GB) | 🟡 Aguardando configuração |
| GitHub Sync | 🟢 Conectado |
| Bot Atendente | 🟢 Online (@totum_agents_bot) |
| MEX Scaffold | 🟢 Instalado |
| Context Hub | 🟡 Em desenvolvimento |

---

## 📝 Notas para IAs

1. **Sempre verifique** este arquivo antes de começar a trabalhar
2. **Nunca assuma** contexto de outro app sem verificar o `.mex/` específico
3. **Mantenha sincronizado** - se fizer mudanças, atualize os arquivos de contexto
4. **Use a Trindade** - delegue para o agente certo conforme a natureza da tarefa

---

*Última atualização: 2026-03-31*  
*MEX Version: 1.0.0*