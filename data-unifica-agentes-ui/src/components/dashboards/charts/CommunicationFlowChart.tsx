import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Comando } from '../../types';

interface CommunicationFlowChartProps {
  comandos: Comando[];
}

export function CommunicationFlowChart({ comandos }: CommunicationFlowChartProps) {
  // Contar comandos por par origem-destino
  const flowCount = comandos.reduce((acc, cmd) => {
    const key = `${cmd.origem} → ${cmd.destino}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(flowCount).map(([key, value]) => ({
    flow: key,
    count: value
  }));

  const colors = ['#4A4A45', '#5A8F5A', '#C4A35A', '#5A7A9C', '#7A6A9C', '#8A5A5A'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D4D4CF" horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#6B6B66"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="flow"
            stroke="#6B6B66"
            fontSize={11}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#F5F5F0',
              border: '1px solid #D4D4CF',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} comandos`, 'Quantidade']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
