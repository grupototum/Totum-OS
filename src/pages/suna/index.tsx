/**
 * Suna — Agente Autônomo Kortix
 * Integração com kortix-ai/suna self-hosted
 * https://github.com/kortix-ai/suna
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot, Send, Plus, Trash2, RefreshCw, Loader2, CheckCircle2,
  AlertCircle, Terminal, Globe, FileCode, Cpu, Settings,
  ChevronRight, ExternalLink, MessageSquare, Play, StopCircle,
  Activity, HardDrive, Zap, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { SUNA_CONFIG } from '@/config/suna';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SunaThread {
  id: string;
  title?: string;
  created_at: string;
  status?: 'idle' | 'running' | 'done' | 'error';
  message_count?: number;
}

interface SunaMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  created_at: string;
  tool_name?: string;
}

interface HealthStatus {
  configured: boolean;
  online: boolean;
  version?: string;
  uptime?: number;
  agents?: number;
}

// ─── Capabilities shown on empty state ───────────────────────────────────────

const CAPABILITIES = [
  { icon: Globe,    title: 'Navegação Web',      desc: 'Acessa URLs, faz pesquisas e extrai dados de qualquer site' },
  { icon: Terminal, title: 'Execução de Código',  desc: 'Roda Python, bash e scripts em sandbox isolado Docker' },
  { icon: FileCode, title: 'Gestão de Arquivos',  desc: 'Cria, edita e organiza arquivos dentro do ambiente seguro' },
  { icon: Cpu,      title: '60+ Integrações',     desc: 'Feishu, Slack, APIs externas, bancos de dados e muito mais' },
];

const EXAMPLE_TASKS = [
  'Pesquise as 5 principais tendências de IA em abril de 2026 e faça um resumo',
  'Crie um script Python que analisa um CSV e gera um relatório com gráficos',
  'Busque informações sobre os concorrentes da Totum Digital e compare serviços',
  'Automatize o envio de relatório semanal com métricas do projeto',
];

// ─── API helper ───────────────────────────────────────────────────────────────

async function sunaCall(path: string, method = 'GET', body?: unknown) {
  const res = await fetch('/api/suna/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, method, body }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: SunaMessage }) {
  const isUser   = msg.role === 'user';
  const isTool   = msg.role === 'tool';

  if (isTool) {
    return (
      <div className="flex gap-2 items-start my-1">
        <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Terminal className="w-3 h-3 text-amber-400" />
        </div>
        <div className="flex-1 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
          <p className="text-[10px] font-mono text-amber-400 mb-1">{msg.tool_name ?? 'tool'}</p>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono overflow-auto max-h-48">
            {msg.content}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-end my-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
        isUser ? 'bg-primary/20' : 'bg-purple-500/20'
      }`}>
        {isUser
          ? <span className="text-xs">👤</span>
          : <Bot className="w-4 h-4 text-purple-400" />
        }
      </div>
      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-primary/10 text-foreground rounded-br-sm'
          : 'bg-card border border-border rounded-bl-sm'
      }`}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-1 text-right">
          {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ─── Thread sidebar item ──────────────────────────────────────────────────────

function ThreadItem({ thread, active, onClick, onDelete }: {
  thread: SunaThread;
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'
      }`}
    >
      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
      <span className="text-xs truncate flex-1">{thread.title || `Thread ${thread.id.slice(0, 8)}`}</span>
      {thread.status === 'running' && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3 text-destructive" />
      </button>
    </div>
  );
}

// ─── Config panel ─────────────────────────────────────────────────────────────

function ConfigPanel() {
  return (
    <div className="space-y-4 p-1">
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          Configuração da Instância
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Defina as variáveis de ambiente no Vercel:</p>
          <div className="bg-muted/50 rounded-lg p-3 font-mono space-y-1">
            <p><span className="text-purple-400">SUNA_URL</span>=https://suna.seu-dominio.com</p>
            <p><span className="text-purple-400">SUNA_API_KEY</span>=sua-api-key</p>
          </div>
        </div>
        <a
          href="https://github.com/kortix-ai/suna"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
        >
          <ExternalLink className="w-3 h-3" />
          Ver instruções de instalação
        </a>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          Instalação rápida
        </h3>
        <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs text-muted-foreground">
          <p className="text-green-400"># No seu servidor VPS:</p>
          <p>curl -fsSL https://kortix.com/install | bash</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Requer: Docker, Node.js 18+, Python 3.9+, Supabase, Redis.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SunaPage() {
  const [health, setHealth]         = useState<HealthStatus | null>(null);
  const [threads, setThreads]       = useState<SunaThread[]>([]);
  const [activeThread, setActiveThread] = useState<SunaThread | null>(null);
  const [messages, setMessages]     = useState<SunaMessage[]>([]);
  const [input, setInput]           = useState('');
  const [sending, setSending]       = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMsgs, setLoadingMsgs]       = useState(false);
  const [tab, setTab]               = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Health check ────────────────────────────────────────
  const checkHealth = useCallback(async () => {
    try {
      const data = await fetch('/api/suna/health').then(r => r.json());
      setHealth(data);
    } catch {
      setHealth({ configured: false, online: false });
    }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  // ── Load threads ─────────────────────────────────────────
  const loadThreads = useCallback(async () => {
    if (!health?.online) return;
    setLoadingThreads(true);
    try {
      const data = await sunaCall('/api/threads');
      setThreads(Array.isArray(data) ? data : data?.threads ?? []);
    } catch (err) {
      toast.error('Erro ao carregar threads: ' + (err as Error).message);
    } finally {
      setLoadingThreads(false);
    }
  }, [health?.online]);

  useEffect(() => { if (health?.online) loadThreads(); }, [health?.online, loadThreads]);

  // ── Load messages ────────────────────────────────────────
  useEffect(() => {
    if (!activeThread) return;
    setLoadingMsgs(true);
    sunaCall(`/api/threads/${activeThread.id}/messages`)
      .then(data => setMessages(Array.isArray(data) ? data : data?.messages ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [activeThread]);

  // ── Scroll to bottom ─────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Create thread ─────────────────────────────────────────
  const createThread = async () => {
    try {
      const thread = await sunaCall('/api/threads', 'POST', { title: 'Nova tarefa' });
      setThreads(prev => [thread, ...prev]);
      setActiveThread(thread);
      setMessages([]);
      toast.success('Nova thread criada');
    } catch (err) {
      toast.error('Erro: ' + (err as Error).message);
    }
  };

  // ── Delete thread ─────────────────────────────────────────
  const deleteThread = async (id: string) => {
    try {
      await sunaCall(`/api/threads/${id}`, 'DELETE');
      setThreads(prev => prev.filter(t => t.id !== id));
      if (activeThread?.id === id) { setActiveThread(null); setMessages([]); }
    } catch {
      toast.error('Erro ao deletar thread');
    }
  };

  // ── Send message ──────────────────────────────────────────
  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    // Se não tem thread, cria uma
    let thread = activeThread;
    if (!thread) {
      try {
        thread = await sunaCall('/api/threads', 'POST', { title: text.slice(0, 60) });
        setThreads(prev => [thread!, ...prev]);
        setActiveThread(thread);
      } catch (err) {
        toast.error('Erro ao criar thread: ' + (err as Error).message);
        return;
      }
    }

    const userMsg: SunaMessage = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // Envia mensagem
      await sunaCall(`/api/threads/${thread.id}/messages`, 'POST', { content: text, role: 'user' });
      // Dispara execução
      await sunaCall(`/api/threads/${thread.id}/run`, 'POST');
      // Reload messages após resposta
      setTimeout(async () => {
        const data = await sunaCall(`/api/threads/${thread!.id}/messages`);
        setMessages(Array.isArray(data) ? data : data?.messages ?? []);
        setSending(false);
      }, 2000);
    } catch (err) {
      toast.error('Erro ao enviar: ' + (err as Error).message);
      setSending(false);
    }
  };

  const isOnline  = health?.online;
  const isConfigured = health?.configured;

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Suna</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Agente Autônomo · Kortix AI</p>
            </div>
            {/* Status badge */}
            <Badge className={`text-xs border ml-2 ${
              health === null
                ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                : isOnline
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : isConfigured
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                health === null ? 'bg-zinc-400 animate-pulse' :
                isOnline ? 'bg-green-400 animate-pulse' :
                isConfigured ? 'bg-red-400' : 'bg-zinc-400'
              }`} />
              {health === null ? 'Verificando…' : isOnline ? 'Online' : isConfigured ? 'Offline' : 'Não configurado'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={checkHealth} className="h-8 w-8 p-0">
              <RefreshCw className="w-4 h-4" />
            </Button>
            {isOnline && (
              <Button size="sm" onClick={createThread} className="h-8 gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" />
                Nova Task
              </Button>
            )}
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 shrink-0">
            <TabsList className="h-8">
              <TabsTrigger value="chat" className="text-xs h-7">Chat</TabsTrigger>
              <TabsTrigger value="status" className="text-xs h-7">Status</TabsTrigger>
              <TabsTrigger value="config" className="text-xs h-7">Configurar</TabsTrigger>
            </TabsList>
          </div>

          {/* ── CHAT TAB ─────────────────────────────────── */}
          <TabsContent value="chat" className="flex-1 flex min-h-0 m-0 overflow-hidden">

            {/* Not configured */}
            {!isConfigured && health !== null && (
              <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-lg text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mx-auto">
                    <Bot className="w-10 h-10 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Conecte o Suna</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      O Suna é um agente autônomo open-source que pode navegar na web, executar código, gerenciar arquivos e se integrar com 60+ serviços — tudo dentro de um sandbox Docker seguro.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {CAPABILITIES.map(cap => (
                      <div key={cap.title} className="rounded-xl border border-border/50 bg-card/50 p-3 text-left">
                        <cap.icon className="w-4 h-4 text-purple-400 mb-2" />
                        <p className="text-xs font-medium">{cap.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{cap.desc}</p>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setTab('config')} className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar agora
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Configured — Chat UI */}
            {(isConfigured || health === null) && (
              <div className="flex-1 flex min-h-0">
                {/* Sidebar threads */}
                <div className="w-56 border-r border-border/50 flex flex-col shrink-0">
                  <div className="px-3 py-3 border-b border-border/30">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Threads</p>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-0.5">
                      {loadingThreads ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : threads.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground text-center py-6 px-2">
                          {isOnline ? 'Nenhuma thread. Crie uma tarefa!' : 'Suna offline'}
                        </p>
                      ) : (
                        threads.map(t => (
                          <ThreadItem
                            key={t.id}
                            thread={t}
                            active={activeThread?.id === t.id}
                            onClick={() => setActiveThread(t)}
                            onDelete={() => deleteThread(t.id)}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col min-h-0">
                  {!activeThread ? (
                    /* Empty state */
                    <div className="flex-1 flex items-center justify-center p-8">
                      <div className="max-w-md text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                          <Zap className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">O que você quer automatizar hoje?</p>
                          <p className="text-xs text-muted-foreground">Suna pode pesquisar, codificar, analisar dados e executar tarefas complexas de forma autônoma.</p>
                        </div>
                        <div className="space-y-2">
                          {EXAMPLE_TASKS.map(task => (
                            <button
                              key={task}
                              onClick={() => { setInput(task); }}
                              className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border/50 hover:border-purple-500/30 hover:bg-purple-500/5 transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <ChevronRight className="w-3 h-3 inline mr-1.5 text-purple-400" />
                              {task}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Messages */}
                      <ScrollArea className="flex-1 px-6 py-4">
                        {loadingMsgs ? (
                          <div className="flex items-center justify-center h-32">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground text-sm">
                            Envie uma mensagem para começar.
                          </div>
                        ) : (
                          <div className="space-y-1 pb-2">
                            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                            {sending && (
                              <div className="flex gap-2 items-end">
                                <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                                  <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>
                                    {[0, 1, 2].map(i => (
                                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" style={{ animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                  </motion.div>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  )}

                  {/* Input */}
                  <div className="px-4 pb-4 pt-2 border-t border-border/30 shrink-0">
                    {!isOnline && isConfigured && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Suna offline — verifique se a instância está rodando
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder={isOnline ? "Descreva a tarefa para o Suna executar…" : "Suna não conectado"}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                        disabled={!isOnline || sending}
                        rows={2}
                        className="flex-1 resize-none text-sm"
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={send}
                          disabled={!isOnline || !input.trim() || sending}
                          size="icon"
                          className="h-full bg-gradient-to-b from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                        >
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground/40 mt-1.5 text-center">
                      Enter para enviar · Shift+Enter para nova linha
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── STATUS TAB ───────────────────────────────── */}
          <TabsContent value="status" className="flex-1 overflow-auto m-0">
            <div className="p-6 space-y-4 max-w-2xl">
              {/* Health card */}
              <Card className={`border ${isOnline ? 'border-green-500/20 bg-green-500/5' : 'border-border/50'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Status da Instância Suna
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    {isOnline
                      ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                      : <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    }
                    <div>
                      <p className="text-sm font-medium">{isOnline ? 'Conectado e operacional' : isConfigured ? 'Instância offline' : 'Não configurado'}</p>
                      <p className="text-xs text-muted-foreground">
                        {SUNA_CONFIG.BASE_URL || 'URL não definida (SUNA_URL)'}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={checkHealth} className="ml-auto h-7 text-xs gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Verificar
                    </Button>
                  </div>

                  {isOnline && health && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {[
                        { label: 'Versão',   value: health.version  ?? '—', icon: Cpu },
                        { label: 'Uptime',   value: health.uptime   ? `${Math.floor(health.uptime / 3600)}h` : '—', icon: Activity },
                        { label: 'Agentes',  value: String(health.agents ?? '—'), icon: Bot },
                      ].map(item => (
                        <div key={item.label} className="rounded-lg bg-background/50 p-3 text-center">
                          <item.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                          <p className="text-lg font-bold">{item.value}</p>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Capabilities */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Capacidades do Agente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {CAPABILITIES.map(cap => (
                      <div key={cap.title} className="flex items-start gap-3 p-3 rounded-lg border border-border/40">
                        <cap.icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium">{cap.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{cap.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── CONFIG TAB ──────────────────────────────── */}
          <TabsContent value="config" className="flex-1 overflow-auto m-0">
            <div className="p-6 max-w-lg">
              <ConfigPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
