import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';
import { AgentClassification, classifyAgent } from '@/hooks/useAgentClassification';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
  index?: number;
  showClassification?: boolean;
  compact?: boolean;
}

export function AgentCard({ 
  agent, 
  onClick, 
  index = 0, 
  showClassification = true,
  compact = false 
}: AgentCardProps) {
  const classification = classifyAgent(agent.name);
  const isNew = (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

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

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
      >
        <Card
          onClick={onClick}
          className="cursor-pointer border-stone-300 bg-[#EAEAE5] hover:bg-white hover:shadow-lg transition-all duration-300 group"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-2xl border border-stone-300 group-hover:border-stone-400 transition-colors">
                  {agent.emoji}
                </div>
                {isNew && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-stone-900 text-white rounded-full">
                    New
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stone-900 truncate">{agent.name}</p>
                  <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                </div>
                <p className="text-xs text-stone-500 truncate">{agent.role}</p>
              </div>
              {showClassification && (
                <Icon 
                  icon={classification.icon} 
                  className={`w-4 h-4 ${classification.color}`}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        onClick={onClick}
        className="cursor-pointer border-stone-300 bg-[#EAEAE5] hover:bg-white hover:shadow-lg transition-all duration-500 group overflow-hidden"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-2xl border border-stone-300 group-hover:border-stone-400 transition-colors">
                  {agent.emoji}
                </div>
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${statusColors[agent.status]} rounded-full ring-2 ring-[#EAEAE5] group-hover:ring-white transition-colors`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-stone-900 text-lg tracking-tight">{agent.name}</h3>
                  {isNew && (
                    <Badge className="bg-stone-900 text-white text-[9px] uppercase tracking-wider hover:bg-stone-800">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-stone-500">{agent.role}</p>
              </div>
            </div>
            {showClassification && (
              <Badge 
                variant="outline" 
                className={`${classification.bgColor} ${classification.color} ${classification.borderColor} text-[10px] uppercase tracking-wider`}
              >
                <Icon icon={classification.icon} className="w-3 h-3 mr-1" />
                {classification.label}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-stone-300">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Tarefas</p>
              <p className="text-xl font-medium text-stone-900 tracking-tight">{agent.daily_tasks || 0}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Sucesso</p>
              <p className="text-xl font-medium text-emerald-600 tracking-tight">{agent.success_rate || 0}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Créditos</p>
              <p className="text-xl font-medium text-stone-900 tracking-tight">{agent.credits_used || 0}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
              <span className="text-xs text-stone-500">{statusLabels[agent.status]}</span>
            </div>
            <span className="text-xs text-stone-400 group-hover:text-stone-600 transition-colors">
              Ver detalhes →
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
