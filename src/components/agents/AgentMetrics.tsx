import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { Progress } from '@/components/ui/progress';
import type { AgentMetrics as Metrics } from '@/hooks/useAgents';

interface AgentMetricsProps {
  metrics: Metrics;
  loading?: boolean;
}

export function AgentMetrics({ metrics, loading = false }: AgentMetricsProps) {
  const cards = [
    {
      label: 'Total de Agentes',
      value: metrics.totalAgents,
      icon: 'solar:users-group-rounded-linear',
      color: 'text-stone-900',
      bgColor: 'bg-stone-100',
      borderColor: 'border-stone-300',
    },
    {
      label: 'Agentes Online',
      value: metrics.onlineAgents,
      icon: 'solar:check-circle-linear',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      subtext: `${Math.round((metrics.onlineAgents / Math.max(metrics.totalAgents, 1)) * 100)}% ativos`,
    },
    {
      label: 'Tarefas Completadas',
      value: metrics.totalTasks.toLocaleString(),
      icon: 'solar:task-square-linear',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Taxa de Sucesso',
      value: `${metrics.avgSuccessRate}%`,
      icon: 'solar:chart-2-linear',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      showProgress: true,
      progressValue: metrics.avgSuccessRate,
    },
  ];

  const typeDistribution = [
    {
      type: 'Conversacional',
      count: metrics.agentsByType.conversational,
      icon: 'solar:chat-round-dots-linear',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      type: 'Processamento',
      count: metrics.agentsByType.processing,
      icon: 'solar:cpu-bolt-linear',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-stone-300 bg-[#EAEAE5]">
            <CardContent className="p-6">
              <div className="h-20 animate-pulse bg-stone-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="border-stone-300 bg-[#EAEAE5] hover:bg-white transition-colors duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`
                    w-11 h-11 rounded-lg flex items-center justify-center border
                    ${card.bgColor} ${card.borderColor}
                  `}>
                    <Icon icon={card.icon} className={`w-5 h-5 ${card.color}`} />
                  </div>
                  {card.subtext && (
                    <span className="text-[10px] uppercase tracking-wider text-stone-400">
                      {card.subtext}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-medium text-stone-900 tracking-tight">
                    {card.value}
                  </p>
                  {card.showProgress && (
                    <div className="mt-3">
                      <Progress 
                        value={card.progressValue} 
                        className="h-1.5 bg-stone-200"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Type distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-900">
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-6">
              {typeDistribution.map((type) => {
                const percentage = metrics.totalAgents > 0 
                  ? Math.round((type.count / metrics.totalAgents) * 100) 
                  : 0;
                
                return (
                  <div key={type.type} className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center border
                          ${type.bgColor} ${type.borderColor}
                        `}>
                          <Icon icon={type.icon} className={`w-4 h-4 ${type.color}`} />
                        </div>
                        <span className="text-sm font-medium text-stone-700">
                          {type.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-stone-900">
                          {type.count}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-stone-200"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
