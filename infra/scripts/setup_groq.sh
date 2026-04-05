#!/bin/bash
# ============================================================
# SETUP - Groq API (Llama 3.2 via API - Ultra Rápido)
# ============================================================

echo "🚀 Configurando Groq API..."
echo "============================"
echo ""

# Verificar se está no virtualenv
if [ -z "$VIRTUAL_ENV" ]; then
    echo "🔧 Ativando ambiente virtual..."
    source venv/bin/activate
fi

# Instalar groq se não estiver instalado
pip show groq > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "📦 Instalando SDK do Groq..."
    pip install -q groq
fi

echo "✅ Groq SDK instalado"
echo ""
echo "📝 Para usar o Groq em vez do Ollama local:"
echo ""
echo "1. Obtenha sua API key gratuita em:"
echo "   https://console.groq.com/keys"
echo ""
echo "2. Configure no arquivo .env:"
echo "   GROQ_API_KEY=sua-api-key-aqui"
echo "   USE_GROQ=true"
echo ""
echo "3. Reinicie o bot"
echo ""
echo "⚡ Vantagens do Groq:"
echo "   - Ultra-rápido (menos de 1s por resposta)"
echo "   - Não consome RAM local"
echo "   - Tier gratuito: 20 req/min, 6000 tokens/min"
echo "   - Llama 3.2 na nuvem"
echo ""
echo "🦜 Para voltar ao Ollama local:"
echo "   USE_GROQ=false"
echo ""
