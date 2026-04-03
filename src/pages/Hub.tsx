import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Share2,
  Headphones,
  UserCheck,
  Bot,
  Megaphone,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import AdminPanel from "@/components/AdminPanel";

const agents = [
  { id: "radar", name: "Radar de Insights", description: "Analise conteúdos e extraia insights estratégicos por departamento automaticamente.", icon: Search, color: "from-orange-500 to-amber-500", status: "ativo" as const },
  { id: "gestor", name: "Gestor de Tráfego", description: "Gerencie campanhas de tráfego pago com relatórios e otimizações inteligentes.", icon: TrendingUp, color: "from-emerald-500 to-teal-500", status: "ativo" as const },
  { id: "social", name: "Planejamento Social", description: "Planeje e organize conteúdo para redes sociais com calendário editorial.", icon: Share2, color: "from-violet-500 to-purple-500", status: "ativo" as const },
  { id: "atendente", name: "Atendente Totum", description: "Atendimento inteligente com respostas automáticas e encaminhamento.", icon: Headphones, color: "from-sky-500 to-blue-500", status: "ativo" as const },
  { id: "sdr", name: "SDR Comercial", description: "Qualifique leads e automatize o primeiro contato comercial.", icon: UserCheck, color: "from-rose-500 to-pink-500", status: "ativo" as const },
  { id: "kimi", name: "Kimi", description: "Assistente de IA multiuso para tarefas diversas e automações.", icon: Bot, color: "from-cyan-500 to-sky-500", status: "ativo" as const },
  { id: "ads-extractor", name: "Radar de Anúncios", description: "Extraia e analise anúncios de concorrentes com inteligência competitiva.", icon: Megaphone, color: "from-amber-500 to-yellow-500", status: "ativo" as const },
];

export default function Hub() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-medium text-foreground tracking-tight">
                HUB DE AGENTES
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Selecione um agente para começar
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6 mb-8 px-4 py-3 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              <span className="text-foreground font-semibold">{agents.length}</span> agentes disponíveis
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Todos operacionais</span>
          </div>
        </motion.div>

        {isAdmin && <div className="mb-6"><AdminPanel /></div>}

        {/* Agent Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <button
                onClick={() => navigate(`/agent/${agent.id}`)}
                className="w-full text-left group cursor-pointer border border-border bg-card rounded-2xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <agent.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm text-foreground truncate">{agent.name}</h3>
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="label-industrial text-[10px] text-muted-foreground">{agent.status}</span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">Abrir →</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
