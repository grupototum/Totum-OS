#!/bin/bash

# 🚀 QUICK START — ATIVAR PRODUÇÃO REAL EM 3 PASSOS
# Execute este arquivo com: source PRODUCTION_START.sh

echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                        ║"
echo "║           🚀 INICIANDO PRODUÇÃO REAL — OLLAMA + SUPABASE              ║"
echo "║                                                                        ║"
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# STEP 1: Install Ollama
echo "📦 PASSO 1: Instalando Ollama..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v ollama &> /dev/null; then
  echo "⬇️  Ollama não encontrado. Instalando via Homebrew..."
  brew install ollama
  echo "✅ Ollama instalado com sucesso!"
else
  echo "✅ Ollama já instalado"
  ollama --version
fi

echo ""
echo "🎛️  PASSO 2: Iniciando Ollama Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANTE: Este comando vai abrir uma janela de servidor."
echo "   Deixe rodando e retorne aqui quando ver: 'Listening on 127.0.0.1:11434'"
echo ""
echo "   Se preferir em background, use outro terminal e execute:"
echo "   $ ollama serve"
echo ""
read -p "Pressione ENTER quando Ollama estiver rodando na porta 11434... " -r

echo ""

# Verify Ollama is running
echo "🔍 Verificando conexão com Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "✅ Ollama conectado com sucesso!"
else
  echo "❌ Ollama não está respondendo na porta 11434"
  echo "   Verifique se: ollama serve está rodando"
  echo "   Abra outro terminal e execute: ollama serve"
  exit 1
fi

echo ""
echo "📥 PASSO 3: Download do modelo Neural-Chat..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if model is already downloaded
if ollama list | grep -q "neural-chat"; then
  echo "✅ Modelo neural-chat já disponível"
  ollama list | grep neural-chat
else
  echo "⬇️  Baixando neural-chat (pode levar 10-15 minutos)..."
  echo "   (Use outro modelo se preferir: llama2, mistral, orca-mini)"
  echo ""
  ollama pull neural-chat
  echo "✅ Modelo baixado com sucesso!"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "🎉 CONFIGURAÇÃO CONCLUÍDA!"
echo ""
echo "Seu sistema está pronto para PRODUÇÃO REAL com Ollama."
echo ""
echo "Próximo passo: Execute o processamento"
echo ""
echo "$ cd /Users/israellemos/Documents/Totum\\ Dev"
echo "$ node process-transcriptions.mjs"
echo ""
echo "⏱️  Tempo esperado: 50-60s por vídeo (8-10 minutos para 10 vídeos)"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
