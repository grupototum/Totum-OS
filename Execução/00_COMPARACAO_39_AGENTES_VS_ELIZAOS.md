# 🤖 COMPARAÇÃO: 39 Agentes Totum vs elizaOS

**Status**: Análise pré-implementação  
**Data**: 12 de Abril de 2026  
**Decisão**: Usar nossa lógica de criação (10 regras) com padrão elizaOS

---

## 📊 RESUMO EXECUTIVO

| Métrica | Totum | elizaOS | Decisão |
|---------|-------|---------|---------|
| **Foco** | Tiered (Lab/Mid/Fab) | Simplicidade | ✅ Mantém Tiered + elizaOS |
| **Configuração** | JSON customizado | Character File padrão | ✅ Adapter bidirecional |
| **Canais** | Multi-canal (Discord, Telegram, Email, n8n) | Plugável | ✅ Telegram MVP, extensível |
| **RAG** | Alexandria + vectorial | Knowledge plugin | ✅ Static cache MVP |
| **Criação** | 10 regras rigorosas | Menos estruturado | ✅ Mantém nossas 10 regras |
| **Documentação** | 7 arquivos por agente | Character File só | ✅ 7 + Character File exportável |

---

## 🎯 ANÁLISE: 39 Agentes Mapeados

### **NÍVEL 1: LABORATÓRIO (Premium — Claude/Gemini)**
Agentes estratégicos, decisões complexas, custom prompts

#### ✅ Totalmente Compatível com elizaOS

| # | Agente | Função | Tier | Canal | Status | Nota elizaOS |
|---|--------|--------|------|-------|--------|--------------|
| 1 | **LOKI** | CRM + Vendas | 1 | Telegram/Slack | Prioridade | modelProvider: claude, clients: [telegram] |
| 2 | **MINERVA** | Análise estratégica | 1 | Email | Em Construção | knowledge: Alexandria docs |
| 3 | **ARCHIMEDES** | Inovação + brainstorm | 1 | Discord | Planejado | systemPrompts: múltiplas variações |
| 4 | **SHERLOCK** | Investigação profunda | 1 | Telegram | Planejado | knowledge: pesquisa histórica |
| 5 | **EINSTEIN** | Física/Engenharia | 1 | Discord | Planejado | knowledge: fórmulas, artigos |

**elizaOS Mapping**:
```typescript
{
  name: "LOKI",
  bio: "Especialista em vendas e CRM",
  system: "Você é LOKI, expert em conversão e relacionamento...",
  modelProvider: "anthropic",
  models: ["claude-3-5-sonnet"],
  clients: ["telegram"],
  knowledge: ["alexandria:crm-docs", "alexandria:sales-training"],
  settings: { tier: 1, temperature: 0.7, max_tokens: 4000 }
}
```

---

### **NÍVEL 2: FÁBRICA TÁTICA (Mid-tier — Groq Free, OxyB)**
Execução constante, conteúdo, otimização

#### ✅ Totalmente Compatível com elizaOS

| # | Agente | Função | Tier | Canal | Status | Nota elizaOS |
|---|--------|--------|------|-------|--------|--------------|
| 6 | **WANDA** | Social content | 2 | Twitter/TikTok | Ativo | clients: [twitter, tiktok] |
| 7 | **KVIRTUALOSO** | Geração de posts | 2 | Instagram | Ativo | style: post guidance |
| 8 | **SCRIVO** | Copywriting | 2 | Email | Ativo | lore: brand voice |
| 9 | **VISOU** | Design + Stable Diffusion | 2 | Telegram | Planejado | plugins: [stable-diffusion] |
| 10 | **AUDITOR** | BI + Analytics | 2 | Discord | Planejado | knowledge: data schemas |
| 11 | **PABLO** | Lead prospecting | 2 | LinkedIn API | Planejado | clients: [linkedin] |
| 12 | **ANALYST** | Dados + Relatórios | 2 | Telegram | Planejado | messageExamples: dados estruturados |
| 13 | **MENTOR** | Treinamento | 2 | Email | Planejado | lore: educational background |
| 14 | **GUARDIAN** | Monitoramento | 2 | Slack | Planejado | clients: [slack] |
| 15 | **TRANSLATOR** | Multi-idioma | 2 | API | Planejado | lore: polyglot |

