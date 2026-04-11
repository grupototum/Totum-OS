/**
 * OpenClaw Configuration
 * Centraliza configuração de integração com VPS OpenClaw
 */

export const OPENCLAW_CONFIG = {
  // URL base do VPS OpenClaw
  VPS_URL: import.meta.env.VITE_OPENCLAW_URL || 'http://localhost:3000',
  
  // Endpoints
  WEBHOOK_PATH: '/webhook/agents/execute',
  HEALTH_PATH: '/health',
  
  // Timeouts e retry
  TIMEOUT: 60000, // 60 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  
  // Modo mock para desenvolvimento
  // Quando true, simula respostas sem chamar VPS real
  MOCK_MODE: import.meta.env.VITE_OPENCLAW_MOCK === 'true' || true,
  
  // Logging
  ENABLE_LOGS: true,
  LOG_LEVEL: 'debug', // 'error' | 'warn' | 'info' | 'debug'
  
  // Rate limiting (client-side)
  MAX_REQUESTS_PER_MINUTE: 10,
  
  // Models disponíveis
  MODELS: {
    claude: {
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      cost_per_1k_tokens: 0.003,
      max_tokens: 4096,
    },
    groq: {
      name: 'Groq Llama 3',
      provider: 'groq',
      cost_per_1k_tokens: 0.0005,
      max_tokens: 8192,
    },
    gemini: {
      name: 'Gemini Pro',
      provider: 'google',
      cost_per_1k_tokens: 0.001,
      max_tokens: 32768,
    },
    kimi: {
      name: 'Kimi K2.5',
      provider: 'moonshot',
      cost_per_1k_tokens: 0.002,
      max_tokens: 8192,
    },
  },
} as const;

// Tipos derivados
export type OpenClawModel = keyof typeof OPENCLAW_CONFIG.MODELS;

// Helper para obter URL completa do webhook
export function getWebhookUrl(): string {
  return `${OPENCLAW_CONFIG.VPS_URL}${OPENCLAW_CONFIG.WEBHOOK_PATH}`;
}

// Helper para obter URL de health check
export function getHealthUrl(): string {
  return `${OPENCLAW_CONFIG.VPS_URL}${OPENCLAW_CONFIG.HEALTH_PATH}`;
}
