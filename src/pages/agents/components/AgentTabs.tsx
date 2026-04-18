import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { TrendingUp } from 'lucide-react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';
import { AgentChat } from '@/components/agents/AgentChat';
import { N8NWorkflow } from './N8NWorkflow';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface AgentTabsProps {
  agent: Agent;
  agents: Agent[];
  parentAgent?: Agent;
  childAgents: Agent[];
}

const COLORS = ['#1C1917', '#78716C', '#D6D3D1', '#A8A29E'];



export function AgentTabs({ agent, agents, parentAgent, childAgents }: AgentTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const classification = classifyAgent(agent.name);


  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    idle: 'Em espera',
    maintenance: 'Manutenção',
  };

  const isNew = (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

  const creditsData = [
    { name: 'Processamento', value: agent?.credits_used ? Math.round(agent.credits_used * 0.4) : 40 },
    { name: 'Storage', value: agent?.credits_used ? Math.round(agent.credits_used * 0.3) : 30 },
    { name: 'API', value: agent?.credits_used ? Math.round(agent.credits_used * 0.2) : 20 },
    { name: 'Outros', value: agent?.credits_used ? Math.round(agent.credits_used * 0.1) : 10 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'solar:chart-2-linear' },
    { id: 'credits', label: 'Créditos', icon: 'solar:wallet-money-linear' },
    { id: 'effectiveness', label: 'Efetividade', icon: 'solar:trend-up-linear' },
    { id: 'hierarchy', label: 'Hierarquia', icon: 'solar:diagram-up-linear' },
    { id: 'chat', label: 'Chat', icon: 'solar:chat-dots-linear' },
    { id: 'n8n', label: 'N8N', icon: 'solar:workflow-linear' },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-stone-300">
        <TabsList className="bg-transparent border-0 p-0 h-12 w-full justify-start gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                data-[state=active]:bg-white 
                data-[state=active]:border-stone-900 
                data-[state=active]:text-stone-900
                data-[state=active]:shadow-sm
                border border-transparent
                text-stone-500
                px-4 py-2
                text-sm font-medium
                rounded-t-lg
                transition-all
              "
            >
              <Icon icon={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        <TabsContent value="overview" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tarefas Hoje', value: agent.daily_tasks || 0, icon: 'solar:task-square-linear', color: 'text-stone-900' },
                  { label: 'Taxa de Sucesso', value: `${agent.success_rate || 0}%`, icon: 'solar:check-circle-linear', color: 'text-emerald-600' },
                  { label: 'Total Tarefas', value: agent.tasks_completed || 0, icon: 'solar:clipboard-list-linear', color: 'text-blue-600' },
                  { label: 'Créditos Usados', value: agent.credits_used || 0, icon: 'solar:wallet-money-linear', color: 'text-amber-600' },
                ].map((stat, i) => (
                  <Card key={i} className="border-stone-300 bg-[#EAEAE5]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-stone-400">{stat.label}</p>
                          <p className="text-xl font-medium text-stone-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Activity Chart */}
              <Card className="border-stone-300 bg-[#EAEAE5]">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Atividade dos Últimos 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-stone-500">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Dados de atividade serão exibidos aqui</p>
                      <p className="text-xs mt-1">Quando o tracking estiver ativo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-stone-300 bg-[#EAEAE5]">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Efetividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#D6D3D1"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#1C1917"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(agent.success_rate || 0) * 3.52} 352`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-medium text-stone-900">
                          {agent.success_rate || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 text-center mt-4">
                    Taxa de sucesso nas tarefas executadas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-stone-300 bg-[#EAEAE5]">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">ID</span>
                    <span className="text-stone-900 font-mono text-xs">{agent.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Categoria</span>
                    <span className="text-stone-900">{agent.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Tipo</span>
                    <span className="text-stone-900 capitalize">{agent.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Status</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                      <span className="text-stone-900 capitalize">{statusLabels[agent.status]}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Criado em</span>
                    <span className="text-stone-900 text-xs">
                      {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Credits Tab */}
        <TabsContent value="credits" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Uso de Créditos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creditsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {creditsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1C1917', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {creditsData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[i] }}
                      />
                      <span className="text-xs text-stone-600">{item.name}</span>
                      <span className="text-xs text-stone-900 font-medium ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Histórico de Uso (7 dias)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-stone-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Histórico de uso será exibido aqui</p>
                    <p className="text-xs mt-1">Quando os dados de créditos estiverem disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5] lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Detalhamento de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditsData.map((item, i) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-600">{item.name}</span>
                        <span className="text-stone-900 font-medium">{item.value} créditos</span>
                      </div>
                      <Progress 
                        value={(item.value / (agent.credits_used || 100)) * 100} 
                        className="h-2 bg-stone-200"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-stone-900">Total</span>
                  <span className="text-xl font-medium text-stone-900">{agent.credits_used || 0} créditos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Effectiveness Tab */}
        <TabsContent value="effectiveness" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#D6D3D1"
                        strokeWidth="16"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#1C1917"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(agent.success_rate || 0) * 4.4} 440`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-medium text-stone-900">
                        {agent.success_rate || 0}%
                      </span>
                      <span className="text-xs text-stone-500">sucesso</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tarefas Completadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <span className="text-5xl font-medium text-stone-900">
                      {agent.tasks_completed || 0}
                    </span>
                    <p className="text-sm text-stone-500 mt-2">tarefas no total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Eficiência Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <span className="text-5xl font-medium text-stone-900">
                      {agent.daily_tasks || 0}
                    </span>
                    <p className="text-sm text-stone-500 mt-2">tarefas hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5] lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Desempenho Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <div className="text-center text-stone-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Dados de desempenho serão exibidos aqui</p>
                    <p className="text-xs mt-1">Quando o histórico semanal estiver disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hierarchy Tab */}
        <TabsContent value="hierarchy" className="m-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {parentAgent && (
              <Card className="border-stone-300 bg-[#EAEAE5]">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Agente Superior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="flex items-center gap-4 p-4 bg-white rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                    onClick={() => navigate(`/agents/${parentAgent.id}`)}
                  >
                    <div className="w-14 h-14 rounded-full bg-stone-200 flex items-center justify-center text-2xl">
                      {parentAgent.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{parentAgent.name}</p>
                      <p className="text-sm text-stone-500">{parentAgent.role}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">
                        Nível {parentAgent.hierarchy_level}
                      </Badge>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="w-5 h-5 text-stone-400" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={`border-stone-300 bg-[#EAEAE5] ${!parentAgent ? 'lg:col-span-2' : ''}`}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Sub-agentes ({childAgents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {childAgents.length === 0 ? (
                  <p className="text-sm text-stone-500 text-center py-8">
                    Este agente não possui sub-agentes
                  </p>
                ) : (
                  <div className="space-y-3">
                    {childAgents.map((child) => (
                      <div 
                        key={child.id}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg cursor-pointer hover:bg-stone-50 transition-colors"
                        onClick={() => navigate(`/agents/${child.id}`)}
                      >
                        <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-xl">
                          {child.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900">{child.name}</p>
                          <p className="text-sm text-stone-500">{child.role}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-500">
                            ✓ {child.success_rate || 0}%
                          </span>
                          <Icon icon="solar:arrow-right-linear" className="w-5 h-5 text-stone-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-[#EAEAE5] lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Posição na Hierarquia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-4">
                    {parentAgent && (
                      <>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-2xl mx-auto">
                            {parentAgent.emoji}
                          </div>
                          <p className="text-xs text-stone-500 mt-2">{parentAgent.name}</p>
                        </div>
                        <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6 text-stone-400" />
                      </>
                    )}
                    
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center text-3xl mx-auto ring-4 ring-stone-200">
                        <span className="text-white">{agent.emoji}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-900 mt-2">{agent.name}</p>
                      <Badge className="text-[10px] mt-1">Nível {agent.hierarchy_level}</Badge>
                    </div>
                    
                    {childAgents.length > 0 && (
                      <>
                        <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6 text-stone-400" />
                        <div className="text-center">
                          <div className="flex -space-x-2">
                            {childAgents.slice(0, 3).map((child, i) => (
                              <div 
                                key={child.id}
                                className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-lg ring-2 ring-white"
                                style={{ zIndex: 3 - i }}
                              >
                                {child.emoji}
                              </div>
                            ))}
                            {childAgents.length > 3 && (
                              <div className="w-12 h-12 rounded-full bg-stone-300 flex items-center justify-center text-xs ring-2 ring-white"
                              >
                                +{childAgents.length - 3}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-2">{childAgents.length} sub-agentes</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="m-0 mt-0">
          <div className="max-w-3xl mx-auto">
            <AgentChat agent={agent} />
          </div>
        </TabsContent>

        {/* N8N Tab */}
        <TabsContent value="n8n" className="m-0 mt-0">
          <N8NWorkflow agent={agent} agents={agents} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
