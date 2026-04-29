---
skill_id: salesforce
name: "Salesforce"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 7e47f23612243240c6c02c7f93dfc965f6ed9f84a6a69b67663d71f43bb438f6
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/salesforce.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 Salesforce

> **ID:** `salesforce`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

CRM Salesforce

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
prompts/salesforce.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
