import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { FileCheck, Bell, BarChart3, Clock, AlertTriangle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const planned = [
  { icon: FileCheck, text: "Biblioteca de POPs" },
  { icon: BarChart3, text: "Métricas de SLA em tempo real" },
  { icon: AlertTriangle, text: "Alertas de violação" },
  { icon: Clock, text: "Histórico de atendimento" },
  { icon: Trophy, text: "Benchmarks por departamento" },
];

export default function PopSlaPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-medium text-foreground tracking-tight">
                POP E SLA
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Procedimentos Operacionais Padrão
              </p>
            </div>
          </div>
        </motion.div>

        {/* Coming soon card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-8 text-center"
        >
          <div className="text-4xl mb-4">🚧</div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">
            EM BREVE
          </Badge>
          <h2 className="font-heading text-xl text-foreground mb-2">
            Sistema POP/SLA Interativo
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Estamos desenvolvendo um sistema completo de procedimentos operacionais e
            métricas de SLA para toda a equipe Totum.
          </p>

          <div className="space-y-3 max-w-sm mx-auto text-left">
            {planned.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 px-6 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors inline-flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notificar quando disponível
          </motion.button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
