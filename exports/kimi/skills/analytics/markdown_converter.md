---
skill_id: markdown_converter
name: "Markdown Converter"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: b41ae02d33c51c4b01837f86deda7c3d609b06848c63fe27b1b6c4aa436c1682
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/markdown_converter.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Markdown Converter

> **ID:** `markdown_converter`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Converter para Markdown

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
prompts/markdown_converter.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
