---
skill_id: docx_generator
name: "DOCX Generator"
provider_target: claude_web
status: active
category: content
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 56eda3b69c8edd49b9bf6ffb252289aa8a4ca787f3ee655984d11e7f970f7c79
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/docx_generator.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📝 DOCX Generator

> **ID:** `docx_generator`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gerar Word

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
prompts/docx_generator.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
