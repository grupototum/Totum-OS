declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AgentChatBody {
  workspaceSlug?: string;
  message?: string;
  mode?: "chat" | "query";
  sessionId?: string;
  attachments?: Array<{ name: string; content: string; mime?: string }>;
  agentSlug?: string;
  model?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as AgentChatBody;
    const apiBase = Deno.env.get("ANYTHINGLLM_API_BASE") || "http://127.0.0.1:3001/api";
    const apiKey = Deno.env.get("ANYTHINGLLM_API_KEY");
    const defaultWorkspace = Deno.env.get("ANYTHINGLLM_DEFAULT_WORKSPACE") || "totum-agents";
    const workspaceSlug = body.workspaceSlug || defaultWorkspace;

    if (!apiKey) {
      return json({
        text: "AnythingLLM ainda não está configurado no ambiente. Defina ANYTHINGLLM_API_KEY na função agent-chat.",
        sources: [],
        raw: { configured: false },
      });
    }

    if (!body.message?.trim()) {
      return json({ text: "Mensagem vazia.", sources: [] }, 400);
    }

    const message = [
      body.attachments?.length
        ? `Contextos/skills anexados:\n\n${body.attachments.map((file) => `## ${file.name}\n${file.content}`).join("\n\n")}`
        : "",
      body.agentSlug ? `Agente solicitado: ${body.agentSlug}` : "",
      body.model ? `Modelo preferido: ${body.model}` : "",
      body.message,
    ].filter(Boolean).join("\n\n---\n\n");

    const response = await fetch(`${apiBase.replace(/\/$/, "")}/v1/workspace/${workspaceSlug}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message,
        mode: body.mode || "chat",
        sessionId: body.sessionId,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return json({
        text: "",
        sources: [],
        raw: payload,
        error: payload?.error || `AnythingLLM HTTP ${response.status}`,
      }, response.status);
    }

    return json({
      text: payload?.textResponse || payload?.response || payload?.message || payload?.text || "",
      sources: payload?.sources || payload?.sourceDocuments || [],
      raw: payload,
    });
  } catch (error) {
    return json({
      text: "",
      sources: [],
      error: error instanceof Error ? error.message : "Erro desconhecido no proxy agent-chat.",
    }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
