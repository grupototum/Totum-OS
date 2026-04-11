

## Plan: Sync Project with GitHub Commit d6a3350 + Fix Build Errors

This commit adds agent task management, Gantt chart, and updates the task system. There are also pre-existing build errors to fix.

### What Changes

**From the GitHub commit (8 files, +2719 lines):**
1. New database migration for agent execution logs
2. New `AgentTaskManager` component for managing agent-scheduled tasks
3. New `GanttChart` component for timeline visualization
4. New `useAgentTasks` hook for agent task scheduling
5. Updated `useTasks` hook with new fields (Gantt dates, progress, dependencies, agent support)
6. Updated `ActionPlan` page with Gantt and Agent tabs
7. Updated component index exports

**Build error fixes (4 files):**
1. `AgentChat.tsx` line 113 - filter out `'system'` role comparison (change to filter by known roles instead)
2. `AgentChatLayout.tsx` lines 176, 195, 199 - fix broken arrow functions `(c) =` → `(c) =>`
3. `TarefasWidget.tsx` - add local `filtros`/`setFiltros` state since `useTasks` doesn't expose them
4. `QuadroTarefas.tsx` line 476 - fix type mismatch: `adicionarSubtarefa` returns `Promise<Subtarefa>` but `TaskModal` expects `Promise<boolean>`. Wrap the call.

### Technical Steps

**Step 1: Database Migration**
- Create migration for `logs_execucao_agente` table with RLS and realtime
- Add `proxima_execucao`, `ultima_execucao`, `ultimo_resultado` columns to `tarefas`

**Step 2: Create New Files**
- `src/hooks/useAgentTasks.ts` - Agent task scheduling hook (from GitHub, adapted for Lovable's Supabase types)
- `src/components/agents/AgentTaskManager.tsx` - Agent task management UI
- `src/components/gantt/GanttChart.tsx` - Gantt chart + MiniGantt components
- `src/components/gantt/index.ts` - Export barrel

**Step 3: Update Existing Files**
- `src/hooks/useTasks.ts` - Add new fields: `data_inicio`, `data_fim`, `progresso`, `dependencias`, `agente_id`, `recorrencia`, `horario_execucao`, `params`, `milestone_id`, `departamento`, `RESPONSAVEIS` constant, `filtros`/`setFiltros` state
- `src/components/agents/index.ts` - Add `AgentTaskManager` and `useAgentTasks` exports
- `src/pages/ActionPlan.tsx` - Add Gantt and Agent tabs

**Step 4: Fix Build Errors**
- `AgentChat.tsx` - Change role filter from `!== 'system'` to `=== 'user' || === 'agent'`
- `AgentChatLayout.tsx` - Fix 3 broken arrow functions (missing `>`)
- `TarefasWidget.tsx` - Add local filter state
- `QuadroTarefas.tsx` - Wrap `adicionarSubtarefa` to return `Promise<boolean>`
- `TaskModal.tsx` - Ensure `onAddSubtarefa` type matches

**Dependencies:** May need `date-fns` (likely already installed). No new packages expected.

