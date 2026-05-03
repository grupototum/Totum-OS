---
skill_id: google_ads
name: "Google Ads"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: e0bfb314665804111d643e06c905bdebb57aa65ea51c13c715cca9a1ede0675b
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/google_ads.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 Google Ads

> **ID:** `google_ads`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Google Ads

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
prompts/google_ads.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
