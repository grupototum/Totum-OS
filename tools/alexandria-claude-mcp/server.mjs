#!/usr/bin/env node

const MCP_VERSION = "2024-11-05";
const SERVER_NAME = "alexandria";
const SERVER_VERSION = "0.1.0";

const ALEXANDRIA_MCP_URL = process.env.ALEXANDRIA_MCP_URL || "";
const ALEXANDRIA_MCP_TOKEN = process.env.ALEXANDRIA_MCP_TOKEN || "";

const tools = [
  {
    name: "alexandria_search",
    description: "Busca artefatos, skills, POPs, prompts, decisões e pacotes de contexto na Alexandria do Totum OS.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Termo de busca. Exemplo: copywriting, POP de deploy, briefing de social media.",
        },
        artifactType: {
          type: "string",
          enum: ["skill", "pop", "prompt", "decision", "summary", "document", "context_pack"],
          description: "Filtro opcional por tipo de artefato.",
        },
        limit: {
          type: "number",
          description: "Quantidade máxima de resultados. Padrão: 8.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "alexandria_get_artifact",
    description: "Carrega um artefato completo da Alexandria pelo ID retornado em alexandria_search.",
    inputSchema: {
      type: "object",
      properties: {
        artifactId: {
          type: "string",
          description: "ID do artefato Hermione/Alexandria.",
        },
      },
      required: ["artifactId"],
    },
  },
  {
    name: "alexandria_context_pack",
    description: "Gera um pacote Markdown com os artefatos mais relevantes para uma tarefa.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Tarefa ou tema para montar contexto. Exemplo: criar campanha de ads para cliente odontológico.",
        },
        limit: {
          type: "number",
          description: "Quantidade máxima de artefatos usados. Padrão: 6.",
        },
      },
      required: ["query"],
    },
  },
];

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    handleLine(line).catch((error) => {
      writeError(null, -32603, error instanceof Error ? error.message : "Internal MCP error");
    });
  }
});

async function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    writeError(null, -32700, "Invalid JSON");
    return;
  }

  if (!message.id && message.method) {
    return;
  }

  if (message.method === "initialize") {
    writeResult(message.id, {
      protocolVersion: message.params?.protocolVersion || MCP_VERSION,
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
    });
    return;
  }

  if (message.method === "tools/list") {
    writeResult(message.id, { tools });
    return;
  }

  if (message.method === "tools/call") {
    const result = await callTool(message.params?.name, message.params?.arguments || {});
    writeResult(message.id, result);
    return;
  }

  writeError(message.id, -32601, `Unknown method: ${message.method}`);
}

async function callTool(name, args) {
  ensureConfigured();

  if (name === "alexandria_search") {
    return toolResult(await alexandriaRequest({
      action: "search",
      query: args.query || "",
      artifactType: args.artifactType,
      limit: args.limit || 8,
    }));
  }

  if (name === "alexandria_get_artifact") {
    return toolResult(await alexandriaRequest({
      action: "get_artifact",
      artifactId: args.artifactId,
    }));
  }

  if (name === "alexandria_context_pack") {
    return toolResult(await alexandriaRequest({
      action: "context_pack",
      query: args.query || "",
      limit: args.limit || 6,
    }));
  }

  throw new Error(`Ferramenta desconhecida: ${name}`);
}

async function alexandriaRequest(body) {
  const response = await fetch(ALEXANDRIA_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-alexandria-token": ALEXANDRIA_MCP_TOKEN,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Alexandria MCP HTTP ${response.status}`);
  }

  return payload;
}

function ensureConfigured() {
  if (!ALEXANDRIA_MCP_URL || !ALEXANDRIA_MCP_TOKEN) {
    throw new Error("Configure ALEXANDRIA_MCP_URL e ALEXANDRIA_MCP_TOKEN no Claude Desktop.");
  }
}

function toolResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function writeResult(id, result) {
  write({ jsonrpc: "2.0", id, result });
}

function writeError(id, code, message) {
  write({
    jsonrpc: "2.0",
    id,
    error: { code, message },
  });
}

function write(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}
