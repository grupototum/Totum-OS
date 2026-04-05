# 📝 Convenções de Código

## Convenções do Sistema de Persistência

---

## Nomenclatura

### Arquivos de Contexto
```
ctx_[YYYYMMDD]_[HHMMSS]_[hash8].md

Exemplo: ctx_20260405_035500_a1b2c3d4.md
```

### Agentes
```
[nome].md

Exemplo: giles.md, data.md, tot.md
```

### POPs
```
POP-[NUM]-[NOME].md

Exemplo: POP-001-CRIACAO-AGENTES.md
```

### Skills
```
skill-[nome]-[versao].md

Exemplo: skill-codigos-001.md
```

---

## Estrutura de Arquivos Markdown

### Contexto
```markdown
---
id: [unico]
tipo: [decisao|erro|aprendizado|tarefa|ideia]
categoria: [agente|sistema|projeto|negocio]
origem: [nome_agente]
data: [ISO8601]
status: [pendente|confirmado|recusado]
hash: [md5]
tamanho: [chars]
---

# 📝 Contexto: [TIPO] - [CATEGORIA]

**Origem:** [nome]  
**Data:** [formatado]  
**Status:** [emoji + texto]

## 📋 Conteúdo

[conteúdo]

---

## 🔗 Destinos de Persistência

- [x] VPS Local (ativo)
- [ ] Supabase (pending)
- [ ] GitHub (pending)
- [ ] Google Drive (pending)
- [ ] Servidor Dedicado (pending)

## 📝 Notas

[notas adicionais]
```

---

## Código Python

### Importações
```python
from pathlib import Path
from datetime import datetime
import hashlib
import json
```

### Funções
```python
def nome_funcao(parametro: str) -> dict:
    """Docstring claro"""
    pass
```

### Constantes
```python
WORKSPACE = Path("/root/.openclaw/workspace")
ALEXANDRIA = WORKSPACE / "alexandria"
```

---

## Commits no Git

### Formato
```
[tipo]: descrição curta

- Contexto mais detalhado
- O que mudou
- Por que mudou

Refs: [id do contexto]
```

### Tipos
- `feat`: nova funcionalidade
- `fix`: correção
- `docs`: documentação
- `refactor`: refatoração
- `sync`: sincronização de contexto

---

## Logs

### Formato
```
[YYYY-MM-DD HH:MM:SS] [NÍVEL] mensagem
```

### Níveis
- `DEBUG`: detalhes internos
- `INFO`: operações normais
- `WARN`: alertas
- `ERROR`: erros

---

*Convenções mantidas por: GILES 🧙‍♂️*
