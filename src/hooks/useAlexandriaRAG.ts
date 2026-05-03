import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const API_URL = 'https://alexandria.grupototum.com';

export type RAGDocType = 'skill' | 'pop' | 'doc' | 'context' | 'template';

export interface RAGDocument {
  id: string;
  title: string;
  content: string;
  doc_type: RAGDocType;
  path: string | null;
  metadata: Record<string, unknown>;
  source_type: string;
  source_path: string | null;
  last_synced_at: string | null;
  sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscoverResult {
  id: string;
  title: string;
  content: string;
  doc_type: string;
  path: string | null;
  relevance: number;
  type: string;
}

export interface DiscoverResponse {
  discovered: DiscoverResult[];
  recommended_action: string;
  primary_skill: string | null;
  query_used: string;
}

export interface IngestPayload {
  title: string;
  content: string;
  doc_type: RAGDocType;
  path?: string;
  metadata?: Record<string, unknown>;
}

export function useAlexandriaRAG() {
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: err } = await (supabase as any)
      .from('alexandria_documents')
      .select('id,title,content,doc_type,path,metadata,source_type,source_path,last_synced_at,sync_enabled,created_at,updated_at')
      .order('created_at', { ascending: false });
    if (err) setError(new Error(err.message));
    else setDocuments((data || []) as RAGDocument[]);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const ingest = useCallback(async (payload: IngestPayload): Promise<{ id: string }> => {
    const res = await fetch(`${API_URL}/alexandria/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || 'Erro ao ingerir documento');
    await load();
    return json;
  }, [load]);

  const deleteDoc = useCallback(async (id: string): Promise<void> => {
    const { error: err } = await (supabase as any)
      .from('alexandria_documents')
      .delete()
      .eq('id', id);
    if (err) throw new Error(err.message);
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const discover = useCallback(async (
    query: string,
    types: RAGDocType[] = ['skill', 'pop', 'doc'],
    limit = 5
  ): Promise<DiscoverResponse> => {
    const res = await fetch(`${API_URL}/alexandria/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, types, limit }),
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || 'Erro ao buscar');
    return json;
  }, []);

  const stats = {
    total: documents.length,
    byType: documents.reduce<Record<string, number>>((acc, d) => {
      acc[d.doc_type] = (acc[d.doc_type] || 0) + 1;
      return acc;
    }, {}),
    lastIngested: documents[0]?.created_at ?? null,
  };

  return { documents, isLoading, error, stats, refetch: load, ingest, deleteDoc, discover };
}
