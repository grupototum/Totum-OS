import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, MessageSquare, Trash2, Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

export interface AgentConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  description: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConvo = conversations.find((c) => c.id === activeConvoId)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo.messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const botMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Recebi sua mensagem. A integração com IA será conectada em breve.\n\n> "${text.slice(0, 80)}${text.length > 80 ? "..." : ""}"`,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConvoId) return c;
        const updated = { ...c, messages: [...c.messages, userMsg, botMsg] };
        if (c.title === "Nova conversa" && text.length > 0) {
          updated.title = text.slice(0, 40) + (text.length > 40 ? "..." : "");
        }
        return updated;
      })
    );
    setInput("");
  };

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
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground">Online</span>
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
                        {line.replace(/\*\*(.*?)\*\*/g, "").includes("**")
                          ? line
                          : line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                              part.startsWith("**") && part.endsWith("**") ? (
                                <strong key={j}>{part.slice(2, -2)}</strong>
                              ) : part.startsWith("> ") ? (
                                <span key={j} className="italic opacity-70">{part.slice(2)}</span>
                              ) : (
                                <span key={j}>{part}</span>
                              )
                            )}
                      </p>
                    ))}
                    <span className="block mt-2 text-[10px] opacity-50">
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}
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
              placeholder={`Mensagem para ${agent.name}...`}
              className="min-h-[44px] max-h-32 resize-none bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn("h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br", agent.gradient, "hover:opacity-90 disabled:opacity-30")}
              size="icon"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
            Integração com IA em breve · Totum Apps
          </p>
        </motion.div>
      </div>
    </div>
    </AppLayout>
  );
}
