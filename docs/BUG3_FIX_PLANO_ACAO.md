# BUG 3 Fix: Persistência de Estado no Plano de Ação

## Problema
Ao dar refresh na página **Plano de Ação**, o estado da interface era perdido:
- Filtro de responsável voltava para "Todos"
- Fases expandidas/colapsadas eram resetadas
- Fase ativa/selecionada era perdida

## Solução Implementada

### 1. useTarefas.ts (Filtros de Tarefas)
**Arquivo:** `/opt/apps-totum/app/src/hooks/useTarefas.ts`

- Adicionada constante `STORAGE_KEY = 'totum:tarefas:filtros'`
- Função `carregarFiltrosSalvos()` para recuperar filtros do localStorage
- `useEffect` para persistir automaticamente os filtros quando mudam
- Estado inicial dos filtros agora carrega do localStorage

### 2. ActionPlan.tsx (Plano de Ação)
**Arquivo:** `/opt/apps-totum/app/src/pages/ActionPlan.tsx`

- Adicionada constante `STORAGE_KEY = "totum:actionPlan:state"`
- Interface `PersistedState` tipando o estado a ser salvo:
  - `filterResp`: filtro por responsável
  - `expandedPhases`: fases expandidas
  - `activePhase`: fase ativa/selecionada
- Função `carregarEstadoSalvo()` para recuperar estado do localStorage
- Estados agora inicializam com valores do localStorage
- `useEffect` para persistir automaticamente quando qualquer estado mudar

## Estados Persistidos

| Componente | Estado | Chave no localStorage |
|------------|--------|----------------------|
| useTarefas | filtros | `totum:tarefas:filtros` |
| ActionPlan | filterResp, expandedPhases, activePhase | `totum:actionPlan:state` |

## Comportamento
1. Usuário seleciona filtros/expande fases no Plano de Ação
2. Estado é salvo automaticamente no localStorage
3. Ao dar refresh (F5), o estado é recuperado do localStorage
4. Interface mantém a mesma configuração do usuário

## Teste
1. Acesse a página Plano de Ação
2. Selecione um filtro de responsável (ex: "Claude")
3. Expanda algumas fases
4. Dê refresh na página (F5)
5. Verifique que o filtro e as fases expandidas permanecem
