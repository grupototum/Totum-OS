import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Target,
  CreditCard,
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { MetricCard } from './shared/MetricCard';
import { StatusBadge } from './shared/StatusBadge';
import { Agente, Tarefa } from '../../types';
import { mockAgentes, mockTarefas } from '../../data/mock';
import { cn } from '../../lib/utils';

interface DashboardAgenteProps {
  agenteId?: string;
  onBack?: () => void;
}

export function DashboardAgente({ agenteId, onBack }: DashboardAgenteProps) {
  const [selectedAgenteId, setSelectedAgenteId] = useState<string | undefined>(agenteId);
  
  const agente = selectedAgenteId 
    ? mockAgentes.find(a => a.id === selectedAgenteId)
    : undefined;

  const tarefasAgente = agente 
    ? mockTarefas.filter(t => t.agenteId === agente.id)
    : [];

  const tarefasEmExecucao = tarefasAgente.filter(t => t.status === 'em_execucao');
  const tarefasConcluidas = tarefasAgente.filter(t => t.status === 'concluida');
  const tarefasPendentes = tarefasAgente.filter(t => t.status === 'fila');

  // Se não há agente selecionado, mostrar lista de seleção
  if (!agente) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-tot-text">Dashboard por Agente 👤</h1>
          <p className="text-tot-muted">Selecione um agente para ver detalhes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAgentes.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedAgenteId(a.id)}
              className="tot-card-hover p-5 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{a.emoji}</span>
                  <div>
                    <p className="font-semibold text-tot-text">{a.nome}</p>
                    <p className="text-sm text-tot-muted">{a.apelido}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-tot-border">
                <div>
                  <p className="text-2xl font-bold text-tot-text">{a.tarefasAtribuidas}</p>
                  <p className="text-xs text-tot-muted">Tarefas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-tot-text">{a.efetividade}%</p>
                  <p className="text-xs text-tot-muted">Efetividade</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-tot-text">{(a.creditosConsumidos / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-tot-muted">Créditos</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-tot-bg rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-tot-muted" />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <span className="text-4xl">{agente.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-tot-text">{agente.nome}</h1>
            <p className="text-tot-muted">{agente.apelido}</p>
          </div>
        </div>
        
        <div className="ml-auto">
          <StatusBadge status={agente.status} />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tarefas Atribuídas"
          value={agente.tarefasAtribuidas}
          subtitle={`${agente.tarefasConcluidas} concluídas`}
          trend="up"
          trendValue="+3 esta semana"
          icon={<Target className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Efetividade"
          value={`${agente.efetividade}%`}
          subtitle="Taxa de sucesso"
          trend={agente.efetividade > 95 ? 'up' : 'neutral'}
          trendValue={agente.efetividade > 95 ? 'Excelente' : 'Boa'}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Créditos Consumidos"
          value={agente.creditosConsumidos.toLocaleString()}
          subtitle="Tokens processados"
          icon={<CreditCard className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Tarefas Pendentes"
          value={agente.tarefasPendentes}
          subtitle={`${tarefasEmExecucao.length} em execução`}
          trend={agente.tarefasPendentes > 5 ? 'down' : 'up'}
          trendValue={agente.tarefasPendentes > 5 ? 'Alto' : 'Normal'}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Histórico e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Histórico de Tarefas</h2>
          </div>
          
          <div className="space-y-3">
            {tarefasAgente.length === 0 ? (
              <p className="text-tot-muted text-center py-8">Nenhuma tarefa atribuída</p>
            ) : (
              tarefasAgente.map((tarefa) => (
                <div 
                  key={tarefa.id}
                  className="flex items-start justify-between p-4 bg-tot-bg rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-tot-text">{tarefa.titulo}</h3>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', {
                        'bg-tot-warning/10 text-tot-warning': tarefa.prioridade === 'alta',
                        'bg-tot-info/10 text-tot-info': tarefa.prioridade === 'media',
                        'bg-tot-muted/10 text-tot-muted': tarefa.prioridade === 'baixa'
                      })} >
                        {tarefa.prioridade}
                      </span>
                    </div>
                    <p className="text-sm text-tot-muted mt-1">{tarefa.descricao}</p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-tot-muted">
                        Criada: {new Date(tarefa.criadaEm).toLocaleDateString('pt-BR')}
                      </span>
                      {tarefa.tempoExecucao && (
                        <span className="text-xs text-tot-muted">
                          ⏱️ {tarefa.tempoExecucao}min
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <StatusBadge 
                    status={
                      tarefa.status === 'em_execucao' ? 'ativo' :
                      tarefa.status === 'concluida' ? 'success' :
                      tarefa.status === 'erro' ? 'erro' : 'warning'
                    }
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="tot-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-tot-primary" />
              <h2 className="text-lg font-semibold text-tot-text">Últimas Ações</h2>
            </div>
            
            <div className="space-y-3">
              {agente.ultimasAcoes.map((acao, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-tot-primary mt-2" />
                  <p className="text-sm text-tot-text">{acao}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tot-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-tot-primary" />
              <h2 className="text-lg font-semibold text-tot-text">Resumo</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-tot-muted">Total de Tarefas</span>
                <span className="font-medium text-tot-text">{agente.tarefasAtribuidas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-tot-muted">Concluídas</span>
                <span className="font-medium text-tot-success">{agente.tarefasConcluidas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-tot-muted">Pendentes</span>
                <span className="font-medium text-tot-warning">{agente.tarefasPendentes}</span>
              </div>
              <div className="pt-4 border-t border-tot-border">
                <div className="flex justify-between">
                  <span className="text-sm text-tot-muted">Última Atividade</span>
                  <span className="font-medium text-tot-text">
                    {new Date(agente.ultimaAtividade).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
