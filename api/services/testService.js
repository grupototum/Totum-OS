/**
 * Test Service
 * Executa testes dos agentes
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function testAgents() {
  const scriptPath = path.join(__dirname, '../routes/test-agents.js');
  
  try {
    const output = execSync(`node ${scriptPath}`, {
      encoding: 'utf-8',
      timeout: 60000 // 1 minuto
    });
    
    return {
      success: true,
      output: output.split('\n')
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
