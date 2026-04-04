# 🤖 Sistema de Agentes Totum

Sistema multi-agente para orquestração, desenvolvimento e gestão de conhecimento da Totum.

---

## 🎯 Agentes

| Agente | Função | Status | Localização |
|--------|--------|--------|-------------|
| **Miguel** | Arquiteto Estratégico | 🟡 Definido | `agents/miguel/` |
| **Liz** | Guardiã/COO | 🟡 Definido | `agents/liz/` |
| **Jarvis** | Executor/Tech Lead | 🟡 Definido | `agents/jarvis/` |
| **Giles** | Cientista da Informação | 🟢 Ativo | `agents/giles/` |
| **Data** | Analista de Código | 🟢 Ativo | `agents/data/` |
| **Nova-COR** | Orquestrador OpenClaw | 🟢 Ativo | `agents/nova-cor/` |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                     NOVA-COR (Orquestrador)                     │
│                        OpenClaw (Kimi/TOT)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│    MIGUEL     │      │     LIZ       │      │    JARVIS     │
│  Arquiteto    │      │   Guardiã     │      │   Executor    │
│  Estratégico  │      │   Qualidade   │      │   Técnico     │
└───────────────┘      └───────────────┘      └───────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        GILES (Supabase)                         │
│              Hub Central de Conhecimento                         │
│         PostgreSQL + pgvector + Full-text Search                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA (Analista)                          │
│              Análise de Código, Review, QA                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
agents/
├── README.md                    # Este arquivo
├── miguel/                      # Arquiteto Estratégico
│   ├── README.md
│   ├── persona.md
│   └── prompts/
├── liz/                         # Guardiã/COO
│   ├── README.md
│   ├── persona.md
│   └── prompts/
├── jarvis/                      # Executor/Tech Lead
│   ├── README.md
│   ├── persona.md
│   └── prompts/
├── giles/                       # Cientista da Informação (ATIVO)
│   ├── ARQUITETURA.md
│   ├── giles-client.js
│   ├── giles-client-supabase.js
│   ├── giles_schema_supabase.sql
│   ├── schema_sqlite.sql
│   ├── teste-giles.js
│   ├── teste-giles-supabase.js
│   ├── fix_schema.sql
│   └── Modelfile
├── data/                        # Analista de Código (ATIVO)
│   └── README.md
└── nova-cor/                    # Orquestrador OpenClaw
    └── README.md
```

---

## 🔗 Integrações

### Giles - Hub de Conhecimento
- **Plataforma:** Supabase (PostgreSQL)
- **Projeto:** Grupo Totum
- **Organização:** Alexandria
- **Features:**
  - Busca vetorial (pgvector)
  - Full-text search
  - Taxonomia hierárquica
  - Ontologia de relacionamentos
  - Logs de consultas

### Workflow
1. **Ingestão:** Agentes enviam conhecimento para Giles (Supabase)
2. **Consulta:** Agentes consultam Giles para recuperar contexto
3. **Análise:** Data analisa código e padrões
4. **Orquestração:** Nova-COR coordena todas as interações

---

## 🚀 Status Atual

| Componente | Status | Descrição |
|------------|--------|-----------|
| Giles Hub | 🟢 Operacional | Conectado ao Supabase, schema criado |
| Data Analyzer | 🟢 Ativo | Analisando código em execução |
| Workspace Org | 🟡 Em andamento | Giles organizando estrutura |
| Miguel Agent | 🟡 Definido | Aguardando implementação |
| Liz Agent | 🟡 Definido | Aguardando implementação |
| Jarvis Agent | 🟡 Definido | Aguardando implementação |

---

## 📝 Convenções

- Cada agente tem sua própria pasta
- Documentação em Markdown
- Código em JavaScript/Node.js
- Configurações em JSON
- Prompts versionados

---

*Sistema de Agentes Totum v1.0*
