/* 
 * SCAFFOLD REACT COMPONENTS — Apps Totum Agents
 * Dashboard + Editor com suporte elizaOS
 * 
 * Estrutura pronta para implementação em Lovable
 */

// ============================================
// 1. DASHBOARD PAGE
// ============================================

// src/pages/agents/index.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import AgentGrid from '@/components/agents/Dashboard/AgentGrid';
import FilterBar from '@/components/agents/Dashboard/FilterBar';
import TemplateSection from '@/components/agents/Dashboard/TemplateSection';
import { useAgents } from '@/hooks/useAgents';
import { AgentCard as AgentCardType } from '@/types/agents-elizaos';

export default function AgentsDashboard() {
  const { agents, loading, error } = useAgents();
  const [filteredAgents, setFilteredAgents] = useState<AgentCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    let filtered = agents;

    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTier) {
      filtered = filtered.filter(a => a.tier === selectedTier);
    }

    if (selectedStatus) {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    setFilteredAgents(filtered);
  }, [agents, searchQuery, selectedTier, selectedStatus]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar agentes</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-gray-400 mt-1">Gerencie seus agentes elizaOS</p>
        </div>
        <button
          onClick={() => window.location.href = '/agents/new'}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
        >
          <Plus size={20} />
          Novo Agente
        </button>
      </div>

      {/* FILTROS */}
      <FilterBar
        onSearch={setSearchQuery}
        onTierFilter={setSelectedTier}
        onStatusFilter={setSelectedStatus}
      />

      {/* TEMPLATES */}
      <TemplateSection onSelectTemplate={(template) => {
        // Redirect para editor com template pré-selecionado
        window.location.href = `/agents/new?template=${template.id}`;
      }} />

      {/* GRID DE AGENTES */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400">
            {filteredAgents.length} agente{filteredAgents.length !== 1 ? 's' : ''} encontrado{filteredAgents.length !== 1 ? 's' : ''}
          </p>
          <AgentGrid agents={filteredAgents} />
        </>
      )}
    </div>
  );
}

// ============================================
// 2. DASHBOARD COMPONENTS
// ============================================

// src/components/agents/Dashboard/AgentGrid.tsx
import AgentCard from './AgentCard';
import { AgentCard as AgentCardType } from '@/types/agents-elizaos';

interface Props {
  agents: AgentCardType[];
}

export default function AgentGrid({ agents }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

// src/components/agents/Dashboard/AgentCard.tsx
import { useState } from 'react';
import { Play, Pause, Settings, MoreVertical } from 'lucide-react';
import { AgentCard as AgentCardType } from '@/types/agents-elizaos';

interface Props {
  agent: AgentCardType;
}

export default function AgentCard({ agent }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    error: 'bg-red-500',
  }[agent.status];

  const tierLabel = { 1: 'Lab', 2: 'Mid', 3: 'Fab' }[agent.tier];
  const tierColor = {
    1: 'bg-purple-500/20 text-purple-300',
    2: 'bg-blue-500/20 text-blue-300',
    3: 'bg-green-500/20 text-green-300',
  }[agent.tier];

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition cursor-pointer"
         onClick={() => window.location.href = `/agents/${agent.id}/edit`}>
      
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{agent.emoji}</div>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <div className="flex gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-mono ${tierColor}`}>
                {tierLabel}
              </span>
              <div className={`w-2 h-2 rounded-full ${statusColor} mt-2`} title={agent.status} />
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="p-1 hover:bg-gray-700 rounded transition"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* CANAIS */}
      <div className="flex gap-2 mb-3">
        {agent.channels.map((c, i) => (
          <div key={i} className={`px-2 py-1 rounded text-xs ${
            c.enabled ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-700 text-gray-500'
          }`}>
            {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
          </div>
        ))}
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 mb-4">
        <div>
          <p className="text-gray-500">Mensagens</p>
          <p className="text-lg font-semibold">{agent.messages_today || 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Taxa sucesso</p>
          <p className="text-lg font-semibold">{agent.success_rate || 0}%</p>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
          {agent.status === 'online' ? <Pause size={16} /> : <Play size={16} />}
          {agent.status === 'online' ? 'Pausar' : 'Iniciar'}
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition">
          <Settings size={16} />
          Config
        </button>
      </div>

      {/* MENU DROPDOWN */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded border border-gray-600 z-10">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-600 transition">Clonar</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-600 transition">Exportar JSON</button>
          <button className="w-full text-left px-4 py-2 hover:bg-red-600 transition">Deletar</button>
        </div>
      )}
    </div>
  );
}

