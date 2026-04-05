# 📋 PROPOSTA DE REORGANIZAÇÃO TOT

> **Plano de Consolidação do Workspace**  > Giles, o Bibliotecário — Organização e Unificação  
> Data: 2026-04-05 | Versão: 1.0 | Status: 🟡 Proposta

---

## 🎯 OBJETIVO

Transformar o workspace atual do TOT de uma **estrutura caótica e duplicada** em uma **organização limpa, indexada e escalável**, seguindo os princípios:

1. **Sempre Propor um Índice** — Todo documento/folder tem um INDEX
2. **Unificar ao Máximo** — Consolidar arquivos, eliminar duplicações
3. **Separação por Contexto** — TOT, Stark e Alexandria são organizações distintas

---

## 🔍 DIAGNÓSTICO ATUAL

### Estrutura Atual (Problemas)

```
📦 workspace/ (~1.2GB)
├── apps/                        # ✅ OK
│   ├── alexandria/              # ✅ Conhecimento
│   └── totum/                   # ✅ App principal
│
├── apps-totum/                  # 🔴 DUPLICAÇÃO (1.2MB)
├── apps_totum/                  # 🔴 DUPLICAÇÃO (3.3MB)
│
├── docs/                        # 🟡 OK mas disperso
│   ├── analises/                # ✅ Análises
│   ├── arquitetura/             # ✅ Arquitetura
│   ├── arquivados/              # ✅ Arquivados
│   ├── personas/                # ✅ Personas
│   └── planos/                  # ✅ Planos
│
├── src/                         # 🟡 Código OK
│   ├── agents/                  # ⚠️ Defs de agentes (md)
│   ├── context_hub/             # ✅ Python
│   ├── shared/                  # ✅ Python
│   ├── stark-api/               # ✅ Node
│   └── tars-central/            # ✅ Memórias
│
├── agents/                      # ✅ Agentes (novo padrão)
│   ├── giles/                   # ✅ Código + docs
│   ├── miguel/                  # ✅ Definido
│   ├── liz/                     # ✅ Definido
│   └── jarvis/                  # ✅ Definido
│
├── mex/                         # 🟡 Pode integrar em alexandria
├── protocolos/                  # 🟡 Pode ir para docs/
├── skills/                      # 🔴 Quase vazio
├── specs/                       # 🟡 Pode ir para docs/
└── tarefas/                     # 🟡 OK (node + scripts)
```

### Problemas Identificados

| # | Problema | Impacto | Severidade |
|---|----------|---------|------------|
| 1 | **Apps totum triplicado** | 8MB desperdiçado, confusão | 🔴 Alta |
| 2 | **Documentação dispersa** | Dificuldade de encontrar | 🔴 Alta |
| 3 | **Sem INDEX.md na raiz** | Navegação difícil | 🔴 Alta |
| 4 | `src/agents/` vs `agents/` | Dupla localização de defs | 🟡 Média |
| 5 | `mex/` isolado | Pode integrar Alexandria | 🟡 Média |
| 6 | `protocolos/` separado | Pode ir para `docs/` | 🟢 Baixa |
| 7 | `skills/` quase vazio | Consolidar em Alexandria | 🟢 Baixa |

---

## 🏗️ ESTRUTURA PROPOSTA

### Visão Geral

```
📦 workspace/
│
├── 📇 INDEX.md                    ← NOVO: Mapa completo
├── 🤖 AGENTES_TOTUM.md            ← NOVO: Hierarquia de agentes
├── 🏛️ ESTRUTURA_ALEXANDRIA.md     ← NOVO: Arquitetura Supabase
│
├── 🧠 CORE/                       ← Sistema base (8 arquivos)
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── USER.md
│   ├── IDENTITY.md
│   ├── TOOLS.md
│   ├── HEARTBEAT.md
│   ├── BOOTSTRAP.md
│   └── TODO.md
│
├── 🤖 AGENTS/                     ← Agentes (já existe, manter)
│   ├── INDEX.md                   ← NOVO
│   ├── ORGANOGRAMA.md
│   ├── README.md
│   ├── nova-cor/
│   ├── giles/
│   ├── miguel/
│   ├── liz/
│   ├── jarvis/
│   └── data/
│
├── 📱 APPS/                       ← Aplicações
│   ├── INDEX.md                   ← NOVO
│   ├── alexandria/                ← Manter
│   │   ├── INDEX.md               ← NOVO
│   │   ├── README.md
│   │   └── ...
│   └── totum/                     ← Manter (original)
│
├── 📚 DOCS/                       ← Documentação unificada
│   ├── INDEX.md                   ← NOVO
│   ├── analises/
│   ├── arquitetura/
│   ├── arquivados/
│   ├── personas/
│   ├── planos/
│   ├── protocolos/                ← MOVIDO: de /protocolos
│   └── skills/                    ← MOVIDO: de /skills
│
├── 💾 DATA/                       ← Dados e memórias
│   ├── databases/
│   ├── backups/
│   └── logs/
│
├── 📝 MEMORY/                     ← Memórias diárias (manter)
│
├── 🔧 INFRA/                      ← Infraestrutura (manter)
│
├── 💻 SRC/                        ← Código-fonte
│   ├── agents/                    ← MANTER: defs markdown
│   ├── context_hub/
│   ├── shared/
│   ├── stark-api/
│   └── tars-central/
│
├── 🧩 MEX/                        ← Integrar em Alexandria futuramente
│
└── 📋 TAREFAS/                    ← Scripts e configs Node
```

