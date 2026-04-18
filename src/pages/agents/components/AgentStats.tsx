import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@iconify/react';
import { TrendingUp } from 'lucide-react';
import type { Agent } from '@/hooks/useAgents';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface AgentStatsProps {
  agents: Agent[];
}

const COLORS = ['#1C1917', '#78716C', '#D6D3D1', '#A8A29E', '#57534E'];



export function AgentStats({ agents }: AgentStatsProps) {
  // Calculate metrics
  const totalAgents = agents.length;
  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const totalTasks = agents.reduce((sum, a) => sum + (a.tasks_completed || 0), 0);
  const totalDailyTasks = agents.reduce((sum, a) => sum + (a.daily_tasks || 0), 0);
  const avgSuccessRate = totalAgents > 0 
    ? Math.round(agents.reduce((sum, a) => sum + (a.success_rate || 0), 0) / totalAgents)
    : 0;
  const totalCredits = agents.reduce((sum, a) => sum + (a.credits_used || 0), 0);

  // Agents by category
  const categoryData = agents.reduce((acc, agent) => {
    const cat = agent.category || 'Geral';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Agents by status
  const statusData = [
    { name: 'Online', value: onlineAgents, color: '#10B981' },
    { name: 'Offline', value: agents.filter(a => a.status === 'offline').length, color: '#A8A29E' },
    { name: 'Em espera', value: agents.filter(a => a.status === 'idle').length, color: '#F59E0B' },
    { name: 'Manutenção', value: agents.filter(a => a.status === 'maintenance').length, color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Top performers
  const topPerformers = [...agents]
    .sort((a, b) => (b.success_rate || 0) - (a.success_rate || 0))
    .slice(0, 5);

  // Most active agents
  const mostActive = [...agents]
    .sort((a, b) => (b.daily_tasks || 0) - (a.daily_tasks || 0))
    .slice(0, 5);

  const stats = [
    { 
      label: 'Total de Agentes', 
      value: totalAgents, 
      icon: 'solar:users-group-rounded-linear',
      color: 'text-stone-900',
      bgColor: 'bg-stone-100'
    },
    { 
      label: 'Online', 
      value: onlineAgents, 
      icon: 'solar:check-circle-linear',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      label: 'Taxa de Sucesso Média', 
      value: `${avgSuccessRate}%`, 
      icon: 'solar:chart-2-linear',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Tarefas Hoje', 
      value: totalDailyTasks, 
      icon: 'solar:task-square-linear',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      label: 'Total de Tarefas', 
      value: totalTasks, 
      icon: 'solar:clipboard-list-linear',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    { 
      label: 'Créditos Usados', 
      value: totalCredits.toLocaleString(), 
      icon: 'solar:wallet-money-linear',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Card className="border-stone-300 bg-[#EAEAE5]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-stone-500">{stat.label}</p>
                    <p className="text-xl font-semibold text-stone-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-900">Tendência Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-stone-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Dados históricos serão exibidos aqui</p>
                <p className="text-xs mt-1">Quando o tracking de execuções estiver ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-900">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-900">Top Performers (Taxa de Sucesso)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((agent, index) => (
                <div key={agent.id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-stone-500 w-6">#{index + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-lg">
                    {agent.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{agent.name}</p>
                    <p className="text-xs text-stone-500">{agent.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">{agent.success_rate || 0}%</p>
                  </div>
                </div>
              ))}
              {topPerformers.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-8">Nenhum agente encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Active */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-900">Mais Ativos (Tarefas Hoje)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostActive.map((agent, index) => (
                <div key={agent.id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-stone-500 w-6">#{index + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-lg">
                    {agent.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{agent.name}</p>
                    <p className="text-xs text-stone-500">{agent.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{agent.daily_tasks || 0}</p>
                    <p className="text-xs text-stone-400">tarefas</p>
                  </div>
                </div>
              ))}
              {mostActive.length === 0 && (
                <p className="text-sm text-stone-500 text-center py-8">Nenhum agente encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-stone-900">Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D6D3D1" />
                <XAxis dataKey="name" stroke="#78716C" fontSize={12} />
                <YAxis stroke="#78716C" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1C1917', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="value" name="Agentes" fill="#1C1917" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
