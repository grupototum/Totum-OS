---
skill_id: channels_setup
name: "Channels Setup"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 120731cb8ae5804afcb7c7463d44610ea37cd0c9189287edcb093f5dfba0641c
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/channels_setup.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Channels Setup

> **ID:** `channels_setup`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Configuração canais

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
prompts/channels_setup.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
