import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ExternalLink,
  Workflow,
  AlertCircle,
  CheckCircle2,
  Play,
  Clock,
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useN8NHealth,
  useN8NWorkflows,
  useN8NExecutions,
  useExecuteWorkflow,
  isN8NConfigured,
} from "@/hooks/useN8N";
import { getN8NEditorUrl } from "@/services/n8n";
import type { Agent } from "@/hooks/useAgents";
import { toast } from "sonner";

interface N8NWorkflowProps {
  agent?: Agent;
  agents?: Agent[];
}

export function N8NWorkflow({ agent }: N8NWorkflowProps) {
  const [n8nUrl, setN8nUrl] = useState(import.meta.env.VITE_N8N_URL || localStorage.getItem("n8n_url") || "");
  const [n8nApiKey, setN8nApiKey] = useState(import.meta.env.VITE_N8N_API_KEY || localStorage.getItem("n8n_api_key") || "");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(!isN8NConfigured());

  const { data: isHealthy, refetch: recheckHealth } = useN8NHealth();
  const { data: workflows, isLoading: loadingWorkflows } = useN8NWorkflows();
  const { data: executions, isLoading: loadingExecutions } = useN8NExecutions(selectedWorkflow || undefined, 10);
  const executeMutation = useExecuteWorkflow();

  const saveConfig = () => {
    if (n8nUrl) localStorage.setItem("n8n_url", n8nUrl);
    if (n8nApiKey) localStorage.setItem("n8n_api_key", n8nApiKey);
    recheckHealth();
    setShowConfig(false);
    toast.success("Configuração do N8N salva");
  };

  const handleExecute = async (workflowId: string) => {
    try {
      const result = await executeMutation.mutateAsync({ id: workflowId });
      toast.success(`Workflow executado! Execution ID: ${result.executionId}`);
    } catch (err) {
      toast.error(`Falha ao executar workflow: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
    }
  };

  const copyWebhook = (path: string) => {
    const url = `${n8nUrl.replace(/\/$/, "")}/webhook/${path}`;
    navigator.clipboard.writeText(url);
    toast.success("Webhook URL copiado");
  };

  const editorUrl = getN8NEditorUrl(selectedWorkflow || undefined, agent?.id);

  if (!isN8NConfigured() && !n8nUrl) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Workflow className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">N8N não configurado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure a URL do seu servidor N8N para gerenciar workflows e execuções.
          </p>
          <Button onClick={() => setShowConfig(true)}>Configurar N8N</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status + Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Status da Conexão N8N
            </CardTitle>
            <div className="flex items-center gap-2">
              {isHealthy === undefined ? (
                <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : isHealthy ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs text-muted-foreground capitalize">
                {isHealthy === undefined ? "Verificando..." : isHealthy ? "Conectado" : "Desconectado"}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowConfig(!showConfig)}>
                {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Input
                    placeholder="URL do N8N (ex: http://localhost:5678)"
                    value={n8nUrl}
                    onChange={(e) => setN8nUrl(e.target.value)}
                  />
                  <Input
                    placeholder="API Key do N8N (opcional)"
                    value={n8nApiKey}
                    onChange={(e) => setN8nApiKey(e.target.value)}
                    type="password"
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveConfig} size="sm">Salvar</Button>
                    <Button variant="outline" size="sm" onClick={recheckHealth}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Testar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <a
              href={editorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:underline"
            >
              Abrir N8N <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {loadingWorkflows ? (
            <div className="text-sm text-muted-foreground py-4">Carregando workflows...</div>
          ) : workflows && workflows.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {workflows.map((wf) => (
                  <div
                    key={wf.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                      selectedWorkflow === wf.id
                        ? "bg-sidebar-accent border-primary/30"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedWorkflow(wf.id === selectedWorkflow ? null : wf.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Workflow className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{wf.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={wf.active ? "default" : "secondary"} className="text-[10px] h-4">
                            {wf.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            ID: {wf.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecute(wf.id);
                        }}
                        disabled={executeMutation.isPending}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </Button>
                      <a
                        href={getN8NEditorUrl(wf.id, agent?.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Nenhum workflow encontrado. Verifique a conexão ou crie workflows no N8N.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executions */}
      {selectedWorkflow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Últimas Execuções
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingExecutions ? (
                <div className="text-sm text-muted-foreground py-4">Carregando execuções...</div>
              ) : executions && executions.length > 0 ? (
                <div className="space-y-2">
                  {executions.map((exec) => (
                    <div
                      key={exec.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-2">
                        {exec.status === "success" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : exec.status === "error" ? (
                          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                        )}
                        <span className="text-xs font-medium">{exec.workflowName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5">
                          {exec.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(exec.startedAt).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  Nenhuma execução encontrada para este workflow.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
