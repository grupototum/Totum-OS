import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description?: string;
  status: 'online' | 'offline' | 'idle' | 'maintenance';
  type: 'conversational' | 'processing';
  category: string;
  emoji: string;
  created_at: string;
  updated_at: string;
  tasks_completed: number;
  success_rate: number;
  daily_tasks: number;
  credits_used: number;
  effectiveness_score: number;
  parent_id?: string;
  hierarchy_level: number;
  is_orchestrator: boolean;
}

export interface AgentMetrics {
  totalAgents: number;
  onlineAgents: number;
  totalTasks: number;
  avgSuccessRate: number;
  totalCreditsUsed: number;
  agentsByType: {
    conversational: number;
    processing: number;
  };
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<AgentMetrics>({
    totalAgents: 0,
    onlineAgents: 0,
    totalTasks: 0,
    avgSuccessRate: 0,
    totalCreditsUsed: 0,
    agentsByType: { conversational: 0, processing: 0 },
  });

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('agents')
        .select('*')
        .order('hierarchy_level', { ascending: true });

      if (supabaseError) throw supabaseError;

      const typedAgents: Agent[] = (data || []).map(agent => ({
        ...agent,
        type: agent.type as 'conversational' | 'processing',
        status: agent.status as 'online' | 'offline' | 'idle' | 'maintenance',
      }));

      setAgents(typedAgents);
      calculateMetrics(typedAgents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agentes');
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateMetrics = (agentList: Agent[]) => {
    const totalAgents = agentList.length;
    const onlineAgents = agentList.filter(a => a.status === 'online').length;
    const totalTasks = agentList.reduce((sum, a) => sum + (a.tasks_completed || 0), 0);
    const avgSuccessRate = totalAgents > 0
      ? Math.round(agentList.reduce((sum, a) => sum + (a.success_rate || 0), 0) / totalAgents)
      : 0;
    const totalCreditsUsed = agentList.reduce((sum, a) => sum + (a.credits_used || 0), 0);
    
    const conversational = agentList.filter(a => a.type === 'conversational').length;
    const processing = agentList.filter(a => a.type === 'processing').length;

    setMetrics({
      totalAgents,
      onlineAgents,
      totalTasks,
      avgSuccessRate,
      totalCreditsUsed,
      agentsByType: { conversational, processing },
    });
  };

  const createAgent = useCallback(async (agentData: Partial<Agent>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('agents')
        .insert([agentData])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      await fetchAgents();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar agente' };
    }
  }, [fetchAgents]);

  const updateAgent = useCallback(async (id: string, updates: Partial<Agent>) => {
    try {
      const { error: supabaseError } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      await fetchAgents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar agente' };
    }
  }, [fetchAgents]);

  const deleteAgent = useCallback(async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      await fetchAgents();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar agente' };
    }
  }, [fetchAgents]);

  const isNewAgent = useCallback((createdAt: string): boolean => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }, []);

  useEffect(() => {
    fetchAgents();

    const channel = supabase
      .channel('agents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
        fetchAgents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    metrics,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    isNewAgent,
  };
}
