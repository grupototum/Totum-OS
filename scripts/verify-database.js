#!/usr/bin/env node
/**
 * Script de verificação do banco de dados elizaOS
 * Verifica se todas as tabelas necessárias existem
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const requiredTables = [
  'agents_config',
  'agent_channels',
  'agent_skills_config',
  'agent_knowledge_access',
  'agent_executions',
  'rag_documents',
  'skills',
];

async function verifyDatabase() {
  console.log('🔍 Verificando banco de dados elizaOS...\n');

  const results = {
    ok: [],
    missing: [],
    errors: [],
  };

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        if (error.message.includes('does not exist')) {
          results.missing.push(table);
          console.log(`❌ Tabela "${table}" NÃO EXISTE`);
        } else {
          results.errors.push({ table, error: error.message });
          console.log(`⚠️  Tabela "${table}" - Erro: ${error.message}`);
        }
      } else {
        results.ok.push(table);
        console.log(`✅ Tabela "${table}" OK`);
      }
    } catch (err) {
      results.errors.push({ table, error: err.message });
      console.log(`⚠️  Tabela "${table}" - Erro: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO:');
  console.log(`✅ Tabelas OK: ${results.ok.length}/${requiredTables.length}`);
  console.log(`❌ Tabelas faltando: ${results.missing.length}/${requiredTables.length}`);
  console.log(`⚠️  Erros: ${results.errors.length}`);

  if (results.missing.length > 0) {
    console.log('\n📝 Tabelas que precisam ser criadas:');
    results.missing.forEach(t => console.log(`   - ${t}`));
    console.log('\nExecute: psql -f migrations/004_agents_elizaos.sql');
  }

  if (results.ok.length === requiredTables.length) {
    console.log('\n🎉 Todas as tabelas estão configuradas corretamente!');
  }

  process.exit(results.missing.length > 0 || results.errors.length > 0 ? 1 : 0);
}

verifyDatabase();