// src/components/agents/Dashboard/FilterBar.tsx
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
  onTierFilter: (tier: number | null) => void;
  onStatusFilter: (status: string | null) => void;
}

export default function FilterBar({ onSearch, onTierFilter, onStatusFilter }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-3">
      {/* BUSCA */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar agentes..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 outline-none transition"
        />
      </div>

      {/* FILTROS AVANÇADOS */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition"
      >
        <Filter size={16} />
        Filtros avançados
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Tier</label>
            <select
              onChange={(e) => onTierFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
            >
              <option value="">Todos</option>
              <option value="1">Laboratório (1)</option>
              <option value="2">Midtier (2)</option>
              <option value="3">Fábrica (3)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select
              onChange={(e) => onStatusFilter(e.target.value || null)}
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
            >
              <option value="">Todos</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="error">Erro</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// src/components/agents/Dashboard/TemplateSection.tsx
interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Props {
  onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: 'attendant',
    name: 'Atendente',
    description: 'Suporte ao cliente',
    icon: '🎧',
  },
  {
    id: 'copywriter',
    name: 'Copywriter',
    description: 'Geração de conteúdo',
    icon: '✍️',
  },
  {
    id: 'researcher',
    name: 'Pesquisador',
    description: 'Pesquisa e análise',
    icon: '🔍',
  },
  {
    id: 'analyst',
    name: 'Analista',
    description: 'Análise de dados',
    icon: '📊',
  },
];

export default function TemplateSection({ onSelectTemplate }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Começar com template</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelectTemplate(t)}
            className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500 transition text-left"
          >
            <div className="text-2xl mb-2">{t.icon}</div>
            <h3 className="font-semibold text-sm">{t.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 3. EDITOR PAGE & COMPONENTS
// ============================================

// src/pages/agents/[id]/edit.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgentForm from '@/components/agents/Editor/AgentForm';
import { TotumAgentConfig } from '@/types/agents-elizaos';
import { useAgentForm } from '@/hooks/useAgentForm';

export default function EditAgentPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<TotumAgentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === 'new') {
      setAgent({} as TotumAgentConfig);
      setLoading(false);
    } else {
      // Fetch agent data
      fetch(`/api/agents/${id}`)
        .then(r => r.json())
        .then(data => {
          setAgent(data.agent);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {agent?.id ? 'Editar' : 'Criar'} Agente
      </h1>
      {agent && (
        <AgentForm 
          initialData={agent}
          isNew={!agent?.id}
        />
      )}
    </div>
  );
}

// src/components/agents/Editor/AgentForm.tsx
import { useState } from 'react';
import { TotumAgentConfig } from '@/types/agents-elizaos';
import IdentityTab from './IdentityTab';
import CapabilitiesTab from './CapabilitiesTab';
import ChannelsTab from './ChannelsTab';
import BrainTab from './BrainTab';
import AlexandriaTab from './AlexandriaTab';
import ActionsTab from './ActionsTab';
import LivePreview from './LivePreview';
import { useAgentForm } from '@/hooks/useAgentForm';

interface Props {
  initialData: TotumAgentConfig;
  isNew: boolean;
}

type TabType = 'identity' | 'capabilities' | 'channels' | 'brain' | 'alexandria' | 'actions';

export default function AgentForm({ initialData, isNew }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [agent, setAgent] = useState(initialData);
  const { submitAgent, loading } = useAgentForm();

  const tabs = [
    { id: 'identity' as const, label: 'Identidade' },
    { id: 'capabilities' as const, label: 'Capacidades' },
    { id: 'channels' as const, label: 'Canais' },
    { id: 'brain' as const, label: 'Cérebro' },
    { id: 'alexandria' as const, label: 'Alexandria' },
    { id: 'actions' as const, label: 'Ações' },
  ];

  const handleSubmit = async () => {
    const success = await submitAgent(agent, isNew);
    if (success) {
      window.location.href = '/agents';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* FORM */}
      <div className="lg:col-span-2 space-y-4">
        {/* ABAS */}
        <div className="flex gap-2 border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="space-y-4">
          {activeTab === 'identity' && <IdentityTab agent={agent} onChange={setAgent} />}
          {activeTab === 'capabilities' && <CapabilitiesTab agent={agent} onChange={setAgent} />}
          {activeTab === 'channels' && <ChannelsTab agent={agent} onChange={setAgent} />}
          {activeTab === 'brain' && <BrainTab agent={agent} onChange={setAgent} />}
          {activeTab === 'alexandria' && <AlexandriaTab agent={agent} onChange={setAgent} />}
          {activeTab === 'actions' && <ActionsTab agent={agent} onChange={setAgent} />}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {loading ? 'Salvando...' : 'Publicar'}
          </button>
          <button
            onClick={() => window.location.href = '/agents'}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="lg:col-span-1">
        <LivePreview agent={agent} />
      </div>
    </div>
  );
}

// src/components/agents/Editor/IdentityTab.tsx
import { TotumAgentConfig } from '@/types/agents-elizaos';

interface Props {
  agent: TotumAgentConfig;
  onChange: (agent: TotumAgentConfig) => void;
}

export default function IdentityTab({ agent, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Nome</label>
        <input
          type="text"
          value={agent.name || ''}
          onChange={(e) => onChange({ ...agent, name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:border-purple-500 outline-none"
          placeholder="ex: LOKI, WANDA, VISU"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Bio</label>
        <textarea
          value={agent.bio || ''}
          onChange={(e) => onChange({ ...agent, bio: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:border-purple-500 outline-none"
          placeholder="Descrição breve do agente"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Emoji</label>
        <input
          type="text"
          value={agent.emoji || ''}
          onChange={(e) => onChange({ ...agent, emoji: e.target.value })}
          maxLength={2}
          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-2xl text-center"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Tom de voz</label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Formal</span>
          <input
            type="range"
            min={0}
            max={100}
            value={50} // placeholder
            className="flex-1"
          />
          <span className="text-xs text-gray-400">Casual</span>
        </div>
      </div>
    </div>
  );
}

// [Componentes CapabilitiesTab, ChannelsTab, BrainTab, AlexandriaTab, ActionsTab seguem padrão similar]

// src/components/agents/Editor/LivePreview.tsx
import { useState } from 'react';
import { TotumAgentConfig } from '@/types/agents-elizaos';

interface Props {
  agent: TotumAgentConfig;
}

export default function LivePreview({ agent }: Props) {
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    
    // Simular resposta do agente
    setTimeout(() => {
      setMessages(m => [...m, { role: 'agent', text: 'Resposta do agente...' }]);
    }, 500);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col h-[600px]">
      <h3 className="font-semibold mb-3">Preview em tempo real</h3>
      
      {/* CHAT */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded text-sm ${
              msg.role === 'user'
                ? 'bg-purple-600 ml-4'
                : 'bg-gray-700 mr-4'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
          placeholder="Teste o agente..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ============================================
// 4. HOOKS
// ============================================

// src/hooks/useAgentForm.ts
import { useState } from 'react';
import { TotumAgentConfig } from '@/types/agents-elizaos';
import { AgentAdapter } from '@/lib/agents/adapter';

export const useAgentForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAgent = async (agent: TotumAgentConfig, isNew: boolean) => {
    setLoading(true);
    setError(null);

    try {
      // Converter para elizaOS Character
      const character = AgentAdapter.toElizaCharacter(agent);

      const method = isNew ? 'POST' : 'PATCH';
      const url = isNew ? '/api/agents' : `/api/agents/${agent.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agent,
          character,
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar agente');

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitAgent, loading, error };
};

// src/hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { AgentCard } from '@/types/agents-elizaos';

export const useAgents = () => {
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { agents, loading, error };
};
