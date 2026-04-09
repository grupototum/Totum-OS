import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
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
  List,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";

// Todos os agentes do sistema
const AGENTS = {
  // Hub Principal - Agentes de Chat
  hub: [
    { id: "radar", name: "Radar de Insights", description: "Analise conteúdos e extraia insights estratégicos por departamento automaticamente.", icon: Search, color: "from-orange-500 to-amber-500", status: "ativo" as const, type: "chat" },
    { id: "gestor", name: "Gestor de Tráfego", description: "Gerencie campanhas de tráfego pago com relatórios e otimizações inteligentes.", icon: TrendingUp, color: "from-emerald-500 to-teal-500", status: "ativo" as const, type: "chat" },
    { id: "social", name: "Planejamento Social", description: "Planeje e organize conteúdo para redes sociais com calendário editorial.", icon: Share2, color: "from-violet-500 to-purple-500", status: "ativo" as const, type: "chat" },
    { id: "atendente", name: "Atendente Totum", description: "Atendimento inteligente com respostas automáticas e encaminhamento.", icon: Headphones, color: "from-sky-500 to-blue-500", status: "ativo" as const, type: "chat" },
    { id: "sdr", name: "SDR Comercial", description: "Qualifique leads e automatize o primeiro contato comercial.", icon: UserCheck, color: "from-rose-500 to-pink-500", status: "ativo" as const, type: "chat" },
    { id: "kimi", name: "Kimi", description: "Assistente de IA multiuso para tarefas diversas e automações.", icon: Bot, color: "from-cyan-500 to-sky-500", status: "ativo" as const, type: "chat" },
    { id: "ads-extractor", name: "Radar de Anúncios", description: "Extraia e analise anúncios de concorrentes com inteligência competitiva.", icon: Megaphone, color: "from-amber-500 to-yellow-500", status: "ativo" as const, type: "chat" },
  ],
  
  // Orquestrador e Modos
  orquestrador: [
    { id: "tot", name: "TOT", description: "Orquestrador geral do sistema. Coordena todos os agentes e garante a execução das tarefas.", icon: Network, color: "from-stone-700 to-stone-900", status: "ativo" as const, emoji: "🎛️" },
  ],
  
  modos: [
    { id: "pablo", name: "Pablo", description: "Modo Executor. Foca em execução rápida e eficiente de tarefas.", icon: Users, color: "from-blue-600 to-blue-800", status: "ativo" as const, emoji: "⚡" },
    { id: "data", name: "Data", description: "Modo Desenvolvedor. Focado em código, automações e integrações técnicas.", icon: Database, color: "from-green-600 to-green-800", status: "ativo" as const, emoji: "💻" },
    { id: "hug", name: "Hug", description: "Modo Atendimento. Especializado em comunicação com clientes e suporte.", icon: Heart, color: "from-rose-500 to-rose-700", status: "ativo" as const, emoji: "🤗" },
  ],
  
  // Agentes Especializados
  especializados: [
    { id: "giles", name: "Giles", description: "Bibliotecário. Gerencia documentação, arquivos e base de conhecimento.", icon: Library, color: "from-amber-600 to-amber-800", status: "novo" as const, emoji: "📚" },
    { id: "monk", name: "Monk", description: "Organização. Mantém tudo organizado, padronizado e categorizado.", icon: FolderTree, color: "from-indigo-500 to-indigo-700", status: "ativo" as const, emoji: "🧘" },
    { id: "watson", name: "Watson", description: "Análise. Analisa dados, métricas e extrai insights acionáveis.", icon: SearchCheck, color: "from-teal-500 to-teal-700", status: "ativo" as const, emoji: "🔍" },
    { id: "walle", name: "WALL·E", description: "Otimização. Busca constantemente formas de melhorar processos.", icon: RefreshCw, color: "from-orange-500 to-red-500", status: "ativo" as const, emoji: "🤖" },
    { id: "eve", name: "EVE", description: "Monitoramento. Vigia o sistema 24/7 e alerta sobre anomalias.", icon: Eye, color: "from-cyan-400 to-blue-500", status: "ativo" as const, emoji: "👁️" },
    { id: "rico", name: "RICO", description: "Testes. Garante qualidade através de testes automatizados.", icon: FlaskConical, color: "from-purple-500 to-pink-500", status: "ativo" as const, emoji: "🧪" },
    { id: "blo", name: "BLÔ", description: "Trends BR. Monitora tendências do mercado brasileiro.", icon: TrendIcon, color: "from-green-500 to-emerald-600", status: "ativo" as const, emoji: "🇧🇷" },
    { id: "chandler", name: "CHANDLER", description: "Social Media. Cria e cura conteúdo para redes sociais.", icon: MessageCircle, color: "from-pink-500 to-rose-500", status: "ativo" as const, emoji: "💬" },
    { id: "git", name: "GIT", description: "GitHub Scout. Analisa repositórios, PRs e atividade de código.", icon: Github, color: "from-gray-600 to-gray-800", status: "ativo" as const, emoji: "🐙" },
    { id: "radar-global", name: "RADAR", description: "Trends Global. Monitora tendências internacionais.", icon: Globe, color: "from-blue-500 to-indigo-600", status: "ativo" as const, emoji: "🌍" },
    { id: "transcritor", name: "TRANSCRITOR", description: "Vídeos. Transcreve e resume conteúdos de vídeo.", icon: Video, color: "from-red-500 to-orange-500", status: "ativo" as const, emoji: "📹" },
  ],
};

