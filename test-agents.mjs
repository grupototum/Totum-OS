#!/usr/bin/env node

/**
 * Script de Teste para Agentes WANDA e SCRIVO
 * Envia dados reais aos webhooks e valida outputs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3333/webhook/tot';
const OUTPUT_DIR = path.join(__dirname, 'outputs');
let testsPassed = 0;
let testsFailed = 0;

// ============================================================
// HELPERS
// ============================================================

async function sendToWebhook(agent, task, data) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, task, data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`❌ Erro ao chamar webhook:`, err.message);
    return null;
  }
}

function saveResult(agent, result) {
  const outputFile = path.join(OUTPUT_DIR, `${agent.toLowerCase()}-output.json`);
  fs.appendFileSync(outputFile, JSON.stringify(result, null, 2) + ',\n');
}

// ============================================================
// TESTES
// ============================================================

async function testWanda() {
  console.log('\n📱 Testando WANDA (Social Content)...\n');

  const data = {
    subject: 'IA que revoluciona produtividade',
    summary: 'Ferramentas de IA estão mudando como trabalhamos',
    insights: [
      'Automação economiza 10h por semana',
      'Teams com IA deliveram 40% mais',
      'Treinamento leva só 2 dias'
    ],
    tags: ['#IA', '#Produtividade', '#Trabalho', '#Automação', '#Tech'],
    ctas: ['me segue', 'comenta IA'],
    category: 'educational'
  };

  const result = await sendToWebhook(
    'wanda',
    'Gerar conteúdo social',
    data
  );

  if (result) {
    console.log('✅ WANDA respondeu com sucesso');
    console.log(`   Execution ID: ${result.execution_id}`);
    console.log(`   Variações geradas: ${result.output.total_variations}`);
    
    // Validar estrutura
    if (result.output.variations && result.output.variations.length === 3) {
      console.log('   ✓ 3 variações de posts geradas');
      console.log(`     - Post 1: Instagram (score: ${result.output.variations[0].engagement_score})`);
      console.log(`     - Post 2: TikTok (score: ${result.output.variations[1].engagement_score})`);
      console.log(`     - Post 3: LinkedIn (score: ${result.output.variations[2].engagement_score})`);
      testsPassed++;
    } else {
      console.error('   ✗ Estrutura inesperada');
      testsFailed++;
    }
    
    saveResult('wanda', result);
  } else {
    console.error('❌ WANDA não respondeu');
    testsFailed++;
  }
}

async function testScrivo() {
  console.log('\n✍️  Testando SCRIVO (Copywriting)...\n');

  const data = {
    subject: 'Claude Code revoluciona desenvolvimento',
    script: 'Esse novo agente faz tudo automaticamente. Escreve código, testa, corrige bugs. Tudo em minutos.',
    ctas: ['me segue', 'comenta CLAUDE'],
    toneOfVoice: 'informativo'
  };

  const result = await sendToWebhook(
    'scrivo',
    'Otimizar copy',
    data
  );

  if (result) {
    console.log('✅ SCRIVO respondeu com sucesso');
    console.log(`   Execution ID: ${result.execution_id}`);
    console.log(`   Scripts otimizados: ${result.output.optimized_scripts.length}`);
    
    // Validar estrutura
    if (result.output.optimized_scripts && result.output.optimized_scripts.length === 3) {
      console.log('   ✓ 3 versões de scripts otimizadas');
      result.output.optimized_scripts.forEach((script, i) => {
        console.log(`     - Versão ${script.version}: Hook="${script.hook.substring(0, 40)}..." (score: ${script.performance_prediction})`);
      });
      testsPassed++;
    } else {
      console.error('   ✗ Estrutura inesperada');
      testsFailed++;
    }
    
    saveResult('scrivo', result);
  } else {
    console.error('❌ SCRIVO não respondeu');
    testsFailed++;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testando Health Check...\n');

  try {
    const response = await fetch(`${WEBHOOK_URL.replace('/webhook/tot', '/health')}`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Webhook Server está online');
      console.log(`   Status: ${data.status}`);
      console.log(`   Agentes: ${data.agents.join(', ')}`);
      testsPassed++;
    }
  } catch (err) {
    console.error('❌ Webhook Server offline?', err.message);
    testsFailed++;
  }
}

// ============================================================
// VALIDAÇÃO FINAL
// ============================================================

async function validateOutputs() {
  console.log('\n📂 Validando arquivos de output...\n');

  const wandaFile = path.join(OUTPUT_DIR, 'wanda-output.json');
  const scrivoFile = path.join(OUTPUT_DIR, 'scrivo-output.json');

  if (fs.existsSync(wandaFile)) {
    const size = fs.statSync(wandaFile).size;
    console.log(`✅ wanda-output.json (${size} bytes)`);
    testsPassed++;
  } else {
    console.error('❌ wanda-output.json não encontrado');
    testsFailed++;
  }

  if (fs.existsSync(scrivoFile)) {
    const size = fs.statSync(scrivoFile).size;
    console.log(`✅ scrivo-output.json (${size} bytes)`);
    testsPassed++;
  } else {
    console.error('❌ scrivo-output.json não encontrado');
    testsFailed++;
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🤖 TESTE DE AGENTES - WANDA & SCRIVO           ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  console.log(`\n📡 Webhook URL: ${WEBHOOK_URL}\n`);

  // Criar diretório de outputs se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Limpar arquivos antigos
  const wandaFile = path.join(OUTPUT_DIR, 'wanda-output.json');
  const scrivoFile = path.join(OUTPUT_DIR, 'scrivo-output.json');
  if (fs.existsSync(wandaFile)) fs.unlinkSync(wandaFile);
  if (fs.existsSync(scrivoFile)) fs.unlinkSync(scrivoFile);

  // Executar testes
  await testHealthCheck();
  await testWanda();
  await testScrivo();
  await validateOutputs();

  // Relatório final
  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 0;

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 RESULTADO: ${testsPassed}/${total} testes passou (${percentage}%)`);
  console.log('═'.repeat(60));

  if (testsFailed === 0) {
    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    console.log('\n📁 Outputs salvos em:');
    console.log(`   - ${wandaFile}`);
    console.log(`   - ${scrivoFile}`);
  } else {
    console.log(`\n❌ ${testsFailed} teste(s) falharam`);
    console.log('   Verifique se o Webhook Server está rodando:');
    console.log('   $ npm run start:webhook');
  }

  console.log('\n');
}

main();