**elizaOS Mapping Exemplo (WANDA)**:
```typescript
{
  name: "WANDA",
  bio: "Content creator especializada em redes sociais",
  style: {
    post: [
      "Use emojis estrategicamente",
      "Crie urgência sem ser agressivo",
      "Adapte tom para cada rede"
    ]
  },
  clients: ["twitter", "tiktok"],
  modelProvider: "groq",
  models: ["mixtral-8x7b"],
  settings: { tier: 2, temperature: 0.9, max_tokens: 2000 }
}
```

---

### **NÍVEL 3: FÁBRICA MECÂNICA (Local Ollama — Automação Overnight)**
Tarefas repetitivas, processamento em batch, zero custo

#### ✅ Totalmente Compatível com elizaOS

| # | Agente | Função | Tier | Canal | Status | Nota elizaOS |
|---|--------|--------|------|-------|--------|--------------|
| 16 | **SCRAPER-WEB** | Web scraping | 3 | n8n webhook | Planejado | clients: [webhook] |
| 17 | **PROCESSOR-CSV** | Processamento CSV | 3 | n8n | Planejado | skills: [extract, transform] |
| 18 | **MONITOR-NEWS** | Monitoramento notícias | 3 | n8n | Planejado | knowledge: news feeds |
| 19 | **SCHEDULER** | Agendamento | 3 | n8n | Planejado | clients: [n8n] |
| 20 | **VALIDATOR** | Validação de dados | 3 | n8n | Planejado | plugins: [validation] |
| 21 | **CLEANER** | Limpeza de dados | 3 | n8n | Planejado | skills: [normalize, dedupe] |
| 22 | **TAGGER** | Tagging automático | 3 | n8n | Planejado | skills: [classify, tag] |
| 23 | **FORMATTER** | Formatação de conteúdo | 3 | n8n | Planejado | skills: [format, convert] |
| 24 | **LOGGER** | Logging + monitoring | 3 | n8n | Planejado | clients: [webhook] |
| 25 | **RETRY-HANDLER** | Retry automático | 3 | n8n | Planejado | plugins: [error-handling] |

**elizaOS Mapping Exemplo (SCRAPER-WEB)**:
```typescript
{
  name: "SCRAPER-WEB",
  bio: "Extrator de dados web com parsing inteligente",
  system: "Você é um web scraper especializado em extrair dados estruturados...",
  modelProvider: "ollama",
  models: ["qwen3-coder"],
  clients: ["webhook"],  // Acionado por n8n via POST
  plugins: ["data-extraction"],
  settings: { tier: 3, temperature: 0.2, max_tokens: 1000 }
}
```

---

## 🔧 NOSSA LÓGICA DE CRIAÇÃO (10 REGRAS) APLICADA

Vamos manter nossas 10 regras, mas mapeadas para elizaOS Character File:

### **Regra 1: Definição de Papel (Role)**
```yaml
elizaOS mapping:
  name: [role name]
  bio: [role description]
  lore: [context/background]
  adjectives: [personality traits]
```

**Exemplo (LOKI)**:
```json
{
  "name": "LOKI",
  "bio": "Especialista em CRM e conversão de vendas com 15 anos de experiência",
  "lore": ["Trabalhou em startups SaaS", "Masterizado em Salesforce"],
  "adjectives": ["persuasivo", "analítico", "resultado-driven"]
}
```

---

### **Regra 2: Seleção de IA via Decision Tree**
```yaml
elizaOS mapping:
  tier: 1|2|3
  modelProvider: "anthropic"|"groq"|"ollama"
  models: [model names]
```

**Decision Tree**:
```
├─ Lab (1) → Claude/Gemini → Decisões estratégicas
│  └─ modelProvider: "anthropic"
│     models: ["claude-3-5-sonnet"]
│
├─ Mid (2) → Groq Free/OxyB → Execução constante
│  └─ modelProvider: "groq"
│     models: ["mixtral-8x7b"]
│
└─ Fab (3) → Ollama local → Automação mecânica
   └─ modelProvider: "ollama"
      models: ["qwen3-coder", "mistral"]
```

---

### **Regra 3: Documentação POP (8 componentes)**
Mantemos nossos 8 componentes, MAIS exporta como Character File:

