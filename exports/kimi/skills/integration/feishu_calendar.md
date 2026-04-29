---
skill_id: feishu_calendar
name: "Feishu Calendar"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: dc20607f3af007e6bc01f6c4493ecb68fed29b04e0fa960c4e1ec8668c122045
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/feishu_calendar.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Feishu Calendar

> **ID:** `feishu_calendar`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Calendário e agendamento

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
prompts/feishu_calendar.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
