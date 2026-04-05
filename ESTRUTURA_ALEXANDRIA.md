# 🏛️ ESTRUTURA ALEXANDRIA

> **Proposta de Organização do Conhecimento no Supabase**  
> Hub Central da Totum — Conhecimento Persistente e Acessível  
> Data: 2026-04-05 | Versão: 1.0

---

## 🎯 VISÃO GERAL

A **Alexandria** é o **biblioteca central digital** da Totum — inspirada na mítica Biblioteca de Alexandria, mas impossível de queimar, com busca semântica instantânea e acesso 24/7 para todos os agentes.

```
┌─────────────────────────────────────────────────────────────────┐
│                      ALEXANDRIA (Supabase)                       │
│                  PostgreSQL + pgvector + FTS                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │giles_know   │ │giles_dominio│ │giles_consult│ │giles_sinon │ │
│  │ledge        │ │s            │ │as           │ │imos         │ │
│  │(Conhecimento)│ │(Taxonomia)  │ │(Logs)       │ │(Sinônimos)  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ▲                 ▲                 ▲
         │                 │                 │
    ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
    │   TOT   │       │  Manus  │       │  Stark  │
    │(Alibaba)│       │(Windows)│       │  (VPS)  │
    └─────────┘       └─────────┘       └─────────┘
```

---

## 🏗️ ARQUITETURA DE DADOS

### 1. TABELA PRINCIPAL: `giles_knowledge`

Armazena **chunks de conhecimento** com embeddings vetoriais.

```sql
CREATE TABLE giles_knowledge (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id TEXT UNIQUE NOT NULL,
    
    -- Conteúdo
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    
    -- Taxonomia Hierárquica
    dominio TEXT NOT NULL REFERENCES giles_dominios(nome),
    categoria TEXT NOT NULL,
    subcategoria TEXT,
    
    -- Metadados de Busca
    tags TEXT[],
    keywords TEXT[],
    entidades JSONB,
    relacionamentos JSONB,
    
    -- Hierarquia
    pai_id UUID REFERENCES giles_knowledge(id),
    
    -- Rastreabilidade
    source_file TEXT,
    source_type TEXT,
    source_url TEXT,
    
    -- Autoria e Tempo
    autor TEXT NOT NULL,  -- 'TOT', 'Manus', 'Giles', etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confianca DECIMAL(3,2) DEFAULT 1.0,
    
    -- Acesso
    visibilidade TEXT DEFAULT 'public',  -- public, private, restricted
    allowed_agents TEXT[]
);
```

#### Campos Detalhados

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `chunk_id` | TEXT | ID único do chunk | `ctx_20260405_035500_a1b2` |
| `content` | TEXT | Conteúdo textual | "Decisão: usar Supabase" |
| `embedding` | VECTOR(1536) | Embedding OpenAI | [0.23, -0.45, ...] |
| `dominio` | TEXT | Domínio principal | "Desenvolvimento" |
| `categoria` | TEXT | Categoria | "Arquitetura" |
| `subcategoria` | TEXT | Sub-categoria | "Banco de Dados" |
| `tags` | TEXT[] | Tags livres | `{supabase, decisao}` |
| `keywords` | TEXT[] | Palavras-chave | `{banco, postgres}` |
| `entidades` | JSONB | Entidades mencionadas | `{"pessoas":["Israel"],"techs":["Supabase"]}` |
| `relacionamentos` | JSONB | Links semânticos | `{"relacionado_com":["uuid1","uuid2"]}` |
| `autor` | TEXT | Quem criou | "TOT", "Manus", "Miguel" |

---

### 2. TABELA DE TAXONOMIA: `giles_dominios`

Define a **estrutura hierárquica** do conhecimento.

