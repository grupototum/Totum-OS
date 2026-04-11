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
import { Card, TechCard, ListItemCard } from "@/components/ui/card";

// Configuração visual de UI — apenas ícone e cor, sem dados de negócio
const AGENT_UI_CONFIG: Record<string, { icon: LucideIcon; color: string; group: 'chat' | 'orquestrador' | 'modos' | 'especializados' }> = {
  radar:         { icon: Search,       color: "from-orange-500 to-amber-500",   group: "chat" },
  gestor:        { icon: TrendingUp,   color: "from-emerald-500 to-teal-500",   group: "chat" },
  social:        { icon: Share2,       color: "from-violet-500 to-purple-500",  group: "chat" },
  atendente:     { icon: Headphones,   color: "from-sky-500 to-blue-500",       group: "chat" },
  sdr:           { icon: UserCheck,    color: "from-rose-500 to-pink-500",      group: "chat" },
  kimi:          { icon: Bot,          color: "from-cyan-500 to-sky-500",       group: "chat" },
  "ads-extractor": { icon: Megaphone,  color: "from-amber-500 to-yellow-500",  group: "chat" },
  tot:           { icon: Network,      color: "from-zinc-700 to-zinc-900",      group: "orquestrador" },
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
  git:           { icon: Github,       color: "from-zinc-600 to-zinc-800",      group: "especializados" },
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
    ui: AGENT_UI_CONFIG[agent.slug ?? ''] ?? { icon: Bot, color: "from-zinc-500 to-zinc-700", group: "especializados" as const },
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
      <div className="min-h-screen bg-black">
        {/* Header Section */}
        <div className="ds-container border-l border-r border-zinc-800 min-h-screen">
          
          {/* Header */}
          <div className="p-8 border-b border-zinc-800 animate-fade-slide-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-manrope text-3xl font-medium text-white tracking-tight">
                      Hub de Agentes
                    </h1>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
                      Central de Agentes · {totalCount} agentes disponíveis
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-900 p-1 border border-zinc-800">
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all bg-zinc-800 text-white"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => navigate('/agents')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all text-zinc-400 hover:text-white"
                  >
                    <Network className="w-4 h-4" />
                    Dashboard
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/agents')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Painel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/estrutura-time')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Estrutura
                </Button>
              </div>
            </div>
          </div>

          {/* Painel TOT — Tech Cards */}
          <div className="px-8 py-4 border-b border-zinc-800 bg-zinc-900/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TechCard label="System Status" className="min-h-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  <Network className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-manrope text-sm font-normal text-white">TOT - Orquestrador</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Coordena todos os modos e agentes especializados.
                </p>
              </TechCard>
              
              <TechCard label="System Status" className="min-h-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-manrope text-sm font-normal text-white">Modos de Operação</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Pablo (Executor), Data (Dev) e Hug (Atendimento).
                </p>
              </TechCard>
              
              <TechCard label="System Status" className="min-h-[160px]">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-amber-500" />
                  <h3 className="font-manrope text-sm font-normal text-white">Agentes Especializados</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Giles, Monk, Watson, WALL·E, EVE e mais.
                </p>
              </TechCard>
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 py-4 border-b border-zinc-800 bg-zinc-900/10">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#ef233c] animate-pulse" />
                <span className="text-sm text-zinc-400">
                  <span className="text-white font-semibold">{totalCount}</span> agentes disponíveis
                </span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">
                  <span className="text-white font-semibold">{chatCount}</span> de chat
                </span>
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">
                  <span className="text-white font-semibold">{especializadoCount}</span> especializados
                </span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="px-8 py-4 border-b border-zinc-800">
              <AdminPanel />
            </div>
          )}

          {/* Tabs */}
          <div className="px-8 py-4 border-b border-zinc-800">
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
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 text-xs ${
                    activeTab === tab.id ? 'bg-black/20' : 'bg-zinc-800 text-zinc-400'
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
              <div className="flex items-center justify-center py-20 gap-3 text-zinc-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Carregando agentes...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAgents.map((agent) => {
                  const Icon = agent.ui.icon;
                  const isChat = agent.ui.group === 'chat';
                  return (
                    <Card
                      key={agent.id}
                      cornerAccents={true}
                      className={`p-5 ${!isChat ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${agent.ui.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {agent.emoji && agent.ui.group !== 'chat' ? (
                            <span className="text-2xl">{agent.emoji}</span>
                          ) : (
                            <Icon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-manrope text-sm font-normal text-white truncate">{agent.name}</h3>
                            {isChat ? (
                              <span className="shrink-0 w-1.5 h-1.5 bg-emerald-500" />
                            ) : (
                              <span className="shrink-0 w-1.5 h-1.5 bg-amber-400" title="Sistema" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{agent.role}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          {isChat ? 'Chat' : 'Sistema'}
                        </span>
                        {isChat && (
                          <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
                            Abrir <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
