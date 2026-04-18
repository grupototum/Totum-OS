import AppLayout from "@/components/layout/AppLayout";
import { Terminal, Cpu, Zap, Clock, FolderOpen, GitBranch, Sparkles, Send, RotateCcw, StopCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { sendMessageToAI, hasAIConfig } from "@/services/aiService";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function ClaudeCode() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: "Claude Code ready. Describe what you want to build or ask for help with your code.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    try {
      if (!hasAIConfig()) {
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== loadingId)
            .concat({
              id: Date.now().toString(),
              role: "assistant",
              content: "Configure uma API key (Kimi, Groq ou OpenAI) nas variáveis de ambiente para usar o Claude Code com IA real.",
              timestamp: new Date(),
            })
        );
        return;
      }

      const aiMessages = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
        .concat({ role: "user" as const, content: input });

      const response = await sendMessageToAI(aiMessages);

      if (response.error) {
        throw new Error(response.error);
      }

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: Date.now().toString(),
            role: "assistant",
            content: response.content || "Sem resposta da IA.",
            timestamp: new Date(),
          })
      );
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "system",
        content: "Chat limpo. Como posso ajudar?",
        timestamp: new Date(),
      },
    ]);
    setSessionDuration(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const messageCount = messages.filter((m) => m.role !== "system").length;

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">
                CLAUDE CODE
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                AI-Powered Development Environment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          {/* Terminal area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 flex flex-col"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col flex-1">
              {/* Terminal header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  claude-code — totum-workspace — {formatDuration(sessionDuration)}
                </span>
              </div>

              {/* Messages area */}
              <ScrollArea ref={scrollRef} className="flex-1 p-4">
                <div className="space-y-4 font-mono text-sm">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Terminal className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.role === "system"
                            ? "bg-secondary/50 text-muted-foreground italic"
                            : "bg-secondary border border-border"
                        }`}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.1s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] text-emerald-500">Você</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="p-4 border-t border-border bg-secondary/20">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem ou comando... (Enter para enviar)"
                    className="flex-1 font-mono"
                    disabled={isLoading}
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                    {isLoading ? (
                      <StopCircle className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Dica: Use /help para ver comandos disponíveis. Conectado ao Stark API (porta 3000).
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Status */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[10px] text-muted-foreground mb-3">STATUS</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-foreground">Connected</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Model</span>
                  <span className="text-foreground font-mono text-[11px]">Sonnet 4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Context</span>
                  <span className="text-foreground font-mono text-[11px]">200k tokens</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">API</span>
                  <span className="text-foreground font-mono text-[11px]">Stark API</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[10px] text-muted-foreground mb-3">QUICK ACTIONS</p>
              <div className="space-y-1.5">
                {[
                  { icon: FolderOpen, label: "Open Project", command: "Abrir projeto atual" },
                  { icon: GitBranch, label: "Git Status", command: "git status" },
                  { icon: Cpu, label: "Run Tests", command: "test" },
                  { icon: Zap, label: "Deploy", command: "deploy" },
                  { icon: Clock, label: "System Status", command: "status" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setInput(action.command);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
              
              {/* ADA Link */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <Link to="/ada">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span className="text-xs">Open ADA</span>
                    <Badge variant="secondary" className="ml-auto text-[9px] bg-purple-500/20 text-purple-400">Code Analyzer</Badge>
                  </Button>
                </Link>
                <p className="mt-1.5 text-[10px] text-muted-foreground/60 text-center">
                  Powered by Codeflow · Save up to 87% tokens
                </p>
              </div>
            </div>

            {/* Session info */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[10px] text-muted-foreground mb-3">SESSION</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-mono">{formatDuration(sessionDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="text-foreground font-mono">{messageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Files</span>
                  <span className="text-foreground font-mono">0</span>
                </div>
              </div>
            </div>

            {/* New Chat Button */}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={clearChat}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Chat
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
