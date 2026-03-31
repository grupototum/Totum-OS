import AppLayout from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { mainAgents } from "@/data/agentHierarchy";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function AgentParentPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const agent = mainAgents.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Agente não encontrado.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <button onClick={() => navigate("/hub")} className="hover:text-foreground transition-colors">Hub</button>
          <span>/</span>
          <span className="text-foreground font-medium">{agent.name}</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}>
              <agent.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-medium text-foreground tracking-tight">
                {agent.name.toUpperCase()}
              </h1>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6 mb-8 px-4 py-3 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              <span className="text-foreground font-semibold">{agent.subAgents.length}</span> sub-agentes
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => navigate(agent.chatRoute)}
            className="text-xs text-primary font-medium hover:underline"
          >
            Abrir Chat →
          </button>
        </motion.div>

        {/* Sub-agents grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agent.subAgents.map((sub, i) => (
            <motion.button
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              onClick={() => navigate(`/agentes/${agent.id}/${sub.id}`)}
              className="text-left group border border-border bg-card rounded-2xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 p-5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color}/20 flex items-center justify-center shrink-0`}>
                  <sub.icon className={`w-5 h-5 ${agent.accentClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sub.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
