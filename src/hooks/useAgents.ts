// src/hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AgentConfig } from '@/types/agents';

interface UseAgentsState {
  agents: AgentConfig[];
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
          .from('agents_config')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setState({
          agents: (data as AgentConfig[]) || [],
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
