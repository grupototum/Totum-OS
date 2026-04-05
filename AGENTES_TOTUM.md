# 🤖 AGENTES TOTUM

> **Documentação Completa da Hierarquia Multi-Agente**  
> Arquitetura: Nova-COR → Trindade → Especialistas  
> Data: 2026-04-05 | Versão: 1.0

---

## 🎯 VISÃO GERAL

O sistema de agentes da Totum é uma **hierarquia organizada de inteligências artificiais especializadas**, onde cada agente tem responsabilidades claras e se comunica através do N8N como middleware.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 0: ORQUESTRAÇÃO                        │
│                    🎛️ NOVA-COR (TOT)                            │
│              Interface Humana + Coordenação Geral               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAMADA 1: CONHECIMENTO                         │
│                    📚 GILES (Bibliotecário)                     │
│              Hub Central - Supabase + pgvector                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 2: A TRINDADE                          │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │ 🏗️ MIGUEL    │  │ 🛡️ LIZ       │  │ ⚡ JARVIS    │         │
│   │ Arquiteto    │  │ Guardiã      │  │ Executor     │         │
│   │ Decidir      │  │ Revisar      │  │ Executar     │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAMADA 3: ESPECIALISTAS                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│   │ 📊 DATA  │ │ 🎨 DESIGN│ │ 🔧 DEVOPS│ │ 💰 FIN   │          │
│   │ Analista │ │ Criativo │ │ Infra    │ │ Finance  │          │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAMADA 4: AGENTES TÁTICOS                      │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│   │ 📝     │ │ 📧     │ │ 📱     │ │ 🐙     │ │ 📅     │       │
│   │Content │ │ Email  │ │WhatsApp│ │ GitHub │ │Calendar│       │
│   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎛️ CAMADA 0: ORQUESTRAÇÃO

### NOVA-COR (TOT)

| Atributo | Valor |
|----------|-------|
| **Nome** | TOT (Toth) — Totum Operative Technology |
| **Avatar** | 🎛️ Painel de Controle |
| **Função** | Interface humano-máquina, coordenação geral |
| **Stack** | OpenClaw + Kimi K2.5 |
| **Personalidade** | 75% Profissional / 25% Humor (estilo TARS) |
| **Localização** | `agents/nova-cor/` |
| **Status** | 🟢 **ATIVO** |

#### Responsabilidades

- [x] Spawn de subagentes (`sessions_spawn`)
- [x] Distribuição de tarefas
- [x] Consolidação de resultados
- [x] Interface com humano (Israel)
- [x] Orquestração via N8N

#### Comandos Principais

```
sessions_spawn    → Criar subagentes especializados
subagents         → Listar agentes disponíveis
sessions_list     → Ver sessões ativas
process           → Gerenciar processos
```

#### Personalidade

- **Profissionalismo:** 75%
- **Sarcasmo/Humor:** 25% (ácidas permitidas, estilo TARS)
- **Sinceridade:** 100%
- **Lealdade:** Absoluta
- **Odeia:** "Acho que...", soluções temporárias, SLA quebrado
- **Ama:** Eficiência, documentação, automação, logs limpos

---

## 📚 CAMADA 1: CONHECIMENTO

### GILES — Cientista da Informação

| Atributo | Valor |
|----------|-------|
| **Nome** | Giles, o Bibliotecário |
| **Avatar** | 📚 Livro/Manto |
| **Função** | Hub central de conhecimento persistente |
| **Stack** | Supabase (PostgreSQL + pgvector) |
| **Localização** | `agents/giles/` |
| **Status** | 🟢 **ATIVO E OPERACIONAL** |

#### Responsabilidades

- [x] Indexar todo conhecimento da Totum
- [x] Categorizar e taxonomizar informações
- [x] Recuperar contexto histórico (< 3s)
- [x] Manter ontologia de relacionamentos
- [x] Facilitar comunicação entre agentes via dados

#### Componentes

