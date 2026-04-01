import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot, Zap, Users, TrendingUp, Search, LayoutGrid, List,
  Eye, Plus, FileText, ChevronRight,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

/* ─── types ─── */
interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  tasks: number;
  emoji: string | null;
  category: string | null;
  success_rate: number | null;
  daily_tasks: number | null;
}

interface Interaction {
  agent_name: string;
  date: string;
  interactions: number;
}

/* ─── constants ─── */
const CATEGORIES = ["Todos", "ADM", "Comercial", "Criação", "Técnico"];
const AGENT_COLORS: Record<string, string> = {
  Controlador: "hsl(28, 90%, 56%)",
  Cartógrafo: "hsl(200, 80%, 55%)",
  Vendedor: "hsl(140, 60%, 45%)",
  "Diretor de Arte": "hsl(280, 70%, 60%)",
  "Especialista CRM": "hsl(340, 70%, 55%)",
  Orquestrador: "hsl(45, 90%, 55%)",
  Atendente: "hsl(170, 60%, 45%)",
  "Gestor de Tráfego": "hsl(220, 70%, 55%)",
};
const CATEGORY_COLORS: Record<string, string> = {
  ADM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Comercial: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Criação: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Técnico: "bg-sky-500/20 text-sky-400 border-sky-500/30",
};

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 },
});

