-- ============================================
-- FUNÇÃO: match_documents
-- Busca documentos por similaridade de embedding
-- ============================================

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_type text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  type text,
  title text,
  content text,
  metadata jsonb,
  embedding vector(1536),
  similarity float,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rd.id,
    rd.type,
    rd.title,
    rd.content,
    rd.metadata,
    rd.embedding,
    1 - (rd.embedding <=> query_embedding) AS similarity,
    rd.created_at,
    rd.updated_at
  FROM rag_documents rd
  WHERE 
    -- Filtrar por tipo se especificado
    (filter_type IS NULL OR rd.type = filter_type)
    -- Apenas documentos com embedding
    AND rd.embedding IS NOT NULL
    -- Similaridade acima do threshold
    AND 1 - (rd.embedding <=> query_embedding) > match_threshold
  ORDER BY rd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- FUNÇÃO: generate_embedding (atualizada)
-- Placeholder para integração futura com API
-- ============================================

CREATE OR REPLACE FUNCTION generate_embedding(text_input TEXT)
RETURNS vector(1536) AS $$
DECLARE
  result_vector vector(1536);
BEGIN
  -- Placeholder: retorna vetor nulo
  -- Em produção: chamar API externa via pg_http ou similar
  
  -- Por enquanto, retorna NULL (fallback para text search)
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ÍNDICE ADICIONAL: Busca textual
-- ============================================

CREATE INDEX IF NOT EXISTS idx_rag_documents_search 
ON rag_documents USING gin(to_tsvector('portuguese', title || ' ' || content));
