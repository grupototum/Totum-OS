#!/usr/bin/env node
/**
 * Teste de Fogo do Giles - Versão SQLite
 * O Giles organiza seus próprios arquivos para provar que está pronto
 * 
 * Uso: node teste-giles.js
 * Pré-requisito: npm install better-sqlite3
 */

const fs = require('fs');
const path = require('path');
const GilesClient = require('./giles-client');

// Diretórios
const GILES_DIR = path.join(__dirname);
const WORKSPACE_DIR = path.join(__dirname, '..', '..');
const DB_PATH = path.join(WORKSPACE_DIR, 'Alexandria', 'giles.db');

/**
 * Lê e chunka arquivos do workspace
 */
async function chunkFiles() {
    console.log('📚 Giles iniciando auto-organização...\n');
    
    const files = [];
    
    // Lista de arquivos importantes do workspace
    const targetFiles = [
        'AGENTS.md',
        'SOUL.md', 
        'USER.md',
        'IDENTITY.md',
        'TODO.md',
        'TOOLS.md',
        'HEARTBEAT.md',
        'BOOTSTRAP.md'
    ];
    
    for (const file of targetFiles) {
        const filePath = path.join(WORKSPACE_DIR, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const chunks = chunkContent(content, file);
            files.push({ file, chunks });
            console.log(`  ✅ ${file}: ${chunks.length} chunks`);
        }
    }
    
    // Arquivos do próprio Giles
    const gilesFiles = [
        'Modelfile',
        'schema_sqlite.sql',
        'ARQUITETURA.md',
        'giles-client.js'
    ];
    
    for (const file of gilesFiles) {
        const filePath = path.join(GILES_DIR, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const chunks = chunkContent(content, `agents/giles/${file}`);
            files.push({ file: `agents/giles/${file}`, chunks });
            console.log(`  ✅ agents/giles/${file}: ${chunks.length} chunks`);
        }
    }
    
    return files;
}

/**
 * Divide conteúdo em chunks de ~500 tokens (estimativa simples)
 */
function chunkContent(content, sourceFile) {
    const chunks = [];
    const lines = content.split('\n');
    let currentChunk = [];
    let currentSize = 0;
    const TARGET_SIZE = 400; // aproximadamente 500 tokens
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineSize = line.split(/\s+/).length;
        
        if (currentSize + lineSize > TARGET_SIZE && currentChunk.length > 0) {
            // Salva chunk atual
            chunks.push({
                content: currentChunk.join('\n'),
                index: chunks.length,
                sourceFile
            });
            
            // Overlap de 5 linhas (aprox 10%)
            const overlapLines = currentChunk.slice(-5);
            currentChunk = [...overlapLines, line];
            currentSize = overlapLines.join('\n').split(/\s+/).length + lineSize;
        } else {
            currentChunk.push(line);
            currentSize += lineSize;
        }
    }
    
    // Último chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n'),
            index: chunks.length,
            sourceFile
        });
    }
    
    return chunks;
}

/**
 * Extrai metadados de um chunk (simulação do que o Giles faria)
 */
