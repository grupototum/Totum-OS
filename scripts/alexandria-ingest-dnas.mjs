#!/usr/bin/env node
/**
 * Alexandria — Bloco 3 do prompt OPUS (2026-04-25)
 *
 * Indexa documentos críticos no `giles_knowledge` com embeddings reais
 * (Gemini text-embedding-004, 768 dimensões — compatível com vector(768)
 * já existente; NÃO migrar para 3072D, quebra os 60 registros atuais).
 *
 * Como rodar (no VPS Alibaba ou local com .env carregado):
 *   SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   GEMINI_API_KEY=AIzaSy... \
 *   node scripts/alexandria-ingest-dnas.mjs
 *
 * Comportamento:
 *   - Lê os .md listados em DOC_MANIFEST abaixo (todos do repo).
 *   - Faz chunking de até ~1500 tokens com overlap de ~200 tokens.
 *   - Para cada chunk:
 *       1. calcula sha256 do (doc_id + heading + content)
 *       2. checa se já existe em giles_knowledge (campo `chunk_id`) → pula
 *       3. gera embedding 768D via Gemini
 *       4. insere em giles_knowledge
 *   - Idempotente: rodar 2x não duplica.
 *   - Fallback: se Gemini falhar 3x seguidas para um chunk, registra erro
 *     e continua (não aborta o batch).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// ─── .env.local loader (sem deps) ─────────────────────────────
// Carrega ./.env.local relativo ao repo se existir, sem sobrescrever
// vars já definidas no shell. Suporta `KEY=value`, `export KEY=value`,
// aspas simples/duplas e comentários `#`.

function loadEnvLocal() {
  const envPath = resolve(REPO_ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  const overridden = [];
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(?:export\s+)?([A-Z_][A-Z0-9_]*)=(.*)$/i);
    if (!m) continue;
    const [, key, rawVal] = m;
    let val = rawVal.trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // .env.local vence o shell (padrão Next/Vite). Avisa em caso de override.
    if (process.env[key] && process.env[key] !== val) overridden.push(key);
    process.env[key] = val;
  }
  console.log(`[env] carregado: ${envPath}`);
  if (overridden.length) {
    console.log(`[env] sobrescrito do shell: ${overridden.join(', ')}`);
  }
}
loadEnvLocal();

// ─── Config ────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

// Validação amigável: distinguir "ausente" de "placeholder colado por engano".
function isPlaceholder(v) {
  return !v
    || v.length < 30
    || /COLE[_ ]?A[_ ]?KEY|YOUR[_ ]?KEY|placeholder|xxxxx/i.test(v);
}

if (isPlaceholder(SUPABASE_KEY)) {
  console.error(`[ERRO] SUPABASE_SERVICE_ROLE_KEY ausente ou é placeholder (length=${SUPABASE_KEY?.length || 0}).`);
  console.error('       Esperado: JWT iniciando com "eyJ..." (~218 chars).');
  console.error('       Pegue em: Dashboard → Project Settings → API → service_role → Reveal');
  process.exit(1);
}
if (isPlaceholder(GEMINI_API_KEY)) {
  console.error(`[ERRO] GEMINI_API_KEY ausente ou é placeholder (length=${GEMINI_API_KEY?.length || 0}).`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ─── Manifest de documentos ────────────────────────────────────
//
// Cada entrada: { path, doc_id, dominio }
// Os 4 primeiros nomes citados no prompt OPUS (PERSONALIDADE_*_REAL.md,
// AGENTES_TOTUM_CATALOGO_COMPLETO.md, Novas_inovacoes.md,
// Catalogo_de_Ferramentas_HostGear_apps.md) NÃO existem neste repo —
// vivem no Alibaba VPS. KimiClaw os indexará de lá.
//
// Aqui usamos os DNAs/POPs/inventários que ESTÃO no repo, que cobrem
// o mesmo papel: contexto operacional dos agentes.

const DOC_MANIFEST = [
  // Inventário e mapeamento dos 39 agentes (substitui AGENTES_TOTUM_CATALOGO)
  { path: 'INVENTARIO_39_AGENTES.md',     doc_id: 'CATALOG-AGENTS-001', dominio: 'agentes' },
  { path: 'AGENT_DIVISION_MAPPING.json',  doc_id: 'CATALOG-AGENTS-002', dominio: 'agentes' },
  { path: 'DIVISAO_SKILLS_MATRIX.md',     doc_id: 'CATALOG-AGENTS-003', dominio: 'agentes' },

  // DNAs dos 39 agentes (cobrem o que PERSONALIDADE_*_REAL.md cobriria)
  // Indexados em lote — doc_id é gerado a partir do filename.
  // Adicione aqui novos DNAs conforme aparecerem.
];

// Adiciona automaticamente todos os DNAs do diretório DNAS_39_AGENTES
const DNA_DIRS = ['DNAS_39_AGENTES', 'DNAS_AGENCY_AGENTS'];
for (const dir of DNA_DIRS) {
  const fullDir = resolve(REPO_ROOT, dir);
  if (!existsSync(fullDir)) continue;
  const { readdirSync } = await import('node:fs');
  const files = readdirSync(fullDir).filter(f => f.endsWith('.md') && f !== 'INDEX.md');
  for (const f of files) {
    const slug = f.replace('.md', '').toLowerCase();
    DOC_MANIFEST.push({
      path: `${dir}/${f}`,
      doc_id: `DNA-${slug.toUpperCase()}-001`,
      dominio: 'agentes',
    });
  }
}

// ─── Chunking ─────────────────────────────────────────────────
// Aproximação: 1 token ~= 4 chars. 1500 tokens ~= 6000 chars.
// Overlap 200 tokens ~= 800 chars.

const CHUNK_CHARS = 6000;
const OVERLAP_CHARS = 800;

function chunkContent(content, doc_id) {
  const chunks = [];
  // Quebra primeiro por headings ## / ### para preservar hierarquia
  const sections = content.split(/\n(?=#{1,3}\s)/);
  let currentPath = doc_id;

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    const heading = headingMatch ? headingMatch[2].trim() : '';
    if (heading) currentPath = `${doc_id} > ${heading}`;

    const body = headingMatch
      ? trimmed.slice(trimmed.indexOf('\n') + 1).trim()
      : trimmed;
    if (!body) continue;

    if (body.length <= CHUNK_CHARS) {
      chunks.push({ heading, hierarchical_path: currentPath, content: body });
      continue;
    }

    // Sub-split com overlap
    let start = 0;
    let part = 0;
    while (start < body.length) {
      const end = Math.min(start + CHUNK_CHARS, body.length);
      const piece = body.slice(start, end);
      part += 1;
      chunks.push({
        heading: heading ? `${heading} (parte ${part})` : `parte ${part}`,
        hierarchical_path: `${currentPath} (parte ${part})`,
        content: piece,
      });
      if (end >= body.length) break;
      start = end - OVERLAP_CHARS;
    }
  }

  if (chunks.length === 0 && content.trim()) {
    chunks.push({ heading: doc_id, hierarchical_path: doc_id, content: content.trim() });
  }
  return chunks;
}

// ─── Hash p/ deduplicação ─────────────────────────────────────

function chunkHash(doc_id, heading, content) {
  return createHash('sha256').update(`${doc_id}::${heading}::${content}`).digest('hex');
}

// ─── Gemini embedding ─────────────────────────────────────────
// Lista de candidatos em ordem de preferência. Cada entrada é
// { model, outputDimensionality? }. O outputDimensionality força
// o modelo Matryoshka (gemini-embedding-001) a devolver 768D
// em vez do default 3072D — necessário para casar com o schema
// vector(768) atual em produção.

const EMBED_MODEL_CANDIDATES = [
  { model: 'text-embedding-004' },                              // legado, 768D nativo (pode estar offline)
  { model: 'gemini-embedding-001', outputDimensionality: 768 }, // Matryoshka, força 768
  { model: 'embedding-001' },                                   // antigo, 768D nativo
];

let RESOLVED_EMBED_SPEC = null;

function specLabel(spec) {
  return spec.outputDimensionality
    ? `${spec.model}@${spec.outputDimensionality}D`
    : spec.model;
}

async function tryEmbed(spec, text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${spec.model}:embedContent?key=${GEMINI_API_KEY}`;
  const body = {
    model: `models/${spec.model}`,
    content: { parts: [{ text: text.slice(0, 8000) }] },
  };
  if (spec.outputDimensionality) body.outputDimensionality = spec.outputDimensionality;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error('resposta sem embedding.values');
  return values;
}

async function resolveEmbedModel() {
  if (RESOLVED_EMBED_SPEC) return RESOLVED_EMBED_SPEC;
  console.log('\n[embed] resolvendo modelo Gemini disponível...');
  for (const spec of EMBED_MODEL_CANDIDATES) {
    const label = specLabel(spec);
    try {
      const v = await tryEmbed(spec, 'teste de resolução');
      if (v.length !== 768) {
        console.log(`  [embed] ${label} responde ${v.length}D — incompatível com vector(768), pulando`);
        continue;
      }
      RESOLVED_EMBED_SPEC = spec;
      console.log(`  [embed] ✓ usando "${label}" (768D)`);
      return spec;
    } catch (e) {
      console.log(`  [embed] ✗ ${label}: ${e.message}`);
    }
  }
  throw new Error('Nenhum modelo Gemini de embedding 768D disponível. Verifique a chave em https://aistudio.google.com/apikey');
}

async function generateEmbedding(text, retries = 3) {
  const spec = await resolveEmbedModel();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const values = await tryEmbed(spec, text);
      if (values.length === 768) return values;
      throw new Error(`Embedding length=${values.length} (esperado 768)`);
    } catch (err) {
      if (attempt === retries) {
        console.error(`  [embed] falhou após ${retries} tentativas: ${err.message}`);
        return null;
      }
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
  return null;
}

// ─── Schema discovery ─────────────────────────────────────────
// Descobre as colunas reais de giles_knowledge fazendo um SELECT *
// LIMIT 1. Schema definido em código (alexandriaIngestion.ts) pode
// divergir do schema em produção — sempre confiar no que existe lá.

let KNOWN_COLUMNS = null;

async function discoverColumns() {
  if (KNOWN_COLUMNS) return KNOWN_COLUMNS;
  const { data, error } = await supabase
    .from('giles_knowledge')
    .select('*')
    .limit(1);
  if (error) throw new Error(`schema discovery falhou: ${error.message}`);
  if (!data || data.length === 0) {
    // Tabela vazia — tenta com SELECT que força retorno de header.
    // Como fallback assumimos colunas mínimas universais.
    console.log('  [schema] tabela vazia, assumindo colunas mínimas');
    KNOWN_COLUMNS = new Set(['chunk_id', 'content', 'embedding', 'dominio']);
  } else {
    KNOWN_COLUMNS = new Set(Object.keys(data[0]));
  }
  console.log(`  [schema] colunas reais: ${[...KNOWN_COLUMNS].join(', ')}`);
  return KNOWN_COLUMNS;
}

function filterPayload(payload, columns) {
  const filtered = {};
  const dropped = [];
  for (const [k, v] of Object.entries(payload)) {
    if (columns.has(k)) filtered[k] = v;
    else dropped.push(k);
  }
  return { filtered, dropped };
}

// ─── Ingestão de um documento ─────────────────────────────────

async function ingestDocument({ path, doc_id, dominio }) {
  const fullPath = resolve(REPO_ROOT, path);
  if (!existsSync(fullPath)) {
    console.log(`  [skip] arquivo ausente: ${path}`);
    return { inserted: 0, skipped: 0, failed: 0, missing: true };
  }

  const content = readFileSync(fullPath, 'utf8');
  const chunks = chunkContent(content, doc_id);
  console.log(`\n→ ${path} (${doc_id}) — ${chunks.length} chunks`);

  let inserted = 0, skipped = 0, failed = 0;

  for (const chunk of chunks) {
    const hash = chunkHash(doc_id, chunk.heading, chunk.content);
    const chunk_id = `${doc_id}::${hash.slice(0, 16)}`;

    // Dedup: se já existe, pula
    const { data: existing } = await supabase
      .from('giles_knowledge')
      .select('id')
      .eq('chunk_id', chunk_id)
      .maybeSingle();
    if (existing) { skipped++; continue; }

    const textToEmbed = `${chunk.heading}\n\n${chunk.content}`;
    const embedding = await generateEmbedding(textToEmbed);
    if (!embedding) { failed++; continue; }

    const fullPayload = {
      chunk_id,
      content: chunk.content,
      dominio,
      categoria: 'documentação',
      subcategoria: chunk.heading || null,
      tags: [dominio, doc_id.split('-')[0].toLowerCase()],
      keywords: [],
      source_file: path,
      autor: 'opus-bloco-3',
      entidades: { doc_id, hierarchical_path: chunk.hierarchical_path },
      relacionamentos: {},
      confianca: 1.0,
      embedding: JSON.stringify(embedding),
    };

    const columns = await discoverColumns();
    const { filtered: payload } = filterPayload(fullPayload, columns);

    const { error } = await supabase.from('giles_knowledge').insert(payload);
    if (error) {
      console.error(`  [insert] erro: ${error.message}`);
      failed++;
    } else {
      inserted++;
    }
    // pequena pausa para não estourar rate limit
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`  → inseridos=${inserted} pulados=${skipped} falhas=${failed}`);
  return { inserted, skipped, failed, missing: false };
}

// ─── Main ─────────────────────────────────────────────────────

(async () => {
  console.log('='.repeat(60));
  console.log('Alexandria Ingestion — Bloco 3 (DNAs + catálogos)');
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Documentos no manifest: ${DOC_MANIFEST.length}`);
  console.log('='.repeat(60));

  // Descobre o schema ANTES de gastar embeddings
  console.log('\n[setup] descobrindo schema da giles_knowledge...');
  const columns = await discoverColumns();

  // Avisa quais campos nosso payload teria que vão ser descartados
  const samplePayload = {
    chunk_id: 'x', content: 'x', dominio: 'x', categoria: 'x',
    subcategoria: 'x', tags: [], keywords: [], source_file: 'x',
    autor: 'x', entidades: {}, relacionamentos: {}, confianca: 1.0,
    embedding: '[]',
  };
  const { dropped } = filterPayload(samplePayload, columns);
  if (dropped.length) {
    console.log(`[setup] campos do payload sem coluna correspondente (serão omitidos): ${dropped.join(', ')}`);
  }

  // Aborta se faltar coluna essencial
  for (const required of ['chunk_id', 'content', 'embedding']) {
    if (!columns.has(required)) {
      console.error(`[FATAL] coluna obrigatória '${required}' não existe em giles_knowledge.`);
      process.exit(1);
    }
  }

  const summary = { inserted: 0, skipped: 0, failed: 0, missing: 0, docs: 0 };

  for (const doc of DOC_MANIFEST) {
    const r = await ingestDocument(doc);
    if (r.missing) { summary.missing++; continue; }
    summary.docs++;
    summary.inserted += r.inserted;
    summary.skipped += r.skipped;
    summary.failed += r.failed;
  }

  console.log('\n' + '='.repeat(60));
  console.log('RESUMO');
  console.log('='.repeat(60));
  console.log(`Documentos processados : ${summary.docs}`);
  console.log(`Documentos ausentes    : ${summary.missing}`);
  console.log(`Chunks inseridos       : ${summary.inserted}`);
  console.log(`Chunks pulados (dedup) : ${summary.skipped}`);
  console.log(`Chunks com falha       : ${summary.failed}`);

  // Contagem final
  const { count } = await supabase
    .from('giles_knowledge')
    .select('*', { count: 'exact', head: true });
  console.log(`\nTotal em giles_knowledge agora: ${count}`);
})().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
