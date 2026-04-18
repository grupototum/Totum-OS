// Hermione Knowledge Service
// Uses unified Supabase client from src/integrations/supabase/client.ts
export { supabase } from '@/integrations/supabase/client';

// Tipos para o Hermione
export interface HermioneChunk {
  id: string;
  chunk_id: string;
  content: string;
  dominio: string;
  categoria: string;
  subcategoria?: string;
  tags: string[];
  keywords: string[];
  entidades: Record<string, any>;
  relacionamentos: Record<string, any>;
  source_file: string;
  source_type: string;
  autor: string;
  created_at: string;
  updated_at: string;
  confianca: number;
  pai_id?: string;
}

export interface HermioneConsulta {
  id: string;
  query: string;
  agente: string;
  resultados: HermioneChunk[];
  created_at: string;
}

// Busca híbrida no Hermione (semântica + full-text)
export async function searchHermione(
  query: string,
  options: {
    dominio?: string;
    categoria?: string;
    limit?: number;
    threshold?: number;
  } = {}
): Promise<HermioneChunk[]> {
  const { dominio, categoria, limit = 10, threshold = 0.7 } = options;

  try {
    // Busca por texto (full-text search)
    let query_builder = supabase
      .from('giles_knowledge')
      .select('*')
      .or(`content.ilike.%${query}%,tags.cs.{${query}},keywords.cs.{${query}}`)
      .order('confianca', { ascending: false })
      .limit(limit);

    if (dominio) {
      query_builder = query_builder.eq('dominio', dominio);
    }

    if (categoria) {
      query_builder = query_builder.eq('categoria', categoria);
    }

    const { data, error } = await query_builder;

    if (error) {
      console.error('Erro na busca Hermione:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar no Hermione:', err);
    return [];
  }
}

// Busca por domínio específico
export async function searchByDomain(
  query: string,
  dominio: string,
  limit: number = 5
): Promise<HermioneChunk[]> {
  try {
    const { data, error } = await supabase
      .from('giles_knowledge')
      .select('*')
      .eq('dominio', dominio)
      .or(`content.ilike.%${query}%,tags.cs.{${query}}`)
      .limit(limit);

    if (error) {
      console.error('Erro na busca por domínio:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar por domínio:', err);
    return [];
  }
}

// Listar todos os domínios
export async function listDomains(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('giles_dominios')
      .select('nome')
      .order('nome');

    if (error) {
      console.error('Erro ao listar domínios:', error);
      return [];
    }

    return data?.map(d => d.nome) || [];
  } catch (err) {
    console.error('Erro ao listar domínios:', err);
    return [];
  }
}

// Listar categorias de um domínio
export async function listCategories(dominio: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('giles_knowledge')
      .select('categoria')
      .eq('dominio', dominio)
      .order('categoria');

    if (error) {
      console.error('Erro ao listar categorias:', error);
      return [];
    }

    const categorias = [...new Set(data?.map(d => d.categoria))];
    return categorias;
  } catch (err) {
    console.error('Erro ao listar categorias:', err);
    return [];
  }
}

// Buscar chunks por ID
export async function getChunkById(id: string): Promise<HermioneChunk | null> {
  try {
    const { data, error } = await supabase
      .from('giles_knowledge')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar chunk:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro ao buscar chunk por ID:', err);
    return null;
  }
}

// Buscar chunks relacionados
export async function getRelatedChunks(chunkId: string): Promise<HermioneChunk[]> {
  try {
    // Primeiro busca o chunk original para pegar tags/domínio
    const chunk = await getChunkById(chunkId);
    if (!chunk) return [];

    // Busca chunks com tags ou domínio similares
    const { data, error } = await supabase
      .from('giles_knowledge')
      .select('*')
      .eq('dominio', chunk.dominio)
      .neq('id', chunkId)
      .overlaps('tags', chunk.tags)
      .limit(5);

    if (error) {
      console.error('Erro ao buscar relacionados:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar relacionados:', err);
    return [];
  }
}

// Inserir novo conhecimento (para o TOT usar)
export async function insertKnowledge(
  content: string,
  metadata: {
    dominio: string;
    categoria: string;
    subcategoria?: string;
    tags: string[];
    source_file: string;
    autor: string;
  }
): Promise<boolean> {
  try {
    const chunk_id = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase
      .from('giles_knowledge')
      .insert({
        chunk_id,
        content,
        dominio: metadata.dominio,
        categoria: metadata.categoria,
        subcategoria: metadata.subcategoria,
        tags: metadata.tags,
        keywords: metadata.tags,
        source_file: metadata.source_file,
        autor: metadata.autor,
        entidades: {},
        relacionamentos: {},
        confianca: 1.0,
      });

    if (error) {
      console.error('Erro ao inserir conhecimento:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erro ao inserir conhecimento:', err);
    return false;
  }
}

/**
 * Semantic search using pgvector cosine similarity.
 * Calls the match_knowledge RPC function in Supabase.
 */
export async function searchHermioneSemantic(
  query: string,
  options: { limit?: number; threshold?: number } = {}
): Promise<HermioneChunk[]> {
  const { limit = 8, threshold = 0.45 } = options;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) return [];

  try {
    // Generate query embedding
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text: query.substring(0, 500) }] },
        }),
      }
    );
    if (!res.ok) return [];
    const embData = await res.json();
    const embedding: number[] = embData?.embedding?.values ?? [];
    if (!embedding.length) return [];

    // Call RPC
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      console.error('Semantic search error:', error);
      return [];
    }

    return (data ?? []) as HermioneChunk[];
  } catch (err) {
    console.error('Semantic search failed:', err);
    return [];
  }
}

/**
 * Hybrid search: semantic first, falls back to / merges with text search.
 * Deduplicates by id.
 */
export async function searchHermioneHybrid(
  query: string,
  options: { limit?: number; dominio?: string } = {}
): Promise<HermioneChunk[]> {
  const { limit = 8, dominio } = options;

  // Run both in parallel
  const [semantic, text] = await Promise.all([
    searchHermioneSemantic(query, { limit, threshold: 0.45 }),
    searchHermione(query, { limit: Math.ceil(limit / 2), dominio }),
  ]);

  // Merge & deduplicate (semantic results first = higher priority)
  const seen = new Set<string>();
  const merged: HermioneChunk[] = [];
  for (const chunk of [...semantic, ...text]) {
    if (!seen.has(chunk.id)) {
      seen.add(chunk.id);
      merged.push(chunk);
    }
  }
  return merged.slice(0, limit);
}

// Log de consulta
export async function logQuery(
  query: string,
  agente: string,
  resultados: HermioneChunk[]
): Promise<void> {
  try {
    await supabase
      .from('giles_consultas')
      .insert({
        query,
        agente,
        resultados: resultados.map(r => r.id),
      });
  } catch (err) {
    console.error('Erro ao logar consulta:', err);
  }
}

/**
 * Chat com Hermione — delega para Gemini via askGeminiAsHermione.
 * Mantida para compatibilidade; em novos códigos, importe direto de @/services/gemini.
 */
export { askGeminiAsHermione as askHermione } from '@/services/gemini';
