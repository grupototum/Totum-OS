import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mainAgents } from "@/data/agentHierarchy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, MessageSquare, Zap, Users, Brain,
  Activity, TrendingUp, AlertTriangle, CheckCircle2,
  BarChart3, Workflow, Settings2, Sparkles, Eye, Heart,
} from "lucide-react";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.3 },
});

/* ─── mock profile data per agent ─── */
const agentProfiles: Record<string, {
  personality: { traits: string[]; communication: string; decisionStyle: string; strengths: string[]; weaknesses: string[] };
  triggers: { name: string; condition: string; action: string; priority: "alta" | "média" | "baixa" }[];
  kpis: { label: string; value: string | number; target: string | number; unit: string; trend: "up" | "down" | "stable" }[];
  relationships: { name: string; type: string; strength: number }[];
}> = {
  atendente: {
    personality: {
      traits: ["Empático", "Organizado", "Proativo", "Resiliente", "Comunicativo"],
      communication: "Tom profissional e acolhedor. Usa linguagem clara e objetiva, sempre oferecendo alternativas e próximos passos.",
      decisionStyle: "Baseado em SLA e prioridade do cliente. Escala automaticamente quando detecta frustração ou urgência.",
      strengths: ["Gestão de filas", "Classificação de demandas", "Follow-ups automáticos", "Detecção de sentimento"],
      weaknesses: ["Decisões comerciais complexas", "Negociações de preço", "Contexto técnico profundo"],
    },
    triggers: [
      { name: "SLA Prestes a Vencer", condition: "Tempo de resposta > 80% do SLA", action: "Alerta + Escala para humano", priority: "alta" },
      { name: "Detecção de Churn", condition: "3+ reclamações em 7 dias", action: "Ativa protocolo de retenção", priority: "alta" },
      { name: "Novo Ticket", condition: "Mensagem recebida sem ticket", action: "Cria ticket + classifica", priority: "média" },
      { name: "Follow-up Pendente", condition: "Ticket sem resposta > 24h", action: "Envia lembrete automático", priority: "média" },
      { name: "Feedback Positivo", condition: "NPS >= 9", action: "Registra e notifica equipe", priority: "baixa" },
      { name: "Horário Fora do Expediente", condition: "Mensagem fora do horário", action: "Resposta automática + agenda retorno", priority: "baixa" },
    ],
    kpis: [
      { label: "Tempo Médio de Resposta", value: "1.2h", target: "2h", unit: "horas", trend: "up" },
      { label: "Taxa de Resolução", value: 94, target: 90, unit: "%", trend: "up" },
      { label: "NPS", value: 8.7, target: 8.0, unit: "pts", trend: "stable" },
      { label: "Tickets/Dia", value: 47, target: 40, unit: "tickets", trend: "up" },
      { label: "Escalações", value: 8, target: 15, unit: "%", trend: "up" },
      { label: "CSAT", value: 92, target: 85, unit: "%", trend: "up" },
    ],
    relationships: [
      { name: "Gestor de Tráfego", type: "Colaboração", strength: 85 },
      { name: "Radar Estratégica", type: "Dados", strength: 70 },
      { name: "SDR Comercial", type: "Encaminhamento", strength: 90 },
      { name: "Kimi", type: "Suporte Técnico", strength: 60 },
    ],
  },
  gestor: {
    personality: {
      traits: ["Analítico", "Otimizador", "Data-driven", "Ágil", "Estratégico"],
      communication: "Direto e baseado em dados. Apresenta números primeiro, depois recomendações. Usa gráficos e comparações.",
      decisionStyle: "ROI-driven. Toda decisão é baseada em métricas de performance e custo-benefício.",
      strengths: ["Otimização de budget", "Análise de criativos", "Detecção de anomalias", "Relatórios executivos"],
      weaknesses: ["Criação de conteúdo orgânico", "Atendimento direto ao cliente", "Tarefas administrativas"],
    },
    triggers: [
      { name: "CPA Acima do Limite", condition: "CPA > 120% da meta", action: "Pausa campanha + alerta", priority: "alta" },
      { name: "Budget Esgotando", condition: "Budget restante < 20%", action: "Notifica + sugere realocação", priority: "alta" },
      { name: "Anomalia de CTR", condition: "CTR < 50% da média", action: "Análise automática de criativos", priority: "média" },
      { name: "Oportunidade de Escala", condition: "ROAS > 3x por 3 dias", action: "Sugere aumento de budget", priority: "média" },
      { name: "Relatório Diário", condition: "Todos os dias às 9h", action: "Gera relatório automatizado", priority: "baixa" },
    ],
    kpis: [
      { label: "ROAS Médio", value: 4.2, target: 3.0, unit: "x", trend: "up" },
      { label: "CPA", value: "R$ 18", target: "R$ 25", unit: "R$", trend: "up" },
      { label: "CTR Médio", value: 3.8, target: 2.5, unit: "%", trend: "stable" },
      { label: "Campanhas Ativas", value: 23, target: 20, unit: "un", trend: "up" },
      { label: "Budget Gerenciado", value: "R$ 45k", target: "R$ 50k", unit: "R$", trend: "up" },
      { label: "Conversões/Dia", value: 127, target: 100, unit: "conv", trend: "up" },
    ],
    relationships: [
      { name: "Atendente Totum", type: "Dados de Cliente", strength: 85 },
      { name: "Radar Estratégica", type: "Criativos", strength: 95 },
      { name: "SDR Comercial", type: "Leads", strength: 80 },
      { name: "Kimi", type: "Automação", strength: 65 },
    ],
  },
  radar: {
    personality: {
      traits: ["Criativo", "Observador", "Trendsetter", "Curioso", "Inovador"],
      communication: "Visual e inspiracional. Usa referências, moodboards e exemplos. Linguagem criativa e engajante.",
      decisionStyle: "Baseado em trends, dados de engajamento e alinhamento com a marca do cliente.",
      strengths: ["Pesquisa de tendências", "Criação de hooks", "Planejamento editorial", "Reaproveitamento de conteúdo"],
      weaknesses: ["Gestão de budget", "Análise técnica de métricas", "Processos administrativos"],
    },
    triggers: [
      { name: "Trend Viral Detectada", condition: "Conteúdo com >1M views em 24h", action: "Alerta + sugere adaptação", priority: "alta" },
      { name: "Calendário Vazio", condition: "Menos de 3 posts planejados na semana", action: "Gera sugestões automáticas", priority: "alta" },
      { name: "Conteúdo Baixo Engajamento", condition: "Engajamento < 50% da média", action: "Análise e recomendações", priority: "média" },
      { name: "Nova Referência Coletada", condition: "Referência salva pelo usuário", action: "Analisa e categoriza", priority: "baixa" },
      { name: "Relatório Semanal", condition: "Toda sexta às 17h", action: "Gera relatório de conteúdo", priority: "baixa" },
    ],
    kpis: [
      { label: "Posts Planejados", value: 32, target: 25, unit: "posts", trend: "up" },
      { label: "Engajamento Médio", value: "4.5%", target: "3%", unit: "%", trend: "up" },
      { label: "Trends Detectadas", value: 18, target: 10, unit: "trends", trend: "up" },
      { label: "Hooks Criados", value: 45, target: 30, unit: "hooks", trend: "stable" },
      { label: "Reaproveitamentos", value: 12, target: 8, unit: "un", trend: "up" },
      { label: "Satisfação Cliente", value: 9.2, target: 8.5, unit: "pts", trend: "up" },
    ],
    relationships: [
      { name: "Gestor de Tráfego", type: "Criativos para Ads", strength: 95 },
      { name: "Atendente Totum", type: "Feedback de Cliente", strength: 75 },
      { name: "Kimi", type: "Automação Visual", strength: 70 },
      { name: "SDR Comercial", type: "Conteúdo de Vendas", strength: 60 },
    ],
  },
};

