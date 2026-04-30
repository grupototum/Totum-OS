---
skill_id: asana
name: "Asana"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: d42bd05ef2277e27481beec80e2cb7ccbcb28f004e591fccbb71a48af7e09df0
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/asana.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Asana

> **ID:** `asana`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Asana

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
prompts/asana.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
