---
skill_id: feishu_fetch_doc
name: "Feishu Fetch Doc"
provider_target: claude_web
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 3629172aec7db0c0cc8e97efacd4df0c66d71c2ebd3f3633df8f37a1fd6c3550
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/feishu_fetch_doc.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub integration no Claude.

# 🔌 Feishu Fetch Doc

> **ID:** `feishu_fetch_doc`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Leitura de documentos

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
prompts/feishu_fetch_doc.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