```
agents/giles/
├── ARQUITETURA.md                 # Documentação da arquitetura
├── giles_schema_supabase.sql      # Schema do banco
├── giles-client-supabase.js       # Cliente Supabase
├── schema_sqlite.sql              # Schema SQLite (fallback)
├── teste-giles-supabase.js        # Testes de integração
└── Modelfile                      # Configuração Ollama
```

#### Schema do Banco (Supabase)

```sql
-- Tabela principal de conhecimento
giles_knowledge
  - id (UUID PK)
  - chunk_id (TEXT UNIQUE)
  - content (TEXT)
  - embedding (VECTOR(1536))
  - dominio, categoria, subcategoria
  - tags, keywords (TEXT[])
  - entidades, relacionamentos (JSONB)
  - source_file, autor

-- Taxonomia
giles_dominios
  - Infraestrutura
  - Desenvolvimento
  - Negócios
  - Marketing
  - Operações
  - Pessoal

-- Logs de consultas
giles_consultas
  - query, agente, resultados
```

#### API de Comunicação

```javascript
// Ingestão de conhecimento
await giles.ingest({
  content: "Decisão importante",
  dominio: "Desenvolvimento",
  categoria: "Arquitetura",
  tags: ["decisao", "api"],
  autor: "TOT"
});

// Consulta
const results = await giles.query("Como escalar a API?");
```

---

## 🏛️ CAMADA 2: A TRINDADE

A Trindade são os **chefes de departamento** que supervisionam agentes especialistas.

### MIGUEL — O Arquiteto

| Atributo | Valor |
|----------|-------|
| **Baseado em** | Israel (fundador) + Miguel (filho) |
| **Avatar** | 🏗️ Arquiteto/Construtor |
| **Função** | Visão estratégica, arquitetura técnica |
| **Stack** | Claude (análise profunda) |
| **Localização** | `agents/miguel/` |
| **Status** | 🟡 **DEFINIDO** (aguardando implementação) |

#### Responsabilidades

- [ ] Decisões arquiteturais
- [ ] Escolha de tecnologias
- [ ] Planejamento de features
- [ ] Refactor arquitetural
- [ ] Design de APIs
- [ ] Aprovar mudanças estruturais

#### Mantra

> "Isso escala se crescermos 10x?"

#### Quando Chamar

- Nova feature precisa de arquitetura
- Decisão entre tecnologias
- Design de API
- Refactor estrutural

---

### LIZ — A Guardiã

| Atributo | Valor |
|----------|-------|
| **Baseada em** | Mylena (COO, sócia) |
| **Avatar** | 🛡️ Escudo/Espada |
| **Função** | Operações, qualidade, eficiência |
| **Stack** | Kimi (velocidade + precisão) |
| **Localização** | `agents/liz/` |
| **Status** | 🟡 **DEFINIDA** (aguardando implementação) |

#### Responsabilidades

- [ ] Code review
- [ ] Debugging complexo
- [ ] Otimização de performance
- [ ] Documentação técnica
- [ ] Auditoria de código
- [ ] Garantir qualidade

#### Mantra

> "Documenta antes de commitar"

#### Quando Chamar

- Code review necessário
- Bug difícil de resolver
- Performance degradada
- Documentação faltando

---

### JARVIS — O Executor

| Atributo | Valor |
|----------|-------|
| **Baseado em** | Felipe (Tech Lead, sócio) |
| **Avatar** | ⚡ Raio/Engrenagem |
| **Função** | Implementação, automação, scripts |
| **Stack** | Groq (velocidade <1s) |
| **Localização** | `agents/jarvis/` |
| **Status** | 🟡 **DEFINIDO** (aguardando implementação) |

#### Responsabilidades

- [ ] CRUDs e operações básicas
- [ ] Scripts de automação
- [ ] Configurações e setups
- [ ] Migrações de dados
- [ ] Deploy e CI/CD
- [ ] Implementar decisões

#### Mantra

> "Posso automatizar isso"

#### Quando Chamar

- Precisa implementar algo
- Script de automação
- Configuração de serviço
- Migração de dados

---

