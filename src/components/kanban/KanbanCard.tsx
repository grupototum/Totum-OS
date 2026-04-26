import { useState } from 'react';
import { Tarefa, PRIORIDADES } from '@/hooks/useTasks';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';

interface KanbanCardProps {
  tarefa: Tarefa;
  projetoNome?: string | null;
  onClick: () => void;
}

const TAG_COLORS: Record<string, { variant: 'error' | 'info' | 'accent' | 'default' | 'success' | 'secondary' }> = {
  'bug': { variant: 'error' },
  'feature': { variant: 'info' },
  'design': { variant: 'accent' },
  'marketing': { variant: 'default' },
  'urgente': { variant: 'warning' as 'default' },
  'cliente': { variant: 'success' },
  'interno': { variant: 'secondary' },
};

const getTagStyle = (tag: string) => {
  const normalized = tag.toLowerCase();
  return TAG_COLORS[normalized] || { variant: 'outline' as const };
};

const getPrioridadeIcon = (prioridade: string) => {
  switch (prioridade) {
    case 'urgente': return 'solar:flag-bold';
    case 'alta': return 'solar:flag-linear';
    case 'media': return 'solar:flag-2-linear';
    default: return 'solar:flag-2-linear';
  }
};

const getPrioridadeColor = (prioridade: string) => {
  const p = PRIORIDADES.find(p => p.id === prioridade);
  return p?.cor || '#78716C';
};

export function KanbanCard({ tarefa, projetoNome, onClick }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const subtarefasConcluidas = (tarefa.subtarefas || []).filter(st => st.concluida).length;
  const totalSubtarefas = (tarefa.subtarefas || []).length;
  const progressoSubtarefas = totalSubtarefas > 0 
    ? (subtarefasConcluidas / totalSubtarefas) * 100 
    : 0;

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('tarefaId', tarefa.id);
    e.dataTransfer.setData('sourceStatus', tarefa.status);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatarData = (data?: string | null) => {
    if (!data) return null;
    const d = new Date(data);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (d.toDateString() === hoje.toDateString()) return 'Hoje';
    if (d.toDateString() === amanha.toDateString()) return 'Amanhã';
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const dataLimite = tarefa.data_limite || tarefa.deadline;
  const isAtrasada = dataLimite && new Date(dataLimite) < new Date() && tarefa.status !== 'concluida';
  const tags = tarefa.tags || [];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`
        relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 group
        transition-all duration-300 hover:-translate-y-px hover:border-primary/40
        hover:shadow-[0_18px_50px_-38px_hsl(var(--primary)/0.55)]
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/75 via-primary/10 to-transparent opacity-70" />

      <div className="mb-3 flex items-center justify-between gap-3">
        {projetoNome && (
          <span className="max-w-[65%] truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {projetoNome}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Icon
            icon={getPrioridadeIcon(tarefa.prioridade)}
            className="h-3.5 w-3.5"
            style={{ color: getPrioridadeColor(tarefa.prioridade) }}
          />
        </div>
      </div>

      <h4 className="mb-2 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {tarefa.titulo}
      </h4>

      {tarefa.descricao && (
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tarefa.descricao}
        </p>
      )}

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => {
            const style = getTagStyle(tag);
            return (
              <Badge key={tag} variant={style.variant} className="px-2 py-1 text-[9px] tracking-[0.2em]">
                {tag}
              </Badge>
            );
          })}
          {tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{tags.length - 3}</span>
          )}
        </div>
      )}

      {totalSubtarefas > 0 && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {subtarefasConcluidas}/{totalSubtarefas} subtarefas
            </span>
            <span className="text-[10px] text-muted-foreground">{Math.round(progressoSubtarefas)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressoSubtarefas}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border/70 pt-3">
        {tarefa.responsavel ? (
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-foreground">
              {tarefa.responsavel.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[88px] truncate text-[10px] text-muted-foreground">
              {tarefa.responsavel}
            </span>
          </div>
        ) : (
          <span className="text-[10px] italic text-muted-foreground">Sem responsavel</span>
        )}

        {dataLimite && (
          <span className={`
            text-[10px] flex items-center gap-1
            ${isAtrasada ? 'font-medium text-red-600 dark:text-red-300' : 'text-muted-foreground'}
          `}>
            <Icon icon="solar:calendar-linear" className="h-3 w-3" />
            {formatarData(dataLimite)}
          </span>
        )}
      </div>
    </div>
  );
}
