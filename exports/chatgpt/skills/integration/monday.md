---
skill_id: monday
name: "Monday"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: f3e679da647ec4cc947f621ac0ba0f28868689808b856cff7f1baf260b5b0422
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/monday.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Monday

> **ID:** `monday`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Monday.com

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
prompts/monday.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
