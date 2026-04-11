/**
 * Tipos do Sistema Alexandria RAG
 */

export interface RagDocument {
  id: string;
  type: 'design_system' | 'pops' | 'slas' | 'client_info' | 'execution_history';
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding: number[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface RagContext {
  id: string;
  agentId: string;
  executionId: string;
  query: string;
  context: string;
  documentsUsed: string[];
  similarityScore: number;
  createdAt: string;
}

export interface RagSearchResult {
  document: RagDocument;
  similarity: number;
}

export interface RagQueryOptions {
  type?: string;
  limit?: number;
  threshold?: number;
  maxContextTokens?: number;
}
