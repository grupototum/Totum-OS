# CLAUDE.md — Apps Totum

Guia de contexto persistente para o Claude Code quando abrir este repositório.

---

## Stack & convenções

- **Frontend:** React + Vite + TypeScript, Tailwind v3 (`darkMode: ["class"]`)
- **UI primitives:** shadcn/ui com `class-variance-authority` + `cn` (Radix slots)
- **Routing:** React Router DOM v6 (`BrowserRouter` em `src/App.tsx`)
- **State:** Zustand (ver `src/stores/*`)
- **Backend:** Supabase (projeto `cgpkfhrqprqptvehatad` — "Apps Totum", us-east-2)
- **Auth:** Supabase Auth + OAuth + RLS, rotas protegidas via `ProtectedRoute`
- **Testes:** Vitest + `@testing-library/react` (rodar `npm test -- --run`)
- **Build:** `npm run build` (Vite; PWA gerado via `generateSW`)
- **Preferência de pacote:** `npm` (há `package-lock.json`, não usar yarn/pnpm)

---

## Design System — editorial light-first

Rebrand consolidado no commit `f27c131e` (18/04/2026). Padrões:

- **Fonte:** Inter exclusivamente (sans/display/manrope → aliased a Inter)
- **Tokens:** CSS variables em `src/index.css` (HSL), `tailwind.config.ts` mapeia para `bg-*`, `text-*`, `border-*`
- **Forma:** pill-forward — botões `rounded-full`, cards `rounded-3xl`/`rounded-4xl`, painéis públicos com `ds-panel`
- **Paleta:** `#F3F3F1` page / stone-300 outer / `#08090A` dark / `blue-600` accent / `#1A1A1A` primary pill
- **Temas:** tri-state `light` / `dark` / `system` via `ThemeContext` + `ThemeToggle` (segmented control)
- **Shadows:** `shadow-editorial` / `shadow-editorial-lg`
- **Legacy compat:** `GlowButton` / `BeamButton` / `OutlineButton` seguem como wrappers de `<Button>` — não remover sem migração
- **NÃO usar:** `bg-zinc-900`, `text-white`, `#ef233c`, `font-manrope` com peso específico. Sempre tokenizar.

Páginas já rebrandadas (editorial): Login, SignUp, PendingApproval, AuthCallback, ErrorBoundary, LoadingSpinner.

Páginas pendentes de migração (ainda no dark brutalist): Hub, Dashboard, QuadroTarefas, HostingPanel, Settings, EditClient/NewClient, ContentPipeline, subpáginas de agents.

---

## Agentes elizaOS

**Schema Supabase (3 tabelas):**
- `agents_config` — config principal (agent_id UNIQUE, tier 1/2/3, system_prompt, temperature, max_tokens, plugins, metadata). Status válido: `active`/`inactive`/`error`.
- `agent_channels` — (agent_id, channel_type) UNIQUE. Tipos: `telegram`/`discord`/`twitter`/`whatsapp`/`email`.
- `agent_knowledge_access` — links RAG (document_id, access_level='read').

**Tabela mirror `agents`** (dashboard/hub) — sync obrigatório: `id` (mesmo UUID de `agents_config.id`), `name`, `role`, `status`, `emoji`, `category='tier-N'`, `description`.

**Hook canônico:** `src/hooks/useAgentForm.ts` (`saveAgent()` grava nas 3 tabelas). **Types:** `src/types/agents-elizaos.ts`.

**Criação em lote:** migration SQL em `supabase/migrations/` — usar `DO $mig$ ... $mig$` com `ON CONFLICT DO UPDATE` idempotente. Exemplo: `20260418120000_seed_tiktok_video_agents.sql`.

**Criação individual:** rota `/agents/new` → redirect para `/agents/elizaos/new/edit` (AgentElizaOSEdit trata `agentId === 'new'` como criação).

---

## Recursos / Dicas

Ambos vivem em `src/data/agentHierarchy.ts` (hardcoded, não Supabase):

- `centralResources: Resource[]` — exibidos em `/recursos` (RecursosPage)
- `tipCategories: TipCategory[]` — dicas em `/dicas` (DicasPage)
- Schema Resource: `{ id, name, description, icon: React.ElementType }` — ícones via `lucide-react`

---

## MCPs conectados

Já disponíveis sem config adicional:
- **Supabase** — apply_migration, execute_sql, list_tables (projeto `cgpkfhrqprqptvehatad`)
- **Vercel** — deploy, logs, projetos
- **Cloudflare** — D1, R2, KV, Hyperdrive, Workers
- **Figma** — design context, variables, screenshots
- **Chrome / Computer Use** — browser control + desktop
- **Google Calendar** — events, suggest_time
- **HuggingFace** — hub, papers, spaces
- **scheduled-tasks** — cron jobs
- **ccd_session** — mark_chapter, spawn_task

---

## Preferências de execução (Israel)

- **Idioma:** PT-BR por padrão em UI, comentários de código e commit messages. Commits em inglês para termos técnicos (`fix(agents):`, `feat(ds):`).
- **Commits:** seguir padrão existente (`type(scope): descrição curta` + corpo explicando o "porquê"); **sempre** incluir `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`.
- **Push:** `origin/main` (repo `grupototum/Apps_totum_Oficial`). Sem force-push. Sem `--no-verify`.
- **Método preferido para mudanças em lote no banco:** migration SQL + `mcp__supabase__apply_migration` (não UI manual).
- **Build+test antes de commit:** sempre rodar `npm run build && npm test -- --run` em mudanças não-triviais.
- **Velocidade > perfeição:** ir direto ao método mais rápido e reversível; perguntas só quando o caminho é ambíguo ou irreversível.
- **Abordagem:** surgical fixes (1 rota, 1 wrapper) em vez de refactors de 5 arquivos. Preservar compat com legacy primitives.

---

## Comandos frequentes

```bash
npm run dev                # Vite dev server
npm run build              # Build de produção (~8–10s)
npm test -- --run          # Suite Vitest (50+ testes)
npm run lint               # ESLint
```

Supabase (via MCP):
- Projeto: `cgpkfhrqprqptvehatad`
- DB migrations vivem em `supabase/migrations/` — prefixo com timestamp `YYYYMMDDHHMMSS_`.