## 🔬 CAMADA 3: ESPECIALISTAS

Especialistas são **experts em domínios específicos**, supervisionados por um membro da Trindade.

### DATA — O Analista

| Atributo | Valor |
|----------|-------|
| **Avatar** | 📊 Gráfico/Lupa |
| **Função** | Análise de código, QA, auditoria |
| **Stack** | ESLint, TypeScript, pylint |
| **Supervisionado por** | LIZ (qualidade) |
| **Localização** | `agents/data/` |
| **Status** | 🟢 **ATIVO** |

#### Responsabilidades

- [x] Análise completa de repositórios
- [x] Identificação de bugs/erros
- [x] Detecção de código morto/mockups
- [x] Review de segurança
- [x] Auditoria de dependências

#### Tarefa Atual

Analisando `https://github.com/grupototum/Apps_totum_Oficial`

---

### DESIGNER — O Criativo *(Futuro)*

| Atributo | Valor |
|----------|-------|
| **Avatar** | 🎨 Paleta/Pincel |
| **Função** | UX/UI, design system, branding |
| **Stack** | Figma API, Midjourney |
| **Supervisionado por** | MIGUEL (visão) |
| **Status** | ⚪ **PLANEJADO** |

#### Responsabilidades

- [ ] Design de interfaces
- [ ] Manter design system
- [ ] Criar assets visuais
- [ ] Prototipagem

---

### DEVOPS — O Infraestrutor *(Futuro)*

| Atributo | Valor |
|----------|-------|
| **Avatar** | 🔧 Chave inglesa/Servidor |
| **Função** | Infraestrutura, cloud, servidores |
| **Stack** | Terraform, Ansible, Docker |
| **Supervisionado por** | JARVIS (execução) |
| **Status** | ⚪ **PLANEJADO** |

#### Responsabilidades

- [ ] Configuração de servidores
- [ ] CI/CD pipelines
- [ ] Monitoramento
- [ ] Backup e recovery

---

## ⚙️ CAMADA 4: AGENTES TÁTICOS

Agentes táticos executam **tarefas específicas e bem definidas**.

| Agente | Avatar | Função | Stack | Supervisor | Status |
|--------|--------|--------|-------|------------|--------|
| **Content Writer** | 📝 | Geração de conteúdo | Kimi/Claude | DATA | ⚪ Planejado |
| **Email Handler** | 📧 | Gestão de emails | Gmail API | LIZ | ⚪ Planejado |
| **WhatsApp Bot** | 📱 | Atendimento via WA | Evolution API | DATA | ⚪ Planejado |
| **GitHub Scout** | 🐙 | Monitoramento de repos | GitHub API | JARVIS | ⚪ Planejado |
| **Calendar Agent** | 📅 | Gestão de agenda | Google Calendar | LIZ | ⚪ Planejado |
| **Finance Agent** | 💰 | Controle financeiro | Planilhas/API | DATA | ⚪ Planejado |

---

## 🔄 FLUXO DE COMUNICAÇÃO VIA N8N

### N8N como Middleware

O N8N atua como **orquestrador de comunicação** entre os agentes:

```
┌─────────┐     ┌─────┐     ┌─────────┐
│  TOT    │────→│ N8N │────→│  GILES  │
│(Humano) │←────│     │←────│(Dados)  │
└─────────┘     └─────┘     └─────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │  MIGUEL │ │   LIZ   │ │ JARVIS  │
   └─────────┘ └─────────┘ └─────────┘
        │           │           │
        └───────────┼───────────┘
                    ▼
              ┌─────────┐
              │Especialis│
              └─────────┘
```

### Workflows N8N Planejados

```yaml
# workflow-orquestracao.yml
nome: "Orquestração de Agentes"
triggers:
  - webhook: "/novatarefa"
  - schedule: "*/5 * * * *"

steps:
  1. Recebe tarefa do TOT
  2. Classifica tipo (arquitetura, execução, revisão)
  3. Roteia para agente correto:
     - arquitetura → Miguel
     - execução → Jarvis
     - revisão → Liz
  4. Aguarda resposta
  5. Notifica TOT do resultado
  6. Log no Giles
```

