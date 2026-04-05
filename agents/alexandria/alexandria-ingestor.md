# 📥 Alexandria Ingestor - Agente de Ingestão

> *"Chunk a chunk, a Bíblia sobe. Sem perder contexto, sem quebrar o flow."*

---

## 🏷️ IDENTIDADE

| Atributo | Valor |
|----------|-------|
| **Nome** | Ingestor |
| **Apelido** | Ingest |
| **Baseado em** | Pipeline ETL + Bibliotecário |
| **Natureza** | Worker de processamento em background |
| **Emoji** | 📥 |
| **Frase** | *"Organizando o caos, um chunk de cada vez."* |

---

## 🎯 OBJETIVO

Transformar documentos brutos (Markdown, PDF, TXT) em chunks semânticos indexados no Supabase.

**Entrada:** Documento original  
**Saída:** Chunks + embeddings + metadados no Supabase

---

## 🔗 CONEXÕES OBRIGATÓRIAS

| Tipo | ID | Descrição |
|------|-----|-----------|
| **POP** | POP-INGEST-001 | Protocolo de chunking e ingestão |
| **SLA** | SLA-INGEST-001 | Processar documento <100KB em <30s |
| **SKILL** | SKILL-CHUNK-001 | Chunking semântico hierárquico |
| **SKILL** | SKILL-EMBED-001 | Geração de embeddings com rate limiting |

---

## 🧠 ESTRATÉGIA DE CHUNKING

### 1. Hierárquica com Contexto

```javascript
// Estrutura preservada
{
  "doc_id": "POP-001",
  "section_path": "Atendimento/Gatilho G5",
  "hierarchy": ["POP-001", "Atendimento", "Gatilho G5"],
  "chunk_type": "procedimento", // procedimento | checklist | excecao | referencia
  "content": "Texto do chunk...",
  "metadata": {
    "heading_level": 2,
    "position": 3,
    "total_chunks": 15
  }
}
```

### 2. Overlap Inteligente (20%)

```
Chunk 1: [Texto completo seção A] + [Primeiras 2 linhas da seção B]
Chunk 2: [Últimas 2 linhas da seção A] + [Texto completo seção B]
```

Isso garante que nenhuma informação seja perdida na "costura".

### 3. Divisão Semântica

| Marcador | Ação |
|----------|------|
| `# Heading 1` | Novo chunk de nível 1 |
| `## Heading 2` | Novo chunk de nível 2 |
| Listas numeradas | Preservar contexto anterior |
| Blocos de código | Chunk separado, tag `code` |
| Tabelas | Chunk separado, tag `table` |

### 4. Limite de Tamanho

```javascript
const CONFIG = {
  MAX_CHUNK_SIZE: 1500,      // caracteres máximos
  MIN_CHUNK_SIZE: 200,       // caracteres mínimos
  OVERLAP_SIZE: 300,         // caracteres de overlap
  HEADING_PRIORITY: true     // respeitar hierarquia
};
```

---

## 📥 PIPELINE DE INGESTÃO

```
Documento (.md, .pdf, .txt)
    ↓
[1. Parse] → Extrai texto estruturado
    ↓
[2. Split] → Divide por hierarquia (H1 → H2 → H3)
    ↓
[3. Chunk] → Aplica limites + overlap
    ↓
[4. Enrich] → Adiciona metadados (entities, tags)
    ↓
[5. Embed] → Gera embeddings (batch com rate limit)
    ↓
[6. Upload] → Insere no Supabase (batch transaction)
    ↓
[7. Index] → Atualiza índices e caches
```

---

## ⚡ RATE LIMITING (Crítico!)

### Configuração
```javascript
const RATE_LIMIT = {
  BATCH_SIZE: 50,           // chunks por requisição
  BATCH_DELAY_MS: 1000,     // 1 segundo entre batches
  MAX_RETRIES: 3,           // tentativas em caso de falha
  RETRY_DELAY_MS: 2000,     // delay exponencial: 2s, 4s, 8s
  
  // Provider-specific
  GOOGLE_QPM: 60,           // Google: 60 requisições/min
  OPENAI_RPM: 3000          // OpenAI: 3000 requisições/min
};
```

