---
skill_id: wecom_edit_todo
name: "WeCom Edit Todo"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 45c856866b75617b82df891a4cd831709228a1422d56189d8138b8216c72bc48
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/wecom_edit_todo.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 WeCom Edit Todo

> **ID:** `wecom_edit_todo`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Tarefas WeCom

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
prompts/wecom_edit_todo.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
