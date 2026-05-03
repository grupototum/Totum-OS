---
skill_id: whatsapp
name: "WhatsApp"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: bd470916d2f2a4e4fc3b4e32410b5c6fbd3ff8250f79650e1e4feb92d707652f
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/whatsapp.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 WhatsApp

> **ID:** `whatsapp`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

WhatsApp Business

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
prompts/whatsapp.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
