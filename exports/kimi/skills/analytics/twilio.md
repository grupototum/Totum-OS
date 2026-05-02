---
skill_id: twilio
name: "Twilio"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: eedf60e08ce1e40db221c28fd3c2f687c1fcaf6971d6d63af5e29ad17aa71049
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/twilio.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Twilio

> **ID:** `twilio`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

SMS/WhatsApp API

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
prompts/twilio.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
