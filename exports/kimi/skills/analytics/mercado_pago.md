---
skill_id: mercado_pago
name: "Mercado Pago"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: eb9c65d766440718f34792bd28fcc5f5bbae8958a4a7330ebd0a1dd3a0735386
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/mercado_pago.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Mercado Pago

> **ID:** `mercado_pago`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Mercado Pago

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
prompts/mercado_pago.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
