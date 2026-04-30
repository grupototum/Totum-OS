---
skill_id: playwright_mcp
name: "Playwright MCP"
provider_target: kimi
status: active
category: automation
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: e28a3b3affe89c150fc320f8df92084e3d6d41ab84e977cf6534d92f03f4f9c0
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/playwright_mcp.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# ⚙️ Playwright MCP

> **ID:** `playwright_mcp`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Browser Playwright

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** `claude`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/playwright_mcp.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
