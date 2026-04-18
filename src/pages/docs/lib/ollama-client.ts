/**
 * Ollama Local AI Client
 * Handles communication with local Ollama instance running Qwen3
 * Falls back to Groq API if Ollama is unavailable
 */

function getOllamaBaseUrl(): string {
  try {
    const stored = localStorage.getItem('totum-api-keys');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.ollamaHost) return parsed.ollamaHost + '/api';
    }
  } catch {
    // ignore parse errors
  }
  return (import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434') + '/api';
}

// Must use import.meta.env in Vite (process.env.REACT_APP_* is CRA syntax — doesn't work here)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaResponse {
  message: OllamaMessage;
  done: boolean;
  totalDuration?: number;
  loadDuration?: number;
  promptEvalCount?: number;
  promptEvalDuration?: number;
  evalCount?: number;
  evalDuration?: number;
}

class OllamaClient {
  private ollamaAvailable: boolean = true;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.checkOllamaHealth();
    // Check health every 30 seconds
    this.checkInterval = setInterval(() => this.checkOllamaHealth(), 30000);
  }

  private async checkOllamaHealth(): Promise<void> {
    try {
      const response = await fetch(`${getOllamaBaseUrl()}/tags`);
      this.ollamaAvailable = response.ok;
    } catch (error) {
      this.ollamaAvailable = false;
    }
  }

  isOllamaAvailable(): boolean {
    return this.ollamaAvailable;
  }

  async chat(
    messages: OllamaMessage[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (this.ollamaAvailable) {
      try {
        return await this.chatWithOllama(messages, onChunk);
      } catch (error) {
        console.error('Ollama failed, falling back to Groq:', error);
        this.ollamaAvailable = false;
        return await this.chatWithGroq(messages);
      }
    }

    return await this.chatWithGroq(messages);
  }

  private async chatWithOllama(
    messages: OllamaMessage[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    let fullResponse = '';

    try {
      const response = await fetch(`${getOllamaBaseUrl()}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen2.5:7b',
          messages: messages,
          stream: true,
          options: {
            temperature: 0.7,
            num_ctx: 2048,
            top_p: 0.9,
            top_k: 40,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line) as OllamaResponse;
            if (json.message?.content) {
              fullResponse += json.message.content;
              onChunk?.(json.message.content);
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw error;
    }
  }

  private async chatWithGroq(messages: OllamaMessage[]): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await fetch(GROQ_BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq chat error:', error);
      throw error;
    }
  }

  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Singleton instance
let instance: OllamaClient | null = null;

export function getOllamaClient(): OllamaClient {
  if (!instance) {
    instance = new OllamaClient();
  }
  return instance;
}
