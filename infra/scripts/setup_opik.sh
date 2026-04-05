#!/bin/bash
# ============================================================
# SETUP - Opik Integration (Versão Leve - Cloud)
# ============================================================

echo "📊 Configurando Opik (Versão Leve)..."
echo "======================================"

# Verificar se está no virtualenv
if [ -z "$VIRTUAL_ENV" ]; then
    echo "🔧 Ativando ambiente virtual..."
    source venv/bin/activate
fi

# Verificar instalação
echo "✅ Verificando instalação do Opik..."
python3 -c "import opik; print(f'Opik version: {opik.__version__}')" 2>/dev/null || echo "⚠️  Opik não instalado"

echo ""
echo "📝 Opik está configurado para modo CLOUD (mais leve)"
echo ""
echo "Para usar:"
echo "   1. Crie uma conta gratuita em: https://www.comet.com/signup"
echo "   2. Obtenha sua API key"
echo "   3. Configure: export OPIK_API_KEY='sua-key-aqui'"
echo ""
echo "Ou use local (mais pesado):"
echo "   git clone https://github.com/comet-ml/opik.git"
echo "   cd opik && ./opik.sh"
echo ""
echo "📊 Dashboard será acessível em:"
echo "   Cloud: https://www.comet.com/opik"
echo "   Local: http://localhost:5173"
echo ""
