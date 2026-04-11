/**
 * Ingest Service
 * Wrapper para ingestão no Supabase
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function ingestToSupabase() {
  const scriptPath = path.join(__dirname, '../routes/ingest.js');
  
  try {
    const output = execSync(`node ${scriptPath}`, {
      encoding: 'utf-8',
      timeout: 120000 // 2 minutos
    });
    
    return {
      success: true,
      output
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
