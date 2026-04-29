---
skill_id: telegram
name: "Telegram"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 8c4bc9be1b4e98da92ae422a8ea49e1cb88973d5773dc30de329a2b0b7c80afd
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/telegram.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Telegram

> **ID:** `telegram`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Bot Telegram

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
prompts/telegram.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
