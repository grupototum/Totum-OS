// src/components/chat/AgentChatLayout.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  BrainCircuit,
  Circle,
  Smile,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
} from "@/components/ui/emoji-picker";

// ─── Prompt Chips ────────────────────────────────────────────────────────────

const PROMPT_CHIPS: Record<string, string[]> = {
  radar:     ['Análise competitiva', 'Radar de mercado', 'Tendências do setor', 'Benchmark de concorrentes'],
  gestor:    ['Relatório semanal', 'KPIs do mês', 'Análise de performance', 'Meta vs realizado'],
  social:    ['Criar post LinkedIn', 'Calendário editorial', 'Campanha de engajamento', 'Copy para anúncio'],
  atendente: ['Responder reclamação', 'Escalada de suporte', 'FAQ automático', 'Tom empático'],
  sdr:       ['Qualificar lead', 'Script de abordagem', 'Follow-up de proposta', 'Objeções comuns'],
  kimi:      ['Resumir documento', 'Extrair pontos-chave', 'Análise SWOT', 'Comparar versões'],
};
const DEFAULT_CHIPS = ['Fazer análise', 'Gerar relatório', 'Resumir em tópicos', 'Responder dúvida'];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  executionResult?: ExecutionResult;
  ragContext?: string;
  ragDocuments?: string[];
}

type StepStatus = 'waiting' | 'running' | 'done';
interface ExecStep {
  label: string;
  status: StepStatus;
}