---

## 📋 PLANO DE AÇÃO DETALHADO

### FASE 1: Fundação (Dia 1) — CRIAR

**Objetivo:** Criar a estrutura base e índices

| Ação | Arquivo/Pasta | Status |
|------|---------------|--------|
| ✅ Criar INDEX.md na raiz | `/INDEX.md` | ✅ Feito |
| ✅ Criar AGENTES_TOTUM.md | `/AGENTES_TOTUM.md` | ✅ Feito |
| ✅ Criar ESTRUTURA_ALEXANDRIA.md | `/ESTRUTURA_ALEXANDRIA.md` | ✅ Feito |
| ⬜ Criar INDEX.md em AGENTS/ | `agents/INDEX.md` | 🔲 Pendente |
| ⬜ Criar INDEX.md em APPS/ | `apps/INDEX.md` | 🔲 Pendente |
| ⬜ Criar INDEX.md em DOCS/ | `docs/INDEX.md` | 🔲 Pendente |
| ⬜ Criar INDEX.md em ALEXANDRIA/ | `apps/alexandria/INDEX.md` | 🔲 Pendente |

**Comando para criar índices pendentes:**
```bash
# Índice de agents
cat > agents/INDEX.md << 'EOF'
# AGENTS INDEX

- [ORGANOGRAMA.md](./ORGANOGRAMA.md) — Hierarquia visual
- [README.md](./README.md) — Visão geral
- [nova-cor/](./nova-cor/) — Orquestrador TOT
- [giles/](./giles/) — Bibliotecário
- [miguel/](./miguel/) — Arquiteto
- [liz/](./liz/) — Guardiã
- [jarvis/](./jarvis/) — Executor
- [data/](./data/) — Analista
EOF

# Índice de apps
cat > apps/INDEX.md << 'EOF'
# APPS INDEX

- [alexandria/](./alexandria/) — Sistema de conhecimento
- [totum/](./totum/) — App principal React
EOF

# Índice de docs
cat > docs/INDEX.md << 'EOF'
# DOCS INDEX

- [analises/](./analises/) — Análises e pareceres
- [arquitetura/](./arquitetura/) — Documentação técnica
- [arquivados/](./arquivados/) — Documentos antigos
- [personas/](./personas/) — Personalidades dos agentes
- [planos/](./planos/) — Planos e roadmaps
- [protocolos/](./protocolos/) — POPs e protocolos
EOF
```

---

### FASE 2: Consolidação Crítica (Dia 2-3) — UNIFICAR

**Objetivo:** Eliminar duplicações críticas

#### 2.1 Resolver Duplicação apps_totum

```bash
# ANTES DE APAGAR — BACKUP
tar -czf /root/.openclaw/workspace/data/backups/apps_totum_backup_$(date +%Y%m%d).tar.gz \
    apps-totum/ apps_totum/

# COMPARAR — O que há de diferente?
diff -r apps/totum/ apps-totum/ > /tmp/diff_apps_totum_1.txt
diff -r apps/totum/ apps_totum/ > /tmp/diff_apps_totum_2.txt

# SE NÃO HOUVER DIFERENÇAS SIGNIFICATIVAS:
# mv apps-totum/ apps-totum_LIXO/
# mv apps_totum/ apps_totum_LIXO/
# # Depois de 7 dias sem problemas, apagar _LIXO
```

**Decisão:** Após verificar, consolidar em `apps/totum/` apenas.

#### 2.2 Consolidar Documentação de Agentes

