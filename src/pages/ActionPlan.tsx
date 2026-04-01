import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2, Clock, Circle, Target, Zap, TrendingUp,
  User, Bot, Users, Filter, ChevronDown, ChevronUp, Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ─── types ─── */
interface Task {
  id: string;
  code: string;
  title: string;
  phase: number;
  phase_name: string;
  day_start: number;
  day_end: number;
  progress: number;
  status: string;
  responsible: string;
}

interface Phase {
  num: number;
  name: string;
  dayStart: number;
  dayEnd: number;
  tasks: Task[];
}

/* ─── constants ─── */
const RESPONSIBLE_OPTIONS = [
  { value: "all", label: "Todos", icon: Users },
  { value: "user", label: "Usuário", icon: User },
  { value: "claude", label: "Claude", icon: Bot },
  { value: "both", label: "Ambos", icon: Users },
];

const PHASE_ICONS: Record<number, string> = {
  1: "⚙️", 2: "🎨", 3: "🔧", 4: "🤖", 5: "🔍", 6: "🚀", 7: "🏁",
};

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  done: { color: "text-emerald-400", icon: CheckCircle2, label: "Concluído" },
  in_progress: { color: "text-primary", icon: Clock, label: "Em andamento" },
  pending: { color: "text-muted-foreground", icon: Circle, label: "Pendente" },
};

const RESPONSIBLE_BADGE: Record<string, string> = {
  user: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  claude: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  both: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const anim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.3 },
});

const ACTION_PLAN_KEY = "actionPlanUnlocked";

