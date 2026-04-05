#!/bin/bash
# Script de deploy da Stark API

echo "🚀 Iniciando deploy da Stark API..."

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do stark-api${NC}"
    exit 1
fi

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm install

# Compilar TypeScript
echo -e "${YELLOW}🔨 Compilando TypeScript...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro na compilação${NC}"
    exit 1
fi

# Criar diretório de logs se não existir
sudo mkdir -p /var/log/stark-api

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando PM2...${NC}"
    npm install -g pm2
fi

# Verificar se já está rodando
if pm2 list | grep -q "stark-api"; then
    echo -e "${YELLOW}🔄 Reiniciando serviço...${NC}"
    pm2 restart stark-api
else
    echo -e "${YELLOW}▶️  Iniciando serviço...${NC}"
    pm2 start ecosystem.config.js
fi

# Salvar configuração do PM2
pm2 save

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "📊 Status:"
pm2 status stark-api
echo ""
echo "📝 Logs:"
echo "  tail -f /var/log/stark-api/out.log"
echo ""
echo "🔗 API disponível em: http://localhost:3001"