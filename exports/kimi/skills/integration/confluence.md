---
skill_id: confluence
name: "Confluence"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 097459871c880d7d989380e900d058c5409ddcb8fac4801736096e2e4599c60a
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/confluence.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Confluence

> **ID:** `confluence`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Wiki Confluence

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

- **Modelo preferido:** `claude`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/confluence.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
