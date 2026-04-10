import AppLayout from "@/components/layout/AppLayout";
import { useState } from "react";
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
  Network,
  Users,
  Brain,
  Database,
  Heart,
  Library,
  FolderTree,
  SearchCheck,
  RefreshCw,
  Eye,
  FlaskConical,
  TrendingUp as TrendIcon,
  MessageCircle,
  Github,
  Globe,
  Video,
  Grid3X3,
  ArrowRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/hooks/useAgents";

// Configuração visual de UI — apenas ícone e cor, sem dados de negócio
const AGENT_UI_CONFIG: Record<string, { icon: LucideIcon; color: string; group: 'chat' | 'orquestrador' | 'modos' | 'especializados' }> = {
  radar:         { icon: Search,       color: "from-orange-500 to-amber-500",   group: "chat" },
  gestor:        { icon: TrendingUp,   color: "from-emerald-500 to-teal-500",   group: "chat" },
  social:        { icon: Share2,       color: "from-violet-500 to-purple-500",  group: "chat" },
  atendente:     { icon: Headphones,   color: "from-sky-500 to-blue-500",       group: "chat" },
  sdr:           { icon: UserCheck,    color: "from-rose-500 to-pink-500",      group: "chat" },
  kimi:          { icon: Bot,          color: "from-cyan-500 to-sky-500",       group: "chat" },
  "ads-extractor": { icon: Megaphone,  color: "from-amber-500 to-yellow-500",  group: "chat" },
  tot:           { icon: Network,      color: "from-stone-700 to-stone-900",    group: "orquestrador" },
  pablo:         { icon: Users,        color: "from-blue-600 to-blue-800",      group: "modos" },
  data:          { icon: Database,     color: "from-green-600 to-green-800",    group: "modos" },
  hug:           { icon: Heart,        color: "from-rose-500 to-rose-700",      group: "modos" },
  giles:         { icon: Library,      color: "from-amber-600 to-amber-800",    group: "especializados" },
  monk:          { icon: FolderTree,   color: "from-indigo-500 to-indigo-700",  group: "especializados" },
  watson:        { icon: SearchCheck,  color: "from-teal-500 to-teal-700",      group: "especializados" },
  walle:         { icon: RefreshCw,    color: "from-orange-500 to-red-500",     group: "especializados" },
  eve:           { icon: Eye,          color: "from-cyan-400 to-blue-500",      group: "especializados" },
  rico:          { icon: FlaskConical, color: "from-purple-500 to-pink-500",    group: "especializados" },
  blo:           { icon: TrendIcon,    color: "from-green-500 to-emerald-600",  group: "especializados" },
  chandler:      { icon: MessageCircle,color: "from-pink-500 to-rose-500",      group: "especializados" },
  git:           { icon: Github,       color: "from-gray-600 to-gray-800",      group: "especializados" },
  "radar-global":{ icon: Globe,        color: "from-blue-500 to-indigo-600",    group: "especializados" },
  transcritor:   { icon: Video,        color: "from-red-500 to-orange-500",     group: "especializados" },
};

type TabType = 'todos' | 'chat' | 'modos' | 'especializados';