/* ─── component ─── */
export default function AgentsDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    async function load() {
      const [agRes, intRes] = await Promise.all([
        supabase.from("agents").select("*"),
        supabase.from("agent_interactions").select("*").order("date"),
      ]);
      if (agRes.data) setAgents(agRes.data as Agent[]);
      if (intRes.data) setInteractions(intRes.data as Interaction[]);
      setLoading(false);
    }
    load();

    const ch = supabase
      .channel("agents-dash")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "agents" }, () => {
        supabase.from("agents").select("*").then(({ data }) => { if (data) setAgents(data as Agent[]); });
      })
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "agent_interactions" }, () => {
        supabase.from("agent_interactions").select("*").order("date").then(({ data }) => { if (data) setInteractions(data as Interaction[]); });
      });
    ch.subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  /* derived */
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || a.category === category;
      return matchSearch && matchCat;
    });
  }, [agents, search, category]);

  const totalAgents = agents.length;
  const totalWorkflows = agents.reduce((s, a) => s + a.tasks, 0);
  const avgSuccess = agents.length
    ? Math.round(agents.reduce((s, a) => s + (a.success_rate ?? 0), 0) / agents.length)
    : 0;

  /* chart data: pivot interactions by date */
  const chartData = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    interactions.forEach(({ agent_name, date, interactions: count }) => {
      if (!map[date]) map[date] = {};
      map[date][agent_name] = count;
    });
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => {
        const d = new Date(date + "T12:00:00");
        return { day: dayNames[d.getDay()], ...vals };
      });
  }, [interactions]);

  const stats = [
    { label: "Total de Agentes", value: totalAgents, icon: Bot, emoji: "🤖" },
    { label: "Workflows Ativos", value: totalWorkflows, icon: Zap, emoji: "⚡" },
    { label: "Clientes Atendidos", value: 156, icon: Users, emoji: "👥" },
    { label: "Taxa de Sucesso", value: `${avgSuccess}%`, icon: TrendingUp, emoji: "📈" },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div {...anim(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
              TOTUM AGENTS
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Dashboard · Gerenciamento de Agentes IA
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...anim(i + 1)}>
              <Card className="border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                    {s.emoji}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-heading font-semibold text-foreground">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div {...anim(5)} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar agente..."
                className="pl-9 bg-secondary border-border/40 h-9 text-sm"
              />
            </div>
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Main content: Agents + Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Agents grid/list */}
          <div className="xl:col-span-2">
            {filtered.length === 0 ? (
              <Card className="border-border/40 bg-card/60 p-12 text-center">
                <Bot className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">Nenhum agente encontrado</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tente alterar os filtros ou a busca</p>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((agent, i) => (
                    <motion.div
                      key={agent.id}
                      layout
                      {...anim(i)}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Card
                        className="border-border/40 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl border border-border/40">
                                {agent.emoji}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{agent.name}</p>
                                <p className="text-xs text-muted-foreground">{agent.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${agent.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/40"}`} />
                              <span className="text-[10px] text-muted-foreground capitalize">{agent.status}</span>
                            </div>
                          </div>

                          <Badge variant="outline" className={`text-[10px] mb-3 ${CATEGORY_COLORS[agent.category ?? ""] ?? "bg-muted text-muted-foreground"}`}>
                            {agent.category}
                          </Badge>

                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span>{agent.daily_tasks ?? 0} tarefas hoje</span>
                            <span className="text-emerald-400">{agent.success_rate ?? 0}% sucesso</span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-3 text-xs text-primary hover:text-primary group-hover:bg-primary/10"
                          >
                            Ver detalhes <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card className="border-border/40 bg-card/80">
                <CardContent className="p-0 divide-y divide-border/30">
                  {filtered.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-4 p-4 hover:bg-secondary/40 cursor-pointer transition-colors"
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border border-border/40">
                        {agent.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.role}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[agent.category ?? ""] ?? ""}`}>
                        {agent.category}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${agent.status === "online" ? "bg-emerald-400" : "bg-muted-foreground/40"}`} />
                      </div>
                      <span className="text-xs text-muted-foreground">{agent.daily_tasks ?? 0} tarefas</span>
                      <span className="text-xs text-emerald-400">{agent.success_rate ?? 0}%</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Usage Chart */}
          <div className="xl:col-span-1">
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Uso dos Agentes (7 dias)</CardTitle>
                <p className="text-[10px] text-muted-foreground">Interações por agente</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="day" tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(0,0%,55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(0,0%,10%)",
                          border: "1px solid hsl(0,0%,18%)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "hsl(0,0%,70%)" }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                      />
                      {agents.map((agent) => (
                        <Line
                          key={agent.name}
                          type="monotone"
                          dataKey={agent.name}
                          stroke={AGENT_COLORS[agent.name] ?? "hsl(0,0%,50%)"}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div {...anim(8)} className="flex flex-wrap gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Novo Workflow
          </Button>
          <Button variant="outline" className="border-border/40">
            <Users className="w-4 h-4 mr-2" /> Adicionar Cliente
          </Button>
          <Button variant="outline" className="border-border/40">
            <FileText className="w-4 h-4 mr-2" /> Ver Relatórios
          </Button>
        </motion.div>

        {/* Agent Detail Dialog */}
        <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
          <DialogContent className="bg-card border-border/40 max-w-md">
            {selectedAgent && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl border border-border/40">
                      {selectedAgent.emoji}
                    </div>
                    <div>
                      <DialogTitle className="text-lg">{selectedAgent.name}</DialogTitle>
                      <p className="text-sm text-muted-foreground">{selectedAgent.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${selectedAgent.status === "online" ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground/40"}`} />
                        <span className="text-xs capitalize text-muted-foreground">{selectedAgent.status}</span>
                        <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[selectedAgent.category ?? ""] ?? ""}`}>
                          {selectedAgent.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Tarefas Hoje</p>
                      <p className="text-xl font-heading font-semibold text-foreground">{selectedAgent.daily_tasks ?? 0}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Taxa de Sucesso</p>
                      <p className="text-xl font-heading font-semibold text-emerald-400">{selectedAgent.success_rate ?? 0}%</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Total Tarefas</p>
                      <p className="text-xl font-heading font-semibold text-foreground">{selectedAgent.tasks}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                      <p className="text-xl font-heading font-semibold text-foreground capitalize">{selectedAgent.status}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Eye className="w-4 h-4 mr-2" /> Ver Perfil Completo
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
