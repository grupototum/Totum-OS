---
skill_id: google_sheets
name: "Google Sheets"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 57c78d975a1d4d2f32983349a78e45b4d4fa4d9706967106e930af8c5190cd6b
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/google_sheets.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 Google Sheets

> **ID:** `google_sheets`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Planilhas Google

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

- **Modelo preferido:** `groq`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/google_sheets.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
