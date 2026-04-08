#!/usr/bin/env node
/**
 * validate-db.js - Script de validação do banco Supabase
 * Apps Totum - Skills System
 * 
 * Uso: node validate-db.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}`),
  divider: () => console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`)
};

// ============================================
// 1. CARREGAR VARIÁVEIS DE AMBIENTE
// ============================================
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log.error('Arquivo .env.local não encontrado!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });

  return env;
}

// ============================================
// 2. CONECTAR AO SUPABASE
// ============================================
async function connectSupabase(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    log.error('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontrados no .env.local');
    process.exit(1);
  }

  log.info(`Conectando ao Supabase: ${url}...`);
  
  const supabase = createClient(url, key);
  
  // Testar conexão
  const { data, error } = await supabase.from('agents_config').select('count').limit(1);
  
  if (error && error.code !== 'PGRST116') {
    log.error(`Falha na conexão: ${error.message}`);
    process.exit(1);
  }

  log.success('Conexão com Supabase estabelecida!');
  return supabase;
}

// ============================================
// 3. VERIFICAR TABELAS
// ============================================
async function checkTables(supabase) {
  log.header('📊 VERIFICAÇÃO DE TABELAS');
  
  const tables = ['agents_config', 'agent_executions', 'skills'];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          log.error(`Tabela "${table}" NÃO EXISTE`);
          results[table] = false;
        } else {
          log.error(`Erro ao verificar "${table}": ${error.message}`);
          results[table] = false;
        }
      } else {
        log.success(`Tabela "${table}" existe e está acessível`);
        results[table] = true;
      }
    } catch (err) {
      log.error(`Exceção ao verificar "${table}": ${err.message}`);
      results[table] = false;
    }
  }

  return results;
}

// ============================================
// 4. VALIDAR AGENTES INICIAIS
// ============================================
async function validateAgents(supabase) {
  log.header('🤖 VALIDAÇÃO DOS AGENTES');
  
  const expectedAgents = [
    { id: 'WANDA', name: 'WANDA - Social Planner', emoji: '🔴' },
    { id: 'RADAR', name: 'RADAR - Trend Hunter', emoji: '🧭' },
    { id: 'LOKI', name: 'LOKI - Traffic Master', emoji: '🎯' }
  ];

  const results = {};

  for (const agent of expectedAgents) {
    try {
      const { data, error } = await supabase
        .from('agents_config')
        .select('agent_id, name, emoji, tier, status, skills')
        .eq('agent_id', agent.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          log.error(`Agente "${agent.id}" NÃO ENCONTRADO`);
          results[agent.id] = { exists: false, error: 'Not found' };
        } else {
          log.error(`Erro ao buscar "${agent.id}": ${error.message}`);
          results[agent.id] = { exists: false, error: error.message };
        }
      } else {
        const skillsCount = data.skills ? data.skills.length : 0;
        log.success(`Agente "${agent.id}" encontrado: ${data.name} ${data.emoji} | Skills: ${skillsCount} | Status: ${data.status}`);
        results[agent.id] = { 
          exists: true, 
          name: data.name,
          emoji: data.emoji,
          tier: data.tier,
          status: data.status,
          skillsCount
        };
      }
    } catch (err) {
      log.error(`Exceção ao validar "${agent.id}": ${err.message}`);
      results[agent.id] = { exists: false, error: err.message };
    }
  }

  return results;
}

// ============================================
// 5. TESTAR QUERIES BÁSICAS
// ============================================
async function testQueries(supabase) {
  log.header('🔍 TESTE DE QUERIES');
  
  const tests = [];

  // Test 1: Listar todos os agentes
  try {
    const { data, error } = await supabase
      .from('agents_config')
      .select('agent_id, name, tier, status')
      .order('tier');

    if (error) {
      log.error(`Query "Listar agentes" falhou: ${error.message}`);
      tests.push({ name: 'Listar agentes', status: 'fail', error: error.message });
    } else {
      log.success(`Query "Listar agentes": ${data.length} agentes encontrados`);
      tests.push({ name: 'Listar agentes', status: 'ok', count: data.length });
    }
  } catch (err) {
    log.error(`Query "Listar agentes" exceção: ${err.message}`);
    tests.push({ name: 'Listar agentes', status: 'fail', error: err.message });
  }

  // Test 2: Buscar agente por tier
  try {
    const { data, error } = await supabase
      .from('agents_config')
      .select('*')
      .eq('tier', 2);

    if (error) {
      log.error(`Query "Filtrar por tier" falhou: ${error.message}`);
      tests.push({ name: 'Filtrar por tier', status: 'fail', error: error.message });
    } else {
      log.success(`Query "Filtrar por tier=2": ${data.length} agentes`);
      tests.push({ name: 'Filtrar por tier', status: 'ok', count: data.length });
    }
  } catch (err) {
    log.error(`Query "Filtrar por tier" exceção: ${err.message}`);
    tests.push({ name: 'Filtrar por tier', status: 'fail', error: err.message });
  }

  // Test 3: Verificar execuções (tabela pode estar vazia)
  try {
    const { data, error } = await supabase
      .from('agent_executions')
      .select('count')
      .limit(1);

    if (error) {
      log.error(`Query "Verificar execuções" falhou: ${error.message}`);
      tests.push({ name: 'Verificar execuções', status: 'fail', error: error.message });
    } else {
      log.success(`Query "Verificar execuções": tabela acessível`);
      tests.push({ name: 'Verificar execuções', status: 'ok' });
    }
  } catch (err) {
    log.error(`Query "Verificar execuções" exceção: ${err.message}`);
    tests.push({ name: 'Verificar execuções', status: 'fail', error: err.message });
  }

  return tests;
}

// ============================================
// 6. RELATÓRIO FINAL
// ============================================
function generateReport(tableResults, agentResults, queryTests) {
  log.header('📋 RELATÓRIO FINAL');
  log.divider();

  // Tabelas
  const tablesOk = Object.values(tableResults).filter(v => v).length;
  const tablesTotal = Object.keys(tableResults).length;
  console.log(`\n${colors.bold}Tabelas:${colors.reset} ${tablesOk}/${tablesTotal} OK`);
  
  for (const [table, exists] of Object.entries(tableResults)) {
    const icon = exists ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${icon} ${table}${colors.reset}`);
  }

  // Agentes
  const agentsOk = Object.values(agentResults).filter(v => v.exists).length;
  const agentsTotal = Object.keys(agentResults).length;
  console.log(`\n${colors.bold}Agentes:${colors.reset} ${agentsOk}/${agentsTotal} OK`);
  
  for (const [agentId, result] of Object.entries(agentResults)) {
    const icon = result.exists ? colors.green + '✓' : colors.red + '✗';
    const details = result.exists 
      ? `${result.name} ${result.emoji} (Tier ${result.tier}, ${result.skillsCount} skills)`
      : result.error || 'Não encontrado';
    console.log(`  ${icon} ${agentId}: ${details}${colors.reset}`);
  }

  // Queries
  const queriesOk = queryTests.filter(t => t.status === 'ok').length;
  const queriesTotal = queryTests.length;
  console.log(`\n${colors.bold}Queries:${colors.reset} ${queriesOk}/${queriesTotal} OK`);
  
  for (const test of queryTests) {
    const icon = test.status === 'ok' ? colors.green + '✓' : colors.red + '✗';
    console.log(`  ${icon} ${test.name}${colors.reset}`);
  }

  // Status geral
  log.divider();
  const allOk = tablesOk === tablesTotal && agentsOk === agentsTotal && queriesOk === queriesTotal;
  
  if (allOk) {
    console.log(`\n${colors.green}${colors.bold}🎉 TUDO OK! Banco de dados pronto para uso.${colors.reset}\n`);
    return 0;
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  EXISTEM PROBLEMAS. Verifique acima.${colors.reset}\n`);
    return 1;
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log(`
${colors.cyan}${colors.bold}
╔══════════════════════════════════════════════════════════╗
║     VALIDAÇÃO DO BANCO DE DADOS - APPS TOTUM            ║
║              Skills System v1.0                          ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}`);

  try {
    // 1. Carregar env
    log.info('Carregando variáveis de ambiente...');
    const env = loadEnv();
    log.success('Variáveis carregadas!');

    // 2. Conectar
    const supabase = await connectSupabase(env);

    // 3. Verificar tabelas
    const tableResults = await checkTables(supabase);

    // 4. Validar agentes
    const agentResults = await validateAgents(supabase);

    // 5. Testar queries
    const queryTests = await testQueries(supabase);

    // 6. Relatório
    const exitCode = generateReport(tableResults, agentResults, queryTests);
    
    process.exit(exitCode);
  } catch (err) {
    log.error(`Erro fatal: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
