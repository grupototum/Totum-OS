import { supabase } from "@/integrations/supabase/client";

export type AnythingLlmMode = "chat" | "query";

export interface AnythingLlmChatRequest {
  workspaceSlug: string;
  message: string;
  mode?: AnythingLlmMode;
  sessionId?: string;
  attachments?: Array<{ name: string; content: string; mime?: string }>;
  agentSlug?: string;
  model?: string;
}

export interface AnythingLlmSource {
  title?: string;
  document?: string;
  text?: string;
  score?: number;
  url?: string;
}

export interface AnythingLlmChatResponse {
  text: string;
  sources: AnythingLlmSource[];
  raw?: unknown;
}

export async function askAnythingLlm(request: AnythingLlmChatRequest): Promise<AnythingLlmChatResponse> {
  const { data, error } = await supabase.functions.invoke("agent-chat", {
    body: {
      workspaceSlug: request.workspaceSlug,
      message: request.message,
      mode: request.mode || "chat",
      sessionId: request.sessionId,
      attachments: request.attachments || [],
      agentSlug: request.agentSlug,
      model: request.model,
    },
  });

  if (error) {
    throw new Error(error.message || "AnythingLLM não respondeu pelo proxy interno.");
  }

  const payload = data as Partial<AnythingLlmChatResponse> | undefined;
  return {
    text: payload?.text || "",
    sources: payload?.sources || [],
    raw: payload?.raw,
  };
}

export function workspaceForAgent(agentSlug?: string | null) {
  if (!agentSlug) return "totum-agents";
  if (agentSlug === "hermione") return "hermione-alexandria";
  return `agent-${agentSlug}`;
}
