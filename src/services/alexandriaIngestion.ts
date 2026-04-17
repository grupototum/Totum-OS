/**
 * Alexandria Ingestion Service
 * Hermione's ability to read, parse and catalog documents into giles_knowledge
 */

import { supabase } from '@/integrations/supabase/client';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IngestProgress {
  current: number;
  total: number;
  fileName: string;
  status: 'processing' | 'done' | 'error';
  chunksCreated?: number;
  error?: string;
}

export interface IngestResult {
  succeeded: number;
  failed: number;
  totalChunks: number;
  documents: Array<{ name: string; chunks: number }>;
  errors: string[];
}

export interface GithubFile {
  name: string;
  content: string;
  path: string;
}

// ─── Markdown Chunker ─────────────────────────────────────────────────────────

/**
 * Split markdown into chunks by ## headers.
 * If no headers, split by paragraphs (~500 chars each).
 */
export function chunkMarkdown(
  content: string,
  filename: string
): Array<{ heading: string; content: string }> {
  const chunks: Array<{ heading: string; content: string }> = [];

  // Split on level-2+ headings
  const sections = content.split(/\n(?=#{1,3}\s)/);

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Extract heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    const heading = headingMatch ? headingMatch[2].trim() : filename.replace('.md', '');
    const body = headingMatch
      ? trimmed.slice(trimmed.indexOf('\n') + 1).trim()
      : trimmed;

    if (!body) continue;

    // If body > 800 chars, sub-split at paragraph breaks
    if (body.length > 800) {
      const paragraphs = body.split(/\n{2,}/);
      let accumulator = '';
      let partIndex = 0;

      for (const para of paragraphs) {
        if ((accumulator + '\n\n' + para).length > 600 && accumulator) {
          chunks.push({ heading: `${heading} (parte ${++partIndex})`, content: accumulator.trim() });
          accumulator = para;
        } else {
          accumulator = accumulator ? accumulator + '\n\n' + para : para;
        }
      }
      if (accumulator.trim()) {
        chunks.push({
          heading: partIndex > 0 ? `${heading} (parte ${partIndex + 1})` : heading,
          content: accumulator.trim(),
        });
      }
    } else {
      chunks.push({ heading, content: body });
    }
  }

  // Fallback: if no chunks produced, treat whole file as one chunk
  if (chunks.length === 0 && content.trim()) {
    chunks.push({ heading: filename.replace('.md', ''), content: content.trim() });
  }

  return chunks;
}

// ─── Gemini Classifier ────────────────────────────────────────────────────────

/**
 * Use Gemini Flash to auto-classify a chunk.
 * Returns dominio, categoria, tags, keywords.
 */
async function classifyChunk(
  chunkContent: string,
  filename: string
): Promise<{ dominio: string; categoria: string; tags: string[]; keywords: string[] }> {
  const fallback = {
    dominio: inferDomainFromFilename(filename),
    categoria: 'geral',
    tags: getTopKeywords(chunkContent).slice(0, 5),
    keywords: getTopKeywords(chunkContent).slice(0, 8),
  };

  if (!GEMINI_API_KEY) return fallback;

  try {
    const prompt = `Analise este trecho de documentação técnica e retorne APENAS um JSON válido (sem markdown, sem explicação) no formato:
{"dominio":"string","categoria":"string","tags":["tag1","tag2","tag3"],"keywords":["kw1","kw2","kw3","kw4","kw5"]}

Domínios possíveis: tecnologia, processos, vendas, marketing, operações, produto, infraestrutura, agentes, conhecimento-geral
Categorias: documentação, passo-a-passo, conceito, configuração, skill, api, arquitetura, sla-pop, treinamento

Arquivo: ${filename}
Conteúdo: ${chunkContent.substring(0, 600)}`;

    const response = await fetch(
      `${GEMINI_API_URL}/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
        }),
      }
    );

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Strip ```json``` if present
    const jsonStr = raw.replace(/```json?\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      dominio: parsed.dominio || fallback.dominio,
      categoria: parsed.categoria || fallback.categoria,
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : fallback.tags,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 8) : fallback.keywords,
    };
  } catch {
    return fallback;
  }
}

/** Fallback: infer domain from filename patterns */
function inferDomainFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('skill') || lower.includes('agent')) return 'agentes';
  if (lower.includes('deploy') || lower.includes('infra') || lower.includes('server')) return 'infraestrutura';
  if (lower.includes('api') || lower.includes('config')) return 'tecnologia';
  if (lower.includes('pop') || lower.includes('sla') || lower.includes('process')) return 'processos';
  if (lower.includes('vend') || lower.includes('sales') || lower.includes('crm')) return 'vendas';
  if (lower.includes('readme') || lower.includes('docs')) return 'tecnologia';
  return 'conhecimento-geral';
}

/**
 * Generate a 768-dim embedding vector using Gemini text-embedding-004.
 * Returns null if API key is missing or request fails.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text: text.substring(0, 2000) }] },
        }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.embedding?.values ?? null;
  } catch {
    return null;
  }
}

function getTopKeywords(text: string): string[] {
  const stopWords = new Set(['de','a','o','que','e','do','da','em','um','para','com','uma','os','no','se','na','por','mais','as','dos','como','mas','foi','ao','ele','das','tem','seu','sua','ou','ser','quando','muito','nos','já','está','eu','também','pelo','pela','até','isso','ela','entre','era','depois','sem','mesmo','aos','ter','seus','me','esse','eles','estão','você']);
  const freq: Record<string, number> = {};
  text.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúüç\s]/g, ' ').split(/\s+/).forEach(w => {
    if (w.length > 3 && !stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([w]) => w);
}

// ─── Core Ingestion ───────────────────────────────────────────────────────────

/**
 * Ingest a single markdown file into giles_knowledge.
 * Returns number of chunks created.
 */
