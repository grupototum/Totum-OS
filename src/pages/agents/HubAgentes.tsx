// src/pages/agents/HubAgentes.tsx
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '@/hooks/useAgents';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, MessageSquare } from 'lucide-react';

export const HubAgentes: React.FC = () => {
  const navigate = useNavigate();
  const { agents, isLoading, error } = useAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando agentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-6 max-w-md w-full border-destructive">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Erro ao carregar agentes</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const statusColor = (status: string) => {
    if (status === 'online') return 'bg-green-500/10 text-green-700';
    if (status === 'idle') return 'bg-yellow-500/10 text-yellow-700';
    return 'bg-red-500/10 text-red-700';
  };

  const statusDot = (status: string) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'idle') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const statusLabel = (status: string) => {
    if (status === 'online') return 'Online';
    if (status === 'idle') return 'Em espera';
    if (status === 'maintenance') return 'Manutenção';
    return 'Offline';
  };

  return (
    <AppLayout>
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">🤖 Hub de Agentes</h1>
        <p className="text-muted-foreground">
          {agents.length} agente{agents.length !== 1 ? 's' : ''} disponível{agents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {agents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum agente encontrado</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/agents/${agent.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{agent.emoji}</div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                </div>
                {agent.category && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {agent.category}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusColor(agent.status)}`}>
                  <div className={`h-2 w-2 rounded-full ${statusDot(agent.status)}`} />
                  {statusLabel(agent.status)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{agent.role}</p>

              <Button className="w-full mt-4 gap-2" onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`); }}>
                <MessageSquare className="h-4 w-4" />
                Conversar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
    </AppLayout>
  );
};

export default HubAgentes;