```
PROBLEMA: Definições de agentes em 2 lugares:
- src/agents/ (miguel.md, liz.md, jarvis.md, ...)
- apps/alexandria/agentes/ (se houver)
- agents/ (apenas código/implementação)

SOLUÇÃO:
1. Manter src/agents/ como FONTE DA VERDADE para definições
2. Criar symlink em apps/alexandria/agentes/ → src/agents/
3. agents/ mantém código de implementação (giles/, jarvis/)
```

**Comando:**
```bash
# Criar symlink
ln -s /root/.openclaw/workspace/src/agents \
      /root/.openclaw/workspace/apps/alexandria/agentes

# Ou copiar se symlink não funcionar bem
# cp -r src/agents/* apps/alexandria/agentes/
```

#### 2.3 Mover pastas órfãs

```bash
# Mover protocolos para docs/
mv protocolos/ docs/protocolos/

# Mover skills para docs/ ou integrar em alexandria/
mv skills/* docs/skills/ 2>/dev/null || true
rmdir skills/ 2>/dev/null || true

# Mover specs para docs/
mv specs/* docs/specs/ 2>/dev/null || true
rmdir specs/ 2>/dev/null || true
```

---

### FASE 3: Padronização (Dia 4) — NORMALIZAR

**Objetivo:** Padronizar nomenclatura e formatos

#### 3.1 Padronizar Nomes de Arquivos

```bash
# Documentação sempre UPPERCASE.md
# Verificar inconsistências:
find . -name "*.md" -type f | grep -v node_modules | sort

# Renomear se necessário:
# mv docs/analises/analise_*.md docs/analises/ANALISE_*.md
```

#### 3.2 Padronizar Estrutura de Pastas

```
REGRAS:
1. Pastas: lowercase-com-hifens (ex: context-hub/)
2. Arquivos MD: UPPERCASE.md (ex: README.md, INDEX.md)
3. Código: lowercase (ex: giles-client.js)
4. SQL: lowercase (ex: schema.sql)
5. Configs: lowercase.yaml/json
```

#### 3.3 Criar .gitignore Apropriado

```gitignore
# TOT Workspace .gitignore

# Node
node_modules/
*/node_modules/
*/dist/
*/build/

# Python
__pycache__/
*.pyc
venv/
.env

# Dados sensíveis
*.db
!data/totum_claw.db  # manter apenas este
*.key
*.pem

# Backups grandes (manter apenas últimos 10)
data/backups/*.tar.gz
!data/backups/latest.tar.gz

# Logs
data/logs/*.log

# Temporários
*.tmp
*.temp
*_LIXO/
```

---

### FASE 4: Limpeza (Dia 5) — LIMPAR

**Objetivo:** Remover arquivos desnecessários

#### 4.1 Limpar Cache e Temporários

```bash
# Limpar __pycache__
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null

# Limpar arquivos vazios
find . -type f -name "EOF" -delete 2>/dev/null
find . -type f -size 0 -name "*.md" -delete 2>/dev/null

# Limpar relatórios antigos
# mv daily_report_20250331.* data/arquivados/
```

#### 4.2 Rotacionar Backups

```bash
# Manter apenas últimos 10 backups
ls -t data/backups/*.tar.gz | tail -n +11 | xargs rm -f

# Ou criar script de rotação
cat > scripts/rotate-backups.sh << 'EOF'
#!/bin/bash
# Mantém apenas os 10 backups mais recentes
BACKUP_DIR="/root/.openclaw/workspace/data/backups"
cd "$BACKUP_DIR"
ls -t *.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f
echo "$(date): Backups rotacionados" >> /var/log/totum-backup-rotate.log
EOF
chmod +x scripts/rotate-backups.sh

# Adicionar ao crontab
# 0 0 * * * /root/.openclaw/workspace/scripts/rotate-backups.sh
```

---

### FASE 5: Integração com Alexandria (Dia 6-7) — CONECTAR

**Objetivo:** Migrar conhecimento para Supabase

#### 5.1 Preparar Migração

```bash
# Listar documentos para migração
find docs/ -name "*.md" -type f | grep -v arquivados > /tmp/docs_para_migrar.txt

# Listar memórias
ls -1 memory/*.md > /tmp/memorias_para_migrar.txt

# Listar agentes
ls -1 src/agents/*.md > /tmp/agentes_para_migrar.txt
```

#### 5.2 Script de Chunking

