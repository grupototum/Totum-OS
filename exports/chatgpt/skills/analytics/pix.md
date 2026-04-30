---
skill_id: pix
name: "PIX"
provider_target: chatgpt
status: active
category: analytics
is_primary: false
routing_priority: 0
model_preference: groq
tags: []
content_hash: b27d78e1bf2b7ac363fa0df420a8575c44c24593fb5bda55120f1b83cf3c3401
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/pix.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 📊 PIX

> **ID:** `pix`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

PIX Brazil

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
prompts/pix.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
