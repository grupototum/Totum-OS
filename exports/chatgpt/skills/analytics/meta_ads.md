---
skill_id: meta_ads
name: "Meta Ads"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: f8247973ab4ed30381162785dd44834f5e4150ecf8461e0b483136de0e4851fa
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/meta_ads.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 Meta Ads

> **ID:** `meta_ads`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Facebook/Instagram Ads

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
prompts/meta_ads.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
