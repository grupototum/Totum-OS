import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAgents } from '@/hooks/useAgents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function EstruturaTime() {
  const navigate = useNavigate();
  const { agents, isLoading: loading } = useAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);

  // Organize agents by hierarchy level for display
  const agentsByLevel = agents.reduce((acc, agent) => {
    const level = agent.hierarchy_level || 0;
    if (!acc[level]) acc[level] = [];
    acc[level].push(agent);
    return acc;
  }, {} as Record<number, typeof agents>);

  const hierarchyLevels = Object.keys(agentsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto border-l border-r border-border min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 border-b border-border"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center">
                    <Icon icon="solar:diagram-up-linear" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-medium text-white tracking-tighter">
                      Estrutura do Time
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-zinc-400">
                      Hierarquia · {agents.length} agentes
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/painel-agentes')}
                  className="border-border"
                >
                  <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 mr-2" />
                  Painel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/hub-agentes')}
                  className="border-border"
                >
                  <Icon icon="solar:graph-new-linear" className="w-4 h-4 mr-2" />
                  Hub N8N
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Hierarchy Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-8 border-b border-border bg-muted/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center">
                  <Icon icon="solar:crown-linear" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Orquestrador</p>
                  <p className="text-xs text-zinc-400">TOT · Nível 0</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
                  <Icon icon="solar:users-group-two-rounded-linear" className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Modos de Operação</p>
                  <p className="text-xs text-zinc-400">Pablo, Data, Hug · Nível 1</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center">
                  <Icon icon="solar:stars-linear" className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Agentes Especializados</p>
                  <p className="text-xs text-zinc-400">KVirtuoso, Radar, Ghost... · Nível 2+</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hierarchy Tree */}
          <div className="p-8">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-stone-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Display by levels */}
                {hierarchyLevels.map((level, levelIndex) => (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: levelIndex * 0.15, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm font-medium text-stone-700">
                        {level}
                      </div>
                      <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                        {level === 0 ? 'Orquestrador' : 
                         level === 1 ? 'Modos de Operação' : 
                         `Nível ${level}`}
                      </h3>
                      <div className="flex-1 h-px bg-zinc-800" />
                      <Badge variant="outline" className="text-[10px]">
                        {agentsByLevel[level].length} agente{agentsByLevel[level].length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {agentsByLevel[level].map((agent) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`
                            p-4 bg-white rounded-lg border cursor-pointer transition-all
                            ${selectedAgentId === agent.id 
                              ? 'border-stone-900 shadow-lg' 
                              : 'border-border hover:border-stone-400'
                            }
                          `}
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            navigate(`/agente/${agent.id}`);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center text-xl
                                ${agent.is_orchestrator 
                                  ? 'bg-stone-900 text-white' 
                                  : 'bg-stone-200'
                                }
                              `}>
                                {agent.emoji}
                              </div>
                              <span className={`
                                absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white
                                ${agent.status === 'online' ? 'bg-emerald-500' : 
                                  agent.status === 'idle' ? 'bg-amber-500' : 'bg-stone-400'}
                              `} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white truncate">{agent.name}</p>
                                {agent.is_orchestrator && (
                                  <Badge className="bg-stone-900 text-white text-[9px]">
                                    Orquestrador
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 truncate">{agent.role}</p>
                            </div>

                            <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:check-circle-linear" className="w-4 h-4" />
                                {agent.success_rate || 0}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="solar:task-square-linear" className="w-4 h-4" />
                                {agent.daily_tasks || 0}
                              </span>
                            </div>

                            <Icon icon="solar:alt-arrow-right-linear" className="w-5 h-5 text-stone-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
