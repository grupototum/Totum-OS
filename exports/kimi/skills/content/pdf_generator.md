---
skill_id: pdf_generator
name: "PDF Generator"
provider_target: kimi
status: active
category: content
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 442e22f0e1aa8e8b8896938b51a4959f679527be3ac9a5081c5f1a89b0a565f8
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/pdf_generator.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📝 PDF Generator

> **ID:** `pdf_generator`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gerar PDFs

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
prompts/pdf_generator.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
