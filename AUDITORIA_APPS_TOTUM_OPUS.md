# AUDITORIA TÉCNICA — APPS TOTUM OFICIAL
**Data:** 25 de Abril de 2026  
**Auditor:** Claude (claude-sonnet-4-6) via Claude Code  
**Branch auditada:** `claude/fix-mex-status-DOa2Q`  
**Commit topo:** `e0a67d5` — feat: add inline agent edit + Alexandria coverage

---

## SCORECARD GERAL

| Frente | Descrição | Nota | Status |
|--------|-----------|------|--------|
| 1 | TypeScript / Qualidade de Código | **5/10** | ⚠️ Atenção |
| 2 | Arquitetura & Estado Global | **6/10** | ⚠️ Atenção |
| 3 | Tratamento de Erros & Validação | **4/10** | 🔴 Crítico |
| 4 | Segurança | **2/10** | 🔴 Crítico |
| 5 | Performance & Bundle | **7/10** | ✅ Bom |
| 6 | Integrações & Realtime | **5/10** | ⚠️ Atenção |
| **TOTAL** | | **4.8/10** | **🔴 Requer Ação** |

---

## PROBLEMAS CRÍTICOS

### C1 — API Keys expostas no bundle do frontend (SEGURANÇA — CRÍTICO)

**Impacto:** Qualquer usuário pode abrir o DevTools e extrair todas as chaves de terceiros.

As seguintes variáveis `VITE_*` são bundled pelo Vite no JavaScript público e portanto visíveis a qualquer visitante:

```
VITE_GEMINI_API_KEY      → 21 arquivos afetados
VITE_GROQ_API_KEY
VITE_KIMI_API_KEY
VITE_OPENAI_API_KEY
VITE_TELEGRAM_BOT_TOKEN  → envia mensagens em nome do bot
VITE_TELEGRAM_ADMIN_CHAT_ID
VITE_OPENCLAW_TOKEN
VITE_SUNA_API_KEY
VITE_N8N_API_KEY
```

**Arquivos de alto risco:**
- `src/services/gemini.ts` — chave Gemini direto no cliente
- `src/services/aiService.ts` — múltiplos providers com chaves expostas
- `src/lib/telegram.ts` + `src/hooks/useTelegramNotification.ts` — bot token exposto
- `src/config/openclaw.ts` + `src/config/suna.ts` — tokens de serviços externos
- `src/services/n8n.ts` — API key do N8N

**Correção obrigatória:** Mover todas essas chamadas para Supabase Edge Functions (server-side). O frontend só deve chamar o endpoint Supabase, que mantém as keys em variáveis de ambiente server-only (sem prefixo `VITE_`).

---

### C2 — Formulários sem validação de schema (ERRO HANDLING — CRÍTICO)

**Impacto:** Dados inválidos chegam diretamente ao banco. XSS potencial em campos de texto livre.

- **0 schemas Zod** encontrados no projeto
- **12 usos de `react-hook-form`** sem `zodResolver`
- **13 `handleSubmit` / `onSubmit`** em formulários sem validação de entrada
- `@hookform/resolvers` está no `package.json` mas não é usado em nenhum formulário

**Arquivos prioritários para correção:**
- Qualquer formulário que salva em `agents`, `agents_config`, `rag_documents`, `skills`

---

### C3 — `strictNullChecks: false` + `noImplicitAny: false` (TYPESCRIPT — CRÍTICO)

**Impacto:** 187 ocorrências de `any` (`: any`, `<any>`, `as any`) no codebase são silenciosas. Erros de nulidade não são capturados em tempo de compilação. Refatorações arriscadas.

```json
// tsconfig.json — configuração atual (fraca)
"strictNullChecks": false,
"noImplicitAny": false
```

O TypeScript está operando essencialmente como JavaScript com syntax highlighting.

---

## PROBLEMAS DE ALTA PRIORIDADE

### A1 — Funções async sem try/catch em `useChartData.ts`

`src/hooks/useChartData.ts` linhas 32–86: três funções assíncronas que fazem queries ao Supabase sem nenhum bloco try/catch. Uma falha de rede ou erro de DB causa crash silencioso sem feedback ao usuário.

### A2 — 111 `console.*` em produção (33 arquivos)

111 chamadas de `console.log/warn/error` espalhadas por 33 arquivos chegam ao bundle de produção. Vazam informações internas (user IDs, tokens parciais, estrutura de dados) para qualquer usuário com DevTools aberto.

**Solução:** Adicionar plugin Vite para remover `console.*` em build de produção, ou usar um logger condicional.

### A3 — TOT Bridge (porta 3333) sem integração