```python
#!/usr/bin/env python3
# scripts/migrate_to_alexandria.py

import os
import re
from datetime import datetime

def chunk_markdown(filepath, chunk_size=1000):
    """Divide markdown em chunks inteligentes"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Dividir por headers
    sections = re.split(r'\n(?=#+\s)', content)
    
    chunks = []
    for i, section in enumerate(sections):
        if len(section.strip()) < 50:  # Ignorar seções muito pequenas
            continue
            
        chunk_id = f"doc_{datetime.now().strftime('%Y%m%d')}_{i:04d}"
        
        # Extrair metadados
        dominio = infer_domain(filepath, section)
        tags = extract_tags(section)
        
        chunks.append({
            'chunk_id': chunk_id,
            'content': section,
            'source_file': filepath,
            'dominio': dominio,
            'tags': tags,
            'autor': 'TOT'
        })
    
    return chunks

def infer_domain(filepath, content):
    """Inferir domínio do arquivo"""
    if 'infra' in filepath or 'docker' in filepath:
        return 'Infraestrutura'
    elif 'arquitetura' in filepath or 'api' in content.lower():
        return 'Desenvolvimento'
    elif 'agentes' in filepath or 'personas' in filepath:
        return 'Agentes'
    elif 'analise' in filepath or 'parecer' in filepath:
        return 'Decisoes'
    else:
        return 'Operacoes'

def extract_tags(content):
    """Extrair hashtags do conteúdo"""
    tags = re.findall(r'#(\w+)', content)
    return list(set(tags))[:10]  # Máximo 10 tags únicas

# Executar migração
if __name__ == '__main__':
    for root, dirs, files in os.walk('docs/'):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                chunks = chunk_markdown(filepath)
                print(f"Processado: {filepath} → {len(chunks)} chunks")
                # Aqui enviaria para Supabase
```

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Antes | Depois | Target |
|---------|-------|--------|--------|
| **Espaço duplicado** | ~8MB | 0MB | 0MB |
| **Pastas na raiz** | 25+ | 12 | < 15 |
| **Arquivos INDEX.md** | 0 | 5+ | >= 5 |
| **Documentos consolidados** | Dispersos | Centralizados | docs/ |
| **Tempo para encontrar info** | >2min | <30s | <30s |
| **Backups acumulados** | 15+ | 10 | 10 |

---

## ⚠️ RISCOS E MITIGAÇÕES

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Perder dados na consolidação | 🔴 Alto | Backup antes de qualquer deleção |
| Symlinks quebram | 🟡 Médio | Usar cópias se symlinks não funcionarem |
| Scripts dependem de paths antigos | 🔴 Alto | Atualizar scripts antes de mover |
| Confusão durante transição | 🟡 Médio | Manter documentação clara, comunicar |

---

## 📅 CRONOGRAMA

| Dia | Fase | Tarefas | Responsável |
|-----|------|---------|-------------|
| 1 | Fundação | Criar índices | Giles |
| 2 | Consolidação | Resolver duplicações | TOT + Giles |
| 3 | Consolidação | Mover pastas | TOT |
| 4 | Padronização | Nomenclatura | Giles |
| 5 | Limpeza | Limpar temporários | TOT |
| 6-7 | Integração | Migrar Alexandria | Giles |
| 8+ | Validação | Testar tudo | TOT |

---

## ✅ CHECKLIST DE EXECUÇÃO

### Preparar
- [ ] Backup completo antes de começar
- [ ] Verificar espaço em disco
- [ ] Notificar Israel sobre mudanças

### Executar
- [ ] FASE 1: Criar índices
- [ ] FASE 2: Consolidar duplicações
- [ ] FASE 3: Padronizar nomes
- [ ] FASE 4: Limpar temporários
- [ ] FASE 5: Integrar Alexandria

### Validar
- [ ] TOT consegue navegar pelo INDEX.md
- [ ] Todos os links funcionam
- [ ] Scripts ainda funcionam
- [ ] Nada foi perdido

---

## 📝 NOTAS IMPORTANTES

1. **Nunca apague imediatamente** — sempre use `mv para _LIXO/` primeiro
2. **Documente cada mudança** — atualize o INDEX.md
3. **Teste antes de propagar** — valide em ambiente isolado
4. **Comunique mudanças** — Israel precisa saber onde encontrar as coisas

---

## 🔗 REFERÊNCIAS

| Documento | Descrição |
|-----------|-----------|
| `INDEX.md` | Mapa navegável do workspace |
| `AGENTES_TOTUM.md` | Hierarquia completa de agentes |
| `ESTRUTURA_ALEXANDRIA.md` | Arquitetura do Supabase |
| `proposta_reestruturacao.md` | Análise detalhada original |
| `inventario_alexandria.md` | Inventário completo do conteúdo |

---

*Proposta de Reorganização v1.0*  
*Por: GILES, o Bibliotecário 📚*  
*Aprovado por: TOT 🎛️*  
*Status: 🟡 Aguardando execução*
