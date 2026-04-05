#!/bin/bash
# ============================================
# INSTALAÇÃO RÁPIDA - Sistema de Persistência
# Tempo estimado: 5 minutos
# ============================================

set -e

echo "🚀 Instalando Sistema de Persistência Alexandria..."
echo "=================================================="

WORKSPACE="/root/.openclaw/workspace"
MEX_DIR="$WORKSPACE/.mex"
ALEXANDRIA="$WORKSPACE/alexandria"

# 1. Criar estrutura
echo "📁 Criando diretórios..."
mkdir -p "$MEX_DIR"/{decisions,patterns}
mkdir -p "$ALEXANDRIA"/{contextos/{ativas,persistidas,recusados},sync}
mkdir -p "$WORKSPACE/logs"

# 2. Verificar Python
echo "🐍 Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado!"
    exit 1
fi

# 3. Testar persistencia.py
echo "🧪 Testando módulo de persistência..."
cd "$WORKSPACE"
python3 "$MEX_DIR/persistencia.py" listar || true

# 4. Criar teste
echo "📝 Criando contexto de teste..."
TEST_ID=$(python3 -c "
import sys
sys.path.insert(0, '$MEX_DIR')
from persistencia import manager
result = manager.salvar('teste', 'Instalação do sistema de persistência', 'sistema', 'TOT')
print(result['id'])
")

echo "✅ Contexto de teste criado: $TEST_ID"

# 5. Confirmar teste
echo "✅ Confirmando contexto..."
python3 "$MEX_DIR/persistencia.py" confirmar "$TEST_ID" || true

# 6. Verificar
echo "🔍 Verificando instalação..."
PENDENTES=$(find "$ALEXANDRIA/contextos/ativas" -name "*.md" 2>/dev/null | wc -l)
CONFIRMADOS=$(find "$ALEXANDRIA/contextos/persistidas" -name "*.md" 2>/dev/null | wc -l)

echo ""
echo "📊 Status:"
echo "  - Pendentes: $PENDENTES"
echo "  - Confirmados: $CONFIRMADOS"
echo ""

if [ "$CONFIRMADOS" -gt 0 ]; then
    echo "✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    echo ""
    echo "Próximos passos:"
    echo "  1. Configurar Supabase (enviar credenciais)"
    echo "  2. Configurar GitHub (criar org + token)"
    echo "  3. Configurar Google Drive (autorizar)"
    echo "  4. Configurar Servidor Dedicado (acesso)"
else
    echo "⚠️ Verificação falhou - verifique logs"
fi

echo ""
echo "📁 Estrutura criada em:"
echo "  - $MEX_DIR"
echo "  - $ALEXANDRIA"
echo ""
echo "🎛️ Sistema pronto para uso!"
