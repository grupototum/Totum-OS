---
skill_id: api_gateway
name: "API Gateway"
provider_target: claude_web
status: active
category: automation
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 6261c022908b35ee5acda6f0df4e192b029281118e21c1b27014bd7ee3a93ab1
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/api_gateway.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# ⚙️ API Gateway

> **ID:** `api_gateway`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gateway APIs gerenciado

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
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/api_gateway.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
