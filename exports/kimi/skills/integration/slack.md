---
skill_id: slack
name: "Slack"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 91df50c0078de5c7ff972f762fc82575d3b4a6ffe5930e39e47f04aee457d0e9
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/slack.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Slack

> **ID:** `slack`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Integração Slack

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
prompts/slack.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
