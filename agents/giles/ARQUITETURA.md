# Giles - Cientista da Informação
## Arquitetura de Comunicação Multi-Agente

### 🎯 Objetivo
Giles é o **hub central de conhecimento** da Totum. Todos os OpenClaw (TOT, Manus, futuros agentes) se comunicam com ele através do **Supabase** (projeto "Grupo Totum").

> **Status:** ✅ Banco criado no Supabase (project: Grupo Totum, org: Alexandria)

---

## 🏗️ Arquitetura Hub-and-Spoke (SUPABASE)

```
                    ┌─────────────────────────────────────────┐
                    │         SUPABASE (Grupo Totum)          │
                    │  ┌─────────────────────────────────┐    │
                    │  │  giles_knowledge (PostgreSQL)   │    │
                    │  │  + pgvector + Full-text         │    │
                    │  │  + FTS + Funções RPC            │    │
                    │  └─────────────────────────────────┘    │
                    │  ┌─────────────────────────────────┐    │
                    │  │  giles_consultas (Logs)         │    │
                    │  │  giles_dominios (Taxonomia)     │    │
                    │  └─────────────────────────────────┘    │
                    └─────────────────────────────────────────┘
                                ▲           ▲
                                │           │
           ┌────────────────────┤           ├────────────────────┐
           │                    │           │                    │
           ▼                    ▼           ▼                    ▼
   ┌───────────────┐    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
   │    TOT        │    │   Manus       │   │  OpenClaw     │   │  OpenClaw     │
   │  (Alibaba)    │    │  (Windows)    │   │   (Oracle)    │   │   (Stark)     │
   │               │    │   (local)     │   │   (se der)    │   │   (VPS)       │
   └───────────────┘    └───────────────┘   └───────────────┘   └───────────────┘
```

---

## 🔐 Credenciais Supabase

**Projeto:** Grupo Totum  
**Organização:** Alexandria

### Para obter as credenciais:
1. Acesse: https://supabase.com/dashboard
2. Selecione projeto "Grupo Totum"
3. Vá em: Project Settings → API
4. Copie:
   - **URL:** `https://xxxxxxxx.supabase.co`
   - **anon public:** `eyJhbG...` (chave pública)
   - **service_role:** (chave secreta - cuidado!)

### Variáveis de Ambiente
```bash
# No Windows (PowerShell)
$env:SUPABASE_URL="https://seu-projeto.supabase.co"
$env:SUPABASE_KEY="sua-anon-key-aqui"

# Ou arquivo .env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-anon-key-aqui
```

---

## 🔄 Fluxo de Comunicação

### 1. Ingestão de Conhecimento
```
Agente (TOT/Manus/Outro) 
    ↓
Extrai metadados + gera embedding
    ↓
INSERT INTO giles_knowledge (Supabase)
    ↓
Giles indexa e relaciona automaticamente
```

### 2. Consulta (Query)
```
Agente faz pergunta
    ↓
Gera embedding da query
    ↓
SELECT * FROM giles_hybrid_search(embedding, query_text)
    ↓
Retorna chunks relevantes + metadados
    ↓
Agente sintetiza resposta
    ↓
LOG em giles_consultas
```

### 3. Backup e Redundância
```
Supabase (primário - nuvem)
    ↓ (backup automático da Supabase)
Backup Supabase (ponto de recuperação)
    ↓ (export diário)
Local/Oracle (cópia de segurança)
```

---

## 💾 Schema do Banco (Já Criado!)

Você já rodou o schema no Supabase. As tabelas criadas:

### `giles_knowledge` - Chunks + Metadados
- `id` (UUID PK)
- `chunk_id` (TEXT UNIQUE)
- `content` (TEXT)
- `embedding` (VECTOR(1536)) - pgvector
- `dominio`, `categoria`, `subcategoria` - Taxonomia
- `tags`, `keywords` (TEXT[]) - Arrays PostgreSQL
- `pai_id` - Hierarquia
- `relacionamentos`, `entidades` (JSONB) - Ontologia
- `source_file`, `source_type` - Rastreabilidade
- `autor`, `created_at`, `confianca` - Metadata

