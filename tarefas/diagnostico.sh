#!/bin/bash
# ============================================
# SCRIPT: DIAGNÓSTICO DOS APPS - STARK VPS
# Identifica problemas na instalação
# ============================================

echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETO DOS APPS"
echo "=========================================="
echo ""

# Verificar pasta
echo "📁 1. VERIFICANDO PASTA:"
if [ -d "/opt/docker-apps" ]; then
    echo "✅ Pasta /opt/docker-apps existe"
    cd /opt/docker-apps
else
    echo "❌ Pasta /opt/docker-apps NÃO EXISTE!"
    exit 1
fi

# Verificar arquivos
echo ""
echo "📄 2. VERIFICANDO ARQUIVOS:"
for file in docker-compose.yml .env.example install.sh; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NÃO ENCONTRADO"
    fi
done

# Verificar .env
echo ""
echo "⚙️ 3. VERIFICANDO .ENV:"
if [ -f ".env" ]; then
    echo "✅ Arquivo .env existe"
else
    echo "❌ Arquivo .env NÃO EXISTE!"
    echo "Execute: cp .env.example .env"
fi

# Testar configuração
echo ""
echo "🐳 4. TESTANDO CONFIGURAÇÃO DOCKER:"
if docker compose config > /dev/null 2>&1; then
    echo "✅ Configuração VÁLIDA"
else
    echo "❌ ERRO na configuração:"
    docker compose config 2>&1 | head -5
fi

# Ver portas
echo ""
echo "🌐 5. PORTAS EM USO:"
ss -tlnp 2>/dev/null | grep -E ':(80|8080|8090)' | head -5 || echo "Instale: apt install iproute2"

echo ""
echo "=========================================="
echo "Próximo passo: docker compose up -d 2>&1 | tee erro.log"