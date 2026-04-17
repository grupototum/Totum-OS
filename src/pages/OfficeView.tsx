import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import { Monitor, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgents } from "@/hooks/useAgents";
import { Skeleton } from "@/components/ui/skeleton";

// ── Gradient palette — cycles if no named match ────────
const GRADIENT_PALETTE = [
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
  "from-amber-500 to-yellow-500",
  "from-indigo-500 to-violet-500",
  "from-lime-500 to-green-500",
  "from-fuchsia-500 to-pink-500",
];

const CATEGORY_GRADIENT: Record<string, string> = {
  analytics:    "from-orange-500 to-amber-500",
  traffic:      "from-emerald-500 to-teal-500",
  social:       "from-violet-500 to-purple-500",
  atendimento:  "from-sky-500 to-blue-500",
  suporte:      "from-sky-500 to-blue-500",
  vendas:       "from-rose-500 to-pink-500",
  sdr:          "from-rose-500 to-pink-500",
  geral:        "from-cyan-500 to-sky-500",
  ads:          "from-amber-500 to-yellow-500",
  conteudo:     "from-indigo-500 to-violet-500",
  content:      "from-indigo-500 to-violet-500",
  orchestrator: "from-fuchsia-500 to-pink-500",
  mode:         "from-lime-500 to-green-500",
};

function gradientForAgent(category: string | null | undefined, index: number): string {
  if (category) {
    const key = category.toLowerCase().trim();
    if (CATEGORY_GRADIENT[key]) return CATEGORY_GRADIENT[key];
  }
  return GRADIENT_PALETTE[index % GRADIENT_PALETTE.length];
}

// ── Status config ────────────────────────────────────────
const statusConfig = {
  online:     { emoji: "🟢", label: "Online",  cls: "bg-emerald-500", ring: "ring-emerald-500/30" },
  idle:       { emoji: "🟡", label: "Idle",    cls: "bg-amber-500",   ring: "ring-amber-500/30"  },
  offline:    { emoji: "🔴", label: "Offline", cls: "bg-red-500",     ring: "ring-red-500/30"    },
  maintenance:{ emoji: "🔴", label: "Manutenção", cls: "bg-red-500",  ring: "ring-red-500/30"    },
  sistema:    { emoji: "🔵", label: "Sistema", cls: "bg-blue-500",    ring: "ring-blue-500/30"   },
} as const;

type AgentStatus = keyof typeof statusConfig;

function resolveStatus(raw: string): AgentStatus {
  if (raw in statusConfig) return raw as AgentStatus;
  return "offline";
}

// ── Desk card shape used by DeskCard ─────────────────────
interface AgentDesk {
  id: string;
  name: string;
  role: string;
  emoji: string;
  gradient: string;
  status: AgentStatus;
  chatRoute: string;
}

// ── DeskCard ─────────────────────────────────────────────
function DeskCard({ agent, index, onClick }: { agent: AgentDesk; index: number; onClick: () => void }) {
  const status = statusConfig[agent.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07, type: "spring", stiffness: 120 }}
      onClick={onClick}
      className="group relative focus:outline-none"
    >
      {/* Desk surface */}
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
                animate={
                  agent.status === "online"
                    ? { scale: [1, 1.04, 1] }
                    : agent.status === "idle"
                    ? { scale: [1, 1.02, 1] }
                    : {}
                }
                transition={{
                  duration: agent.status === "online" ? 3 : 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg text-2xl",
                  agent.gradient,
                  (agent.status === "offline" || agent.status === "maintenance") && "opacity-40 grayscale"
                )}
              >
                {agent.emoji}
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

// ── Skeleton placeholder card ─────────────────────────────
function DeskCardSkeleton() {
  return (
    <div className="relative w-56 sm:w-64">
      <div className="relative rounded-2xl bg-card border border-border overflow-hidden">
        <Skeleton className="h-1 w-full rounded-none" />
        <div className="px-5 pt-4 pb-2">
          <Skeleton className="mx-auto w-28 h-20 rounded-lg" />
          <div className="mx-auto w-4 h-2 mt-1 bg-border rounded-b-sm" />
          <div className="mx-auto w-10 h-1 bg-border rounded-full" />
        </div>
        <div className="flex flex-col items-center pb-4 pt-1 gap-2">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
          <Skeleton className="h-2.5 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────
export default function OfficeView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "online" | "idle" | "offline">("all");
  const pageTransition = usePageTransition();

  const { agents: rawAgents, isLoading } = useAgents();

  // Map raw agents to desk shape
  const desks: AgentDesk[] = rawAgents.map((agent, i) => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    emoji: agent.emoji || "🤖",
    gradient: gradientForAgent(agent.category, i),
    status: resolveStatus(agent.status),
    chatRoute: agent.slug
      ? `/agents/${agent.slug}/chat`
      : `/agents/${agent.id}/chat`,
  }));

  const filtered =
    filter === "all" ? desks : desks.filter((a) => a.status === filter);

  const onlineCount = desks.filter((a) => a.status === "online").length;
  const idleCount   = desks.filter((a) => a.status === "idle").length;

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="min-h-screen">
        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">ESCRITÓRIO DIGITAL</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Visão geral dos agentes</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              {isLoading ? (
                <>
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-3 w-12 rounded" />
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {onlineCount} online
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {idleCount} idle
                  </span>
                </>
              )}
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <DeskCardSkeleton key={i} />)
              : filtered.map((agent, i) => (
                  <DeskCard
                    key={agent.id}
                    agent={agent}
                    index={i}
                    onClick={() => navigate(agent.chatRoute)}
                  />
                ))}
          </div>

          {/* Floor label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-14 text-center"
          >
            <p className="text-xs text-muted-foreground/40">
              Totum HQ · Andar 1 ·{" "}
              {isLoading ? "..." : `${desks.length} estações`}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
