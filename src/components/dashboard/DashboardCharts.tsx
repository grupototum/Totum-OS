import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, DollarSign, Activity } from "lucide-react";
import { useChartData } from "@/hooks/useChartData";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.4 },
});

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "11px",
    color: "hsl(var(--foreground))",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", fontWeight: 600, fontSize: "11px" },
};

function ChartSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl" />;
}

/* ─── VPS Resource Chart ─── */
export function VpsResourceChart() {
  const [selectedVps, setSelectedVps] = useState("VPS 7GB");
  const { vpsUsage, loading } = useChartData(selectedVps);

  if (loading) return <ChartSkeleton />;

  return (
    <motion.div {...anim(11)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Uso de Recursos (24h)
              <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">DADOS DE DEMONSTRAÇÃO</span>
            </h3>
            <div className="flex gap-1">
              {["VPS 7GB", "VPS KVM4"].map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedVps(name)}
                  className={`text-[10px] px-2.5 py-1 rounded-md transition-colors font-medium ${
                    selectedVps === name
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={vpsUsage} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="ram" name="RAM" stroke="hsl(var(--primary))" fill="url(#gradRam)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#3b82f6" fill="url(#gradCpu)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="disk" name="Disco" stroke="#22c55e" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Cost History Chart ─── */
export function CostHistoryChart() {
  const { costHistory, loading } = useChartData("VPS 7GB");

  if (loading) return <ChartSkeleton />;

  return (
    <motion.div {...anim(12)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Evolução de Custos (6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} formatter={(value: number) => `R$ ${value}`} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="ia" name="IAs Cloud" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tools" name="Ferramentas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hosting" name="Hospedagem" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Activity Volume Chart ─── */
export function ActivityVolumeChart() {
  const { activityStats, loading } = useChartData("VPS 7GB");

  if (loading) return <ChartSkeleton />;

  return (
    <motion.div {...anim(13)}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-5">
          <h3 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Atividades (Últimos 7 dias)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={activityStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="requests" name="Requisições" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
              <Line type="monotone" dataKey="messages" name="Mensagens" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="deployments" name="Deploys" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
