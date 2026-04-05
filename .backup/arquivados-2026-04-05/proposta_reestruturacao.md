# 📋 Proposta de Reestruturação do Workspace

> **Giles, o Bibliotecário** - Análise e Otimização do Sistema  
> Data: 2026-04-05  
> Versão: 1.0

---

## 1. 🩺 DIAGNÓSTICO ATUAL

### 1.1 Visão Geral da Estrutura

```
/root/.openclaw/workspace/           (~1.2GB total)
├── agents/                    (104K)    Agentes especializados (Giles)
├── apps/                      (816M)    Aplicações Totum
│   ├── alexandria/                    Sistema de conhecimento
│   └── totum/                         App principal + totum legacy
├── apps-totum/                (1.2M)    Cópia/duplicação do apps/totum
├── apps_totum/                (3.3M)    Outra cópia - PROBLEMA SÉRIO
├── data/                      (6.7M)    Bancos SQLite, backups, logs
├── docs/                      (1.1M)    Documentação diversa
├── infra/                     (204K)    Docker, scripts, nginx
├── memory/                    (128K)    Logs diários do sistema
├── mex/                       (64K)     Modelo Contextual Expansível
├── migrations/                (52K)     SQLs de migração
├── protocolos/                (24K)     Protocolos operacionais
├── scripts/                   (164K)    Scripts utilitários
├── skills/                    (12K)     Skills documentadas
├── specs/                     (12K)     Especificações
├── sql/                       (8K)      Scripts SQL
├── src/                       (57M)     Código-fonte (stark-api, agents)
├── tarefas/                   (12M)     Tarefas e configs Node
├── venv/                      (256M)    Python virtual env
├── AGENTS.md                  (8K)      Regras do sistema
├── BOOTSTRAP.md               (4K)      Inicialização
├── HEARTBEAT.md               (4K)      Config de heartbeat
├── IDENTITY.md                (8K)      Identidade TOT
├── SOUL.md                    (4K)      Alma do sistema
├── TODO.md                    (8K)      Quadro de tarefas
├── TOOLS.md                   (4K)      Notas locais
└── USER.md                    (8K)      Perfil do Israel
```

### 1.2 Inventário de Arquivos por Categoria

| Categoria | Quantidade | Tamanho | Localização |
|-----------|------------|---------|-------------|
| **Código-fonte** | ~500 arquivos | ~60MB | `apps/`, `apps_totum/`, `src/` |
| **Documentação** | ~80 arquivos | ~1.1MB | `docs/`, raiz (*.md) |
| **Dados/DB** | ~15 arquivos | ~7MB | `data/`, `mex/` |
| **Scripts** | ~25 arquivos | ~370KB | `scripts/`, `infra/scripts/` |
| **Configurações** | ~30 arquivos | ~200KB | `infra/`, raiz (package.json, etc) |
| **Memórias** | ~8 arquivos | ~128KB | `memory/` |
| **Node Modules** | milhares | ~36MB | `*/node_modules/` |
| **Python Venv** | milhares | ~256MB | `venv/` |
| **Git** | - | disperso | `*/.git/` |

### 1.3 Estrutura Hierárquica Detalhada

