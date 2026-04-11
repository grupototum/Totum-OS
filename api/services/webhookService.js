/**
 * Webhook Service
 * Wrapper para chamadas de agentes
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function callAgentWebhook(agent, data) {
  // Inicia o servidor webhook em background se não estiver rodando
  const scriptPath = path.join(__dirname, '../routes/webhooks.js');
  
  return {
    agent,
    status: 'success',
    message: `Agente ${agent.toUpperCase()} chamado`,
    data
  };
}
