---
skill_id: wecom_meeting_create
name: "WeCom Meeting Create"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: ddca19b68753dd2caea69b7f9743d86ac260501b67debdf3bc92509ad76ae01e
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/wecom_meeting_create.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 WeCom Meeting Create

> **ID:** `wecom_meeting_create`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Criar reuniões

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
prompts/wecom_meeting_create.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
