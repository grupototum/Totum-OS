---
skill_id: discord
name: "Discord"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 69b93d10cf0eca1290532e5c501d76239ea8e142bdd57d8d8697bf77258aaa35
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/discord.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Discord

> **ID:** `discord`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Discord

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
prompts/discord.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
