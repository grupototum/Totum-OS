import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Share2,
  Headphones,
  UserCheck,
  Bot,
  Megaphone,
  ArrowLeft,
  Shield,
  Zap,
  Brain,
  Users,
  ChevronDown,
  ChevronRight,
  
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Agent {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  emoji: string;
  status: "online" | "idle" | "offline";
  responsibilities: string[];
  description: string;
  subAgents?: { name: string; role: string }[];
  chatRoute: string;
}

const trindade: Agent[] = [
  {
    id: "miguel",
    name: "Miguel",
    role: "architect",
    roleLabel: "Arquiteto",
    icon: Brain,
    color: "text-orange-400",
    colorBg: "from-orange-500/20 to-amber-500/20",
    emoji: "🏗️",
    status: "online",
    description: "Visão estratégica, arquitetura técnica, decisões de longo prazo.",
    responsibilities: [
      "Planejamento de novas features",
      "Refactor arquitetural",
      "Escolha de tecnologias",
      "Decisões de infraestrutura",
      "Design de APIs",
    ],
    subAgents: [
      { name: "Radar de Insights", role: "Análise estratégica" },
      { name: "Gestor de Tráfego", role: "Gestão de tráfego" },
    ],
    chatRoute: "/agent/radar",
  },
  {
    id: "liz",
    name: "Liz",
    role: "guardian",
    roleLabel: "Guardiã",
    icon: Shield,
    color: "text-purple-400",
    colorBg: "from-purple-500/20 to-fuchsia-500/20",
    emoji: "🛡️",
    status: "online",
    description: "Operações, qualidade, eficiência e manutenção do código.",
    responsibilities: [
      "Code review",
      "Debugging complexo",
      "Otimização de performance",
      "Documentação técnica",
      "Auditoria de código",
    ],
    subAgents: [
      { name: "Planejamento Social", role: "Estratégia de conteúdo" },
      { name: "Atendente Totum", role: "Atendimento ao cliente" },
    ],
    chatRoute: "/agent/social",
  },
  {
    id: "jarvis",
    name: "Jarvis",
    role: "executor",
    roleLabel: "Executor",
    icon: Zap,
    color: "text-cyan-400",
    colorBg: "from-cyan-500/20 to-blue-500/20",
    emoji: "⚡",
    status: "idle",
    description: "Implementação, automação, scripts e deploy rápido.",
    responsibilities: [
      "CRUDs e operações básicas",
      "Scripts de automação",
      "Configurações e setups",
      "Migrações de dados",
      "Deploy e CI/CD",
    ],
    subAgents: [
      { name: "SDR Comercial", role: "Prospecção" },
      { name: "Kimi", role: "Assistente IA" },
      { name: "Radar de Anúncios", role: "Extração de anúncios" },
    ],
    chatRoute: "/agent/sdr",
  },
];

const operationalAgents: Agent[] = [
  {
    id: "radar",
    name: "Radar de Insights",
    role: "analyst",
    roleLabel: "Analista",
    icon: Search,
    color: "text-orange-400",
    colorBg: "from-orange-500/20 to-amber-500/20",
    emoji: "🔍",
    status: "online",
    description: "Analisa conteúdos e extrai insights estratégicos por departamento.",
    responsibilities: ["Análise de mercado", "Monitoramento de tendências", "Relatórios estratégicos"],
    chatRoute: "/agent/radar",
  },
  {
    id: "gestor",
    name: "Gestor de Tráfego",
    role: "manager",
    roleLabel: "Gestor",
    icon: TrendingUp,
    color: "text-green-400",
    colorBg: "from-green-500/20 to-emerald-500/20",
    emoji: "📈",
    status: "online",
    description: "Gestão e otimização de campanhas de tráfego pago.",
    responsibilities: ["Gestão de campanhas", "Otimização de ROI", "Análise de métricas"],
    chatRoute: "/agent/gestor",
  },
  {
    id: "social",
    name: "Planejamento Social",
    role: "planner",
    roleLabel: "Planejador",
    icon: Share2,
    color: "text-purple-400",
    colorBg: "from-purple-500/20 to-fuchsia-500/20",
    emoji: "📱",
    status: "online",
    description: "Planeja e cria estratégias de conteúdo para redes sociais.",
    responsibilities: ["Calendário editorial", "Estratégia de conteúdo", "Análise de engajamento"],
    chatRoute: "/agent/social",
  },
  {
    id: "atendente",
    name: "Atendente Totum",
    role: "support",
    roleLabel: "Suporte",
    icon: Headphones,
    color: "text-blue-400",
    colorBg: "from-blue-500/20 to-indigo-500/20",
    emoji: "🎧",
    status: "idle",
    description: "Atendimento ao cliente e suporte técnico automatizado.",
    responsibilities: ["Atendimento ao cliente", "FAQ automatizado", "Escalação inteligente"],
    chatRoute: "/agent/atendente",
  },
  {
    id: "sdr",
    name: "SDR Comercial",
    role: "sales",
    roleLabel: "Vendas",
    icon: UserCheck,
    color: "text-pink-400",
    colorBg: "from-pink-500/20 to-rose-500/20",
    emoji: "🤝",
    status: "online",
    description: "Prospecção ativa e qualificação de leads.",
    responsibilities: ["Prospecção de leads", "Qualificação", "Follow-up automatizado"],
    chatRoute: "/agent/sdr",
  },
  {
    id: "kimi",
    name: "Kimi",
    role: "assistant",
    roleLabel: "Assistente",
    icon: Bot,
    color: "text-cyan-400",
    colorBg: "from-cyan-500/20 to-teal-500/20",
    emoji: "🤖",
    status: "online",
    description: "Assistente IA para tarefas gerais e automação.",
    responsibilities: ["Tarefas gerais", "Automação", "Integração entre agentes"],
    chatRoute: "/agent/kimi",
  },
  {
    id: "ads-extractor",
    name: "Radar de Anúncios",
    role: "extractor",
    roleLabel: "Extrator",
    icon: Megaphone,
    color: "text-yellow-400",
    colorBg: "from-yellow-500/20 to-amber-500/20",
    emoji: "📢",
    status: "offline",
    description: "Extrai e analisa anúncios de concorrentes.",
    responsibilities: ["Extração de anúncios", "Análise competitiva", "Benchmarking"],
    chatRoute: "/agent/ads-extractor",
  },
];

