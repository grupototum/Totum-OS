---
skill_id: clickup
name: "ClickUp"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 3e8ad94423c9b6d8962e95450c9970e42d882343aafd8f9e41e43f026d52468f
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/clickup.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 ClickUp

> **ID:** `clickup`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

All-in-one workspace

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
prompts/clickup.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
