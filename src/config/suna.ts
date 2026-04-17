/**
 * Suna Configuration
 * Integração com kortix-ai/suna — agente autônomo open-source
 * https://github.com/kortix-ai/suna
 */

export const SUNA_CONFIG = {
  // URL base da instância Suna self-hosted
  BASE_URL: import.meta.env.VITE_SUNA_URL || '',

  // API Key (Bearer token)
  API_KEY: import.meta.env.VITE_SUNA_API_KEY || '',

  // Timeout para chamadas longas (agentes podem demorar)
  TIMEOUT_MS: 120_000,

  // Modo mock quando URL não configurada
  MOCK_MODE: !import.meta.env.VITE_SUNA_URL,
} as const;

export const SUNA_ENDPOINTS = {
  health:   '/api/health',
  threads:  '/api/threads',
  messages: (threadId: string) => `/api/threads/${threadId}/messages`,
  run:      (threadId: string) => `/api/threads/${threadId}/run`,
  stream:   (threadId: string) => `/api/threads/${threadId}/stream`,
} as const;

export function sunaHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(SUNA_CONFIG.API_KEY ? { Authorization: `Bearer ${SUNA_CONFIG.API_KEY}` } : {}),
  };
}