```sql
CREATE TABLE giles_dominios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT UNIQUE NOT NULL,
    descricao TEXT,
    icone TEXT,  -- emoji
    cor TEXT,    -- hex color
    pai_id UUID REFERENCES giles_dominios(id),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Domínios Base (Seed)

```sql
INSERT INTO giles_dominios (nome, descricao, icone, cor, ordem) VALUES
('Infraestrutura', 'Servidores, cloud, redes', '🔧', '#FF6B6B', 1),
('Desenvolvimento', 'Código, APIs, arquitetura', '💻', '#4ECDC4', 2),
('Negócios', 'Estratégia, vendas, clientes', '💼', '#45B7D1', 3),
('Marketing', 'Campanhas, conteúdo, ads', '📢', '#96CEB4', 4),
('Operações', 'Processos, SLAs, POPs', '⚙️', '#FFEAA7', 5),
('Pessoal', 'Time, cultura, treinamento', '👥', '#DDA0DD', 6),
('Agentes', 'IA, agentes, automação', '🤖', '#98D8C8', 7),
('Decisões', 'Decisões arquiteturais', '🎯', '#F7DC6F', 8);
```

#### Hierarquia Visual

```
📚 Alexandria
├── 🔧 Infraestrutura
│   ├── Cloud (Alibaba, AWS)
│   ├── Containers (Docker)
│   └── Redes
├── 💻 Desenvolvimento
│   ├── Frontend (React, TS)
│   ├── Backend (Node, Python)
│   ├── Banco de Dados
│   └── APIs
├── 💼 Negócios
│   ├── Estratégia
│   ├── Vendas
│   └── Clientes
├── 📢 Marketing
│   ├── Campanhas
│   ├── Conteúdo
│   └── Ads
├── ⚙️ Operações
│   ├── POPs
│   ├── SLAs
│   └── Processos
├── 👥 Pessoal
│   ├── Cultura
│   └── Treinamento
├── 🤖 Agentes
│   ├── TOT
│   ├── Miguel
│   ├── Liz
│   └── Jarvis
└── 🎯 Decisões
    ├── Arquiteturais
    ├── Negócio
    └── Tecnologia
```

---

### 3. TABELA DE LOGS: `giles_consultas`

Registra **todas as consultas** para análise e melhoria.

```sql
CREATE TABLE giles_consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Query
    query_text TEXT NOT NULL,
    query_embedding VECTOR(1536),
    
    -- Contexto
    agente TEXT NOT NULL,  -- 'TOT', 'Manus', 'Miguel'
    sessao_id TEXT,
    
    -- Resultados
    resultados JSONB,  -- Array de IDs retornados
    tempo_resposta_ms INTEGER,
    total_resultados INTEGER,
    
    -- Feedback
    avaliacao INTEGER,  -- 1-5
    feedback_text TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. TABELA DE SINÔNIMOS: `giles_sinonimos`

Mapeia **termos equivalentes** para melhorar busca.

```sql
CREATE TABLE giles_sinonimos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termo_principal TEXT NOT NULL,
    sinonimos TEXT[] NOT NULL,
    dominio TEXT REFERENCES giles_dominios(nome),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exemplos
INSERT INTO giles_sinonimos (termo_principal, sinonimos, dominio) VALUES
('Supabase', '{"supa", "sb", "postgres"}', 'Desenvolvimento'),
('TOT', '{"Toth", "Totum", "Orquestrador"}', 'Agentes'),
('Docker', '{"container", "contêiner"}', 'Infraestrutura');
```

---

## 🔍 FUNÇÕES RPC (API)

### Busca Híbrida (Vetorial + Full-Text)

