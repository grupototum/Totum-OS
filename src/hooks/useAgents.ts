// src/hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Re-export canonical types — import from here for backward compat
export type { Agent, AgentMetrics } from '@/types/agent';
import type { Agent } from '@/types/agent';

export interface UseAgentsState {
  agents: Agent[];
  isLoading: boolean;
  error: Error | null;
}

function mapRowToAgent(row: any): Agent {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    status: (row.status as Agent['status']) || 'offline',
    emoji: row.emoji || '🤖',
    category: row.category,
    tasks: row.tasks ?? 0,
    daily_tasks: row.daily_tasks,
    success_rate: row.success_rate,
    created_at: row.created_at || new Date().toISOString(),
    slug: row.slug || undefined,
    agent_group: row.agent_group || undefined,
    description: row.description || undefined,
    is_orchestrator:
      row.is_orchestrator ??
      (row.name?.toLowerCase().includes('tot') && !row.name?.toLowerCase().includes('totum')),
    hierarchy_level:
      row.category === 'orchestrator' ? 0 : row.category === 'mode' ? 1 : 2,
    type: row.category || 'agent',
  };
}

export const useAgents = () => {
  const [state, setState] = useState<UseAgentsState>({
    agents: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!isMounted) return;
        setState({ agents: (data || []).map(mapRowToAgent), isLoading: false, error: null });
      } catch (err) {
        if (!isMounted) return;
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Erro ao carregar agentes'),
        }));
      }
    };

    fetchAgents();

    // Real-time: atualiza status dos agentes ao vivo
    const channel = supabase
      .channel('agents-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'agents' },
        (payload) => {
          if (!isMounted) return;
          if (payload.eventType === 'DELETE') {
            setState(prev => ({
              ...prev,
              agents: prev.agents.filter(a => a.id !== (payload.old as any)?.id),
            }));
          } else if (payload.eventType === 'INSERT') {
            setState(prev => ({
              ...prev,
              agents: [mapRowToAgent(payload.new), ...prev.agents],
            }));
          } else if (payload.eventType === 'UPDATE') {
            setState(prev => ({
              ...prev,
              agents: prev.agents.map(a =>
                a.id === (payload.new as any).id ? mapRowToAgent(payload.new) : a
              ),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return state;
};
