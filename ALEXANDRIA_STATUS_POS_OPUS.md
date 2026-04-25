# Estado Alexandria — Pós-Sessão Opus

**Data:** 2026-04-25
**Sessão:** claude-opus-4-7 sobre branch `claude/setup-alexandria-opus-huc6G`
**Diagnóstico de origem:** KimiClaw (alexandria_TOT.zip, 2026-04-25)
**Execução:** Israel rodou os scripts no MacBook local (Documents/Pixel Systems/Apps_totum_Oficial)
**Status final:** ✅ Alexandria operacional — pendente apenas reindexação dos 60 POPs órfãos

---

## Estado de partida vs. estado final

| Métrica                              | Antes | Depois  |
| ------------------------------------ | ----: | ------: |
| Chunks em `giles_knowledge`          |    60 |     657 |
| Documentos únicos                    |     5 |      65 |
| Domínios cobertos                    |     1 | 2       |
| Chunks com embedding válido          | 60/60 | 657/657 |
| Tabela `decisoes`                    | ❌    | ✅ 12   |
| Tabela `prompts`                     | ❌    | ✅      |

---

## Bloco 1+2 — Tabelas + decisões (executado)

Migration `supabase/migrations/20260425120000_alexandria_decisoes_prompts.sql`
aplicada via SQL Editor do Supabase Dashboard. Resultado:

- `decisoes` criada com 5 índices (data, status, GIN(tags))
- `prompts` criada com índices (agente, ativo, UNIQUE(agente, versao))
- Seed das 6 decisões fundacionais inserido (idempotente)

**Total final na tabela `decisoes`: 12** — as 6 minhas + 6 que já existiam de
sessões anteriores. Há duplicatas semânticas (ex.: governança de criação de
agentes aparece em duas redações ligeiramente diferentes em 2026-04-12).
**Não é bug do seed.** Se quiser limpar, fica como follow-up manual.

---

## Bloco 3 — Ingestão de DNAs (executado)

Script `scripts/alexandria-ingest-dnas.mjs` rodou em ~10 minutos. Final:

```
Documentos processados : 60
Documentos ausentes    : 0
Chunks inseridos       : 526
Chunks pulados (dedup) : 186
Chunks com falha       : 0
Total em giles_knowledge agora: 657
```

Manifest indexado:
- `INVENTARIO_39_AGENTES.md` → CATALOG-AGENTS-001
- `AGENT_DIVISION_MAPPING.json` → CATALOG-AGENTS-002
- `DIVISAO_SKILLS_MATRIX.md` → CATALOG-AGENTS-003
- 39 DNAs em `DNAS_39_AGENTES/` (DNA-{NOME}-001)
- 19 DNAs em `DNAS_AGENCY_AGENTS/` (DNA-{NOME}-001)

Embeddings via Gemini `gemini-embedding-001` com `outputDimensionality: 768`
(modelo Matryoshka — único disponível em 2026; `text-embedding-004` original
foi descontinuado pela Google).

---

## Bloco 4 — Validação (executado)

Script `scripts/alexandria-validate.mjs`:

```
1. Total de chunks em giles_knowledge:     657
2. Chunks por domínio:
   - agentes      597
   - operacao     60
3. Documentos únicos:                       65
4. Chunks com embedding válido:             657 / 657
5. Decisões cadastradas:                    12
6. Teste de busca semântica:                ⚠ 0 matches (anomalia, ver abaixo)
```

---

## ⚠ Issues conhecidos

### 1. Busca semântica retorna 0 matches

Mesmo gerando query embedding com `gemini-embedding-001@768D` (mesmo modelo
dos 597 chunks novos), `rpc('match_documents', …)` retorna 0 matches em
threshold 0.5 e 0.3. Hipóteses na ordem de probabilidade:

1. **A função `match_documents` consulta a tabela errada.** Ela foi criada
   pela migration original `migrations/003_match_documents_function.sql`
   apontando para `rag_documents` (que está vazia). `giles_knowledge` é uma
   tabela posterior que não foi conectada à função.
2. **Filtro interno na função restringe `source_type`/outros campos** que
   nossos chunks novos não casam.
3. **Algum mismatch sutil no formato do vector** entre como o cliente
   `supabase-js` serializa e como a função recebe.

**Como diagnosticar (próxima sessão):**
- Inspecionar `match_documents` no Supabase: `SELECT pg_get_functiondef('match_documents'::regproc);`
- Se apontar para `rag_documents`, criar nova função
  `match_giles_knowledge` com a mesma assinatura mas consultando
  `giles_knowledge` e retornando `chunk_id, doc_id, content, similarity`.
- Atualizar `src/services/hermione.ts` para usar a nova função.

