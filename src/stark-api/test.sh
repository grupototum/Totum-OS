#!/bin/bash
# Script de teste rápido da Stark API

echo "🧪 Testando Stark API..."
echo ""

BASE_URL="${API_URL:-http://localhost:3001}"

echo "📍 URL Base: $BASE_URL"
echo ""

# Teste 1: Health check
echo "1️⃣ Testando Health Check..."
curl -s "$BASE_URL/health" | jq . 2>/dev/null || curl -s "$BASE_URL/health"
echo ""
echo ""

# Teste 2: Listar tarefas
echo "2️⃣ Testando GET /api/tarefas..."
curl -s "$BASE_URL/api/tarefas" | jq . 2>/dev/null || curl -s "$BASE_URL/api/tarefas"
echo ""
echo ""

# Teste 3: Estatísticas
echo "3️⃣ Testando GET /api/tarefas/estatisticas..."
curl -s "$BASE_URL/api/tarefas/estatisticas" | jq . 2>/dev/null || curl -s "$BASE_URL/api/tarefas/estatisticas"
echo ""
echo ""

# Teste 4: Criar tarefa (se o servidor estiver rodando)
echo "4️⃣ Testando POST /api/tarefas..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tarefas" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Tarefa de Teste",
    "descricao": "Criada pelo script de teste",
    "status": "pendente",
    "prioridade": "media",
    "responsavel": "Sistema"
  }')

echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

# Extrair ID se criou com sucesso
ID=$(echo "$RESPONSE" | jq -r '.data.id' 2>/dev/null)

if [ "$ID" != "null" ] && [ -n "$ID" ]; then
  echo "✅ Tarefa criada com ID: $ID"
  echo ""
  
  # Teste 5: Atualizar
  echo "5️⃣ Testando PATCH /api/tarefas/$ID..."
  curl -s -X PATCH "$BASE_URL/api/tarefas/$ID" \
    -H "Content-Type: application/json" \
    -d '{"status":"em_andamento"}' | jq . 2>/dev/null || echo "Erro na atualização"
  echo ""
  
  # Teste 6: Deletar
  echo "6️⃣ Testando DELETE /api/tarefas/$ID..."
  curl -s -X DELETE "$BASE_URL/api/tarefas/$ID" | jq . 2>/dev/null || echo "Erro na deleção"
  echo ""
else
  echo "⚠️ Não foi possível criar tarefa (servidor pode não estar rodando)"
fi

echo ""
echo "✨ Testes concluídos!"