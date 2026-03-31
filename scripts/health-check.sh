#!/bin/bash
# health-check.sh - Verificar saúde do sistema OpenClaw
# Uso: ./health-check.sh

echo "🏥 Verificação de Saúde do OpenClaw"
echo "=================================="
echo ""

# Verificar status do OpenClaw
echo "📡 Status do OpenClaw:"
openclaw status 2>/dev/null | head -30 || echo "⚠ openclaw CLI não disponível"
echo ""

# Verificar espaço em disco
echo "💾 Uso de disco:"
df -h /root | grep -v Filesystem
echo ""

# Verificar memória
echo "🧠 Uso de memória:"
free -h | grep -E "(Mem|Swap)"
echo ""

# Verificar processos importantes
echo "⚙️  Processos:"
ps aux | grep -E "(openclaw|node)" | grep -v grep | wc -l | xargs echo "Processos OpenClaw/Node:"
echo ""

# Verificar logs recentes
echo "📜 Erros recentes nos logs:"
tail -50 ~/.openclaw/logs/openclaw.log 2>/dev/null | grep -i "error\|fail\|warn" | tail -10 || echo "Nenhum erro recente encontrado"
echo ""

# Verificar atualizações disponíveis
echo "🔄 Atualizações:"
echo "Execute 'openclaw update' para verificar atualizações"
echo ""

echo "✅ Verificação concluída!"
