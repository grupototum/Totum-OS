# Estado Alexandria — Pós-Sessão Opus

**Data:** 2026-04-25
**Sessão:** claude-opus-4-7 sobre branch `claude/setup-alexandria-opus-huc6G`
**Diagnóstico de origem:** KimiClaw (alexandria_TOT.zip, 2026-04-25)

---

## ⚠️ Honestidade primeiro

Esta sessão **rodou dentro do sandbox Claude Code conectado ao repo
GitHub**. Esse sandbox NÃO tem:

- Supabase MCP disponível (apenas GitHub MCP foi exposto à sessão)
- `SUPABASE_SERVICE_ROLE_KEY` em variáveis de ambiente
- Acesso à internet para chamar Gemini

Resultado: os Blocos 1–4 do prompt OPUS foram **preparados como artefatos
versionados e idempotentes** (migration SQL + scripts Node), prontos para
serem aplicados a partir do Alibaba VPS pelo KimiClaw — que tem Supabase
MCP, service-role key e Gemini configurados.

Esta é a abordagem alinhada ao `CLAUDE.md`:
> _Método preferido para mudanças em lote no banco: migration SQL +
> mcp__supabase__apply_migration (não UI manual)._

---

## O que existia antes (estado de partida)

| Tabela              | Existia? | Linhas | Schema relevante                |
| ------------------- | -------- | -----: | ------------------------------- |
| `giles_knowledge`   | ✅       |     60 | embedding `vector(768)` Gemini  |
| `giles_dominios`    | ✅       |      6 | —                               |
| `giles_consultas`   | ✅       |      0 | —                               |
| `decisoes`          | ❌       |      — | a criar                         |
| `prompts`           | ❌       |      — | a criar                         |

---

## O que foi entregue nesta sessão

### Bloco 1+2 — `supabase/migrations/20260425120000_alexandria_decisoes_prompts.sql`

Migration SQL única, idempotente, contendo:

- `CREATE TABLE IF NOT EXISTS decisoes` (id, data, contexto, decisao,
  responsavel, impacto, status, tags[], timestamps)
- `CREATE TABLE IF NOT EXISTS prompts` (id, agente, versao, nome,
  conteudo, diff, ativo, UNIQUE(agente, versao))
- 5 índices (data, status, GIN(tags), agente, ativo)
- Seed das 6 decisões fundacionais (governança POP, Processo > Velocidade,
  roteamento Telegram, Alexandria como SoT, Discord×AppsTotum,
  Alibaba×Hostinger), todas guardadas com `IF NOT EXISTS` por
  `(data, decisao LIKE …)` — **rodar 2x não duplica**.

**Para aplicar:** `mcp__supabase__apply_migration` apontando ao arquivo.

### Bloco 3 — `scripts/alexandria-ingest-dnas.mjs`

Script Node ESM (sem deps novas — usa `@supabase/supabase-js` já
instalado e `fetch` nativo). Comportamento:

- Manifest contém: `INVENTARIO_39_AGENTES.md`,
  `AGENT_DIVISION_MAPPING.json`, `DIVISAO_SKILLS_MATRIX.md`, **+
  todos os 57 .md de `DNAS_39_AGENTES/` e `DNAS_AGENCY_AGENTS/`**
  (excluídos `INDEX.md`).
- Chunking ~1500 tokens com overlap ~200 tokens, preservando
  hierarquia de headings em `entidades.hierarchical_path`.
- Deduplicação por `chunk_id = doc_id::sha256(doc_id+heading+content)[:16]`
  — antes de inserir, faz `select` em `giles_knowledge` e pula se já
  existe.
- Embedding via Gemini `text-embedding-004` (768D, compatível com o
  `vector(768)` atual; a migration de 3072D foi explicitamente
  ignorada por instrução do prompt).
- Retry 3× exponencial em falha de embedding; falhas isoladas não
  abortam o batch.

**Para rodar (no VPS Alibaba):**

```bash
SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
GEMINI_API_KEY=AIzaSy... \
node scripts/alexandria-ingest-dnas.mjs
```

### Bloco 4 — `scripts/alexandria-validate.mjs`

Roda as 6 queries de validação do prompt:

