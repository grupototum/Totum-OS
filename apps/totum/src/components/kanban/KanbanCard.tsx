import { useState } from 'react';
import { motion } from 'framer-motion';
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
  
  const subtarefasConcluidas = tarefa.subtarefas.filter(st => st.concluida).length;
  const totalSubtarefas = tarefa.subtarefas.length;
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

  const formatarData = (data?: string) => {
    if (!data) return null;
    const d = new Date(data);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (d.toDateString() === hoje.toDateString()) return 'Hoje';
    if (d.toDateString() === amanha.toDateString()) return 'Amanhã';
    
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const isAtrasada = tarefa.data_limite && new Date(tarefa.data_limite) < new Date() && tarefa.status !== 'feito';

  return (
    <motion.div
      layoutId={tarefa.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-white rounded-lg border border-stone-200 p-3 cursor-pointer
        transition-shadow duration-200 hover:shadow-md hover:border-stone-300
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
    >
      {/* Header: Projeto + Prioridade */}
      <div className="flex items-center justify-between mb-2">
        {projetoNome ? (
          <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded truncate max-w-[120px]">
            {projetoNome}
          </span>
        ) : tarefa.tipo === 'unica' ? (
          <span className="text-[10px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded">
            Tarefa única
          </span>
        ) : (
          <span />
        )}
        
        <Icon 
          icon={getPrioridadeIcon(tarefa.prioridade)} 
          className="w-4 h-4"
          style={{ color: getPrioridadeColor(tarefa.prioridade) }}
        />
      </div>

      {/* Título */}
      <h4 className="text-sm font-medium text-stone-800 mb-2 line-clamp-2 leading-snug">
        {tarefa.titulo}
      </h4>

      {/* Tags */}
      {tarefa.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tarefa.tags.slice(0, 3).map((tag) => {
            const style = getTagStyle(tag);
            return (
              <span
                key={tag}
                className={`
                  text-[9px] px-1.5 py-0.5 rounded border truncate max-w-[80px]
                  ${style.bg} ${style.text} ${style.border}
                `}
              >
                {tag}
              </span>
            );
          })}
          {tarefa.tags.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
              +{tarefa.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Info */}
      <div className="flex items-center justify-between text-stone-400">
        <div className="flex items-center gap-2">
          {/* Subtarefas */}
          {totalSubtarefas > 0 && (
            <div className="flex items-center gap-1">
              <Icon icon="solar:checklist-linear" className="w-3.5 h-3.5" />
              <span className={`text-[10px] ${subtarefasConcluidas === totalSubtarefas ? 'text-emerald-500' : ''}`}>
                {subtarefasConcluidas}/{totalSubtarefas}
              </span>
            </div>
          )}
          
          {/* Comentários (placeholder) */}
          <div className="flex items-center gap-1">
            <Icon icon="solar:chat-dots-linear" className="w-3.5 h-3.5" />
            <span className="text-[10px]">0</span>
          </div>
        </div>

        {/* Data limite */}
        {tarefa.data_limite && (
          <div className={`flex items-center gap-1 ${isAtrasada ? 'text-red-500' : ''}`}>
            <Icon 
              icon={isAtrasada ? 'solar:alarm-bold' : 'solar:calendar-linear'} 
              className="w-3.5 h-3.5" 
            />
            <span className="text-[10px] font-medium">
              {formatarData(tarefa.data_limite)}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar for subtarefas */}
      {totalSubtarefas > 0 && (
        <div className="mt-2">
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressoSubtarefas}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
