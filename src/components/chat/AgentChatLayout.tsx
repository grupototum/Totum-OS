import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, MessageSquare, Trash2, Menu, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { 
  sendMessageToAI, 
  streamMessageFromAI, 
  hasAIConfig, 
  getDefaultProvider,
  type AIMessage 
} from "@/services/aiService";

export interface AgentConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  description: string;
  systemPrompt?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// System prompt padrão para agentes
const getSystemPrompt = (agent: AgentConfig): string => {
  return agent.systemPrompt || `Você é ${agent.name}, ${agent.description}. 

Diretrizes:
- Seja prestativo, profissional e direto
- Responda em português do Brasil
- Se não souber algo, admita honestamente
- Mantenha respostas concisas mas completas
- Use formatação markdown quando apropriado`;
};

export default function AgentChatLayout({ agent }: { agent: AgentConfig }) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "default",
      title: "Nova conversa",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Olá! Sou o **${agent.name}**. ${agent.description}\n\nComo posso ajudar?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ]);
  const [activeConvoId, setActiveConvoId] = useState("default");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConvo = conversations.find((c) => c.id === activeConvoId)!;

  // Verifica se IA está configurada
  useEffect(() => {
    setAiEnabled(hasAIConfig());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo.messages.length, activeConvo.messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    // Adiciona mensagem do usuário
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConvoId) return c;
        const updated = { ...c, messages: [...c.messages, userMsg] };
        if (c.title === "Nova conversa" && text.length > 0) {
          updated.title = text.slice(0, 40) + (text.length > 40 ? "..." : "");
        }
        return updated;
      })
    );
    setInput("");
    setIsTyping(true);

    // Se IA não está configurada, mostra mensagem de fallback
    if (!aiEnabled) {
      const fallbackMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Recebi sua mensagem!\n\nPara ativar a IA, configure uma API key no arquivo ".env":\n\n\`\`\`\nVITE_KIMI_API_KEY=sua-chave-aqui\n# ou\nVITE_GROQ_API_KEY=sua-chave-aqui\n\`\`\`\n\nObtenha sua chave em:\n- **Kimi**: https://platform.moonshot.cn/\n- **Groq**: https://console.groq.com/`,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvoId
              ? { ...c, messages: [...c.messages, fallbackMsg] }
              : c
          )
        );
        setIsTyping(false);
      }, 500);
      return;
    }

    // Prepara mensagens para a API
    const currentMessages = activeConvo.messages;
    const apiMessages: AIMessage[] = [
      { role: "system", content: getSystemPrompt(agent) },
      ...currentMessages.map((m): AIMessage => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: text },
    ];

    // Cria mensagem de placeholder para streaming
    const assistantMsgId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? { ...c, messages: [...c.messages, assistantMsg] }
          : c
      )
    );

    // Chama a API de IA com streaming
    const provider = getDefaultProvider();
    let fullContent = "";

    const { error } = await streamMessageFromAI(
      apiMessages,
      (chunk) => {
        fullContent += chunk;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvoId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: fullContent }
                      : m
                  ),
                }
              : c
          )
        );
      },
      provider
    );

    // Atualiza mensagem final
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? { 
                      ...m, 
                      content: error 
                        ? `❌ **Erro:** ${error}\n\nVerifique sua API key e tente novamente.` 
                        : fullContent,
                      isStreaming: false 
                    }
                  : m
              ),
            }
          : c
      )
    );

    setIsTyping(false);
  }, [input, isTyping, activeConvoId, activeConvo.messages, agent, aiEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const newConvo = () => {
    const id = crypto.randomUUID();
    const convo: Conversation = {
      id,
      title: "Nova conversa",
      messages: [
        {
          id: "welcome-" + id,
          role: "assistant",
          content: `Olá! Como posso ajudar?`,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };
    setConversations((prev) => [convo, ...prev]);
    setActiveConvoId(id);
    setSidebarOpen(false);
  };

  const deleteConvo = (id: string) => {
    if (conversations.length <= 1) return;
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (activeConvoId === id) setActiveConvoId(filtered[0].id);
  };

  const Icon = agent.icon;

  return (
    <AppLayout>
    <div className="h-[calc(100vh)] flex overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={cn(
          "fixed lg:relative z-40 h-full w-72 border-r border-border bg-sidebar-background flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider">Conversas</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={newConvo}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((c) => (
              <motion.button
                key={c.id}
                layout
                onClick={() => { setActiveConvoId(c.id); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors group",
                  c.id === activeConvoId
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate flex-1">{c.title}</span>
                {conversations.length > 1 && (
                  <Trash2
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); deleteConvo(c.id); }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground text-xs"
            onClick={() => navigate("/hub")}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-2" />
            Voltar ao Hub
          </Button>
        </div>
      </motion.aside>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>

          <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", agent.gradient)}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-sm font-bold text-foreground">{agent.name}</h1>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                aiEnabled ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <span className="text-[10px] text-muted-foreground">
                {aiEnabled ? "IA Ativa" : "IA Não Configurada"}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {activeConvo.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? `bg-gradient-to-br ${agent.gradient} text-white`
                        : "bg-secondary text-foreground ring-1 ring-border"
                    )}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                        {line.startsWith("```") ? (
                          <pre className="bg-black/10 rounded p-2 mt-2 overflow-x-auto">
                            <code>{line.replace(/```/g, "")}</code>
                          </pre>
                        ) : line.match(/\*\*(.*?)\*\*/g) ? (
                          line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={j}>{part.slice(2, -2)}</strong>
                            ) : part.startsWith("- ") ? (
                              <span key={j} className="block ml-2">• {part.slice(2)}</span>
                            ) : part.startsWith("\u003e ") ? (
                              <span key={j} className="italic opacity-70">{part.slice(2)}</span>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}
                    <span className="block mt-2 text-[10px] opacity-50">
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {/* Indicador de digitando */}
              {isTyping && !activeConvo.messages.find(m => m.isStreaming) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary text-foreground ring-1 ring-border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Digitando...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-border p-4 shrink-0"
        >
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={aiEnabled 
                ? `Mensagem para ${agent.name}...` 
                : "Configure uma API key para ativar a IA..."
              }
              className="min-h-[44px] max-h-32 resize-none bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
              rows={1}
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn("h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br", agent.gradient, "hover:opacity-90 disabled:opacity-30")}
              size="icon"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
            {aiEnabled 
              ? `${agent.name} · IA Ativa · Totum Apps` 
              : "Configure VITE_KIMI_API_KEY ou VITE_GROQ_API_KEY no .env"
            }
          </p>
        </motion.div>
      </div>
    </div>
    </AppLayout>
  );
}
