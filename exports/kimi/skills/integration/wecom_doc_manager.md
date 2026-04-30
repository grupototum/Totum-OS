---
skill_id: wecom_doc_manager
name: "WeCom Doc Manager"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 41f64d772e302a8c71d75404fb0b578dac7a4d1c8a0f62ff1124d2ab1c8d65ac
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/wecom_doc_manager.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WeCom Doc Manager

> **ID:** `wecom_doc_manager`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Docs e smart sheets

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
prompts/wecom_doc_manager.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