```
/docs/agents/[agent-name]/
├── 01_DNA_DO_AGENTE.md          ← Role, persona, valores
├── 02_DECISION_TREE.md           ← Por que esse modelo/tier
├── 03_SYSTEM_PROMPT.md           ← System prompt completo
├── 04_CONTEXTO_ALEXANDRIA.md     ← Knowledge sources
├── 05_SKILLS_ATRIBUIDAS.md       ← Skills disponibilizadas
├── 06_CANAIS_CONFIGURADOS.md     ← Telegram, Discord, etc
├── 07_METRICAS_SUCESSO.md        ← KPIs esperados
├── 08_CHANGELOG.md               ← Versioning
└── character.json                ← Exportado via elizaOS Adapter
```

---

### **Regra 4: DNA Documentation**
```markdown
# DNA — LOKI (CRM Agent)

## Identidade
- **Rol**: Especialista em Vendas
- **Personalidade**: Confiante, analítico, result-driven
- **Background**: 15+ anos em SaaS

## Valores
- Conversão é tudo
- Dados guiam decisões
- Relacionamento é chave

## Voz & Tom
- Profissional mas acessível
- Baseado em dados
- Ação-orientado

[... mais detalhes na nossa lógica existente ...]
```

**elizaOS mapping**:
```json
{
  "system": "[Full system prompt with DNA embedded]",
  "adjectives": ["confiante", "analítico", "result-driven"],
  "lore": ["15+ anos em SaaS"],
  "bio": "[2-3 lines capturing DNA]"
}
```

---

### **Regra 5: Alexandria Integration**
```yaml
elizaOS mapping:
  knowledge: ["alexandria:doc-id-1", "alexandria:doc-id-2"]
  settings: { rag_mode: "static", knowledge_enabled: true }
```

**Exemplo**:
```json
{
  "knowledge": [
    "alexandria:sales-methodology",
    "alexandria:customer-profiles",
    "alexandria:conversion-tactics"
  ],
  "settings": {
    "rag_mode": "static",    // MVP: cache no prompt
    "knowledge_enabled": true,
    "knowledge_sources": ["doc-1", "doc-2", "doc-3"]
  }
}
```

---

### **Regra 6: Pre-Deploy Validation**
```bash
# Checklist antes de "publicar" agente
✓ Types compilam sem erro
✓ System prompt é válido (não tem injections)
✓ Model provider está acessível (Anthropic, Groq, Ollama)
✓ Canais estão configurados
✓ Knowledge sources existem no Alexandria
✓ Adapter converte sem erro
✓ Character JSON exporta válido
```

---

### **Regra 7: Claude Prompt Shortcuts**
```yaml
elizaOS mapping:
  # Usamos shortcuts para variações dinâmicas
  systemPrompts: [
    "/ghost - Responder sem explicações",
    "/god - Modo criativo total",
    "/ooda - Observe-Orient-Decide-Act",
    "/l99 - Law 99: 99 laws of power"
  ]
```

**Exemplo**:
```json
{
  "systemPrompts": [
    "Você é LOKI em modo padrão...",
    "Você é LOKI em modo /ghost (apenas ações)...",
    "Você é LOKI em modo /god (criatividade máxima)...",
    "Você é LOKI aplicando a Law 99..."
  ]
}
```

---

### **Regra 8: ABED Continuous Improvement**
```yaml
ABED = Assess-Benchmark-Experiment-Deploy
elizaOS mapping:
  settings:
    version: "1.0.0"
    last_updated: "2026-04-12"
    success_rate: 0.85
    avg_response_time_ms: 1250
```

**No banco Supabase**:
```sql
agent_executions(
  id, agent_id, status, execution_id,
  input TEXT, output JSONB,
  success BOOLEAN, response_time INT,
  created_at TIMESTAMP
)
```

---

### **Regra 9: 7 Arquivos Obrigatórios + Character File**
```
✓ DNA do Agente (DNA_DO_AGENTE.md)
✓ Decision Tree (DECISION_TREE.md)
✓ System Prompt (SYSTEM_PROMPT.md)
✓ Alexandria Context (CONTEXTO_ALEXANDRIA.md)
✓ Skills Atribuídas (SKILLS_ATRIBUIDAS.md)
✓ Canais Configurados (CANAIS_CONFIGURADOS.md)
✓ Métricas de Sucesso (METRICAS_SUCESSO.md)
✓ CHARACTER FILE (character.json) ← elizaOS standard
```

