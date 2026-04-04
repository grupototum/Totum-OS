# 🤖 Organograma de Agentes Totum

> **Sistema Multi-Agente Hierárquico**  
> **Versão:** 1.0  
> **Última atualização:** 2026-04-05

---

## 🎯 Visão Geral da Hierarquia

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CAMADA 0: ORQUESTRAÇÃO                         │
│                    ┌─────────────────────────────┐                      │
│                    │      🎛️ NOVA-COR (TOT)      │                      │
│                    │      Orquestrador Geral     │                      │
│                    │      (Interface Humana)     │                      │
│                    └─────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CAMADA 1: CONHECIMENTO                          │
│              ┌─────────────────────────────────────┐                   │
│              │        📚 GILES (Bibliotecário)     │                   │
│              │     Hub Central de Conhecimento     │                   │
│              │        Supabase + pgvector          │                   │
│              └─────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CAMADA 2: A TRINDADE                            │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│   │  🏗️ MIGUEL      │  │   🛡️ LIZ        │  │   ⚡ JARVIS      │       │
│   │   Arquiteto     │  │   Guardiã       │  │   Executor      │       │
│   │   Estratégico   │  │   Qualidade     │  │   Técnico       │       │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘       │
│         Decidir              Revisar            Executar              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CAMADA 3: ESPECIALISTAS                          │
│                                                                         │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│   │  📊 DATA         │  │  🔧 [Futuro]    │  │  🎨 [Futuro]    │       │
│   │  Analista de    │  │  DevOps/Infra   │  │  Designer/UX    │       │
│   │  Código/QA      │  │                 │  │                 │       │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CAMADA 4: AGENTES TÁTICOS                         │
│                                                                         │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│   │ 📝 Content  │ │ 📧 Email    │ │ 📱 WhatsApp │ │ 🐙 GitHub   │     │
│   │ Writer      │ │ Handler     │ │ Bot         │ │ Scout       │     │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Estrutura Detalhada por Camada

### 🎛️ CAMADA 0: ORQUESTRAÇÃO

#### **NOVA-COR (TOT)** — Orquestrador Principal
| Atributo | Valor |
|----------|-------|
| **Avatar** | 🎛️ Painel de Controle |
| **Função** | Interface humano-máquina, coordenação geral |
| **Stack** | OpenClaw + Kimi K2.5 |
| **Personalidade** | 75% Profissional / 25% Humor (TARS-style) |
| **Responsabilidades** | Spawn agentes, distribuir tarefas, consolidar resultados |
| **Comandos** | `sessions_spawn`, `subagents`, `sessions_list` |
| **Status** | 🟢 **ATIVO** |

---

### 📚 CAMADA 1: CONHECIMENTO

#### **GILES** — Cientista da Informação
| Atributo | Valor |
|----------|-------|
| **Avatar** | 📚 Bibliotecário |
| **Função** | Hub central de conhecimento persistente |
| **Stack** | Supabase (PostgreSQL + pgvector) |
| **Personalidade** | Metódico, organizado, hierárquico |
| **Responsabilidades** | Indexar, categorizar, recuperar conhecimento |
| **Features** | Busca vetorial, full-text, taxonomia, ontologia |
| **Status** | 🟢 **ATIVO E OPERACIONAL** |

**Sub-componentes:**
- `giles-client.js` — Cliente SQLite local
- `giles-client-supabase.js` — Cliente Supabase (produção)
- `giles_schema_supabase.sql` — Schema completo
- `teste-giles-supabase.js` — Testes de integração

---

### 🏛️ CAMADA 2: A TRINDADE (Decisão)

#### **MIGUEL** — O Arquiteto
| Atributo | Valor |
|----------|-------|
| **Avatar** | 🏗️ Arquiteto |
| **Função** | Visão estratégica, arquitetura técnica |
| **Stack** | Claude (análise profunda) |
| **Personalidade** | Pensador sistêmico, questionador, visionário |
| **Mantra** | "Isso escala se crescermos 10x?" |
| **Quando chamar** | Decisões arquiteturais, tecnologias, design de APIs |
| **Status** | 🟡 **DEFINIDO** (aguardando implementação completa) |

