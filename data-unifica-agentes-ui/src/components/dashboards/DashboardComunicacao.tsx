import { 
  Workflow, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Send,
  ArrowRightLeft
} from 'lucide-react';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { CommunicationFlowChart } from './charts/CommunicationFlowChart';
import { mockWorkflows, mockComandos } from '../../data/mock';
import { cn } from '../../lib/utils';

export function DashboardComunicacao() {
  const workflowsAtivos = mockWorkflows.filter(w => w.status === 'ativo').length;
  const workflowsErro = mockWorkflows.filter(w => w.status === 'erro').length;
  
  const comandosConcluidos = mockComandos.filter(c => c.status === 'concluido').length;
  const comandosProcessando = mockComandos.filter(c => c.status === 'processando').length;
  const comandosErro = mockComandos.filter(c => c.status === 'erro').length;
  
  const totalExecucoes = mockWorkflows.reduce((acc, w) => acc + w.execucoesTotais, 0);
  const totalSucessos = mockWorkflows.reduce((acc, w) => acc + w.execucoesSucesso, 0);
  const taxaSucesso = ((totalSucessos / totalExecucoes) * 100).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tot-text">Dashboard de Comunicação 🔄</h1>
          <p className="text-tot-muted">Monitoramento N8N e fluxo entre agentes</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Workflows Ativos"
          value={workflowsAtivos}
          subtitle={`de ${mockWorkflows.length} workflows`}
          trend={workflowsErro > 0 ? 'down' : 'up'}
          trendValue={workflowsErro > 0 ? `${workflowsErro} com erro` : 'Todos OK'}
          icon={<Workflow className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Taxa de Sucesso"
          value={`${taxaSucesso}%`}
          subtitle={`${totalSucessos.toLocaleString()} de ${totalExecucoes.toLocaleString()} execuções`}
          trend="up"
          trendValue="99.7% média"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Comandos na Fila"
          value={mockComandos.filter(c => c.status === 'enviado').length}
          subtitle={`${comandosProcessando} processando`}
          trend={comandosProcessando > 3 ? 'warning' : 'up'}
          trendValue={comandosProcessando > 3 ? 'Acumulando' : 'Normal'}
          icon={<Clock className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Comandos Hoje"
          value={mockComandos.length}
          subtitle={`${comandosConcluidos} concluídos`}
          trend="up"
          trendValue="+12% vs ontem"
          icon={<Send className="w-5 h-5" />}
        />
      </div>

      {/* Gráfico de Fluxo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Fluxo de Comunicação</h2>
          </div>
          <CommunicationFlowChart comandos={mockComandos} />
        </div>

        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Comandos Recentes</h2>
          </div>
          
          <div className="space-y-3">
            {mockComandos.map((cmd) => (
              <div 
                key={cmd.id}
                className="flex items-center justify-between p-3 bg-tot-bg rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-tot-text">{cmd.origem}</span>
                    <span className="text-xs text-tot-muted">↓</span>
                    <span className="text-xs font-medium text-tot-text">{cmd.destino}</span>
                  </div>
                  
                  <div className="w-px h-10 bg-tot-border" />
                  
                  <div>
                    <p className="text-sm font-medium text-tot-text">{cmd.comando}</p>
                    <p className="text-xs text-tot-muted">
                      {new Date(cmd.timestamp).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                
                <StatusBadge 
                  status={
                    cmd.status === 'concluido' ? 'success' :
                    cmd.status === 'processando' ? 'ativo' :
                    cmd.status === 'enviado' ? 'info' : 'erro'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflows */}
      <div className="tot-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-tot-primary" />
          <h2 className="text-lg font-semibold text-tot-text">Workflows N8N</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-tot-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Workflow</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Execuções</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Sucesso</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Erros</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Taxa</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-tot-muted">Última Exec.</th>
              </tr>
            </thead>
            <tbody>
              {mockWorkflows.map((workflow) => {
                const taxa = ((workflow.execucoesSucesso / workflow.execucoesTotais) * 100).toFixed(1);
                
                return (
                  <tr key={workflow.id} className="border-b border-tot-border/50 hover:bg-tot-bg/50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-tot-text">{workflow.nome}</p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={workflow.status === 'ativo' ? 'ativo' : 'erro'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-tot-text">
                        {workflow.execucoesTotais.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-tot-success">
                        {workflow.execucoesSucesso.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('text-sm', workflow.execucoesErro > 10 ? 'text-tot-danger' : 'text-tot-text')}>
                        {workflow.execucoesErro.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-tot-bg rounded-full overflow-hidden">
                          <div 
                            className={cn('h-full rounded-full', 
                              Number(taxa) > 95 ? 'bg-tot-success' : 
                              Number(taxa) > 90 ? 'bg-tot-warning' : 'bg-tot-danger'
                            )}
                            style={{ width: `${taxa}%` }}
                          />
                        </div>
                        <span className="text-sm text-tot-text">{taxa}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-tot-muted">
                        {new Date(workflow.ultimaExecucao).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Erros/Falhas */}
      {workflowsErro > 0 && (
        <div className="tot-card p-5 border-l-4 border-l-tot-danger">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-tot-danger" />
            <h2 className="text-lg font-semibold text-tot-text">Erros e Falhas</h2>
          </div>
          
          <div className="space-y-2">
            {mockWorkflows
              .filter(w => w.status === 'erro' || w.execucoesErro > 10)
              .map(workflow => (
                <div 
                  key={workflow.id}
                  className="flex items-center justify-between p-3 bg-tot-danger/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-tot-danger" />
                    <div>
                      <p className="font-medium text-tot-text">{workflow.nome}</p>
                      <p className="text-sm text-tot-muted">
                        {workflow.execucoesErro} erros nas últimas execuções
                      </p>
                    </div>
                  </div>
                  
                  <button className="px-3 py-1.5 bg-tot-danger text-white text-sm rounded-lg hover:bg-tot-danger/90 transition-colors">
                    Investigar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
