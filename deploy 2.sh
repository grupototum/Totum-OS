#!/bin/bash

# 🚀 DEPLOY SCRIPT - Totum na VPS
# Execute na VPS após clonar o repositório

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
pm2 start ecosystem.config.js --env production

echo ""
echo "📋 Status do PM2:"
pm2 status

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acesse: http://apps.grupototum.com"
echo ""
echo "Comandos úteis:"
echo "  pm2 logs totum-api    - Ver logs"
echo "  pm2 restart totum-api - Reiniciar"
echo "  pm2 stop totum-api    - Parar"
echo ""
