---
skill_id: notion
name: "Notion"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: d863afb7b65847011d4a748867746a73cafd1a915dbb42c715ada0688087aa62
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/notion.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Notion

> **ID:** `notion`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Integração Notion

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
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/notion.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
