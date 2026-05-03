---
skill_id: feishu_im_read
name: "Feishu IM Read"
provider_target: kimi
status: active
category: integration
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: f76af3ded8f350373eeceef30cbba37654893323662ff7075dcb6b4fc2e8ebe1
updated_at: 2026-05-03T14:12:50.113Z
prompt_template_path: prompts/feishu_im_read.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# 🔌 Feishu IM Read

> **ID:** `feishu_im_read`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Leitura de mensagens

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
prompts/feishu_im_read.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