const INITIAL_STEPS: Omit<ExecStep, 'status'>[] = [
  { label: 'Recuperando contexto...' },
  { label: 'Executando skills...' },
  { label: 'Gerando resposta...' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const AgentChatLayout: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showRagPanel, setShowRagPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Step-progress timeline
  const [execSteps, setExecSteps] = useState<ExecStep[]>([]);
  const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Streaming typing animation
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const streamingCursorRef = useRef(0);
  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    enableRAG: true,
    onSuccess: (result) => {
      console.log('Execução com sucesso:', result);
    },
    onError: (error) => {
      console.error('Erro na execução:', error);
    },
  });

  useEffect(() => {
    if (agentId) {
      loadAgentConfig();
    }
  }, [agentId, loadAgentConfig]);

  // ── Step-progress timeline effect ──────────────────────────────────────────
  useEffect(() => {
    // Clear any pending timers
    stepTimersRef.current.forEach(clearTimeout);
    stepTimersRef.current = [];

    if (isExecuting) {
      // Initialise all steps as waiting then kick off the first one immediately
      setExecSteps([
        { label: INITIAL_STEPS[0].label, status: 'running' },
        { label: INITIAL_STEPS[1].label, status: 'waiting' },
        { label: INITIAL_STEPS[2].label, status: 'waiting' },
      ]);

      const t1 = setTimeout(() => {
        setExecSteps([
          { label: INITIAL_STEPS[0].label, status: 'done' },
          { label: INITIAL_STEPS[1].label, status: 'running' },
          { label: INITIAL_STEPS[2].label, status: 'waiting' },
        ]);
      }, 1200);

      const t2 = setTimeout(() => {
        setExecSteps([
          { label: INITIAL_STEPS[0].label, status: 'done' },
          { label: INITIAL_STEPS[1].label, status: 'done' },
          { label: INITIAL_STEPS[2].label, status: 'running' },
        ]);
      }, 2500);

      stepTimersRef.current = [t1, t2];
    } else if (execSteps.length > 0) {
      // Mark all done and clear after 600 ms
      setExecSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })));
      const t = setTimeout(() => setExecSteps([]), 600);
      stepTimersRef.current = [t];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExecuting]);

  // ── Streaming typing animation effect ──────────────────────────────────────
  useEffect(() => {
    if (!streamingMsgId) return;

    streamingCursorRef.current = 0;

    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }

    streamingIntervalRef.current = setInterval(() => {
      streamingCursorRef.current += 4;
      const cursor = streamingCursorRef.current;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingMsgId
            ? { ...m, content: streamingText.slice(0, cursor) }
            : m
        )
      );

      if (cursor >= streamingText.length) {
        clearInterval(streamingIntervalRef.current!);
        streamingIntervalRef.current = null;
        setStreamingMsgId(null);
      }
    }, 16);

    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
    };
  }, [streamingMsgId, streamingText]);

  // ── Send message ──────────────────────────────────────────────────────────
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
        const res = result.result;
        let fullContent = '';
        if (typeof res === 'string') {
          fullContent = res;
        } else if (res?.text) {
          fullContent = res.text;
        } else if (res?.message) {
          fullContent = res.message;
        } else if (res?.output) {
          fullContent = Array.isArray(res.output)
            ? res.output
                .map((o: any) => (typeof o === 'string' ? o : JSON.stringify(o, null, 2)))
                .join('\n\n')
            : typeof res.output === 'string'
            ? res.output
            : JSON.stringify(res.output, null, 2);
        } else if (res) {
          fullContent = '```json\n' + JSON.stringify(res, null, 2) + '\n```';
        } else {
          fullContent = result.success
            ? `Execução concluída em ${result.duration_ms}ms`
            : 'Não foi possível obter uma resposta.';
        }

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '', // start empty — will be filled by streaming effect
          timestamp: new Date(),
          executionResult: result,
          ragContext: ragContext,
          ragDocuments: ragDocuments?.map((d) => d.document.id),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSelectedMessage(assistantMessage);

        // Kick off streaming animation
        setStreamingText(fullContent);
        setStreamingMsgId(assistantMessage.id);
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

  // ── Step icon helper ──────────────────────────────────────────────────────
  const StepIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
    if (status === 'done') return <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
    if (status === 'running') return <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />;
    return <Circle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />;
  };

  // ── Chips for the current agent ───────────────────────────────────────────
  const chips = (agentId && PROMPT_CHIPS[agentId]) ? PROMPT_CHIPS[agentId] : DEFAULT_CHIPS;

  // ─────────────────────────────────────────────────────────────────────────
  // Loading / error screens
  // ─────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────
  // Main render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
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
                {showRagPanel ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
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
              messages.map((message) => {
                const isStreaming = message.id === streamingMsgId;
                const displayContent = isStreaming ? message.content : message.content;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <Card
                      className={`max-w-[70%] p-4 cursor-pointer transition-colors ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : selectedMessage?.id === message.id
                          ? 'bg-muted border-primary'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => message.role === 'assistant' && setSelectedMessage(message)}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm">
                          <MarkdownRenderer content={displayContent} className="text-sm" />
                          {isStreaming && (
                            <span className="inline-block w-[2px] h-[1em] bg-current animate-pulse ml-0.5 align-middle">
                              ▋
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}

                      {message.executionResult && (
                        <div className="mt-3 pt-3 border-t border-current/20 space-y-2 text-xs opacity-90">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              Status: {message.executionResult.success ? '✓ Sucesso' : '✗ Erro'}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Tokens:</span>{' '}
                            {message.executionResult.total_tokens}
                          </div>
                          <div>
                            <span className="font-semibold">Custo:</span> R${' '}
                            {message.executionResult.total_cost.toFixed(2)}
                          </div>
                          <div>
                            <span className="font-semibold">Tempo:</span>{' '}
                            {message.executionResult.duration_ms}ms
                          </div>

                          {message.ragDocuments && message.ragDocuments.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <BookOpen className="h-3 w-3" />
                              <span className="font-semibold">
                                Contexto: {message.ragDocuments.length} docs
                              </span>
                            </div>
                          )}

                          {message.executionResult.logs &&
                            message.executionResult.logs.length > 0 && (
                              <div className="mt-2">
                                <p className="font-semibold mb-1">Skills:</p>
                                <div className="space-y-1">
                                  {message.executionResult.logs.map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <span>
                                        {skill.status === 'success' ? '✓' : '✗'} {skill.skill_id}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })
            )}

            {/* Step-progress timeline (replaces plain spinner) */}
            {isExecuting && execSteps.length > 0 && (
              <div className="flex gap-3 justify-start">
                <Card className="bg-muted p-4 space-y-3">
                  {execSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <StepIcon status={step.status} />
                      <span
                        className={
                          step.status === 'waiting'
                            ? 'text-muted-foreground'
                            : step.status === 'running'
                            ? 'text-foreground'
                            : 'text-muted-foreground line-through'
                        }
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                  {isRagLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-current/10">
                      <BrainCircuit className="h-3 w-3" />
                      <span>Recuperando contexto Alexandria...</span>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t bg-card p-4 space-y-2">
            {error && isReady && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error.message}</span>
              </div>
            )}

            {/* Prompt Chips — only visible in empty state */}
            {messages.length === 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setInputValue(chip)}
                    className="px-3 py-1.5 text-xs bg-secondary border border-border rounded-full text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="relative flex-1">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!isReady || isSending || isExecuting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Emoji picker"
                >
                  <Smile className="h-4 w-4" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-50">
                    <EmojiPicker
                      className="h-[326px] rounded-lg border shadow-md bg-popover"
                      onEmojiSelect={({ emoji }) => {
                        setInputValue((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      <EmojiPickerSearch />
                      <EmojiPickerContent />
                    </EmojiPicker>
                  </div>
                )}
              </div>
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

                <Badge variant="outline" className="gap-1 text-xs">
                  <BrainCircuit className="h-3 w-3" />
                  Alexandria RAG
                </Badge>
              </div>

              {agentConfig?.skills && agentConfig.skills.length > 0 && (
                <div>
                  {agentConfig.skills.length} skill
                  {agentConfig.skills.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alexandria RAG Panel */}
        {showRagPanel && (
          <div className="w-80 border-l bg-muted/50 flex flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alexandria</h3>
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
                              <span className="font-medium truncate">{doc.document.title}</span>
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
