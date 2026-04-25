# PLANO DE EXECUÇÃO — APPS TOTUM OFICIAL
**Para:** Claude Sonnet (executor)  
**Repo:** `grupototum/Apps_totum_Oficial`  
**Branch de trabalho:** `claude/fix-mex-status-DOa2Q`  
**Contexto:** Auditoria técnica identificou score 4.8/10. Este documento lista as tarefas em ordem de prioridade com instruções exatas de execução.

---

## CONTEXTO DO PROJETO

- Frontend React + Vite + TypeScript em `/home/user/Apps_totum_Oficial`
- Backend: Supabase (Postgres + Auth + Realtime + Edge Functions)
- 57 agentes de AI organizados em Tier 1/2/3 + Totum Custom
- `src/services/` — serviços de AI (Gemini, Groq, N8N, Telegram, etc.)
- `src/hooks/` — hooks React
- `src/pages/` — páginas
- `src/types/` — tipos TypeScript
- `supabase/functions/` — Edge Functions (se existirem)

---

## TAREFA 1 — CRÍTICA: Adicionar try/catch em useChartData.ts

**Arquivo:** `src/hooks/useChartData.ts` linhas 32–86  
**Problema:** 3 funções assíncronas sem try/catch — falha de rede causa crash silencioso  
**Ação:** Leia o arquivo inteiro. Envolva cada função async que faz query ao Supabase com try/catch. No catch, faça `console.error` + defina o state de erro/loading corretamente. Não altere lógica existente.

---

## TAREFA 2 — CRÍTICA: Remover console.* de produção via Vite

**Arquivo:** `vite.config.ts`  
**Problema:** 111 chamadas `console.*` chegam ao bundle de produção  
**Ação:** Leia `vite.config.ts`. Adicione `drop_console: true` dentro do `terser` options no bloco `build.minify`, ou use `esbuild: { drop: ['console', 'debugger'] }` se o minifier for esbuild. Não remova console de arquivos individuais — resolva no config de build.

---

## TAREFA 3 — ALTA: Adicionar Zod ao formulário de edição de Agente

**Arquivo:** `src/pages/agents/AgentDetail.tsx`  
**Problema:** O formulário de edição de agente (Sheet de edição adicionado recentemente) não valida os campos  
**Ação:**
1. Leia o arquivo para entender a estrutura atual do `EditForm` e `saveEdit()`
2. Adicione `import { z } from 'zod'` (zod já está no package.json via @hookform/resolvers)
3. Crie um schema `agentEditSchema` com:
   - `name`: string min 2 max 50
   - `role`: string min 3 max 100
   - `description`: string max 500 optional
   - `emoji`: string max 4
   - `slug`: string regex `/^[a-z0-9-]+$/` optional
   - `category`: enum dos valores válidos
   - `status`: enum dos valores válidos
4. Em `saveEdit()`, valide com `agentEditSchema.safeParse(editForm)` antes de chamar o Supabase. Se inválido, exiba os erros via `toast.error`.
5. Não refatore o componente inteiro — apenas adicione validação no ponto de submit.

---

## TAREFA 4 — ALTA: npm audit fix para vulnerabilidades HIGH

**Ação:**
```bash
npm audit fix
```
Se houver breaking changes (major version bumps), rode `npm audit fix --force` apenas para os pacotes `rollup`, `terser`, `basic-ftp`, `serialize-javascript`. Verifique que `npm run build` ainda funciona após o fix. Não atualize outros pacotes desnecessariamente.

---

## TAREFA 5 — MÉDIA: Garantir que useAlexandria trata erros de cada query

**Arquivo:** `src/hooks/useAlexandria.ts`  
**Problema:** O `Promise.all` falha completamente se qualquer uma das 4 queries falhar  
**Ação:** Leia o arquivo. O `Promise.all` atual lança para o catch global se qualquer query falhar. Substitua por `Promise.allSettled` e trate cada resultado individualmente: se uma query falhar, use array vazio como fallback para aquela coleção e log o erro específico. O usuário deve ver dados parciais em vez de tela de erro completa.

---

## TAREFA 6 — MÉDIA: Corrigir tsconfig para modo mais estrito

**Arquivo:** `tsconfig.json`  
**Ação:**
1. Leia `tsconfig.json`
2. Ative `"strictNullChecks": true`
3. Rode `npx tsc --noEmit` para ver quantos erros surgem
4. Se forem menos de 30 erros, corrija todos
5. Se forem mais de 30 erros, reverta `strictNullChecks` e documente no tsconfig com comentário: `// TODO: ativar após corrigir X erros de nullability`
6. Em qualquer caso, NÃO altere `noImplicitAny` — deixe para depois

---

## TAREFA 7 — MÉDIA: Informacional — API Keys no frontend (NÃO IMPLEMENTAR SEM APROVAÇÃO)

**Contexto para o executor:** As seguintes variáveis `VITE_*` estão expostas no bundle:
```
VITE_GEMINI_API_KEY, VITE_GROQ_API_KEY, VITE_KIMI_API_KEY, VITE_OPENAI_API_KEY
VITE_TELEGRAM_BOT_TOKEN, VITE_TELEGRAM_ADMIN_CHAT_ID
VITE_OPENCLAW_TOKEN, VITE_SUNA_API_KEY, VITE_N8N_API_KEY
```

A correção correta é criar Supabase Edge Functions em `supabase/functions/` para cada provider e remover as keys do frontend. **Esta tarefa requer aprovação explícita do usuário antes de executar**, pois muda a arquitetura de integração e pode quebrar funcionalidades em produção. 

Ao terminar as tarefas 1–6, pergunte ao usuário: *"Posso iniciar a migração das API keys para Edge Functions (Tarefa 7)? Isso vai criar arquivos em `supabase/functions/` e alterar os services de AI."*

---

## INSTRUÇÕES DE GIT

Após cada tarefa concluída:
```bash
git add <arquivos alterados>
git commit -m "fix: <descrição concisa da tarefa>"
```

Ao final de todas as tarefas:
```bash
git push -u origin claude/fix-mex-status-DOa2Q
```

**Nunca** faça push para `main` sem aprovação explícita.

---

## CRITÉRIOS DE ACEITAÇÃO

- [ ] `npm run build` termina sem erros
- [ ] `npx tsc --noEmit` sem erros novos em relação ao baseline
- [ ] Cada tarefa tem commit separado com mensagem descritiva
- [ ] Nenhuma funcionalidade existente quebrada

---

## O QUE NÃO ALTERAR

- Não refatore arquivos que não estão listados nas tarefas
- Não atualize dependências além das citadas na Tarefa 4
- Não crie novos componentes ou páginas
- Não altere migrations do Supabase
- Não altere DNA files em `DNAS_AGENCY_AGENTS/` ou `DNAS_39_AGENTES/`
 