---
skill_id: airtable
name: "Airtable"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 43e48d16d4747fd12d27c450e5210d391304c37afbadc68c00a0c62906e227bd
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/airtable.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Airtable

> **ID:** `airtable`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Bases Airtable

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
prompts/airtable.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
