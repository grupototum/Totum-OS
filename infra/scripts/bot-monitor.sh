#!/bin/bash
# =============================================================================
# BOT MONITOR - Garante que o bot fique sempre no ar
# =============================================================================

BOT_DIR="/root/.openclaw/workspace"
BOT_SCRIPT="bot_atendente_totum.py"
LOG_FILE="$BOT_DIR/logs/bot.log"
PID_FILE="$BOT_DIR/bot.pid"

check_bot() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0  # Bot rodando
        fi
    fi
    return 1  # Bot parado
}

start_bot() {
    echo "🚀 Iniciando Bot Atendente Totum..."
    cd "$BOT_DIR"
    source venv/bin/activate
    nohup python3 "$BOT_SCRIPT" >> "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
    sleep 3
    
    if check_bot; then
        echo "✅ Bot iniciado com sucesso! (PID: $(cat $PID_FILE))"
        echo "📊 Logs: tail -f $LOG_FILE"
    else
        echo "❌ Falha ao iniciar bot"
        return 1
    fi
}

stop_bot() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        echo "🛑 Parando bot (PID: $PID)..."
        kill "$PID" 2>/dev/null || kill -9 "$PID" 2>/dev/null
        rm -f "$PID_FILE"
        echo "✅ Bot parado"
    else
        echo "ℹ️ Bot não está rodando"
    fi
}

restart_bot() {
    stop_bot
    sleep 2
    start_bot
}

status_bot() {
    if check_bot; then
        PID=$(cat "$PID_FILE")
        echo "✅ Bot rodando (PID: $PID)"
        echo "📊 Uptime: $(ps -o etime= -p "$PID" 2>/dev/null || echo 'N/A')"
        echo "📝 Últimas linhas do log:"
        tail -5 "$LOG_FILE"
    else
        echo "❌ Bot parado"
        echo "📝 Últimas linhas do log:"
        tail -10 "$LOG_FILE"
    fi
}

case "${1:-status}" in
    start)
        start_bot
        ;;
    stop)
        stop_bot
        ;;
    restart)
        restart_bot
        ;;
    status)
        status_bot
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac