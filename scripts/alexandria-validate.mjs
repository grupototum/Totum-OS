#!/usr/bin/env node
/**
 * Alexandria — Bloco 4 do prompt OPUS (2026-04-25)
 *
 * Roda as 6 queries de validação e reporta no console.
 * Útil para confirmar estado pós-migration + pós-ingestão.
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... GEMINI_API_KEY=... \
 *     node scripts/alexandria-validate.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!SUPABASE_KEY) {
  console.error('[ERRO] SUPABASE_SERVICE_ROLE_KEY não definida.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

function header(t) { console.log(`\n${'─'.repeat(60)}\n${t}\n${'─'.repeat(60)}`); }

async function main() {
  // 1. Total de chunks
  header('1. Total de chunks em giles_knowledge');
  const { count: totalChunks } = await supabase
    .from('giles_knowledge').select('*', { count: 'exact', head: true });
  console.log(`total = ${totalChunks}`);

  // 2. Por domínio
  header('2. Chunks por domínio');
  const { data: byDomain } = await supabase
    .from('giles_knowledge').select('dominio');
  const counts = {};
  for (const row of byDomain || []) counts[row.dominio] = (counts[row.dominio] || 0) + 1;
  Object.entries(counts).sort((a, b) => b[1] - a[1])
    .forEach(([d, c]) => console.log(`  ${d.padEnd(24)} ${c}`));

  // 3. Documentos únicos (via entidades.doc_id)
  header('3. Documentos únicos');
  const { data: docRows } = await supabase
    .from('giles_knowledge').select('entidades');
  const docs = new Set();
  for (const r of docRows || []) {
    const id = r?.entidades?.doc_id;
    if (id) docs.add(id);
  }
  console.log(`documentos_unicos = ${docs.size}`);

  // 4. Chunks com embedding
  header('4. Chunks com embedding válido');
  const { count: comEmb } = await supabase
    .from('giles_knowledge').select('*', { count: 'exact', head: true }).not('embedding', 'is', null);
  console.log(`com_embedding = ${comEmb} / ${totalChunks}`);

  // 5. Decisões
  header('5. Decisões cadastradas');
  const { data: decisoes, error: dErr } = await supabase
    .from('decisoes').select('data,responsavel,tags,decisao').order('data');
  if (dErr) {
    console.log(`erro ao consultar decisoes: ${dErr.message}`);
  } else {
    console.log(`total = ${decisoes.length}`);
    for (const d of decisoes) {
      const resumo = d.decisao.length > 80 ? d.decisao.slice(0, 80) + '…' : d.decisao;
      console.log(`  ${d.data} [${d.responsavel}] ${(d.tags || []).join(',')} — ${resumo}`);
    }
  }

  // 6. Teste de busca semântica
  header('6. Teste de busca semântica: "quem é o Jarvis"');
  if (!GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY ausente — pulando teste semântico.');
  } else {
    const queryText = 'quem é o Jarvis';
    const embRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text: queryText }] },
        }),
      }
    );
    const embData = await embRes.json();
    const queryEmb = embData?.embedding?.values;
    if (!queryEmb || queryEmb.length !== 768) {
      console.log('falhou ao obter embedding 768D da query');
    } else {
      // Tenta usar a função match_documents se existir; caso contrário cai para
      // uma query direta com o operador <-> (cosine distance).
      const { data: matches, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmb,
        match_threshold: 0.5,
        match_count: 3,
      });
      if (error) {
        console.log(`rpc match_documents indisponível (${error.message}) — caindo para fallback.`);
        const { data: fallback } = await supabase
          .from('giles_knowledge')
          .select('chunk_id,subcategoria,content,source_file')
          .ilike('content', '%jarvis%')
          .limit(3);
        (fallback || []).forEach(m =>
          console.log(`  ${m.source_file} :: ${m.subcategoria}\n    ${m.content.slice(0, 120)}…`)
        );
      } else {
        (matches || []).forEach(m =>
          console.log(`  ${m.source_file || ''} :: ${m.subcategoria || ''}\n    similarity=${m.similarity?.toFixed(3)} — ${(m.content || '').slice(0, 120)}…`)
        );
      }
    }
  }

  console.log('\nValidação completa.');
}

main().catch(e => { console.error(e); process.exit(1); });
