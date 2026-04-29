---
skill_id: wecom_schedule
name: "WeCom Schedule"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 9805dad40ea0ec1b2ab6bd68f8f1db12cd69f7f24117cc81e4cf77760e4ea8bb
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/wecom_schedule.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 WeCom Schedule

> **ID:** `wecom_schedule`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Agendas WeCom

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
prompts/wecom_schedule.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
