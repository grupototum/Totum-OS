import { useState } from 'react';
import { Tarefa, PRIORIDADES } from '@/hooks/useTasks';
import { Icon } from '@iconify/react';

interface KanbanCardProps {
  tarefa: Tarefa;
  projetoNome?: string | null;
  onClick: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'bug': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  'feature': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'design': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'marketing': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  'urgente': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'cliente': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  'interno': { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
};

const getTagStyle = (tag: string) => {
  const normalized = tag.toLowerCase();
  return TAG_COLORS[normalized] || { 
    bg: 'bg-stone-100', 
    text: 'text-stone-600', 
    border: 'border-stone-200' 
  };
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
        relative bg-card border border-border p-3 cursor-pointer group overflow-hidden
        transition-all duration-500 hover:border-primary/40
        hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)]
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
    >
      {/* Corner marks */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 transition-all duration-500 group-hover:w-3 group-hover:h-3 group-hover:border-primary pointer-events-none" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50 transition-all duration-500 group-hover:w-3 group-hover:h-3 group-hover:border-primary pointer-events-none" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50 transition-all duration-500 group-hover:w-3 group-hover:h-3 group-hover:border-primary pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 transition-all duration-500 group-hover:w-3 group-hover:h-3 group-hover:border-primary pointer-events-none" />
      {/* Header: Projeto + Prioridade */}
      <div className="flex items-center justify-between mb-2">
        {projetoNome && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 truncate max-w-[60%]">
            {projetoNome}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto">
          <Icon 
            icon={getPrioridadeIcon(tarefa.prioridade)} 
            className="w-3.5 h-3.5" 
            style={{ color: getPrioridadeColor(tarefa.prioridade) }} 
          />
        </div>
      </div>

      {/* Título */}
      <h4 className="text-sm font-medium text-stone-900 mb-2 line-clamp-2 leading-snug">
        {tarefa.titulo}
      </h4>

      {/* Description preview */}
      {tarefa.descricao && (
        <p className="text-xs text-stone-500 mb-3 line-clamp-2">
          {tarefa.descricao}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map(tag => {
            const style = getTagStyle(tag);
            return (
              <span 
                key={tag}
                className={`
                  text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border
                  ${style.bg} ${style.text} ${style.border}
                `}
              >
                {tag}
              </span>
            );
          })}
          {tags.length > 3 && (
            <span className="text-[9px] text-stone-400">+{tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Subtarefas progress */}
      {totalSubtarefas > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-stone-500">
              {subtarefasConcluidas}/{totalSubtarefas} subtarefas
            </span>
            <span className="text-[10px] text-stone-400">{Math.round(progressoSubtarefas)}%</span>
          </div>
          <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressoSubtarefas}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: Responsável + Data */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        {tarefa.responsavel ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[9px] font-semibold text-stone-600">
              {tarefa.responsavel.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] text-stone-500 truncate max-w-[80px]">
              {tarefa.responsavel}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-stone-400 italic">Sem responsável</span>
        )}

        {dataLimite && (
          <span className={`
            text-[10px] flex items-center gap-1
            ${isAtrasada ? 'text-red-500 font-medium' : 'text-stone-400'}
          `}>
            <Icon icon="solar:calendar-linear" className="w-3 h-3" />
            {formatarData(dataLimite)}
          </span>
        )}
      </div>
    </div>
  );
}
