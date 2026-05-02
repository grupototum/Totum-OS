---
skill_id: wecom_smartsheet_data
name: "WeCom Smartsheet Data"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: d1b2dde11bd2d0b7aeb4df5021eef5d97858bc21be727fc930c958985c804c8e
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/wecom_smartsheet_data.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WeCom Smartsheet Data

> **ID:** `wecom_smartsheet_data`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Dados smart tables

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
prompts/wecom_smartsheet_data.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
