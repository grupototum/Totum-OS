---
skill_id: google_drive
name: "Google Drive"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: f2a1832901446b86c9dfb018e7a5f97439ae83a673ceafeeab7ba98784070841
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/google_drive.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Google Drive

> **ID:** `google_drive`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Drive Google

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
prompts/google_drive.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
