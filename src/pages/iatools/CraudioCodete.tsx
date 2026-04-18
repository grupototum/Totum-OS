import React, { useRef, useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Terminal, Send, Trash2, RefreshCw, Cpu, Zap, GitBranch, Play, Activity,
} from 'lucide-react';
import { useOllamaAPI, useOllamaChat } from '@/hooks/useOllamaAPI';

const SYSTEM_PROMPT = `Você é Cráudio Codete, um assistente de desenvolvimento de software especializado.
Você roda localmente via Ollama e é especializado em:
- React, TypeScript, Tailwind CSS, shadcn/ui
- Supabase, PostgreSQL
- Node.js, Python
- Git, Docker, Linux/bash

Responda sempre em português brasileiro. Seja objetivo e forneça código quando necessário.
Para blocos de código, use markdown com a linguagem especificada.`;

const QUICK_ACTIONS = [
  { label: 'Status Git', prompt: 'Qual o comando git para ver o status do projeto?' },
  { label: 'Rodar Testes', prompt: 'Como rodar os testes do projeto React com Vitest?' },
  { label: 'Build Prod', prompt: 'Qual o comando para fazer build de produção?' },
  { label: 'Deploy VPS', prompt: 'Quais os passos para fazer deploy de um app React em uma VPS?' },
  { label: 'SQL Exemplo', prompt: 'Gere um exemplo de query SQL para o Supabase com TypeScript.' },
];

export default function CraudioCodete() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isOnline, models, selectedModel, setSelectedModel, isCheckingHealth, checkHealth } = useOllamaAPI();
  const { messages, isStreaming, currentResponse, sendMessage, clearMessages } = useOllamaChat();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentResponse]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || !isOnline) return;
    setInput('');
    await sendMessage(trimmed, selectedModel, SYSTEM_PROMPT);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const allMessages = [...messages, ...(currentResponse ? [{ role: 'assistant' as const, content: currentResponse }] : [])];

  return (
    <AppLayout>
    <div className="flex h-[calc(100vh-80px)] gap-4 p-4">
      {/* CHAT PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg">Cráudio Codete</h1>
            <Badge className={`border-0 text-xs ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {isCheckingHealth ? 'Verificando...' : isOnline ? '● Ollama Online' : '● Ollama Offline'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!isOnline}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                {models.length > 0 ? (
                  models.map(m => <SelectItem key={m.name} value={m.name} className="text-xs">{m.name}</SelectItem>)
                ) : (
                  <SelectItem value="llama3.2:3b" className="text-xs">llama3.2:3b</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={clearMessages}><Trash2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={checkHealth}><RefreshCw className={`h-4 w-4 ${isCheckingHealth ? 'animate-spin' : ''}`} /></Button>
          </div>
        </div>

        {/* Mensagens */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
            {allMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                <Terminal className="h-12 w-12 text-muted-foreground/30" />
                <div>
                  <p className="font-semibold text-muted-foreground">Cráudio Codete pronto</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    {isOnline ? `Usando ${selectedModel} via Ollama local` : 'Ollama offline — verifique a VPS'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {allMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground font-mono'
                    }`}>
                      {msg.content}
                      {i === allMessages.length - 1 && isStreaming && msg.role === 'assistant' && (
                        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOnline ? 'Pergunte algo ao Cráudio... (Enter para enviar)' : 'Ollama offline...'}
              disabled={!isOnline || isStreaming}
              rows={2}
              className="flex-1 resize-none bg-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <Button onClick={handleSend} disabled={!isOnline || isStreaming || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* SIDEBAR DIREITA */}
      <div className="w-56 space-y-3 hidden lg:flex lg:flex-col">
        {/* Ações rápidas */}
        <Card className="p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">AÇÕES RÁPIDAS</p>
          <div className="space-y-1">
            {QUICK_ACTIONS.map(action => (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-7"
                disabled={!isOnline || isStreaming}
                onClick={() => sendMessage(action.prompt, selectedModel, SYSTEM_PROMPT)}
              >
                <Play className="h-3 w-3 mr-1.5 text-primary" />{action.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Info do modelo */}
        <Card className="p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">MODELO</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Cpu className="h-3 w-3" />Motor</span>
              <span className="font-mono font-medium">Ollama</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" />Modelo</span>
              <span className="font-mono font-medium text-xs truncate max-w-20">{selectedModel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" />Msgs</span>
              <span className="font-medium">{messages.length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}
