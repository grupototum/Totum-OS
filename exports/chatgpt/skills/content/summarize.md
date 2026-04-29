---
skill_id: summarize
name: "Summarize"
provider_target: chatgpt
status: active
category: content
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 5e6752d55bd44b9a91e5a3cb07116dbb6b2597efc91604f849f30bcf83f4879f
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/summarize.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📝 Summarize

> **ID:** `summarize`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Resumir conteúdo

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
prompts/summarize.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
