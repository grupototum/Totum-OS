import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, CheckCircle2, Clock, Circle, TrendingUp, Lock, Target, Zap, Calendar, BarChart3, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { GanttChart } from "@/components/gantt";
import { AgentTaskManager } from "@/components/agents";

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
  progress: number;
  taskCount: number;
  completedCount: number;
}

/* ─── constants ─── */
const PHASE_ICONS: Record<number, string> = {
  1: "⚙️", 2: "🎨", 3: "🔧", 4: "🤖", 5: "🔍", 6: "🚀", 7: "🏁",
};

const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: "Fundação técnica e configurações iniciais",
  2: "Design system e identidade visual",
  3: "Desenvolvimento de features",
  4: "Configuração de agentes IA",
  5: "Testes e qualidade",
  6: "Deploy e lançamento",
  7: "Entrega final",
};

const ACTION_PLAN_KEY = "actionPlanUnlocked";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.3 },
});

export default function Implantação() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ACTION_PLAN_KEY) === "true");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!unlocked) return;
    fetchTasks();
    const ch = supabase
      .channel("action-plan-rt")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "action_plan_tasks" }, () => fetchTasks())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchTasks, unlocked]);

  /* derived */
  const phases = useMemo<Phase[]>(() => {
    const map = new Map<number, Phase>();
    tasks.forEach((t) => {
      if (!map.has(t.phase)) {
        map.set(t.phase, { 
          num: t.phase, 
          name: t.phase_name, 
          dayStart: t.day_start, 
          dayEnd: t.day_end, 
          progress: 0,
          taskCount: 0,
          completedCount: 0
        });
      }
      const phase = map.get(t.phase)!;
      phase.taskCount++;
      if (t.status === 'done') phase.completedCount++;
    });
    
    // Calculate progress for each phase
    map.forEach((phase) => {
      phase.progress = phase.taskCount > 0 
        ? Math.round((phase.completedCount / phase.taskCount) * 100) 
        : 0;
    });
    
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }, [tasks]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha movida para variável de ambiente VITE_ACTION_PLAN_PASSWORD
    const correctPassword = import.meta.env.VITE_ACTION_PLAN_PASSWORD || '';
    if (passInput === correctPassword) {
      setUnlocked(true);
      sessionStorage.setItem(ACTION_PLAN_KEY, "true");
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  // Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const overallProgress = totalTasks ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / totalTasks) : 0;
  const velocity = totalTasks ? +(doneTasks / 30).toFixed(1) : 0;
  
  // Current phase
  const currentPhase = phases.find(p => p.progress > 0 && p.progress < 100) || phases[0];

  if (!unlocked) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mx-4"
          >
            <Card className="border-stone-300 bg-white/80">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto">
                  <Rocket className="w-10 h-10 text-stone-600" />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">Implantação</h2>
                  <p className="text-sm text-stone-500 mt-2">
                    Dashboard de acompanhamento do projeto
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Senha de acesso"
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className={`bg-white border-stone-300 text-center h-12 ${passError ? "border-red-400 animate-pulse" : ""}`}
                    autoFocus
                  />
                  {passError && <p className="text-sm text-red-500">Senha incorreta</p>}
                  <Button 
                    type="submit" 
                    className="w-full bg-stone-900 hover:bg-stone-800 h-12"
                  >
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

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div {...anim(0)} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6 text-stone-900" />
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                Implantação
              </h1>
            </div>
            <p className="text-sm text-stone-500">
              Acompanhamento das fases do projeto
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Circle */}
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E7E5E4" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="#1C1917" strokeWidth="3"
                  strokeDasharray={`${overallProgress} ${100 - overallProgress}`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-stone-900">
                {overallProgress}%
              </span>
            </div>

            <div className="flex gap-3">
              <div className="bg-white border border-stone-300 rounded-lg px-4 py-3 text-center">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Dias</p>
                <p className="text-xl font-semibold text-stone-900">30</p>
              </div>
              <div className="bg-white border border-stone-300 rounded-lg px-4 py-3 text-center">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Status</p>
                <p className="text-lg">{overallProgress === 100 ? '🏁' : '🚀'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div {...anim(1)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: totalTasks, icon: Target, color: "text-stone-900" },
            { label: "Concluídas", value: doneTasks, icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Em Andamento", value: inProgressTasks, icon: Clock, color: "text-blue-600" },
            { label: "Pendentes", value: pendingTasks, icon: Circle, color: "text-stone-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border-stone-300 bg-white/80">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-stone-900">{stat.value}</p>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Current Phase Highlight */}
        {currentPhase && (
          <motion.div {...anim(2)}>
            <Card className="border-stone-300 bg-gradient-to-br from-stone-800 to-stone-900 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{PHASE_ICONS[currentPhase.num] || "📋"}</span>
                      <div>
                        <p className="text-xs text-stone-300 uppercase tracking-wider font-medium">Fase Atual</p>
                        <h2 className="text-xl font-semibold text-white">Fase {currentPhase.num}: {currentPhase.name}</h2>
                      </div>
                    </div>
                    <p className="text-sm text-stone-200">
                      {PHASE_DESCRIPTIONS[currentPhase.num] || "Em andamento"}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-3xl font-semibold text-white">{currentPhase.progress}%</p>
                    <p className="text-xs text-stone-300">
                      {currentPhase.completedCount}/{currentPhase.taskCount} tarefas
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Progress 
                    value={currentPhase.progress} 
                    className="h-2 bg-stone-600"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs: Fases / Gantt / Agentes */}
        <motion.div {...anim(3)}>
          <Tabs defaultValue="fases" className="space-y-4">
            <TabsList className="bg-card/50 border border-border/40">
              <TabsTrigger value="fases">📋 Fases</TabsTrigger>
              <TabsTrigger value="gantt">📊 Gantt</TabsTrigger>
              <TabsTrigger value="agentes">🤖 Agentes</TabsTrigger>
            </TabsList>

            {/* Tab: Fases */}
            <TabsContent value="fases" className="space-y-4">
              <h2 className="text-lg font-semibold text-stone-900">Todas as Fases</h2>
              <div className="grid gap-3">
                {phases.map((phase, index) => (
                  <motion.div
                    key={phase.num}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-stone-300 bg-white/80 hover:bg-white transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{PHASE_ICONS[phase.num] || "📋"}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-stone-900">
                                Fase {phase.num}: {phase.name}
                              </h3>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline"
                                  className={`
                                    ${phase.progress === 100 
                                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                      : phase.progress > 0 
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-stone-100 text-stone-600 border-stone-200'}
                                  `}
                                >
                                  {phase.progress === 100 ? 'Concluída' : phase.progress > 0 ? 'Em andamento' : 'Pendente'}
                                </Badge>
                                <span className="text-sm font-medium text-stone-900 w-12 text-right">
                                  {phase.progress}%
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <Progress value={phase.progress} className="h-2" />
                              </div>
                              <p className="text-xs text-stone-500">
                                {phase.completedCount}/{phase.taskCount} tarefas
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Gantt */}
            <TabsContent value="gantt">
              <GanttChart
                tasks={tasks.map(t => ({
                  id: t.id,
                  title: t.title,
                  dayStart: t.day_start,
                  dayEnd: t.day_end,
                  progress: t.progress,
                  status: t.status === 'done' ? 'completed' : t.status === 'in_progress' ? 'in-progress' : 'pending',
                  responsible: t.responsible,
                  phase: t.phase,
                }))}
                totalDays={30}
                currentDay={Math.min(30, Math.max(1, Math.ceil((Date.now() - new Date(tasks[0]?.id ? Date.now() : Date.now()).getTime()) / 86400000) + 1))}
                title="Cronograma de Implantação"
              />
            </TabsContent>

            {/* Tab: Agentes */}
            <TabsContent value="agentes">
              <AgentTaskManager agenteName="Sistema" />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Velocity */}
        <motion.div {...anim(4)}>
          <Card className="border-stone-300 bg-white/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">Velocidade do Projeto</p>
                  <p className="text-xs text-stone-500">Tarefas concluídas por dia</p>
                </div>
              </div>
              <p className="text-2xl font-semibold text-stone-900">{velocity}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