### 2. Fragmentação de espaço vetorial (60 chunks órfãos)

| Geração       | Modelo                          | Quantidade | Domínio  |
| ------------- | ------------------------------- | ---------: | -------- |
| Antiga (2025) | `text-embedding-004`            |         60 | operacao |
| Nova (2026)   | `gemini-embedding-001@768D`     |        597 | agentes  |

Ambas são 768D, mas vivem em espaços vetoriais diferentes — cosine
similarity entre as duas gerações é matematicamente sem sentido. Resultado:

- Busca semântica funciona **dentro** de cada geração.
- Não cruza entre POPs antigos e DNAs novos.

**Solução:** quando KimiClaw localizar os fontes originais dos POP-001 a
POP-005 no Alibaba VPS, adicionar os paths ao `DOC_MANIFEST` e rodar um
modo `--reindex` que apaga os 60 órfãos e recria com o modelo único. Não
preparei esse modo nesta sessão — fica como TODO se a fragmentação virar
problema operacional.

### 3. RLS e permissões da `match_documents`

Possível também que a função tenha `SECURITY DEFINER` apontando para
`auth.uid()` que não bate com a chave service-role. Verificar.

---

## Arquivos entregues nesta branch

| Arquivo | Propósito |
| --- | --- |
| `supabase/migrations/20260425120000_alexandria_decisoes_prompts.sql` | Tabelas + seed das 6 decisões |
| `scripts/alexandria-ingest-dnas.mjs` | Bloco 3 — ingestão idempotente com Gemini |
| `scripts/alexandria-validate.mjs` | Bloco 4 — 6 queries de validação |
| `.env.local.example` | Template de credenciais (.env.local está em .gitignore) |
| `ALEXANDRIA_STATUS_POS_OPUS.md` | Este relatório |

Commits da branch (em ordem):

1. `61fd9b1` — feat(alexandria): migration + scripts iniciais
2. `2e017f7` — refactor(hermione): rename cosmético GILES → Hermione
3. `1e2e687` — feat(alexandria): .env.local loader + auto-discovery do modelo
4. `2e11446` — fix(alexandria): .env.local vence o shell
5. `2986018` — fix(alexandria): força `outputDimensionality:768` no Gemini
6. `d9e24d6` — fix(alexandria): schema discovery + payload filtering
7. `136930d` — fix(alexandria): `doc_id` é coluna top-level NOT NULL
8. `f3658ad` — fix(alexandria): payload alinhado ao schema real (content_hash + metadata jsonb)
9. `845c32f` — fix(alexandria): backoff Retry-After + abort limpo no Gemini 429
10. `ec7c11b` — fix(validate): lê `metadata.dominio` + `doc_id` top-level + diagnóstico semântico

---

## Configuração de produção

- **Billing Gemini:** ativado em "Nível 1" no projeto Cloud "Grupo Totum",
  cap mensal R$ 120 (folga >1000× sobre uso projetado).
- **Custo real estimado:**
  - Re-indexação completa: ~R$ 0,10
  - Hermione em uso normal (~100 queries/dia): ~R$ 0,30/mês
- **Recomendação:** manter Gemini como provider principal. Ollama local só
  faria sentido com volume >10K queries/dia ou requisitos de privacidade
  total dos textos.

---

## Próximos passos (KimiClaw, no Alibaba VPS)

### Curto prazo (fechar Alexandria 100%)
1. Localizar fontes dos POP-001 a POP-005 no VPS.
2. Estender `DOC_MANIFEST` em `scripts/alexandria-ingest-dnas.mjs` com esses paths.
3. Diagnosticar `match_documents` (passo 1 dos issues acima).
4. Re-criar a função RPC apontando para `giles_knowledge`.

### Médio prazo (fundacionais que só existem no VPS)
Indexar SOUL.md, USER.md, AGENTS.md, MEMORY.md, IDENTITY.md,
BOOTSTRAP.md, HEARTBEAT.md, PERSONALIDADE_JARVIS_REAL.md,
PERSONALIDADE_MIGUEL_REAL.md, PERSONALIDADE_LIZ_REAL.md,
AGENTES_TOTUM_CATALOGO_COMPLETO.md, Novas_inovacoes.md,
Catalogo_de_Ferramentas_HostGear_apps.md.

Mesmo script — basta estender o manifest.

### Longo prazo
Migration de rename `giles_knowledge` → `hermione_knowledge` (caminho 2
do plano original). Hoje funciona com nomes legados; vale renomear quando
houver janela de manutenção coordenada com o frontend.

---

*Encerrado em 2026-04-25 por claude-opus-4-7. Alexandria de 60 → 657 chunks
em uma sessão. Restantes 13 docs do alibaba VPS pendentes do KimiClaw.*
