import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Server,
  GitBranch,
  Brain,
  Activity,
  Clock,
  ExternalLink,
  RefreshCw,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Cpu,
  HardDrive,
  MemoryStick,
  Database,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/hooks/useDashboardData";

/* ─── Context for shared data ─── */
const DashboardCtx = createContext<DashboardData | null>(null);
export const DashboardProvider = DashboardCtx.Provider;
function useData() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("DashboardProvider missing");
  return ctx;
}

/* ─── Helpers ─── */
const statusColor = (s: string) =>
  s === "online" || s === "connected"
    ? "bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
    : s === "standby" || s === "syncing"
    ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
    : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]";

const statusLabel = (s: string) =>
  s === "online" ? "Online" :
  s === "connected" ? "Conectado" :
  s === "standby" ? "Standby" :
  s === "syncing" ? "Sincronizando" :
  s === "synced" ? "Sincronizado" :
  "Offline";

const statusIcon = (s: string) =>
  s === "synced" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
  s === "syncing" ? <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" /> :
  s === "error" ? <AlertCircle className="w-3.5 h-3.5 text-red-500" /> : null;

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.4 },
});

function CardSkeleton() {
  return <Skeleton className="h-24 w-full rounded-xl" />;
}

/* ─── Overview Cards ─── */
export function OverviewCards() {
  const { vps, github, agents, loading } = useData();
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0,1,2,3].map(i => <CardSkeleton key={i} />)}
    </div>
  );

  const activeAgents = agents.filter(a => a.status === "online").length;
  const cards = [
    { label: "VPS 7GB", value: "Online", sub: vps[0]?.description ?? "", icon: Server, accent: "border-l-blue-500", dot: vps[0]?.status ?? "offline" },
    { label: "VPS KVM4", value: "Online", sub: vps[1]?.description ?? "", icon: Cpu, accent: "border-l-emerald-500", dot: vps[1]?.status ?? "offline" },
    { label: "GitHub Sync", value: github ? "Conectado" : "—", sub: github?.repo ?? "", icon: GitBranch, accent: "border-l-violet-500", dot: github?.status ?? "offline" },
    { label: "IAs Ativas", value: `${activeAgents}/${agents.length}`, sub: agents.map(a => a.name).join(", "), icon: Brain, accent: "border-l-primary", dot: "online" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} {...anim(i)}>
          <Card cornerMarks className={`border-l-2 ${c.accent} bg-card/50 backdrop-blur-sm border-border/40 hover:border-border/80 transition-all`}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0">
                <c.icon className="w-4.5 h-4.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{c.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusColor(c.dot)}`} />
                  <span className="text-sm font-semibold text-foreground">{c.value}</span>
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate">{c.sub}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── App Status List ─── */
export function AppStatusList() {
  const { apps, loading } = useData();
  if (loading) return <CardSkeleton />;
  return (
    <motion.div {...anim(5)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Status dos Apps
          </h3>
          <div className="space-y-2">
            {apps.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-4">Nenhum app configurado</p>
            )}
            {apps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-border/60 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{app.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <p className="text-[11px] text-muted-foreground">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${
                      app.status === "online" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                      app.status === "standby" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                      "border-red-500/30 text-red-400 bg-red-500/10"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusColor(app.status)}`} />
                      {statusLabel(app.status)}
                    </span>
                    {app.status === "standby" && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">EM BREVE</span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Activity Log ─── */
export function ActivityLog() {
  const { activities, loading } = useData();
  if (loading) return <CardSkeleton />;
  return (
    <motion.div {...anim(6)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Log de Atividades
          </h3>
          <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {activities.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-4">Nenhuma atividade registrada</p>
            )}
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                <span className="text-[11px] font-mono text-muted-foreground/60 mt-0.5 shrink-0 w-10">{a.time}</span>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  a.type === "success" ? "bg-emerald-500" :
                  a.type === "warning" ? "bg-amber-400" :
                  "bg-blue-400"
                }`} />
                <p className="text-xs text-muted-foreground leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Resource Usage ─── */
function ResourceBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const color = value > 75 ? "bg-red-500" : value > 50 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="w-3 h-3" />
          {label}
        </span>
        <span className="font-mono font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
        <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.3 }} />
      </div>
    </div>
  );
}