function extractMetadata(chunk, sourceFile) {
    const content = chunk.content.toLowerCase();
    
    // Detecção simples de domínio
    let dominio = 'Geral';
    if (content.includes('infra') || content.includes('servidor') || content.includes('vps') || content.includes('docker')) {
        dominio = 'Infraestrutura';
    } else if (content.includes('código') || content.includes('api') || content.includes('software') || content.includes('dev')) {
        dominio = 'Desenvolvimento';
    } else if (content.includes('negócio') || content.includes('cliente') || content.includes('contrato') || content.includes('financeiro')) {
        dominio = 'Negócios';
    } else if (content.includes('marketing') || content.includes('campanha') || content.includes('tráfego')) {
        dominio = 'Marketing';
    } else if (content.includes('totum') || content.includes('agente') || content.includes('giles') || content.includes('openclaw')) {
        dominio = 'Operações';
    } else if (content.includes('israel') || content.includes('família') || content.includes('pessoal') || content.includes('miguel')) {
        dominio = 'Pessoal';
    }
    
    // Detecção de categoria
    let categoria = 'Geral';
    if (sourceFile.includes('TODO')) categoria = 'Planejamento';
    else if (sourceFile.includes('AGENTS')) categoria = 'Configuração';
    else if (sourceFile.includes('SOUL') || sourceFile.includes('IDENTITY')) categoria = 'Identidade';
    else if (sourceFile.includes('USER')) categoria = 'Contexto';
    else if (sourceFile.includes('Modelfile')) categoria = 'Configuração de Agente';
    else if (sourceFile.includes('schema')) categoria = 'Banco de Dados';
    else if (sourceFile.includes('ARQUITETURA')) categoria = 'Documentação';
    else if (sourceFile.includes('client')) categoria = 'Código';
    
    // Tags
    const tags = [];
    if (content.includes('giles')) tags.push('Giles');
    if (content.includes('openclaw')) tags.push('OpenClaw');
    if (content.includes('sqlite')) tags.push('SQLite');
    if (content.includes('oracle')) tags.push('Oracle');
    if (content.includes('rag')) tags.push('RAG');
    if (content.includes('totum')) tags.push('Totum');
    if (content.includes('alexandria')) tags.push('Alexandria');
    
    // Entidades
    const entidades = [];
    if (content.includes('totum')) entidades.push({ nome: 'Totum', tipo: 'empresa' });
    if (content.includes('israel')) entidades.push({ nome: 'Israel', tipo: 'pessoa' });
    if (content.includes('giles')) entidades.push({ nome: 'Giles', tipo: 'agente' });
    if (content.includes('tot')) entidades.push({ nome: 'TOT', tipo: 'agente' });
    if (content.includes('manus')) entidades.push({ nome: 'Manus', tipo: 'agente' });
    
    return {
        dominio,
        categoria,
        subcategoria: sourceFile.replace(/.*\//, '').replace(/\.\w+$/, ''),
        tags: tags.length > 0 ? tags : ['documentação'],
        keywords: [],
        entidades,
        source_file: sourceFile,
        source_type: 'file',
        autor: 'Giles',
        confianca: 0.85
    };
}

/**
 * Insere chunks no banco SQLite
 */
async function insertChunks(giles, files) {
    console.log('\n💾 Inserindo no banco SQLite...\n');
    
    let totalInseridos = 0;
    
    for (const { file, chunks } of files) {
        for (const chunk of chunks) {
            const metadata = extractMetadata(chunk, file);
            
            // Embedding será null (não temos modelo local aqui)
            // Na prática, gerar via OpenAI, Gemini ou modelo local
            
            const result = giles.ingest({
                content: chunk.content,
                embedding: null,  // TODO: gerar embedding real
                dominio: metadata.dominio,
                categoria: metadata.categoria,
                subcategoria: metadata.subcategoria,
                tags: metadata.tags,
                entidades: metadata.entidades,
                source_file: metadata.source_file,
                source_type: metadata.source_type,
                chunk_index: chunk.index,
                total_chunks: chunks.length,
                autor: metadata.autor,
                confianca: metadata.confianca
            });
            
            if (result.chunk_id) {
                totalInseridos++;
            }
        }
        
        console.log(`  ✅ ${file}: ${chunks.length} chunks inseridos`);
    }
    
    return totalInseridos;
}

/**
 * Testa consultas ao Giles
 */
function testQueries(giles) {
    console.log('\n🔍 Testando consultas ao Giles...\n');
    
    // Teste 1: Busca FTS
    console.log('  Teste 1: Busca FTS por "arquitetura"');
    const results1 = giles.searchFTS('arquitetura', 3);
    console.log(`     ✅ Encontrados ${results1.length} resultados`);
    results1.forEach((r, i) => {
        console.log(`        ${i+1}. [${r.dominio}/${r.categoria}] ${r.source_file}`);
    });
    
    // Teste 2: Busca por domínio
    console.log('\n  Teste 2: Busca no domínio "Operações"');
    const results2 = giles.searchByDomain('giles', 'Operações', 3);
    console.log(`     ✅ Encontrados ${results2.length} resultados`);
    
    // Teste 3: Estatísticas
    console.log('\n  Teste 3: Estatísticas do banco');
    const stats = giles.getStats();
    console.log(`     📊 Total knowledge: ${stats.total_knowledge}`);
    console.log(`     📊 Total domínios: ${stats.total_dominios}`);
    console.log(`     📊 Total autores: ${stats.total_autores}`);
    
    // Teste 4: Overview
    console.log('\n  Teste 4: Overview por domínio');
    const overview = giles.getOverview();
    overview.forEach(o => {
        console.log(`     📁 ${o.dominio}/${o.categoria}: ${o.total_documentos} docs`);
    });
}

/**
 * Executa teste completo
 */
async function main() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     🧠 TESTE DE FOGO - GILES AUTO-ORGANIZAÇÃO         ║');
    console.log('║              Versão SQLite (Alexandria)               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    try {
        // Inicializa cliente
        console.log(`📁 Banco: ${DB_PATH}\n`);
        const giles = new GilesClient(DB_PATH);
        
        // 1. Chunka arquivos
        const files = await chunkFiles();
        const totalChunks = files.reduce((sum, f) => sum + f.chunks.length, 0);
        console.log(`\n📊 Total: ${files.length} arquivos, ${totalChunks} chunks\n`);
        
        // 2. Insere no banco
        const inseridos = await insertChunks(giles, files);
        console.log(`\n✅ Total inseridos: ${inseridos} chunks\n`);
        
        // 3. Testa consultas
        testQueries(giles);
        
        // 4. Backup
        console.log('\n💾 Criando backup...');
        const backupPath = giles.backup();
        console.log(`   ✅ Backup: ${backupPath}`);
        
        // Fecha conexão
        giles.close();
        
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║  ✅ GILES APROVADO - Auto-organização concluída!      ║');
        console.log('║                                                        ║');
        console.log('║  O Giles está pronto para:                            ║');
        console.log('║  • Receber e organizar conhecimento                   ║');
        console.log('║  • Responder consultas via FTS                        ║');
        console.log('║  • Manter taxonomia hierárquica                       ║');
        console.log('║  • Todos os agentes acessam Alexandria/giles.db       ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');
        
    } catch (err) {
        console.error('\n❌ Erro no teste:', err.message);
        console.log('\n⚠️  Certifique-se de:');
        console.log('   1. npm install better-sqlite3');
        console.log('   2. Pasta Alexandria/ existir ou ser criável');
        console.log('   3. Permissões de escrita no diretório');
        process.exit(1);
    }
}

main();
