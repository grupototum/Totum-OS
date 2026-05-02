---
skill_id: hubspot
name: "HubSpot"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 566ee9d0f6da141a788dbe67115a0e7ef6421c0d89811d8ad7ce2861b8ffba50
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/hubspot.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 HubSpot

> **ID:** `hubspot`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

CRM HubSpot

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
prompts/hubspot.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
