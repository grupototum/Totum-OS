/**
 * Giles Client - Cliente SQLite para o Cientista da Informação
 * 
 * Uso:
 *   const Giles = require('./giles-client');
 *   const giles = new Giles('./Alexandria/giles.db');
 *   
 *   // Inserir documento
 *   await giles.ingest({ content: '...', dominio: 'Infra', categoria: 'DevOps' });
 *   
 *   // Consultar
 *   const results = giles.query('como configurar docker');
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class GilesClient {
    constructor(dbPath = './Alexandria/giles.db') {
        // Garante que o diretório existe
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');  // Melhor performance para concorrência
        this.db.pragma('foreign_keys = ON');
        
        // Inicializa schema se necessário
        this.initSchema();
    }
    
    /**
     * Inicializa o schema do banco
     */
    initSchema() {
        const schemaPath = path.join(__dirname, 'schema_sqlite.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            this.db.exec(schema);
        }
    }
    
    /**
     * Gera hash SHA256 de um conteúdo
     */
    hash(content) {
        return crypto.createHash('sha256').update(content).digest('hex');
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
    ingest({
        content,
        embedding = null,
        dominio,
        categoria,
        subcategoria = null,
        tags = [],
        keywords = [],
        entidades = [],
        source_file = null,
        source_type = 'file',
        chunk_index = 0,
        total_chunks = 1,
        autor = 'desconhecido',
        confianca = 0.9,
        pai_id = null
    }) {
        const chunk_id = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const file_hash = this.hash(content);
        
        const stmt = this.db.prepare(`
            INSERT INTO knowledge (
                chunk_id, content, embedding, dominio, categoria, subcategoria,
                tags, keywords, entidades, source_file, source_type, file_hash,
                chunk_index, total_chunks, autor, confianca, pai_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            chunk_id,
            content,
            embedding ? JSON.stringify(embedding) : null,
            dominio,
            categoria,
            subcategoria,
            JSON.stringify(tags),
            JSON.stringify(keywords),
            JSON.stringify(entidades),
            source_file,
            source_type,
            file_hash,
            chunk_index,
            total_chunks,
            autor,
            confianca,
            pai_id
        );
        
        return {
            id: result.lastInsertRowid,
            chunk_id
        };
    }
    
    /**
     * Busca por Full-Text Search (FTS5)
     */
    searchFTS(query, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT k.*, rank as score
            FROM knowledge_fts f
            JOIN knowledge k ON f.rowid = k.id
            WHERE knowledge_fts MATCH ?
            ORDER BY rank
            LIMIT ?
        `);
        
        return stmt.all(query, limit).map(row => ({
            ...row,
            tags: JSON.parse(row.tags || '[]'),
            keywords: JSON.parse(row.keywords || '[]'),
            entidades: JSON.parse(row.entidades || '[]'),
            embedding: row.embedding ? JSON.parse(row.embedding) : null
        }));
    }
    
    /**
     * Busca por similaridade vetorial (cosseno)
     */
    searchVector(queryEmbedding, threshold = 0.7, limit = 10) {
        const stmt = this.db.prepare(`
            SELECT id, content, dominio, categoria, tags, embedding
            FROM knowledge
            WHERE embedding IS NOT NULL
        `);
        
        const rows = stmt.all();
        
        return rows
            .map(row => {
                const emb = JSON.parse(row.embedding);
                const similarity = this.cosineSimilarity(queryEmbedding, emb);
                return { ...row, similarity, tags: JSON.parse(row.tags || '[]') };
            })
            .filter(row => row.similarity >= threshold)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
    }
    
    /**
     * Busca híbrida: FTS + Vetorial (simplificada)
     */
    searchHybrid(queryText, queryEmbedding = null, options = {}) {
        const { limit = 10, dominio = null, categoria = null } = options;
        
        // Busca FTS
        let ftsResults = this.searchFTS(queryText, limit * 2);
        
        // Filtra por domínio/categoria se especificado
        if (dominio) {
            ftsResults = ftsResults.filter(r => r.dominio === dominio);
        }
        if (categoria) {
            ftsResults = ftsResults.filter(r => r.categoria === categoria);
        }
        
        // Se tem embedding, busca vetorial também
        let vectorResults = [];
        if (queryEmbedding) {
            vectorResults = this.searchVector(queryEmbedding, 0.6, limit);
            if (dominio) {
                vectorResults = vectorResults.filter(r => r.dominio === dominio);
            }
        }
        
        // Merge e deduplica
        const seen = new Set();
        const merged = [];
        
        for (const r of [...vectorResults, ...ftsResults]) {
            if (!seen.has(r.id)) {
                seen.add(r.id);
                merged.push(r);
            }
        }
        
        return merged.slice(0, limit);
    }
    
    /**
     * Busca por domínio específico
     */
    searchByDomain(queryText, dominio, limit = 10) {
        return this.searchHybrid(queryText, null, { dominio, limit });
    }
    
    /**
     * Obtém árvore hierárquica de um nó
     */
    getTree(rootId, maxDepth = 5) {
        const tree = [];
        const queue = [{ id: rootId, depth: 0, path: [] }];
        const seen = new Set();
        
        while (queue.length > 0) {
            const { id, depth, path } = queue.shift();
            
            if (seen.has(id) || depth > maxDepth) continue;
            seen.add(id);
            
            const row = this.db.prepare('SELECT * FROM knowledge WHERE id = ?').get(id);
            if (!row) continue;
            
            const nodePath = [...path, row.categoria];
            tree.push({
                ...row,
                nivel: depth,
                caminho: nodePath,
                tags: JSON.parse(row.tags || '[]')
            });
            
            // Busca filhos
            const children = this.db.prepare('SELECT id FROM knowledge WHERE pai_id = ?').all(id);
            for (const child of children) {
                queue.push({ id: child.id, depth: depth + 1, path: nodePath });
            }
        }
        
        return tree;
    }
    
    /**
     * Obtém estatísticas do banco
     */
    getStats() {
        return this.db.prepare('SELECT * FROM v_stats').get();
    }
    
    /**
     * Obtém overview por domínio
     */
    getOverview() {
        return this.db.prepare('SELECT * FROM v_knowledge_overview').all();
    }
    
    /**
     * Lista domínios disponíveis
     */
    getDominios() {
        return this.db.prepare('SELECT * FROM dominios WHERE ativo = 1 ORDER BY nome').all();
    }
    
    /**
     * Adiciona sinônimos
     */
    addSinonimo(termo, sinonimos, dominio = null) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO sinonimos (termo, sinonimos, dominio)
            VALUES (?, ?, ?)
        `);
        return stmt.run(termo, JSON.stringify(sinonimos), dominio);
    }
    
    /**
     * Obtém sinônimos de um termo
     */
    getSinonimos(termo, dominio = null) {
        const stmt = this.db.prepare(`
            SELECT sinonimos FROM sinonimos 
            WHERE termo = ? AND (dominio = ? OR dominio IS NULL)
        `);
        const row = stmt.get(termo, dominio);
        return row ? JSON.parse(row.sinonimos) : [];
    }
    
    /**
     * Registra uma consulta no log
     */
    logConsulta({ consulta, resposta, fontes, confianca_media, tempo_ms, usuario_id, session_id }) {
        const stmt = this.db.prepare(`
            INSERT INTO consultas (consulta, resposta, fontes, confianca_media, 
                                   tempo_resposta_ms, usuario_id, session_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            consulta,
            resposta,
            JSON.stringify(fontes || []),
            confianca_media,
            tempo_ms,
            usuario_id,
            session_id
        );
    }
    
    /**
     * Backup do banco
     */
    backup(backupDir = './Alexandria/backups') {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `giles_${timestamp}.db`);
        
        this.db.backup(backupPath)
            .then(() => console.log(`Backup criado: ${backupPath}`))
            .catch(err => console.error('Erro no backup:', err));
        
        return backupPath;
    }
    
    /**
     * Fecha conexão com o banco
     */
    close() {
        this.db.close();
    }
}

module.exports = GilesClient;
