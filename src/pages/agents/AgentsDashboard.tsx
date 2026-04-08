import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import {
  Bot, Zap, Users, TrendingUp, Search, LayoutGrid, List, BarChart3,
  ChevronRight, Plus, FileText, Filter,
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
const CATEGORY_COLORS: Record<string, string> = {
  ADM: "bg-amber-100 text-amber-800 border-amber-200",
  Comercial: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Criação: "bg-violet-100 text-violet-800 border-violet-200",
  Técnico: "bg-sky-100 text-sky-800 border-sky-200",
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
            updated_at: agent.created_at || new Date().toISOString(),
            tasks: agent.tasks || 0,
            tasks_completed: agent.tasks || 0,
            success_rate: agent.success_rate || 0,
            daily_tasks: agent.daily_tasks || 0,
            credits_used: 0,
            effectiveness_score: agent.success_rate || 0,
            parent_id: undefined,
            hierarchy_level: 0,
            is_orchestrator: false,
          }));
          setAgents(typedAgents);
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
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "agents" }, () => {
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
              updated_at: agent.created_at || new Date().toISOString(),
              tasks: agent.tasks || 0,
            tasks_completed: agent.tasks || 0,
              success_rate: agent.success_rate || 0,
              daily_tasks: agent.daily_tasks || 0,
              credits_used: 0,
              effectiveness_score: agent.success_rate || 0,
              parent_id: undefined,
              hierarchy_level: 0,
              is_orchestrator: false,
            }));
            setAgents(typedAgents);
          }
        }); 
      })
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "agent_interactions" }, () => {
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

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    navigate(`/agents/${agent.id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6" style={{ backgroundColor: '#EAEAE5', minHeight: '100vh' }}>
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
      <div className="min-h-screen p-6" style={{ backgroundColor: '#EAEAE5' }}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div {...anim(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                TOTUM AGENTS
              </h1>
              <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                Dashboard · Gerenciamento de Agentes IA
              </p>
            </div>
            <Button 
              className="bg-stone-900 hover:bg-stone-800 text-white"
              onClick={() => navigate('/agents/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agente
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...anim(i + 1)}>
                <Card className="border-stone-300 bg-[#EAEAE5] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center text-2xl">
                      {s.emoji}
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">{s.label}</p>
                      <p className="text-2xl font-semibold text-stone-900">{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters & View Toggle */}
          <motion.div {...anim(5)} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    category === cat
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 items-center w-full lg:w-auto">
              <div className="relative flex-1 lg:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar agente..."
                  className="pl-9 bg-white border-stone-300 h-9 text-sm"
                />
              </div>
              
              <div className="flex bg-white rounded-lg border border-stone-300 p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" 
                      ? "bg-stone-900 text-white" 
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                  title="Vista em Lista"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("graph")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "graph" 
                      ? "bg-stone-900 text-white" 
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                  title="Vista em Grafo"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("stats")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "stats" 
                      ? "bg-stone-900 text-white" 
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                  title="Vista de Estatísticas"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left/Top: Agent Views */}
            <div className="xl:col-span-2">
              {filtered.length === 0 ? (
                <Card className="border-stone-300 bg-[#EAEAE5] p-12 text-center">
                  <Bot className="w-16 h-16 mx-auto text-stone-400 mb-4" />
                  <p className="text-stone-500">Nenhum agente encontrado</p>
                  <p className="text-xs text-stone-400 mt-1">Tente alterar os filtros ou a busca</p>
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
            </div>

            {/* Right/Bottom: Usage Chart */}
            <div className="xl:col-span-1">
              <Card className="border-stone-300 bg-[#EAEAE5] h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-stone-900">
                    Uso dos Agentes (7 dias)
                  </CardTitle>
                  <p className="text-[10px] text-stone-500">Interações por agente</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis 
                          dataKey="day" 
                          tick={{ fill: "#78716C", fontSize: 11 }} 
                          axisLine={false} 
                          tickLine={false} 
                        />
                        <YAxis 
                          tick={{ fill: "#78716C", fontSize: 11 }} 
                          axisLine={false} 
                          tickLine={false} 
                          width={30} 
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1C1917",
                            border: "1px solid #44403C",
                            borderRadius: 8,
                            fontSize: 12,
                            color: 'white'
                          }}
                          labelStyle={{ color: "#D6D3D1" }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                        
                        {agents.slice(0, 5).map((agent) => (
                          <Line
                            key={agent.name}
                            type="monotone"
                            dataKey={agent.name}
                            stroke={AGENT_COLORS[agent.name] ?? "#78716C"}
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
            <Button className="bg-stone-900 hover:bg-stone-800 text-white">
              <Plus className="w-4 h-4 mr-2" /> 
              Novo Workflow
            </Button>
            <Button variant="outline" className="border-stone-300 bg-white">
              <Users className="w-4 h-4 mr-2" /> 
              Adicionar Cliente
            </Button>
            <Button variant="outline" className="border-stone-300 bg-white">
              <FileText className="w-4 h-4 mr-2" /> 
              Ver Relatórios
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