A integração com o serviço local TOT Bridge (porta 3333) aparece documentada mas **0 referências** foram encontradas no código-fonte. Se o serviço existe e deveria estar conectado, essa integração está ausente.

### A4 — Ausência de estado global centralizado

487 ocorrências de `useState`/`useContext` no projeto. Apenas 3 imports de estado global. Para um projeto com ~57 agentes, múltiplos providers de AI, e estado de execução de tarefas, a ausência de Zustand/Redux/Jotai cria prop drilling e duplicação de estado entre páginas.

### A5 — 5 vulnerabilidades HIGH no npm audit

```
rollup         — ReDoS via YAML parsing (HIGH)
terser         — ReDoS (HIGH)
basic-ftp      — SSRF via hostname injection (HIGH)
serialize-javascript — XSS via prototype pollution (HIGH)
+ 1 HIGH adicional
```

---

## PROBLEMAS DE MÉDIA PRIORIDADE

### M1 — Arquivos excessivamente grandes

| Arquivo | Linhas | Problema |
|---------|--------|---------|
| `supabase/types.ts` | 972 | Gerado, mas sem segmentação |
| `DashboardWidgets.tsx` | 745 | Componente único com lógica demais |
| `src/pages/ada/index.tsx` | 738 | Página ADA monolítica |
| `HermioneChat.tsx` | 659 | Chat + lógica de AI misturados |
| `AgentElizaOSEdit.tsx` | 635 | Formulário com 635 linhas |

Componentes acima de 400 linhas geralmente indicam ausência de separação de responsabilidades.

### M2 — Duas tabelas de agentes sem sincronização formal

O sistema mantém dois armazenamentos de agentes:
- **`public.agents`** — tabela dashboard (57+ agentes, slug, emoji, status)
- **`public.agents_config`** — tabela ElizaOS runtime (system prompts, skills, model override)

O merge é feito em `useAlexandria.ts` na camada de UI. Não há constraint de FK entre as tabelas, não há trigger de sincronização, e IDs podem divergir. Um agente pode existir em `agents` sem estar em `agents_config` e vice-versa.

### M3 — DNA files e mapeamento manual frágil

`src/services/agentDnaLoader.ts` mantém 3 dicionários hardcoded (67 entradas) mapeando slugs para caminhos de arquivo. Qualquer renomeação de arquivo ou adição de agente exige atualização manual desse loader. Não há validação de que os arquivos `.md` existem em build time além do próprio `import.meta.glob`.

### M4 — `react-query` subutilizado (8 usos vs. 124 fetches em pages)

O projeto tem `@tanstack/react-query` instalado mas 124 chamadas de API são feitas com `fetch` + `useEffect` manual em páginas. Isso duplica lógica de loading/error, invalida cache e aumenta re-renders desnecessários.

### M5 — 7 non-null assertions (`!.`) com `strictNullChecks` desabilitado

Com `strictNullChecks: false`, os operadores `!` não oferecem proteção real — são decorativos. Se um valor for de fato null/undefined em runtime, o crash ocorre igualmente.

---

## PROBLEMAS ARQUITETURAIS

### AR1 — Ausência de camada de API/BFF

Todas as chamadas a Supabase, Gemini, Groq, N8N, Telegram e outros serviços são feitas diretamente do frontend. Isso:
1. Expõe credenciais (ver C1)
2. Impossibilita rate-limiting server-side
3. Impede logging centralizado de uso de AI
4. Acopla o frontend a todos os providers externos

**Solução recomendada:** Supabase Edge Functions como BFF (Backend For Frontend). O frontend chama apenas `/functions/v1/ai-proxy`, que despacha para o provider correto com autenticação server-side.

### AR2 — Dois sistemas de status de agente sem fonte única

`AgentConfigStatus` (de `src/types/status.ts`) e o campo `status` da tabela `agents` ('standby', 'online', 'offline') usam vocabulários diferentes. `adaptDashboardAgent` em `useAlexandria.ts` converte manualmente `'online' → 'active'` — qualquer novo status criado em um sistema não se propaga para o outro.

### AR3 — Auth bypass por ausência de registro em `user_approvals`

O sistema de aprovação de usuários tem uma lacuna de design: usuários sem registro em `user_approvals` são tratados como aprovados (comportamento "legacy"). Isso significa que qualquer falha no trigger de criação do registro de aprovação resulta em acesso irrestrito sem aprovação explícita.

---

## SEGURANÇA — RESUMO