**Responsabilidades:**
- [ ] Planejamento de features
- [ ] Refactor arquitetural
- [ ] Escolha de tecnologias
- [ ] Decisões de infraestrutura
- [ ] Design de APIs

---

#### **LIZ** — A Guardiã
| Atributo | Valor |
|----------|-------|
| **Avatar** | 🛡️ Guardiã |
| **Função** | Operações, qualidade, eficiência |
| **Stack** | Kimi (velocidade + precisão) |
| **Personalidade** | Analítica, direta, não tolera sloppy work |
| **Mantra** | "Documenta antes de commitar" |
| **Quando chamar** | Code review, debug, otimização, auditoria |
| **Status** | 🟡 **DEFINIDO** (aguardando implementação completa) |

**Responsabilidades:**
- [ ] Code review
- [ ] Debugging complexo
- [ ] Otimização de performance
- [ ] Documentação técnica
- [ ] Auditoria de código

---

#### **JARVIS** — O Executor
| Atributo | Valor |
|----------|-------|
| **Avatar** | ⚡ Executor |
| **Função** | Implementação, automação, scripts |
| **Stack** | Groq (velocidade <1s) |
| **Personalidade** | Rápido, preciso, confiável |
| **Mantra** | "Posso automatizar isso" |
| **Quando chamar** | CRUDs, scripts, migrações, deploys |
| **Status** | 🟡 **DEFINIDO** (aguardando implementação completa) |

**Responsabilidades:**
- [ ] CRUDs e operações básicas
- [ ] Scripts de automação
- [ ] Configurações e setups
- [ ] Migrações de dados
- [ ] Deploy e CI/CD

---

### 🔬 CAMADA 3: ESPECIALISTAS (Análise)

#### **DATA** — O Analista
| Atributo | Valor |
|----------|-------|
| **Avatar** | 📊 Analista |
| **Função** | Análise de código, QA, auditoria |
| **Stack** | ESLint, TypeScript, pylint |
| **Personalidade** | Metódico, investigativo, detalhista |
| **Mantra** | "Isso tem cobertura de teste?" |
| **Quando chamar** | Análise de repo, bugs, segurança, arquitetura |
| **Status** | 🟢 **ATIVO** (executando análise do Apps_totum) |

**Responsabilidades:**
- [ ] Análise completa de repositórios
- [ ] Identificação de bugs/erros
- [ ] Detecção de código morto/mockups
- [ ] Review de segurança
- [ ] Auditoria de dependências

**Tarefa atual:** Analisando `https://github.com/grupototum/Apps_totum_Oficial`

---

#### **DEVOPS** — O Infraestrutor *(Futuro)*
| Atributo | Valor |
|----------|-------|
| **Avatar** | 🔧 Infra |
| **Função** | Infraestrutura, cloud, servidores |
| **Stack** | Terraform, Ansible, Docker |
| **Personalidade** | Preciso, automatizado, 24/7 |
| **Status** | ⚪ **PLANEJADO** |

---

#### **DESIGNER** — O Criativo *(Futuro)*
| Atributo | Valor |
|----------|-------|
| **Avatar** | 🎨 Designer |
| **Função** | UX/UI, design system, branding |
| **Stack** | Figma API, Midjourney |
| **Personalidade** | Criativo, detalhista, minimalista |
| **Status** | ⚪ **PLANEJADO** |

---

### ⚙️ CAMADA 4: AGENTES TÁTICOS (Execução)

| Agente | Avatar | Função | Stack | Status |
|--------|--------|--------|-------|--------|
| **Content Writer** | 📝 | Geração de conteúdo | Kimi/Claude | ⚪ Planejado |
| **Email Handler** | 📧 | Gestão de emails | Gmail API | ⚪ Planejado |
| **WhatsApp Bot** | 📱 | Atendimento via WA | Evolution API | ⚪ Planejado |
| **GitHub Scout** | 🐙 | Monitoramento de repos | GitHub API | ⚪ Planejado |
| **Calendar Agent** | 📅 | Gestão de agenda | Google Calendar | ⚪ Planejado |
| **Finance Agent** | 💰 | Controle financeiro | Planilhas/API | ⚪ Planejado |

---