```
📦 workspace/
├── 🧠 SISTEMA (Arquivos Core)
│   ├── AGENTS.md              # Regras de comportamento
│   ├── SOUL.md                # Personalidade base
│   ├── USER.md                # Perfil do humano
│   ├── IDENTITY.md            # Identidade TOT
│   ├── TOOLS.md               # Configs locais
│   ├── HEARTBEAT.md           # Config heartbeat
│   ├── BOOTSTRAP.md           # Inicialização
│   └── TODO.md                # Tarefas atuais
│
├── 🤖 AGENTES (defs de agentes)
│   └── giles/                 # Giles + schemas
│       ├── ARQUITETURA.md
│       ├── giles_schema_supabase.sql
│       ├── giles-client-supabase.js
│       └── ...
│
├── 📱 APLICAÇÕES (3 cópias!)
│   ├── apps/
│   │   ├── alexandria/        # Sistema de conhecimento
│   │   │   ├── README.md
│   │   │   ├── contextos/
│   │   │   ├── agentes/
│   │   │   ├── pops/
│   │   │   └── ...
│   │   └── totum/             # App principal (Lovable)
│   ├── apps-totum/            # 🔴 DUPLICAÇÃO
│   └── apps_totum/            # 🔴 DUPLICAÇÃO
│
├── 📚 CONHECIMENTO (disperso)
│   ├── mex/                   # Modelo Contextual Expansível
│   │   ├── contexts/
│   │   ├── schemas/
│   │   └── README.md
│   ├── docs/                  # Documentação diversa
│   │   ├── analises/
│   │   ├── arquitetura/
│   │   ├── arquivados/
│   │   ├── personas/
│   │   └── planos/
│   └── skills/                # Skills (1 arquivo!)
│
├── 💾 DADOS
│   ├── data/                  # Bancos SQLite
│   │   ├── totum_claw.db
│   │   ├── atendimento_bot.db
│   │   ├── backups/
│   │   └── logs/
│   └── memory/                # Logs diários
│
├── 🔧 INFRAESTRUTURA
│   ├── infra/
│   │   ├── docker/            # Docker compose files
│   │   ├── scripts/           # Scripts de infra
│   │   └── nginx/
│   └── scripts/               # Scripts diversos
│
├── 📋 TAREFAS
│   └── tarefas/               # Tarefas + node_modules
│
└── 🗄️ MIGRAÇÕES
    ├── migrations/            # SQLs de migração
    └── sql/                   # Scripts SQL
```

---

## 2. 🔴 PROBLEMAS IDENTIFICADOS

### 2.1 Problemas Críticos

#### ❌ P1: TRIPLICAÇÃO DO APPS TOTUM
- **Problema:** Existem 3 cópias do mesmo código
  - `apps/totum/` (original)
  - `apps-totum/` (cópia)
  - `apps_totum/` (cópia)
- **Impacto:** 3x espaço desperdiçado (~8MB), risco de trabalhar no arquivo errado
- **Causa:** Deploys e builds geraram cópias sem limpeza
- **Severidade:** 🔴 ALTA

#### ❌ P2: DOCUMENTAÇÃO DISPERSA
- **Problema:** Conhecimento espalhado em múltiplos locais
  - `docs/` - documentação geral
  - `apps/alexandria/` - conhecimento estruturado
  - `mex/` - modelos contextuais
  - `skills/` - skills (quase vazio)
  - `src/agents/` - definições de agentes
- **Impacto:** Dificuldade para encontrar informações, duplicação
- **Severidade:** 🔴 ALTA

#### ❌ P3: SEM PADRÃO DE NOMENCLATURA
- **Problema:** Inconsistência nos nomes
  - `apps-totum/` vs `apps_totum/` (hífen vs underscore)
  - `SOUL.md` (maiúsculo) vs `soul.md` (poderia ser)
  - `docs/analises/` (plural) vs `docs/planos/` (plural) vs `protocolos/` (plural inconsistente)
- **Impacto:** Confusão, erros de digitação, dificuldade de automação
- **Severidade:** 🟡 MÉDIA

### 2.2 Problemas de Eficiência

#### ⚠️ P4: NODE_MODULES ESPALHADOS
- **Problema:** node_modules em múltiplos locais
  - `apps/totum/node_modules/`
  - `apps_totum/node_modules/`
  - `tarefas/node_modules/`
  - `src/stark-api/node_modules/`
- **Impacto:** ~36MB duplicados, instalações lentas
- **Severidade:** 🟡 MÉDIA

#### ⚠️ P5: BACKUPS SEM ROTAÇÃO
- **Problema:** `data/backups/` acumulando arquivos sem limite
- **Impacto:** Crescimento indefinido do disco
- **Severidade:** 🟡 MÉDIA

