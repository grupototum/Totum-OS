/**
 * DocumentationChat Component
 * Displays chat interface with AI assistance
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/loading';
import type { ChatMessage } from '../hooks/useDocumentation';

interface DocumentationChatProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  ollamaAvailable: boolean;
}

export function DocumentationChat({
  messages,
  loading,
  onSendMessage,
  onClearChat,
  ollamaAvailable,
}: DocumentationChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/50 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Documentação AI
          </h2>
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-2 min-h-[44px] min-w-[44px] hover:bg-muted rounded-none transition-colors active:scale-95 flex items-center justify-center"
              title="Limpar histórico"
              aria-label="Limpar histórico"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              ollamaAvailable
                ? 'bg-emerald-500'
                : 'bg-primary'
            }`}
          />
          <span className="text-muted-foreground">
            {ollamaAvailable ? 'Ollama Ativo' : 'Usando Fallback'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 rounded-none bg-muted flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Pergunte-me qualquer coisa sobre a Totum
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-xs">
                Posso ajudar com agentes, workflows, Alexandria, troubleshooting
                e referência de API.
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-none ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">Fontes:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map(source => (
                          <span
                            key={source}
                            className="text-xs bg-background px-2 py-0.5 rounded-none border border-border"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted text-foreground px-4 py-2.5 rounded-none">
                <LoadingSpinner size="sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/50 sticky bottom-0">
        {!ollamaAvailable && (
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-2 rounded-none mb-3 border border-primary/20">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Ollama indisponível, usando fallback em nuvem</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pergunte sobre a documentação..."
            disabled={loading}
            className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary min-h-[48px] py-3 rounded-none"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 min-h-[48px] min-w-[48px] px-3 py-3 active:scale-95 transition-transform rounded-none"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by Ollama · IA Local · Sem tracking
        </p>
      </div>
    </div>
  );
}
