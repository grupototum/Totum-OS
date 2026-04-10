import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
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
  Crown,
  Users,
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

interface AgentNode {
  id: string;
  name: string;
  roleLabel: string;
  icon: React.ElementType;
  color: string;
  colorBg: string;
  emoji: string;
  status: "online" | "idle" | "offline";
  responsibilities: string[];
  description: string;
  chatRoute: string;
  children?: AgentNode[];
}

const orgTree: AgentNode = {
  id: "chief",
  name: "Chief of Staff",
  roleLabel: "Líder",
  icon: Crown,
  color: "text-primary",
  colorBg: "from-primary/30 to-orange-400/30",
  emoji: "👑",
  status: "online",
  description: "Coordenação geral do ecossistema de agentes IA da Totum.",
  responsibilities: [
    "Orquestração da Trindade",
    "Decisões estratégicas finais",
    "Alocação de recursos entre agentes",
    "Visão macro do sistema",
  ],
  chatRoute: "/agent/radar",
  children: [
    {
      id: "miguel",
      name: "Miguel",
      roleLabel: "Arquiteto",
      icon: Brain,
      color: "text-orange-400",
      colorBg: "from-orange-500/20 to-amber-500/20",
      emoji: "🏗️",
      status: "online",
      description: "Visão estratégica, arquitetura técnica, decisões de longo prazo.",
      responsibilities: [
        "Planejamento de features",
        "Refactor arquitetural",
        "Escolha de tecnologias",
        "Design de APIs",
      ],
      chatRoute: "/agent/radar",
      children: [
        {
          id: "radar",
          name: "Radar de Insights",
          roleLabel: "Analista",
          icon: Search,
          color: "text-orange-400",
          colorBg: "from-orange-500/15 to-amber-500/15",
          emoji: "🔍",
          status: "online",
          description: "Análise de conteúdos e extração de insights estratégicos.",
          responsibilities: ["Análise de mercado", "Monitoramento de tendências", "Relatórios"],
          chatRoute: "/agent/radar",
        },
        {
          id: "gestor",
          name: "Gestor de Tráfego",
          roleLabel: "Gestor",
          icon: TrendingUp,
          color: "text-green-400",
          colorBg: "from-green-500/15 to-emerald-500/15",
          emoji: "📈",
          status: "online",
          description: "Gestão e otimização de campanhas de tráfego pago.",
          responsibilities: ["Gestão de campanhas", "Otimização de ROI", "Métricas"],
          chatRoute: "/agent/gestor",
        },
      ],
    },
    {
      id: "liz",
      name: "Liz",
      roleLabel: "Guardiã",
      icon: Shield,
      color: "text-purple-400",
      colorBg: "from-purple-500/20 to-fuchsia-500/20",
      emoji: "🛡️",
      status: "online",
      description: "Operações, qualidade, eficiência e manutenção.",
      responsibilities: [
        "Code review",
        "Debugging complexo",
        "Performance",
        "Documentação técnica",
      ],
      chatRoute: "/agent/social",
      children: [
        {
          id: "social",
          name: "Planejamento Social",
          roleLabel: "Planejador",
          icon: Share2,
          color: "text-purple-400",
          colorBg: "from-purple-500/15 to-fuchsia-500/15",
          emoji: "📱",
          status: "online",
          description: "Estratégias de conteúdo para redes sociais.",
          responsibilities: ["Calendário editorial", "Estratégia de conteúdo", "Engajamento"],
          chatRoute: "/agent/social",
        },
        {
          id: "atendente",
          name: "Atendente Totum",
          roleLabel: "Suporte",
          icon: Headphones,
          color: "text-blue-400",
          colorBg: "from-blue-500/15 to-indigo-500/15",
          emoji: "🎧",
          status: "idle",
          description: "Atendimento ao cliente e suporte automatizado.",
          responsibilities: ["Atendimento", "FAQ automatizado", "Escalação"],
          chatRoute: "/agent/atendente",
        },
      ],
    },
    {
      id: "jarvis",
      name: "Jarvis",
      roleLabel: "Executor",
      icon: Zap,
      color: "text-cyan-400",
      colorBg: "from-cyan-500/20 to-blue-500/20",
      emoji: "⚡",
      status: "idle",
      description: "Implementação rápida, automação, scripts e deploy.",
      responsibilities: [
        "CRUDs e automação",
        "Scripts e setups",
        "Migrações de dados",
        "Deploy e CI/CD",
      ],
      chatRoute: "/agent/sdr",
      children: [
        {
          id: "sdr",
          name: "SDR Comercial",
          roleLabel: "Vendas",
          icon: UserCheck,
          color: "text-pink-400",
          colorBg: "from-pink-500/15 to-rose-500/15",
          emoji: "🤝",
          status: "online",
          description: "Prospecção ativa e qualificação de leads.",
          responsibilities: ["Prospecção", "Qualificação", "Follow-up"],
          chatRoute: "/agent/sdr",
        },
        {
          id: "kimi",
          name: "Kimi",
          roleLabel: "Assistente",
          icon: Bot,
          color: "text-cyan-400",
          colorBg: "from-cyan-500/15 to-teal-500/15",
          emoji: "🤖",
          status: "online",
          description: "Assistente IA para tarefas gerais.",
          responsibilities: ["Tarefas gerais", "Automação", "Integração"],
          chatRoute: "/agent/kimi",
        },
        {
          id: "ads-extractor",
          name: "Radar de Anúncios",
          roleLabel: "Extrator",
          icon: Megaphone,
          color: "text-yellow-400",
          colorBg: "from-yellow-500/15 to-amber-500/15",
          emoji: "📢",
          status: "offline",
          description: "Extrai e analisa anúncios de concorrentes.",
          responsibilities: ["Extração de ads", "Análise competitiva", "Benchmarking"],
          chatRoute: "/agent/ads-extractor",
        },
      ],
    },
  ],
};

