import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
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
  const pageTransition = usePageTransition();

  if (dashboardData.loading) {
    return (
      <AppLayout>
        <motion.div {...pageTransition}>
          <PageSkeleton />
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DashboardProvider value={dashboardData}>
        <motion.main {...pageTransition} className="p-6 max-w-7xl mx-auto" aria-label="Dashboard content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-sans text-2xl font-medium text-foreground tracking-tight">
                  DASHBOARD
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Mission Control · Visão geral do ecossistema
                </p>
              </div>
            </div>
          </motion.div>

          <section className="mb-6"><OverviewCards /></section>

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

          <section className="mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[10px] text-muted-foreground mb-4">MÉTRICAS AO LONGO DO TEMPO</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <VpsResourceChart />
              <ActivityVolumeChart />
            </div>
            <CostHistoryChart />
          </section>

          <section className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[10px] text-muted-foreground mb-4">TRINDADE — AGENTES IA</p>
            <AgentCards />
          </section>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center py-4 border-t border-border/20"
          >
            <p className="text-[11px] text-muted-foreground/40">
              Apps Totum v2.0.0 · Último deploy: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </motion.footer>
        </motion.main>
      </DashboardProvider>
    </AppLayout>
  );
}
