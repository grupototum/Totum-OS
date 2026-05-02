---
skill_id: stripe
name: "Stripe"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 8faaac1587b706800eafac6f5e7f4bc8b985dfbee97ec7be714910f4d456c321
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/stripe.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 Stripe

> **ID:** `stripe`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Pagamentos Stripe

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
prompts/stripe.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
