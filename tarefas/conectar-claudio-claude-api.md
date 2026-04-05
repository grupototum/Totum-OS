# TAREFA PENDENTE: Conectar Claudio (Agente) à Claude API

**Data:** 2026-04-03  
**Prioridade:** 🔴 Alta  
**Responsável:** TOT  

## Objetivo
Integrar o agente Claudio do Apps Totum à API da Claude (Anthropic) para criar um subagente de coding.

## Componentes
- Claudio Code (frontend no Apps Totum)
- Claude API (Anthropic)
- Stark API (backend intermediário)

## Fluxo Proposto
```
Usuário → Claudio (Apps Totum) → Stark API → Claude API
                ↓
         Resposta processada
                ↓
         Execução/Exibição
```

## Implementação
1. Endpoint no Stark API: `/api/claude/ask` (já existe!)
2. Adicionar autenticação API key da Anthropic
3. Configurar modelo: claude-3-7-sonnet-20250219
4. Integrar frontend do Claudio com backend

## Arquivos Envolvidos
- `/opt/stark-api/routes/claude.js` (backend)
- `/opt/apps-totum/app/src/pages/claude/` (frontend)

## Status
⏳ Pendente implementação
