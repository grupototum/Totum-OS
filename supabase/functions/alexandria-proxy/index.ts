import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const PROXY_URL = "https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-proxy"

const MANIFEST = {
  "$schema": "https://chat-plugins.lobehub.com/schema/plugin/v1.json",
  "api": [
    {
      "url": PROXY_URL,
      "name": "searchAlexandria",
      "description": "Busca conhecimento na Alexandria, o second brain do Totum OS. Use sempre que precisar de POPs, skills, decisões registradas, fontes ou contexto institucional da empresa. Retorna artefatos com título, resumo, tipo e tags.",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Pergunta ou tema em linguagem natural"
          },
          "limit": {
            "type": "number",
            "description": "Quantos resultados retornar (1-20, padrão 8)",
            "default": 8
          }
        },
        "required": ["query"]
      }
    }
  ],
  "identifier": "alexandria",
  "meta": {
    "avatar": "📚",
    "title": "Alexandria",
    "description": "Consulta o second brain do Totum OS",
    "tags": ["knowledge", "totum", "rag"]
  },
  "version": "1.0.0",
  "author": "Totum",
  "homepage": "https://alexandria.grupototum.com"
}

// Normalize text: remove accents, lowercase
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[,%]/g, "")
    .trim()
}

// Build multi-word OR filter for PostgREST
function buildOrFilter(query: string): string {
  const words = normalize(query)
    .split(/\s+/)
    .filter(w => w.length >= 3)
    .slice(0, 5)

  if (words.length === 0) return ""

  const conditions = words.flatMap(w => [
    `title.ilike.*${w}*`,
    `summary.ilike.*${w}*`,
    `content.ilike.*${w}*`,
  ])

  return conditions.join(",")
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS })

  if (req.method === "GET") {
    return new Response(JSON.stringify(MANIFEST), {
      headers: { ...CORS, "Content-Type": "application/json" },
    })
  }

  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405)

  let body: { query?: string; limit?: number }
  try {
    body = await req.json()
  } catch {
    return json({ error: "invalid_json" }, 400)
  }

  const { query = "", limit = 8 } = body
  if (!query || typeof query !== "string") {
    return json({ error: "missing_query" }, 400)
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), 20)
  const orFilter = buildOrFilter(query)

  const params = new URLSearchParams({
    select: "id,title,artifact_type,status,scope,summary,tags,updated_at",
    order: "updated_at.desc",
    limit: String(safeLimit),
  })

  if (orFilter) {
    params.set("or", `(${orFilter})`)
  }

  const resp = await fetch(
    `${SUPABASE_URL}/rest/v1/hermione_artifacts?${params}`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  )

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    return json({ error: (err as any).message || "upstream_error" }, 502)
  }

  const rows: any[] = await resp.json()
  const results = (Array.isArray(rows) ? rows : []).map((item) => ({
    id: item.id,
    title: item.title ?? "(sem título)",
    summary: item.summary ?? "",
    type: item.artifact_type ?? "documento",
    tags: item.tags ?? [],
    status: item.status ?? "",
    updated_at: item.updated_at,
  }))

  return json({ results, count: results.length, query })
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  })
}