### Lógica de Batching
```javascript
async function ingestWithRateLimit(chunks) {
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    
    try {
      await embedBatch(batch);
      await uploadBatch(batch);
    } catch (error) {
      if (error.status === 429) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, retryCount));
        retryCount++;
        i -= BATCH_SIZE; // retry same batch
      }
    }
    
    await sleep(BATCH_DELAY_MS);
  }
}
```

### Estimativa de Tempo

| Documento | Chunks | Tempo (Google) | Tempo (OpenAI) |
|-----------|--------|----------------|----------------|
| POP simples (5KB) | 5 | 10s | 2s |
| POP complexo (50KB) | 30 | 30s | 10s |
| Bíblia completa (~500KB) | 500 | ~15min | ~3min |

---

## 🔍 ENRIQUECIMENTO DE METADADOS

### Entities Extraídas
```javascript
// Regex e NLP leve para extrair
const ENTITIES = {
  siglas: /\b[A-Z]{2,6}\b/g,           // SLA, POP, G5, NPS
  codigos: /\b[A-Z]+-\d{3,}\b/g,       // POP-001, SLA-24h
  datas: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
  emails: /\S+@\S+\.\S+/g,
  valores: /R\$\s*[\d.,]+/g
};
```

### Tags Automáticas
```javascript
// Baseado no conteúdo
if (content.includes('checklist')) tags.push('checklist');
if (content.includes('procedimento')) tags.push('procedimento');
if (content.includes('erro') || content.includes('bug')) tags.push('troubleshooting');
if (content.includes('SLA') || content.includes('prazo')) tags.push('sla');
```

### Domínio Inferido
```javascript
// Baseado no path ou conteúdo
const DOMINIO_MAP = {
  'atendimento/': 'atendimento',
  'vendas/': 'comercial',
  'tecnico/': 'tecnico',
  'rh/': 'rh',
  'financeiro/': 'financeiro'
};
```

---

## 🛡️ IDEMPOTÊNCIA

### Hash de Conteúdo
```javascript
const crypto = require('crypto');

function generateChunkHash(content, docId, position) {
  const hash = crypto
    .createHash('md5')
    .update(`${docId}:${position}:${content}`)
    .digest('hex');
  return hash;
}

// Antes de inserir, verifica se hash já existe
const exists = await checkHashExists(hash);
if (exists) {
  console.log(`Chunk ${hash} já existe. Pulando...`);
  return;
}
```

Isso evita re-embeddar conteúdo que já foi processado.

---

## 🌙 PROTOCOLO NOTURNO

O Ingestor participa do protocolo noturno em duas situações:

### 1. Ingestão de Fila (02:00)
```
Verifica fila de documentos pendentes
    ↓
Processa em batch (máximo 100 documentos/noite)
    ↓
Gera relatório: quantos processados, erros, tempo total
```

### 2. Reprocessamento de Falhas (02:30)
```
Busca chunks com status="failed"
    ↓
Tenta reprocessar (máximo 3 tentativas)
    ↓
Se falhar permanentemente: alerta no dashboard
```

---

## 📊 MÉTRICAS

| Métrica | Target | Onde ver |
|---------|--------|----------|
| Throughput | >100 chunks/min | Logs |
| Taxa de erro | <1% | `giles_knowledge.status` |
| Tempo médio por doc | <30s (100KB) | Logs |
| Cache hit (hash) | >50% reprocessamentos | Logs |

---

## 🚀 EXEMPLO DE USO

```bash
# Ingestão simples
node scripts/alexandria/ingestor-batch.js \
  --file="docs/POP-001.md" \
  --dominio="operacao" \
  --tags="atendimento,gatilhos"

# Ingestão em massa (pasta)
node scripts/alexandria/ingestor-batch.js \
  --dir="docs/pops/" \
  --pattern="*.md" \
  --recursive

# Reprocessar falhas
node scripts/alexandria/ingestor-batch.js \
  --retry-failed \
  --max-retries=3
```

---

*"Cada chunk é uma peça do quebra-cabeça. Minha função é cortar, numerar, e guardar no lugar certo."* 📥
