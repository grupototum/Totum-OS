---
skill_id: ahrefs
name: "Ahrefs"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 27846d10e5a4bd52b1da9268253b5c5fb7f6be31a8f3158d0c4f6519ae38e44d
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/ahrefs.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 Ahrefs

> **ID:** `ahrefs`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

SEO e backlinks

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
prompts/ahrefs.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