const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-destructive/20 text-destructive border-destructive/30",
  média: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  baixa: "bg-muted text-muted-foreground border-border/40",
};

const TREND_ICON: Record<string, { icon: typeof TrendingUp; class: string }> = {
  up: { icon: TrendingUp, class: "text-emerald-400" },
  down: { icon: AlertTriangle, class: "text-destructive" },
  stable: { icon: Activity, class: "text-amber-400" },
};

export default function AgentProfile() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [dbAgent, setDbAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const hierarchyAgent = mainAgents.find((a) => a.id === agentId);
  const profile = agentProfiles[agentId ?? ""];

  useEffect(() => {
    async function load() {
      if (!hierarchyAgent) { setLoading(false); return; }
      const { data } = await supabase.from("agents").select("*").ilike("name", `%${hierarchyAgent.name.split(" ")[0]}%`).limit(1);
      if (data && data.length > 0) setDbAgent(data[0]);
      setLoading(false);
    }
    load();
  }, [agentId, hierarchyAgent]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!hierarchyAgent || !profile) {
    return (
      <AppLayout>
        <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <Brain className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Agente não encontrado</p>
          <Button variant="outline" className="mt-4 border-border/40" onClick={() => navigate("/agents-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  const AgentIcon = hierarchyAgent.icon;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Back + Header */}
        <motion.div {...anim(0)}>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground mb-4" onClick={() => navigate("/agents-dashboard")}>
            <ArrowLeft className="w-3 h-3 mr-1" /> Voltar ao Dashboard
          </Button>

          <Card className="border-border/40 bg-card/80 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${hierarchyAgent.color}`} />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${hierarchyAgent.color} flex items-center justify-center shadow-lg`}>
                  <AgentIcon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="font-heading text-2xl font-semibold text-foreground">{hierarchyAgent.name}</h1>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400">Online</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{hierarchyAgent.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      {hierarchyAgent.subAgents.length} sub-agentes
                    </Badge>
                    {dbAgent && (
                      <>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          {dbAgent.success_rate ?? 0}% sucesso
                        </Badge>
                        <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-400 border-sky-500/30">
                          {dbAgent.tasks ?? 0} workflows
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate(hierarchyAgent.chatRoute)}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Abrir Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div {...anim(1)}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-secondary/60 border border-border/40 p-1 h-auto flex-wrap">
              <TabsTrigger value="overview" className="text-xs gap-1.5 data-[state=active]:bg-card"><Eye className="w-3.5 h-3.5" /> Visão Geral</TabsTrigger>
              <TabsTrigger value="personality" className="text-xs gap-1.5 data-[state=active]:bg-card"><Heart className="w-3.5 h-3.5" /> Personalidade</TabsTrigger>
              <TabsTrigger value="triggers" className="text-xs gap-1.5 data-[state=active]:bg-card"><Zap className="w-3.5 h-3.5" /> Gatilhos</TabsTrigger>
              <TabsTrigger value="kpis" className="text-xs gap-1.5 data-[state=active]:bg-card"><BarChart3 className="w-3.5 h-3.5" /> KPIs</TabsTrigger>
              <TabsTrigger value="relationships" className="text-xs gap-1.5 data-[state=active]:bg-card"><Users className="w-3.5 h-3.5" /> Relacionamentos</TabsTrigger>
            </TabsList>

            {/* ── Tab: Visão Geral ── */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.kpis.slice(0, 3).map((kpi, i) => {
                  const T = TREND_ICON[kpi.trend];
                  return (
                    <motion.div key={kpi.label} {...anim(i)}>
                      <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                            <T.icon className={`w-3.5 h-3.5 ${T.class}`} />
                          </div>
                          <p className="text-2xl font-heading font-semibold text-foreground">{kpi.value}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Meta: {kpi.target} {kpi.unit}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <Card className="border-border/40 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Sub-Agentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hierarchyAgent.subAgents.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => navigate(`/agentes/${agentId}/${sub.id}`)}>
                          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <SubIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{sub.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{sub.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab: Personalidade ── */}
            <TabsContent value="personality" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/40 bg-card/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Traços</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.personality.traits.map((t) => (
                        <Badge key={t} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /> Estilo de Decisão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{profile.personality.decisionStyle}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/40 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Estilo de Comunicação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.personality.communication}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/40 bg-card/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pontos Fortes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.personality.strengths.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-foreground">{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Limitações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.personality.weaknesses.map((w) => (
                      <div key={w} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-foreground">{w}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Tab: Gatilhos ── */}
            <TabsContent value="triggers" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                {(["alta", "média", "baixa"] as const).map((p) => (
                  <Card key={p} className="border-border/40 bg-card/80">
                    <CardContent className="p-4 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">{p === "alta" ? "🔴 Alta" : p === "média" ? "🟡 Média" : "⚪ Baixa"}</p>
                      <p className="text-2xl font-heading font-semibold text-foreground mt-1">
                        {profile.triggers.filter((t) => t.priority === p).length}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                {profile.triggers.map((trigger, i) => (
                  <motion.div key={trigger.name} {...anim(i)}>
                    <Card className="border-border/40 bg-card/80 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            <h4 className="text-sm font-medium text-foreground">{trigger.name}</h4>
                          </div>
                          <Badge variant="outline" className={`text-[10px] capitalize ${PRIORITY_COLORS[trigger.priority]}`}>
                            {trigger.priority}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          <div className="bg-secondary/30 rounded-lg p-3">
                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Condição</p>
                            <p className="text-xs text-foreground">{trigger.condition}</p>
                          </div>
                          <div className="bg-secondary/30 rounded-lg p-3">
                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Ação</p>
                            <p className="text-xs text-foreground">{trigger.action}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* ── Tab: KPIs ── */}
            <TabsContent value="kpis" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.kpis.map((kpi, i) => {
                  const T = TREND_ICON[kpi.trend];
                  const numVal = typeof kpi.value === "number" ? kpi.value : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""));
                  const numTarget = typeof kpi.target === "number" ? kpi.target : parseFloat(String(kpi.target).replace(/[^0-9.]/g, ""));
                  const pct = numTarget > 0 ? Math.min(100, Math.round((numVal / numTarget) * 100)) : 0;

                  return (
                    <motion.div key={kpi.label} {...anim(i)}>
                      <Card className="border-border/40 bg-card/80 hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                            <T.icon className={`w-3.5 h-3.5 ${T.class}`} />
                          </div>
                          <p className="text-3xl font-heading font-semibold text-foreground mb-1">{kpi.value}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                            <span>Meta: {kpi.target}</span>
                            <span className={pct >= 100 ? "text-emerald-400" : pct >= 80 ? "text-amber-400" : "text-destructive"}>{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ── Tab: Relacionamentos ── */}
            <TabsContent value="relationships" className="space-y-4">
              <Card className="border-border/40 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Workflow className="w-4 h-4 text-primary" /> Mapa de Relacionamentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.relationships.map((rel, i) => (
                    <motion.div key={rel.name} {...anim(i)} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{rel.name}</p>
                          <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border/40">{rel.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={rel.strength} className="h-1.5 flex-1" />
                          <span className="text-[10px] text-muted-foreground w-8 text-right">{rel.strength}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fluxo de Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {profile.relationships.map((rel) => (
                      <div key={rel.name} className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
                        <span className="text-xs font-medium text-primary">{hierarchyAgent.name.split(" ")[0]}</span>
                        <span className="text-[10px] text-muted-foreground">→</span>
                        <span className="text-xs text-foreground">{rel.name}</span>
                        <Badge variant="outline" className="text-[9px] bg-muted text-muted-foreground">{rel.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}
