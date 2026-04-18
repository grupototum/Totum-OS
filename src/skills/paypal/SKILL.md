# 📊 PayPal

> **ID:** `paypal`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Pagamentos PayPal

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
prompts/paypal.md
```

---

*Skill gerada automaticamente a partir do Catálogo Totum*
