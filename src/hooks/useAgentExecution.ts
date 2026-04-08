// src/hooks/useAgentExecution.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExecutionResult, AgentConfig, ExecutionStatus } from '@/types/agents';
import { getAgentConfig } from '@/services/skillsService';
import { executeAgent } from '@/services/openClawClient';

interface UseAgentExecutionOptions {
  agentId: string;
  onSuccess?: (result: ExecutionResult) => void;
  onError?: (error: Error) => void;
}

interface UseAgentExecutionState {
  isLoading: boolean;
  isExecuting: boolean;
  result: ExecutionResult | null;
  error: Error | null;
  agentConfig: AgentConfig | null;
  executionStatus: ExecutionStatus;
}

export const useAgentExecution = (options: UseAgentExecutionOptions) => {
  const { agentId, onSuccess, onError } = options;
  const [state, setState] = useState<UseAgentExecutionState>({
    isLoading: true,
    isExecuting: false,
    result: null,
    error: null,
    agentConfig: null,
    executionStatus: 'pending',
  });

  const loadAgentConfig = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const config = await getAgentConfig(agentId);
      
      if (!config) {
        throw new Error(`Agente ${agentId} não encontrado`);
      }

      setState(prev => ({
        ...prev,
        agentConfig: config,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error,
      }));
      onError?.(error);
    }
  }, [agentId, onError]);

  const execute = useCallback(
    async (userInput: string, context?: Record<string, any>) => {
      if (!state.agentConfig) {
        const error = new Error('Agente não carregado');
        setState(prev => ({ ...prev, error }));
        onError?.(error);
        return null;
      }

      try {
        setState(prev => ({
          ...prev,
          isExecuting: true,
          executionStatus: 'running' as ExecutionStatus,
          error: null,
        }));

        const skills = state.agentConfig.skills || [];
        const payload = {
          agent: agentId,
          skills: skills.map(s => ({
            id: s.skill_id,
            prompt: userInput,
            inputs: { user_input: userInput },
            model: state.agentConfig.model_override || 'claude',
          })),
          system_prompt: state.agentConfig.system_prompt,
          rag_context: context?.rag_context || '',
          execution_mode: 'sequential' as const,
        };

        const result = await executeAgent(payload);

        const { data: userData } = await supabase.auth.getUser();
        const executionData = {
          execution_id: result.execution_id,
          agent_id: agentId,
          user_id: userData?.user?.id,
          input_data: userInput,
          output_data: result,
          skills_executed: result.results.map(r => ({
            skill_id: r.skill_id,
            status: r.status,
            tokens: r.tokens_used,
          })),
          total_tokens: result.total_tokens,
          total_cost: result.total_cost,
          duration_ms: result.duration_ms,
          status: result.success ? 'success' : 'error',
          error_message: result.error || null,
          context: context || {},
        };

        const { error: insertError } = await supabase
          .from('agent_executions')
          .insert([executionData]);

        if (insertError) {
          console.warn('Erro ao armazenar:', insertError);
        }

        setState(prev => ({
          ...prev,
          result,
          isExecuting: false,
          executionStatus: result.success ? 'success' : 'error',
          error: result.error ? new Error(result.error) : null,
        }));

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro na execução');
        setState(prev => ({
          ...prev,
          isExecuting: false,
          executionStatus: 'error',
          error,
        }));
        onError?.(error);
        return null;
      }
    },
    [agentId, state.agentConfig, onSuccess, onError]
  );

  return {
    ...state,
    loadAgentConfig,
    execute,
    isReady: !state.isLoading && state.agentConfig !== null,
    hasError: state.error !== null,
    hasResult: state.result !== null,
  };
};
