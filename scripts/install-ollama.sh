#!/bin/bash
# 🦙 Script de Instalação Automatizada do Ollama
# Servidor: i5-2400 (Escritório Israel)
# Data: 2026-04-05

set -e  # Para execução em caso de erro

echo "=========================================="
echo "🦙 INSTALAÇÃO DO OLLAMA - TOTUM"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# ==========================================
# 1. VERIFICAÇÃO DO SISTEMA
# ==========================================
echo ""
echo "📋 ETAPA 1: Verificação do Sistema"
echo "-----------------------------------"

# Verificar se é Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    log_error "Este script é para Linux apenas!"
    exit 1
fi

# Verificar espaço em disco
DISK_AVAILABLE=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$DISK_AVAILABLE" -lt 20 ]; then
    log_error "Espaço em disco insuficiente: ${DISK_AVAILABLE}GB (mínimo 20GB)"
    exit 1
fi
log_info "Espaço em disco: ${DISK_AVAILABLE}GB ✅"

# Verificar RAM
RAM_TOTAL=$(free -g | awk '/^Mem:/{print $2}')
if [ "$RAM_TOTAL" -lt 8 ]; then
    log_warn "RAM baixa: ${RAM_TOTAL}GB (recomendado 8GB+)"
    read -p "Continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
else
    log_info "RAM: ${RAM_TOTAL}GB ✅"
fi

# Verificar conexão com internet
if ! ping -c 1 ollama.com &> /dev/null; then
    log_error "Sem conexão com ollama.com"
    exit 1
fi
log_info "Conexão com internet: OK ✅"

# ==========================================
# 2. INSTALAÇÃO DO OLLAMA
# ==========================================
echo ""
echo "🔧 ETAPA 2: Instalação do Ollama"
echo "-----------------------------------"

if command -v ollama &> /dev/null; then
    log_warn "Ollama já está instalado!"
    ollama --version
    read -p "Reinstalar? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        log_info "Pulando instalação..."
    else
        log_info "Instalando Ollama..."
        curl -fsSL https://ollama.com/install.sh | sh
    fi
else
    log_info "Instalando Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Verificar instalação
if ! command -v ollama &> /dev/null; then
    log_error "Falha na instalação do Ollama"
    exit 1
fi
log_info "Ollama instalado: $(ollama --version) ✅"

# ==========================================
# 3. CONFIGURAÇÃO DO SERVIÇO
# ==========================================
echo ""
echo "🌐 ETAPA 3: Configuração de Rede"
echo "-----------------------------------"

log_info "Configurando acesso via rede..."

# Criar diretório de override se não existir
sudo mkdir -p /etc/systemd/system/ollama.service.d/

# Criar arquivo de configuração
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null <<EOF
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF

# Recarregar e reiniciar
sudo systemctl daemon-reload
sudo systemctl restart ollama

# Aguardar inicialização
sleep 2

# Verificar status
if sudo systemctl is-active --quiet ollama; then
    log_info "Serviço Ollama: Rodando ✅"
else
    log_error "Falha ao iniciar serviço Ollama"
    sudo systemctl status ollama
    exit 1
fi

# Mostrar IP do servidor
IP_ADDRESS=$(hostname -I | awk '{print $1}')
log_info "IP do servidor: $IP_ADDRESS"
log_info "URL de acesso: http://$IP_ADDRESS:11434"

# ==========================================
# 4. DOWNLOAD DOS MODELOS
# ==========================================
echo ""
echo "📦 ETAPA 4: Download dos Modelos"
echo "-----------------------------------"

MODELS=(
    "nomic-embed-text:274MB"
    "llama3.2:2GB"
    "deepseek-coder:4.2GB"
    "qwen2.5:4.7GB"
)

for model_info in "${MODELS[@]}"; do
    model=$(echo $model_info | cut -d: -f1)
    size=$(echo $model_info | cut -d: -f2)
    
    echo ""
    log_info "Baixando $model (~$size)..."
    ollama pull $model || log_warn "Falha ao baixar $model"
done

# ==========================================
# 5. TESTE DE FUNCIONAMENTO
# ==========================================
echo ""
echo "🧪 ETAPA 5: Teste de Funcionamento"
echo "-----------------------------------"

log_info "Testando llama3.2..."
RESPONSE=$(ollama run llama3.2 "Diga apenas 'Funcionando!' em português." 2>/dev/null)

if echo "$RESPONSE" | grep -qi "funcionando"; then
    log_info "Teste local: PASSOU ✅"
else
    log_warn "Teste local: Resposta inesperada"
    echo "Resposta: $RESPONSE"
fi

# Teste via API
log_info "Testando API..."
API_RESPONSE=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -5)

if [ -n "$API_RESPONSE" ]; then
    log_info "API: Respondendo ✅"
else
    log_warn "API: Sem resposta"
fi

# ==========================================
# 6. RESUMO FINAL
# ==========================================
echo ""
echo "=========================================="
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "=========================================="
echo ""
echo "📊 Resumo:"
echo "   Ollama: $(ollama --version)"
echo "   IP: $IP_ADDRESS"
echo "   Porta: 11434"
echo "   URL: http://$IP_ADDRESS:11434"
echo ""
echo "📦 Modelos instalados:"
ollama list 2>/dev/null || echo "   (verificar com: ollama list)"
echo ""
echo "🔧 Comandos úteis:"
echo "   ollama list          - Listar modelos"
echo "   ollama run llama3.2  - Usar modelo"
echo "   sudo systemctl status ollama - Ver status"
echo ""
echo "📁 Documentação:"
echo "   /root/.openclaw/workspace/docs/ollama-setup.md"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Manter servidor ligado 24/7"
echo "   - Verificar firewall (porta 11434)"
echo "   - Testar acesso de outro computador"
echo ""
echo "=========================================="
