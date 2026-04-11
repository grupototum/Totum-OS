import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bot, Zap, Users, TrendingUp, Search, LayoutGrid, List, BarChart3,
  Plus, FileText,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { Agent } from "@/hooks/useAgents";
import { AgentList } from "./components/AgentList";
import { AgentGraph } from "./components/AgentGraph";
import { AgentStats } from "./components/AgentStats";

/* ─── types ─── */
interface Interaction {
  agent_name: string;
  date: string;
  interactions: number;
}

type ViewMode = "list" | "graph" | "stats";

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

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35 },
});

/* ─── component ─── */
export default function AgentsDashboard() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      try {
        const [agRes, intRes] = await Promise.all([
          supabase.from("agents").select("*"),
          supabase.from("agent_interactions").select("*").order("date"),
        ]);

        if (!isMounted) return;

        if (agRes.data) {
          const typedAgents = (agRes.data || []).map(agent => ({
            id: agent.id,
            name: agent.name,
            role: agent.role,
            status: (agent.status as Agent['status']) || 'offline',
            type: inferType(agent.category),
            category: agent.category || 'geral',
            emoji: agent.emoji || '🤖',
            created_at: agent.created_at || new Date().toISOString(),
            tasks: agent.tasks || 0,
            tasks_completed: agent.tasks || 0,
            success_rate: agent.success_rate || 0,
            daily_tasks: agent.daily_tasks || 0,
            credits_used: 0,
            parent_id: undefined,
            hierarchy_level: 0,
            is_orchestrator: false,
          }));
          setAgents(typedAgents as Agent[]);
        }
        if (intRes.data) setInteractions(intRes.data as Interaction[]);
      } catch (error) {
        console.error("Erro ao carregar dados dos agentes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    channel = supabase
      .channel("agents-dash")
      .on("postgres_changes" as never, { event: "*", schema: "public", table: "agents" }, () => {
        if (!isMounted) return;
        supabase.from("agents").select("*").then(({ data }) => {
          if (data && isMounted) {
            const typedAgents = (data || []).map(agent => ({
              id: agent.id,
              name: agent.name,
              role: agent.role,
              status: (agent.status as Agent['status']) || 'offline',
              type: inferType(agent.category),
              category: agent.category || 'geral',
              emoji: agent.emoji || '🤖',
              created_at: agent.created_at || new Date().toISOString(),
              tasks: agent.tasks || 0,
              tasks_completed: agent.tasks || 0,
              success_rate: agent.success_rate || 0,
              daily_tasks: agent.daily_tasks || 0,
              credits_used: 0,
              parent_id: undefined,
              hierarchy_level: 0,
              is_orchestrator: false,
            }));
            setAgents(typedAgents as Agent[]);
          }
        });
      })
      .on("postgres_changes" as never, { event: "*", schema: "public", table: "agent_interactions" }, () => {
        if (!isMounted) return;
        supabase.from("agent_interactions").select("*").order("date").then(({ data }) => {
          if (data && isMounted) setInteractions(data as Interaction[]);
        });
      });
    channel.subscribe();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  function inferType(category: string | null): 'conversational' | 'processing' {
    const conversationalCategories = ['atendimento', 'chat', 'sdr', 'comercial'];
    return conversationalCategories.some(c => (category || '').toLowerCase().includes(c))
      ? 'conversational'
      : 'processing';
  }

  /* derived */
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || a.category === category;
      return matchSearch && matchCat;
    });
  }, [agents, search, category]);

  const totalAgents = agents.length;
  const totalWorkflows = agents.reduce((s, a) => s + (a.tasks_completed || 0), 0);
  const avgSuccess = agents.length
    ? Math.round(agents.reduce((s, a) => s + (a.success_rate || 0), 0) / agents.length)
    : 0;

  /* chart data */
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
    { label: "Total de Agentes", value: totalAgents, emoji: "🤖" },
    { label: "Workflows Ativos", value: totalWorkflows, emoji: "⚡" },
    { label: "Clientes Atendidos", value: 156, emoji: "👥" },
    { label: "Taxa de Sucesso", value: `${avgSuccess}%`, emoji: "📈" },
  ];

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    navigate(`/agents/${agent.id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background min-h-screen">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
          <Skeleton className="h-[260px] w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-8">

          {/* ─── Header ─── */}
          <motion.div {...anim(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                TOTUM AGENTS
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                Dashboard · Gerenciamento de Agentes IA
              </p>
            </div>

            {/* All action buttons aligned in header */}
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-foreground hover:bg-foreground/90 text-background"
                onClick={() => navigate('/agents/new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agente
              </Button>
              <Button
                className="bg-foreground hover:bg-foreground/90 text-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Workflow
              </Button>
              <Button variant="outline" className="border-border bg-card">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
              <Button variant="outline" className="border-border bg-card">
                <FileText className="w-4 h-4 mr-2" />
                Ver Relatórios
              </Button>
            </div>
          </motion.div>

          {/* ─── Stats ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...anim(i + 1)}>
                <Card className="border-border bg-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-2xl">
                      {s.emoji}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                      <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ─── Filters & View Toggle ─── */}
          <motion.div {...anim(5)} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    category === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center w-full lg:w-auto">
              <div className="relative flex-1 lg:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar agente..."
                  className="pl-9 bg-card border-border h-9 text-sm"
                />
              </div>

              <div className="flex bg-card rounded-lg border border-border p-1">
                {([
                  { mode: "list" as ViewMode, icon: List, title: "Vista em Lista" },
                  { mode: "graph" as ViewMode, icon: LayoutGrid, title: "Vista em Grafo" },
                  { mode: "stats" as ViewMode, icon: BarChart3, title: "Vista de Estatísticas" },
                ] as const).map(({ mode, icon: Icon, title }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === mode
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={title}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── Usage Chart — full width horizontal ─── */}
          <motion.div {...anim(6)}>
            <Card className="border-border bg-card w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  Uso dos Agentes (7 dias)
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">Interações por agente</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "hsl(var(--foreground))",
                        }}
                        labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                      {agents.slice(0, 5).map((agent) => (
                        <Line
                          key={agent.name}
                          type="monotone"
                          dataKey={agent.name}
                          stroke={AGENT_COLORS[agent.name] ?? "hsl(var(--muted-foreground))"}
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
          </motion.div>

          {/* ─── Agent Views — full width ─── */}
          <motion.div {...anim(7)}>
            {filtered.length === 0 ? (
              <Card className="border-border bg-card p-12 text-center">
                <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum agente encontrado</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tente alterar os filtros ou a busca</p>
              </Card>
            ) : viewMode === "list" ? (
              <AgentList
                agents={filtered}
                onAgentClick={handleAgentClick}
                selectedAgentId={selectedAgentId}
              />
            ) : viewMode === "graph" ? (
              <AgentGraph
                agents={filtered}
                onAgentClick={handleAgentClick}
                selectedAgentId={selectedAgentId}
              />
            ) : (
              <AgentStats agents={filtered} />
            )}
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}
