---
skill_id: feishu_task
name: "Feishu Task"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: c18b712f346a9b5c155cf3bfd07d1df53a14092c761d40b298289b729a32affb
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/feishu_task.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Feishu Task

> **ID:** `feishu_task`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Tarefas e to-dos

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
prompts/feishu_task.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
