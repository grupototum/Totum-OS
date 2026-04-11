import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Agent } from '@/hooks/useAgents';
import { sendMessageToAI, streamMessageFromAI, hasAIConfig, getDefaultProvider, type AIProvider } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface AgentChatProps {
  agent: Agent;
  onClose?: () => void;
}

// Contexto do sistema para cada tipo de agente
const getAgentSystemPrompt = (agent: Agent): string => {
  return `Você é ${agent.name}, um agente de IA especializado como ${agent.role}.

CATEGORIA: ${agent.category}
TIPO: ${agent.type}
STATUS: ${agent.status}

Você deve responder de forma profissional, objetiva e alinhada com sua função como ${agent.role}.
Mantenha respostas concisas mas informativas.
Se não souber algo, seja honesto sobre suas limitações.

Contexto adicional: Você faz parte do ecossistema TOTUM de agentes de IA.`;
};

export function AgentChat({ agent, onClose }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: `Olá! Sou ${agent.name}, ${agent.role.toLowerCase()}. Como posso ajudar você hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<AIProvider>(getDefaultProvider());
  const [hasConfig, setHasConfig] = useState(hasAIConfig());
  const scrollRef = useRef<HTMLDivElement>(null);

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Em espera',
    maintenance: 'Manutenção',
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Atualiza o estado de configuração quando o componente monta
  useEffect(() => {
    setHasConfig(hasAIConfig());
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Verifica se tem configuração de IA
    if (!hasConfig) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: '⚠️ API de IA não configurada. Por favor, configure as variáveis de ambiente VITE_KIMI_API_KEY, VITE_GROQ_API_KEY ou VITE_OPENAI_API_KEY para habilitar o chat inteligente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      return;
    }

    // Prepara mensagens para a API
    const systemPrompt = getAgentSystemPrompt(agent);
    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.filter(m => m.role === 'user' || m.role === 'agent').map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      })),
      { role: 'user' as const, content: input },
    ];

    // Cria mensagem vazia para streaming
    const agentMessageId = (Date.now() + 2).toString();
    setMessages(prev => [...prev, {
      id: agentMessageId,
      role: 'agent',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }]);

    try {
      // Tenta usar streaming primeiro
      let fullContent = '';
      const { error } = await streamMessageFromAI(
        apiMessages,
        (chunk) => {
          fullContent += chunk;
          setMessages(prev => 
            prev.map(m => 
              m.id === agentMessageId 
                ? { ...m, content: fullContent }
                : m
            )
          );
        },
        provider
      );

      if (error) {
        throw new Error(error);
      }

      // Marca como completo
      setMessages(prev => 
        prev.map(m => 
          m.id === agentMessageId 
            ? { ...m, isStreaming: false }
            : m
        )
      );
    } catch (error: any) {
      console.error('Erro na comunicação com IA:', error);
      
      // Atualiza mensagem com erro
      setMessages(prev => 
        prev.map(m => 
          m.id === agentMessageId 
            ? { 
                ...m, 
                content: `❌ Erro ao processar mensagem: ${error.message || 'Erro desconhecido'}. Por favor, verifique sua conexão e configurações de API.`,
                isStreaming: false 
              }
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, agent, provider, hasConfig]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'agent',
      content: `Olá! Sou ${agent.name}, ${agent.role.toLowerCase()}. Como posso ajudar você hoje?`,
      timestamp: new Date(),
    }]);
  };

  return (
    <Card className="h-full flex flex-col border-stone-300 bg-[#EAEAE5]">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-stone-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-stone-200 text-lg">
                {agent.emoji}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium text-stone-900">
                {agent.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                <span className="text-xs text-stone-500">{statusLabels[agent.status]}</span>
                <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
                  {agent.role}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Provider Selector */}
            <Select value={provider} onValueChange={(v) => setProvider(v as AIProvider)}>
              <SelectTrigger className="w-28 h-8 text-xs bg-white border-stone-300">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kimi">Kimi</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearChat}
              title="Limpar chat"
            >
              <Icon icon="solar:trash-bin-linear" className="w-4 h-4 text-stone-500" />
            </Button>
            
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon icon="solar:close-circle-linear" className="w-5 h-5 text-stone-500" />
              </Button>
            )}
          </div>
        </div>
        
        {!hasConfig && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              ⚠️ Configure uma API key (Kimi/Groq/OpenAI) para habilitar respostas inteligentes.
            </p>
          </div>
        )}
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[400px] px-4 py-4" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={message.role === 'user' ? 'bg-stone-800 text-white text-xs' : 'bg-stone-200 text-xs'}>
                        {message.role === 'user' ? 'Você' : agent.emoji}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`
                      rounded-2xl px-4 py-2.5
                      ${message.role === 'user' 
                        ? 'bg-stone-900 text-white rounded-br-md' 
                        : 'bg-white border border-stone-300 rounded-bl-md'
                      }
                    `}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-stone-400 animate-pulse" />
                      )}
                      
                      <span className={`
                        text-[10px] mt-1 block
                        ${message.role === 'user' ? 'text-stone-400' : 'text-stone-400'}
                      `}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && !messages.some(m => m.isStreaming) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-stone-200 text-xs">{agent.emoji}</AvatarFallback>
                    </Avatar>
                    
                    <div className="bg-white border border-stone-300 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <CardContent className="pt-0 pb-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasConfig ? "Digite sua mensagem..." : "Configure a API para usar o chat..."}
            disabled={!hasConfig}
            className="flex-1 bg-white border-stone-300 focus:border-stone-500"
          />
          
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !hasConfig}
            className="bg-stone-900 hover:bg-stone-800 text-white"
          >
            <Icon icon="solar:plain-linear" className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-[10px] text-stone-400 mt-2 text-center">
          {hasConfig 
            ? `Chat integrado com IA (${provider}) • Respostas em tempo real`
            : 'Configure VITE_KIMI_API_KEY, VITE_GROQ_API_KEY ou VITE_OPENAI_API_KEY no .env'
          }
        </p>
      </CardContent>
    </Card>
  );
}
