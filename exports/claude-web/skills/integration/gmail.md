---
skill_id: gmail
name: "Gmail"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 359703302b915c508ae878df7bae3158c63cd075476abcc3cc88effd645d1850
updated_at: 2026-05-01T00:43:48.380Z
prompt_template_path: prompts/gmail.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Gmail

> **ID:** `gmail`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gmail integrado

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
prompts/gmail.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
