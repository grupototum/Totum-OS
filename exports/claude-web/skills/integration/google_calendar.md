---
skill_id: google_calendar
name: "Google Calendar"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: d75d1a6e83a86bb25a3214ba5df284fddf270f78ce140e387d54c1258e20f3eb
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/google_calendar.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Google Calendar

> **ID:** `google_calendar`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Calendário Google

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
prompts/google_calendar.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
