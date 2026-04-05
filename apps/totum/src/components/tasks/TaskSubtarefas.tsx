import { useState } from 'react';
import { Tarefa } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskSubtarefasProps {
  tarefa: Tarefa;
  onToggle: (tarefaId: string, subtarefaId: string) => Promise<boolean>;
  onAdd: (tarefaId: string, titulo: string) => Promise<boolean>;
  onRemove: (tarefaId: string, subtarefaId: string) => Promise<boolean>;
}

export function TaskSubtarefas({ tarefa, onToggle, onAdd, onRemove }: TaskSubtarefasProps) {
  const [novaSubtarefa, setNovaSubtarefa] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  const handleAdd = async () => {
    if (!novaSubtarefa.trim()) return;
    setAdicionando(true);
    const success = await onAdd(tarefa.id, novaSubtarefa.trim());
    setAdicionando(false);
    if (success) {
      setNovaSubtarefa('');
    }
  };

  const subtarefasConcluidas = tarefa.subtarefas.filter(st => st.concluida).length;
  const progresso = tarefa.subtarefas.length > 0 
    ? (subtarefasConcluidas / tarefa.subtarefas.length) * 100 
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Progresso */}
      <div className="bg-white rounded-lg border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-stone-700">Progresso</span>
          <span className="text-sm font-semibold text-stone-900">
            {subtarefasConcluidas}/{tarefa.subtarefas.length}
          </span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-stone-500 mt-2">
          {progresso === 100 
            ? '✅ Todas as subtarefas concluídas!' 
            : `${Math.round(progresso)}% completo`}
        </p>
      </div>

      {/* Adicionar nova */}
      <div className="flex gap-2">
        <Input
          value={novaSubtarefa}
          onChange={(e) => setNovaSubtarefa(e.target.value)}
          placeholder="Adicionar nova subtarefa..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="bg-white border-stone-300"
        />
        <Button
          onClick={handleAdd}
          disabled={!novaSubtarefa.trim() || adicionando}
          className="bg-stone-900 hover:bg-stone-800 shrink-0"
        >
          <Icon icon="solar:add-circle-linear" className="w-5 h-5" />
        </Button>
      </div>

      {/* Lista de subtarefas */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tarefa.subtarefas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-stone-400"
            >
              <Icon icon="solar:checklist-minimalistic-linear" className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma subtarefa ainda</p>
              <p className="text-xs">Adicione itens ao checklist</p>
            </motion.div>
          ) : (
            tarefa.subtarefas.map((subtarefa, index) => (
              <motion.div
                key={subtarefa.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${subtarefa.concluida 
                    ? 'bg-stone-50 border-stone-200' 
                    : 'bg-white border-stone-200 hover:border-stone-300'}
                `}
              >
                <Checkbox
                  checked={subtarefa.concluida}
                  onCheckedChange={() => onToggle(tarefa.id, subtarefa.id)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                
                <span className={`
                  flex-1 text-sm transition-all
                  ${subtarefa.concluida ? 'line-through text-stone-400' : 'text-stone-700'}
                `}>
                  {subtarefa.titulo}
                </span>
                
                <button
                  onClick={() => onRemove(tarefa.id, subtarefa.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  style={{ opacity: 1 }}
                >
                  <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
