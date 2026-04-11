#!/bin/bash

# 🚀 DEPLOY COM DOCKER COMPOSE - Totum
# Garante apenas UM container rodando

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🚀 DEPLOY TOTUM - DOCKER COMPOSE                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# Verificar se está na pasta correta
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erro: docker-compose.yml não encontrado"
    exit 1
fi

echo "🐳 Parando container antigo (se existir)..."
docker-compose down 2>/dev/null || docker stop apps-totum-oficial 2>/dev/null || true
docker rm apps-totum-oficial 2>/dev/null || true

# Remover container antigo com nome diferente
OLD_CONTAINER=$(docker ps -aq --filter "name=apps-totum-app-1" 2>/dev/null)
if [ ! -z "$OLD_CONTAINER" ]; then
    echo "🗑️  Removendo container antigo..."
    docker stop $OLD_CONTAINER 2>/dev/null || true
    docker rm $OLD_CONTAINER 2>/dev/null || true
fi

echo ""
echo "🔨 Build e iniciando novo container..."
docker-compose up -d --build

echo ""
echo "⏳ Aguardando container ficar healthy..."
sleep 5

# Verificar saúde
if docker ps | grep -q "apps-totum-oficial"; then
    echo ""
    echo "✅ Container rodando com sucesso!"
    echo ""
    docker ps | grep apps-totum-oficial
else
    echo "❌ Container não iniciou corretamente"
    docker-compose logs
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ DEPLOY CONCLUÍDO!"
echo ""
echo "🌐 URLs de acesso:"
echo "   - Direto: http://187.127.4.140:3002"
echo "   - Domínio: http://apps.grupototum.com (após configurar DNS)"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose logs -f     - Ver logs"
echo "   docker-compose ps          - Status"
echo "   docker-compose restart     - Reiniciar"
echo "   docker-compose down        - Parar"
echo "════════════════════════════════════════════════════════════════"
