---
skill_id: stock_analysis
name: "Stock Analysis"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: d52c9bd20ee7df44100a0ebe0203867ea7acff78a74887f01371f74508d83576
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/stock_analysis.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Stock Analysis

> **ID:** `stock_analysis`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Análise ações

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
prompts/stock_analysis.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
