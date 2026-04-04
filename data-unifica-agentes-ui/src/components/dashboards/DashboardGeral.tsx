import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Activity,
  Cpu,
  Zap,
  Server
} from 'lucide-react';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { Timeline } from './shared/Timeline';
import { AgentActivityChart } from './charts/AgentActivityChart';
import { TaskDistributionChart } from './charts/TaskDistributionChart';
import { 
  mockAgentes, 
  mockTarefas, 
  mockMetricasSistema, 
  mockEventos 
} from '../../data/mock';

export function DashboardGeral() {
  const agentesAtivos = mockAgentes.filter(a => a.status === 'ativo').length;
  const agentesInativos = mockAgentes.filter(a => a.status !== 'ativo').length;
  
  const tarefasEmExecucao = mockTarefas.filter(t => t.status === 'em_execucao').length;
  const tarefasFila = mockTarefas.filter(t => t.status === 'fila').length;
  const tarefasConcluidas = mockTarefas.filter(t => t.status === 'concluida').length;
  
  const totalTarefas = mockTarefas.length;
  const eficienciaMedia = mockAgentes.reduce((acc, a) => acc + a.efetividade, 0) / mockAgentes.length;
  
  const sistemasOnline = mockMetricasSistema.filter(m => m.status === 'online').length;
  const sistemasDegradados = mockMetricasSistema.filter(m => m.status === 'degradado').length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tot-text">Dashboard Geral 🎛️</h1>
          <p className="text-tot-muted">Visão completa do ecossistema de agentes</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="online">Sistema Operacional</StatusBadge>
          <span className="text-sm text-tot-muted">
            Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Agentes Ativos"
          value={agentesAtivos}
          subtitle={`de ${mockAgentes.length} agentes`}
          trend="up"
          trendValue="+2 hoje"
          icon={<Users className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Tarefas Concluídas"
          value={tarefasConcluidas}
          subtitle={`${tarefasEmExecucao} em execução, ${tarefasFila} na fila`}
          trend="up"
          trendValue="95% sucesso"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Eficiência Média"
          value={`${eficienciaMedia.toFixed(1)}%`}
          subtitle="Taxa de sucesso dos agentes"
          trend="up"
          trendValue="+1.2%"
          icon={<Zap className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Saúde do Sistema"
          value={`${sistemasOnline}/${mockMetricasSistema.length}`}
          subtitle={sistemasDegradados > 0 ? `${sistemasDegradados} degradado` : 'Todos operacionais'}
          trend={sistemasDegradados > 0 ? 'warning' : 'up'}
          trendValue={sistemasDegradados > 0 ? 'Atenção' : '100% uptime'}
          icon={<Server className="w-5 h-5" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Atividade dos Agentes</h2>
          </div>
          <AgentActivityChart agentes={mockAgentes} />
        </div>

        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Distribuição de Tarefas</h2>
          </div>
          <TaskDistributionChart tarefas={mockTarefas} />
        </div>
      </div>

      {/* Status dos Sistemas e Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Saúde do Sistema</h2>
          </div>
          
          <div className="space-y-3">
            {mockMetricasSistema.map((metrica) => (
              <div 
                key={metrica.nome} 
                className="flex items-center justify-between p-3 bg-tot-bg rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-tot-text">{metrica.nome}</p>
                  <p className="text-xs text-tot-muted">
                    {metrica.latencia}ms • {metrica.uptime}% uptime
                  </p>
                </div>
                <StatusBadge 
                  status={metrica.status === 'online' ? 'online' : 'degradado'}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Timeline de Eventos</h2>
          </div>
          <Timeline events={mockEventos.slice(0, 6)} />
        </div>
      </div>

      {/* Lista de Agentes */}
      <div className="tot-card p-5">
        <h2 className="text-lg font-semibold text-tot-text mb-4">Agentes do Sistema</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tot-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Agente</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Tarefas</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Efetividade</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Créditos</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Última Atividade</th>
              </tr>
            </thead>
            <tbody>
              {mockAgentes.map((agente) => (
                <tr key={agente.id} className="border-b border-tot-border/50 hover:bg-tot-bg/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{agente.emoji}</span>
                      <div>
                        <p className="font-medium text-tot-text">{agente.nome}</p>
                        <p className="text-xs text-tot-muted">{agente.apelido}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={agente.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-tot-text">{agente.tarefasAtribuidas}</span>
                      <span className="text-xs text-tot-muted">
                        ({agente.tarefasConcluidas}✓ / {agente.tarefasPendentes}⏳)
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-tot-bg rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tot-success rounded-full"
                          style={{ width: `${agente.efetividade}%` }}
                        />
                      </div>
                      <span className="text-sm text-tot-text">{agente.efetividade}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-tot-text">{agente.creditosConsumidos.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-tot-muted">
                      {new Date(agente.ultimaAtividade).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
