/**
 * n8n API Client
 * Interacts with n8n REST API for workflow management and execution.
 */

const N8N_URL = import.meta.env.VITE_N8N_URL || localStorage.getItem("n8n_url") || "";
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || localStorage.getItem("n8n_api_key") || "";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (N8N_API_KEY) {
    headers["X-N8N-API-KEY"] = N8N_API_KEY;
  }
  return headers;
}

function getBaseUrl(): string {
  return N8N_URL.replace(/\/$/, "");
}

function canFetchFromBrowser(url: string): boolean {
  if (!url) return false;
  if (typeof window === "undefined") return true;

  try {
    const parsed = new URL(url);
    const isHttpsPage = window.location.protocol === "https:";
    const isInsecureRemote = parsed.protocol === "http:" && !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
    return !(isHttpsPage && isInsecureRemote);
  } catch {
    return false;
  }
}

export interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ id: string; name: string }>;
}

export interface N8NExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "success" | "error" | "running" | "waiting";
  startedAt: string;
  stoppedAt?: string;
  mode: string;
}

export interface N8NWebhook {
  id: string;
  name: string;
  path: string;
  method: string;
}

export async function checkN8NHealth(): Promise<boolean> {
  if (!N8N_URL) return false;
  if (!canFetchFromBrowser(getBaseUrl())) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${getBaseUrl()}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export async function listWorkflows(): Promise<N8NWorkflow[]> {
  if (!canFetchFromBrowser(getBaseUrl())) return [];
  const res = await fetch(`${getBaseUrl()}/api/v1/workflows`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to list workflows: ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

export async function getWorkflow(id: string): Promise<N8NWorkflow> {
  if (!canFetchFromBrowser(getBaseUrl())) throw new Error("N8N indisponível neste ambiente");
  const res = await fetch(`${getBaseUrl()}/api/v1/workflows/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to get workflow: ${res.status}`);
  const data = await res.json();
  return data;
}

export async function executeWorkflow(id: string, data?: Record<string, unknown>): Promise<{ executionId: string }> {
  if (!canFetchFromBrowser(getBaseUrl())) throw new Error("N8N indisponível neste ambiente");
  const res = await fetch(`${getBaseUrl()}/api/v1/workflows/${id}/execute`, {
    method: "POST",
    headers: getHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`Failed to execute workflow: ${res.status}`);
  const result = await res.json();
  return { executionId: result.executionId };
}

export async function getExecutions(workflowId?: string, limit = 20): Promise<N8NExecution[]> {
  if (!canFetchFromBrowser(getBaseUrl())) return [];
  const url = new URL(`${getBaseUrl()}/api/v1/executions`);
  url.searchParams.set("limit", String(limit));
  if (workflowId) url.searchParams.set("workflowId", workflowId);

  const res = await fetch(url.toString(), { headers: getHeaders() });
  if (!res.ok) throw new Error(`Failed to get executions: ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

export function getN8NEditorUrl(workflowId?: string, agentId?: string): string {
  const base = getBaseUrl() || "https://n8n.io";
  if (workflowId) {
    const url = `${base}/workflow/${workflowId}`;
    if (agentId) return `${url}?agentId=${agentId}`;
    return url;
  }
  return `${base}/workflow`;
}

export function getWebhookUrl(webhookPath: string): string {
  return `${getBaseUrl()}/webhook/${webhookPath}`;
}

export function isN8NConfigured(): boolean {
  return !!N8N_URL;
}
