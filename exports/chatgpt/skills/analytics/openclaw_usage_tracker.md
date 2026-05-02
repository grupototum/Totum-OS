---
skill_id: openclaw_usage_tracker
name: "OpenClaw Usage Tracker"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 4fcc3e4c3e8547c53c6b782d130d320dfce34f83c9b9efb33e3c88cbc84b9cbe
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/openclaw_usage_tracker.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 OpenClaw Usage Tracker

> **ID:** `openclaw_usage_tracker`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Tracking custos

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

- **Modelo preferido:** `groq`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/openclaw_usage_tracker.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
