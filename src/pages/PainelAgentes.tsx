import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { AgentMetrics, AgentCard } from '@/components/agents';
import { useAgents } from '@/hooks/useAgents';
import { useAgentClassification } from '@/hooks/useAgentClassification';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const FILTERS = ['Todos', 'Conversacional', 'Processamento', 'Online', 'Novo'] as const;
type FilterType = typeof FILTERS[number];

export default function PainelAgentes() {
  const navigate = useNavigate();
  const { agents, isLoading: loading } = useAgents();
  const { classifiedAgents } = useAgentClassification(agents);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('Todos');

  const filteredAgents = classifiedAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
                         agent.role.toLowerCase().includes(search.toLowerCase());
    
    switch (filter) {
      case 'Conversacional':
        return matchesSearch && agent.classification.type === 'conversational';
      case 'Processamento':
        return matchesSearch && agent.classification.type === 'processing';
      case 'Online':
        return matchesSearch && agent.status === 'online';
      case 'Novo':
        return matchesSearch && isNewAgent(agent.created_at);
      default:
        return matchesSearch;
    }
  });

  const newAgentsCount = agents.filter(a => isNewAgent(a.created_at)).length;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#EAEAE5]">
        {/* Container with visible borders */}
        <div className="max-w-[1400px] mx-auto border-l border-r border-stone-300 min-h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 border-b border-stone-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center">
                    <Icon icon="solar:users-group-rounded-linear" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-medium text-stone-900 tracking-tighter">
                      Painel de Agentes
                    </h1>
                    <p className="text-xs uppercase tracking-widest text-stone-500">
                      Central de Gestão · {agents.length} agentes
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-stone-300">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm text-stone-600">{metrics.onlineAgents} online</span>
                </div>
                {newAgentsCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-stone-900 rounded-lg">
                    <Icon icon="solar:sparkles-linear" className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">{newAgentsCount} novo{newAgentsCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="p-8 border-b border-stone-300">
            <AgentMetrics metrics={metrics} loading={loading} />
          </div>

          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="p-8 border-b border-stone-300 bg-[#E5E5E0]"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`
                      px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-md transition-all
                      ${filter === f
                        ? 'bg-stone-900 text-white'
                        : 'bg-white text-stone-600 border border-stone-300 hover:border-stone-400'
                      }
                    `}
                  >
                    {f}
                    {f === 'Novo' && newAgentsCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-full text-[9px]">
                        {newAgentsCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon 
                    icon="solar:magnifer-linear" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" 
                  />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar agente..."
                    className="pl-10 bg-white border-stone-300 focus:border-stone-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Agents Grid */}
          <div className="p-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-stone-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredAgents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-200 flex items-center justify-center">
                  <Icon icon="solar:ghost-linear" className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-medium text-stone-900 mb-1">Nenhum agente encontrado</h3>
                <p className="text-sm text-stone-500">Tente ajustar os filtros ou a busca</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    index={index}
                    onClick={() => navigate(`/agente/${agent.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Grid guides */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-12 h-full max-w-[1400px] mx-auto">
            <div className="col-span-3 border-r border-stone-300/30" />
            <div className="col-span-6 border-r border-stone-300/30" />
            <div className="col-span-3" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