```sql
CREATE OR REPLACE FUNCTION giles_hybrid_search(
    query_embedding VECTOR(1536),
    query_text TEXT,
    match_count INTEGER DEFAULT 5,
    match_threshold DECIMAL DEFAULT 0.7,
    full_text_weight DECIMAL DEFAULT 0.3,
    semantic_weight DECIMAL DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    chunk_id TEXT,
    content TEXT,
    dominio TEXT,
    categoria TEXT,
    tags TEXT[],
    autor TEXT,
    created_at TIMESTAMPTZ,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH semantic_search AS (
        SELECT 
            k.id,
            k.chunk_id,
            k.content,
            k.dominio,
            k.categoria,
            k.tags,
            k.autor,
            k.created_at,
            1 - (k.embedding <=> query_embedding) AS similarity
        FROM giles_knowledge k
        WHERE 1 - (k.embedding <=> query_embedding) > match_threshold
    ),
    full_text_search AS (
        SELECT 
            k.id,
            k.chunk_id,
            k.content,
            k.dominio,
            k.categoria,
            k.tags,
            k.autor,
            k.created_at,
            ts_rank(to_tsvector('portuguese', k.content), plainto_tsquery('portuguese', query_text)) AS rank
        FROM giles_knowledge k
        WHERE to_tsvector('portuguese', k.content) @@ plainto_tsquery('portuguese', query_text)
    )
    SELECT 
        COALESCE(s.id, f.id) AS id,
        COALESCE(s.chunk_id, f.chunk_id) AS chunk_id,
        COALESCE(s.content, f.content) AS content,
        COALESCE(s.dominio, f.dominio) AS dominio,
        COALESCE(s.categoria, f.categoria) AS categoria,
        COALESCE(s.tags, f.tags) AS tags,
        COALESCE(s.autor, f.autor) AS autor,
        COALESCE(s.created_at, f.created_at) AS created_at,
        COALESCE(s.similarity * semantic_weight, 0) + 
        COALESCE(f.rank * full_text_weight, 0) AS similarity
    FROM semantic_search s
    FULL OUTER JOIN full_text_search f ON s.id = f.id
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

### Busca por Domínio

```sql
CREATE OR REPLACE FUNCTION giles_search_by_domain(
    query_embedding VECTOR(1536),
    target_dominio TEXT,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    chunk_id TEXT,
    content TEXT,
    categoria TEXT,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.chunk_id,
        k.content,
        k.categoria,
        1 - (k.embedding <=> query_embedding) AS similarity
    FROM giles_knowledge k
    WHERE k.dominio = target_dominio
    AND 1 - (k.embedding <=> query_embedding) > 0.5
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

### Busca por Tags

```sql
CREATE OR REPLACE FUNCTION giles_search_by_tags(
    target_tags TEXT[],
    match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    chunk_id TEXT,
    content TEXT,
    dominio TEXT,
    tags TEXT[],
    match_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        k.id,
        k.chunk_id,
        k.content,
        k.dominio,
        k.tags,
        cardinality(k.tags & target_tags) AS match_count
    FROM giles_knowledge k
    WHERE k.tags && target_tags
    ORDER BY match_count DESC, k.created_at DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔗 ACESSO POR CONTEXTO

### TOT (Alibaba Cloud)

```javascript
// Cliente Supabase para TOT
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY  // anon key
);

// TOT consulta antes de decidir
async function consultarDecisao(contexto) {
    const { data, error } = await supabase.rpc('giles_hybrid_search', {
        query_embedding: await gerarEmbedding(contexto),
        query_text: contexto,
        match_count: 3
    });
    return data;
}

// TOT persiste decisões
async function persistirDecisao(decisao) {
    await supabase.from('giles_knowledge').insert({
        chunk_id: `dec_${Date.now()}`,
        content: decisao.descricao,
        embedding: await gerarEmbedding(decisao.descricao),
        dominio: 'Decisoes',
        categoria: decisao.tipo,
        tags: decisao.tags,
        autor: 'TOT'
    });
}
```

### Stark (VPS Futuro)

```python
# Cliente Python para Stark
from supabase import create_client

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Stark consulta configurações
def get_configuracao(chave):
    result = supabase.rpc('giles_search_by_tags', {
        'target_tags': [chave, 'config'],
        'match_count': 1
    }).execute()
    return result.data

# Stark loga execuções
def log_execucao(script, status):
    supabase.table('giles_consultas').insert({
        'query_text': f'Execução: {script}',
        'agente': 'Stark',
        'resultados': {'status': status}
    }).execute()
```

### Manus (Windows Local)

```javascript
// Manus consulta patterns de código
async function getCodePattern(tipo) {
    const { data } = await supabase.rpc('giles_search_by_domain', {
        query_embedding: await embed(tipo),
        target_dominio: 'Desenvolvimento',
        match_count: 3
    });
    return data;
}
```

---

## 📊 INDICADORES E MÉTRICAS

### Views para Dashboard

```sql
-- Conhecimento por domínio
CREATE VIEW v_conhecimento_por_dominio AS
SELECT 
    d.nome AS dominio,
    d.icone,
    COUNT(k.id) AS total_chunks,
    MAX(k.created_at) AS ultima_atualizacao
FROM giles_dominios d
LEFT JOIN giles_knowledge k ON d.nome = k.dominio
GROUP BY d.nome, d.icone
ORDER BY total_chunks DESC;