export default function ActionPlan() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ACTION_PLAN_KEY) === "true");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterResp, setFilterResp] = useState("all");
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({});
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Totum@SupremoIsrael") {
      setUnlocked(true);
      sessionStorage.setItem(ACTION_PLAN_KEY, "true");
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  if (!unlocked) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <Card className="w-full max-w-sm border-border/40 bg-card/80">
              <CardContent className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-foreground">Acesso Restrito</h2>
                  <p className="text-xs text-muted-foreground mt-1">Digite a senha para acessar o Plano de Ação</p>
                </div>
                <form onSubmit={handleUnlock} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Senha de acesso"
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className={`bg-secondary border-border/40 text-center ${passError ? "border-destructive animate-pulse" : ""}`}
                    autoFocus
                  />
                  {passError && <p className="text-xs text-destructive">Senha incorreta</p>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Desbloquear
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from("action_plan_tasks")
      .select("*")
      .order("phase")
      .order("code");
    if (data) setTasks(data as Task[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
    const ch = supabase
      .channel("action-plan-rt")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "action_plan_tasks" }, () => fetchTasks())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchTasks]);

  /* derived */
  const phases = useMemo<Phase[]>(() => {
    const map = new Map<number, Phase>();
    tasks.forEach((t) => {
      if (!map.has(t.phase)) {
        map.set(t.phase, { num: t.phase, name: t.phase_name, dayStart: t.day_start, dayEnd: t.day_end, tasks: [] });
      }
      map.get(t.phase)!.tasks.push(t);
    });
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }, [tasks]);

  const filteredPhases = useMemo(() => {
    if (filterResp === "all") return phases;
    return phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.responsible === filterResp) })).filter((p) => p.tasks.length > 0);
  }, [phases, filterResp]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const overallProgress = totalTasks ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / totalTasks) : 0;
  const velocity = totalTasks ? +(doneTasks / 7).toFixed(1) : 0;

  /* actions */
  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    const newProgress = newStatus === "done" ? 100 : 0;
    await supabase.from("action_plan_tasks").update({ status: newStatus, progress: newProgress, updated_at: new Date().toISOString() }).eq("id", task.id);
    toast({ title: newStatus === "done" ? "✅ Tarefa concluída" : "↩️ Tarefa reaberta", description: task.title });
  };

  const updateProgress = async (taskId: string, value: number) => {
    const status = value === 100 ? "done" : value > 0 ? "in_progress" : "pending";
    await supabase.from("action_plan_tasks").update({ progress: value, status, updated_at: new Date().toISOString() }).eq("id", taskId);
  };

  const markAllPhase = async (phase: Phase) => {
    const allDone = phase.tasks.every((t) => t.status === "done");
    const newStatus = allDone ? "pending" : "done";
    const newProgress = allDone ? 0 : 100;
    const ids = phase.tasks.map((t) => t.id);
    for (const id of ids) {
      await supabase.from("action_plan_tasks").update({ status: newStatus, progress: newProgress, updated_at: new Date().toISOString() }).eq("id", id);
    }
    toast({ title: allDone ? "↩️ Fase reaberta" : "✅ Fase completa", description: phase.name });
  };

  const togglePhase = (num: number) => setExpandedPhases((p) => ({ ...p, [num]: !p[num] }));

  const phaseProgress = (p: Phase) => p.tasks.length ? Math.round(p.tasks.reduce((s, t) => s + t.progress, 0) / p.tasks.length) : 0;

  const phaseStatus = (p: Phase) => {
    const prog = phaseProgress(p);
    if (prog === 100) return "done";
    if (prog > 0) return "in_progress";
    return "pending";
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-80" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          <Skeleton className="h-20 rounded-xl" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div {...anim(0)} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
              PLANO DE AÇÃO
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Implementação Totum Agents · 30 dias
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Circular progress */}
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="hsl(var(--primary))" strokeWidth="3"
                  strokeDasharray={`${overallProgress} ${100 - overallProgress}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-heading font-semibold text-foreground">
                {overallProgress}%
              </span>
            </div>
            <div className="flex gap-3">
              <div className="bg-card border border-border/40 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Dias Restantes</p>
                <p className="text-xl font-heading font-semibold text-foreground">23</p>
              </div>
              <div className="bg-card border border-border/40 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                <p className="text-lg">🟡 Em andamento</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div {...anim(1)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total", value: totalTasks, icon: Target, cls: "text-foreground" },
            { label: "Concluídas", value: doneTasks, icon: CheckCircle2, cls: "text-emerald-400" },
            { label: "Em Andamento", value: inProgressTasks, icon: Clock, cls: "text-primary" },
            { label: "Pendentes", value: pendingTasks, icon: Circle, cls: "text-muted-foreground" },
            { label: "Velocidade", value: `${velocity}/dia`, icon: Zap, cls: "text-amber-400" },
            { label: "Progresso", value: `${overallProgress}%`, icon: TrendingUp, cls: "text-primary" },
          ].map((m) => (
            <Card key={m.label} className="border-border/40 bg-card/80">
              <CardContent className="p-3 flex items-center gap-3">
                <m.icon className={`w-5 h-5 ${m.cls} shrink-0`} />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{m.label}</p>
                  <p className={`text-lg font-heading font-semibold ${m.cls}`}>{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div {...anim(2)}>
          <Card className="border-border/40 bg-card/80 overflow-x-auto">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 min-w-[700px]">
                {phases.map((p, i) => {
                  const ps = phaseStatus(p);
                  const pp = phaseProgress(p);
                  return (
                    <button
                      key={p.num}
                      onClick={() => { setActivePhase(p.num); setExpandedPhases((prev) => ({ ...prev, [p.num]: true })); }}
                      className={`flex-1 relative group transition-all ${activePhase === p.num ? "scale-105" : ""}`}
                    >
                      <div className={`h-2 rounded-full transition-colors ${
                        ps === "done" ? "bg-emerald-500" : ps === "in_progress" ? "bg-primary" : "bg-muted"
                      }`}>
                        <div
                          className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                          style={{ width: `${pp}%` }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-lg">{PHASE_ICONS[p.num] ?? "📋"}</p>
                        <p className="text-[10px] font-medium text-foreground">{p.name}</p>
                        <p className="text-[9px] text-muted-foreground">Dias {p.dayStart}-{p.dayEnd}</p>
                        <p className={`text-[10px] font-mono ${ps === "done" ? "text-emerald-400" : ps === "in_progress" ? "text-primary" : "text-muted-foreground"}`}>
                          {pp}%
                        </p>
                      </div>
                      {i < phases.length - 1 && (
                        <div className="absolute top-1 -right-1 w-2 h-0.5 bg-border/60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter */}
        <motion.div {...anim(3)} className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mr-1">Responsável:</span>
          {RESPONSIBLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterResp(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterResp === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <opt.icon className="w-3 h-3" />
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* Phase cards */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPhases.map((phase, pi) => {
              const isExpanded = expandedPhases[phase.num] ?? (activePhase === phase.num);
              const pp = phaseProgress(phase);
              const ps = phaseStatus(phase);

              return (
                <motion.div key={phase.num} layout {...anim(pi + 4)} exit={{ opacity: 0, scale: 0.97 }}>
                  <Card className="border-border/40 bg-card/80 overflow-hidden">
                    <button
                      className="w-full text-left"
                      onClick={() => togglePhase(phase.num)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{PHASE_ICONS[phase.num] ?? "📋"}</span>
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                Fase {phase.num}: {phase.name}
                                <Badge variant="outline" className={`text-[10px] ml-1 ${
                                  ps === "done" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    : ps === "in_progress" ? "bg-primary/20 text-primary border-primary/30"
                                    : "bg-muted text-muted-foreground border-border/40"
                                }`}>
                                  {STATUS_CONFIG[ps]?.label}
                                </Badge>
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">Dias {phase.dayStart}-{phase.dayEnd} · {phase.tasks.length} tarefas</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 hidden sm:block">
                              <Progress value={pp} className="h-2" />
                            </div>
                            <span className="text-sm font-mono text-muted-foreground w-10 text-right">{pp}%</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>
                      </CardHeader>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <CardContent className="pt-0 pb-4">
                            <div className="space-y-2">
                              {phase.tasks.map((task) => {
                                const sc = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
                                return (
                                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                                    <Checkbox
                                      checked={task.status === "done"}
                                      onCheckedChange={() => toggleTask(task)}
                                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{task.code}</span>
                                        <span className={`text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                          {task.title}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="w-24 sm:w-40">
                                          <Slider
                                            value={[task.progress]}
                                            min={0}
                                            max={100}
                                            step={5}
                                            onValueCommit={(v) => updateProgress(task.id, v[0])}
                                            className="cursor-pointer"
                                          />
                                        </div>
                                        <span className={`text-[10px] font-mono w-8 ${sc.color}`}>{task.progress}%</span>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] shrink-0 ${RESPONSIBLE_BADGE[task.responsible] ?? ""}`}>
                                      {task.responsible === "user" ? "Usuário" : task.responsible === "claude" ? "Claude" : "Ambos"}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-3 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => markAllPhase(phase)}
                              >
                                {phase.tasks.every((t) => t.status === "done") ? "Reabrir Tudo" : "Marcar Tudo ✓"}
                              </Button>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
