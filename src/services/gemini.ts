// Serviço de integração com Google Gemini
// Documentação: https://ai.google.dev/gemini-api/docs

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Modelos disponíveis
export const GEMINI_MODELS = {
  FLASH: 'gemini-2.0-flash',           // Mais rápido, mais barato
  PRO: 'gemini-2.0-pro-exp-02-05',     // Mais inteligente
  FLASH_LITE: 'gemini-2.0-flash-lite', // Econômico
} as const;

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
    finishReason?: string;
  }[];
  error?: {
    message: string;
    code: number;
  };
}

// System prompt do GILES
const GILES_SYSTEM_PROMPT = `Você é GILES, o Cientista da Informação e Bibliotecário da Totum.

SUA PERSONALIDADE:
- Profissional, mas acolhedor
- Preciso e conciso
- Sempre cita as fontes
- Orgulhoso da Alexandria (biblioteca de conhecimento)

SUAS REGRAS:
1. SEMPRE baseie suas respostas no CONTEXTO fornecido
2. Se não souber, diga "Não encontrei isso na Alexandria"
3. Cite a fonte (domínio/categoria) quando possível
4. Seja direto — não floreie
5. Use formatação markdown quando útil

CONTEXTO DA TOTUM:
- Totum é uma empresa de infraestrutura de crescimento
- Tem agentes: TOT (orquestrador), MIGUEL (arquiteto), LIZ (guardiã), JARVIS (executor)
- Alexandria é a biblioteca central de conhecimento
- Stark é o VPS na Alibaba Cloud
- Apps é a plataforma principal (React + Supabase)

Quando responder, lembre-se: você é o guardião do conhecimento. Não invente — use o que está na Alexandria.`;

// Função principal de chat
export async function chatWithGemini(
  message: string,
  context: string,
  history: { role: 'user' | 'model'; text: string }[] = [],
  model: string = GEMINI_MODELS.FLASH
): Promise<{ text: string; error?: string }> {
  if (!GEMINI_API_KEY) {
    return { 
      text: '', 
      error: 'API key do Gemini não configurada. Adicione VITE_GEMINI_API_KEY no .env' 
    };
  }

  try {
    // Montar histórico de mensagens
    const contents: GeminiMessage[] = [
      // System prompt como primeira mensagem do model
      {
        role: 'model',
        parts: [{ text: GILES_SYSTEM_PROMPT }]
      },
      // Histórico da conversa
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      // Contexto atual
      {
        role: 'model',
        parts: [{ text: `CONTEXTO DA ALEXANDRIA:\n${context}` }]
      },
      // Pergunta do usuário
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(
      `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,  // Mais preciso, menos criativo
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.error('Erro Gemini:', data.error);
      return { 
        text: '', 
        error: `Erro ${data.error.code}: ${data.error.message}` 
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return { 
        text: '', 
        error: 'Resposta vazia do Gemini' 
      };
    }

    return { text };

  } catch (error) {
    console.error('Erro na chamada Gemini:', error);
    return { 
      text: '', 
      error: 'Erro de conexão com o Gemini. Tente novamente.' 
    };
  }
}

// Função simplificada para o GILES responder
export async function askGeminiAsGiles(
  question: string,
  contextChunks: { content: string; dominio: string; categoria: string }[],
  conversationHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<{ text: string; error?: string }> {
  // Formatar contexto
  const formattedContext = contextChunks.length > 0
    ? contextChunks.map((chunk, idx) => 
        `[${idx + 1}] ${chunk.dominio} > ${chunk.categoria}:\n${chunk.content.substring(0, 500)}...`
      ).join('\n\n')
    : 'Nenhum contexto encontrado na Alexandria para esta pergunta.';

  return chatWithGemini(question, formattedContext, conversationHistory);
}

// Contagem de tokens (estimativa simples)
export function estimateTokens(text: string): number {
  // Estimativa aproximada: 1 token ≈ 4 caracteres em português
  return Math.ceil(text.length / 4);
}

// Verificar se API key está configurada
export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AI');
}

// Obter informações do modelo
export function getModelInfo(model: string = GEMINI_MODELS.FLASH) {
  const info: Record<string, { name: string; description: string; speed: string; cost: string }> = {
    [GEMINI_MODELS.FLASH]: {
      name: 'Gemini 2.0 Flash',
      description: 'Rápido e eficiente para tarefas cotidianas',
      speed: '⚡ Muito rápido',
      cost: '💰 Econômico'
    },
    [GEMINI_MODELS.PRO]: {
      name: 'Gemini 2.0 Pro',
      description: 'Máxima qualidade para tarefas complexas',
      speed: '🐢 Mais lento',
      cost: '💰💰 Mais caro'
    },
    [GEMINI_MODELS.FLASH_LITE]: {
      name: 'Gemini 2.0 Flash Lite',
      description: 'Versão mais leve e barata',
      speed: '⚡⚡ Extremamente rápido',
      cost: '💰 Muito econômico'
    }
  };

  return info[model] || info[GEMINI_MODELS.FLASH];
}
