---
skill_id: wecom_msg
name: "WeCom Message"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 594ffdcb5687f139ca1ab6107ff6068ded806c9d14b1ccc055abb0c89d004692
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/wecom_msg.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WeCom Message

> **ID:** `wecom_msg`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Mensagens WeCom

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
prompts/wecom_msg.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
