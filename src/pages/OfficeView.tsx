import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  TrendingUp,
  Share2,
  Headphones,
  UserCheck,
  Bot,
  Megaphone,
  Monitor,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Agent data ─────────────────────────────────────────
interface AgentDesk {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  gradient: string;
  status: "online" | "idle" | "offline";
  chatRoute: string;
  row: number;
  col: number;
}

const agents: AgentDesk[] = [
  { id: "radar", name: "Radar de Insights", role: "Analista Estratégico", icon: Search, gradient: "from-orange-500 to-amber-500", status: "online", chatRoute: "/agent/radar", row: 0, col: 0 },
  { id: "gestor", name: "Gestor de Tráfego", role: "Tráfego Pago", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500", status: "online", chatRoute: "/agent/gestor", row: 0, col: 1 },
  { id: "social", name: "Planejamento Social", role: "Social Media", icon: Share2, gradient: "from-violet-500 to-purple-500", status: "idle", chatRoute: "/agent/social", row: 0, col: 2 },
  { id: "atendente", name: "Atendente Totum", role: "Suporte ao Cliente", icon: Headphones, gradient: "from-sky-500 to-blue-500", status: "online", chatRoute: "/agent/atendente", row: 1, col: 0 },
  { id: "sdr", name: "SDR Comercial", role: "Vendas & Leads", icon: UserCheck, gradient: "from-rose-500 to-pink-500", status: "offline", chatRoute: "/agent/sdr", row: 1, col: 1 },
  { id: "kimi", name: "Kimi", role: "Assistente Geral", icon: Bot, gradient: "from-cyan-500 to-sky-500", status: "online", chatRoute: "/agent/kimi", row: 1, col: 2 },
  { id: "ads-extractor", name: "Radar de Anúncios", role: "Inteligência Competitiva", icon: Megaphone, gradient: "from-amber-500 to-yellow-500", status: "idle", chatRoute: "/agent/ads-extractor", row: 2, col: 1 },
];

const statusConfig = {
  online: { emoji: "🟢", label: "Online", cls: "bg-emerald-500", ring: "ring-emerald-500/30" },
  idle: { emoji: "🟡", label: "Idle", cls: "bg-amber-500", ring: "ring-amber-500/30" },
  offline: { emoji: "🔴", label: "Offline", cls: "bg-red-500", ring: "ring-red-500/30" },
};

// ── Desk Component ─────────────────────────────────────
function DeskCard({ agent, index, onClick }: { agent: AgentDesk; index: number; onClick: () => void }) {
  const Icon = agent.icon;
  const status = statusConfig[agent.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07, type: "spring", stiffness: 120 }}
      onClick={onClick}
      className="group relative focus:outline-none"
    >
      {/* Desk surface — isometric illusion */}
      <div className="relative w-56 sm:w-64">
        {/* Shadow */}
        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/20 rounded-full blur-md" />

        {/* Desk body */}
        <div className="relative rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-1">
          {/* Top accent bar */}
          <div className={cn("h-1 bg-gradient-to-r", agent.gradient)} />

          {/* Monitor area */}
          <div className="px-5 pt-4 pb-2">
            <div className="relative mx-auto w-28 h-20 rounded-lg bg-secondary border border-border flex items-center justify-center overflow-hidden">
              {/* Screen glow for online */}
              {agent.status === "online" && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={cn("absolute inset-0 bg-gradient-to-br opacity-30", agent.gradient)}
                />
              )}
              <Monitor className="w-6 h-6 text-muted-foreground/40 relative z-10" />
              {agent.status === "online" && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 z-10"
                />
              )}
            </div>
            {/* Monitor stand */}
            <div className="mx-auto w-4 h-2 bg-border rounded-b-sm" />
            <div className="mx-auto w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Agent avatar */}
          <div className="flex flex-col items-center pb-4 pt-1">
            <div className="relative">
              <motion.div
                animate={agent.status === "online" ? { scale: [1, 1.04, 1] } : agent.status === "idle" ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: agent.status === "online" ? 3 : 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  agent.gradient,
                  agent.status === "offline" && "opacity-40 grayscale"
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              {/* Status dot */}
              <span className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card", status.cls)} />
            </div>

            <p className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{agent.name}</p>
            <p className="text-[10px] text-muted-foreground">{agent.role}</p>

            <div className="flex items-center gap-1 mt-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", status.cls)} />
              <span className="text-[10px] text-muted-foreground">{status.label}</span>
            </div>

            {/* Hover CTA */}
            <span className="mt-2 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Abrir chat →
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ── Page ────────────────────────────────────────────────
export default function OfficeView() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "online" | "idle" | "offline">("all");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const filtered = filter === "all" ? agents : agents.filter((a) => a.status === filter);

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const idleCount = agents.filter((a) => a.status === "idle").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/3 rounded-full blur-3xl" />
        {/* Floor grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => navigate("/hub")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Escritório Digital</h1>
              <p className="text-xs text-muted-foreground">Visão geral dos agentes</p>
            </div>
          </div>

          {/* Status summary */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {onlineCount} online
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {idleCount} idle
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          {(["all", "online", "idle", "offline"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg transition-colors capitalize",
                filter === f
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {f === "all" ? "Todos" : f === "online" ? "🟢 Online" : f === "idle" ? "🟡 Idle" : "🔴 Offline"}
            </button>
          ))}
        </motion.div>

        {/* Office floor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {filtered.map((agent, i) => (
            <DeskCard key={agent.id} agent={agent} index={i} onClick={() => navigate(agent.chatRoute)} />
          ))}
        </div>

        {/* Floor label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-14 text-center"
        >
          <p className="text-xs text-muted-foreground/40">Totum HQ · Andar 1 · {agents.length} estações</p>
        </motion.div>
      </div>
    </div>
  );
}
