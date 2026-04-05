# TAREFA PENDENTE: Conectar Claudio à Claude API

**Data:** 2026-04-03  
**Prioridade:** 🔴 Alta  
**Responsável:** TOT  

## API Key Fornecida
`sk-ant-api03-r76...` (completa fornecida pelo Israel)

## Onde conectar
- Endpoint: `/api/claude/ask` no Stark API
- Frontend: Página Claudio no Apps Totum

## Implementação
1. Adicionar API key da Anthropic nas variáveis de ambiente
2. Configurar modelo: `claude-3-7-sonnet-20250219`
3. Testar conexão
4. Integrar resposta no frontend do Claudio

## Teste
```bash
curl -X POST http://localhost:3000/api/claude/ask \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, Claude!"}'
```

## Status
⏳ Aguardando TOT configurar