export function ResourceUsage() {
  const { vps, loading } = useData();
  if (loading) return <CardSkeleton />;
  return (
    <motion.div {...anim(7)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5 space-y-5">
          <h3 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            Uso de Recursos
          </h3>
          {vps.map((v) => (
            <div key={v.id}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-foreground">{v.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusColor(v.status)}`} />
                  <span className="text-[10px] text-muted-foreground uppercase">{statusLabel(v.status)}</span>
                </div>
              </div>
              <div className="space-y-3 pl-1">
                <ResourceBar label="RAM" value={v.ram} icon={MemoryStick} />
                <ResourceBar label="CPU" value={v.cpu} icon={Cpu} />
                <ResourceBar label="Disco" value={v.disk} icon={HardDrive} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Costs ─── */
export function CostEstimate() {
  const { costs, loading } = useData();
  if (loading) return <CardSkeleton />;
  const total = costs.reduce((sum, c) => sum + Number(c.value), 0);
  return (
    <motion.div {...anim(8)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Custos Estimados
          </h3>
          <div className="space-y-3">
            {costs.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-4">Nenhum custo registrado</p>
            )}
            {costs.map((item) => {
              const pct = total > 0 ? Math.round((Number(item.value) / total) * 100) : 0;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono font-medium text-foreground">R$ {Number(item.value)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary/80" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center">
            <span className="text-xs font-medium text-foreground">Total mensal</span>
            <span className="text-sm font-sans font-bold text-primary">~R$ {total}</span>
          </div>
          <button className="mt-2 text-[11px] text-primary/50 cursor-not-allowed flex items-center gap-1">
            Ver detalhes <ExternalLink className="w-3 h-3" />
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded ml-1">EM BREVE</span>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── MEX Sync ─── */
export function MexSync() {
  const { mex, loading } = useData();
  const [syncing, setSyncing] = useState(false);

  const forceSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("mex_sync").update({ status: "syncing" }).neq("id", "00000000-0000-0000-0000-000000000000");
    await new Promise((r) => setTimeout(r, 1800));
    await supabase.from("mex_sync").update({ status: "synced", last_sync: today }).neq("id", "00000000-0000-0000-0000-000000000000");
    setSyncing(false);
  }, [syncing]);

  if (loading) return <CardSkeleton />;
  return (
    <motion.div {...anim(9)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            MEX Status
          </h3>
          <div className="space-y-2.5">
            {mex.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 text-center py-2">Sem dados</p>
            ) : mex.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{e.label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  {statusIcon(syncing ? "syncing" : e.status)}
                  {statusLabel(syncing ? "syncing" : e.status)}
                </span>
              </div>
            ))}
          </div>
          {mex[0]?.last_sync && (
            <p className="text-[11px] text-muted-foreground/50 mt-3">
              Último sync: {mex[0].last_sync}
            </p>
          )}
          <button
            onClick={forceSync}
            disabled={syncing}
            className="mt-3 w-full py-2 rounded-lg text-xs font-medium border border-border/50 flex items-center justify-center gap-2 transition-colors hover:bg-primary/10 hover:border-primary/40 hover:text-foreground disabled:opacity-60 disabled:cursor-not-allowed text-muted-foreground"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando…" : "Forçar Sync"}
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Agent Cards (Trindade) ─── */
export function AgentCards() {
  const { agents, loading } = useData();
  const navigate = useNavigate();

  const trindade = agents.filter(a =>
    (a.category || "").toLowerCase() === "trindade" ||
    ["radar", "gestor", "social"].includes((a.name || "").toLowerCase())
  ).slice(0, 3);

  const display = trindade.length > 0 ? trindade : agents.slice(0, 3);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0,1,2].map(i => <CardSkeleton key={i} />)}
    </div>
  );

  if (display.length === 0) return (
    <Card className="border-border/40 bg-card/50 p-8 text-center">
      <p className="text-sm text-muted-foreground">Nenhum agente encontrado</p>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {display.map((agent, i) => (
        <motion.div key={agent.id} {...anim(10 + i)}>
          <Card className="border-gradient backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-shadow group cursor-pointer"
            onClick={() => navigate(`/agents/${agent.slug || agent.id}/chat`)}>
            <CardContent className="p-5 text-center">
              <span className="text-3xl block mb-2">{agent.emoji}</span>
              <h4 className="font-sans font-bold text-foreground text-sm">{agent.name}</h4>
              <p className="text-[11px] text-muted-foreground mb-3">{agent.role}</p>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColor(agent.status)} ${agent.status === "online" ? "animate-pulse" : ""}`} />
                <span className="text-xs font-medium text-foreground">{statusLabel(agent.status)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                {agent.tasks} tarefa{agent.tasks !== 1 ? "s" : ""} ativa{agent.tasks !== 1 ? "s" : ""}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.slug || agent.id}/chat`); }}
                className="mt-1 w-full py-1.5 rounded-lg text-[11px] font-medium border border-primary/30 text-primary bg-primary/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/15 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                Abrir Chat LLM
              </button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── System Health Score ─── */
export function SystemHealthScore() {
  const { vps, agents, apps, github, loading } = useData();
  if (loading) return <CardSkeleton />;

  // Compute weighted score
  const vpsScore   = vps.length > 0 ? (vps.filter(v => v.status === "online").length / vps.length) * 100 : 0;
  const agentScore = agents.length > 0 ? (agents.filter(a => a.status === "online").length / agents.length) * 100 : 0;
  const appScore   = apps.length > 0 ? (apps.filter(a => a.status === "online").length / apps.length) * 100 : 0;
  const githubScore = github?.status === "connected" || github?.status === "synced" ? 100 : 0;

  const score = Math.round(
    vpsScore   * 0.30 +
    agentScore * 0.40 +
    appScore   * 0.20 +
    githubScore * 0.10
  );

  // SVG arc gauge (half circle)
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circumference = Math.PI * r; // half circle
  const offset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80 ? "#10b981" : // emerald
    score >= 50 ? "#f59e0b" : // amber
    "#ef4444";                 // red

  const scoreLabel =
    score >= 80 ? "Saudável" :
    score >= 50 ? "Atenção" :
    "Crítico";

  const breakdown = [
    { label: "VPS",     value: Math.round(vpsScore),    weight: "30%" },
    { label: "Agentes", value: Math.round(agentScore),  weight: "40%" },
    { label: "Apps",    value: Math.round(appScore),    weight: "20%" },
    { label: "GitHub",  value: Math.round(githubScore), weight: "10%" },
  ];

  return (
    <motion.div {...anim(11)}>
      <Card cornerAccents className="border-gradient backdrop-blur-sm">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            System Health Score
          </h3>

          {/* Arc gauge */}
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <svg width="140" height="80" viewBox="0 0 140 80">
                {/* Track */}
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                {/* Fill */}
                <motion.path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 6px ${scoreColor}60)` }}
                />
              </svg>
              {/* Score in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                <motion.span
                  className="text-2xl font-bold font-mono leading-none"
                  style={{ color: scoreColor }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {score}
                </motion.span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{scoreLabel}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex-1 space-y-2">
              {breakdown.map((b) => (
                <div key={b.label} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{b.label} <span className="opacity-40">({b.weight})</span></span>
                    <span className="font-mono text-foreground">{b.value}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary/60 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: b.value >= 80 ? "#10b981" : b.value >= 50 ? "#f59e0b" : "#ef4444" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${b.value}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── VPS Live Status ─── */
interface HealthPayload {
  uptime?: number;
  memory?: { used?: number; usedMB?: number };
  cpu?: number | { usage?: number };
  requests_per_minute?: number;
}
function fmtCpu(h: HealthPayload) {
  if (typeof h.cpu === "number") return `${h.cpu.toFixed(1)}%`;
  if (typeof h.cpu === "object" && h.cpu?.usage !== undefined) return `${h.cpu.usage.toFixed(1)}%`;
  return "—";
}
function fmtRam(h: HealthPayload) {
  const m = h.memory;
  if (!m) return "—";
  if (m.usedMB !== undefined) return `${m.usedMB} MB`;
  if (m.used !== undefined && m.used > 1048576) return `${(m.used / 1048576).toFixed(0)} MB`;
  return "—";
}
function fmtUptime(s: number) {
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
}

export function VpsLiveStatus() {
  const [m, setM] = useState({ cpu: "—", ram: "—", uptime: "—", rpm: "—", online: false, checkedAt: null as Date | null });
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    const url = import.meta.env.VITE_OPENCLAW_URL;
    const token = import.meta.env.VITE_OPENCLAW_TOKEN;
    if (!url) { setM(p => ({ ...p, online: false, checkedAt: new Date() })); setChecking(false); return; }
    setChecking(true);
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`${url}/health`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, signal: ctrl.signal });
      clearTimeout(tid);
      if (!res.ok) throw new Error();
      const h: HealthPayload = await res.json();
      setM({ cpu: fmtCpu(h), ram: fmtRam(h), uptime: h.uptime !== undefined ? fmtUptime(h.uptime) : "—", rpm: h.requests_per_minute !== undefined ? String(h.requests_per_minute) : "—", online: true, checkedAt: new Date() });
    } catch { setM(p => ({ ...p, online: false, checkedAt: new Date() })); }
    setChecking(false);
  }, []);

  useEffect(() => { check(); const id = setInterval(check, 30_000); return () => clearInterval(id); }, [check]);

  const items = [
    { label: "CPU", value: m.cpu, Icon: Cpu },
    { label: "RAM", value: m.ram, Icon: MemoryStick },
    { label: "Uptime", value: m.uptime, Icon: Activity },
    { label: "Req/min", value: m.rpm, Icon: Zap },
  ];

  return (
    <motion.div {...anim(13)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              VPS Live
            </h3>
            <div className="flex items-center gap-2">
              {m.checkedAt && <span className="text-[10px] text-muted-foreground/50">{m.checkedAt.toLocaleTimeString("pt-BR")}</span>}
              <div className={`w-2 h-2 rounded-full ${m.online ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              <span className={`text-[10px] font-mono uppercase ${m.online ? "text-emerald-500" : "text-red-400"}`}>
                {checking ? "…" : m.online ? "Live" : "Offline"}
              </span>
              <button onClick={check} className="text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className={`w-3 h-3 ${checking ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {items.map(({ label, value, Icon }) => (
              <div key={label} className="bg-secondary/30 rounded-lg p-3 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${m.online ? "text-primary" : "text-muted-foreground/30"}`} />
                <p className={`text-sm font-bold font-mono ${m.online ? "text-foreground" : "text-muted-foreground/40"}`}>{checking ? "…" : value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
          {!m.online && !checking && (
            <p className="text-[11px] text-muted-foreground/50 mt-3 text-center">
              {import.meta.env.VITE_OPENCLAW_URL ? "VPS inacessível" : "VITE_OPENCLAW_URL não configurada"}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Database Status ─── */
export function DatabaseStatus() {
  const [stat, setStat] = useState<{ status: "online" | "offline" | "checking"; latency: number; checkedAt: Date }>({
    status: "checking", latency: 0, checkedAt: new Date(),
  });

  const check = useCallback(async () => {
    setStat(s => ({ ...s, status: "checking" }));
    const t0 = Date.now();
    try {
      const { error } = await supabase.from("agents").select("id").limit(1);
      setStat({ status: error ? "offline" : "online", latency: Date.now() - t0, checkedAt: new Date() });
    } catch {
      setStat({ status: "offline", latency: Date.now() - t0, checkedAt: new Date() });
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  const badgeColor = stat.status === "online"
    ? "bg-emerald-500/15 text-emerald-400"
    : stat.status === "offline"
    ? "bg-red-500/15 text-red-400"
    : "bg-amber-500/15 text-amber-400";

  return (
    <motion.div {...anim(14)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              PostgreSQL
            </h3>
            <button onClick={check} className="text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className={`w-3 h-3 ${stat.status === "checking" ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="space-y-2.5">
            {([
              { label: "Status", node: <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase ${badgeColor}`}>{stat.status === "checking" ? "verificando…" : stat.status}</span> },
              { label: "Latência", node: <span className="text-xs font-mono font-medium text-foreground">{stat.latency}ms</span> },
              { label: "Provider", node: <span className="text-xs font-medium text-foreground">Supabase</span> },
              { label: "Atualizado", node: <span className="text-[10px] text-muted-foreground">{stat.checkedAt.toLocaleTimeString("pt-BR")}</span> },
            ] as { label: string; node: React.ReactNode }[]).map(({ label, node }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                {node}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Infra Controls ─── */
type SyncState = "idle" | "syncing" | "success" | "error";

export function InfraControls() {
  const [state, setState] = useState<SyncState>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const runSync = useCallback(async () => {
    setState("syncing");
    const lines: string[] = [];
    const push = (l: string) => { lines.push(l); setLog([...lines]); };
    try {
      push("🔄 Iniciando sincronização…");
      const { error } = await supabase.from("agents").select("id").limit(1);
      if (error) throw new Error("Supabase indisponível");
      push("✅ Supabase: conectado");
      await supabase.from("agents").select("count", { count: "exact", head: true });
      push("✅ agents: ok");
      await supabase.from("tarefas").select("count", { count: "exact", head: true });
      push("✅ tarefas: ok");
      push("🎯 Concluído!");
      setState("success");
      setLastSync(new Date());
      setTimeout(() => setState("idle"), 3000);
    } catch (err: any) {
      push(`❌ Erro: ${err.message}`);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }, []);

  return (
    <motion.div {...anim(15)}>
      <Card cornerMarks className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-sans font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Controles
          </h3>
          <button
            onClick={runSync}
            disabled={state === "syncing"}
            className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border
              ${state === "success" ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
              : state === "error"   ? "border-red-500/40 text-red-400 bg-red-500/10"
              : "border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"}`}
          >
            {state === "syncing" ? <><RefreshCw className="w-3 h-3 animate-spin" />Sincronizando…</>
            : state === "success"  ? <><CheckCircle className="w-3 h-3" />Sincronizado!</>
            : state === "error"    ? <><XCircle className="w-3 h-3" />Tentar novamente</>
            : <><RefreshCw className="w-3 h-3" />Forçar Sync</>}
          </button>
          {log.length > 0 && (
            <div className="mt-3 bg-black/60 rounded-lg p-3 font-mono text-[10px] space-y-0.5 max-h-28 overflow-y-auto">
              {log.map((l, i) => <p key={i} className="text-emerald-400">{l}</p>)}
            </div>
          )}
          {lastSync && (
            <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
              Último sync: {lastSync.toLocaleString("pt-BR")}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