### `giles_dominios` - Taxonomia Controlada
- Domínios pré-cadastrados: Infraestrutura, Desenvolvimento, Negócios, Marketing, Operações, Pessoal

### `giles_consultas` - Logs
- Histórico de todas as consultas

### `giles_sinonimos` - Sinônimos
- Aliases para termos comuns

### Funções RPC
- `giles_hybrid_search()` - Busca híbrida vetorial + full-text
- `giles_search_by_domain()` - Busca por domínio
- `giles_get_tree()` - Árvore hierárquica

---

## 📡 Protocolo de Comunicação

### A. Adicionar Conhecimento (Node.js)
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function ingestDocument(content, metadata) {
    // 1. Gerar embedding (via OpenAI, Gemini, ou local)
    const embedding = await generateEmbedding(content);
    
    // 2. Inserir no Giles
    const { data, error } = await supabase
        .from('giles_knowledge')
        .insert({
            chunk_id: `chunk_${Date.now()}`,
            content: content,
            embedding: embedding,
            dominio: metadata.dominio,
            categoria: metadata.categoria,
            tags: metadata.tags,
            entidades: metadata.entidades,
            source_file: metadata.source_file,
            autor: metadata.agente  // 'TOT', 'Manus', etc.
        });
    
    return data;
}
```

### B. Consultar Conhecimento
```javascript
async function queryGiles(queryText) {
    // 1. Gerar embedding da query
    const queryEmbedding = await generateEmbedding(queryText);
    
    // 2. Busca híbrida via RPC
    const { data, error } = await supabase.rpc('giles_hybrid_search', {
        query_embedding: queryEmbedding,
        query_text: queryText,
        match_count: 5,
        match_threshold: 0.7,
        full_text_weight: 0.3,
        semantic_weight: 0.7
    });
    
    return data;
}
```

### C. Busca por Domínio
```javascript
async function queryByDomain(queryText, dominio) {
    const queryEmbedding = await generateEmbedding(queryText);
    
    const { data, error } = await supabase.rpc('giles_search_by_domain', {
        query_embedding: queryEmbedding,
        target_dominio: dominio,
        match_count: 5
    });
    
    return data;
}
```

---

## 🎭 Personalidades dos Agentes

| Agente | Função | Como Usa o Giles |
|--------|--------|------------------|
| **TOT** | Orquestrador | Consulta para decisões, alimenta com logs |
| **Manus** | Coder/Implementador | Alimenta com código e docs, consulta patterns |
| **Giles** | Cientista da Info | Organiza, categoriza, mantém ontologia |
| **Futuros** | Especialistas | Consultam domínios específicos |

---

## 🚀 Próximos Passos

### 1. Obter Credenciais (Você)
- [ ] Pegar URL e anon key do Supabase (Project Settings → API)
- [ ] Me passar pra eu configurar nos arquivos

### 2. Criar Cliente Supabase (TOT)
- [ ] Adaptar `giles-client.js` para Supabase
- [ ] Criar `teste-giles-supabase.js`

### 3. Teste de Fogo
- [ ] Rodar script de teste
- [ ] Giles organiza seus próprios arquivos
- [ ] Verificar se tudo funciona

---

## 📝 Notas

- **Banco:** PostgreSQL 15+ com pgvector
- **Embeddings:** 1536 dimensões (OpenAI text-embedding-3-small) ou 768 (local)
- **Busca:** Híbrida (similaridade cosseno + full-text search)
- **Vantagens:** Busca vetorial nativa, escalabilidade, acesso remoto
- **Limite:** Plano gratuito (500MB - suficiente pra começar)

---

*Arquitetura v3.0 - 12/04/2026*  
*Status: ✅ Banco criado no Supabase - Aguardando credenciais para conectar*
