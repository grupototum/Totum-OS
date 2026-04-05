import { useState } from 'react';
import { motion } from 'framer-motion';
import { KanbanCard } from './KanbanCard';
import { StatusTarefa, Tarefa, Projeto } from '@/hooks/useTasks';
import { Icon } from '@iconify/react';

interface KanbanColumnProps {
  id: StatusTarefa;
  titulo: string;
  cor: string;
  tarefas: Tarefa[];
  projetos: Projeto[];
  onDrop: (tarefaId: string, novoStatus: StatusTarefa, posicao: number) => void;
  onCardClick: (tarefa: Tarefa) => void;
  isDragging: boolean;
}

export function KanbanColumn({ 
  id, 
  titulo, 
  cor, 
  tarefas, 
  projetos,
  onDrop, 
  onCardClick,
  isDragging 
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);

    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    const y = e.clientY - rect.top + scrollTop;
    
    const cardHeight = 100; // Approximate card height
    const index = Math.floor(y / cardHeight);
    setDropIndicatorIndex(Math.min(Math.max(0, index), tarefas.length));
  };

  const handleDragLeave = () => {
    setIsOver(false);
    setDropIndicatorIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    const tarefaId = e.dataTransfer.getData('tarefaId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus') as StatusTarefa;
    
    if (!tarefaId) return;

    // Calculate final position
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    const y = e.clientY - rect.top + scrollTop;
    const cardHeight = 100;
    let index = Math.floor(y / cardHeight);
    index = Math.min(Math.max(0, index), tarefas.length);

    // If same column, adjust position
    if (sourceStatus === id) {
      const sourceIndex = tarefas.findIndex(t => t.id === tarefaId);
      if (sourceIndex !== -1 && index > sourceIndex) {
        index--;
      }
    }

    onDrop(tarefaId, id, index);
    setDropIndicatorIndex(null);
  };

  const getProjetoNome = (projetoId?: string | null) => {
    if (!projetoId) return null;
    const projeto = projetos.find(p => p.id === projetoId);
    return projeto?.nome || null;
  };

  return (
    <div className="flex flex-col h-full min-w-[280px] w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: cor }}
          />
          <h3 className="text-sm font-semibold text-stone-700 tracking-tight">
            {titulo}
          </h3>
          <span className="text-xs text-stone-400 font-mono bg-stone-200/50 px-2 py-0.5 rounded-full">
            {tarefas.length}
          </span>
        </div>
        <button className="p-1 hover:bg-stone-200/50 rounded transition-colors">
          <Icon icon="solar:add-circle-linear" className="w-5 h-5 text-stone-400 hover:text-stone-600" />
        </button>
      </div>

      {/* Column Body */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 bg-stone-100/50 rounded-lg border border-stone-200/50 
          transition-all duration-200 overflow-y-auto p-2
          ${isOver ? 'bg-stone-200/50 border-stone-300 ring-2 ring-stone-200/50' : ''}
        `}
        style={{ minHeight: '400px' }}
      >
        <div className="space-y-2">
          {tarefas.map((tarefa, index) => (
            <div key={tarefa.id}>
              {dropIndicatorIndex === index && isOver && (
                <div className="h-1 bg-stone-900/30 rounded-full my-1" />
              )}
              <KanbanCard 
                tarefa={tarefa}
                projetoNome={getProjetoNome(tarefa.projeto_id)}
                onClick={() => onCardClick(tarefa)}
              />
            </div>
          ))}
          {dropIndicatorIndex === tarefas.length && isOver && (
            <div className="h-1 bg-stone-900/30 rounded-full my-1" />
          )}
          {tarefas.length === 0 && !isDragging && (
            <div className="flex flex-col items-center justify-center py-8 text-stone-400">
              <Icon icon="solar:inbox-linear" className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs">Sem tarefas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
