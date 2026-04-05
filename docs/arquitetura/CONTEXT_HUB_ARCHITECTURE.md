# 🧠 CENTRAL DE CONTEXTO TOTUM
## Sistema Universal de Contexto para IAs

---

## 📋 Visão Geral

A Central de Contexto Totum é um **hub unificado** onde todas as IAs do ecossistema (Kimi, OpenClaw, Bot Atendente, agentes futuros) podem **armazenar, buscar e compartilhar contexto** de forma inteligente.

### Objetivos
1. **Consistência**: Todas as IAs acessam o mesmo contexto
2. **Indexação inteligente**: Busca semântica rápida
3. **Agentes de recuperação**: Especialistas em encontrar contexto relevante
4. **Escalabilidade**: Suporta dezenas de agentes simultâneos

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    CENTRAL DE CONTEXTO TOTUM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Kimi Claw  │  │Bot Atendente │  │  Agentes     │           │
│  │  (Você aqui) │  │  Telegram    │  │  Futuros     │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  API Layer  │ ← REST/WebSocket              │
│                    │   (FastAPI) │   Autenticação JWT            │
│                    └──────┬──────┘                              │
│                           │                                     │
│         ┌─────────────────┼─────────────────┐                   │
│         │                 │                 │                   │
│    ┌────▼────┐     ┌─────▼─────┐     ┌─────▼─────┐              │
│    │ Ingestão│     │  Consulta │     │  Agente   │              │
│    │ Pipeline│     │  Semântica│     │  Curador  │              │
│    └────┬────┘     └─────┬─────┘     └─────┬─────┘              │
│         │                │                 │                    │
│    ┌────▼────────────────▼─────────────────▼────┐               │
│    │              VECTOR STORE                    │              │
│    │    (ChromaDB / Pinecone / Qdrant)          │              │
│    │                                            │              │
│    │  • Contexto Conversacional                 │              │
│    │  • Documentos/Arquivos                     │              │
│    │  • Base de Conhecimento                    │              │
│    │  • Memórias de Projetos                    │              │
│    │  • Preferências do Usuário                │              │
│    └────────────────────────────────────────────┘               │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  Metadata   │                              │
│                    │   Store     │ ← SQLite/PostgreSQL         │
│                    │  (Índices)  │   Tags, categorias, datas   │
│                    └─────────────┘                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Componentes

### 1. **API Layer (FastAPI)**
Ponto de entrada para todas as IAs.

```python
# Endpoints principais
POST   /v1/context/store      # Armazenar contexto
GET    /v1/context/retrieve   # Buscar contexto
POST   /v1/context/query      # Query semântica
POST   /v1/context/ingest     # Ingestão de documentos
GET    /v1/context/agent      # Consulta via Agente Curador
```

### 2. **Vector Store (ChromaDB)**
Armazena embeddings para busca semântica.

```python
# Coleções principais
- "conversas"         # Histórico de conversas
- "documentos"        # PDFs, DOCXs, etc.
- "conhecimento"      # Base de conhecimento estruturada
- "projetos"          # Memórias de projetos
- "preferencias"      # Preferências do usuário
```

### 3. **Metadata Store (SQLite)**
Índices e metadados para busca rápida.

```sql
-- Tabelas principais
context_entries      # Entradas de contexto
context_tags         # Tags para categorização
context_relations    # Relacionamentos entre contextos
agent_queries        # Histórico de consultas
```

### 4. **Agente Curador**
Agente especializado em recuperar o contexto certo.

```
Funções:
- Analisar a query do usuário
- Buscar contexto relevante no vector store
- Filtrar e ranquear resultados
- Sintetizar resposta contextualizada
- Aprender com feedback
```

---

## 🔧 Especificação Técnica

### Stack Tecnológico

| Componente | Tecnologia | Motivo |
|------------|------------|--------|
| API | FastAPI | Rápido, async, fácil |
| Vector DB | ChromaDB | Leve, local, SQLite-like |
| Embeddings | sentence-transformers | Offline, multilíngue |
| Metadata | SQLite | Zero-config, portátil |
| Cache | Redis (opcional) | Performance |
| Auth | JWT | Simples, seguro |

### Modelo de Dados

```python
class ContextEntry(BaseModel):
    id: str                    # UUID
    source: str               # Origem (kimi, bot, agente_x)
    type: ContextType         # Tipo (conversa, doc, memory)
    content: str              # Conteúdo textual
    embedding: List[float]    # Vetor de embedding
    metadata: Dict            # Metadados flexíveis
    tags: List[str]           # Tags para indexação
    created_at: datetime
    expires_at: Optional[datetime]  # TTL opcional
    importance: int           # 1-5 para prioridade

class ContextQuery(BaseModel):
    query: str                # Query do usuário
    source: str               # Qual IA está perguntando
    context_type: Optional[str]  # Filtrar por tipo
    limit: int = 5            # Quantos resultados
    min_relevance: float = 0.7  # Score mínimo
```

