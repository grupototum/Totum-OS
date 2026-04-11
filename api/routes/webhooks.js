#!/usr/bin/env node

/**
 * Exemplo de Webhook para WANDA (Agente de Social Content)
 * Recebe dados processados e gera 3 variações de posts virais
 */

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const PORT = 3333;

// ============================================================
// MOCK WANDA - Gerador de Social Content
// ============================================================

function generateWandaPosts(data) {
  const { subject, summary, insights, tags, ctas } = data;
  
  return {
    execution_id: `wanda-${Date.now()}`,
    agent: 'WANDA',
    task: 'Gerar conteúdo social',
    status: 'success',
    output: {
      variations: [
        {
          id: 1,
          platform: 'Instagram',
          copy: `🚀 ${subject}

${insights[0]}

${insights[1] ? '✨ ' + insights[1] : ''}

${ctas.length > 0 ? '👉 ' + ctas[0] : 'Me segue para mais!'}

${tags.slice(0, 5).join(' ')}`,
          engagement_score: 8.5,
          recommended_time: '19:00 - 21:00'
        },
        {
          id: 2,
          platform: 'TikTok',
          copy: `Relaxa que eu exp   lico! 🎯

${summary}

Insights:
• ${insights[0]}
• ${insights[1] || 'Feature incrível'}

${ctas[0] ? '→ ' + ctas[0] : '→ Me segue'}

${tags.slice(0, 3).join(' ')}`,
          engagement_score: 9.2,
          recommended_time: 'Qualquer hora'
        },
        {
          id: 3,
          platform: 'LinkedIn',
          copy: `💡 Reflexão: ${subject}

${summary}

3 takeaways principais:
1️⃣ ${insights[0]}
2️⃣ ${insights[1] || 'Inovação contínua'}
3️⃣ ${insights[2] || 'Impacto mensurável'}

O que você acha?

${tags.slice(0, 3).join(' ')}`,
          engagement_score: 7.8,
          recommended_time: '09:00 - 11:00'
        }
      ],
      total_variations: 3,
      generated_at: new Date().toISOString()
    }
  };
}

// ============================================================
// WEBHOOK ENDPOINT
// ============================================================

app.post('/webhook/tot', (req, res) => {
  const { agent, task, data } = req.body;

  console.log(`\n📨 Recebido webhook para ${agent}`);
  console.log(`   Task: ${task}`);
  console.log(`   Data: ${data?.subject?.substring(0, 50)}...`);

  try {
    if (agent === 'wanda') {
      const result = generateWandaPosts(data);
      
      // Salvar output
      const outputFile = path.join(process.cwd(), 'outputs', 'wanda-output.json');
      fs.appendFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
      
      console.log(`✅ WANDA processou com sucesso`);
      res.json(result);
    } else if (agent === 'scrivo') {
      const result = generateScrivoPosts(data);
      
      // Salvar output
      const outputFile = path.join(process.cwd(), 'outputs', 'scrivo-output.json');
      fs.appendFileSync(outputFile, JSON.stringify(result, null, 2) + '\n');
      
      console.log(`✅ SCRIVO processou com sucesso`);
      res.json(result);
    } else {
      res.status(400).json({ error: 'Agent not recognized' });
    }
  } catch (err) {
    console.error(`❌ Erro ao processar webhook:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// MOCK SCRIVO - Otimizador de Copy
// ============================================================

function generateScrivoPosts(data) {
  const { subject, script, ctas, toneOfVoice } = data;
  
  return {
    execution_id: `scrivo-${Date.now()}`,
    agent: 'SCRIVO',
    task: 'Otimizar copy',
    status: 'success',
    output: {
      original_script: script,
      optimized_scripts: [
        {
          version: 1,
          hook: '🎯 Quer saber o segredo que os profissionais não querem que você saiba?',
          body: script,
          cta: ctas[0] || 'Me segue',
          closing: 'Deixa um comentário: você já conhecia essa técnica?',
          tone: toneOfVoice,
          duration: '30-45s',
          performance_prediction: 8.7
        },
        {
          version: 2,
          hook: 'Isso vai mudar tudo para você... 🚀',
          body: script,
          cta: ctas[0] || 'Comenta QUER para saber mais',
          closing: 'Compartilha com quem precisa aprender isso',
          tone: toneOfVoice,
          duration: '30-45s',
          performance_prediction: 8.9
        },
        {
          version: 3,
          hook: `${subject} - Ninguém te falou isso antes`,
          body: script,
          cta: ctas[0] || 'Salva esse vídeo',
          closing: 'Compartilhe com 3 amigos que precisam saber disso',
          tone: toneOfVoice,
          duration: '30-45s',
          performance_prediction: 8.5
        }
      ],
      best_performing: 2,
      generated_at: new Date().toISOString()
    }
  };
}

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    agents: ['wanda', 'scrivo'],
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Webhook Server rodando na porta ${PORT}`);
  console.log(`   WANDA: POST http://localhost:${PORT}/webhook/tot`);
  console.log(`   SCRIVO: POST http://localhost:${PORT}/webhook/tot`);
  console.log(`   Health: GET http://localhost:${PORT}/health\n`);
});
