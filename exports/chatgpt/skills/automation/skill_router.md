---
skill_id: skill_router
name: "Skill Router"
provider_target: chatgpt
status: active
category: automation
is_primary: true
routing_priority: 1000
model_preference: claude
tags: ["router", "planner", "orchestration", "skills", "alexandria"]
content_hash: f996d9c619b4f188a54b4bd538faee2d6c61a6a1687ae34412c3a63f51d4569f
updated_at: 2026-04-29T15:22:10.997Z
prompt_template_path: prompts/skill_router.md
---

Esta skill foi exportada pela Alexandria/Totum OS para consumo via GitHub connector/synced connector no ChatGPT.

# 🚦 Skill Router

> **ID:** `skill_router`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active  
> **Papel:** principal

## Descrição

Escolhe quais skills da Totum devem ser usadas para cada objetivo antes da execução.

## Uso na Totum

- Primeira skill consultada quando a IA precisa decidir o melhor caminho
- Roteamento entre skills por objetivo, contexto e categoria
- Planejamento de ordem de execução antes de chamar outras skills

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| objective | string | sim | Pedido, meta ou problema que precisa de roteamento |
| context | object | não | Contexto adicional de cliente, canal, projeto, etapa ou restrições |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| recommended_skills | array | Lista priorizada de skills recomendadas |
| execution_plan | object | Plano sugerido de execução, ordem e justificativa |

## Regras de Roteamento

- Sempre considere a intenção principal antes do provider preferido
- Prefira o menor conjunto de skills capaz de resolver o objetivo
- Priorize skills ativas e com melhor aderência de categoria
- Explique por que cada skill foi escolhida
- Se faltar confiança, devolva 2 a 3 opções com ordem sugerida

## Configuração

- **Modelo preferido:** `claude`
- **Custo estimado:** R$ 0.03/chamada
- **Taxa de sucesso:** ~98%
- **Duração estimada:** ~1200ms

## Dependências

```json
{"dependencies": []}
```

## Prompt Template

```
prompts/skill_router.md
```

---

*Skill principal da Alexandria para descoberta e priorização de skills*
