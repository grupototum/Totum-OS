#!/bin/bash
# daily-report-generator.sh - Gerar relatório diário automaticamente
# Uso: ./daily-report-generator.sh [tema opcional]

WORKSPACE="$HOME/.openclaw/workspace"
DATE=$(date +%Y%m%d)

# Criar diretório se não existir
mkdir -p "$WORKSPACE/daily_reports"

echo "🌅 Gerando relatório diário para $DATE..."

# Aqui você pode adicionar chamadas para o subagent que gera o relatório
# Por enquanto, apenas log

# Verificar se há relatório gerado hoje
if [ -f "$WORKSPACE/daily_report_$DATE.pdf" ]; then
    echo "✓ Relatório já existe: daily_report_$DATE.pdf"
    ls -lh "$WORKSPACE/daily_report_$DATE.pdf"
else
    echo "⚠ Relatório ainda não gerado. Execute manualmente ou agende no cron."
fi

# Listar relatórios recentes
echo ""
echo "📊 Relatórios recentes:"
ls -lt "$WORKSPACE"/daily_report_*.pdf 2>/dev/null | head -5 || echo "Nenhum relatório encontrado"
