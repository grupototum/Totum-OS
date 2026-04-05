# Sistema de Quadro de Tarefas - Totum

Sistema completo de gestão de tarefas com visualização Kanban, lista, projetos e subtarefas.

## 🎯 Funcionalidades

- **Kanban View**: Colunas (A Fazer, Fazendo, Revisão, Feito) com drag & drop
- **Lista View**: Tabela com filtros e ordenação
- **Projetos**: Criar projeto → adicionar tarefas → subtarefas (checklist)
- **Tarefas únicas**: Avulsas, sem projeto vinculado
- **Filtros**: Por projeto, responsável, prioridade, status, data
- **Tags**: Categorias coloridas
- **Detalhes da tarefa**: Modal lateral com descrição, comentários, subtarefas, histórico

## 🎨 Design System

- Cores: #EAEAE5 (bg), stone-900 (texto), stone-300 (bordas)
- Fonte: Inter, tracking-tighter para títulos
- Layout: max-w-[1400px], grid 12 colunas, bordas visíveis
- Animações: reveal, stagger delays, cubic-bezier(0.16, 1, 0.3, 1)
- Ícones: Solar (Iconify)

## 📁 Estrutura de Arquivos

```
src/
├── pages/
│   ├── QuadroTarefas.tsx       # Página principal do kanban
│   └── ActionPlan.tsx          # Dashboard simplificado de Implantação
├── components/
│   ├── kanban/
│   │   ├── index.ts            # Exports
│   │   ├── KanbanColumn.tsx    # Coluna do kanban
│   │   └── KanbanCard.tsx      # Card arrastável
│   └── tasks/
│       ├── index.ts            # Exports
│       ├── TaskModal.tsx       # Modal de criação/edição
│       ├── TaskSubtarefas.tsx  # Checklist de subtarefas
│       └── TaskComentarios.tsx # Comentários da tarefa
├── hooks/
│   └── useTasks.ts             # Hook de CRUD completo
├── integrations/supabase/
│   └── types.ts                # Tipos atualizados
└── components/layout/
    └── AppSidebar.tsx          # Navegação atualizada
```

## 🗄️ Migração do Banco de Dados

Execute o SQL em `migrations/001_quadro_tarefas.sql` no console do Supabase para criar/atualizar as tabelas:

```sql
-- Tabelas criadas:
-- 1. projetos - Projetos do sistema
-- 2. comentarios_tarefa - Comentários nas tarefas
-- 3. tarefas (atualizada) - Novas colunas: projeto_id, subtarefas, tags, tipo, posicao
```

### Novas Colunas na Tabela `tarefas`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `projeto_id` | UUID | Referência ao projeto |
| `subtarefas` | JSONB | Array de subtarefas |
| `tags` | JSONB | Array de tags |
| `tipo` | TEXT | 'unica' ou 'projeto' |
| `posicao` | INTEGER | Ordenação no kanban |
| `data_limite` | TIMESTAMP | Data limite da tarefa |
| `criado_por` | UUID | Usuário criador |

## 🚀 Como Usar

1. **Aplicar migração SQL** no Supabase
2. **Acessar** o Quadro de Tarefas via sidebar: "Área de Trabalho > Quadro de Tarefas"
3. **Criar tarefa**: Botão "Nova Tarefa" no canto superior direito
4. **Mover tarefas**: Arrastar cards entre as colunas
5. **Ver detalhes**: Clicar em qualquer card para abrir o modal lateral

## 🔧 Rotas

- `/quadro-tarefas` - Quadro de Tarefas (novo sistema)
- `/action-plan` - Dashboard de Implantação (simplificado)

## 📱 Responsividade

- Desktop: Kanban com 4 colunas
- Tablet: Scroll horizontal no kanban
- Mobile: Lista ou kanban compacto

## 🎭 Status do Kanban

| Status | Cor | Descrição |
|--------|-----|-----------|
| A Fazer | #78716C | Tarefas pendentes |
| Fazendo | #3B82F6 | Em execução |
| Revisão | #F59E0B | Aguardando revisão |
| Feito | #22C55E | Concluídas |

## 🔖 Prioridades

| Prioridade | Cor | Ícone |
|------------|-----|-------|
| Baixa | #78716C | Flag vazia |
| Média | #3B82F6 | Flag dupla |
| Alta | #F59E0B | Flag cheia |
| Urgente | #EF4444 | Flag bold |

## 📝 Notas

- O sistema mantém compatibilidade com a tabela antiga `action_plan_tasks`
- Real-time updates ativados para sincronização instantânea
- RLS (Row Level Security) configurado para segurança
