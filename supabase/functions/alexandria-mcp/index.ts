declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

type AlexandriaAction = "search" | "get_artifact" | "context_pack";

interface AlexandriaRequest {
  action?: AlexandriaAction;
  query?: string;
  artifactId?: string;
  artifactType?: string;
  limit?: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-alexandria-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MCP_TOKEN = Deno.env.get("ALEXANDRIA_MCP_TOKEN") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "Supabase service credentials are not configured." }, 500);
  }

  const providedToken = req.headers.get("x-alexandria-token") || bearerToken(req.headers.get("authorization"));
  if (!MCP_TOKEN || providedToken !== MCP_TOKEN) {
    return json({ error: "Unauthorized Alexandria MCP request." }, 401);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as AlexandriaRequest;
    const action = body.action || "search";

    if (action === "search") {
      return json(await searchArtifacts(body.query || "", body.limit || 8, body.artifactType));
    }

    if (action === "get_artifact") {
      if (!body.artifactId) return json({ error: "artifactId is required." }, 400);
      return json(await getArtifact(body.artifactId));
    }

    if (action === "context_pack") {
      return json(await buildContextPack(body.query || "", body.limit || 6));
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unknown Alexandria MCP error.",
    }, 500);
  }
});

async function searchArtifacts(query: string, limit: number, artifactType?: string) {
  const safeLimit = Math.min(Math.max(limit || 8, 1), 20);
  const params = new URLSearchParams({
    select: "id,title,artifact_type,status,scope,summary,tags,updated_at,metadata",
    order: "updated_at.desc",
    limit: String(safeLimit),
  });

  if (artifactType) {
    params.set("artifact_type", `eq.${artifactType}`);
  }

  const safeQuery = query.trim().replace(/[,%]/g, "");
  if (safeQuery) {
    params.set("or", `(title.ilike.*${safeQuery}*,summary.ilike.*${safeQuery}*,content.ilike.*${safeQuery}*)`);
  }

  const artifacts = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);
  return {
    query,
    count: Array.isArray(artifacts) ? artifacts.length : 0,
    artifacts,
  };
}

async function getArtifact(artifactId: string) {
  const params = new URLSearchParams({
    id: `eq.${artifactId}`,
    select: "*",
    limit: "1",
  });
  const rows = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);
  const artifact = Array.isArray(rows) ? rows[0] : null;

  if (!artifact) {
    return { artifact: null, sources: [] };
  }

  const sourceParams = new URLSearchParams({
    artifact_id: `eq.${artifactId}`,
    select: "contribution_type,hermione_sources(id,title,file_name,origin,author,source_type,detected_type,tags,created_at)",
  });
  const sources = await supabaseRest(`/rest/v1/hermione_artifact_sources?${sourceParams.toString()}`);

  return { artifact, sources: Array.isArray(sources) ? sources : [] };
}

async function buildContextPack(query: string, limit: number) {
  const result = await searchArtifacts(query, limit, undefined);
  const artifacts = Array.isArray(result.artifacts) ? result.artifacts : [];
  const lines = [
    `# Alexandria Context Pack`,
    ``,
    `Consulta: ${query || "geral"}`,
    `Gerado por: Alexandria MCP`,
    ``,
    `## Artefatos Encontrados`,
    ``,
    artifacts.length
      ? artifacts
          .map((artifact: any, index: number) =>
            [
              `### ${index + 1}. ${artifact.title}`,
              `- ID: ${artifact.id}`,
              `- Tipo: ${artifact.artifact_type}`,
              `- Status: ${artifact.status}`,
              `- Escopo: ${artifact.scope}`,
              `- Tags: ${(artifact.tags || []).join(", ") || "sem tags"}`,
              `- Resumo: ${artifact.summary || "sem resumo"}`,
            ].join("\n")
          )
          .join("\n\n")
      : "Nenhum artefato encontrado.",
  ];

  return {
    query,
    artifactCount: artifacts.length,
    markdown: lines.join("\n"),
    artifacts,
  };
}

async function supabaseRest(path: string) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Supabase REST ${response.status}`);
  }

  return payload;
}

function bearerToken(value: string | null): string {
  if (!value) return "";
  return value.toLowerCase().startsWith("bearer ") ? value.slice(7).trim() : value.trim();
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
