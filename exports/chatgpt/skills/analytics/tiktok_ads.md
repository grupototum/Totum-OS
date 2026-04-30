---
skill_id: tiktok_ads
name: "TikTok Ads"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 66b19443a16eab7a6734fd73fdfa26601bacb66f82cc17a25cca2018b8a1e76d
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/tiktok_ads.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 TikTok Ads

> **ID:** `tiktok_ads`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

TikTok Ads

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
prompts/tiktok_ads.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
