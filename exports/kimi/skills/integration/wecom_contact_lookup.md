---
skill_id: wecom_contact_lookup
name: "WeCom Contact Lookup"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: fc0e5acdc43ae47dc6c2ebf34d755d8ed0f75b1858eef50a9777d87bdaa3d5f1
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/wecom_contact_lookup.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WeCom Contact Lookup

> **ID:** `wecom_contact_lookup`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Busca de contatos

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
prompts/wecom_contact_lookup.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
