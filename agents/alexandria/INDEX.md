# 🏛️ Alexandria - Índice do Sistema

> *"O conhecimento é a única coisa que cresce quando compartilhada."*

---

## 📁 Estrutura

```
agents/alexandria/
├── INDEX.md                    ← Você está aqui
├── alexandria-core.md          # Agente Orquestrador Principal
├── alexandria-ingestor.md      # Agente de Ingestão de Conhecimento
├── alexandria-zelador.md       # Agente de Manutenção Noturna
└── alexandria-router.md        # Roteador de Intenções

scripts/alexandria/
├── chunker.js                  # Chunking semântico hierárquico
├── ingestor-batch.js           # Ingestão em lotes com rate limiting
├── zelador-job.js              # Job noturno de manutenção
├── test-ingestion.js           # Testes para ingestion service
├── hybrid-search.js            # Busca híbrida vetorial + full-text (futuro)
├── knowledge-gap-detector.js   # Detector de lacunas de conhecimento (futuro)
└── sync-cache.js               # Sincronização local/offline (futuro)
```

---

## 🎯 Agentes

| Agente | Função | Emoji |
|--------|--------|-------|
| **Alexandria Core** | Orquestrador central | 🏛️ |
| **Ingestor** | Chunking + embedding + upload | 📥 |
| **Zelador** | Manutenção + deduplicação | 🧹 |
| **Router** | Classificação de intenções | 🚦 |

---

## 🔄 Fluxos Principais

### 1. Ingestão de Conhecimento
```
Documento (PDF/Markdown)
    ↓
[Chunker] → Chunking semântico hierárquico
    ↓
[Ingestor] → Embedding + metadados → Supabase
    ↓
[Indexado na Alexandria]
```

### 2. Consulta/Resposta
```
Pergunta do usuário
    ↓
[Router] → Classifica intenção
    ↓
[Hybrid Search] → Busca híbrida no Supabase
    ↓
[Alexandria Core] → Síntese da resposta
    ↓
[Delegação] → Se necessário, escala para agente especializado
```

### 3. Manutenção Noturna (04:00 CST)
```
[Zelador Job]
    ├── Varre chunks órfãos (sem tags)
    ├── Detecta duplicatas semânticas
    ├── Sugere merges de domínios
    ├── Gera relatório de Knowledge Gaps
    └── Atualiza cache local
```

---

## 🗄️ Schema Supabase

Tabelas principais (definidas em `giles_schema_supabase.sql`):

| Tabela | Propósito |
|--------|-----------|
| `giles_knowledge` | Chunks + embeddings + metadados |
| `giles_dominios` | Taxonomia hierárquica |
| `giles_consultas` | Logs de queries + scores |
| `giles_sinonimos` | Mapeamento de termos |

Funções RPC:
- `giles_hybrid_search()` - Busca híbrida
- `giles_search_by_domain()` - Busca por domínio
- `giles_get_tree()` - Árvore hierárquica

---

## ⚙️ Configuração

### Variáveis de Ambiente
```bash
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Embeddings (rotacionáveis)
EMBEDDING_PROVIDER=google|openai|local
EMBEDDING_API_KEY=...
EMBEDDING_MODEL=text-embedding-004

# Rate Limiting
BATCH_SIZE=50
BATCH_DELAY_MS=1000
MAX_RETRIES=3

# Cache Local
CACHE_ENABLED=true
CACHE_TTL_HOURS=24
```

---

## 🚀 Comandos

```bash
# Ingestão manual de documento
node scripts/alexandria/ingestor-batch.js --file="POP-001.md" --dominio="operacao"

# Executar zelador manualmente
node scripts/alexandria/zelador-job.js --dry-run

# Sincronizar cache local
node scripts/alexandria/sync-cache.js --full

# Busca teste
node scripts/alexandria/hybrid-search.js --query="Gatilho G5"
```

---

## 📊 Métricas

| Métrica | Target | Onde ver |
|---------|--------|----------|
| Tempo de ingestão | <20min para Bíblia completa | Logs |
| Latência de busca | <200ms | `giles_consultas.duration_ms` |
| Knowledge Gap | <5% queries com score <0.7 | Dashboard |
| Cache hit rate | >80% | Logs locais |

---

## 🔗 Integrações

- **N8N** → Webhooks para atualizações de POPs
- **Supabase** → Banco central de conhecimento
- **Ollama Local** → Fallback quando offline
- **Apps Totum** → Interface de consulta

---

*Última atualização: 2026-04-05*
*Versão: 1.0.0*
