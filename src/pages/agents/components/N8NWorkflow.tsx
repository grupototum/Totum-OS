import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@iconify/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Agent } from '@/hooks/useAgents';

interface N8NWorkflowProps {
  agent?: Agent;
  agents?: Agent[];
}

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun: string;
  executions: number;
  agentId?: string;
}

interface ExecutionLog {
  id: string;
  workflowName: string;
  status: 'success' | 'error' | 'running';
  timestamp: string;
  duration: string;
  message?: string;
}

// Mock workflows data - in production, this would come from N8N API
const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf-001', name: 'Sincronização de Leads', status: 'active', lastRun: '2024-01-15T10:30:00Z', executions: 156 },
  { id: 'wf-002', name: 'Processamento de Tarefas', status: 'active', lastRun: '2024-01-15T09:15:00Z', executions: 342 },
  { id: 'wf-003', name: 'Relatório Diário', status: 'inactive', lastRun: '2024-01-14T23:00:00Z', executions: 45 },
  { id: 'wf-004', name: 'Notificação de Erros', status: 'active', lastRun: '2024-01-15T08:00:00Z', executions: 12 },
  { id: 'wf-005', name: 'Backup de Dados', status: 'error', lastRun: '2024-01-14T22:00:00Z', executions: 89 },
];

const MOCK_LOGS: ExecutionLog[] = [
  { id: 'log-001', workflowName: 'Sincronização de Leads', status: 'success', timestamp: '2024-01-15T10:30:00Z', duration: '2.3s', message: '15 leads sincronizados' },
  { id: 'log-002', workflowName: 'Processamento de Tarefas', status: 'success', timestamp: '2024-01-15T09:15:00Z', duration: '5.1s', message: '42 tarefas processadas' },
  { id: 'log-003', workflowName: 'Backup de Dados', status: 'error', timestamp: '2024-01-14T22:00:00Z', duration: '0.5s', message: 'Falha na conexão com o banco' },
  { id: 'log-004', workflowName: 'Relatório Diário', status: 'success', timestamp: '2024-01-14T23:00:00Z', duration: '12.4s', message: 'Relatório gerado e enviado' },
  { id: 'log-005', workflowName: 'Notificação de Erros', status: 'running', timestamp: '2024-01-15T08:00:00Z', duration: '--', message: 'Monitorando...' },
];

