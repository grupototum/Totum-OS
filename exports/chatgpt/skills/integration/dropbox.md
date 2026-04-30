---
skill_id: dropbox
name: "Dropbox"
provider_target: chatgpt
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: ba9da090de1741a85aefe8c5ca6a2cb712ae44c394bb664c863fb93063a49e3a
updated_at: 2026-04-30T12:59:43.016Z
prompt_template_path: prompts/dropbox.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🔌 Dropbox

> **ID:** `dropbox`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Storage

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
prompts/dropbox.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