---

### **Regra 10: Hierarchy de Comunicação**
```
┌────────────────────────────────────────┐
│         Novo Agente Solicitado         │
│         (by Israel/Product)            │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│    1. Claude (Arquitetura)               │
│    - Revisão da proposta                 │
│    - DNA + Decision Tree                 │
│    - System prompt design                │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│    2. Israel (Validação)                 │
│    - Aprova DNA?                         │
│    - Aprova modelo/tier?                 │
│    - Aprova Alexandria connection?       │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│    3. Kimi Code (Implementação)          │
│    - Cria tabelas se preciso             │
│    - Cria Character File                 │
│    - Integra canais                      │
│    - Testa end-to-end                    │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│    4. Deploy (Apps Totum)                │
│    - Agente ativo                        │
│    - Monitoramento ligado                │
│    - ABED tracking                       │
└────────────────────────────────────────┘
```

---

## 📋 MAPEAMENTO COMPLETO: 39 → elizaOS

### Status por Agente

```markdown
## LABORATÓRIO (Tier 1) — 5 agentes

1. LOKI (CRM)             [PRONTO PARA CONVERTER]
2. MINERVA (Estratégia)   [PRONTO PARA CONVERTER]
3. ARCHIMEDES (Inovação)  [PRONTO PARA CONVERTER]
4. SHERLOCK (Investigação)[PRONTO PARA CONVERTER]
5. EINSTEIN (Engenharia)  [PRONTO PARA CONVERTER]

## FÁBRICA TÁTICA (Tier 2) — 10 agentes

6. WANDA (Social)         [PRONTO PARA CONVERTER]
7. KVIRTUALOSO (Posts)    [PRONTO PARA CONVERTER]
8. SCRIVO (Copy)          [PRONTO PARA CONVERTER]
9. VISOU (Design+SD)      [PRONTO PARA CONVERTER]
10. AUDITOR (BI)          [PRONTO PARA CONVERTER]
11. PABLO (LinkedIn)      [PRONTO PARA CONVERTER]
12. ANALYST (Data)        [PRONTO PARA CONVERTER]
13. MENTOR (Training)     [PRONTO PARA CONVERTER]
14. GUARDIAN (Monitor)    [PRONTO PARA CONVERTER]
15. TRANSLATOR (Multi)    [PRONTO PARA CONVERTER]

## FÁBRICA MECÂNICA (Tier 3) — 10 agentes

16. SCRAPER-WEB           [PRONTO PARA CONVERTER]
17. PROCESSOR-CSV         [PRONTO PARA CONVERTER]
18. MONITOR-NEWS          [PRONTO PARA CONVERTER]
19. SCHEDULER             [PRONTO PARA CONVERTER]
20. VALIDATOR             [PRONTO PARA CONVERTER]
21. CLEANER               [PRONTO PARA CONVERTER]
22. TAGGER                [PRONTO PARA CONVERTER]
23. FORMATTER             [PRONTO PARA CONVERTER]
24. LOGGER                [PRONTO PARA CONVERTER]
25. RETRY-HANDLER         [PRONTO PARA CONVERTER]

## ADICIONAR FUTUROS (Tier 1|2|3) — 14 agentes

26-39. [Definir conforme necessidade]
```

---

## ✅ CONCLUSÃO

**Nossa abordagem: "elizaOS + Nossa lógica de criação de agentes"**

```
┌─────────────────────────────────────────────────────┐
│            TOTUM AGENTS ELIZAOS HYBRID               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  elizaOS Character File  ← PADRÃO ABERTO            │
│         ↓                                            │
│  Adapter Pattern ← CONVERTE BIDIRECIONAL             │
│         ↓                                            │
│  Supabase agents_config ← NOSSO CONTROLE             │
│         ↓                                            │
│  10 Regras de Criação ← NOSSA QUALIDADE              │
│         ↓                                            │
│  7 Docs + Character.json ← DOCUMENTAÇÃO COMPLETA    │
│                                                     │
│  Result: Escalável, documentado, compatível        │
│          com elizaOS e com nossas melhores práticas │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Próximo**: Aguardar aprovação para começar com PASSO 1 (Claude Code)