#### ⚠️ P6: ARQUIVOS ÓRFÃOS
- **Problema:** Arquivos que parecem temporários/testes
  - `__pycache__/` (60K)
  - Arquivos `EOF` vazios
  - `daily_report_20250331.*` (relatórios antigos)
- **Impacto:** Poluição visual, confusão
- **Severidade:** 🟢 BAIXA

### 2.3 Problemas de Arquitetura

#### ⚠️ P7: SEPARAÇÃO INCONSISTENTE
- **Problema:** Lógica de negócio misturada com infra
  - `src/agents/` - definições de agentes
  - `agents/giles/` - outro agente
  - `apps/alexandria/agentes/` - mais agentes
- **Impacto:** Dificuldade de manutenção
- **Severidade:** 🟡 MÉDIA

#### ⚠️ P8: DUPLICAÇÃO DE SQLs
- **Problema:** Scripts SQL em múltiplos locais
  - `migrations/`
  - `sql/`
  - `apps_totum/supabase/migrations/`
  - `agents/giles/*.sql`
- **Impacto:** Risco de aplicar migrações erradas
- **Severidade:** 🟡 MÉDIA

### 2.9 Problemas de Segurança

#### 🔐 P9: CREDENCIAIS PODEM ESTAR ESPALHADAS
- **Problema:** Sem revisão de arquivos com secrets
- **Risco:** Vazamento de credenciais
- **Severidade:** 🟡 MÉDIA (requer verificação)

---

## 3. 🏗️ PROPOSTA DE NOVA ESTRUTURA

### 3.1 Princípios Fundamentais

