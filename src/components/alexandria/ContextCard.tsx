import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/alexandria';

interface ContextCardProps {
  agent: Agent;
  status?: 'online' | 'offline' | 'idle';
  onClick?: () => void;
}

export default function ContextCard({ agent, status = 'offline', onClick }: ContextCardProps) {
  const statusColors = {
    online: 'bg-green-500/15 text-green-400',
    offline: 'bg-red-500/15 text-red-400',
    idle: 'bg-blue-500/15 text-blue-400',
  };

  const statusLabels = {
    online: '🟢 Online',
    idle: '🔵 Idle',
    offline: '🔴 Offline',
  };

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{agent.emoji}</span>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-xs text-muted-foreground">Tier {agent.tier}</p>
          </div>
        </div>
        <Badge className={`${statusColors[status]} border-0`}>
          {statusLabels[status]}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {agent.system_prompt}
      </p>

      <div className="text-xs text-muted-foreground">
        <p>{agent.skills?.length || 0} skills disponíveis</p>
      </div>
    </Card>
  );
}
