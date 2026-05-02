---
skill_id: n8n_workflow_automation
name: "n8n Workflow Automation"
provider_target: chatgpt
status: active
category: automation
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: dde54522044a558df28d5c927030de65d13acf5943b64c3d8391b3f7dbab38bb
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/n8n_workflow_automation.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# ⚙️ n8n Workflow Automation

> **ID:** `n8n_workflow_automation`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Design workflows n8n

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
prompts/n8n_workflow_automation.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
