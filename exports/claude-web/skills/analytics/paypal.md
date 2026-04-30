---
skill_id: paypal
name: "PayPal"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 508e4ef6eb3fccd52d355c42086f7eaaa2d6130c11d7d7574fc98a8b1d30f4f1
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/paypal.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 PayPal

> **ID:** `paypal`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Pagamentos PayPal

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
prompts/paypal.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
