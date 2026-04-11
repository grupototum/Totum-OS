import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAgentTasks, type AgentTask, type LogExecucao } from '@/hooks/useAgentTasks';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentTaskManagerProps {
  agenteId?: string;
  agenteName?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Play }> = {
  pendente: { label: 'Pendente', color: 'bg-muted text-muted-foreground', icon: Clock },
  executando: { label: 'Executando', color: 'bg-primary/20 text-primary', icon: RefreshCw },
  concluido: { label: 'Concluído', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
  erro: { label: 'Erro', color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
};

export function AgentTaskManager({ agenteId, agenteName }: AgentTaskManagerProps) {
  const { tasks, logs, loading, executarTarefa } = useAgentTasks(agenteId);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  const taskLogs = (taskId: string) => logs.filter(l => l.tarefa_id === taskId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Tarefas do Agente {agenteName || agenteId}
        </h3>
        <Badge variant="outline" className="text-xs">
          {tasks.length} tarefas
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <Card className="bg-card/50 border-border/40">
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma tarefa atribuída a este agente.
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <AnimatePresence>
            {tasks.map((task, idx) => {
              const config = statusConfig[task.status] || statusConfig.pendente;
              const StatusIcon = config.icon;
              const isSelected = selectedTask === task.id;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="mb-3"
                >
                  <Card 
                    className={`bg-card/50 border-border/40 cursor-pointer transition-all hover:border-primary/40 ${isSelected ? 'border-primary/60' : ''}`}
                    onClick={() => setSelectedTask(isSelected ? null : task.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{task.titulo}</h4>
                          {task.descricao && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.descricao}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={`text-[10px] ${config.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            {task.ultima_execucao && (
                              <span className="text-[10px] text-muted-foreground">
                                Última exec: {new Date(task.ultima_execucao).toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            executarTarefa(task.id, agenteName || agenteId || 'agente');
                          }}
                          className="shrink-0"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Executar
                        </Button>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t border-border/40"
                        >
                          <h5 className="text-sm font-medium text-foreground mb-2">Logs de execução</h5>
                          {taskLogs(task.id).length === 0 ? (
                            <p className="text-xs text-muted-foreground">Nenhum log disponível</p>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {taskLogs(task.id).map(log => (
                                <div key={log.id} className="text-xs bg-muted/30 rounded p-2">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{log.status}</span>
                                    <span className="text-muted-foreground">
                                      {new Date(log.created_at).toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                  {log.resultado && <p className="mt-1 text-muted-foreground">{log.resultado}</p>}
                                  {log.erro && <p className="mt-1 text-destructive">{log.erro}</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ScrollArea>
      )}
    </div>
  );
}
