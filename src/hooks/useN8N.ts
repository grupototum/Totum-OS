import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkN8NHealth,
  listWorkflows,
  getWorkflow,
  executeWorkflow,
  getExecutions,
  getN8NEditorUrl,
  isN8NConfigured,
  type N8NWorkflow,
  type N8NExecution,
} from "@/services/n8n";

const N8N_QUERY_KEY = "n8n";

export function useN8NHealth() {
  return useQuery({
    queryKey: [N8N_QUERY_KEY, "health"],
    queryFn: checkN8NHealth,
    refetchInterval: 30000,
    enabled: isN8NConfigured(),
  });
}

export function useN8NWorkflows() {
  return useQuery({
    queryKey: [N8N_QUERY_KEY, "workflows"],
    queryFn: listWorkflows,
    enabled: isN8NConfigured(),
    staleTime: 60000,
  });
}

export function useN8NWorkflow(id: string) {
  return useQuery({
    queryKey: [N8N_QUERY_KEY, "workflow", id],
    queryFn: () => getWorkflow(id),
    enabled: isN8NConfigured() && !!id,
  });
}

export function useN8NExecutions(workflowId?: string, limit = 20) {
  return useQuery({
    queryKey: [N8N_QUERY_KEY, "executions", workflowId, limit],
    queryFn: () => getExecutions(workflowId, limit),
    enabled: isN8NConfigured(),
    refetchInterval: 10000,
  });
}

export function useExecuteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: Record<string, unknown> }) =>
      executeWorkflow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [N8N_QUERY_KEY, "executions", variables.id] });
    },
  });
}

export function useN8NEditorUrl(workflowId?: string, agentId?: string) {
  return getN8NEditorUrl(workflowId, agentId);
}

export { isN8NConfigured, type N8NWorkflow, type N8NExecution };
