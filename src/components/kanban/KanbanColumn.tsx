import { useState } from 'react';
import { motion } from 'framer-motion';
import { KanbanCard } from './KanbanCard';
import { StatusTarefa, Tarefa, Projeto } from '@/hooks/useTasks';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="flex h-full min-w-[296px] w-[296px] flex-col bg-card/90 backdrop-blur-sm">
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-3 w-3 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.05)]" style={{ backgroundColor: cor }} />
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground tracking-tight">
                {titulo}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Etapa do fluxo
              </p>
            </div>
          </div>
          <Badge variant="outline">{tarefas.length}</Badge>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex-1 rounded-2xl border border-dashed p-2 transition-all duration-200 overflow-y-auto
            ${isOver ? 'border-primary bg-primary/6 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.1)]' : 'border-border bg-muted/28'}
          `}
          style={{ minHeight: '420px' }}
        >
          <div className="space-y-3">
            {tarefas.map((tarefa, index) => (
              <div key={tarefa.id}>
                {dropIndicatorIndex === index && isOver && (
                  <motion.div
                    layout
                    className="my-2 h-1.5 rounded-full bg-primary/50"
                  />
                )}
                <KanbanCard
                  tarefa={tarefa}
                  projetoNome={getProjetoNome(tarefa.projeto_id)}
                  onClick={() => onCardClick(tarefa)}
                />
              </div>
            ))}
            {dropIndicatorIndex === tarefas.length && isOver && (
              <motion.div layout className="my-2 h-1.5 rounded-full bg-primary/50" />
            )}
            {tarefas.length === 0 && !isDragging && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/80 px-4 py-10 text-center">
                <Icon icon="solar:inbox-linear" className="mb-3 h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">Sem tarefas nesta etapa</p>
                <p className="mt-1 text-xs text-muted-foreground">Arraste um card para mover o fluxo.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
