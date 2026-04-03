import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Agent } from '@/hooks/useAgents';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  agent: Agent;
  onClose?: () => void;
}

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `Entendi! Como ${agent.name}, vou processar sua solicitação sobre "${input.slice(0, 30)}${input.length > 30 ? '...' : ''}". Em um ambiente real, eu integraria com a API do agente para fornecer uma resposta inteligente.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon icon="solar:close-circle-linear" className="w-5 h-5 text-stone-500" />
            </Button>
          )}
        </div>
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
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
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
                      <p className="text-sm leading-relaxed">{message.content}</p>
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

              {isTyping && (
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
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white border-stone-300 focus:border-stone-500"
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-stone-900 hover:bg-stone-800 text-white"
          >
            <Icon icon="solar:plain-linear" className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-stone-400 mt-2 text-center">
          Este é um chat de demonstração. Integração real com API do agente em desenvolvimento.
        </p>
      </CardContent>
    </Card>
  );
}