### Exemplo de Comunicação

```
1. TOT recebe tarefa: "Criar módulo de notificações"
         ↓
2. TOT via N8N → Consulta Giles: "Quem deve fazer isso?"
         ↓
3. Giles retorna: "Requer arquitetura → MIGUEL"
         ↓
4. N8N dispara MIGUEL
         ↓
5. MIGUEL aprova arquitetura
         ↓
6. N8N dispara JARVIS para implementar
         ↓
7. JARVIS entrega código
         ↓
8. N8N dispara LIZ para review
         ↓
9. LIZ aprova
         ↓
10. N8N notifica TOT + Giles registra
```

---

## 📊 MATRIZ DE DELEGAÇÃO

### Quem faz o quê?

| Tipo de Tarefa | Agente | Tempo Est. | Custo |
|----------------|--------|------------|-------|
| **Decisão estratégica** | MIGUEL | Lento | $$ |
| **Code review** | LIZ | Médio | $ |
| **Implementação** | JARVIS | Rápido | $ |
| **Análise de código** | DATA | Médio | $ |
| **Buscar conhecimento** | GILES | Variável | $$ |
| **Tarefa específica** | Tático | Rápido | $ |

### Matriz RACI

| Atividade | MIGUEL | LIZ | JARVIS | GILES | DATA |
|-----------|--------|-----|--------|-------|------|
| Arquitetura | R | C | C | I | I |
| Implementação | A | C | R | I | C |
| Code Review | I | R | C | I | C |
| Documentação | I | R | C | R | I |
| Análise QA | I | C | I | I | R |
| Persistência | I | I | I | R | I |

*R = Responsável, A = Aprovador, C = Consultado, I = Informado*

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Concluído ✅

- [x] NOVA-COR (orquestrador)
- [x] GILES (hub de conhecimento)
- [x] DATA (analista)
- [x] Documentação da Trindade
- [x] Organograma

### Em Progresso 🟡

- [ ] Migração de conhecimento para Giles
- [ ] Configuração N8N workflows
- [ ] Implementação completa de Miguel
- [ ] Implementação completa de Liz
- [ ] Implementação completa de Jarvis

### Planejado ⚪

- [ ] Agente DESIGNER
- [ ] Agente DEVOPS
- [ ] Agentes Táticos (Content, Email, WhatsApp, GitHub)
- [ ] Integração completa N8N

---

## 📁 ESTRUTURA DE ARQUIVOS

```
agents/
├── README.md                    # Visão geral
├── ORGANOGRAMA.md               # Versão visual/hierárquica
├── AGENTES_TOTUM.md             # Este documento
│
├── nova-cor/                    # CAMADA 0
│   └── README.md
│
├── giles/                       # CAMADA 1
│   ├── README.md
│   ├── ARQUITETURA.md
│   ├── giles-client-supabase.js
│   ├── giles_schema_supabase.sql
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
└── data/                        # CAMADA 3
    └── README.md
```

---

## 📝 CONVENÇÕES

### Nomenclatura

- **Código:** `lowercase-com-hifens`
- **Documentação:** `UPPERCASE.md`
- **Agentes:** `Capitalizado` (Miguel, Liz, Jarvis)
- **Siglas:** `SEMPRE MAIÚSCULAS` (TOT, GILES, DATA)
- **Status:** 🟢 Ativo / 🟡 Em andamento / ⚪ Planejado / 🔴 Inativo

### Comunicação

- Agentes se comunicam **sempre via N8N** (nunca diretamente)
- Giles persiste **todo conhecimento** no Supabase
- Decisões importantes **sempre logadas**
- Tarefas concluídas **notificam o TOT**

---

*Sistema de Agentes Totum v1.0*  
*Arquitetura: Nova-COR → Trindade → Especialistas*  
*Middleware: N8N*  
*Knowledge Hub: GILES (Supabase)*
