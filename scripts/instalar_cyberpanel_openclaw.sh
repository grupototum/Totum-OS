#!/bin/bash
# =============================================================================
# SCRIPT DE INSTALAÇÃO - CYBERPANEL + OPENCLAW + DOCKER
# VPS Stark (187.127.4.140)
# Data: 2026-04-03
# =============================================================================

set -e  # Para execução se houver erro

echo "🚀 INICIANDO INSTALAÇÃO COMPLETA"
echo "================================"
echo ""
echo "⚠️  Este script irá:"
echo "   1. Atualizar o sistema"
echo "   2. Instalar CyberPanel (OpenLiteSpeed)"
echo "   3. Instalar Node.js 22"
echo "   4. Instalar OpenClaw"
echo "   5. Configurar integração com Kimi Claw"
echo ""
read -p "Continuar? (s/N): " confirm
if [[ $confirm != [sS] ]]; then
    echo "❌ Instalação cancelada"
    exit 1
fi

echo ""
echo "📦 ETAPA 1/5 - Atualizando sistema..."
apt update && apt upgrade -y

echo ""
echo "🔧 ETAPA 2/5 - Instalando CyberPanel..."
echo "   (Isso pode levar 15-30 minutos)"
wget -O installer.sh https://cyberpanel.net/install.sh
chmod +x installer.sh

# Instalar CyberPanel com OpenLiteSpeed (opção 1 no menu interativo)
echo "1" | ./installer.sh << EOF
Y
N
2
StarkCyberPanel2024!
StarkCyberPanel2024!
EOF

echo ""
echo "✅ CyberPanel instalado!"
echo "   URL: https://187.127.4.140:8090"
echo "   Usuário: admin"
echo "   Senha: StarkCyberPanel2024!"
echo ""

echo ""
echo "📦 ETAPA 3/5 - Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version
npm --version

echo ""
echo "🤖 ETAPA 4/5 - Instalando OpenClaw..."
npm install -g openclaw
openclaw --version

echo ""
echo "⚙️  ETAPA 5/5 - Configurando OpenClaw..."
mkdir -p /opt/openclaw
openclaw init --name stark-local --path /opt/openclaw

# Configurar gateway
openclaw config set gateway.bind 0.0.0.0:8080
cd /opt/openclaw
openclaw gateway start

echo ""
echo "================================"
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "================================"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Anote as credenciais do CyberPanel:"
echo "   URL: https://187.127.4.140:8090"
echo "   User: admin"
echo "   Pass: StarkCyberPanel2024!"
echo ""
echo "2. OpenClaw está rodando em:"
echo "   http://187.127.4.140:8080"
echo ""
echo "3. Para criar o bot no Kimi Claw:"
echo "   - Acesse https://kimi.moonshot.cn"
echo "   - Settings → Create New Bot"
echo "   - Use o token abaixo:"
echo ""
echo "🎫 BOT TOKEN (copie este):"
echo "   sk-PNFKP2ISO7QCOPNBFT4LW4NEGC"
echo ""
echo "4. Execute no VPS para conectar:"
echo "   bash <(curl -fsSL https://cdn.kimi.com/kimi-claw/install.sh) --bot-token sk-PNFKP2ISO7QCOPNBFT4LW4NEGC"
echo ""
echo "================================"

# Salvar infos
mkdir -p /root/totum-info
cat > /root/totum-info/credenciais.txt << 'CREDS'
================================
CREDENCIAIS TOTUM - STARK VPS
================================

CyberPanel:
  URL: https://187.127.4.140:8090
  User: admin
  Pass: StarkCyberPanel2024!

OpenClaw:
  URL: http://187.127.4.140:8080
  Path: /opt/openclaw

Bot Token Kimi:
  sk-PNFKP2ISO7QCOPNBFT4LW4NEGC

Gerado em: $(date)
================================
CREDS

echo "💾 Credenciais salvas em: /root/totum-info/credenciais.txt"
echo ""
echo "🎉 Pronto para criar o bot no Kimi Claw!"