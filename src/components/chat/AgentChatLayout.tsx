// src/components/chat/AgentChatLayout.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAgentExecution } from '@/hooks/useAgentExecution';
import { ExecutionResult } from '@/types/agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  BookOpen,
  ChevronRight,
  ChevronLeft,
  BrainCircuit
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  executionResult?: ExecutionResult;
  ragContext?: string;
  ragDocuments?: string[];
}

export const AgentChatLayout: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showRagPanel, setShowRagPanel] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const {
    agentConfig,
    isLoading,
    isExecuting,
    isRagLoading,
    result,
    error,
    executionStatus,
    ragContext,
    ragDocuments,
    loadAgentConfig,
    execute,
    isReady,
  } = useAgentExecution({
    agentId: agentId || '',
    enableRAG: true, // 🧠 Habilitar Alexandria RAG
    onSuccess: (result) => {
      console.log('✅ Execução com sucesso:', result);
    },
    onError: (error) => {
      console.error('❌ Erro na execução:', error);
    },
  });

  useEffect(() => {
    if (agentId) {
      loadAgentConfig();
    }
  }, [agentId, loadAgentConfig]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !isReady || isSending) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const result = await execute(inputValue, {});

      if (result) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Execução concluída em ${result.duration_ms}ms`,
          timestamp: new Date(),
          executionResult: result,
          ragContext: ragContext,
          ragDocuments: ragDocuments?.map(d => d.document.id),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setSelectedMessage(assistantMessage);
      }
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isReady, execute, isSending, ragContext, ragDocuments]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Carregando agente...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error && !isReady) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full bg-background">
          <Card className="p-6 max-w-md w-full border-destructive">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">Erro ao carregar agente</h3>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{agentConfig?.emoji}</div>
                <div>
                  <h2 className="font-semibold">{agentConfig?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Tier {agentConfig?.tier} • {agentConfig?.status}
                  </p>
                </div>
              </div>
              
              {/* Alexandria RAG Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRagPanel(!showRagPanel)}
                className="gap-2"
              >
                <BrainCircuit className="h-4 w-4" />
                Alexandria
                {showRagPanel ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <p className="text-lg font-semibold mb-2">Comece uma conversa</p>
                  <p className="text-sm">Digite uma mensagem para começar</p>
                  
                  {/* Alexandria Status */}
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <BrainCircuit className="h-3 w-3" />
                      Alexandria RAG Ativo
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-md p-4 cursor-pointer transition-colors ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : selectedMessage?.id === message.id
                        ? 'bg-muted border-primary'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => message.role === 'assistant' && setSelectedMessage(message)}
                  >
                    <p className="text-sm">{message.content}</p>

                    {message.executionResult && (
                      <div className="mt-3 pt-3 border-t border-current/20 space-y-2 text-xs opacity-90">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Status: {message.executionResult.success ? '✓ Sucesso' : '✗ Erro'}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Tokens:</span> {message.executionResult.total_tokens}
                        </div>
                        <div>
                          <span className="font-semibold">Custo:</span> R$ {message.executionResult.total_cost.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-semibold">Tempo:</span> {message.executionResult.duration_ms}ms
                        </div>
                        
                        {/* 🧠 RAG Info */}
                        {message.ragDocuments && message.ragDocuments.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <BookOpen className="h-3 w-3" />
                            <span className="font-semibold">
                              Contexto: {message.ragDocuments.length} docs
                            </span>
                          </div>
                        )}

                        {message.executionResult.logs && message.executionResult.logs.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold mb-1">Skills:</p>
                            <div className="space-y-1">
                              {message.executionResult.logs.map((skill, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span>{skill.status === 'success' ? '✓' : '✗'} {skill.skill_id}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              ))
            )}

            {isExecuting && (
              <div className="flex gap-3 justify-start">
                <Card className="bg-muted p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Executando skills...</span>
                  </div>
                  {isRagLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BrainCircuit className="h-3 w-3" />
                      <span>Recuperando contexto Alexandria...</span>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-card p-4 space-y-2">
            {error && isReady && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error.message}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isReady || isSending || isExecuting}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!isReady || isSending || isExecuting || !inputValue.trim()}
                size="icon"
              >
                {isSending || isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {!isReady ? (
                  <span>Carregando...</span>
                ) : (
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Pronto
                  </span>
                )}
                
                {/* 🧠 RAG Status */}
                <Badge variant="outline" className="gap-1 text-xs">
                  <BrainCircuit className="h-3 w-3" />
                  Alexandria RAG
                </Badge>
              </div>
              
              {agentConfig?.skills && agentConfig.skills.length > 0 && (
                <div>
                  {agentConfig.skills.length} skill{agentConfig.skills.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🧠 Alexandria RAG Panel */}
        {showRagPanel && (
          <div className="w-80 border-l bg-muted/50 flex flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alexandria 📚</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Contexto recuperado para esta execução
              </p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {selectedMessage?.ragContext ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Contexto Injetado
                    </h4>
                    <div className="bg-card p-3 rounded-md text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {selectedMessage.ragContext}
                    </div>
                  </div>
                  
                  {selectedMessage.ragDocuments && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Documentos Usados</h4>
                      <div className="space-y-2">
                        {ragDocuments?.map((doc, idx) => (
                          <div key={idx} className="bg-card p-2 rounded-md text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {doc.document.type}
                              </Badge>
                              <span className="font-medium truncate">
                                {doc.document.title}
                              </span>
                            </div>
                            <div className="text-muted-foreground">
                              Relevância: {(doc.similarity * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Selecione uma mensagem para ver o contexto</p>
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AgentChatLayout;
