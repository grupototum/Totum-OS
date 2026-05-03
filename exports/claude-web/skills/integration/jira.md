---
skill_id: jira
name: "Jira"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 0c998a0783fe44faf526346d1065a1de6067771955e70163a0905209a187285a
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/jira.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Jira

> **ID:** `jira`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Jira

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
prompts/jira.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