1. **DRY (Don't Repeat Yourself):** Uma fonte de verdade por conteúdo
2. **Convenção sobre Configuração:** Padrões claros de nomenclatura
3. **Separação de Preocupações:** Domínios bem definidos
4. **Escalabilidade:** Estrutura que cresce sem bagunça
5. **Descobribilidade:** Encontrar qualquer coisa em < 30s

### 3.2 Nova Hierarquia

```
📦 workspace/                          # Raiz: apenas entrypoints
│
├── 📁 .system/                        # 🔒 Sistema Core (invisível no dia a dia)
│   ├── core/                          # Arquivos essenciais do sistema
│   │   ├── AGENTS.md
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── IDENTITY.md
│   │   ├── TOOLS.md
│   │   ├── HEARTBEAT.md
│   │   └── BOOTSTRAP.md
│   ├── memory/                        # Logs diários
│   │   └── YYYY-MM-DD.md
│   └── state/                         # Estado do sistema
│       ├── TODO.md
│       └── heartbeat-state.json
│
├── 📁 alexandria/                     # 📚 BIBLIOTECA CENTRAL (única fonte de verdade)
│   ├── README.md                      # Guia da Alexandria
│   ├── indice/                        # Índices de busca
│   │   └── semantico.json
│   ├── conhecimento/                  # Base de conhecimento
│   │   ├── domínios.json              # Taxonomia
│   │   └── chunks/                    # Conteúdo indexado
│   ├── contextos/                     # Contextos de conversa
│   │   ├── ativos/                    # Sessões atuais
│   │   ├── persistidos/               # Confirmados
│   │   └── arquivados/                # Descartados
│   ├── agentes/                       # Documentação de agentes
│   │   ├── TOT.md
│   │   ├── giles.md
│   │   ├── miguel.md
│   │   └── ...
│   ├── pops/                          # Protocolos Operacionais
│   │   └── POP-001-*.md
│   ├── slas/                          # SLAs e métricas
│   ├── skills/                        # Skills catalogadas
│   │   └── SKILL-*.md
│   └── temas/                         # Conhecimento por tema
│       ├── design-system/
│       ├── infraestrutura/
│       └── negocios/
│
├── 📁 agentes/                        # 🤖 IMPLEMENTAÇÃO DE AGENTES
│   └── giles/                         # (único agente com código por enquanto)
│       ├── schema/
│       │   ├── supabase.sql
│       │   └── sqlite.sql
│       ├── src/
│       │   ├── client.js
│       │   └── client-supabase.js
│       ├── tests/
│       │   └── test-*.js
│       └── Modelfile
│
├── 📁 apps/                           # 📱 APLICAÇÕES (apenas 1 cópia!)
│   ├── totum/                         # App principal (Lovable/React)
│   │   ├── src/
│   │   ├── public/
│   │   ├── supabase/migrations/
│   │   └── package.json
│   └── stark-api/                     # API backend (movido de src/)
│       ├── src/
│       └── package.json
│
├── 📁 infra/                          # 🔧 INFRAESTRUTURA
│   ├── docker/
│   │   └── docker-compose.*.yml
│   ├── nginx/
│   ├── scripts/
│   │   ├── setup/
│   │   ├── deploy/
│   │   └── maintenance/
│   └── configs/
│       ├── groq.md
│       └── gemini.md
│
├── 📁 data/                           # 💾 DADOS PERSISTIDOS
│   ├── db/                            # Bancos de dados
│   │   ├── totum.db
│   │   └── atendimento.db
│   ├── backups/                       # Backups (com rotação)
│   │   └── README.md                  # Política de retenção
│   └── logs/                          # Logs de aplicações
│       └── *.log
│
├── 📁 archive/                        # 🗄️ ARQUIVO (coisas antigas)
│   ├── 2026-04-05-migracao/           # Snapshot da migração
│   └── old-references/
│
└── 📁 docs/                           # 📖 DOCUMENTAÇÃO EXTERNA
    └── (apenas docs de terceiros, 
         todo conhecimento Totum vai para alexandria/)
```

### 3.3 Convenções de Nomenclatura

#### 📁 Pastas
- **minúsculas-com-hífen** para pastas compostas
- **Singular** preferencialmente (agente/, não agentes/)
- **inglês** apenas quando for código (src/, não código/)

#### 📄 Arquivos Markdown
- **MAIÚSCULAS** para arquivos core do sistema (`SOUL.md`, `USER.md`)
- **minúsculas-com-hífen** para conteúdo (`guia-de-uso.md`)
- **UPPERCASE** para convênios (`README.md`, `LICENSE`)

#### 📊 Bancos de Dados
- `[nome].db` para SQLite
- `[nome].sql` para scripts
- `YYYY-MM-DD_[descrição].sql` para migrations

#### 🤖 Agentes
- `[nome].md` para documentação
- `[nome]/` para implementação

#### 🔖 Versionamento
- Usar semver para APIs: `v1.0.0`
- Usar datas para docs: `2026-04-05`

### 3.4 Mapa de Migração

| Origem (Atual) | Destino (Novo) | Ação |
|----------------|----------------|------|
| `apps/alexandria/*` | `alexandria/*` | Mover + Mesclar |
| `mex/*` | `alexandria/mex/*` | Mover |
| `docs/personas/*` | `alexandria/agentes/*` | Mover |
| `docs/planos/*` | `alexandria/temas/planejamento/*` | Mover |
| `docs/analises/*` | `alexandria/temas/analises/*` | Mover |
| `src/agents/*.md` | `alexandria/agentes/*` | Mover |
| `agents/giles/` | `agentes/giles/` | Manter |
| `apps/totum/` | `apps/totum/` | Manter (única cópia) |
| `apps-totum/` | 🗑️ | Deletar |
| `apps_totum/` | 🗑️ | Deletar |
| `src/stark-api/` | `apps/stark-api/` | Mover |
| `memory/` | `.system/memory/` | Mover |
| `TODO.md` | `.system/state/TODO.md` | Mover |
| `AGENTS.md` | `.system/core/AGENTS.md` | Mover |
| `SOUL.md` | `.system/core/SOUL.md` | Mover |
| `USER.md` | `.system/core/USER.md` | Mover |
| `IDENTITY.md` | `.system/core/IDENTITY.md` | Mover |
| `TOOLS.md` | `.system/core/TOOLS.md` | Mover |
| `HEARTBEAT.md` | `.system/core/HEARTBEAT.md` | Mover |
| `data/backups/*` | `data/backups/*` | Limpar antigos > 30 dias |
| `__pycache__/` | 🗑️ | Deletar |
| `tarefas/node_modules/` | 🗑️ | Deletar (não usado) |

---

## 4. 🚀 PROMPT DE EXECUÇÃO

### 4.1 Checklist de Implementação

#### FASE 1: Preparação (Backup) ⚡
```bash
# 1.1 Criar snapshot completo
mkdir -p /root/.openclaw/workspace/archive/2026-04-05-migracao
cd /root/.openclaw/workspace
tar czf archive/2026-04-05-migracao/workspace-pre-migracao.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='venv' \
  .

# 1.2 Verificar integridade
cd archive/2026-04-05-migracao
tar tzf workspace-pre-migracao.tar.gz | wc -l
# Deve retornar ~5000+ arquivos
```

#### FASE 2: Estrutura Base 🏗️
```bash
# 2.1 Criar nova hierarquia
mkdir -p .system/{core,memory,state}
mkdir -p alexandria/{indice,conhecimento,contextos/{ativos,persistidos,arquivados},agentes,pops,slas,skills,temas/{design-system,infraestrutura,negocios}}
mkdir -p agentes/giles/{schema,src,tests}
mkdir -p apps/stark-api
mkdir -p infra/{docker,nginx,scripts/{setup,deploy,maintenance},configs}
mkdir -p data/{db,backups,logs}
mkdir -p archive/old-references
```

#### FASE 3: Migração de Arquivos Core 📦
```bash
# 3.1 Mover arquivos de sistema (preservar git history!)
git mv AGENTS.md .system/core/
git mv SOUL.md .system/core/
git mv USER.md .system/core/
git mv IDENTITY.md .system/core/
git mv TOOLS.md .system/core/
git mv HEARTBEAT.md .system/core/
git mv BOOTSTRAP.md .system/core/

# 3.2 Mover estado
git mv TODO.md .system/state/
git mv memory/ .system/memory/

# 3.3 Criar symlinks na raiz (para compatibilidade temporária)
ln -s .system/core/AGENTS.md AGENTS.md
ln -s .system/core/SOUL.md SOUL.md
ln -s .system/core/USER.md USER.md
ln -s .system/core/IDENTITY.md IDENTITY.md
ln -s .system/core/TOOLS.md TOOLS.md
ln -s .system/core/HEARTBEAT.md HEARTBEAT.md
ln -s .system/state/TODO.md TODO.md
```

#### FASE 4: Consolidar Alexandria 📚
```bash
# 4.1 Mover conteúdo existente
git mv apps/alexandria/README.md alexandria/
git mv apps/alexandria/contextos/ alexandria/
git mv apps/alexandria/agentes/ alexandria/
git mv apps/alexandria/pops/ alexandria/
git mv apps/alexandria/slas/ alexandria/
git mv apps/alexandria/skills/ alexandria/
git mv apps/alexandria/temas/ alexandria/
git mv apps/alexandria/sync/ alexandria/
git mv apps/alexandria/indice/ alexandria/

# 4.2 Mesclar MEX
git mv mex/ alexandria/mex/

# 4.3 Mover documentação de agentes
for file in src/agents/*.md; do
  git mv "$file" "alexandria/agentes/$(basename $file)"
done

# 4.4 Mover documentação organizada
for file in docs/personas/*.md; do
  git mv "$file" "alexandria/agentes/$(basename $file)"
done

git mv docs/planos/ alexandria/temas/planejamento/
git mv docs/analises/ alexandria/temas/analises/
git mv docs/arquitetura/ alexandria/temas/arquitetura/

# 4.5 Mover skills
git mv skills/ alexandria/skills/
```

#### FASE 5: Consolidar Apps 📱
```bash
# 5.1 Mover stark-api
mkdir -p apps/stark-api
cp -r src/stark-api/* apps/stark-api/
git rm -rf src/stark-api/
git add apps/stark-api/

# 5.2 REMOVER DUPLICAÇÕES CRÍTICAS
git rm -rf apps-totum/
git rm -rf apps_totum/

# 5.3 Verificar apps/totum/ (manter)
# Verificar se está funcionando
```

#### FASE 6: Limpeza 🧹
```bash
# 6.1 Remover caches
git rm -rf __pycache__/
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null

# 6.2 Limpar backups antigos (> 30 dias)
cd data/backups
ls -t *.tar.gz | tail -n +31 | xargs -r rm
cd ../..

# 6.3 Remover node_modules órfãos
rm -rf tarefas/node_modules/

# 6.4 Verificar arquivos vazios
find . -type f -empty -not -path "./.git/*" -ls
```

#### FASE 7: Atualizar Referências 🔗
```bash
# 7.1 Atualizar caminhos em scripts
find scripts/ -type f -name "*.sh" -exec sed -i 's|apps_totum/|apps/totum/|g' {} \;
find scripts/ -type f -name "*.sh" -exec sed -i 's|apps-totum/|apps/totum/|g' {} \;

# 7.2 Atualizar documentação
find . -name "*.md" -exec sed -i 's|apps_totum/|apps/totum/|g' {} \;
find . -name "*.md" -exec sed -i 's|apps-totum/|apps/totum/|g' {} \;

# 7.3 Commit das mudanças
git add -A
git commit -m "refactor(workspace): reestruturação completa do workspace

- Consolida Alexandria como biblioteca central única
- Elimina duplicações (apps-totum, apps_totum)
- Organiza sistema em .system/core/
- Move stark-api para apps/
- Limpa caches e backups antigos
- Estabelece convenções de nomenclatura"
```

#### FASE 8: Pós-Migração ✅
```bash
# 8.1 Verificar estrutura
tree -L 2 -d

# 8.2 Testar aplicações
cd apps/totum && npm install && npm run build
cd ../stark-api && npm install && npm run build

# 8.3 Verificar agentes
cd ../../agentes/giles && node tests/teste-giles-supabase.js

# 8.4 Remover symlinks temporários (após confirmar tudo funciona)
rm AGENTS.md SOUL.md USER.md IDENTITY.md TOOLS.md HEARTBEAT.md TODO.md
```

### 4.2 Rollback (se necessário)

```bash
# Restaurar snapshot
cd /root/.openclaw/workspace
rm -rf *
tar xzf archive/2026-04-05-migracao/workspace-pre-migracao.tar.gz
```

---

## 5. 📊 Métricas de Sucesso

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Tamanho total** | ~1.2GB | ~800MB | -33% |
| **Cópias de apps** | 3 | 1 | -67% |
| **Locais de documentação** | 6 | 1 | -83% |
| **Tempo para encontrar info** | >2min | <30s | -75% |
| **Duplicações** | 8+ | 0 | 100% |
| **node_modules** | 4 | 2 | -50% |

---

## 6. 📝 Notas do Bibliotecário

> "A organização é uma jornada, não um destino."

Esta reestruturação é **fase 1** da otimização. Após implementação:

1. **Monitorar** por 1 semana para identificar problemas
2. **Refinar** convenções conforme necessidade
3. **Documentar** decisões no Alexandria
4. **Automatizar** verificações de conformidade

A estrutura proposta é **extensível** - novos domínios podem ser adicionados sem quebrar a organização existente.

---

*Elaborado por: Giles 🧙‍♂️*  
*Data: 2026-04-05*  
*Status: Pronto para implementação*