| Item | Severidade | Status |
|------|-----------|--------|
| API keys em VITE_ vars (9 chaves) | CRÍTICO | 🔴 Aberto |
| 0 validação de schema em formulários | CRÍTICO | 🔴 Aberto |
| 5 HIGH em npm audit | ALTO | 🔴 Aberto |
| 111 console.* em produção | MÉDIO | 🟡 Aberto |
| Auth bypass por `user_approvals` nulo | MÉDIO | 🟡 Aberto |
| .env coberto pelo .gitignore | — | ✅ OK |
| Nenhuma chave real no código-fonte | — | ✅ OK |
| RLS configurado no Supabase | — | ✅ OK |
| SUPABASE_SERVICE_ROLE_KEY sem VITE_ | — | ✅ OK |

---

## PERFORMANCE — RESUMO

| Métrica | Valor | Avaliação |
|---------|-------|-----------|
| Rotas com lazy loading | 37 | ✅ Bom |
| useMemo/useCallback | 134 | ✅ Adequado |
| Arquivos >400 linhas | 5 | ⚠️ Alto |
| DNA files bundled | 69 (29+40) | ✅ OK (lazy) |
| Total de linhas de fonte | 43.547 | ⚠️ Alto |
| Realtime subscriptions limpas | 9 sub / 15 cleanup | ✅ OK |

---

## PLANO DE AÇÃO

### Sprint 1 — Crítico (1–2 semanas)

| # | Ação | Arquivo(s) | Esforço |
|---|------|-----------|---------|
| P1 | Mover chamadas de AI para Supabase Edge Functions | `src/services/gemini.ts`, `aiService.ts`, `hermione.ts` | 3d |
| P2 | Mover Telegram bot para Edge Function | `src/lib/telegram.ts`, `telegramService.ts` | 1d |
| P3 | Mover N8N/OpenClaw/Suna para Edge Functions | `src/services/n8n.ts`, configs | 1d |
| P4 | Adicionar Zod aos formulários críticos (agents, rag_documents) | Todos os formulários com `handleSubmit` | 2d |
| P5 | Habilitar `strictNullChecks: true` + corrigir erros | `tsconfig.json` + ~187 any usages | 3d |

### Sprint 2 — Alto (2–4 semanas)

| # | Ação | Arquivo(s) | Esforço |
|---|------|-----------|---------|
| P6 | Adicionar try/catch em `useChartData.ts` | `src/hooks/useChartData.ts:32-86` | 2h |
| P7 | Remover `console.*` de produção via plugin Vite | `vite.config.ts` + plugin | 2h |
| P8 | `npm audit fix` para vulnerabilidades HIGH | `package.json` | 4h |
| P9 | Migrar 10 principais fetches para `react-query` | Pages com mais re-fetches | 2d |
| P10 | Quebrar `DashboardWidgets.tsx` e `HermioneChat.tsx` | Componentes >400 linhas | 2d |

### Sprint 3 — Médio (1 mês)

| # | Ação | Esforço |
|---|------|---------|
| P11 | Adicionar FK entre `agents` e `agents_config` | 1d |
| P12 | Centralizar estado global com Zustand | 3d |
| P13 | Automatizar DNA loader (convention-over-configuration) | 1d |
| P14 | Implementar integração TOT Bridge (3333) se necessário | 2d |
| P15 | Corrigir auth bypass: exigir registro explícito em `user_approvals` | 1d |

---

## RECOMENDAÇÕES FINAIS

**1. Prioridade zero: rotate todas as API keys agora.**  
Se alguma das chaves listadas em C1 já foi exposta em produção (mesmo que em `.env` local que nunca foi commitado), considere que podem ter sido capturadas em sessões de usuário reais. Rotacione Gemini, Groq, N8N, Telegram bot e OpenClaw antes de qualquer deploy público.

**2. Adotar Supabase Edge Functions como API layer.**  
Este é o padrão correto para aplicações Supabase+Vite. O frontend só precisa de `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` — todas as demais integrações ficam server-side.

**3. Habilitar TypeScript estrito de forma incremental.**  
Ative `"strict": true` no tsconfig e use `// @ts-ignore` estratégico onde necessário no curto prazo, removendo progressivamente. Não deixe para um "grande refactor" futuro — ele nunca acontece.

**4. O que está bem:**  
- Code splitting com `React.lazy` está bem implementado (37 pontos)
- Cleanup de subscriptions Realtime está correto (15 cleanups > 9 subscriptions)
- `.env.example` bem documentado com avisos claros
- `SUPABASE_SERVICE_ROLE_KEY` corretamente fora do prefixo VITE_
- 0 erros de TypeScript no build atual
- DNA loader com fallback por nome funciona corretamente
- Merge `agents` + `agents_config` em Alexandria está funcional

---

*Auditoria gerada em 25/04/2026 — Apps Totum Oficial — branch `claude/fix-mex-status-DOa2Q`*
