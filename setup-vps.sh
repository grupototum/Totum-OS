#!/bin/bash

# 🛠️ SETUP VPS - Totum
# Prepara a VPS para rodar o projeto

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🛠️  SETUP VPS - TOTUM                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Execute como root: sudo ./setup-vps.sh"
    exit 1
fi

echo "📦 Atualizando sistema..."
apt-get update -qq

echo ""
echo "🐳 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "📥 Instalando Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker instalado"
else
    echo "✅ Docker já instalado"
fi

echo ""
echo "🔧 Verificando Docker Compose..."
if docker compose version &>/dev/null; then
    echo "✅ Docker Compose plugin já instalado"
elif docker-compose version &>/dev/null; then
    echo "✅ Docker Compose standalone já instalado"
else
    echo "📥 Instalando Docker Compose plugin..."
    apt-get install -y docker-compose-plugin
    echo "✅ Docker Compose plugin instalado"
fi

echo ""
echo "📂 Verificando diretório do projeto..."
if [ ! -d "Apps_totum_Oficial" ]; then
    echo "📥 Clonando repositório..."
    git clone https://github.com/grupototum/Apps_totum_Oficial.git
else
    echo "✅ Diretório já existe"
fi

echo ""
echo "🔍 Verificando rede Traefik..."
if docker network ls | grep -q "traefik"; then
    echo "✅ Rede Traefik encontrada:"
    docker network ls | grep traefik
else
    echo "⚠️  Rede Traefik não encontrada"
    echo "O docker-compose.yml usará rede padrão"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ SETUP CONCLUÍDO!"
echo ""
echo "🚀 Para fazer deploy:"
echo "   cd Apps_totum_Oficial"
echo "   ./deploy-compose.sh"
echo ""
echo "🌐 Após deploy, configure o DNS:"
echo "   apps.grupototum.com → 187.127.4.140"
echo "════════════════════════════════════════════════════════════════"
