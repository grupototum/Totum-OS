---
skill_id: md_to_pdf
name: "MD to PDF"
provider_target: claude_web
status: active
category: content
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 7f842f18c756894eb0b19edcfd01c9ab69752941c6725f2c95c124c336779ea8
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/md_to_pdf.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📝 MD to PDF

> **ID:** `md_to_pdf`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Markdown → PDF

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
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/md_to_pdf.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
