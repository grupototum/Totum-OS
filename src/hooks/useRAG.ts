/**
 * Alexandria RAG Hook
 * Gerencia contexto e retrieval para agentes
 */

import { useState, useCallback } from 'react';
import { 
  searchSimilarDocuments, 
  buildContext, 
  saveExecutionContext 
} from '@/services/embeddingService';
import type { RagSearchResult, RagQueryOptions } from '@/types/rag';

interface UseRAGReturn {
  context: string;
  documents: RagSearchResult[];
  isLoading: boolean;
  error: string | null;
  similarityScore: number;
  retrieveContext: (query: string, options?: RagQueryOptions) => Promise<string>;
  retrieveAndSave: (
    query: string, 
    agentId: string, 
    executionId: string,
    options?: RagQueryOptions
  ) => Promise<{ context: string; documents: string[] } | null>;
  clearContext: () => void;
}

export function useRAG(): UseRAGReturn {
  const [context, setContext] = useState<string>('');
  const [documents, setDocuments] = useState<RagSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState(0);

  /**
   * Recupera contexto relevante baseado na query
   */
  const retrieveContext = useCallback(async (
    query: string,
    options: RagQueryOptions = {}
  ): Promise<string> => {
    const {
      type,
      limit = 5,
      threshold = 0.5,
      maxContextTokens = 2000
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      // Buscar documentos similares
      const results = await searchSimilarDocuments(query, type, limit, threshold);
      
      if (results.length === 0) {
        setContext('');
        setDocuments([]);
        setSimilarityScore(0);
        setIsLoading(false);
        return '';
      }

      // Calcular score médio
      const avgScore = results.reduce((sum, r) => sum + r.similarity, 0) / results.length;
      setSimilarityScore(avgScore);

      // Construir contexto
      const builtContext = buildContext(results, maxContextTokens);
      
      setContext(builtContext);
      setDocuments(results);
      setIsLoading(false);

      return builtContext;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao recuperar contexto';
      setError(errorMessage);
      setIsLoading(false);
      return '';
    }
  }, []);

  /**
   * Recupera contexto e salva no banco
   */
  const retrieveAndSave = useCallback(async (
    query: string,
    agentId: string,
    executionId: string,
    options: RagQueryOptions = {}
  ): Promise<{ context: string; documents: string[] } | null> => {
    const {
      type,
      limit = 5,
      threshold = 0.5,
      maxContextTokens = 2000
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      // Buscar documentos similares
      const results = await searchSimilarDocuments(query, type, limit, threshold);
      
      if (results.length === 0) {
        setIsLoading(false);
        return null;
      }

      // Calcular score médio
      const avgScore = results.reduce((sum, r) => sum + r.similarity, 0) / results.length;
      setSimilarityScore(avgScore);

      // Construir contexto
      const builtContext = buildContext(results, maxContextTokens);
      
      // IDs dos documentos usados
      const documentIds = results.map(r => r.document.id);
      
      // Salvar no banco
      await saveExecutionContext(
        agentId,
        executionId,
        query,
        builtContext,
        documentIds,
        avgScore
      );

      setContext(builtContext);
      setDocuments(results);
      setIsLoading(false);

      return {
        context: builtContext,
        documents: documentIds
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao recuperar contexto';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Limpa o contexto atual
   */
  const clearContext = useCallback(() => {
    setContext('');
    setDocuments([]);
    setSimilarityScore(0);
    setError(null);
  }, []);

  return {
    context,
    documents,
    isLoading,
    error,
    similarityScore,
    retrieveContext,
    retrieveAndSave,
    clearContext
  };
}
