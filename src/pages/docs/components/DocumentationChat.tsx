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
    <div className="flex h-full flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Zap className="w-4 h-4 text-primary" />
            IA da documentação
          </h2>
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 transition-colors hover:bg-muted active:scale-95"
              title="Limpar histórico"
              aria-label="Limpar histórico"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center border border-border bg-muted">
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
                  className={`max-w-xs border px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'border-primary/60 bg-primary/15 text-foreground'
                      : 'border-border bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 border-t border-border pt-2">
                      <p className="mb-1 text-xs text-muted-foreground">Fontes:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map(source => (
                          <span
                            key={source}
                            className="border border-border bg-background px-2 py-0.5 text-xs"
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
              <div className="bg-muted px-4 py-2.5 text-foreground">
                <LoadingSpinner size="sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-border bg-card p-4">
        {!ollamaAvailable && (
          <div className="mb-3 flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>IA local indisponível; respostas seguem em modo seguro.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pergunte sobre a documentação..."
            disabled={loading}
            className="min-h-[48px] flex-1 border-border bg-background py-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="min-h-[48px] min-w-[48px] bg-primary px-3 py-3 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95 disabled:opacity-50"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          IA local quando disponível · sem histórico remoto por padrão
        </p>
      </div>
    </div>
  );
}
