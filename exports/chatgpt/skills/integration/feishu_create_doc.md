---
skill_id: feishu_create_doc
name: "Feishu Create Doc"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 749d4964229995c50e60e5944feaf5340869ba2b309fc37a48aefcd4c0c069b9
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/feishu_create_doc.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Feishu Create Doc

> **ID:** `feishu_create_doc`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Criação de documentos

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
prompts/feishu_create_doc.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
