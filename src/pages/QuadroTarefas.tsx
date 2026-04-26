import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import AppLayout from '@/components/layout/AppLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { KanbanColumn } from '@/components/kanban';
import { TaskModal } from '@/components/tasks';
import { useTasks, Tarefa, StatusTarefa, COLUNAS_KANBAN, PRIORIDADES } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState, PageHeader, SectionHeader, Toolbar } from '@/components/ui/patterns';

type ViewType = 'kanban' | 'lista';

const STATUS_BADGE_VARIANTS: Record<StatusTarefa, 'warning' | 'info' | 'success' | 'outline'> = {
  pendente: 'warning',
  em_andamento: 'info',
  concluida: 'success',
  cancelada: 'outline',
};

const PRIORIDADE_BADGE_VARIANTS: Record<string, 'error' | 'warning' | 'default'> = {
  urgente: 'error',
  alta: 'warning',
  media: 'default',
  baixa: 'outline',
};

export default function QuadroTarefas() {
  const { user } = useAuth();
  const pageTransition = usePageTransition();
  const {
    tarefas,
    projetos,
    loading,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    adicionarComentario,
    toggleSubtarefa,
    adicionarSubtarefa,
    removerSubtarefa,
  } = useTasks();

  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroProjeto, setFiltroProjeto] = useState<string | 'todos'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<StatusTarefa | 'todos'>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string | 'todas'>('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('create');
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      if (
        searchQuery &&
        !tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tarefa.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (filtroProjeto !== 'todos') {
        if (filtroProjeto === 'sem_projeto' && tarefa.projeto_id) return false;
        if (filtroProjeto !== 'sem_projeto' && tarefa.projeto_id !== filtroProjeto) return false;
      }

      if (filtroStatus !== 'todos' && tarefa.status !== filtroStatus) return false;
      if (filtroPrioridade !== 'todas' && tarefa.prioridade !== filtroPrioridade) return false;

      return true;
    });
  }, [tarefas, searchQuery, filtroProjeto, filtroStatus, filtroPrioridade]);

  const tarefasPorColuna = useMemo(() => {
    const grouped: Record<StatusTarefa, Tarefa[]> = {
      pendente: [],
      em_andamento: [],
      concluida: [],
      cancelada: [],
    };

    tarefasFiltradas.forEach((tarefa) => {
      if (grouped[tarefa.status]) {
        grouped[tarefa.status].push(tarefa);
      }
    });

    return grouped;
  }, [tarefasFiltradas]);

  const stats = useMemo(() => {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.status === 'concluida').length;
    const emAndamento = tarefas.filter((t) => t.status === 'em_andamento').length;
    const pendentes = tarefas.filter((t) => t.status === 'pendente').length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    return { total, concluidas, emAndamento, pendentes, progresso };
  }, [tarefas]);

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((projeto) =>
      tarefas.some((tarefa) => tarefa.projeto_id === projeto.id)
    );
  }, [projetos, tarefas]);

  const handleNovaTarefa = () => {
    setTarefaSelecionada(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleCardClick = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDrop = async (tarefaId: string, novoStatus: StatusTarefa, _posicao: number) => {
    setIsDragging(false);
    await atualizarTarefa(tarefaId, { status: novoStatus });
  };

  const handleSaveTarefa = async (tarefaData: Partial<Tarefa>): Promise<boolean> => {
    if (modalMode === 'create') {
      const result = await criarTarefa(tarefaData);
      return !!result;
    }

    if (tarefaSelecionada) {
      return await atualizarTarefa(tarefaSelecionada.id, tarefaData);
    }

    return false;
  };

  const handleDeleteTarefa = async (id: string): Promise<boolean> => {
    return await deletarTarefa(id);
  };

  const limparFiltros = () => {
    setSearchQuery('');
    setFiltroProjeto('todos');
    setFiltroStatus('todos');
    setFiltroPrioridade('todas');
  };

  const temFiltrosAtivos =
    searchQuery || filtroProjeto !== 'todos' || filtroStatus !== 'todos' || filtroPrioridade !== 'todas';

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full p-6 space-y-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4 h-[calc(100vh-360px)]">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-72 h-full" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.main
        {...pageTransition}
        className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(239,35,60,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.22)_100%)]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
          <PageHeader
            eyebrow="Execucao operacional"
            title="Quadro de tarefas"
            description="Organize demandas por etapa, acompanhe gargalos e revise prioridades sem perder o contexto do projeto."
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="glass-dark">
                  {tarefasFiltradas.length} de {stats.total} visiveis
                </Badge>
                <Button onClick={handleNovaTarefa}>
                  <Icon icon="solar:add-circle-linear" className="h-5 w-5" />
                  Nova tarefa
                </Button>
              </div>
            }
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="space-y-2 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Total</p>
                <p className="text-3xl font-semibold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Volume geral monitorado neste board.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-semibold text-foreground">{stats.pendentes}</p>
                <p className="text-sm text-muted-foreground">Itens que ainda nao entraram em execucao.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Em andamento</p>
                <p className="text-3xl font-semibold text-foreground">{stats.emAndamento}</p>
                <p className="text-sm text-muted-foreground">Frente ativa que merece acompanhamento diario.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Conclusao</p>
                  <p className="text-3xl font-semibold text-foreground">{stats.progresso}%</p>
                  <p className="text-sm text-muted-foreground">{stats.concluidas} tarefas finalizadas.</p>
                </div>
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray={`${stats.progresso} ${100 - stats.progresso}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                    {stats.progresso}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <Toolbar className="items-start">
              <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Icon
                    icon="solar:magnifer-linear"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por titulo ou descricao"
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-full border border-border bg-background p-1">
                    <button
                      onClick={() => setViewType('kanban')}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                        viewType === 'kanban'
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon icon="solar:widget-5-linear" className="h-4 w-4" />
                      Kanban
                    </button>
                    <button
                      onClick={() => setViewType('lista')}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                        viewType === 'lista'
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon icon="solar:list-linear" className="h-4 w-4" />
                      Lista
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant={showFilters || temFiltrosAtivos ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Icon icon="solar:filter-linear" className="h-4 w-4" />
                    Filtros
                    {temFiltrosAtivos && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                  </Button>
                  {temFiltrosAtivos && (
                    <Button type="button" variant="ghost" size="sm" onClick={limparFiltros}>
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
            </Toolbar>

            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Card>
                    <CardContent className="space-y-4 p-5">
                      <SectionHeader title="Filtros ativos" />
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <label className="space-y-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Projeto
                          </span>
                          <select
                            value={filtroProjeto}
                            onChange={(e) => setFiltroProjeto(e.target.value)}
                            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                          >
                            <option value="todos">Todos</option>
                            <option value="sem_projeto">Sem projeto</option>
                            {projetosFiltrados.map((projeto) => (
                              <option key={projeto.id} value={projeto.id}>
                                {projeto.nome}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Status
                          </span>
                          <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value as StatusTarefa | 'todos')}
                            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                          >
                            <option value="todos">Todos</option>
                            {COLUNAS_KANBAN.map((coluna) => (
                              <option key={coluna.id} value={coluna.id}>
                                {coluna.titulo}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            Prioridade
                          </span>
                          <select
                            value={filtroPrioridade}
                            onChange={(e) => setFiltroPrioridade(e.target.value)}
                            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                          >
                            <option value="todas">Todas</option>
                            {PRIORIDADES.map((prioridade) => (
                              <option key={prioridade.id} value={prioridade.id}>
                                {prioridade.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {tarefasFiltradas.length === 0 ? (
            <EmptyState
              title="Nenhuma tarefa encontrada"
              description="Ajuste os filtros ou crie uma nova tarefa para iniciar o acompanhamento."
              actionLabel="Criar tarefa"
              onAction={handleNovaTarefa}
            />
          ) : viewType === 'kanban' ? (
            <section className="overflow-x-auto pb-2">
              <div className="flex min-w-max gap-4">
                {COLUNAS_KANBAN.map((coluna) => (
                  <KanbanColumn
                    key={coluna.id}
                    id={coluna.id}
                    titulo={coluna.titulo}
                    cor={coluna.cor}
                    tarefas={tarefasPorColuna[coluna.id] || []}
                    projetos={projetos}
                    onDrop={handleDrop}
                    onCardClick={handleCardClick}
                    isDragging={isDragging}
                  />
                ))}
              </div>
            </section>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Tarefa
                        </th>
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Status
                        </th>
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Prioridade
                        </th>
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Projeto
                        </th>
                        <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Prazo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/70">
                      {tarefasFiltradas.map((tarefa) => {
                        const status = COLUNAS_KANBAN.find((c) => c.id === tarefa.status);
                        const prioridade = PRIORIDADES.find((p) => p.id === tarefa.prioridade);
                        const projeto = projetos.find((p) => p.id === tarefa.projeto_id);
                        const dataLimite = tarefa.data_limite || tarefa.deadline;

                        return (
                          <tr
                            key={tarefa.id}
                            onClick={() => handleCardClick(tarefa)}
                            className="cursor-pointer transition-colors hover:bg-muted/50"
                          >
                            <td className="px-5 py-4 align-top">
                              <div className="space-y-1">
                                <p className="font-medium text-foreground">{tarefa.titulo}</p>
                                {tarefa.descricao && (
                                  <p className="line-clamp-2 text-sm text-muted-foreground">{tarefa.descricao}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top">
                              {status && (
                                <Badge variant={STATUS_BADGE_VARIANTS[tarefa.status]}>
                                  {status.titulo}
                                </Badge>
                              )}
                            </td>
                            <td className="px-5 py-4 align-top">
                              {prioridade && (
                                <Badge variant={PRIORIDADE_BADGE_VARIANTS[tarefa.prioridade] || 'outline'}>
                                  {prioridade.label}
                                </Badge>
                              )}
                            </td>
                            <td className="px-5 py-4 align-top text-sm text-muted-foreground">
                              {projeto?.nome || 'Sem projeto'}
                            </td>
                            <td className="px-5 py-4 align-top text-sm text-muted-foreground">
                              {dataLimite ? new Date(dataLimite).toLocaleDateString('pt-BR') : 'Sem prazo'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <TaskModal
          tarefa={tarefaSelecionada}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          projetos={projetos}
          onSave={handleSaveTarefa}
          onDelete={handleDeleteTarefa}
          onToggleSubtarefa={toggleSubtarefa}
          onAddSubtarefa={adicionarSubtarefa}
          onRemoveSubtarefa={removerSubtarefa}
          onAddComentario={async (tarefaId, conteudo) => {
            await adicionarComentario(tarefaId, conteudo);
          }}
          currentUser={user?.email || 'Usuario'}
          mode={modalMode}
        />
      </motion.main>
    </AppLayout>
  );
}
