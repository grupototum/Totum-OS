// Serviço de integração com APIs de IA (Kimi/Groq/OpenAI)
// Novos serviços adicionados: skillsService, openClawClient

export { 
  loadSkillsRegistry, 
  getSkillById, 
  listSkills,
  getAgentConfig,
  getAllAgentConfigs,
  createAgentConfig,
  updateAgentConfig,
  addSkillToAgent,
  removeSkillFromAgent,
  reorderAgentSkills,
  getAgentSkills,
} from './skillsService';

export { 
  executeAgent, 
  checkOpenClawHealth,
  buildAgentPayload,
  OPENCLAW_CONFIG,
} from './openClawClient';

export type AIProvider = 'kimi' | 'groq' | 'openai';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

// Configurações da API
const getAPIConfig = () => ({
  kimi: {
    url: 'https://api.moonshot.cn/v1/chat/completions',
    key: import.meta.env.VITE_KIMI_API_KEY || '',
    model: 'moonshot-v1-8k',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: import.meta.env.VITE_GROQ_API_KEY || '',
    model: 'llama-3.1-8b-instant',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    key: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
  },
});

// Verifica se há alguma API key configurada
export const hasAIConfig = (): boolean => {
  const config = getAPIConfig();
  return !!(config.kimi.key || config.groq.key || config.openai.key);
};

// Obtém o provider padrão
export const getDefaultProvider = (): AIProvider => {
  const config = getAPIConfig();
  if (config.kimi.key) return 'kimi';
  if (config.groq.key) return 'groq';
  if (config.openai.key) return 'openai';
  return 'kimi'; // fallback
};

// Envia mensagem para a API de IA
export const sendMessageToAI = async (
  messages: AIMessage[],
  provider: AIProvider = getDefaultProvider()
): Promise<AIResponse> => {
  const config = getAPIConfig();
  const providerConfig = config[provider];

  if (!providerConfig.key) {
    return {
      content: '',
      error: `API key não configurada para ${provider}. Adicione VITE_${provider.toUpperCase()}_API_KEY no arquivo .env`,
    };
  }

  try {
    const response = await fetch(providerConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${providerConfig.key}`,
      },
      body: JSON.stringify({
        model: providerConfig.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return { content };
  } catch (error: any) {
    console.error('Erro ao chamar API de IA:', error);
    return {
      content: '',
      error: error.message || 'Erro desconhecido ao comunicar com a IA',
    };
  }
};

// Streaming de mensagens (simulado - para implementação real com ReadableStream)
export const streamMessageFromAI = async (
  messages: AIMessage[],
  onChunk: (chunk: string) => void,
  provider: AIProvider = getDefaultProvider()
): Promise<{ error?: string }> => {
  const config = getAPIConfig();
  const providerConfig = config[provider];

  if (!providerConfig.key) {
    return {
      error: `API key não configurada para ${provider}. Adicione VITE_${provider.toUpperCase()}_API_KEY no arquivo .env`,
    };
  }

  try {
    // Por enquanto, usamos a API não-streaming e simulamos o streaming
    // para manter compatibilidade com todos os providers
    const response = await sendMessageToAI(messages, provider);
    
    if (response.error) {
      return { error: response.error };
    }

    // Simula streaming chunk por chunk
    const chunks = response.content.split(' ');
    for (const chunk of chunks) {
      onChunk(chunk + ' ');
      // Pequeno delay para simular streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

// Re-export de serviços relacionados a agentes
export * from './skillsService';
export * from './openClawClient';
