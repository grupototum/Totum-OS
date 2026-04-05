#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate

# Carrega variáveis do .env
export $(grep -v '^#' .env | xargs)

echo "🚀 Iniciando Bot Atendente Totum..."
echo "===================================="
echo ""
echo "📊 Opik: $([ ! -z "$OPIK_API_KEY" ] && echo '✅ Conectado' || echo '⚠️  Desconectado')"
echo "🤖 Modelo LLM: $OLLAMA_MODEL"
echo ""
echo "Comandos disponíveis no Telegram:"
echo "  /start - Iniciar atendimento"
echo "  /help  - Ver ajuda"
echo "  /status - Ver suas solicitações"
echo ""
echo "Bot: @totum_agents_bot"
echo "Link: https://t.me/totum_agents_bot"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""
python3 bot_atendente_totum.py
