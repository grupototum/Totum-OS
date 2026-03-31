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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockData } from "@/data/dashboardMock";

/* ─── Helpers ─── */
const statusColor = (s: string) =>
  s === "online" || s === "connected" ? "bg-emerald-500" :
  s === "standby" || s === "syncing" ? "bg-amber-400" :
  "bg-red-500";

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

/* ─── Overview Cards ─── */
export function OverviewCards() {
  const cards = [
    { label: "VPS 7GB", value: "Online", sub: mockData.vps[0].description, icon: Server, accent: "border-l-blue-500", dot: "online" },
    { label: "VPS KVM4", value: "Online", sub: mockData.vps[1].description, icon: Cpu, accent: "border-l-emerald-500", dot: "online" },
    { label: "GitHub Sync", value: "Conectado", sub: mockData.github.repo, icon: GitBranch, accent: "border-l-violet-500", dot: "connected" },
    { label: "IAs Ativas", value: `${mockData.ias.active}/${mockData.ias.total}`, sub: mockData.ias.names, icon: Brain, accent: "border-l-primary", dot: "online" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} {...anim(i)}>
          <Card className={`border-l-2 ${c.accent} bg-card/50 backdrop-blur-sm border-border/40 hover:border-border/80 transition-all hover:shadow-lg hover:shadow-primary/5`}>
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
  return (
    <motion.div {...anim(5)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Status dos Apps
          </h3>
          <div className="space-y-2">
            {mockData.apps.map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-border/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{app.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{app.name}</p>
                    <p className="text-[11px] text-muted-foreground">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${
                    app.status === "online"
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : app.status === "standby"
                      ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                      : "border-red-500/30 text-red-400 bg-red-500/10"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusColor(app.status)}`} />
                    {statusLabel(app.status)}
                  </span>
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
  return (
    <motion.div {...anim(6)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Log de Atividades
          </h3>
          <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {mockData.activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                <span className="text-[11px] font-mono text-muted-foreground/60 mt-0.5 shrink-0 w-10">
                  {a.time}
                </span>
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
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export function ResourceUsage() {
  return (
    <motion.div {...anim(7)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5 space-y-5">
          <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            Uso de Recursos
          </h3>
          {mockData.vps.map((vps) => (
            <div key={vps.name}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-foreground">{vps.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusColor(vps.status)}`} />
                  <span className="text-[10px] text-muted-foreground uppercase">{statusLabel(vps.status)}</span>
                </div>
              </div>
              <div className="space-y-3 pl-1">
                <ResourceBar label="RAM" value={vps.ram} icon={MemoryStick} />
                <ResourceBar label="CPU" value={vps.cpu} icon={Cpu} />
                <ResourceBar label="Disco" value={vps.disk} icon={HardDrive} />
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
  const { costs } = mockData;
  const items = [
    { label: "IAs Cloud", value: costs.ia, pct: Math.round((costs.ia / costs.total) * 100) },
    { label: "Ferramentas", value: costs.tools, pct: Math.round((costs.tools / costs.total) * 100) },
    { label: "Hospedagem", value: costs.hosting, pct: Math.round((costs.hosting / costs.total) * 100) },
  ];
  return (
    <motion.div {...anim(8)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Custos Estimados
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono font-medium text-foreground">R$ {item.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center">
            <span className="text-xs font-medium text-foreground">Total mensal</span>
            <span className="text-sm font-heading font-bold text-primary">~R$ {costs.total}</span>
          </div>
          <button className="mt-2 text-[11px] text-primary hover:underline flex items-center gap-1">
            Ver detalhes <ExternalLink className="w-3 h-3" />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── MEX Sync ─── */
export function MexSync() {
  const { mex } = mockData;
  const entries = [
    { label: "Global", status: mex.global },
    { label: "Atendente", status: mex.atendente },
    { label: "Context Hub", status: mex.contextHub },
  ];
  return (
    <motion.div {...anim(9)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            MEX Status
          </h3>
          <div className="space-y-2.5">
            {entries.map((e) => (
              <div key={e.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{e.label}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  {statusIcon(e.status)}
                  {statusLabel(e.status)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-3">
            Último sync: {mex.lastSync}
          </p>
          <button className="mt-3 w-full py-2 rounded-lg text-xs font-medium border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Forçar Sync
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Agent Cards (Trindade) ─── */
export function AgentCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {mockData.agents.map((agent, i) => (
        <motion.div key={agent.name} {...anim(10 + i)}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
            <CardContent className="p-5 text-center">
              <span className="text-3xl block mb-2">{agent.emoji}</span>
              <h4 className="font-heading font-bold text-foreground text-sm">{agent.name}</h4>
              <p className="text-[11px] text-muted-foreground mb-3">{agent.role}</p>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColor(agent.status)} ${agent.status === "online" ? "animate-pulse" : ""}`} />
                <span className="text-xs font-medium text-foreground">{statusLabel(agent.status)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {agent.tasks} tarefa{agent.tasks !== 1 ? "s" : ""} ativa{agent.tasks !== 1 ? "s" : ""}
              </p>
              <button className="mt-3 text-[11px] text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                Ver detalhes →
              </button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
