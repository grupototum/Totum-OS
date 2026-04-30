---
skill_id: zoom
name: "Zoom"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 9dc8b22ef571c73e3ab783237b9408521782bcdd634b1ff4625adf25427ae35f
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/zoom.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Zoom

> **ID:** `zoom`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Zoom meetings

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
prompts/zoom.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
