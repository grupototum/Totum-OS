// src/hooks/useAgentExecution.ts
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExecutionResult, AgentConfig, ExecutionStatus } from '@/types/agents';
import { getAgentConfig } from '@/services/skillsService';
import { executeAgent } from '@/services/openClawClient';
import { useRAG } from './useRAG';

interface UseAgentExecutionOptions {
  agentId: string;
  onSuccess?: (result: ExecutionResult) => void;
  onError?: (error: Error) => void;
  enableRAG?: boolean; // Novo: habilitar RAG
  ragType?: string;    // Novo: filtrar por tipo de documento
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
  const { agentId, onSuccess, onError, enableRAG = true, ragType } = options;
  const [state, setState] = useState<UseAgentExecutionState>({
    isLoading: true,
    isExecuting: false,
    result: null,
    error: null,
    agentConfig: null,
    executionStatus: 'pending',
  });

  // Alexandria RAG hook
  const { 
    context: ragContext, 
    documents: ragDocuments, 
    isLoading: isRagLoading,
    retrieveContext,
    retrieveAndSave
  } = useRAG();

  // Gerar execution_id único
  const executionIdRef = useRef<string>(`exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

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

      // Gerar novo execution_id
      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      executionIdRef.current = executionId;

      try {
        setState(prev => ({
          ...prev,
          isExecuting: true,
          executionStatus: 'running' as ExecutionStatus,
          error: null,
        }));

        // 🧠 ALEXANDRIA RAG: Recuperar contexto
        let retrievedContext = '';
        let contextDocuments: string[] = [];
        
        if (enableRAG) {
          console.log('🔍 Alexandria RAG: Buscando contexto...');
          const ragResult = await retrieveAndSave(
            userInput,
            agentId,
            executionId,
            {
              type: ragType,
              limit: 5,
              threshold: 0.5,
              maxContextTokens: 2000
            }
          );
          
          if (ragResult) {
            retrievedContext = ragResult.context;
            contextDocuments = ragResult.documents;
            console.log(`✅ Contexto recuperado: ${contextDocuments.length} documentos`);
          }
        }

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
          rag_context: retrievedContext || context?.rag_context || '',
          execution_mode: 'sequential' as const,
        };

        const result = await executeAgent(payload);

        const { data: userData } = await supabase.auth.getUser();
        const executionData = {
          execution_id: executionId,
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
          context: {
            ...context,
            rag_context: retrievedContext,
            rag_documents: contextDocuments,
            rag_enabled: enableRAG,
          },
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
    [agentId, state.agentConfig, enableRAG, ragType, retrieveAndSave, onSuccess, onError]
  );

  return {
    ...state,
    loadAgentConfig,
    execute,
    isReady: !state.isLoading && state.agentConfig !== null,
    hasError: state.error !== null,
    hasResult: state.result !== null,
    // Alexandria RAG extras
    ragContext,
    ragDocuments,
    isRagLoading,
    executionId: executionIdRef.current,
  };
};
