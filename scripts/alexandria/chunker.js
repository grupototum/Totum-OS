#!/usr/bin/env node
/**
 * Alexandria Chunker - Chunking Semântico Hierárquico
 * 
 * Estratégia:
 * 1. Preservar hierarquia de headings (H1 > H2 > H3)
 * 2. Overlap de 20% entre chunks adjacentes
 * 3. Respeitar limites de tamanho (min 200, max 1500 chars)
 * 4. Extrair metadados (entities, tags, domínio)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuração
const CONFIG = {
  MAX_CHUNK_SIZE: 1500,
  MIN_CHUNK_SIZE: 200,
  OVERLAP_SIZE: 300,
  HEADING_PRIORITY: true
};

// Padrões para extração de entidades
const ENTITY_PATTERNS = {
  siglas: /\b[A-Z]{2,6}\b/g,
  codigos: /\b[A-Z]+-\d{3,}\b/g,
  datas: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
  emails: /\S+@\S+\.\S+/g,
  valores: /R\$\s*[\d.,]+/g
};

/**
 * Parser de Markdown estruturado
 * Extrai headings e conteúdo hierárquico
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = null;
  let contentBuffer = [];
  
  const headingStack = []; // Pilha para rastrear hierarquia

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Salva seção anterior
      if (currentSection && contentBuffer.length > 0) {
        currentSection.content = contentBuffer.join('\n').trim();
        sections.push(currentSection);
      }
      
      // Nova seção
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      // Atualiza pilha de hierarquia
      while (headingStack.length >= level) {
        headingStack.pop();
      }
      headingStack.push(title);
      
      currentSection = {
        level,
        title,
        path: [...headingStack],
        content: '',
        lineNumber: lines.indexOf(line) + 1
      };
      contentBuffer = [];
    } else {
      contentBuffer.push(line);
    }
  }
  
  // Última seção
  if (currentSection && contentBuffer.length > 0) {
    currentSection.content = contentBuffer.join('\n').trim();
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Divide uma seção em chunks respeitando limites
 */
function splitSectionIntoChunks(section, docId, startPosition = 0) {
  const chunks = [];
  const { content, path, level } = section;
  
  if (content.length <= CONFIG.MAX_CHUNK_SIZE) {
    // Seção cabe em um chunk só
    return [{
      content,
      path,
      level,
      position: startPosition,
      isComplete: true
    }];
  }
  
  // Divide em parágrafos
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  let currentChunk = [];
  let currentSize = 0;
  let position = startPosition;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const paraSize = para.length;
    
    if (currentSize + paraSize > CONFIG.MAX_CHUNK_SIZE && currentChunk.length > 0) {
      // Salva chunk atual
      const chunkContent = currentChunk.join('\n\n');
      
      // Adiciona overlap do próximo parágrafo
      const nextPara = paragraphs[i];
      const overlap = nextPara.slice(0, CONFIG.OVERLAP_SIZE);
      
      chunks.push({
        content: chunkContent,
        path,
        level,
        position,
        isComplete: false,
        overlap: overlap
      });
      
      // Inicia novo chunk com overlap do anterior
      const prevOverlap = currentChunk[currentChunk.length - 1].slice(-CONFIG.OVERLAP_SIZE);
      currentChunk = [prevOverlap, para];
      currentSize = prevOverlap.length + paraSize;
      position++;
    } else {
      currentChunk.push(para);
      currentSize += paraSize;
    }
  }
  
  // Último chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      path,
      level,
      position,
      isComplete: true
    });
  }
  
  return chunks;
}

/**
 * Extrai entidades do texto
 */
function extractEntities(text) {
  const entities = {
    siglas: [],
    codigos: [],
    datas: [],
    emails: [],
    valores: []
  };
  
  for (const [type, pattern] of Object.entries(ENTITY_PATTERNS)) {
    const matches = text.match(pattern) || [];
    entities[type] = [...new Set(matches)]; // deduplica
  }
  
  return entities;
}

/**
 * Inferir tags automáticas
 */
