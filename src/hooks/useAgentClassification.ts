import { useMemo } from 'react';
import type { Agent } from './useAgents';

export type AgentType = 'conversational' | 'processing';

export interface AgentClassification {
  type: AgentType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

// Agentes conversacionais - interagem diretamente com usuários
const CONVERSATIONAL_AGENTS = [
  'TOT',
  'Toth',
  'Data',
  'Hug',
  'Atendente Totum',
  'Atendente',
  'SDR Comercial',
  'SDR',
  'Social',
];

// Agentes de processamento - executam tarefas em background
const PROCESSING_AGENTS = [
  'KVirtuoso',
  'Radar',
  'Ghost',
  'Radar de Insights',
  'Radar de Anúncios',
  'Gestor de Tráfego',
  'Extractor',
  'Pipeline',
  'Controlador',
  'Cartógrafo',
];

export function classifyAgent(agentName: string): AgentClassification {
  const name = agentName.toLowerCase();
  
  const isConversational = CONVERSATIONAL_AGENTS.some(agent => 
    name.includes(agent.toLowerCase())
  );
  
  const isProcessing = PROCESSING_AGENTS.some(agent => 
    name.includes(agent.toLowerCase())
  );

  if (isConversational || (!isConversational && !isProcessing)) {
    return {
      type: 'conversational',
      label: 'Conversacional',
      description: 'Interage diretamente com usuários através de chat',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-700',
      icon: 'solar:chat-round-dots-linear',
    };
  }

  return {
    type: 'processing',
    label: 'Processamento',
    description: 'Executa tarefas automatizadas em background',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-700',
    icon: 'solar:cpu-bolt-linear',
  };
}

export function useAgentClassification(agents: Agent[]) {
  const classifiedAgents = useMemo(() => {
    return agents.map(agent => ({
      ...agent,
      classification: classifyAgent(agent.name),
    }));
  }, [agents]);

  const conversationalAgents = useMemo(() => 
    classifiedAgents.filter(a => a.classification.type === 'conversational'),
  [classifiedAgents]);

  const processingAgents = useMemo(() => 
    classifiedAgents.filter(a => a.classification.type === 'processing'),
  [classifiedAgents]);

  const getTypeStats = useMemo(() => {
    const total = agents.length;
    const conversational = conversationalAgents.length;
    const processing = processingAgents.length;
    
    return {
      total,
      conversational,
      processing,
      conversationalPercent: total > 0 ? Math.round((conversational / total) * 100) : 0,
      processingPercent: total > 0 ? Math.round((processing / total) * 100) : 0,
    };
  }, [agents.length, conversationalAgents.length, processingAgents.length]);

  return {
    classifiedAgents,
    conversationalAgents,
    processingAgents,
    getTypeStats,
    classifyAgent,
  };
}

export function getAgentTypeBadge(agentType: AgentType) {
  if (agentType === 'conversational') {
    return {
      label: 'Conversacional',
      className: 'bg-emerald-500/15 text-emerald-400 border-emerald-700',
      icon: 'solar:chat-round-dots-linear',
    };
  }
  return {
    label: 'Processamento',
    className: 'bg-amber-500/10 text-amber-400 border-amber-700',
    icon: 'solar:cpu-bolt-linear',
  };
}