export default function Hub() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { agents, isLoading } = useAgents();
  const [activeTab, setActiveTab] = useState<TabType>('todos');

  // Enriches each agent from DB with its UI config
  const enrichedAgents = agents.map((agent) => ({
    ...agent,
    ui: AGENT_UI_CONFIG[agent.slug ?? ''] ?? { icon: Bot, color: "from-stone-500 to-stone-700", group: "especializados" as const },
  }));

  const byGroup = {
    chat: enrichedAgents.filter(a => a.ui.group === 'chat'),
    orquestrador: enrichedAgents.filter(a => a.ui.group === 'orquestrador'),
    modos: enrichedAgents.filter(a => a.ui.group === 'modos'),
    especializados: enrichedAgents.filter(a => a.ui.group === 'especializados'),
  };

  const filteredAgents =
    activeTab === 'todos'        ? enrichedAgents :
    activeTab === 'chat'         ? byGroup.chat :
    activeTab === 'modos'        ? [...byGroup.orquestrador, ...byGroup.modos] :
                                   byGroup.especializados;

  const chatCount        = byGroup.chat.length;
  const especializadoCount = byGroup.especializados.length;
  const totalCount       = enrichedAgents.length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#EAEAE5]">
        <div className="max-w-[1400px] mx-auto border-l border-r border-stone-300 min-h-screen">

          {/* Header */}
          <div className="p-8 border-b border-stone-300 totum-reveal active">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
                      Hub de Agentes
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-stone-500">
                      Central de Agentes · {totalCount} agentes disponíveis
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-300">
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow-sm text-stone-900"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => navigate('/agents')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all text-stone-500 hover:text-stone-700"
                  >
                    <Network className="w-4 h-4" />
                    Dashboard
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/agents')}
                  className="border-stone-300"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Painel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/estrutura-time')}
                  className="border-stone-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Estrutura
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 py-4 border-b border-stone-300 bg-[#E5E5E0]">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{totalCount}</span> agentes disponíveis
                </span>
              </div>
              <div className="h-4 w-px bg-stone-400" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-stone-500" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{chatCount}</span> de chat
                </span>
              </div>
              <div className="h-4 w-px bg-stone-400" />
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-stone-500" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{especializadoCount}</span> especializados
                </span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="px-8 py-4 border-b border-stone-300">
              <AdminPanel />
            </div>
          )}

          {/* Tabs */}
          <div className="px-8 py-4 border-b border-stone-300">
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'todos' as TabType,        label: 'Todos',          count: totalCount },
                { id: 'chat' as TabType,         label: 'Chat',           count: chatCount },
                { id: 'modos' as TabType,        label: 'Modos',          count: byGroup.modos.length + byGroup.orquestrador.length },
                { id: 'especializados' as TabType, label: 'Especializados', count: especializadoCount },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-stone-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Agent Grid */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-stone-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Carregando agentes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAgents.map((agent) => {
                  const Icon = agent.ui.icon;
                  const isChat = agent.ui.group === 'chat';
                  return (
                    <button
                      key={agent.id}
                      onClick={() => isChat ? navigate(`/agents/${agent.id}/chat`) : undefined}
                      className={`relative w-full text-left group border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)] transition-all duration-500 p-5 overflow-hidden ${
                        !isChat ? 'cursor-default opacity-80' : 'cursor-pointer'
                      }`}
                    >
                      {/* Corner marks */}
                      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />

                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.ui.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {agent.emoji && agent.ui.group !== 'chat' ? (
                            <span className="text-2xl">{agent.emoji}</span>
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm text-stone-900 truncate">{agent.name}</h3>
                            {isChat ? (
                              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            ) : (
                              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" title="Sistema" />
                            )}
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{agent.role}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                          {isChat ? 'Chat' : 'Sistema'}
                        </span>
                        {isChat && (
                          <span className="text-xs text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
                            Abrir <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-8 py-6 border-t border-stone-300 bg-[#E5E5E0]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-card border border-border relative group overflow-hidden hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-5 h-5 text-stone-600" />
                  <h3 className="font-medium text-stone-900">TOT - Orquestrador</h3>
                </div>
                <p className="text-sm text-stone-500">
                  O orquestrador principal coordena todos os modos e agentes especializados.
                </p>
              </div>
              <div className="p-4 bg-card border border-border relative group overflow-hidden hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-medium text-stone-900">Modos de Operação</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Pablo (Executor), Data (Desenvolvedor) e Hug (Atendimento) são os três modos principais.
                </p>
              </div>
              <div className="p-4 bg-card border border-border relative group overflow-hidden hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)] transition-all duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium text-stone-900">Agentes Especializados</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Cada agente tem uma função específica: Giles (biblioteca), Monk (organização), Watson (análise), etc.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