export async function ingestMarkdownFile(
  filename: string,
  content: string,
  sourceUrl?: string
): Promise<{ chunksCreated: number; error?: string }> {
  try {
    const chunks = chunkMarkdown(content, filename);
    if (chunks.length === 0) return { chunksCreated: 0, error: 'Nenhum conteúdo encontrado' };

    let created = 0;

    for (const chunk of chunks) {
      const classification = await classifyChunk(chunk.content, filename);

      // Generate text to embed: heading + content for better semantic retrieval
      const textToEmbed = `${chunk.heading}\n\n${chunk.content}`;
      const embedding = await generateEmbedding(textToEmbed);

      // Build insert payload
      const chunkId = `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payload: Record<string, any> = {
        chunk_id: chunkId,
        content: chunk.content,
        dominio: classification.dominio,
        categoria: classification.categoria,
        subcategoria: chunk.heading,
        tags: classification.tags,
        keywords: getTopKeywords(chunk.content).slice(0, 8),
        source_file: sourceUrl || filename,
        autor: 'hermione-ingestion',
        entidades: {},
        relacionamentos: {},
        confianca: 1.0,
      };

      if (embedding) {
        payload.embedding = JSON.stringify(embedding); // Supabase expects vector as JSON array string
      }

      const { error } = await supabase.from('giles_knowledge').insert(payload);
      if (!error) created++;

      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    }

    return { chunksCreated: created };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { chunksCreated: 0, error: message };
  }
}

/**
 * Batch ingest multiple files with progress callback.
 */
export async function ingestBatch(
  files: Array<{ name: string; content: string; source?: string }>,
  onProgress: (progress: IngestProgress) => void
): Promise<IngestResult> {
  const result: IngestResult = {
    succeeded: 0,
    failed: 0,
    totalChunks: 0,
    documents: [],
    errors: [],
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    onProgress({ current: i + 1, total: files.length, fileName: file.name, status: 'processing' });

    const { chunksCreated, error } = await ingestMarkdownFile(file.name, file.content, file.source);

    if (error && chunksCreated === 0) {
      result.failed++;
      result.errors.push(`${file.name}: ${error}`);
      onProgress({ current: i + 1, total: files.length, fileName: file.name, status: 'error', error });
    } else {
      result.succeeded++;
      result.totalChunks += chunksCreated;
      result.documents.push({ name: file.name, chunks: chunksCreated });
      onProgress({ current: i + 1, total: files.length, fileName: file.name, status: 'done', chunksCreated });
    }
  }

  return result;
}

// ─── GitHub Fetcher ───────────────────────────────────────────────────────────

/**
 * Parse a GitHub URL and return owner/repo/branch.
 * Supports: https://github.com/owner/repo, https://github.com/owner/repo/tree/branch
 */
function parseGithubUrl(url: string): { owner: string; repo: string; branch: string } | null {
  try {
    const cleaned = url.trim().replace(/\/$/, '');
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/);
    if (!match) return null;
    return { owner: match[1], repo: match[2], branch: match[3] || 'main' };
  } catch {
    return null;
  }
}

/**
 * Fetch all .md files from a GitHub repository.
 * Uses GitHub public API (no auth needed for public repos).
 */
export async function fetchGithubMarkdownFiles(repoUrl: string): Promise<GithubFile[]> {
  const parsed = parseGithubUrl(repoUrl);
  if (!parsed) throw new Error('URL do GitHub inválida. Use: https://github.com/owner/repo');

  const { owner, repo, branch } = parsed;

  // Try main, then master if main fails
  const branches = branch !== 'master' ? [branch, 'master'] : ['master', 'main'];
  let treeData: any = null;

  for (const b of branches) {
    try {
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${b}?recursive=1`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (treeRes.ok) {
        treeData = await treeRes.json();
        break;
      }
    } catch {
      continue;
    }
  }

  if (!treeData?.tree) {
    throw new Error(`Não foi possível acessar o repositório ${owner}/${repo}. Verifique se é público.`);
  }

  // Filter .md files (limit to 30 to avoid overwhelming)
  const mdFiles = treeData.tree
    .filter((f: any) => f.type === 'blob' && f.path.endsWith('.md'))
    .slice(0, 30);

  if (mdFiles.length === 0) throw new Error('Nenhum arquivo .md encontrado no repositório.');

  // Fetch content for each file
  const activeBranch = treeData.sha ? branches[0] : 'main';
  const files: GithubFile[] = [];

  for (const file of mdFiles) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${activeBranch}/${file.path}`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        const content = await res.text();
        files.push({
          name: file.path.split('/').pop() || file.path,
          content,
          path: `${owner}/${repo}/${file.path}`,
        });
      }
      // Small delay
      await new Promise(r => setTimeout(r, 100));
    } catch {
      // Skip files that fail
    }
  }

  return files;
}

/**
 * Ingest a GitHub repository — fetch all .md files and catalog them.
 */
export async function ingestGithubRepo(
  repoUrl: string,
  onProgress: (progress: IngestProgress) => void
): Promise<IngestResult> {
  const files = await fetchGithubMarkdownFiles(repoUrl);

  return ingestBatch(
    files.map(f => ({ name: f.name, content: f.content, source: `${repoUrl}/blob/main/${f.path}` })),
    onProgress
  );
}
