# 📇 INDEX - Mapa do Workspace TOT

> **Giles, o Bibliotecário** — Índice central de navegação  
> Data: 2026-04-05 | Versão: 1.1 | Status: 🟢 Reorganizado

---

## 🗺️ NAVEGAÇÃO RÁPIDA

| 🔍 O que você precisa? | 📍 Onde está? | 🔗 Acesso |
|------------------------|---------------|-----------|
| Regras do sistema | [`AGENTS.md`](./AGENTS.md) | Core |
| Quem sou eu (TOT) | [`IDENTITY.md`](./IDENTITY.md) | Core |
| Meu humano (Israel) | [`USER.md`](./USER.md) | Core |
| Tarefas pendentes | [`TODO.md`](./TODO.md) | Estado |
| **Agentes da Totum** | [`AGENTES_TOTUM.md`](./AGENTES_TOTUM.md) | Documentação |
| Organograma | [`agents/ORGANOGRAMA.md`](./agents/ORGANOGRAMA.md) | Visual |
| **Prompt Manus/Alexandria** | [`PROMPT_MANUS_ALEXANDRIA.md`](./PROMPT_MANUS_ALEXANDRIA.md) | Integração |

---

## 📁 ESTRUTURA DO WORKSPACE (Reorganizada)

### 🧠 CORE DO SISTEMA (Raiz)

```
📦 workspace/
├── 📇 INDEX.md                    ← VOCÊ ESTÁ AQUI
├── 🤖 AGENTES_TOTUM.md            ← Hierarquia completa de agentes
├── 🏛️ ESTRUTURA_ALEXANDRIA.md     ← Arquitetura do Supabase
├── 📋 PROPOSTA_REORGANIZACAO_TOT.md ← Plano de consolidação
│
├── AGENTS.md                      # Regras de comportamento
├── SOUL.md                        # Personalidade base
├── USER.md                        # Perfil de Israel
├── IDENTITY.md                    # Identidade TOT
├── TODO.md                        # Quadro de tarefas
└── HEARTBEAT.md                   # Configuração de heartbeat
```

### 🤖 AGENTES

```
agents/
├── README.md                      # Documentação geral
├── ORGANOGRAMA.md                 # Hierarquia visual
├── INDEX.md                       # Índice de agentes
├── alexandria/                    # 🏛️ Sistema de Conhecimento (Novo!)
│   ├── INDEX.md
│   ├── alexandria-core.md         # Orquestrador principal
│   └── alexandria-ingestor.md     # Agente de ingestão
├── giles/                         # Cientista da Informação
├── data/                          # Analista de Código
├── miguel/                        # Arquiteto
├── liz/                           # Guardiã
├── jarvis/                        # Executor
└── nova-cor/                      # Orquestrador
```

### 📱 APLICAÇÕES

```
apps/
├── alexandria/                    # Hub de conhecimento
├── totum/                         # App principal Totum
└── INDEX.md                       # Índice de apps
```

### 📚 DOCUMENTAÇÃO

```
docs/
├── protocolos/                    # Protocolos de operação
├── skills/                        # Skills e capacidades
├── specs/                         # Especificações
├── analises/                      # Análises técnicas
├── arquitetura/                   # Documentação arquitetural
├── arquivados/                    # Documentos arquivados
├── personas/                      # Personas dos agentes
├── planos/                        # Planos de ação
└── INDEX.md                       # Índice de documentação
```

### 💾 DADOS

```
data/
├── backups/                       # Backups automáticos
├── logs/                          # Logs do sistema
└── *.db                           # Bancos de dados locais
```

### 🔧 SCRIPTS

```
scripts/
├── alexandria/                    # 🏛️ Scripts da Alexandria (Novo!)
│   ├── chunker.js                 # Chunking semântico hierárquico
│   ├── ingestor-batch.js          # Ingestão com rate limiting
│   └── zelador-job.js             # Job noturno de manutenção
├── analista.py                    # Análise de código
├── backup-*.sh                    # Scripts de backup
├── git_scout.py                   # GitHub Scout
├── trend_br.py                    # Trends Brasil
└── trend_global.py                # Trends Global
```

### 🧪 MEX

```
mex/
├── global/                        # Documentação global
├── routing.md                     # Roteamento
└── README.md                      # Documentação MEX
```

---

## 🗑️ .backup/

Backups de duplicações removidas durante reorganização.

---

**Tags:** #sistema #core #config #identidade