export default function Hub() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [viewMode, setViewMode] = useState<'grid' | 'n8n'>('grid');
  const [activeTab, setActiveTab] = useState<'todos' | 'chat' | 'modos' | 'especializados'>('todos');

  const allAgents = [...AGENTS.hub, ...AGENTS.orquestrador, ...AGENTS.modos, ...AGENTS.especializados];
  
  const filteredAgents = activeTab === 'todos' 
    ? allAgents 
    : activeTab === 'chat' 
      ? AGENTS.hub 
      : activeTab === 'modos' 
        ? [...AGENTS.orquestrador, ...AGENTS.modos]
        : AGENTS.especializados;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#EAEAE5]">
        <div className="max-w-[1400px] mx-auto border-l border-r border-stone-300 min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 border-b border-stone-300"
          >
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
                      Central de Agentes · {allAgents.length} agentes disponíveis
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-stone-900' 
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => navigate('/hub-agentes')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'n8n' 
                        ? 'bg-white shadow-sm text-stone-900' 
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    <Network className="w-4 h-4" />
                    N8N
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate('/painel-agentes')}
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
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-8 py-4 border-b border-stone-300 bg-[#E5E5E0]"
          >
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{allAgents.length}</span> agentes disponíveis
                </span>
              </div>
              <div className="h-4 w-px bg-stone-400" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-stone-500" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{AGENTS.hub.length}</span> de chat
                </span>
              </div>
              <div className="h-4 w-px bg-stone-400" />
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-stone-500" />
                <span className="text-sm text-stone-600">
                  <span className="text-stone-900 font-semibold">{AGENTS.especializados.length}</span> especializados
                </span>
              </div>
            </div>
          </motion.div>

          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-8 py-4 border-b border-stone-300"
            >
              <AdminPanel />
            </motion.div>
          )}

          {/* Tabs */}
          <div className="px-8 py-4 border-b border-stone-300">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Todos', count: allAgents.length },
                { id: 'chat', label: 'Chat', count: AGENTS.hub.length },
                { id: 'modos', label: 'Modos', count: AGENTS.modos.length + AGENTS.orquestrador.length },
                { id: 'especializados', label: 'Especializados', count: AGENTS.especializados.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <button
                    onClick={() => 'type' in agent && agent.type === 'chat' ? navigate(`/agent/${agent.id}`) : null}
                    className={`relative w-full text-left group cursor-pointer border border-border bg-card hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.25)] transition-all duration-500 p-5 overflow-hidden ${
                      'type' in agent && agent.type !== 'chat' ? 'opacity-80' : ''
                    }`}
                  >
                    {/* Corner marks */}
                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                    <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                    <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60 transition-all duration-500 group-hover:w-5 group-hover:h-5 group-hover:border-primary pointer-events-none" />
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {'emoji' in agent && agent.emoji ? (
                          <span className="text-2xl">{agent.emoji}</span>
                        ) : (
                          <agent.icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm text-stone-900 truncate">{agent.name}</h3>
                          {agent.status === 'novo' && (
                            <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-stone-900 text-white rounded-full">
                              Novo
                            </span>
                          )}
                          {'type' in agent && agent.status === 'ativo' && agent.type !== 'chat' && (
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" title="Em breve" />
                          )}
                          {'type' in agent && agent.type === 'chat' && (
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{agent.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                        {'type' in agent && agent.type === 'chat' ? 'Chat' : 'Sistema'}
                      </span>
                      {'type' in agent && agent.type === 'chat' && (
                        <span className="text-xs text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
                          Abrir <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-8 py-6 border-t border-stone-300 bg-[#E5E5E0]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-5 h-5 text-stone-600" />
                  <h3 className="font-medium text-stone-900">TOT - Orquestrador</h3>
                </div>
                <p className="text-sm text-stone-500">
                  O orquestrador principal coordena todos os modos e agentes especializados.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-medium text-stone-900">Modos de Operação</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Pablo (Executor), Data (Desenvolvedor) e Hug (Atendimento) são os três modos principais.
                </p>
              </div>

              <div className="p-4 bg-white rounded-lg border border-stone-300">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium text-stone-900">Agentes Especializados</h3>
                </div>
                <p className="text-sm text-stone-500">
                  Cada agente tem uma função específica: Giles (biblioteca), Monk (organização), Watson (análise), etc.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
