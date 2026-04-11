#!/bin/bash

# 🚀 DEPLOY SCRIPT - Totum na VPS
# Suporta: Docker (recomendado) ou PM2

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 🚀 DEPLOY TOTUM - VPS                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Detectar se Docker está disponível
if command -v docker &> /dev/null; then
    echo "🐳 Docker detectado! Usando Docker..."
    echo ""
    
    echo "🔨 Build da imagem Docker..."
    docker build -t totum-app:latest .
    
    echo ""
    echo "🚀 Iniciando container..."
    
    # Parar container anterior se existir
    docker stop totum-app 2>/dev/null || true
    docker rm totum-app 2>/dev/null || true
    
    # Iniciar novo container
    docker run -d \
        --name totum-app \
        --restart unless-stopped \
        -p 3002:3002 \
        -e NODE_ENV=production \
        -e PORT=3002 \
        totum-app:latest
    
    echo ""
    echo "✅ Deploy Docker concluído!"
    echo ""
    echo "🌐 Acesse: http://187.127.4.140:3002"
    echo ""
    echo "Comandos úteis:"
    echo "  docker logs totum-app     - Ver logs"
    echo "  docker restart totum-app  - Reiniciar"
    echo "  docker stop totum-app     - Parar"
    echo "  docker ps                 - Ver containers"
    
else
    echo "📦 Docker não encontrado. Usando PM2..."
    echo ""
    
    echo "📦 Instalando dependências do frontend..."
    npm install
    
    echo ""
    echo "🔨 Build do frontend..."
    npm run build
    
    echo ""
    echo "📦 Instalando dependências do backend..."
    cd api
    npm install
    cd ..
    
    echo ""
    echo "🚀 Iniciando com PM2..."
    pm2 start ecosystem.config.cjs --env production
    
    echo ""
    echo "📋 Status do PM2:"
    pm2 status
    
    echo ""
    echo "✅ Deploy PM2 concluído!"
    echo ""
    echo "🌐 Acesse: http://187.127.4.140:3002"
    echo ""
    echo "Comandos úteis:"
    echo "  pm2 logs totum-api        - Ver logs"
    echo "  pm2 restart totum-api     - Reiniciar"
    echo "  pm2 stop totum-api        - Parar"
fi

echo ""
