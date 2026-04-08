// src/pages/agents/HubAgentes.tsx
import React from 'react';
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

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">🤖 Hub de Agentes</h1>
        <p className="text-muted-foreground">
          {agents.length} agente{agents.length !== 1 ? 's' : ''} disponível{agents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Agents Grid */}
      {agents.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum agente ativo encontrado</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card
              key={agent.agent_id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/agents/${agent.agent_id}`)}
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{agent.emoji}</div>
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Tier {agent.tier}
                </span>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    agent.status === 'active'
                      ? 'bg-green-500/10 text-green-700'
                      : agent.status === 'inactive'
                      ? 'bg-yellow-500/10 text-yellow-700'
                      : 'bg-red-500/10 text-red-700'
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      agent.status === 'active'
                        ? 'bg-green-500'
                        : agent.status === 'inactive'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  {agent.status === 'active' ? 'Online' : agent.status === 'inactive' ? 'Offline' : 'Erro'}
                </span>
              </div>

              {/* Skills */}
              {agent.skills && agent.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Skills ({agent.skills.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.skills.slice(0, 3).map((skill) => (
                      <span key={skill.skill_id} className="text-xs bg-secondary px-2 py-1 rounded">
                        {skill.skill_id}
                      </span>
                    ))}
                    {agent.skills.length > 3 && (
                      <span className="text-xs bg-secondary px-2 py-1 rounded">+{agent.skills.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full mt-4 gap-2" onClick={() => navigate(`/agents/${agent.agent_id}`)}>
                <MessageSquare className="h-4 w-4" />
                Conversar
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HubAgentes;
