/**
 * Transcribe Service
 * Wrapper para o script de processamento
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function processTranscriptions({ mock = false, count = 10 }) {
  const scriptPath = path.join(__dirname, '../routes/transcribe.js');
  
  try {
    // Executa o script original como subprocesso
    const env = {
      ...process.env,
      MOCK_MODE: mock ? 'true' : 'false',
      NEW_COUNT: count.toString()
    };
    
    const output = execSync(`node ${scriptPath}`, { 
      env,
      encoding: 'utf-8',
      timeout: 600000 // 10 minutos
    });
    
    return {
      success: true,
      output,
      files: [
        'transcription-processed.json',
        'data-for-wanda.json',
        'data-for-scrivo.json'
      ]
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      stderr: err.stderr?.toString()
    };
  }
}
