# Alexandria Claude MCP

Ponte local para conectar o Claude Desktop à Alexandria do Totum OS.

O Claude roda este servidor MCP como processo local. O servidor local não acessa o Supabase diretamente; ele chama a Supabase Edge Function `alexandria-mcp` usando `ALEXANDRIA_MCP_TOKEN`.

## Ferramentas

- `alexandria_search`: busca artefatos por tema.
- `alexandria_get_artifact`: carrega um artefato completo pelo ID.
- `alexandria_context_pack`: gera um pacote Markdown para uma tarefa.

## Variáveis

```bash
ALEXANDRIA_MCP_URL=https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp
ALEXANDRIA_MCP_TOKEN=token-fornecido-pelo-admin
```

## Claude Desktop macOS

Editar:

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

Exemplo:

```json
{
  "mcpServers": {
    "alexandria": {
      "command": "node",
      "args": [
        "/Users/NOME_DA_SOCIA/Totum/alexandria-claude-mcp/server.mjs"
      ],
      "env": {
        "ALEXANDRIA_MCP_URL": "https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp",
        "ALEXANDRIA_MCP_TOKEN": "TOKEN_AQUI"
      }
    }
  }
}
```

Depois de salvar, reiniciar o Claude Desktop.