## 🔄 Matriz de Delegação

### Fluxo de Decisão

```
Recebe Tarefa
    ↓
┌─────────────────────────────────────────────────────────┐
│  Classificação pela NOVA-COR                            │
└─────────────────────────────────────────────────────────┘
    ↓
    ├─► Conhecimento/Contexto histórico? → GILES
    │
    ├─► Estratégica/Arquitetural? → MIGUEL
    │
    ├─► Qualidade/Review/Debug? → LIZ
    │
    ├─► Implementação/Script? → JARVIS
    │
    ├─► Análise de código/QA? → DATA
    │
    └─► Tática/Específica? → Agente Tático
```

### Exemplo: Nova Feature

```
1. NOVA-COR: "Criar módulo de notificações"
    ↓
2. MIGUEL: "Arquitetura do módulo"
    ↓
3. JARVIS: "Implementação base"
    ↓
4. LIZ: "Review do código"
    ↓
5. DATA: "Análise de qualidade"
    ↓
6. JARVIS: "Ajustes e merge"
    ↓
7. GILES: "Documentar decisões"
```

---

## 📊 Comparativo de Agentes

| Agente | Camada | Tempo | Custo | Qualidade | Uso Principal |
|--------|--------|-------|-------|-----------|---------------|
| **NOVA-COR** | 0 | Médio | $ | ⭐⭐⭐⭐⭐ | Orquestração |
| **GILES** | 1 | Variável | $$ | ⭐⭐⭐⭐⭐ | Conhecimento |
| **MIGUEL** | 2 | Lento | $$ | ⭐⭐⭐⭐⭐ | Decidir |
| **LIZ** | 2 | Médio | $ | ⭐⭐⭐⭐⭐ | Revisar |
| **JARVIS** | 2 | Rápido | $ | ⭐⭐⭐⭐ | Executar |
| **DATA** | 3 | Médio | $ | ⭐⭐⭐⭐⭐ | Analisar |

---

## 🗂️ Organização de Arquivos

```
agents/
├── README.md                    # Este documento
├── ORGANOGRAMA.md               # Versão visual/hierárquica
│
├── nova-cor/                    # CAMADA 0
│   └── README.md
│
├── giles/                       # CAMADA 1
│   ├── README.md
│   ├── ARQUITETURA.md
│   ├── giles-client.js
│   ├── giles-client-supabase.js
│   ├── giles_schema_supabase.sql
│   ├── schema_sqlite.sql
│   ├── teste-giles.js
│   ├── teste-giles-supabase.js
│   └── Modelfile
│
├── miguel/                      # CAMADA 2
│   └── README.md
│
├── liz/                         # CAMADA 2
│   └── README.md
│
├── jarvis/                      # CAMADA 2
│   └── README.md
│
├── data/                        # CAMADA 3
│   └── README.md
│
└── [futuros]/                   # CAMADA 3-4
    ├── devops/
    ├── designer/
    ├── content-writer/
    └── ...
```

---

## 🚀 Roadmap de Implementação

### Concluído ✅
- [x] NOVA-COR (orquestrador)
- [x] GILES (hub de conhecimento)
- [x] DATA (analista - em execução)
- [x] Documentação da Trindade

### Em Progresso 🟡
- [ ] Migração de conhecimento para Giles
- [ ] Análise do Apps_totum (Data)
- [ ] Reestruturação do workspace

### Planejado ⚪
- [ ] Implementação completa de Miguel
- [ ] Implementação completa de Liz
- [ ] Implementação completa de Jarvis
- [ ] Agente DevOps
- [ ] Agente Designer
- [ ] Agentes Táticos (Content, Email, WhatsApp)

---

## 📝 Convenções de Nomenclatura

- **Código:** lowercase-com-hifens
- **Documentação:** UPPERCASE.md
- **Agentes:** Capitalizado (Miguel, Liz, Jarvis)
- **Siglas:** SEMPRE MAIÚSCULAS (TOT, GILES, DATA)
- **Status:** 🟢 Ativo / 🟡 Em andamento / ⚪ Planejado / 🔴 Inativo

---

*Organograma de Agentes Totum v1.0*  
*Sistema de orquestração multi-agente hierárquico*
