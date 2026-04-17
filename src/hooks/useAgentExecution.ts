// src/hooks/useAgentExecution.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExecutionResult, AgentConfig } from '@/types/agents';
import { getAgentConfig } from '@/services/skillsService';
import { executeAgent } from '@/services/openClawClient';
import { useRAG } from './useRAG';

type ExecutionStatus = 'pending' | 'running' | 'success' | 'error';

interface UseAgentExecutionOptions {
  agentId: string;
  onSuccess?: (result: ExecutionResult) => void;
  onError?: (error: Error) => void;
  enableRAG?: boolean;
  ragType?: string;
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

  // ── Stable refs for callbacks — breaks the infinite render loop caused by
  //    inline arrow functions being recreated every render and sitting in
  //    useCallback dependency arrays.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef   = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current   = onError;
  });

  const [state, setState] = useState<UseAgentExecutionState>({
    isLoading: true,
    isExecuting: false,
    result: null,
    error: null,
    agentConfig: null,
    executionStatus: 'pending',
  });

  const {
    context: ragContext,
    documents: ragDocuments,
    isLoading: isRagLoading,
    retrieveContext,
    retrieveAndSave
  } = useRAG();

  const executionIdRef = useRef<string>(`exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // ── Only depends on agentId — callbacks are accessed via stable refs ────────
  const loadAgentConfig = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const config = await getAgentConfig(agentId);

      if (!config) {
        throw new Error(`Agente "${agentId}" não encontrado`);
      }

      setState(prev => ({
        ...prev,
        agentConfig: config,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setState(prev => ({ ...prev, isLoading: false, error }));
      onErrorRef.current?.(error);
    }
  }, [agentId]); // ← onError removed from deps; accessed via ref

  const execute = useCallback(
    async (userInput: string, context?: Record<string, any>) => {
      if (!state.agentConfig) {
        const error = new Error('Agente não carregado');
        setState(prev => ({ ...prev, error }));
        onErrorRef.current?.(error);
        return null;
      }

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      executionIdRef.current = executionId;

      try {
        setState(prev => ({
          ...prev,
          isExecuting: true,
          executionStatus: 'running',
          error: null,
        }));

        let retrievedContext = '';
        let contextDocuments: string[] = [];

        if (enableRAG) {
          console.log('🔍 Alexandria RAG: Buscando contexto...');
          const ragResult = await retrieveAndSave(userInput, agentId, executionId, {
            type: ragType,
            limit: 5,
            threshold: 0.5,
            maxContextTokens: 2000
          });

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
            model: state.agentConfig!.model_override || 'claude',
          })),
          system_prompt: state.agentConfig.system_prompt,
          rag_context: retrievedContext || context?.rag_context || '',
          execution_mode: 'sequential' as const,
        };

        const result = await executeAgent(payload);

        // Log execution to logs_execucao_agente table
        try {
          await supabase
            .from('logs_execucao_agente')
            .insert([{
              agente_id: agentId,
              status: result.success ? 'success' : 'error',
              resultado: JSON.stringify(result.result),
              duracao_ms: result.duration_ms,
              erro: result.success ? null : 'Execution failed',
              iniciado_em: new Date().toISOString(),
              finalizado_em: new Date().toISOString(),
            }]);
        } catch (logErr) {
          console.warn('Erro ao armazenar log:', logErr);
        }

        setState(prev => ({
          ...prev,
          result,
          isExecuting: false,
          executionStatus: result.success ? 'success' : 'error',
          error: null,
        }));

        onSuccessRef.current?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro na execução');
        setState(prev => ({
          ...prev,
          isExecuting: false,
          executionStatus: 'error',
          error,
        }));
        onErrorRef.current?.(error);
        return null;
      }
    },
    // onSuccess/onError removed — accessed via stable refs
    [agentId, state.agentConfig, enableRAG, ragType, retrieveAndSave]
  );

  return {
    ...state,
    loadAgentConfig,
    execute,
    isReady: !state.isLoading && state.agentConfig !== null,
    hasError: state.error !== null,
    hasResult: state.result !== null,
    ragContext,
    ragDocuments,
    isRagLoading,
    executionId: executionIdRef.current,
  };
};
