import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogOut, ArrowLeft } from "lucide-react";
import { VpsResourceChart, CostHistoryChart, ActivityVolumeChart } from "@/components/dashboard/DashboardCharts";
import {
  OverviewCards,
  AppStatusList,
  ActivityLog,
  ResourceUsage,
  CostEstimate,
  MexSync,
  AgentCards,
  DashboardProvider,
} from "@/components/dashboard/DashboardWidgets";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const dashboardData = useDashboardData();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardProvider value={dashboardData}>
    <div className="min-h-screen bg-background">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* ─── HEADER ─── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Apps Totum{" "}
                <span className="text-muted-foreground font-normal">— Dashboard Unificado</span>
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Mission Control · Visão geral do ecossistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-lg border border-border/40">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
            <span className="text-xs text-muted-foreground hidden md:block">{user?.email}</span>
            <button
              onClick={() => navigate("/hub")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Hub
            </button>
            <button
              onClick={() => { signOut(); navigate("/login"); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </motion.header>

        {/* ─── OVERVIEW CARDS ─── */}
        <section className="mb-6">
          <OverviewCards />
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3 space-y-6">
            <AppStatusList />
            <ActivityLog />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ResourceUsage />
            <CostEstimate />
            <MexSync />
          </div>
        </div>

        {/* ─── AGENTS (TRINDADE) ─── */}
        <section className="mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4"
          >
            Trindade — Agentes IA
          </motion.h2>
          <AgentCards />
        </section>

        {/* ─── FOOTER ─── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center py-4 border-t border-border/20"
        >
          <p className="text-[11px] text-muted-foreground/40">
            Apps Totum v1.0.0 · Último deploy: {new Date().toLocaleDateString("pt-BR")} {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </motion.footer>
      </div>
    </div>
    </DashboardProvider>
  );
}
