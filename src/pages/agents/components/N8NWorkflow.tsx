import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Workflow, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Agent } from '@/hooks/useAgents';

interface N8NWorkflowProps {
  agent?: Agent;
  agents?: Agent[];
}

interface ExecutionLog {
  id: string;
  workflowName: string;
  status: 'success' | 'error' | 'running';
  timestamp: string;
  duration: string;
  message?: string;
}

export function N8NWorkflow({ agent, agents = [] }: N8NWorkflowProps) {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [n8nUrl, setN8nUrl] = useState('');

  useEffect(() => {
    checkN8NConnection();
  }, []);

  const checkN8NConnection = async () => {
    setConnectionStatus('checking');
    const url = import.meta.env.VITE_N8N_URL || localStorage.getItem('n8n_url') || '';
    setN8nUrl(url);

    if (!url) {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${url}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      setConnectionStatus(res.ok ? 'connected' : 'disconnected');
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  const saveN8NConfig = () => {
    if (n8nUrl) localStorage.setItem('n8n_url', n8nUrl);
    checkN8NConnection();
  };

  const getStatusIcon = (status: typeof connectionStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'checking':
        return <Icon icon="solar:refresh-linear" className="w-4 h-4 animate-spin text-muted-foreground" />;
      case 'disconnected':
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const n8nEditorUrl = n8nUrl ? `${n8nUrl.replace(/\/$/, '')}/workflow` : 'https://n8n.io';

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Status da Conexão N8N
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon(connectionStatus)}
              <span className="text-xs text-muted-foreground capitalize">
                {connectionStatus === 'checking' ? 'Verificando...' : connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'}
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
              className="flex-1"
            />
            <Button onClick={saveN8NConfig}>
              <Icon icon="solar:check-circle-linear" className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State / Deep Link */}
      <Card>
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Workflow className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Workflow Studio no N8N</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                O Totum não recria o workflow builder — utiliza o N8N diretamente.
                Configure a URL acima para visualizar status, ou acesse o N8N nativo.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button asChild variant="outline">
                <a href={n8nEditorUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Abrir N8N
                </a>
              </Button>
              {agent && (
                <Button asChild variant="secondary">
                  <a
                    href={`${n8nEditorUrl}?agentId=${agent.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Icon icon="solar:play-linear" className="w-4 h-4" />
                    Workflow do {agent.name}
                  </a>
                </Button>
              )}
            </div>
            {agents.length > 0 && (
              <p className="text-xs text-muted-foreground pt-2">
                {agents.length} agente{agents.length > 1 ? 's' : ''} disponível{agents.length > 1 ? 'is' : 'el'} para automação
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Logs de Execução</CardTitle>
            {logs.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                <Icon icon="solar:trash-bin-linear" className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum log de execução — os workflows são gerenciados diretamente no N8N
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                  >
                    <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.workflowName}</p>
                      <p className="text-xs text-muted-foreground">{log.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</p>
                      <p className="text-xs text-muted-foreground/70">{log.duration}</p>
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
