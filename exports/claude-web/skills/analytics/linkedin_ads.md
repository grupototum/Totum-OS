---
skill_id: linkedin_ads
name: "LinkedIn Ads"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: b68f91add5ce8151fb8c9324554b528a245ede169eff6890d55c7c6e03da2acd
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/linkedin_ads.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 LinkedIn Ads

> **ID:** `linkedin_ads`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

LinkedIn Ads

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
prompts/linkedin_ads.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