---

## 🚀 Casos de Uso

### 1. **Conversas Contínuas**
```
Kimi: "O usuário perguntou sobre projeto X ontem"
→ Busca no contexto → Recupera detalhes
→ Resposta contextualizada
```

### 2. **Conhecimento Compartilhado**
```
Bot Atendente: "Cliente perguntou sobre preço"
→ Busca na base de conhecimento
→ Encontra preços atualizados
→ Responde com dados corretos
```

### 3. **Agente Curador**
```
Usuário: "Resume o que discutimos sobre marketing"
→ Agente analisa query
→ Busca em múltiplas coleções
→ Sintetiza resumo completo
```

### 4. **Cross-IA Memory**
```
Kimi: "Lembrei que o usuário prefere relatórios em PDF"
→ Armazena preferência
→ Bot Atendente usa a mesma info depois
→ Consistência entre IAs
```

---

## 📁 Estrutura de Arquivos

```
context_hub/
├── api/
│   ├── main.py              # FastAPI app
│   ├── auth.py              # JWT authentication
│   └── routers/
│       ├── context.py       # CRUD de contexto
│       ├── query.py         # Busca semântica
│       └── agent.py         # Endpoints do Agente
├── core/
│   ├── vector_store.py      # ChromaDB wrapper
│   ├── embeddings.py        # Gerador de embeddings
│   └── curator_agent.py     # Agente de recuperação
├── models/
│   ├── schemas.py           # Pydantic models
│   └── database.py          # SQLite models
├── ingest/
│   ├── pipeline.py          # Pipeline de ingestão
│   └── processors/          # Processadores (PDF, MD, etc)
├── config/
│   └── settings.py          # Configurações
├── data/
│   ├── chromadb/            # Vector store
│   └── metadata.db          # SQLite
├── tests/
│   └── test_*.py
├── requirements.txt
└── docker-compose.yml       # Opcional
```

---

## 🔌 Integração com IAs Existentes

### OpenClaw / Kimi Claw
```python
# Plugin para OpenClaw
from context_hub import ContextClient

context = ContextClient(api_key="...")

# Antes de responder
relevant_context = context.query(
    query=user_message,
    source="kimi-claw",
    limit=3
)

# Gerar resposta com contexto
response = llm.generate(prompt, context=relevant_context)

# Armazenar conversa
context.store(
    content=user_message,
    source="kimi-claw",
    type="conversation",
    tags=["user_query", "topic_x"]
)
```

### Bot Atendente Telegram
```python
# Integração no bot
from context_hub import ContextClient

context = ContextClient(api_key="...")

@trace_llm
def processar_duvida(update, context_telegram):
    # Buscar contexto relevante
    ctx = context.query(
        query=update.message.text,
        source="bot-atendente",
        context_type="conhecimento"
    )
    
    # Usar contexto na resposta
    resposta = llm.generate(update.message.text, context=ctx)
    
    # Armazenar interação
    context.store(
        content=f"Q: {update.message.text}\nA: {resposta}",
        source="bot-atendente",
        type="conversation"
    )
```

---

## 🎯 Próximos Passos

### Fase 1: MVP (1-2 dias)
- [ ] Setup FastAPI + ChromaDB
- [ ] Endpoints básicos (store/retrieve)
- [ ] Integração com Kimi Claw
- [ ] Testes básicos

### Fase 2: Agente Curador (2-3 dias)
- [ ] Implementar agente de recuperação
- [ ] Sistema de ranking de relevância
- [ ] Feedback loop
- [ ] Integração com Bot Atendente

### Fase 3: Produção (3-5 dias)
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] Monitoramento
- [ ] Documentação completa

---

## 💡 Exemplo de Uso

```bash
# 1. Armazenar contexto
curl -X POST http://localhost:8000/v1/context/store \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Projeto Totum Apps usará React + tRPC",
    "source": "kimi-claw",
    "type": "project_memory",
    "tags": ["totum", "tech-stack", "react"],
    "importance": 5
  }'

# 2. Consultar contexto
curl -X POST http://localhost:8000/v1/context/query \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "Qual stack usar no Totum?",
    "source": "bot-atendente",
    "limit": 3
  }'

# 3. Usar Agente Curador
curl -X POST http://localhost:8000/v1/context/agent \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "Resuma tudo sobre o projeto Totum",
    "source": "kimi-claw"
  }'
```

---

## 🤔 Decisões de Design

### Por que ChromaDB?
- Leve (roda localmente)
- SQLite-like (familiar)
- Embeddings integrados
- Bom para prototipagem

### Por que FastAPI?
- Async nativo
- Documentação automática
- Fácil integração
- Performance

### Por que SQLite para metadados?
- Zero configuração
- Portátil
- Suficiente para MVP
- Fácil backup

---

*Documento de arquitetura - Central de Contexto Totum*
