import AppLayout from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mainAgents } from "@/data/agentHierarchy";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Settings2, Activity } from "lucide-react";

export default function SubAgentPage() {
  const { agentId, subId } = useParams<{ agentId: string; subId: string }>();
  const navigate = useNavigate();

  const parent = mainAgents.find((a) => a.id === agentId);
  const sub = parent?.subAgents.find((s) => s.id === subId);

  if (!parent || !sub) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Sub-agente não encontrado.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <button onClick={() => navigate("/hub")} className="hover:text-foreground transition-colors">Hub</button>
          <span>/</span>
          <button onClick={() => navigate(`/agentes/${parent.id}`)} className="hover:text-foreground transition-colors">{parent.name}</button>
          <span>/</span>
          <span className="text-foreground font-medium">{sub.name}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${parent.color}/20 flex items-center justify-center`}>
              <sub.icon className={`w-6 h-6 ${parent.accentClass}`} />
            </div>
            <div>
              <h1 className="font-heading text-xl font-medium text-foreground tracking-tight">
                {sub.name.toUpperCase()}
              </h1>
              <p className="text-sm text-muted-foreground">{sub.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Status</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Operacional</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nível</span>
                <span className="text-foreground font-medium">2</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Agente pai</span>
                <span className="text-foreground font-medium">{parent.name}</span>
              </div>
            </div>
          </motion.div>

          {/* Config placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <Settings2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Configurações</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                EM BREVE
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">Configurações específicas deste sub-agente.</p>
            </div>
          </motion.div>
        </div>

        {/* Chat button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <button
            onClick={() => navigate(parent.chatRoute)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-400 text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="w-4 h-4" />
            Conversar com {parent.name}
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
