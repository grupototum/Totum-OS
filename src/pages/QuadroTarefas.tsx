import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { KanbanColumn } from '@/components/kanban';
import { TaskModal } from '@/components/tasks';
import { useTasks, Tarefa, StatusTarefa, COLUNAS_KANBAN, PRIORIDADES } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { Skeleton } from '@/components/ui/skeleton';

// View types
type ViewType = 'kanban' | 'lista';

export default function QuadroTarefas() {
  const { user } = useAuth();
  const {
    tarefas,
    projetos,
    loading,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    moverTarefa,
    criarProjeto,
    adicionarComentario,
    toggleSubtarefa,
    adicionarSubtarefa,
    removerSubtarefa,
  } = useTasks();

  // State
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

  // Filtered tasks
  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      // Search
      if (searchQuery && !tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !tarefa.descricao?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Project filter
      if (filtroProjeto !== 'todos') {
        if (filtroProjeto === 'sem_projeto' && tarefa.projeto_id) return false;
        if (filtroProjeto !== 'sem_projeto' && tarefa.projeto_id !== filtroProjeto) return false;
      }

      // Status filter (for list view)
      if (filtroStatus !== 'todos' && tarefa.status !== filtroStatus) return false;

      // Priority filter
      if (filtroPrioridade !== 'todas' && tarefa.prioridade !== filtroPrioridade) return false;

      return true;
    });
  }, [tarefas, searchQuery, filtroProjeto, filtroStatus, filtroPrioridade]);

  // Tasks grouped by status (for kanban)
  const tarefasPorColuna = useMemo(() => {
    const grouped: Record<StatusTarefa, Tarefa[]> = {
      a_fazer: [],
      fazendo: [],
      revisao: [],
      feito: [],
    };

    tarefasFiltradas.forEach((tarefa) => {
      grouped[tarefa.status].push(tarefa);
    });

    // Sort by position
    Object.keys(grouped).forEach((key) => {
      grouped[key as StatusTarefa].sort((a, b) => (a.posicao || 0) - (b.posicao || 0));
    });

    return grouped;
  }, [tarefasFiltradas]);

  // Stats
  const stats = useMemo(() => {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.status === 'feito').length;
    const emAndamento = tarefas.filter(t => t.status === 'fazendo').length;
    const aFazer = tarefas.filter(t => t.status === 'a_fazer').length;
    const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return { total, concluidas, emAndamento, aFazer, progresso };
  }, [tarefas]);

  // Handlers
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

  const handleDrop = async (tarefaId: string, novoStatus: StatusTarefa, posicao: number) => {
    setIsDragging(false);
    await moverTarefa(tarefaId, novoStatus, posicao);
  };

  const handleSaveTarefa = async (tarefaData: Partial<Tarefa>): Promise<boolean> => {
    if (modalMode === 'create') {
      const result = await criarTarefa(tarefaData);
      return !!result;
    } else if (tarefaSelecionada) {
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

  const temFiltrosAtivos = searchQuery || filtroProjeto !== 'todos' || 
    filtroStatus !== 'todos' || filtroPrioridade !== 'todas';

  if (loading) {
    return (
      <AppLayout>
        <div className="h-full p-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex gap-4 h-[calc(100vh-250px)]">
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
      <div className="h-full flex flex-col bg-[#EAEAE5]">
        {/* Header */}
        <div className="border-b border-stone-300 bg-white/50">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                  Quadro de Tarefas
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Organize projetos e acompanhe o progresso
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Stats summary */}
                <div className="hidden md:flex items-center gap-4 mr-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-stone-900">{stats.total}</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider">Total</div>
                  </div>
                  <div className="w-px h-8 bg-stone-300" />
                  <div className="text-center">
                    <div className="text-xl font-semibold text-emerald-600">{stats.concluidas}</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider">Feitas</div>
                  </div>
                  <div className="w-px h-8 bg-stone-300" />
                  <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E7E5E4" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.5" fill="none"
                          stroke="#1C1917" strokeWidth="3"
                          strokeDasharray={`${stats.progresso} ${100 - stats.progresso}`}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                        {stats.progresso}%
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNovaTarefa}
                  className="bg-stone-900 hover:bg-stone-800 text-white"
                >
                  <Icon icon="solar:add-circle-linear" className="w-5 h-5 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-stone-300 bg-white/30">
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Icon 
                  icon="solar:magnifer-linear" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" 
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tarefas..."
                  className="pl-10 bg-white border-stone-300"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-stone-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType('kanban')}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${viewType === 'kanban' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}
                  `}
                >
                  <Icon icon="solar:kanban-linear" className="w-4 h-4" />
                  Kanban
                </button>
                <button
                  onClick={() => setViewType('lista')}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${viewType === 'lista' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}
                  `}
                >
                  <Icon icon="solar:list-linear" className="w-4 h-4" />
                  Lista
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${showFilters || temFiltrosAtivos 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}
                `}
              >
                <Icon icon="solar:filter-linear" className="w-4 h-4" />
                Filtros
                {temFiltrosAtivos && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              {temFiltrosAtivos && (
                <button
                  onClick={limparFiltros}
                  className="text-xs text-stone-500 hover:text-stone-700 underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 flex items-center gap-4 flex-wrap">
                    {/* Projeto filter */}
                    <div className="space-y-1">
                      <label className="text-xs text-stone-500">Projeto</label>
                      <select
                        value={filtroProjeto}
                        onChange={(e) => setFiltroProjeto(e.target.value)}
                        className="h-9 px-3 rounded-md border border-stone-300 bg-white text-sm"
                      >
                        <option value="todos">Todos os projetos</option>
                        <option value="sem_projeto">Sem projeto</option>
                        {projetos.map(p => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status filter (for list view) */}
                    {viewType === 'lista' && (
                      <div className="space-y-1">
                        <label className="text-xs text-stone-500">Status</label>
                        <select
                          value={filtroStatus}
                          onChange={(e) => setFiltroStatus(e.target.value as StatusTarefa | 'todos')}
                          className="h-9 px-3 rounded-md border border-stone-300 bg-white text-sm"
                        >
                          <option value="todos">Todos</option>
                          {COLUNAS_KANBAN.map(c => (
                            <option key={c.id} value={c.id}>{c.titulo}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Prioridade filter */}
                    <div className="space-y-1">
                      <label className="text-xs text-stone-500">Prioridade</label>
                      <select
                        value={filtroPrioridade}
                        onChange={(e) => setFiltroPrioridade(e.target.value)}
                        className="h-9 px-3 rounded-md border border-stone-300 bg-white text-sm"
                      >
                        <option value="todas">Todas</option>
                        {PRIORIDADES.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {viewType === 'kanban' ? (
            <div className="h-full overflow-x-auto">
              <div className="h-full flex gap-4 p-6 min-w-max">
                {COLUNAS_KANBAN.map((coluna) => (
                  <KanbanColumn
                    key={coluna.id}
                    id={coluna.id}
                    titulo={coluna.titulo}
                    cor={coluna.cor}
                    tarefas={tarefasPorColuna[coluna.id]}
                    projetos={projetos}
                    onDrop={handleDrop}
                    onCardClick={handleCardClick}
                    isDragging={isDragging}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-[1400px] mx-auto">
                <div className="bg-white rounded-lg border border-stone-300 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-300">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Tarefa</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Projeto</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Prioridade</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Data Limite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {tarefasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-stone-400">
                            <Icon icon="solar:inbox-linear" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Nenhuma tarefa encontrada</p>
                          </td>
                        </tr>
                      ) : (
                        tarefasFiltradas.map((tarefa) => (
                          <tr
                            key={tarefa.id}
                            onClick={() => handleCardClick(tarefa)}
                            className="hover:bg-stone-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-medium text-stone-900">{tarefa.titulo}</div>
                              {tarefa.descricao && (
                                <div className="text-sm text-stone-500 line-clamp-1">{tarefa.descricao}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {tarefa.projeto_id ? (
                                <Badge variant="outline" className="text-xs">
                                  {projetos.find(p => p.id === tarefa.projeto_id)?.nome || 'Projeto'}
                                </Badge>
                              ) : (
                                <span className="text-sm text-stone-400">—</span>
                              )}
                            </td>
                            
                            <td className="py-3 px-4">
                              <Badge
                                style={{
                                  backgroundColor: `${COLUNAS_KANBAN.find(c => c.id === tarefa.status)?.cor}15`,
                                  color: COLUNAS_KANBAN.find(c => c.id === tarefa.status)?.cor,
                                  borderColor: `${COLUNAS_KANBAN.find(c => c.id === tarefa.status)?.cor}30`,
                                }}
                                variant="outline"
                                className="text-xs"
                              >
                                {COLUNAS_KANBAN.find(c => c.id === tarefa.status)?.titulo}
                              </Badge>
                            </td>
                            
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Icon 
                                  icon="solar:flag-bold" 
                                  className="w-4 h-4"
                                  style={{ color: PRIORIDADES.find(p => p.id === tarefa.prioridade)?.cor }}
                                />
                                <span className="text-sm">
                                  {PRIORIDADES.find(p => p.id === tarefa.prioridade)?.label}
                                </span>
                              </div>
                            </td>
                            
                            <td className="py-3 px-4">
                              <span className="text-sm text-stone-600">
                                {tarefa.data_limite 
                                  ? new Date(tarefa.data_limite).toLocaleDateString('pt-BR')
                                  : '—'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <TaskModal
          tarefa={tarefaSelecionada}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          projetos={projetos}
          onSave={handleSaveTarefa}
          onDelete={handleDeleteTarefa}
          onToggleSubtarefa={toggleSubtarefa}
          onAddSubtarefa={async (tarefaId: string, titulo: string) => { const result = await adicionarSubtarefa(tarefaId, titulo); return !!result; }}
          onRemoveSubtarefa={removerSubtarefa}
          onAddComentario={async (tarefaId: string, conteudo: string) => { await adicionarComentario(tarefaId, conteudo, user?.email || 'Sistema'); }}
          currentUser={user?.email || 'Sistema'}
          mode={modalMode}
        />
      </div>
    </AppLayout>
  );
}
