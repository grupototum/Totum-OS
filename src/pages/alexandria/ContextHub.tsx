import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/alexandria';
import { Zap, Users } from 'lucide-react';

interface ContextHubProps {
  agents?: Agent[];
}

const statusColors = {
  online: { bg: 'bg-green-100', text: 'text-green-700', label: 'Online' },
  offline: { bg: 'bg-red-100', text: 'text-red-700', label: 'Offline' },
  testing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Testing' },
  idle: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Idle' },
};

type StatusType = keyof typeof statusColors;

export default function ContextHub({ agents = [] }: ContextHubProps) {
  // Simular status por posição (em produção viria do banco em tempo real)
  const agentsWithStatus = agents.map((agent, idx) => ({
    ...agent,
    statusType: (['online', 'offline', 'idle'] as StatusType[])[idx % 3],
  }));

  const onlineCount = agentsWithStatus.filter((a) => a.statusType === 'online').length;
  const totalSkills = agentsWithStatus.reduce((sum, a) => sum + (a.skills?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Agentes</p>
              <p className="text-3xl font-bold">{agents.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-3xl font-bold">{onlineCount}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Skills Associadas</p>
              <p className="text-3xl font-bold">{totalSkills}</p>
            </div>
            <Zap className="h-8 w-8 text-amber-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Grid de Agentes */}
      {agentsWithStatus.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum agente encontrado</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsWithStatus.map((agent) => {
            const statusColor =
              statusColors[agent.statusType as StatusType] || statusColors.offline;

            return (
              <Card
                key={agent.agent_id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">Tier {agent.tier}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <Badge className={`${statusColor.bg} ${statusColor.text} border-0`}>
                    {statusColor.label}
                  </Badge>
                </div>

                {/* Preview do System Prompt */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Prompt:</p>
                  <p className="text-xs bg-muted p-2 rounded line-clamp-2">
                    {agent.system_prompt}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Skills ({agent.skills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.skills?.slice(0, 3).map((skillId) => (
                      <Badge key={skillId} variant="outline" className="text-xs">
                        {skillId}
                      </Badge>
                    ))}
                    {(agent.skills?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(agent.skills?.length || 0) - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
