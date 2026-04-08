/** 
 * Alexandria Embedding Service
 * Gerencia criação e busca de embeddings para RAG
 */

import { supabase } from '@/integrations/supabase/client';
import type { RagDocument, RagContext } from '@/types/rag';

// Embedding dimensions (OpenAI text-embedding-3-small)
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Gera embedding usando API externa (OpenAI/Moonshot)
 * Em produção: integrar com API real de embeddings
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Integrar com OpenAI Embedding API ou Moonshot
  // Por enquanto: gera embedding simulado para desenvolvimento
  
  if (process.env.NODE_ENV === 'development' || true) {
    // Mock embedding: vetor normalizado de tamanho fixo
    const mockEmbedding = new Array(EMBEDDING_DIMENSIONS)
      .fill(0)
      .map(() => (Math.random() - 0.5) * 2);
    
    // Normalizar vetor
    const magnitude = Math.sqrt(mockEmbedding.reduce((sum, val) => sum + val * val, 0));
    return mockEmbedding.map(val => val / magnitude);
  }
  
  // Produção: chamar API OpenAI
  // const response = await fetch('https://api.openai.com/v1/embeddings', {...})
  
  return [];
}

/**
 * Busca documentos similares usando cosine similarity
 */
export async function searchSimilarDocuments(
  query: string,
  type?: string,
  limit: number = 5,
  threshold: number = 0.7
): Promise<{ document: RagDocument; similarity: number }[]> {
  try {
    // Gerar embedding da query
    const queryEmbedding = await generateEmbedding(query);
    
    // Buscar documentos similares
    const { data, error } = await (supabase.rpc as any)('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filter_type: type || null
    });
    
    if (error) {
      console.error('Erro ao buscar documentos:', error);
      
      // Fallback: busca textual simples
      return fallbackTextSearch(query, type, limit);
    }
    
    return data?.map((row: any) => ({
      document: {
        id: row.id,
        type: row.type,
        title: row.title,
        content: row.content,
        metadata: row.metadata,
        embedding: row.embedding,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      },
      similarity: row.similarity
    })) || [];
    
  } catch (err) {
    console.error('Erro na busca de embeddings:', err);
    return fallbackTextSearch(query, type, limit);
  }
}

/**
 * Busca textual simples (fallback quando pgvector não está disponível)
 */
async function fallbackTextSearch(
  query: string,
  type?: string,
  limit: number = 5
): Promise<{ document: RagDocument; similarity: number }[]> {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(' ').filter(t => t.length > 2);
  
  let queryBuilder = (supabase as any)
    .from('rag_documents')
    .select('*');
  
  if (type) {
    queryBuilder = queryBuilder.eq('type', type);
  }
  
  const { data, error } = await queryBuilder.limit(limit * 3);
  
  if (error || !data) {
    return [];
  }
  
  // Calcular score de relevância simples
  const scored = data.map((doc: any) => {
    const contentLower = (doc.title + ' ' + doc.content).toLowerCase();
    let score = 0;
    
    queryTerms.forEach(term => {
      if (contentLower.includes(term)) {
        score += 1;
      }
    });
    
    // Normalizar score (0-1)
    const normalizedScore = Math.min(score / queryTerms.length, 1);
    
    return {
      document: {
        id: doc.id,
        type: doc.type,
        title: doc.title,
        content: doc.content,
        metadata: doc.metadata,
        embedding: doc.embedding,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at
      },
      similarity: normalizedScore
    };
  });
  
  // Ordenar por score e limitar
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .filter(item => item.similarity > 0);
}

/**
 * Constroi contexto a partir de documentos similares
 */
export function buildContext(
  documents: { document: RagDocument; similarity: number }[],
  maxTokens: number = 2000
): string {
  let context = '';
  let currentTokens = 0;
  const tokensPerChar = 0.25; // Estimativa aproximada
  
  for (const { document, similarity } of documents) {
    const docText = `\n---\n[${document.type.toUpperCase()}] ${document.title} (relevância: ${(similarity * 100).toFixed(0)}%)\n${document.content}\n---\n`;
    const docTokens = docText.length * tokensPerChar;
    
    if (currentTokens + docTokens > maxTokens) {
      break;
    }
    
    context += docText;
    currentTokens += docTokens;
  }
  
  return context.trim();
}

/**
 * Salva contexto usado em uma execução
 */
export async function saveExecutionContext(
  agentId: string,
  executionId: string,
  query: string,
  context: string,
  documentsUsed: string[],
  similarityScore: number
): Promise<void> {
  try {
    const { error } = await (supabase as any)
      .from('rag_context')
      .insert({
        agent_id: agentId,
        execution_id: executionId,
        query,
        context,
        documents_used: documentsUsed,
        similarity_score: similarityScore
      });
    
    if (error) {
      console.error('Erro ao salvar contexto:', error);
    }
  } catch (err) {
    console.error('Erro ao salvar contexto:', err);
  }
}

/**
 * Adiciona novo documento ao RAG
 */
export async function addDocument(
  type: string,
  title: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<RagDocument | null> {
  try {
    // Gerar embedding (opcional - pode ser feito async depois)
    let embedding = null;
    try {
      embedding = await generateEmbedding(content);
    } catch (e) {
      console.log('Embedding generation failed, storing without vector');
    }
    
    const { data, error } = await (supabase as any)
      .from('rag_documents')
      .insert({
        type,
        title,
        content,
        metadata,
        embedding
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar documento:', error);
      return null;
    }
    
    return {
      id: data.id,
      type: data.type,
      title: data.title,
      content: data.content,
      metadata: data.metadata,
      embedding: data.embedding,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
  } catch (err) {
    console.error('Erro ao adicionar documento:', err);
    return null;
  }
}

/**
 * Lista documentos por tipo
 */
export async function listDocuments(
  type?: string,
  limit: number = 50
): Promise<RagDocument[]> {
  try {
    let queryBuilder = supabase
      .from('rag_documents' as any)
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (type) {
      queryBuilder = queryBuilder.eq('type', type);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('Erro ao listar documentos:', error);
      return [];
    }
    
    return data?.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      content: doc.content,
      metadata: doc.metadata,
      embedding: doc.embedding,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    })) || [];
    
  } catch (err) {
    console.error('Erro ao listar documentos:', err);
    return [];
  }
}
