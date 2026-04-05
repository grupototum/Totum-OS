#!/bin/bash
# Pipeline: Transcrição → Análise
# Uso: ./pipeline_conteudo.sh <URL_DO_VIDEO>

URL=$1

if [ -z "$URL" ]; then
    echo "❌ Erro: URL não fornecida"
    echo "Uso: $0 <URL_DO_VIDEO>"
    exit 1
fi

echo "🚀 Iniciando pipeline de conteúdo..."
echo "📹 URL: $URL"
echo ""

# Etapa 1: Transcrever
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 ETAPA 1: Transcrição"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "/opt/totum-scripts/transcritor.sh" ]; then
    /opt/totum-scripts/transcritor.sh "$URL"
    TRANSCRICAO_STATUS=$?
else
    echo "⚠️  Transcritor não encontrado em /opt/totum-scripts/transcritor.sh"
    TRANSCRICAO_STATUS=1
fi

if [ $TRANSCRICAO_STATUS -ne 0 ]; then
    echo "❌ Falha na transcrição. Abortando."
    exit 1
fi

# Etapa 2: Analisar
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 ETAPA 2: Análise Estratégica"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "/tmp/transcricoes/audio.txt" ]; then
    python3 /opt/totum-scripts/analista.py /tmp/transcricoes/audio.txt
    ANALISE_STATUS=$?
else
    echo "⚠️  Arquivo de transcrição não encontrado: /tmp/transcricoes/audio.txt"
    ANALISE_STATUS=1
fi

if [ $ANALISE_STATUS -ne 0 ]; then
    echo "❌ Falha na análise."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PIPELINE COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Arquivos gerados:"
echo "   - Transcrição: /tmp/transcricoes/audio.txt"
echo "   - Análise: /tmp/analise_*.md"
echo ""
echo "💡 Próximo passo: Copie o prompt gerado e use com Claude/GPT"
