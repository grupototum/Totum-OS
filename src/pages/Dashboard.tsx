import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { usePageTransition } from "@/hooks/usePageTransition";
import { PageSkeleton } from "@/components/loading";
import { PageHeader, SectionHeader } from "@/components/ui/patterns";
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
  SystemHealthScore,
  VpsLiveStatus,
  DatabaseStatus,
  InfraControls,
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
      <div className="min-h-screen">
      <DashboardProvider value={dashboardData}>
        <motion.main {...pageTransition} className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" aria-label="Dashboard content">
          <PageHeader
            eyebrow="Totum OS"
            title="Visão Geral"
            description="Painel inicial do sistema operacional da agência: agentes, Alexandria, fluxos, operação e infraestrutura crítica."
            icon={Sparkles}
          />

          <section><OverviewCards /></section>

          {/* System Health Score — destaque acima dos detalhes */}
          <section>
            <SystemHealthScore />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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

          <section>
            <SectionHeader title="Infraestrutura" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <VpsLiveStatus />
              <DatabaseStatus />
              <InfraControls />
            </div>
          </section>

          <section>
            <SectionHeader title="Métricas ao longo do tempo" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <VpsResourceChart />
              <ActivityVolumeChart />
            </div>
            <CostHistoryChart />
          </section>

          <section>
            <SectionHeader title="Trindade - Agentes IA" />
            <AgentCards />
          </section>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center py-4 border-t border-border/40"
          >
            <p className="text-[11px] text-muted-foreground/40">
              Totum OS v2.0.0 · Último deploy: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </motion.footer>
        </motion.main>
      </DashboardProvider>
      </div>
    </AppLayout>
  );
}
