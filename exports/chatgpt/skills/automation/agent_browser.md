---
skill_id: agent_browser
name: "Agent Browser"
provider_target: chatgpt
status: active
category: automation
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 32b9bea2d868bcbc6768901ef51b43ecf6657c5d4446504810eacf6e65202b9c
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/agent_browser.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# ⚙️ Agent Browser

> **ID:** `agent_browser`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Browser headless

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
prompts/agent_browser.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