-- Consultas recentes
CREATE VIEW v_consultas_recentes AS
SELECT 
    agente,
    COUNT(*) AS total_consultas,
    AVG(tempo_resposta_ms) AS tempo_medio,
    AVG(avaliacao) AS avaliacao_media
FROM giles_consultas
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY agente;

-- Autores mais ativos
CREATE VIEW v_autores_ativos AS
SELECT 
    autor,
    COUNT(*) AS total_contribuicoes,
    COUNT(DISTINCT dominio) AS dominios
FROM giles_knowledge
GROUP BY autor
ORDER BY total_contribuicoes DESC;
```

### Métricas de Saúde

| Métrica | Meta | Alerta |
|---------|------|--------|
| Tempo médio de busca | < 500ms | > 1s |
| Taxa de resultados | > 80% | < 60% |
| Conhecimento novo/semana | > 20 chunks | < 10 |
| Consultas/dia | > 50 | < 20 |

---

## 🔄 FLUXO DE SINCRONIZAÇÃO

### 1. Ingestão (Agente → Supabase)

```
Agente (TOT/Manus/Stark)
         ↓
[1] Extrair metadados
[2] Gerar embedding
[3] INSERT giles_knowledge
         ↓
Supabase (commit imediato)
```

### 2. Consulta (Agente ← Supabase)

```
Agente precisa de contexto
         ↓
[1] Gerar embedding da query
[2] CALL giles_hybrid_search()
         ↓
Supabase retorna resultados
         ↓
[3] Agente sintetiza resposta
[4] LOG em giles_consultas
```

### 3. Backup (Supabase → Destinos)

```
Supabase (primário)
    ↓ (diário)
Export JSON
    ↓
┌─────────────┬─────────────┬─────────────┐
│   GitHub    │ Google Drive│   Local     │
│(versionado) │  (humanos)  │  (backup)   │
└─────────────┴─────────────┴─────────────┘
```

---

## 📝 CONVENÇÕES DE NOMENCLATURA

### Chunk IDs

```
Formato: [tipo]_[YYYYMMDD]_[HHMMSS]_[hash]

Tipos:
- ctx_  → Contexto de conversa
- pop_  → Protocolo Operacional
- dec_  → Decisão
- doc_  → Documentação
- mem_  → Memória
- cfg_  → Configuração

Exemplos:
- ctx_20260405_143022_a3f8b2
- dec_20260405_143500_api_v2
- pop_001_criacao_agentes
```

### Tags

```
#dominio       → #desenvolvimento, #infraestrutura
#tipo          → #decisao, #contexto, #memoria
#status        → #aprovado, #pendente, #arquivado
#agente        → #tot, #miguel, #liz, #jarvis
#urgencia      → #urgente, #normal, #baixa
```

---

## 🚀 IMPLEMENTAÇÃO PASSO A PASSO

### Fase 1: Setup (Semana 1)

- [ ] Criar tabelas no Supabase
- [ ] Configurar pgvector
- [ ] Criar funções RPC
- [ ] Inserir domínios base

### Fase 2: Migração (Semana 2)

- [ ] Exportar documentos Markdown
- [ ] Chunking inteligente
- [ ] Gerar embeddings
- [ ] Inserir dados históricos

### Fase 3: Integração (Semana 3)

- [ ] Atualizar giles-client-supabase.js
- [ ] Testar queries
- [ ] Configurar logging
- [ ] Criar dashboard

### Fase 4: Produção (Semana 4)

- [ ] TOT usar em produção
- [ ] Monitorar métricas
- [ ] Ajustar thresholds
- [ ] Documentar uso

---

## 📁 ARQUIVOS RELACIONADOS

| Arquivo | Descrição |
|---------|-----------|
| `agents/giles/ARQUITETURA.md` | Arquitetura completa do Giles |
| `agents/giles/giles_schema_supabase.sql` | Schema SQL completo |
| `agents/giles/giles-client-supabase.js` | Cliente JavaScript |
| `apps/alexandria/README.md` | Visão geral da Alexandria |
| `INDEX.md` | Navegação do workspace |

---

*Estrutura Alexandria v1.0*  
*Hub Central: Supabase (PostgreSQL + pgvector)*  
*Mantido por: GILES 🧙‍♂️*  
*Status: 🟢 Especificação Completa — Pronto para Implementação*
