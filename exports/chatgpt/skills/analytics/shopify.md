---
skill_id: shopify
name: "Shopify"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 9b91a827fa197f87974d4e4c54a5be8e08037cdd9cedb42ceb197e97b22c9b4b
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/shopify.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 Shopify

> **ID:** `shopify`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

E-commerce Shopify

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
prompts/shopify.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
