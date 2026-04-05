# 🧠 TOTUM CONTEXT SYSTEM
## Arquitetura Híbrida: Central Hub + MEX Scaffold

---

## 📊 Comparação das Abordagens

| Aspecto | MEX (Projeto Local) | Central Totum (Hub Global) | Híbrido |
|---------|---------------------|---------------------------|---------|
| **Escopo** | Por projeto | Cross-IAs | Ambos |
| **Persistência** | Arquivos `.mex/` | Vector DB + SQLite | Unificado |
| **Busca** | Navegação estruturada | Semântica (embeddings) | Ambas |
| **Drift Detection** | ✅ 8 checkers | ❌ (a implementar) | ✅ Combinado |
| **Cross-IA** | ❌ (isolado por projeto) | ✅ (hub central) | ✅ Via hub |
| **Setup** | `git clone .mex` | API REST | CLI unificado |

---

## 🏗️ Arquitetura Híbrida Proposta

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TOTUM CONTEXT SYSTEM                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    │
│  │   Kimi Claw     │     │  Bot Atendente  │     │ Agentes Futuros │    │
│  │  (OpenClaw)     │     │   (Telegram)    │     │   (n8n, etc)    │    │
│  └────────┬────────┘     └────────┬────────┘     └────────┬────────┘    │
│           │                       │                       │             │
│           └───────────────────────┼───────────────────────┘             │
│                                   │                                     │
│                    ┌──────────────▼──────────────┐                      │
│                    │    TOTUM CONTEXT API        │                      │
│                    │  (FastAPI + ChromaDB)       │                      │
│                    └──────────────┬──────────────┘                      │
│                                   │                                     │
│         ┌─────────────────────────┼─────────────────────────┐           │
│         │                         │                         │           │
│    ┌────▼────┐              ┌─────▼─────┐            ┌──────▼─────┐     │
│    │  MEX    │◄────────────►│  Agente   │◄──────────►│  Vector    │     │
│    │ Scaffold│   Sync        │  Curador  │   Query    │   Store    │     │
│    │ (Local) │              │  (IA)     │            │(ChromaDB)  │     │
│    └────┬────┘              └───────────┘            └────────────┘     │
│         │                                                               │
│    ┌────▼────────────────────────────────────────────────────┐          │
│    │  MEX SCAFFOLD STRUCTURE (por projeto)                    │          │
│    │  .mex/                                                    │          │
│    │  ├── mex.md           ← Bootstrap (120 tokens)            │          │
│    │  ├── routing.yaml     ← Mapeia tarefas → contextos       │          │
│    │  ├── architecture.md  ← Decisões arquiteturais            │          │
│    │  ├── conventions.md   ← Padrões de código                 │          │
│    │  ├── decisions/       ← ADRs (Architecture Decisions)     │          │
│    │  ├── patterns/        ← Padrões do projeto                │          │
│    │  ├── state.md         ← Estado atual do projeto           │          │
│    │  └── drift-report.md  ← Relatório de drift                │          │
│    └────────────────────────────────────────────────────────────┘          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Trabalho

### 1. Início de Sessão
```
1. IA carrega mex.md (bootstrap enxuto)
2. mex.md aponta para routing.yaml
3. routing direciona para contexto específico
4. Se precisar de contexto externo → consulta Central Hub
```

### 2. Durante a Tarefa
```
1. IA executa tarefa
2. Aprendizados são salvos no scaffold local (.mex/)
3. Padrões são extraídos e salvos em patterns/
4. Contexto é enviado para Central Hub (cross-IA)
```

### 3. Fim de Sessão
```
1. mex drift-check → detecta inconsistências
2. Se drift detectado: mex sync → corrige com IA
3. state.md é atualizado com estado atual
4. Central Hub é sincronizado com mudanças
```

---

## 📁 Estrutura de Diretórios

```
workspace/
├── context_hub/              ← Central Hub ( já criado )
│   ├── api/
│   ├── core/
│   └── data/
│
├── .mex/                     ← MEX Scaffold (por projeto)
│   ├── mex.md               ← Bootstrap
│   ├── routing.yaml         ← Routing table
│   ├── architecture.md      ← Arquitetura
│   ├── conventions.md       ← Convenções
│   ├── decisions/
│   │   ├── 001-escolha-banco.md
│   │   └── 002-api-framework.md
│   ├── patterns/
│   │   ├── INDEX.md
│   │   ├── error-handling.md
│   │   └── authentication.md
│   ├── state.md             ← Estado atual
│   └── drift-report.md      ← Relatório de drift
│
├── projects/                 ← Projetos com MEX
│   ├── totum-apps/
│   │   ├── .mex/            ← Scaffold do projeto
│   │   └── src/
│   └── bot-atendente/
│       ├── .mex/
│       └── src/
│
└── scripts/
    ├── context-sync.py      ← Sincroniza MEX ↔ Hub
    └── drift-checker.py     ← Checkers customizados
```

---

## 🛠️ Implementação

### Fase 1: Adotar MEX no workspace
```bash
# 1. Clonar MEX no workspace
git clone https://github.com/theDakshJaitly/mex.git .mex

# 2. Setup
bash .mex/setup.sh

# 3. Linkar CLI
cd .mex && npm link && cd ..

# 4. Verificar drift
mex drift-check

# 5. Sincronizar
mex sync
```

### Fase 2: Integrar com Central Hub
```python
# context_hub/integrations/mex_sync.py

class MexSync:
    """Sincroniza MEX Scaffold com Central Hub"""
    
    def sync_to_hub(self, project_path: str):
        """Envia contexto do MEX para o Hub Central"""
        mex_files = self._load_mex_scaffold(project_path)
        
        for file in mex_files:
            context_hub.store(
                entry=ContextEntry(
                    source=f"mex:{project_path}",
                    entry_type="project_context",
                    content=file.content,
                    tags=file.tags + ["mex", project_path]
                )
            )
    
    def sync_from_hub(self, query: str, project_path: str):
        """Busca contexto relevante do Hub para o MEX"""
        results = context_hub.query(query)
        
        # Atualiza state.md com contexto externo
        self._update_state_md(project_path, results)
```

### Fase 3: CLI Unificado
```bash
# Comandos do Totum Context System

totum-context init [project-name]    # Inicializa MEX + Hub
totum-context drift                  # Checa drift local
totum-context sync                   # Sincroniza MEX ↔ Hub
totum-context query "..."            # Busca no Hub
totum-context status                 # Status de todos os contextos
```

---

## 🎯 Benefícios do Híbrido

| Problema | Solução MEX | Solução Hub | Resultado |
|----------|-------------|-------------|-----------|
| IAs esquecem | Scaffold persistente | Memória vetorial | ✅ Nunca esquece |
| Context window | Bootstrap enxuto | Query semântica | ✅ Eficiente |
| Docs desatualizados | Drift detection | Versionamento | ✅ Sempre atual |
| Isolamento por projeto | Scaffold local | Cross-IA sync | ✅ Compartilhado |
| Setup complexo | CLI simples | API REST | ✅ Fácil usar |

---

## 🚀 Próximos Passos

1. **Adotar MEX** no workspace atual
2. **Criar integração** MEX ↔ Central Hub
3. **Adicionar drift detection** ao Hub
4. **Testar** com Kimi + Bot Atendente

Quer que eu **implemente essa integração agora**? 🛠️
