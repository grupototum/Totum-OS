import { useEffect, useMemo, useRef, useState } from 'react';
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
import { DataPanel, EmptyState, MetricCard, PageHeader, SectionHeader, Toolbar } from '@/components/ui/patterns';

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
  const hasInitializedResponsiveView = useRef(false);
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

  useEffect(() => {
    if (hasInitializedResponsiveView.current) return;

    setViewType(window.innerWidth < 768 ? 'lista' : 'kanban');
    hasInitializedResponsiveView.current = true;
  }, []);

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
    const atrasadas = tarefas.filter((t) => {
      const dataLimite = t.data_limite || t.deadline;
      return Boolean(dataLimite) && new Date(dataLimite!) < new Date() && t.status !== 'concluida';
    }).length;
    const semProjeto = tarefas.filter((t) => !t.projeto_id).length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    return { total, concluidas, emAndamento, pendentes, atrasadas, semProjeto, progresso };
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

  const resumoFiltros = [
    searchQuery ? `Busca: "${searchQuery}"` : null,
    filtroProjeto === 'sem_projeto'
      ? 'Projeto: sem projeto'
      : filtroProjeto !== 'todos'
        ? `Projeto: ${projetos.find((projeto) => projeto.id === filtroProjeto)?.nome || 'selecionado'}`
        : null,
    filtroStatus !== 'todos'
      ? `Status: ${COLUNAS_KANBAN.find((coluna) => coluna.id === filtroStatus)?.titulo || filtroStatus}`
      : null,
    filtroPrioridade !== 'todas'
      ? `Prioridade: ${PRIORIDADES.find((prioridade) => prioridade.id === filtroPrioridade)?.label || filtroPrioridade}`
      : null,
  ].filter(Boolean) as string[];

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
            <MetricCard
              label="Total"
              value={stats.total}
              description="Volume geral monitorado neste board."
            />
            <MetricCard
              label="Pendentes"
              value={stats.pendentes}
              description="Itens que ainda nao entraram em execucao."
              tone="amber"
            />
            <MetricCard
              label="Em andamento"
              value={stats.emAndamento}
              description="Frentes ativas que merecem acompanhamento diario."
              tone="sky"
            />
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

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
            <DataPanel title="Leitura rapida do board">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Tarefas concluidas
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{stats.concluidas}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Entrega acumulada nesta janela.</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Atrasadas
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{stats.atrasadas}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Demandas que pedem replanejamento imediato.</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/35 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Sem projeto
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{stats.semProjeto}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Itens sem amarracao formal no portifolio.</p>
                </div>
              </div>
            </DataPanel>

            <DataPanel title="Ritmo operacional">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/35 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Modo atual
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {viewType === 'kanban' ? 'Kanban para fluxo e gargalos' : 'Lista para triagem detalhada'}
                    </p>
                  </div>
                  <Badge variant="glass-dark">{viewType}</Badge>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/35 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Projetos ativos no filtro
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{projetosFiltrados.length} projetos</p>
                  </div>
                  <Badge variant="outline">{tarefasFiltradas.length} cards</Badge>
                </div>
              </div>
            </DataPanel>
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

            {temFiltrosAtivos && (
              <div className="flex flex-wrap items-center gap-2">
                {resumoFiltros.map((filtro) => (
                  <Badge key={filtro} variant="outline">
                    {filtro}
                  </Badge>
                ))}
              </div>
            )}

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
              <CardContent className="space-y-3 p-3">
                {tarefasFiltradas.map((tarefa) => {
                  const status = COLUNAS_KANBAN.find((c) => c.id === tarefa.status);
                  const prioridade = PRIORIDADES.find((p) => p.id === tarefa.prioridade);
                  const projeto = projetos.find((p) => p.id === tarefa.projeto_id);
                  const dataLimite = tarefa.data_limite || tarefa.deadline;

                  return (
                    <button
                      key={tarefa.id}
                      type="button"
                      onClick={() => handleCardClick(tarefa)}
                      className="w-full rounded-xl border border-border/70 bg-muted/20 p-4 text-left transition-all duration-300 hover:-translate-y-px hover:border-primary/35 hover:bg-card"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {status && (
                              <Badge variant={STATUS_BADGE_VARIANTS[tarefa.status]}>
                                {status.titulo}
                              </Badge>
                            )}
                            {prioridade && (
                              <Badge variant={PRIORIDADE_BADGE_VARIANTS[tarefa.prioridade] || 'outline'}>
                                {prioridade.label}
                              </Badge>
                            )}
                            <Badge variant="outline">{projeto?.nome || 'Sem projeto'}</Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{tarefa.titulo}</p>
                            {tarefa.descricao && (
                              <p className="line-clamp-2 text-sm text-muted-foreground">{tarefa.descricao}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:min-w-[260px]">
                          <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Prazo
                            </p>
                            <p className="mt-1 text-foreground">
                              {dataLimite ? new Date(dataLimite).toLocaleDateString('pt-BR') : 'Sem prazo'}
                            </p>
                          </div>
                          <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Responsavel
                            </p>
                            <p className="mt-1 text-foreground">{tarefa.responsavel || 'Nao atribuido'}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
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
