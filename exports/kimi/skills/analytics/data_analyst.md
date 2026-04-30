---
skill_id: data_analyst
name: "Data Analyst"
provider_target: kimi
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: 20b3bd664c8881ea9b28bf9ea06c20a35af650765ae1e84412095660b430e5f1
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/data_analyst.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 📊 Data Analyst

> **ID:** `data_analyst`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Visualização, SQL, reports

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
prompts/data_analyst.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