const statusConfig = {
  online: { label: "Online", dot: "bg-green-500", ring: "ring-green-500/30" },
  idle: { label: "Idle", dot: "bg-yellow-500", ring: "ring-yellow-500/30" },
  offline: { label: "Offline", dot: "bg-red-500", ring: "ring-red-500/30" },
};

function AgentCard({ agent, onClick, index }: { agent: Agent; onClick: () => void; index: number }) {
  const Icon = agent.icon;
  const status = statusConfig[agent.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        onClick={onClick}
        className="cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className={`bg-gradient-to-br ${agent.colorBg} text-lg`}>
                  {agent.emoji}
                </AvatarFallback>
              </Avatar>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${status.dot} rounded-full ring-2 ${status.ring} ring-offset-2 ring-offset-card`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                  {agent.name}
                </h3>
                <Badge variant="outline" className={`text-[10px] ${agent.color} border-current/20 shrink-0`}>
                  {agent.roleLabel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>

              {agent.subAgents && agent.subAgents.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {agent.subAgents.length} sub-agente{agent.subAgents.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            <Icon className={`w-5 h-5 ${agent.color} opacity-50 group-hover:opacity-100 transition-opacity shrink-0`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProfileDialog({ agent, open, onClose }: { agent: Agent | null; open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  if (!agent) return null;
  const Icon = agent.icon;
  const status = statusConfig[agent.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className={`bg-gradient-to-br ${agent.colorBg} text-2xl`}>
                  {agent.emoji}
                </AvatarFallback>
              </Avatar>
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${status.dot} rounded-full ring-2 ${status.ring} ring-offset-2 ring-offset-card`} />
            </div>
            <div>
              <DialogTitle className="text-foreground flex items-center gap-2">
                {agent.name}
                <Badge variant="outline" className={`text-[10px] ${agent.color} border-current/20`}>
                  {agent.roleLabel}
                </Badge>
              </DialogTitle>
              <DialogDescription className="mt-1">{agent.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 ${status.dot} rounded-full`} />
            <span className="text-sm text-muted-foreground">{status.label}</span>
          </div>

          {/* Responsibilities */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Responsabilidades
            </h4>
            <ul className="space-y-1.5">
              {agent.responsibilities.map((r) => (
                <li key={r} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.color.replace("text-", "bg-")}`} />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Sub-agents */}
          {agent.subAgents && agent.subAgents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Sub-agentes
              </h4>
              <div className="grid gap-2">
                {agent.subAgents.map((sa) => (
                  <div key={sa.name} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-foreground">{sa.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">— {sa.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat button */}
          <button
            onClick={() => navigate(agent.chatRoute)}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-orange-400 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Abrir Chat com {agent.name}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TeamStructure() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("trindade");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sections = [
    { id: "trindade", label: "A Trindade", subtitle: "Núcleo central de orquestração", agents: trindade },
    { id: "operational", label: "Agentes Operacionais", subtitle: "Execução e tarefas específicas", agents: operationalAgents },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/hub")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Team Structure</h1>
              <p className="text-xs text-muted-foreground">Hierarquia e organização dos agentes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {trindade.length + operationalAgents.length} agentes
            </Badge>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            return (
              <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-card/60 border border-border/50 hover:border-primary/20 transition-colors mb-3"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-foreground">{section.label}</h2>
                    <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{section.agents.length}</Badge>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className={`grid gap-3 ${section.id === "trindade" ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                        {section.agents.map((agent, i) => (
                          <AgentCard key={agent.id} agent={agent} onClick={() => setSelectedAgent(agent)} index={i} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Connection lines visualization */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 p-6 rounded-xl bg-card/40 border border-border/30">
          <h3 className="text-sm font-semibold text-foreground mb-4">Fluxo de Delegação</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="px-3 py-1.5 rounded-lg bg-secondary">📋 Recebe Tarefa</span>
            <span className="hidden sm:block">→</span>
            <span className="sm:hidden">↓</span>
            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400">🏗️ Estratégica → Miguel</span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400">🛡️ Qualidade → Liz</span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">⚡ Execução → Jarvis</span>
            <span className="hidden sm:block">→</span>
            <span className="sm:hidden">↓</span>
            <span className="px-3 py-1.5 rounded-lg bg-secondary">✅ Deploy</span>
          </div>
        </motion.div>
      </div>

      <ProfileDialog agent={selectedAgent} open={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}