export function N8NWorkflow({ agent, agents = [] }: N8NWorkflowProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [logs, setLogs] = useState<ExecutionLog[]>(MOCK_LOGS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [commandTarget, setCommandTarget] = useState<string>('all');
  const [commandAction, setCommandAction] = useState<string>('');
  const [commandPayload, setCommandPayload] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [n8nUrl, setN8nUrl] = useState('');

  // Check N8N connection on mount
  useEffect(() => {
    checkN8NConnection();
  }, []);

  const checkN8NConnection = async () => {
    setConnectionStatus('checking');
    // In production, this would check the actual N8N instance
    const url = import.meta.env.VITE_N8N_URL || localStorage.getItem('n8n_url') || '';
    setN8nUrl(url);
    
    // Simulate connection check
    setTimeout(() => {
      if (url) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    }, 1000);
  };

  const saveN8NConfig = () => {
    localStorage.setItem('n8n_url', n8nUrl);
    checkN8NConnection();
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? { ...wf, status: wf.status === 'active' ? 'inactive' : 'active' as const }
        : wf
    ));
  };

  const executeCommand = async () => {
    if (!commandAction) return;
    
    setIsExecuting(true);
    
    // Simulate API call to N8N webhook
    try {
      const payload = {
        action: commandAction,
        target: commandTarget,
        agentId: agent?.id,
        payload: commandPayload,
        timestamp: new Date().toISOString(),
      };

      // In production, this would call the actual N8N webhook
      console.log('Enviando comando para N8N:', payload);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to logs
      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        workflowName: `Comando: ${commandAction}`,
        status: 'success',
        timestamp: new Date().toISOString(),
        duration: '1.5s',
        message: `Comando executado para ${commandTarget === 'all' ? 'todos os agentes' : commandTarget}`,
      };
      
      setLogs(prev => [newLog, ...prev]);
      
      // Clear form
      setCommandPayload('');
    } catch (error) {
      console.error('Erro ao executar comando:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const runWorkflow = async (workflowId: string) => {
    setIsExecuting(true);
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        workflowName: workflow.name,
        status: 'success',
        timestamp: new Date().toISOString(),
        duration: '2.0s',
        message: 'Workflow executado manualmente',
      };
      
      setLogs(prev => [newLog, ...prev]);
      
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, lastRun: new Date().toISOString(), executions: w.executions + 1 }
          : w
      ));
    }
    
    setIsExecuting(false);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500 animate-pulse';
      case 'inactive':
      default:
        return 'bg-stone-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500 text-white">Ativo</Badge>;
      case 'success':
        return <Badge className="bg-emerald-500 text-white">Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Erro</Badge>;
      case 'running':
        return <Badge className="bg-blue-500 text-white">Executando</Badge>;
      case 'inactive':
      default:
        return <Badge variant="outline">Inativo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-stone-900">
              Status da Conexão N8N
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus === 'connected' ? 'active' : connectionStatus === 'checking' ? 'running' : 'error')}`} />
              <span className="text-xs text-stone-600 capitalize">
                {connectionStatus === 'checking' ? 'Verificando...' : connectionStatus}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="URL do N8N (ex: http://localhost:5678)"
              value={n8nUrl}
              onChange={(e) => setN8nUrl(e.target.value)}
              className="flex-1 bg-white border-stone-300"
            />
            <Button 
              onClick={saveN8NConfig}
              className="bg-stone-900 hover:bg-stone-800"
            >
              <Icon icon="solar:check-circle-linear" className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          </div>        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflows List */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-stone-900">
                Workflows ({workflows.length})
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setWorkflows(MOCK_WORKFLOWS)}
                className="border-stone-300"
              >
                <Icon icon="solar:refresh-linear" className="w-4 h-4 mr-1" />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {workflows.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedWorkflow === workflow.id 
                        ? 'bg-white border-stone-900' 
                        : 'bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300'
                      }
                    `}
                    onClick={() => setSelectedWorkflow(workflow.id === selectedWorkflow ? null : workflow.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`} />
                        <div>
                          <p className="text-sm font-medium text-stone-900">{workflow.name}</p>
                          <p className="text-xs text-stone-500">
                            Última execução: {formatTime(workflow.lastRun)} • {workflow.executions} execuções
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(workflow.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWorkflow(workflow.id);
                          }}
                        >
                          <Icon 
                            icon={workflow.status === 'active' ? 'solar:pause-linear' : 'solar:play-linear'} 
                            className="w-4 h-4 text-stone-600"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            runWorkflow(workflow.id);
                          }}
                          disabled={isExecuting}
                        >
                          <Icon icon="solar:play-circle-linear" className="w-4 h-4 text-stone-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Command Center */}
        <Card className="border-stone-300 bg-[#EAEAE5]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-stone-900">
              Central de Comandos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Alvo</label>
              <Select value={commandTarget} onValueChange={setCommandTarget}>
                <SelectTrigger className="bg-white border-stone-300">
                  <SelectValue placeholder="Selecione o alvo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Agentes</SelectItem>
                  {agent && (
                    <SelectItem value={agent.id}>{agent.name} (Atual)</SelectItem>
                  )}
                  {agents.filter(a => a.id !== agent?.id).map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Ação</label>
              <Select value={commandAction} onValueChange={setCommandAction}>
                <SelectTrigger className="bg-white border-stone-300">
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sync_leads">Sincronizar Leads</SelectItem>
                  <SelectItem value="process_tasks">Processar Tarefas</SelectItem>
                  <SelectItem value="generate_report">Gerar Relatório</SelectItem>
                  <SelectItem value="send_notification">Enviar Notificação</SelectItem>
                  <SelectItem value="backup_data">Backup de Dados</SelectItem>
                  <SelectItem value="custom">Comando Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-stone-500 mb-1.5 block">Payload (JSON opcional)</label>
              <Textarea
                placeholder='{"key": "value"}'
                value={commandPayload}
                onChange={(e) => setCommandPayload(e.target.value)}
                className="bg-white border-stone-300 min-h-[100px] font-mono text-xs"
              />
            </div>

            <Button 
              onClick={executeCommand}
              disabled={!commandAction || isExecuting || connectionStatus !== 'connected'}
              className="w-full bg-stone-900 hover:bg-stone-800"
            >
              {isExecuting ? (
                <>
                  <Icon icon="solar:refresh-linear" className="w-4 h-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Icon icon="solar:play-linear" className="w-4 h-4 mr-2" />
                  Executar Comando
                </>
              )}
            </Button>

            {connectionStatus !== 'connected' && (
              <p className="text-xs text-amber-600 text-center">
                Configure a conexão N8N para executar comandos
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Logs */}
      <Card className="border-stone-300 bg-[#EAEAE5]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-stone-900">
              Logs de Execução
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLogs([])}
              className="border-stone-300"
            >
              <Icon icon="solar:trash-bin-linear" className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-8">Nenhum log de execução</p>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-stone-200"
                  >
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{log.workflowName}</p>
                      <p className="text-xs text-stone-500">{log.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-stone-500">{formatTime(log.timestamp)}</p>
                      <p className="text-xs text-stone-400">{log.duration}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
