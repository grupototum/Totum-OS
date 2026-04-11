#!/usr/bin/env node

/**
 * Totum API Server
 * Backend unificado para pipeline de processamento + frontend
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupMasterUser } from './setup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'https://apps.grupototum.com'],
  credentials: true
}));
app.use(express.json());

// ============================================================
// SETUP ENDPOINT
// ============================================================
app.post('/api/setup', async (req, res) => {
  const result = await setupMasterUser();
  res.json(result);
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: ['transcribe', 'ingest', 'webhooks', 'agents']
  });
});

// ============================================================
// API ROUTES
// ============================================================

// Transcribe Pipeline
app.post('/api/transcribe', async (req, res) => {
  try {
    const { mock = false, count = 10 } = req.body;
    
    // Import dinâmico do módulo de transcrição
    const { processTranscriptions } = await import('./services/transcribeService.js');
    
    const result = await processTranscriptions({ mock, count });
    res.json({
      success: true,
      message: 'Processamento iniciado',
      result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ingest to Supabase
app.post('/api/ingest', async (req, res) => {
  try {
    const { ingestToSupabase } = await import('./services/ingestService.js');
    const result = await ingestToSupabase();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhooks Agents
app.post('/api/webhook/:agent', async (req, res) => {
  try {
    const { agent } = req.params;
    const { callAgentWebhook } = await import('./services/webhookService.js');
    const result = await callAgentWebhook(agent, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Agents
app.get('/api/test-agents', async (req, res) => {
  try {
    const { testAgents } = await import('./services/testService.js');
    const result = await testAgents();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Outputs
app.get('/api/outputs/:file', (req, res) => {
  const { file } = req.params;
  const filePath = path.join(__dirname, 'outputs', file);
  res.sendFile(filePath);
});

// List Outputs
app.get('/api/outputs', (req, res) => {
  res.json({
    files: [
      'transcription-processed.json',
      'data-for-wanda.json',
      'data-for-scrivo.json',
      'wanda-output.json',
      'scrivo-output.json'
    ]
  });
});

// Reset Password (Admin - sem enviar e-mail)
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email e nova senha são obrigatórios' 
      });
    }

    const { resetPasswordDirect } = await import('./reset-password-direct.mjs');
    const success = await resetPasswordDirect(email, newPassword);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Senha redefinida com sucesso' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Não foi possível redefinir a senha' 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ============================================================
// STATIC FILES (Frontend)
// ============================================================
app.use(express.static(path.join(__dirname, '../dist')));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ============================================================
// SETUP MASTER USER
// ============================================================
setupMasterUser().then(() => {
  console.log('');
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`
🚀 TOTUM API Server rodando na porta ${PORT}

Endpoints:
  GET  /api/health        - Health check
  POST /api/transcribe    - Processar transcrições
  POST /api/ingest        - Ingerir no Supabase
  POST /api/webhook/:agent- Chamar agente (WANDA/SCRIVO)
  GET  /api/outputs       - Listar arquivos de saída
  GET  /api/outputs/:file - Download arquivo

Frontend: http://localhost:${PORT}
  `);
});
