import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';

interface AgentListProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  selectedAgentId?: string;
}

export function AgentList({ agents, onAgentClick, selectedAgentId }: AgentListProps) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Em espera',
    maintenance: 'Manutenção',
  };

  return (
    <div className="space-y-2">
      {agents.map((agent, index) => {
        const classification = classifyAgent(agent.name);
        const isSelected = selectedAgentId === agent.id;
        const isNew = (() => {
          const created = new Date(agent.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        })();

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card
              onClick={() => onAgentClick?.(agent)}
              className={`
                cursor-pointer transition-all duration-300 border-stone-300
                ${isSelected 
                  ? 'bg-white border-stone-900 shadow-md' 
                  : 'bg-[#EAEAE5] hover:bg-white hover:shadow-sm'
                }
              `}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-xl border-2
                      ${agent.is_orchestrator 
                        ? 'bg-stone-100 border-stone-900' 
                        : 'bg-stone-200 border-stone-300'
                      }
                    `}>
                      {agent.emoji}
                    </div>
                    <span className={`
                      absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#EAEAE5]
                      ${statusColors[agent.status]}
                    `} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-stone-900 truncate">
                        {agent.name}
                      </h4>
                      {isNew && (
                        <Badge className="bg-stone-900 text-white text-[9px] uppercase tracking-wider shrink-0">
                          New
                        </Badge>
                      )}
                      {agent.is_orchestrator && (
                        <Badge variant="outline" className="text-[9px] border-amber-400 text-amber-600 shrink-0">
                          <Icon icon="solar:crown-linear" className="w-3 h-3 mr-1" />
                          Orquestrador
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate">{agent.role}</p>
                  </div>

                  {/* Classification */}
                  <Badge 
                    variant="outline" 
                    className={`${classification.bgColor} ${classification.color} ${classification.borderColor} text-[10px] uppercase tracking-wider hidden sm:flex shrink-0`}
                  >
                    <Icon icon={classification.icon} className="w-3 h-3 mr-1" />
                    {classification.label}
                  </Badge>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-4 text-xs text-stone-500 shrink-0">
                    <span className="flex items-center gap-1" title="Taxa de sucesso">
                      <Icon icon="solar:check-circle-linear" className="w-3.5 h-3.5" />
                      {agent.success_rate || 0}%
                    </span>
                    <span className="flex items-center gap-1" title="Tarefas hoje">
                      <Icon icon="solar:task-square-linear" className="w-3.5 h-3.5" />
                      {agent.daily_tasks || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Créditos usados">
                      <Icon icon="solar:wallet-money-linear" className="w-3.5 h-3.5" />
                      {agent.credits_used || 0}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="text-xs text-stone-500 shrink-0 hidden sm:block">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                      {statusLabels[agent.status]}
                    </span>
                  </div>

                  {/* Arrow */}
                  <Icon 
                    icon="solar:alt-arrow-right-linear" 
                    className={`w-5 h-5 shrink-0 transition-colors ${isSelected ? 'text-stone-900' : 'text-stone-400'}`} 
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="solar:ghost-linear" className="w-12 h-12 mx-auto text-stone-400 mb-3" />
          <p className="text-sm text-stone-500">Nenhum agente encontrado</p>
        </div>
      )}
    </div>
  );
}
