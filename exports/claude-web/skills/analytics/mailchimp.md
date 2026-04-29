---
skill_id: mailchimp
name: "Mailchimp"
provider_target: claude_web
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: d6420591207db1615592cccc0453bc921b29338ca22f8b3e3ad05084f55d29b3
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/mailchimp.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 📊 Mailchimp

> **ID:** `mailchimp`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Email marketing

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
prompts/mailchimp.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