function inferTags(content, path) {
  const tags = new Set();
  const text = content.toLowerCase();
  
  // Tags por conteúdo
  if (text.includes('checklist')) tags.add('checklist');
  if (text.includes('procedimento') || text.includes('passo')) tags.add('procedimento');
  if (text.includes('erro') || text.includes('bug') || text.includes('falha')) tags.add('troubleshooting');
  if (text.includes('sla') || text.includes('prazo') || text.includes('deadline')) tags.add('sla');
  if (text.includes('código') || text.includes('script') || text.includes('função')) tags.add('codigo');
  if (text.includes('configur') || text.includes('setup')) tags.add('configuracao');
  
  // Tags por hierarquia
  const pathStr = path.join(' ').toLowerCase();
  if (pathStr.includes('atendimento')) tags.add('atendimento');
  if (pathStr.includes('vendas')) tags.add('vendas');
  if (pathStr.includes('tecnico') || pathStr.includes('tech')) tags.add('tecnico');
  
  return Array.from(tags);
}

/**
 * Gera hash único para o chunk
 */
function generateHash(docId, position, content) {
  return crypto
    .createHash('md5')
    .update(`${docId}:${position}:${content.slice(0, 100)}`)
    .digest('hex');
}

/**
 * Processa documento completo
 */
function processDocument(content, docId, options = {}) {
  const sections = parseMarkdown(content);
  const allChunks = [];
  let globalPosition = 0;
  
  for (const section of sections) {
    const sectionChunks = splitSectionIntoChunks(section, docId, globalPosition);
    
    for (const chunk of sectionChunks) {
      const entities = extractEntities(chunk.content);
      const tags = inferTags(chunk.content, chunk.path);
      
      allChunks.push({
        id: generateHash(docId, globalPosition, chunk.content),
        doc_id: docId,
        content: chunk.content,
        section_path: chunk.path.join(' > '),
        hierarchy: chunk.path,
        level: chunk.level,
        position: globalPosition,
        total_chunks: null, // preenchido depois
        is_complete: chunk.isComplete,
        entities,
        tags,
        metadata: {
          char_count: chunk.content.length,
          word_count: chunk.content.split(/\s+/).length,
          has_overlap: !!chunk.overlap,
          source_line: section.lineNumber
        },
        created_at: new Date().toISOString()
      });
      
      globalPosition++;
    }
  }
  
  // Preenche total_chunks
  for (const chunk of allChunks) {
    chunk.total_chunks = allChunks.length;
  }
  
  return {
    doc_id: docId,
    total_chunks: allChunks.length,
    chunks: allChunks,
    stats: {
      sections: sections.length,
      avg_chunk_size: allChunks.reduce((sum, c) => sum + c.content.length, 0) / allChunks.length,
      min_chunk_size: Math.min(...allChunks.map(c => c.content.length)),
      max_chunk_size: Math.max(...allChunks.map(c => c.content.length))
    }
  };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1];
  const docIdArg = args.find(a => a.startsWith('--doc-id='))?.split('=')[1];
  const outputArg = args.find(a => a.startsWith('--output='))?.split('=')[1];
  
  if (!fileArg) {
    console.log(`
Uso: node chunker.js --file=doc.md [--doc-id=POP-001] [--output=chunks.json]

Opções:
  --file      Arquivo Markdown para processar
  --doc-id    ID do documento (default: nome do arquivo)
  --output    Arquivo de saída (default: stdout)
    `);
    process.exit(1);
  }
  
  const content = fs.readFileSync(fileArg, 'utf-8');
  const docId = docIdArg || path.basename(fileArg, '.md');
  
  console.error(`🔄 Processando ${fileArg}...`);
  const result = processDocument(content, docId);
  
  console.error(`✅ ${result.total_chunks} chunks gerados`);
  console.error(`📊 Stats: ${JSON.stringify(result.stats, null, 2)}`);
  
  const output = JSON.stringify(result, null, 2);
  
  if (outputArg) {
    fs.writeFileSync(outputArg, output);
    console.error(`💾 Salvo em ${outputArg}`);
  } else {
    console.log(output);
  }
}

module.exports = { processDocument, parseMarkdown, splitSectionIntoChunks };