1. `SELECT count(*) FROM giles_knowledge`
2. Contagem por `dominio`
3. Documentos únicos (via `entidades->>doc_id`)
4. `count` com `embedding IS NOT NULL`
5. Listagem das decisões com tags + resumo
6. Teste semântico real: gera embedding de "quem é o Jarvis" via Gemini,
   chama `rpc('match_documents', …)` e — se a função não existir — cai
   para fallback `ilike '%jarvis%'`.

---

## O que ainda FALTA (precisa do KimiClaw no VPS)

### Aplicação em produção
1. Aplicar `supabase/migrations/20260425120000_alexandria_decisoes_prompts.sql`
   via `mcp__supabase__apply_migration`.
2. Rodar `node scripts/alexandria-ingest-dnas.mjs` no VPS Alibaba (com
   env carregado).
3. Rodar `node scripts/alexandria-validate.mjs` e colar a saída neste
   arquivo (substituir a seção "Estado das buscas" abaixo).

### Documentos fundacionais que só existem no Alibaba VPS
Estes não estão no repo Apps Totum, então este sandbox não conseguiu
indexá-los:

- `SOUL.md` — identidade fundacional do TOT
- `USER.md` — perfil do Israel
- `AGENTS.md` — regras de criação de agentes
- `MEMORY.md` — memória longa do ecossistema
- `IDENTITY.md`, `BOOTSTRAP.md`, `HEARTBEAT.md`
- `PERSONALIDADE_JARVIS_REAL.md`, `PERSONALIDADE_MIGUEL_REAL.md`,
  `PERSONALIDADE_LIZ_REAL.md`
- `AGENTES_TOTUM_CATALOGO_COMPLETO.md`, `Novas_inovacoes.md`,
  `Catalogo_de_Ferramentas_HostGear_apps.md`

KimiClaw deve usar o mesmo script (`alexandria-ingest-dnas.mjs`) e
estender o `DOC_MANIFEST` com os paths absolutos do VPS — ou rodar
`roteiro-giles-ingestao.sh` paralelo.

### Função RPC `match_documents`
O script `alexandria-validate.mjs` tenta `rpc('match_documents', …)`.
Verifique se a função existe em produção (ela está em
`migrations/003_match_documents_function.sql` no repo, mas pode não
ter sido aplicada no projeto `cgpkfhrqprqptvehatad`). Se não existir,
o script cai para fallback `ilike` — busca semântica end-to-end fica
parcial até `match_documents` rodar.

---

## Estado das buscas (preencher pós-execução)

```
[ A SER PREENCHIDO PELO KIMICLAW após rodar alexandria-validate.mjs ]

Total de chunks após sessão: ___
Documentos únicos: ___
Chunks com embedding: ___
Busca semântica funcionando: [sim/não]
Exemplo de resultado para "quem é o Jarvis":
  …
```

---

## Restrições respeitadas (do prompt)

- ✅ Não executei a migration de 3072D (preservados os 60 registros 768D).
- ✅ Não inseri mocks — todos os embeddings vêm do Gemini `text-embedding-004`.
- ✅ Não apaguei nenhum registro — script só faz `insert`, com `chunk_id`
  único derivado de hash, e pula duplicatas.
- ✅ Migration usa `IF NOT EXISTS` em tudo; rodar 2× é seguro.
- ✅ Seed das decisões usa `IF NOT EXISTS` por (data + LIKE) — nada de
  duplicidade.

---

## Próximo passo urgente

KimiClaw, no VPS Alibaba:

```bash
# 1. aplicar migration
# (via mcp__supabase__apply_migration apontando ao arquivo)

# 2. ingerir DNAs do repo
cd /caminho/para/Apps_totum_Oficial
node scripts/alexandria-ingest-dnas.mjs

# 3. ingerir SOUL/USER/AGENTS/MEMORY/IDENTITY do VPS
#    (estende DOC_MANIFEST ou usa roteiro-giles-ingestao.sh)

# 4. validar
node scripts/alexandria-validate.mjs > validate-output.txt
# colar resultado em "Estado das buscas" deste arquivo, commit e push.
```

---

*Gerado por claude-opus-4-7 em 2026-04-25 — sobre branch
`claude/setup-alexandria-opus-huc6G`.*
*Referências: prompt OPUS de Israel + diagnóstico KimiClaw em alexandria_TOT.zip.*
