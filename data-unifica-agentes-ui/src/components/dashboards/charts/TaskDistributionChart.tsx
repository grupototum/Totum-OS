import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Tarefa } from '../../types';

interface TaskDistributionChartProps {
  tarefas: Tarefa[];
}

export function TaskDistributionChart({ tarefas }: TaskDistributionChartProps) {
  const statusCount = tarefas.reduce((acc, tarefa) => {
    acc[tarefa.status] = (acc[tarefa.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = [
    { name: 'Em Execução', value: statusCount['em_execucao'] || 0, color: '#5A7A9C' },
    { name: 'Fila', value: statusCount['fila'] || 0, color: '#C4A35A' },
    { name: 'Concluída', value: statusCount['concluida'] || 0, color: '#5A8F5A' },
    { name: 'Erro', value: statusCount['erro'] || 0, color: '#B85C5C' }
  ].filter(item => item.value > 0);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#F5F5F0',
              border: '1px solid #D4D4CF',
              borderRadius: '8px'
            }}
            formatter={(value: number, name: string) => [`${value} tarefas`, name]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string) => (
              <span style={{ color: '#2C2C2A', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
