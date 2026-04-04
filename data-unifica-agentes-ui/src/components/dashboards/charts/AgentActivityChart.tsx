import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Agente } from '../../types';

interface AgentActivityChartProps {
  agentes: Agente[];
}

// Dados mockados de atividade ao longo do tempo
const activityData = [
  { hora: '00:00', Miguel: 12, Liz: 8, Jarvis: 25, Data: 5, Giles: 3, TOT: 15 },
  { hora: '04:00', Miguel: 8, Liz: 5, Jarvis: 30, Data: 3, Giles: 2, TOT: 18 },
  { hora: '08:00', Miguel: 25, Liz: 20, Jarvis: 45, Data: 15, Giles: 10, TOT: 35 },
  { hora: '12:00', Miguel: 35, Liz: 28, Jarvis: 40, Data: 20, Giles: 15, TOT: 45 },
  { hora: '16:00', Miguel: 30, Liz: 25, Jarvis: 35, Data: 18, Giles: 12, TOT: 40 },
  { hora: '20:00', Miguel: 20, Liz: 15, Jarvis: 25, Data: 12, Giles: 8, TOT: 28 },
  { hora: '23:59', Miguel: 15, Liz: 10, Jarvis: 20, Data: 8, Giles: 5, TOT: 20 }
];

const agentColors: Record<string, string> = {
  Miguel: '#4A4A45',
  Liz: '#5A8F5A',
  Jarvis: '#C4A35A',
  Data: '#5A7A9C',
  Giles: '#7A6A9C',
  TOT: '#8A5A5A'
};

export function AgentActivityChart({ agentes }: AgentActivityChartProps) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    agentes.map(a => a.nome)
  );

  const toggleAgent = (agentName: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentName)
        ? prev.filter(n => n !== agentName)
        : [...prev, agentName]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {agentes.map(agente => (
          <button
            key={agente.id}
            onClick={() => toggleAgent(agente.nome)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedAgents.includes(agente.nome)
                ? 'bg-tot-primary text-white'
                : 'bg-tot-bg text-tot-muted'
            }`}
          >
            {agente.emoji} {agente.nome}
          </button>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D4D4CF" />
            <XAxis 
              dataKey="hora" 
              stroke="#6B6B66"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B6B66"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F5F5F0',
                border: '1px solid #D4D4CF',
                borderRadius: '8px'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '16px' }} />
            
            {selectedAgents.map(agentName => (
              <Line
                key={agentName}
                type="monotone"
                dataKey={agentName}
                stroke={agentColors[agentName]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
