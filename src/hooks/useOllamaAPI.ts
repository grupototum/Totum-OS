import { useState, useEffect, useCallback } from 'react';
import { checkOllamaHealth, listOllamaModels, ollamaChatStream, OllamaChatMessage, OllamaModel } from '@/services/ollamaService';

export const useOllamaAPI = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2:3b');
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Verifica saúde ao montar
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    const online = await checkOllamaHealth();
    setIsOnline(online);
    if (online) {
      try {
        const modelList = await listOllamaModels();
        setModels(modelList);
        if (modelList.length > 0 && !modelList.find(m => m.name === selectedModel)) {
          setSelectedModel(modelList[0].name);
        }
      } catch {
        // falha silenciosa ao listar modelos
      }
    }
    setIsCheckingHealth(false);
  }, [selectedModel]);

  return { isOnline, models, selectedModel, setSelectedModel, isCheckingHealth, checkHealth };
};

// Hook para chat com Ollama (streaming)
export const useOllamaChat = () => {
  const [messages, setMessages] = useState<OllamaChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const sendMessage = useCallback(async (
    content: string,
    model: string,
    systemPrompt?: string
  ) => {
    const userMsg: OllamaChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);
    setCurrentResponse('');

    let fullResponse = '';

    try {
      const chatMessages: OllamaChatMessage[] = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...newMessages]
        : newMessages;

      await ollamaChatStream(
        { model, messages: chatMessages, stream: true },
        (chunk) => {
          fullResponse += chunk;
          setCurrentResponse(fullResponse);
        },
        () => {
          setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
          setCurrentResponse('');
          setIsStreaming(false);
        }
      );
    } catch (err: any) {
      const errMsg = `Erro: ${err.message || 'Ollama indisponível'}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
      setCurrentResponse('');
      setIsStreaming(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentResponse('');
  }, []);

  return { messages, isStreaming, currentResponse, sendMessage, clearMessages };
};
