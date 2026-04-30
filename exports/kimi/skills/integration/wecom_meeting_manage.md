---
skill_id: wecom_meeting_manage
name: "WeCom Meeting Manage"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: c3f5e5bb484d0802394c7c15aafea1f80881071d68ededf6cf26dec374a0998d
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/wecom_meeting_manage.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WeCom Meeting Manage

> **ID:** `wecom_meeting_manage`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gerenciar reuniões

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
prompts/wecom_meeting_manage.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
