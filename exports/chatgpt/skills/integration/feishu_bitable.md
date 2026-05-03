---
skill_id: feishu_bitable
name: "Feishu Bitable"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 978845d02a4336a95b8783eadd8c3f5c03bc301cdf23f03127d06c9ef80443f3
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/feishu_bitable.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Feishu Bitable

> **ID:** `feishu_bitable`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gestão de dados em tabelas

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
prompts/feishu_bitable.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
