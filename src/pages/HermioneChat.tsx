import { useState, useRef, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import {
  Send, BookOpen, User, Sparkles, History, X, Loader2, RotateCcw,
  Plus, Zap, Database, Search, Upload, Github, CheckCircle2,
  AlertCircle, FileText, FolderInput, Download, FileJson, Wand2, Library,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { searchHermione, HermioneChunk, logQuery } from '@/services/hermione';
import { askGeminiAsHermione, isGeminiConfigured, GEMINI_MODELS } from '@/services/gemini';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import {
  ingestBatch,
  ingestGithubRepo,
  type IngestProgress,
  type IngestResult,
} from '@/services/alexandriaIngestion';
import {
  assimilatePreview,
  downloadAssimilationReport,
  downloadArtifact,
  searchArtifacts,
  simulateAssimilation,
  type HermioneAssimilationPreview,
  type HermioneArtifact,
  type HermioneSource,
  type HermioneSourceAnalysis,
  type HermioneSourceInput,
} from '@/services/hermioneArtifacts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: HermioneChunk[];
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

export default function HermioneChat() {
  const pageTransition = usePageTransition();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Eu sou a **Hermione**, Cientista da Informação e Guardiã do Conhecimento da Totum.\n\nPosso ajudar você a:\n• 🔍 Buscar conhecimento na Alexandria\n• 📚 Encontrar documentação\n• 🔗 Conectar informações relacionadas\n• 📖 Responder perguntas baseadas no nosso banco de dados\n\nO que gostaria de saber?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_MODELS.FLASH);
  const [geminiError, setGeminiError] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Arquitetura do projeto', date: new Date(Date.now() - 86400000), messageCount: 12 },
    { id: '2', title: 'POP de deploy', date: new Date(Date.now() - 172800000), messageCount: 8 },
    { id: '3', title: 'Configuração SSL', date: new Date(Date.now() - 259200000), messageCount: 5 },
  ]);

  const suggestedQuestions = [
    'Qual o POP de deploy?',
    'Como funciona a arquitetura?',
    'Quem são os agentes da Totum?',
    'Explique a estrutura do projeto',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setSessionDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: loadingId, role: 'assistant', content: '', timestamp: new Date(), isLoading: true }]);

    try {
      if (!isGeminiConfigured()) {
        setGeminiError('API key do Gemini não configurada. Adicione VITE_GEMINI_API_KEY no .env');
        setMessages(prev => prev.filter(m => m.id !== loadingId));
        setIsLoading(false);
        return;
      }

      const contextResults = await searchHermione(userMessage.content, { limit: 5 });

      const conversationHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' as const : 'user' as const,
          text: m.content
        }));

      const geminiResponse = await askGeminiAsHermione(
        userMessage.content,
        contextResults.map(r => ({ content: r.content, dominio: r.dominio, categoria: r.categoria })),
        conversationHistory
      );

      if (geminiResponse.error) setGeminiError(geminiResponse.error);
      await logQuery(userMessage.content, 'user', contextResults);

      setMessages(prev =>
        prev
          .filter(m => m.id !== loadingId)
          .concat({
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: geminiResponse.text || 'Desculpe, não consegui processar sua pergunta no momento.',
            timestamp: new Date(),
            context: contextResults
          })
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar na Alexandria';
      setMessages(prev =>
        prev
          .filter(m => m.id !== loadingId)
          .concat({ id: (Date.now() + 2).toString(), role: 'assistant', content: msg, timestamp: new Date() })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Chat limpo. Como posso ajudar?',
      timestamp: new Date()
    }]);
    setSessionDuration(0);
  };

  const messageCount = messages.filter(m => m.role !== 'assistant' || m.id !== 'welcome').length;

  // ─── Ingestion State ────────────────────────────────────────────────────────
  const [showIngest, setShowIngest] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState<IngestProgress[]>([]);
  const [ingestResult, setIngestResult] = useState<IngestResult | null>(null);
  const [uploadedSources, setUploadedSources] = useState<HermioneSource[]>([]);
  const [sourceAnalyses, setSourceAnalyses] = useState<HermioneSourceAnalysis[]>([]);
  const [assimilationPreview, setAssimilationPreview] = useState<HermioneAssimilationPreview | null>(null);
  const [generatedArtifact, setGeneratedArtifact] = useState<HermioneArtifact | null>(null);
  const [recentArtifacts, setRecentArtifacts] = useState<HermioneArtifact[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const refreshArtifacts = useCallback(async () => {
    const artifacts = await searchArtifacts('', 6);
    setRecentArtifacts(artifacts);
  }, []);

  useEffect(() => {
    refreshArtifacts();
  }, [refreshArtifacts]);

  const handleIngestProgress = useCallback((progress: IngestProgress) => {
    setIngestProgress(prev => {
      const idx = prev.findIndex(p => p.fileName === progress.fileName);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = progress;
        return next;
      }
      return [...prev, progress];
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      /\.(md|markdown|txt|json)$/i.test(file.name)
    );
    if (!files.length) return;
    setIsIngesting(true);
    setIngestProgress([]);
    setIngestResult(null);
    setGeneratedArtifact(null);
    setSourceAnalyses([]);
    setAssimilationPreview(null);

    const parsed: HermioneSourceInput[] = await Promise.all(
      files.map(f => f.text().then(content => ({
        name: f.webkitRelativePath || f.name,
        content,
      })))
    );

    try {
      const preview = await simulateAssimilation(parsed);
      setAssimilationPreview(preview);
      setSourceAnalyses(preview.analyses);

      setMessages(prev => prev.concat({
        id: (Date.now() + 3).toString(),
        role: 'assistant',
        content: `Simulei a assimilação de **${preview.files.length} arquivo${preview.files.length === 1 ? '' : 's'}**.\n\nPermitidos: **${preview.allowedFiles.length}**\nBloqueados: **${preview.blockedFiles.length}**\nDuplicatas exatas: **${preview.exactDuplicates.length}**\nDuplicatas próximas: **${preview.nearDuplicates.length}**\nConflitos: **${preview.conflicts.length}**\n\nStatus recomendado: **${preview.recommendedStatus}**. Revise o relatório no painel lateral e confirme para assimilar na Alexandria.`,
        timestamp: new Date(),
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao analisar os documentos';
      setIngestResult({ succeeded: 0, failed: files.length, totalChunks: 0, documents: [], errors: [msg] });
    } finally {
      setIsIngesting(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAssimilatePreview = async () => {
    if (!assimilationPreview) return;
    setIsIngesting(true);
    setIngestProgress([]);
    setIngestResult(null);
    setGeneratedArtifact(null);

    try {
      const { sources, artifact } = await assimilatePreview(assimilationPreview);
      setUploadedSources(sources);
      setGeneratedArtifact(artifact);

      const result = await ingestBatch(
        assimilationPreview.allowedFiles.map(({ name, content }) => ({ name, content })),
        handleIngestProgress
      );
      setIngestResult(result);
      await refreshArtifacts();

      setMessages(prev => prev.concat({
        id: (Date.now() + 4).toString(),
        role: 'assistant',
        content: `Assimilei o pacote na Alexandria e gerei **${artifact.title}**.\n\nTipo: **${artifact.artifact_type}**\nStatus: **${artifact.status}**\nFontes salvas: **${sources.length}**\nChunks criados: **${result.totalChunks}**\n\nO relatório de assimilação ficou anexado ao artefato e pode ser baixado no painel.`,
        timestamp: new Date(),
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao assimilar os documentos';
      setIngestResult({ succeeded: 0, failed: assimilationPreview.allowedFiles.length, totalChunks: 0, documents: [], errors: [msg] });
    } finally {
      setIsIngesting(false);
    }
  };

  const openFolderPicker = () => {
    const input = folderInputRef.current;
    if (!input) return;

    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.click();
  };

  const handleGithubIngest = async () => {
    if (!githubUrl.trim()) return;
    setIsIngesting(true);
    setIngestProgress([]);
    setIngestResult(null);
    try {
      const result = await ingestGithubRepo(githubUrl.trim(), handleIngestProgress);
      setIngestResult(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao buscar repositório';
      setIngestResult({ succeeded: 0, failed: 1, totalChunks: 0, documents: [], errors: [msg] });
    }
    setIsIngesting(false);
  };

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">Hermione</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Guardiã do Conhecimento · Alexandria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIngest(!showIngest)}
              className={showIngest ? 'border-amber-500/50 text-amber-400' : ''}
            >
              <FolderInput className="w-4 h-4 mr-2" />
              Catalogar
            </Button>
            <Button variant="outline" size="sm" onClick={clearChat}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              Online
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">

          {/* ─── Chat Area (col-span-3) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 flex flex-col"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col flex-1">
              {/* Terminal header bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  hermione — alexandria — {formatDuration(sessionDuration)}
                </span>
                {/* History toggle */}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>

              {/* History panel (inline, desliza) */}
              {showHistory && (
                <div className="border-b border-border bg-card/80">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Histórico</span>
                    <button onClick={() => setShowHistory(false)}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                  <div className="px-3 pb-3 flex gap-2 overflow-x-auto">
                    {sessions.map(session => (
                      <button
                        key={session.id}
                        className="shrink-0 text-left p-2 rounded-lg bg-muted hover:bg-accent border border-border text-xs"
                      >
                        <p className="text-foreground font-medium">{session.title}</p>
                        <p className="text-muted-foreground">{session.messageCount} msgs</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {geminiError && (
                <div className="mx-4 mt-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-destructive text-xs">⚠️ {geminiError}</p>
                </div>
              )}

              {/* Messages */}
              <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {/* Sugestões iniciais */}
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {suggestedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setInputMessage(q)}
                          className="text-xs bg-muted hover:bg-accent text-muted-foreground px-3 py-1.5 rounded-full border border-border transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen className="w-3 h-3 text-amber-500" />
                        </div>
                      )}

                      <div className="max-w-[80%]">
                        <div className={`rounded-xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary border border-border text-foreground'
                        }`}>
                          {message.isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.1s]" />
                              <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                            </div>
                          ) : (
                            <>
                              {message.role === 'assistant'
                                ? <MarkdownRenderer content={message.content} />
                                : <div className="text-sm">{message.content}</div>
                              }
                              {message.context && message.context.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Fontes</p>
                                  <div className="space-y-1">
                                    {message.context.slice(0, 3).map((ctx, idx) => (
                                      <div key={idx} className="text-xs text-muted-foreground bg-muted/50 p-1.5 rounded">
                                        <span className="text-amber-400">{ctx.dominio}</span>
                                        {' '}→ {ctx.content.substring(0, 60)}…
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-secondary/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Pergunte algo à Alexandria..."
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 font-mono"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Hermione consulta a Alexandria em tempo real · Powered by Gemini
                </p>
              </div>
            </div>
          </motion.div>

          {/* ─── Right Panel ─── */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Status */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">STATUS</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-foreground">Alexandria conectada</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Modelo</span>
                  <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    className="bg-muted text-foreground text-[11px] px-2 py-1 rounded border border-border focus:outline-none focus:border-primary font-mono"
                  >
                    <option value={GEMINI_MODELS.FLASH_LITE}>Flash Lite</option>
                    <option value={GEMINI_MODELS.FLASH}>Flash</option>
                    <option value={GEMINI_MODELS.PRO}>Pro</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fonte</span>
                  <span className="text-foreground font-mono text-[11px]">Alexandria RAG</span>
                </div>
              </div>
            </div>

            {/* Quick Actions — perguntas sugeridas */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">ATALHOS</p>
              <div className="space-y-1.5">
                {[
                  { icon: Search, label: 'Buscar POP', command: 'Qual o POP de deploy?' },
                  { icon: Database, label: 'Arquitetura', command: 'Como funciona a arquitetura?' },
                  { icon: Zap, label: 'Agentes', command: 'Quem são os agentes da Totum?' },
                  { icon: BookOpen, label: 'Documentação', command: 'Onde está documentado o SSL?' },
                  { icon: Sparkles, label: 'Skills', command: 'Quais skills estão disponíveis?' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => setInputMessage(action.command)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Code Analyzer link */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <Link to="/ada">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs">Code Analyzer</span>
                    <Badge variant="secondary" className="ml-auto text-[9px] bg-purple-500/20 text-purple-400">ADA</Badge>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Session */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">SESSÃO</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="text-foreground font-mono">{formatDuration(sessionDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mensagens</span>
                  <span className="text-foreground font-mono">{messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contextos</span>
                  <span className="text-foreground font-mono">
                    {messages.reduce((acc, m) => acc + (m.context?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Artifact Library */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ARTEFATOS
                </p>
                <Library className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              {recentArtifacts.length === 0 ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Envie MDs ou textos para a Hermione criar skills, POPs, prompts e documentos baixáveis.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentArtifacts.map(artifact => (
                    <div key={artifact.id} className="rounded-lg border border-border bg-secondary/30 p-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground">{artifact.title}</p>
                          <div className="mt-1 flex items-center gap-1">
                            <Badge variant="outline" className="h-5 px-1.5 text-[9px]">
                              {artifact.artifact_type}
                            </Badge>
                            <Badge variant="secondary" className="h-5 px-1.5 text-[9px]">
                              v{artifact.version}
                            </Badge>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadArtifact(artifact)}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                          title="Baixar Markdown"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Chat */}
            <Button variant="outline" className="w-full" onClick={clearChat}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Chat
            </Button>

            {/* ── Ingestion Panel ── */}
            <AnimatePresence>
              {showIngest && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
                      📥 Catalogar na Alexandria
                    </p>
                    <button onClick={() => setShowIngest(false)}>
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>

                  {/* File Upload */}
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-2">Arquivos ou pasta</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.markdown,.txt,.json"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <input
                      ref={folderInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed justify-start gap-2 text-xs"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isIngesting}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Simular arquivos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full border-dashed justify-start gap-2 text-xs"
                      onClick={openFolderPicker}
                      disabled={isIngesting}
                    >
                      <FolderInput className="w-3.5 h-3.5" />
                      Simular pasta
                    </Button>
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-2">Repositório GitHub</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://github.com/owner/repo"
                        value={githubUrl}
                        onChange={e => setGithubUrl(e.target.value)}
                        className="text-xs font-mono h-8"
                        disabled={isIngesting}
                        onKeyDown={e => e.key === 'Enter' && handleGithubIngest()}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleGithubIngest}
                        disabled={isIngesting || !githubUrl.trim()}
                        className="h-8 px-2 shrink-0"
                      >
                        {isIngesting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Github className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Progress */}
                  {ingestProgress.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Progresso</p>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {ingestProgress.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            {p.status === 'processing' && (
                              <Loader2 className="w-3 h-3 animate-spin text-amber-400 shrink-0" />
                            )}
                            {p.status === 'done' && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            )}
                            {p.status === 'error' && (
                              <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
                            )}
                            <span className={`truncate ${p.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {p.fileName}
                            </span>
                            {p.chunksCreated !== undefined && (
                              <span className="ml-auto text-emerald-500 shrink-0">{p.chunksCreated}✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Result */}
                  {ingestResult && !isIngesting && (
                    <div className={`rounded-lg p-3 text-xs space-y-1 ${
                      ingestResult.failed === 0
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <p className="font-semibold text-foreground">
                        {ingestResult.failed === 0 ? '✅ Ingestão concluída!' : '⚠️ Concluído com erros'}
                      </p>
                      <p className="text-muted-foreground">
                        📚 {ingestResult.succeeded} documento{ingestResult.succeeded !== 1 ? 's' : ''} catalogado{ingestResult.succeeded !== 1 ? 's' : ''}
                      </p>
                      <p className="text-muted-foreground">
                        🔗 {ingestResult.totalChunks} chunks criados na Alexandria
                      </p>
                      {ingestResult.errors.length > 0 && (
                        <p className="text-destructive">{ingestResult.errors[0]}</p>
                      )}
                    </div>
                  )}

                  {/* Assimilation Preview */}
                  {assimilationPreview && !generatedArtifact && (
                    <div className="rounded-lg border border-amber-500/20 bg-card/80 p-3 text-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-3.5 w-3.5 text-amber-400" />
                        <p className="font-semibold text-foreground">Simulação de assimilação</p>
                        <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[9px]">
                          {assimilationPreview.recommendedStatus}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-md bg-secondary/40 p-2">
                          <p className="text-[10px] text-muted-foreground">Permitidos</p>
                          <p className="font-mono text-sm text-foreground">{assimilationPreview.allowedFiles.length}</p>
                        </div>
                        <div className="rounded-md bg-secondary/40 p-2">
                          <p className="text-[10px] text-muted-foreground">Duplicatas</p>
                          <p className="font-mono text-sm text-foreground">
                            {assimilationPreview.exactDuplicates.length + assimilationPreview.nearDuplicates.length}
                          </p>
                        </div>
                        <div className="rounded-md bg-secondary/40 p-2">
                          <p className="text-[10px] text-muted-foreground">Conflitos</p>
                          <p className="font-mono text-sm text-foreground">{assimilationPreview.conflicts.length}</p>
                        </div>
                      </div>

                      {assimilationPreview.blockedFiles.length > 0 && (
                        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2 text-destructive">
                          {assimilationPreview.blockedFiles.length} arquivo(s) bloqueado(s) por privacidade.
                        </div>
                      )}

                      {assimilationPreview.conflicts.slice(0, 2).map(conflict => (
                        <div key={conflict.topic} className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-2">
                          <p className="font-medium text-foreground">{conflict.topic}</p>
                          <p className="mt-1 text-muted-foreground">{conflict.recommendation}</p>
                        </div>
                      ))}

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-2 text-xs"
                          onClick={() => downloadAssimilationReport(assimilationPreview, 'markdown')}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Relatório MD
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-2 text-xs"
                          onClick={() => downloadAssimilationReport(assimilationPreview, 'json')}
                        >
                          <FileJson className="h-3.5 w-3.5" />
                          Relatório JSON
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        className="w-full gap-2 text-xs"
                        onClick={handleAssimilatePreview}
                        disabled={isIngesting || !assimilationPreview.allowedFiles.length}
                      >
                        {isIngesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        Assimilar na Alexandria
                      </Button>
                    </div>
                  )}

                  {/* Consultative Analysis */}
                  {sourceAnalyses.length > 0 && (
                    <div className="rounded-lg border border-border bg-card/70 p-3 text-xs">
                      <div className="mb-2 flex items-center gap-2">
                        <Wand2 className="h-3.5 w-3.5 text-amber-400" />
                        <p className="font-semibold text-foreground">Análise consultiva</p>
                      </div>
                      <div className="space-y-2">
                        {sourceAnalyses.slice(0, 4).map(analysis => (
                          <div key={analysis.name} className="rounded-md bg-secondary/40 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium text-foreground">{analysis.name}</span>
                              <Badge variant="outline" className="h-5 px-1.5 text-[9px]">
                                {analysis.recommendedOutput}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-muted-foreground">
                              {analysis.keyIdeas[0] || analysis.gaps[0] || 'Conteúdo assimilado e pronto para consolidação.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generated artifact */}
                  {generatedArtifact && (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs">
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <p className="font-semibold text-foreground">Artefato criado</p>
                      </div>
                      <p className="font-medium text-foreground">{generatedArtifact.title}</p>
                      <p className="mt-1 text-muted-foreground">{generatedArtifact.summary}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-2 text-xs"
                          onClick={() => downloadArtifact(generatedArtifact, 'markdown')}
                        >
                          <Download className="h-3.5 w-3.5" />
                          MD
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-2 text-xs"
                          onClick={() => downloadArtifact(generatedArtifact, 'json')}
                        >
                          <FileJson className="h-3.5 w-3.5" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
