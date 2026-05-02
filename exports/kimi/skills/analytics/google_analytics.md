---
skill_id: google_analytics
name: "Google Analytics"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: a4ce1e2cb04f932aa4d80a88a6db11991218e374a917618321b683cff56cc3df
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/google_analytics.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Google Analytics

> **ID:** `google_analytics`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Métricas GA4

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
prompts/google_analytics.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
