-- CORREÇÃO RÁPIDA - Remove dependência de FTS em português
-- Rode isso no SQL Editor do Supabase

-- 1. Atualizar trigger para usar 'english' em vez de 'portuguese'
CREATE OR REPLACE FUNCTION giles_update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.keywords, ' '), '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Criar views que faltam
CREATE OR REPLACE VIEW v_stats AS
SELECT 
    (SELECT COUNT(*) FROM giles_knowledge) as total_knowledge,
    (SELECT COUNT(DISTINCT dominio) FROM giles_knowledge) as total_dominios,
    (SELECT COUNT(DISTINCT autor) FROM giles_knowledge) as total_autores,
    (SELECT COUNT(*) FROM giles_consultas) as total_consultas,
    (SELECT AVG(confianca) FROM giles_knowledge) as confiancia_media_global;

CREATE OR REPLACE VIEW v_knowledge_overview AS
SELECT 
    dominio,
    categoria,
    COUNT(*) as total_documentos,
    COUNT(DISTINCT source_file) as total_fontes,
    AVG(confianca) as confianca_media,
    COUNT(*) FILTER (WHERE revisado = TRUE) as documentos_revisados,
    MAX(created_at) as ultima_atualizacao
FROM giles_knowledge
GROUP BY dominio, categoria
ORDER BY dominio, categoria;

-- 3. Verificar se deu certo
SELECT 'Correção aplicada!' as status;
