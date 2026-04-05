import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncGtmaHJxcHJxcHR2ZWhhdGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjQyNjIsImV4cCI6MjA5MDgwMDI2Mn0.fXMvQhyLQXLgD_rK-slcHO4Jd_XF8mR_kYFTDHCsoxw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos para o GILES
export interface GilesChunk {
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

export interface GilesConsulta {
  id: string;
  query: string;
  agente: string;
  resultados: GilesChunk[];
  created_at: string;
}

// Busca híbrida no GILES (semântica + full-text)
export async function searchGiles(
  query: string,
  options: {
    dominio?: string;
    categoria?: string;
    limit?: number;
    threshold?: number;
  } = {}
): Promise<GilesChunk[]> {
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
      console.error('Erro na busca GILES:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro ao buscar no GILES:', err);
    return [];
  }
}

// Busca por domínio específico
export async function searchByDomain(
  query: string,
  dominio: string,
  limit: number = 5
): Promise<GilesChunk[]> {
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
export async function getChunkById(id: string): Promise<GilesChunk | null> {
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
export async function getRelatedChunks(chunkId: string): Promise<GilesChunk[]> {
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
      .overlap('tags', chunk.tags)
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

// Log de consulta
export async function logQuery(
  query: string,
  agente: string,
  resultados: GilesChunk[]
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

// Função para o chat com GILES - resposta simulada (até ter IA)
export async function askGiles(
  question: string,
  context: GilesChunk[]
): Promise<string> {
  // Aqui futuramente integraríamos com uma IA
  // Por enquanto, retorna uma resposta baseada nos contextos encontrados
  
  if (context.length === 0) {
    return "Não encontrei informações sobre isso na Alexandria. Pode reformular ou adicionar esse conhecimento?";
  }

  const sources = context.map(c => `- ${c.content.substring(0, 100)}...`).join('\n');
  
  return `Com base no que encontrei na Alexandria:\n\n${sources}\n\n[Esta é uma resposta simulada - integração com IA em desenvolvimento]`;
}
