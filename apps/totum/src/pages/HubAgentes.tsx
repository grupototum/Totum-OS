import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { AgentNode, NodeConnector } from '@/components/agents';
import { useAgents } from '@/hooks/useAgents';
import { useAgentClassification, classifyAgent } from '@/hooks/useAgentClassification';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import type { Agent } from '@/hooks/useAgents';

// Position configuration for N8N-style layout
const NODE_POSITIONS = {
  tot: { x: 400, y: 50 },
  pablo: { x: 200, y: 200 },
  data: { x: 400, y: 200 },
  hug: { x: 600, y: 200 },
  kvirtuoso: { x: 100, y: 350 },
  radar: { x: 250, y: 350 },
  ghost: { x: 400, y: 350 },
  pipeline: { x: 550, y: 350 },
  extractor: { x: 700, y: 350 },
};

// Connections between nodes
const CONNECTIONS = [
  { from: 'tot', to: 'pablo' },
  { from: 'tot', to: 'data' },
  { from: 'tot', to: 'hug' },
  { from: 'pablo', to: 'kvirtuoso' },
  { from: 'pablo', to: 'radar' },
  { from: 'data', to: 'ghost' },
  { from: 'hug', to: 'pipeline' },
  { from: 'hug', to: 'extractor' },
];

