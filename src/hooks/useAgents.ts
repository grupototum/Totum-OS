// src/hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'idle' | 'maintenance';
  emoji: string;
  category: string | null;
  tasks: number;
  daily_tasks: number | null;
  success_rate: number | null;
  created_at: string;
  // UI-only derived fields
  parent_id?: string;
  is_orchestrator?: boolean;
  hierarchy_level?: number;
  credits_used?: number;
  tasks_completed?: number;
  type?: string;
}

export interface AgentMetrics {
  totalAgents: number;
  onlineAgents: number;
  totalTasks: number;
  avgSuccessRate: number;
  agentsByType: {
    conversational: number;
    processing: number;
  };
}

export interface UseAgentsState {
  agents: Agent[];
  isLoading: boolean;
  error: Error | null;
}

export const useAgents = () => {
  const [state, setState] = useState<UseAgentsState>({
    agents: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const agents: Agent[] = (data || []).map((row) => ({
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
          is_orchestrator: row.name?.toLowerCase().includes('tot') && !row.name?.toLowerCase().includes('totum'),
          hierarchy_level: row.category === 'orchestrator' ? 0 : row.category === 'mode' ? 1 : 2,
          type: row.category || 'agent',
        }));

        setState({
          agents,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao carregar agentes');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error,
        }));
      }
    };

    fetchAgents();
  }, []);

  return state;
};
