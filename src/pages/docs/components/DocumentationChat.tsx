/**
 * DocumentationChat Component
 * Displays chat interface with Ollama AI assistance
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/loading';
import { Card } from '@/components/ui/card';
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
    <div className="h-full flex flex-col bg-zinc-950 border-l border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-black/50 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ef233c]" />
            Documentation AI
          </h2>
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-2 min-h-[44px] min-w-[44px] hover:bg-zinc-800 rounded transition-colors active:scale-95 flex items-center justify-center"
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
            </button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              ollamaAvailable
                ? 'bg-green-500'
                : 'bg-yellow-500'
            }`}
          />
          <span className="text-zinc-400">
            {ollamaAvailable ? 'Ollama Active' : 'Using Fallback'}
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
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-[#ef233c]" />
              </div>
              <p className="text-sm text-zinc-400 mb-2">
                Ask me anything about elizaOS
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                I can help with agents, workflows, Alexandria, troubleshooting,
                and API reference.
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
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
                  className={`max-w-xs px-4 py-2.5 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#ef233c] text-white rounded-br-none'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-zinc-700">
                      <p className="text-xs text-zinc-400 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map(source => (
                          <span
                            key={source}
                            className="text-xs bg-zinc-700 px-2 py-0.5 rounded"
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
              <div className="bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-lg rounded-bl-none">
                <LoadingSpinner size="sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-black/50 sticky bottom-0">
        {!ollamaAvailable && (
          <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-500/10 px-3 py-2 rounded mb-3 border border-yellow-500/20">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Ollama unavailable, using cloud fallback</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about documentation..."
            disabled={loading}
            className="flex-1 bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#ef233c] min-h-[44px] py-2"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#ef233c] hover:bg-[#d91e2f] text-white disabled:opacity-50 min-h-[44px] min-w-[44px] px-3 py-2 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-xs text-zinc-500 mt-2 text-center">
          Powered by Ollama · Local AI · No tracking
        </p>
      </div>
    </div>
  );
}
