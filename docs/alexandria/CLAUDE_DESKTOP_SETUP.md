# Conectar Claude Desktop à Alexandria

Este guia é para instalar a ponte local da Alexandria no Mac de uma pessoa da equipe.

## O que esta ponte faz

Ela adiciona ferramentas ao Claude Desktop para consultar a Alexandria:

- buscar skills, POPs, prompts, decisões e pacotes de contexto;
- abrir um artefato completo pelo ID;
- gerar um pacote Markdown de contexto para uma tarefa.

Ela não dá acesso à Bulma pessoal. A ponte fala apenas com a Alexandria/Totum OS.

## Pré-requisitos

- Claude Desktop atualizado.
- Node.js 18 ou superior.
- Token `ALEXANDRIA_MCP_TOKEN` criado pelo administrador do Totum OS.
- A função Supabase `alexandria-mcp` implantada com o mesmo token.

## 1. Copiar a pasta do MCP

No Mac da sócia, criar uma pasta:

```bash
mkdir -p ~/Totum
```

Copiar a pasta `tools/alexandria-claude-mcp` para:

```text
~/Totum/alexandria-claude-mcp
```

## 2. Testar o Node

```bash
node --version
node ~/Totum/alexandria-claude-mcp/server.mjs
```

Se o comando ficar aguardando, está tudo bem. Pressione `Ctrl+C` para sair.

## 3. Configurar Claude Desktop

Abrir ou criar:

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

Colar este conteúdo, trocando `TOKEN_AQUI` pelo token real:

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

Trocar `NOME_DA_SOCIA` pelo usuário do Mac dela.

## 4. Reiniciar Claude Desktop

Fechar o Claude Desktop completamente e abrir de novo.

No Claude, clicar no botão `+` da caixa de mensagem e abrir `Connectors` para ver se `alexandria` aparece.

## 5. Como usar

Exemplos de prompts:

```text
Consulte a Alexandria e encontre skills de copywriting para anúncios.
```

```text
Use a Alexandria para montar um pacote de contexto para criar um planejamento de redes sociais para uma clínica odontológica.
```

```text
Busque na Alexandria POPs relacionados a deploy e me mostre as fontes encontradas.
```

```text
Pegue o artefato da Alexandria com ID <id> e transforme em um briefing de execução.
```

## Segurança

- Não colocar token da Alexandria em prints ou conversas.
- Não usar service role key no Mac da sócia.
- Se o Mac sair da equipe, revogar `ALEXANDRIA_MCP_TOKEN`.
- A Bulma pessoal não entra nesta ponte.

## Diagnóstico

Se não aparecer no Claude:

1. Confirmar se o arquivo `claude_desktop_config.json` é JSON válido.
2. Confirmar se o caminho do `server.mjs` existe.
3. Confirmar `node --version`.
4. Reiniciar o Claude Desktop.
5. Conferir se `ALEXANDRIA_MCP_TOKEN` está correto.