const statusConfig = {
  online: { label: "Online", dot: "bg-green-500", ring: "ring-green-500/30" },
  idle: { label: "Idle", dot: "bg-yellow-500", ring: "ring-yellow-500/30" },
  offline: { label: "Offline", dot: "bg-red-500", ring: "ring-red-500/30" },
};

/* ─── Org Card ─── */
function OrgCard({
  agent,
  onClick,
  tier,
  delay,
}: {
  agent: AgentNode;
  onClick: () => void;
  tier: number;
  delay: number;
}) {
  const status = statusConfig[agent.status];
  const sizeClass = tier === 0 ? "w-48" : tier === 1 ? "w-44" : "w-40";
  const avatarSize = tier === 0 ? "h-16 w-16 text-2xl" : tier === 1 ? "h-14 w-14 text-xl" : "h-11 w-11 text-base";
  const nameSize = tier === 0 ? "text-base" : tier === 1 ? "text-sm" : "text-xs";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`${sizeClass} flex flex-col items-center`}
    >
      <Card
        onClick={onClick}
        className="cursor-pointer w-full border-border/50 bg-card/90 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
      >
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          {/* Avatar */}
          <div className="relative">
            <Avatar className={avatarSize}>
              <AvatarFallback className={`bg-gradient-to-br ${agent.colorBg}`}>
                {agent.emoji}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${status.dot} rounded-full ring-2 ${status.ring} ring-offset-2 ring-offset-card`}
            />
          </div>

          {/* Name */}
          <h3 className={`font-bold text-foreground ${nameSize} group-hover:text-primary transition-colors leading-tight`}>
            {agent.name}
          </h3>

          {/* Role badge */}
          <Badge
            variant="outline"
            className={`text-[10px] ${agent.color} border-current/20`}
          >
            {agent.roleLabel}
          </Badge>

          {/* Responsibilities (condensed) */}
          <ul className="space-y-0.5 w-full mt-1">
            {agent.responsibilities.slice(0, 3).map((r) => (
              <li
                key={r}
                className="text-[10px] text-muted-foreground flex items-start gap-1"
              >
                <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${agent.color.replace("text-", "bg-")}`} />
                <span className="line-clamp-1">{r}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Vertical connector line ─── */
function VLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-px bg-border/60 origin-top ${className}`}
      style={{ height: 32 }}
    />
  );
}


/* ─── Profile Dialog ─── */
function ProfileDialog({
  agent,
  open,
  onClose,
}: {
  agent: AgentNode | null;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  if (!agent) return null;
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
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${status.dot} rounded-full ring-2 ${status.ring} ring-offset-2 ring-offset-card`}
              />
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
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 ${status.dot} rounded-full`} />
            <span className="text-sm text-muted-foreground">{status.label}</span>
          </div>

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

          {agent.children && agent.children.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Sub-agentes
              </h4>
              <div className="grid gap-2">
                {agent.children.map((sa) => (
                  <div key={sa.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-foreground">{sa.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">— {sa.roleLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

/* ─── Main Page ─── */
export default function TeamStructure() {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const [dbStatuses, setDbStatuses] = useState<Record<string, string>>({});

  // Realtime agent statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      const { data } = await supabase.from("agents").select("name, status");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((a) => {
          map[a.name.toLowerCase()] = a.status;
        });
        setDbStatuses(map);
      }
    };
    fetchStatuses();

    const channelId = `team-agents-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on("postgres_changes", { event: "*", schema: "public", table: "agents" }, () => {
        fetchStatuses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resolveStatus = (name: string, fallback: "online" | "idle" | "offline"): "online" | "idle" | "offline" => {
    const dbStatus = dbStatuses[name.toLowerCase()];
    if (!dbStatus) return fallback;
    if (dbStatus === "ativo" || dbStatus === "online") return "online";
    if (dbStatus === "standby" || dbStatus === "idle") return "idle";
    return "offline";
  };

  const applyStatuses = (node: AgentNode): AgentNode => ({
    ...node,
    status: resolveStatus(node.name, node.status),
    children: node.children?.map(applyStatuses),
  });

  const liveTree = applyStatuses(orgTree);
  const trindade = liveTree.children || [];

  return (
    <AppLayout>
    <div className="min-h-screen">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">TEAM STRUCTURE</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Organograma dos agentes IA</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            10 agentes
          </Badge>
        </motion.div>

        {/* ─── ORG CHART ─── */}
        <div className="flex flex-col items-center overflow-x-auto pb-10">
          {/* TIER 0 — Chief of Staff */}
          <OrgCard agent={liveTree} onClick={() => setSelectedAgent(liveTree)} tier={0} delay={0} />

          {/* Line down from Chief */}
          <VLine />

          {/* Horizontal rail spanning all 3 Trindade */}
          <div className="flex items-start">
            <div className="flex items-start gap-0">
              {trindade.map((node, i) => (
                <div key={node.id} className="flex flex-col items-center">
                  {/* short vertical stub above each trindade card */}
                  <div className="flex items-center">
                    {/* horizontal segment: left half for non-first, right half for non-last */}
                    <div className={`h-px ${i === 0 ? "bg-transparent" : "bg-border/60"}`} style={{ width: 60 }} />
                    <div className="w-px h-6 bg-border/60" />
                    <div className={`h-px ${i === trindade.length - 1 ? "bg-transparent" : "bg-border/60"}`} style={{ width: 60 }} />
                  </div>

                  {/* TIER 1 — Trindade card */}
                  <OrgCard agent={node} onClick={() => setSelectedAgent(node)} tier={1} delay={0.15 + i * 0.1} />

                  {/* Children of trindade */}
                  {node.children && node.children.length > 0 && (
                    <>
                      <VLine />
                      <div className="flex items-start">
                        {node.children.map((child, ci) => (
                          <div key={child.id} className="flex flex-col items-center">
                            <div className="flex items-center">
                              <div
                                className={`h-px ${ci === 0 ? "bg-transparent" : "bg-border/60"}`}
                                style={{ width: 40 }}
                              />
                              <div className="w-px h-5 bg-border/60" />
                              <div
                                className={`h-px ${ci === (node.children!.length - 1) ? "bg-transparent" : "bg-border/60"}`}
                                style={{ width: 40 }}
                              />
                            </div>

                            {/* TIER 2 — Sub-agent card */}
                            <OrgCard
                              agent={child}
                              onClick={() => setSelectedAgent(child)}
                              tier={2}
                              delay={0.3 + i * 0.1 + ci * 0.05}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delegation flow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-card/40 border border-border/30"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Fluxo de Delegação</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="px-3 py-1.5 rounded-lg bg-secondary">📋 Tarefa</span>
            <span className="hidden sm:block">→</span>
            <span className="sm:hidden">↓</span>
            <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary">👑 Chief</span>
            <span className="hidden sm:block">→</span>
            <span className="sm:hidden">↓</span>
            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400">🏗️ Miguel</span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400">🛡️ Liz</span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">⚡ Jarvis</span>
            <span className="hidden sm:block">→</span>
            <span className="sm:hidden">↓</span>
            <span className="px-3 py-1.5 rounded-lg bg-secondary">✅ Deploy</span>
          </div>
        </motion.div>
      </div>

      <ProfileDialog agent={selectedAgent} open={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
    </AppLayout>
  );
}
