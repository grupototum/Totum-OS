/**
 * Giles Client - Cliente Supabase para o Cientista da Informação
 * 
 * Uso:
 *   const Giles = require('./giles-client-supabase');
 *   const giles = new GilesClient();
 *   
 *   // Inserir documento
 *   await giles.ingest({ content: '...', dominio: 'Infra', categoria: 'DevOps' });
 *   
 *   // Consultar
 *   const results = await giles.query('como configurar docker');
 */

const { createClient } = require('@supabase/supabase-js');

class GilesClient {
    constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;
        
        if (!url || !key) {
            throw new Error('SUPABASE_URL e SUPABASE_KEY devem estar configurados nas variáveis de ambiente');
        }
        
        this.supabase = createClient(url, key);
    }
    
    /**
     * Calcula similaridade de cosseno entre dois vetores
     */
    cosineSimilarity(a, b) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    /**
     * Insere um novo chunk de conhecimento
     */
    async ingest({
        content,
        embedding = null,
        dominio,
        categoria,
        subcategoria = null,
        tags = [],
        keywords = [],
        entidades = [],
        relacionamentos = [],
        source_file = null,
        source_type = 'file',
        chunk_index = 0,
        total_chunks = 1,
        autor = 'desconhecido',
        confianca = 0.9,
        pai_id = null,
        visibilidade = 'public'
    }) {
        const chunk_id = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const { data, error } = await this.supabase
            .from('giles_knowledge')
            .insert({
                chunk_id,
                content,
                embedding,
                dominio,
                categoria,
                subcategoria,
                tags,
                keywords,
                entidades,
                relacionamentos,
                source_file,
                source_type,
                chunk_index,
                total_chunks,
                autor,
                confianca,
                pai_id,
                visibilidade
            })
            .select();
        
        if (error) throw error;
        return data[0];
    }
    
    /**
     * Busca por Full-Text Search
     */
    async searchFTS(query, limit = 10) {
        // Usa a view ou busca direta com ilike
        const { data, error } = await this.supabase
            .from('giles_knowledge')
            .select('*')
            .ilike('content', `%${query}%`)
            .limit(limit);
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Busca híbrida (vetorial + full-text) via RPC
     */
    async searchHybrid(queryText, queryEmbedding, options = {}) {
        const { 
            limit = 10, 
            threshold = 0.7,
            fullTextWeight = 0.3,
            semanticWeight = 0.7
        } = options;
        
        const { data, error } = await this.supabase.rpc('giles_hybrid_search', {
            query_embedding: queryEmbedding,
            query_text: queryText,
            match_count: limit,
            match_threshold: threshold,
            full_text_weight: fullTextWeight,
            semantic_weight: semanticWeight
        });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Busca por domínio específico
     */
    async searchByDomain(queryText, queryEmbedding, dominio, limit = 10) {
        const { data, error } = await this.supabase.rpc('giles_search_by_domain', {
            query_embedding: queryEmbedding,
            target_dominio: dominio,
            match_count: limit
        });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Obtém árvore hierárquica de um nó
     */
    async getTree(rootId) {
        const { data, error } = await this.supabase.rpc('giles_get_tree', {
            root_id: rootId
        });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Obtém estatísticas do banco
     */
    async getStats() {
        const { data, error } = await this.supabase
            .from('v_stats')
            .select('*')
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Obtém overview por domínio
     */
    async getOverview() {
        const { data, error } = await this.supabase
            .from('v_knowledge_overview')
            .select('*');
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Lista domínios disponíveis
     */
    async getDominios() {
        const { data, error } = await this.supabase
            .from('giles_dominios')
            .select('*')
            .eq('ativo', true)
            .order('nome');
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Registra uma consulta no log
     */
    async logConsulta({ consulta, resposta, fontes, confianca_media, tempo_ms, usuario_id, session_id }) {
        const { data, error } = await this.supabase
            .from('giles_consultas')
            .insert({
                consulta,
                resposta,
                fontes,
                confianca_media,
                tempo_resposta_ms: tempo_ms,
                usuario_id,
                session_id
            });
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Obtém sinônimos de um termo
     */
    async getSinonimos(termo, dominio = null) {
        let query = this.supabase
            .from('giles_sinonimos')
            .select('sinonimos')
            .eq('termo', termo);
        
        if (dominio) {
            query = query.eq('dominio', dominio);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data.length > 0 ? data[0].sinonimos : [];
    }
}

module.exports = GilesClient;
