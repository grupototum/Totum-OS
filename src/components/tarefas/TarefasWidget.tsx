import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  User,
  Filter,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks, type Tarefa, type StatusTarefa, type PrioridadeTarefa } from '@/hooks/useTasks';

const statusConfig = {
  a_fazer: { label: 'A Fazer', icon: Circle, color: 'bg-gray-500', textColor: 'text-gray-500' },
  fazendo: { label: 'Fazendo', icon: Clock, color: 'bg-amber-500', textColor: 'text-amber-500' },
  revisao: { label: 'Revisão', icon: Clock, color: 'bg-blue-500', textColor: 'text-blue-500' },
  feito: { label: 'Feito', icon: CheckCircle2, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  media: { label: 'Média', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  alta: { label: 'Alta', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  urgente: { label: 'Urgente', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

function CardSkeleton() {
  return <Skeleton className="h-32 w-full rounded-xl" />;
}

function TarefaCard({ 
  tarefa, 
  onEdit, 
  onDelete,
  onStatusChange,
}: { 
  tarefa: Tarefa; 
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: StatusTarefa) => void;
}) {
  const status = statusConfig[tarefa.status];
  const prioridade = prioridadeConfig[tarefa.prioridade];
  const StatusIcon = status.icon;

  const formatarData = (data: string | null) => {
    if (!data) return null;
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const estaAtrasada = () => {
    if (!tarefa.data_limite || tarefa.status === 'feito') return false;
    return new Date(tarefa.data_limite) < new Date();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="group p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-border transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => {
                const proximoStatus: Record<StatusTarefa, StatusTarefa> = {
                  a_fazer: 'fazendo',
                  fazendo: 'feito',
                  feito: 'a_fazer',
                  revisao: 'feito',
                };
                onStatusChange(tarefa.id, proximoStatus[tarefa.status]);
              }}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                tarefa.status === 'feito' 
                  ? 'bg-emerald-500 text-white' 
                  : 'border-2 border-muted-foreground/30 hover:border-primary'
              }`}
            >
              {tarefa.status === 'feito' && <CheckCircle2 className="w-3 h-3" />}
            </button>
            <span className={`font-medium text-sm ${tarefa.status === 'feito' ? 'line-through text-muted-foreground' : ''}`}>
              {tarefa.titulo}
            </span>
          </div>

          {tarefa.descricao && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{tarefa.descricao}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[10px] ${prioridade.color}`}>
              {prioridade.label}
            </Badge>

            {tarefa.responsavel && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <User className="w-3 h-3" />
                {tarefa.responsavel}
              </div>
            )}

            {tarefa.data_limite && (
              <div className={`flex items-center gap-1 text-[10px] ${estaAtrasada() ? 'text-red-500' : 'text-muted-foreground'}`}>
                <Calendar className="w-3 h-3" />
                {formatarData(tarefa.data_limite)}
                {estaAtrasada() && <span className="text-red-500 font-medium"> (Atrasada)</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(tarefa)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(tarefa.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function TarefasWidget() {
  const { 
    tarefas, 
    loading, 
    filtros, 
    setFiltros,
    criarTarefa, 
    atualizarTarefa, 
    deletarTarefa,
  } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Tarefa | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<StatusTarefa>('a_fazer');
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>('media');
  const [responsavel, setResponsavel] = useState('');
  const [dataLimite, setDataLimite] = useState('');

  // Calcular estatísticas
  const estatisticas = {
    total: tarefas.length,
    pendentes: tarefas.filter(t => t.status === 'a_fazer').length,
    emAndamento: tarefas.filter(t => t.status === 'fazendo').length,
    concluidas: tarefas.filter(t => t.status === 'feito').length,
    criticas: tarefas.filter(t => t.prioridade === 'urgente').length,
    altas: tarefas.filter(t => t.prioridade === 'alta').length,
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setStatus('a_fazer');
    setPrioridade('media');
    setResponsavel('');
    setDataLimite('');
    setEditando(null);
  };

  const handleOpenEdit = (tarefa: Tarefa) => {
    setEditando(tarefa);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao || '');
    setStatus(tarefa.status);
    setPrioridade(tarefa.prioridade);
    setResponsavel(tarefa.responsavel || '');
    setDataLimite(tarefa.data_limite ? tarefa.data_limite.slice(0, 16) : '');
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) return;

    const dto = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      status,
      prioridade,
      responsavel: responsavel.trim() || undefined,
      data_limite: dataLimite || undefined,
    };

    if (editando) {
      const sucesso = await atualizarTarefa(editando.id, dto);
      if (sucesso) {
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const sucesso = await criarTarefa(dto);
      if (sucesso) {
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleStatusChange = async (id: string, novoStatus: StatusTarefa) => {
    await atualizarTarefa(id, { status: novoStatus });
  };

  const tarefasFiltradas = tarefas.filter(t => {
    if (filtros?.status && t.status !== filtros.status) return false;
    if (filtros?.prioridade && t.prioridade !== filtros.prioridade) return false;
    if (filtros?.responsavel && !t.responsavel?.toLowerCase().includes(filtros.responsavel.toLowerCase())) return false;
    return true;
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Tarefas
            <span className="text-xs text-muted-foreground font-normal">({estatisticas.total})</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filtros
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8" onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-1" />
                  Nova
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editando ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Título *</label>
                    <Input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Digite o título da tarefa"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">Descrição</label>
                    <Textarea
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição opcional"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Status</label>
                      <Select value={status} onValueChange={(v) => setStatus(v as StatusTarefa)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a_fazer">A Fazer</SelectItem>
                          <SelectItem value="fazendo">Fazendo</SelectItem>
                          <SelectItem value="revisao">Revisão</SelectItem>
                          <SelectItem value="feito">Feito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">Prioridade</label>
                      <Select value={prioridade} onValueChange={(v) => setPrioridade(v as PrioridadeTarefa)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Responsável</label>
                      <Input
                        value={responsavel}
                        onChange={(e) => setResponsavel(e.target.value)}
                        placeholder="Nome"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1 block">Data Limite</label>
                      <Input
                        type="datetime-local"
                        value={dataLimite}
                        onChange={(e) => setDataLimite(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editando ? 'Salvar' : 'Criar'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex items-center gap-4 mt-3 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">{estatisticas.pendentes} a fazer</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{estatisticas.emAndamento} fazendo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">{estatisticas.concluidas} feito</span>
          </div>
        </div>

        {/* Filtros */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                <Select 
                  value={filtros.status || 'todos'} 
                  onValueChange={(v) => setFiltros({ ...filtros, status: v === 'todos' ? undefined : v as StatusTarefa })}
                >
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="a_fazer">A Fazer</SelectItem>
                    <SelectItem value="fazendo">Fazendo</SelectItem>
                    <SelectItem value="revisao">Revisão</SelectItem>
                    <SelectItem value="feito">Feito</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={filtros.prioridade || 'todas'} 
                  onValueChange={(v) => setFiltros({ ...filtros, prioridade: v === 'todas' ? undefined : v as PrioridadeTarefa })}
                >
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas prioridades</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setFiltros({})}
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : tarefasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma tarefa encontrada</p>
            <p className="text-xs">Clique em "Nova" para criar uma tarefa</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {tarefasFiltradas.map((tarefa) => (
                <TarefaCard
                  key={tarefa.id}
                  tarefa={tarefa}
                  onEdit={handleOpenEdit}
                  onDelete={deletarTarefa}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TarefasWidget;