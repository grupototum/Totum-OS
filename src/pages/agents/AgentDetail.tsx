import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';
import { AgentTabs } from './components/AgentTabs';
import { supabase } from '@/integrations/supabase/client';

export default function AgentDetail() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAgent() {
      try {
        setLoading(true);
        
        // Load all agents for hierarchy
        const { data: allAgentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*');

        if (agentsError) throw agentsError;

        const typedAgents: Agent[] = (allAgentsData || []).map(agent => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          status: (agent.status as Agent['status']) || 'offline',
          type: inferType(agent.category),
          category: agent.category || 'geral',
          emoji: agent.emoji || '🤖',
          created_at: agent.created_at || new Date().toISOString(),
          updated_at: agent.created_at || new Date().toISOString(),
          tasks_completed: agent.tasks || 0,
          success_rate: agent.success_rate || 0,
          daily_tasks: agent.daily_tasks || 0,
          credits_used: 0,
          effectiveness_score: agent.success_rate || 0,
          parent_id: undefined,
          hierarchy_level: 0,
          is_orchestrator: false,
        }));

        if (!isMounted) return;
        setAgents(typedAgents);

        // Find current agent
        const currentAgent = typedAgents.find(a => a.id === agentId);
        if (currentAgent) {
          setAgent(currentAgent);
        }
      } catch (error) {
        console.error('Erro ao carregar agente:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAgent();

    // Subscribe to changes
    const channel = supabase
      .channel(`agent-${agentId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        loadAgent();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [agentId]);

  function inferType(category: string | null): 'conversational' | 'processing' {
    const conversationalCategories = ['atendimento', 'chat', 'sdr', 'comercial'];
    return conversationalCategories.some(c => (category || '').toLowerCase().includes(c))
      ? 'conversational'
      : 'processing';
  }

  // Find parent and children
  const parentAgent = agent?.parent_id 
    ? agents.find(a => a.id === agent.parent_id)
    : null;
  
  const childAgents = agents.filter(a => a.parent_id === agentId);

  const classification = agent ? classifyAgent(agent.name) : null;

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

  const isNew = agent ? (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })() : false;

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen" style={{ backgroundColor: '#EAEAE5' }}>
          <div className="max-w-[1400px] mx-auto p-8">
            <div className="h-32 bg-stone-200 animate-pulse rounded-lg mb-6" />
            <div className="h-12 bg-stone-200 animate-pulse rounded-lg mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-stone-200 animate-pulse rounded-lg" />
              <div className="h-96 bg-stone-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!agent) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EAEAE5' }}>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-200 flex items-center justify-center">
              <Icon icon="solar:ghost-linear" className="w-8 h-8 text-stone-400" />
            </div>
            <h1 className="text-2xl font-medium text-stone-900 mb-2">Agente não encontrado</h1>
            <p className="text-stone-500 mb-6">O agente solicitado não existe ou foi removido.</p>
            <Button 
              onClick={() => navigate('/agents')} 
              className="bg-stone-900 hover:bg-stone-800"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#EAEAE5' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 border-b border-stone-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="shrink-0 border-stone-300 bg-white"
                >
                  <Icon icon="solar:arrow-left-linear" className="w-5 h-5" />
                </Button>

                <div className="relative">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2
                    ${agent.is_orchestrator 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'bg-stone-200 border-stone-300'
                    }
                  `}>
                    {agent.emoji}
                  </div>
                  <span className={`
                    absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 ring-[#EAEAE5]
                    ${statusColors[agent.status]}
                  `} />
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                      {agent.name}
                    </h1>
                    
                    {isNew && (
                      <Badge className="bg-stone-900 text-white text-[10px] uppercase tracking-wider">
                        New
                      </Badge>
                    )}
                    
                    {agent.is_orchestrator && (
                      <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">
                        <Icon icon="solar:crown-linear" className="w-3 h-3 mr-1" />
                        Orquestrador
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-stone-500">{agent.role}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`${classification?.bgColor} ${classification?.color} ${classification?.borderColor} text-[10px]`}
                    >
                      <Icon icon={classification?.icon || ''} className="w-3 h-3 mr-1" />
                      {classification?.label}
                    </Badge>
                    
                    <span className="text-xs text-stone-400">
                      Criado em {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/agents')}
                  className="border-stone-300 bg-white"
                >
                  <Icon icon="solar:graph-new-linear" className="w-4 h-4 mr-2" />
                  Ver no Dashboard
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tabs Content */}
          <AgentTabs 
            agent={agent} 
            agents={agents}
            parentAgent={parentAgent}
            childAgents={childAgents}
          />
        </div>
      </div>
    </AppLayout>
  );
}
