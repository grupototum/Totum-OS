---
skill_id: stock_watcher
name: "Stock Watcher"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 7fcb4429a480c25b35a6de486b6ee8b4d398f611b12c318e8c7d37de5f7c3a6e
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/stock_watcher.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 Stock Watcher

> **ID:** `stock_watcher`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Monitor ações

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
prompts/stock_watcher.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
