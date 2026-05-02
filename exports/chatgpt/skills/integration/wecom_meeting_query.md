---
skill_id: wecom_meeting_query
name: "WeCom Meeting Query"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: d3454cb2f36a901f54e497db956cbfe7e610a65597c80ef974bffbba00082156
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/wecom_meeting_query.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 WeCom Meeting Query

> **ID:** `wecom_meeting_query`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Consultar reuniões

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
prompts/wecom_meeting_query.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
