---
skill_id: playwright_scraper_skill
name: "Playwright Scraper"
provider_target: kimi
status: active
category: automation
is_primary: false
routing_priority: 0
model_preference: claude
tags: []
content_hash: 02e9266c005ecf11c25bdb4052044c298936784fedab25d1611407b723671c2f
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/playwright_scraper_skill.md
---

Esta skill foi exportada pela Alexandria/Totum OS para upload na Files API do Kimi.

# ⚙️ Playwright Scraper

> **ID:** `playwright_scraper_skill`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Web scraping

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
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/playwright_scraper_skill.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