export default function HubAgentes() {
  const navigate = useNavigate();
  const { agents, loading } = useAgents();
  const { classifiedAgents } = useAgentClassification(agents);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  // Map agents to positions
  const positionedAgents = useMemo(() => {
    return agents.map(agent => {
      const position = NODE_POSITIONS[agent.name.toLowerCase().replace(/\s+/g, '') as keyof typeof NODE_POSITIONS];
      return {
        ...agent,
        x: position?.x || 400 + Math.random() * 200,
        y: position?.y || 400 + Math.random() * 100,
      };
    });
  }, [agents]);

  const selectedAgent = useMemo(() => 
    agents.find(a => a.id === selectedAgentId),
  [agents, selectedAgentId]);

  const getConnectedAgents = (agentId: string): string[] => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return [];
    
    const connections: string[] = [];
    CONNECTIONS.forEach(conn => {
      const fromAgent = agents.find(a => a.name.toLowerCase().replace(/\s+/g, '') === conn.from);
      const toAgent = agents.find(a => a.name.toLowerCase().replace(/\s+/g, '') === conn.to);
      
      if (fromAgent?.id === agentId && toAgent) {
        connections.push(toAgent.id);
      }
      if (toAgent?.id === agentId && fromAgent) {
        connections.push(fromAgent.id);
      }
    });
    return connections;
  };

  const getNodePosition = (agent: Agent & { x?: number; y?: number }) => ({
    x: agent.x || 400,
    y: agent.y || 400,
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#EAEAE5]">
        <div className="max-w-[1400px] mx-auto border-l border-r border-stone-300 min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 border-b border-stone-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center">
                    <Icon icon="solar:graph-new-linear" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-medium text-stone-900 tracking-tighter">
                      Hub de Agentes
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-stone-500">
                      Visual N8N · Fluxo de Conexões
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/painel-agentes')}
                  className="border-stone-300"
                >
                  <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 mr-2" />
                  Ver Painel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/estrutura-time')}
                  className="border-stone-300"
                >
                  <Icon icon="solar:diagram-up-linear" className="w-4 h-4 mr-2" />
                  Hierarquia
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="px-8 py-4 border-b border-stone-300 bg-[#E5E5E0]"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-stone-900" />
                <span className="text-xs text-stone-600">Orquestrador</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-stone-600">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-stone-600">Em espera</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:chat-round-dots-linear" className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-stone-600">Conversacional</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="solar:cpu-bolt-linear" className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-stone-600">Processamento</span>
              </div>
            </div>
          </motion.div>

          {/* N8N Canvas */}
          <div className="relative h-[600px] overflow-hidden bg-[#EAEAE5]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-stone-500">Carregando agentes...</p>
                </div>
              </div>
            ) : (
              <>
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D6D3D1" />
                      <stop offset="100%" stopColor="#78716C" />
                    </linearGradient>
                  </defs>
                  {CONNECTIONS.map((conn, index) => {
                    const fromAgent = positionedAgents.find(a => 
                      a.name.toLowerCase().replace(/\s+/g, '') === conn.from
                    );
                    const toAgent = positionedAgents.find(a => 
                      a.name.toLowerCase().replace(/\s+/g, '') === conn.to
                    );
                    
                    if (!fromAgent || !toAgent) return null;
                    
                    const from = getNodePosition(fromAgent);
                    const to = getNodePosition(toAgent);
                    
                    // Check if connection is highlighted
                    const isHighlighted = hoveredAgentId && 
                      (fromAgent.id === hoveredAgentId || toAgent.id === hoveredAgentId);
                    
                    return (
                      <motion.path
                        key={`${conn.from}-${conn.to}`}
                        d={`M ${from.x} ${from.y + 50} L ${to.x} ${to.y - 50}`}
                        fill="none"
                        stroke={isHighlighted ? "#1C1917" : "url(#lineGradient)"}
                        strokeWidth={isHighlighted ? 3 : 2}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.6 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                <div className="relative w-full h-full" style={{ zIndex: 2 }}>
                  {positionedAgents.map((agent) => {
                    const classification = classifyAgent(agent.name);
                    const isSelected = selectedAgentId === agent.id;
                    const isConnected = hoveredAgentId && getConnectedAgents(hoveredAgentId).includes(agent.id);
                    const isHovered = hoveredAgentId === agent.id;

                    return (
                      <motion.div
                        key={agent.id}
                        className="absolute"
                        style={{ 
                          left: agent.x, 
                          top: agent.y, 
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setHoveredAgentId(agent.id)}
                        onMouseLeave={() => setHoveredAgentId(null)}
                      >
                        <button
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            navigate(`/agente/${agent.id}`);
                          }}
                          className={`
                            relative flex flex-col items-center justify-center
                            ${agent.is_orchestrator ? 'w-36 h-36' : 'w-28 h-28'}
                            rounded-full border-2 transition-all duration-300
                            ${isSelected || isHovered
                              ? 'bg-white border-stone-900 shadow-xl scale-110'
                              : isConnected
                                ? 'bg-stone-100 border-stone-600 shadow-lg'
                                : 'bg-[#EAEAE5] border-stone-300 hover:border-stone-500'
                            }
                          `}
                        >
                          {/* Status indicator */}
                          <span className={`
                            absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-[#EAEAE5]
                            ${agent.status === 'online' ? 'bg-emerald-500' : 
                              agent.status === 'idle' ? 'bg-amber-500' : 'bg-stone-400'}
                          `} />

                          {/* New badge */}
                          {(new Date().getTime() - new Date(agent.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7 && (
                            <span className="absolute -top-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-stone-900 text-white rounded-full">
                              New
                            </span>
                          )}

                          {/* Emoji */}
                          <span className={`${agent.is_orchestrator ? 'text-4xl' : 'text-2xl'} mb-1`}>
                            {agent.emoji}
                          </span>

                          {/* Name */}
                          <span className={`
                            font-medium text-stone-900 text-center px-2
                            ${agent.is_orchestrator ? 'text-sm' : 'text-xs'}
                          `}>
                            {agent.name}
                          </span>

                          {/* Type badge */}
                          <div className={`
                            absolute -bottom-2 left-1/2 -translate-x-1/2
                            px-2 py-0.5 rounded-full border flex items-center gap-1
                            ${classification.bgColor} ${classification.borderColor}
                          `}>
                            <Icon icon={classification.icon} className={`w-3 h-3 ${classification.color}`} />
                          </div>
                        </button>

                        {/* Tooltip on hover */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50"
                          >
                            <div className="bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl whitespace-nowrap">
                              <p className="font-medium text-sm">{agent.name}</p>
                              <p className="text-xs text-stone-400">{agent.role}</p>
                              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-stone-700 text-xs">
                                <span>📊 {agent.daily_tasks || 0} tarefas</span>
                                <span>✓ {agent.success_rate || 0}% sucesso</span>
                              </div>
                            </div>
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-8 border-t border-stone-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:diagram-up-linear" className="w-5 h-5 text-stone-600" />
                  <h3 className="font-medium text-stone-900">Fluxo Orquestrado</h3>
                </div>
                <p className="text-sm text-stone-500">
                  TOT (Orquestrador) distribui tarefas entre os modos Pablo, Data e Hug, 
                  que por sua vez coordenam agentes especializados.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:chat-round-dots-linear" className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-medium text-stone-900">Agentes Conversacionais</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Interagem diretamente com usuários através de chat. 
                  Exemplos: TOT, Data, Hug.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:cpu-bolt-linear" className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium text-stone-900">Agentes de Processamento</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Executam tarefas automatizadas em background. 
                  Exemplos: KVirtuoso, Radar, Ghost.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
