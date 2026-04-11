// Serviço de integração com Ollama (IA local na VPS)

const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaChatMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
  };
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

// Verifica se o Ollama está online
export const checkOllamaHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
};

// Lista modelos disponíveis
export const listOllamaModels = async (): Promise<OllamaModel[]> => {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  if (!res.ok) throw new Error('Ollama indisponível');
  const data = await res.json();
  return data.models || [];
};

// Geração simples (não-stream)
export const ollamaGenerate = async (req: OllamaGenerateRequest): Promise<string> => {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...req, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
  const data: OllamaResponse = await res.json();
  return data.response;
};

// Chat com streaming
export const ollamaChatStream = async (
  req: OllamaChatRequest,
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> => {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...req, stream: true }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);

  const reader = res.body?.getReader();
  if (!reader) throw new Error('Stream não disponível');

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.message?.content) onChunk(json.message.content);
        if (json.done) onDone();
      } catch {
        // ignora linhas inválidas
      }
    }
  }
};

// Modelo padrão para skills de transcrição
export const DEFAULT_TRANSCRIPTION_MODEL = 'llama3.2:3b';
