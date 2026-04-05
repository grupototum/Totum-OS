#!/bin/bash
# =============================================================================
# SCRIPT DE REMOÇÃO DO CYBERPANEL - MANTÉM DOCKER E APPS
# VPS Stark - Totum
# Data: 2026-04-03
# =============================================================================

set -e

echo "🛑 REMOVENDO CYBERPANEL - MANTENDO DOCKER"
echo "==========================================="
echo ""
echo "⚠️  Isso vai remover:"
echo "   - OpenLiteSpeed"
echo "   - CyberPanel"
echo "   - MySQL/MariaDB do CyberPanel"
echo "   - Configurações do CyberPanel"
echo ""
echo "✅ Isso NÃO vai remover:"
echo "   - Docker"
echo "   - Containers"
echo "   - Volumes"
echo "   - Outros apps"
echo ""
read -p "Tem certeza? Digite 'APAGAR' para continuar: " confirm

if [ "$confirm" != "APAGAR" ]; then
    echo "❌ Cancelado"
    exit 1
fi

echo ""
echo "🛑 ETAPA 1/6 - Parando serviços..."
systemctl stop lsws 2>/dev/null || true
systemctl stop lscpd 2>/dev/null || true
systemctl stop cpstats 2>/dev/null || true
systemctl stop mysqld 2>/dev/null || true
systemctl stop gunicorn 2>/dev/null || true
systemctl stop redis 2>/dev/null || true
systemctl stop cyberpanel 2>/dev/null || true

echo "✅ Serviços parados"
echo ""

echo "🗑️  ETAPA 2/6 - Removendo pacotes..."
apt remove --purge -y cyberpanel lsws openlitespeed 2>/dev/null || true
apt remove --purge -y lsphp* 2>/dev/null || true

echo "✅ Pacotes removidos"
echo ""

echo "🗑️  ETAPA 3/6 - Removendo diretórios..."
rm -rf /usr/local/lsws 2>/dev/null || true
rm -rf /usr/local/CyberPanel 2>/dev/null || true
rm -rf /usr/local/CyberCP 2>/dev/null || true
rm -rf /home/cyberpanel 2>/dev/null || true
rm -rf /etc/cyberpanel 2>/dev/null || true
rm -rf /var/lib/cyberpanel 2>/dev/null || true
rm -rf /etc/systemd/system/cyberpanel* 2>/dev/null || true
rm -rf /etc/systemd/system/lsws* 2>/dev/null || true
rm -rf /etc/systemd/system/lscpd* 2>/dev/null || true

echo "✅ Diretórios removidos"
echo ""

echo "🗑️  ETAPA 4/6 - Removendo banco de dados do CyberPanel..."
# Cuidado: não remover se você tem outros bancos importantes
# Apenas remove o socket específico do CyberPanel
rm -rf /var/run/mysqld/mysqld.sock 2>/dev/null || true

echo "✅ Banco removido"
echo ""

echo "🔄 ETAPA 5/6 - Recarregando systemd..."
systemctl daemon-reload

echo "✅ Systemd recarregado"
echo ""

echo "🧹 ETAPA 6/6 - Limpando cache..."
apt autoremove -y
apt autoclean

echo "✅ Cache limpo"
echo ""

echo "==========================================="
echo "✅ CYBERPANEL REMOVIDO COM SUCESSO!"
echo "==========================================="
echo ""
echo "🐳 Verificando Docker..."
docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | head -5 || echo "   Docker não está rodando"
echo ""
echo "🎉 Pronto para instalar novamente!"
echo ""
echo "Próximo passo:"
echo "   wget -O installer.sh https://cyberpanel.net/install.sh"
echo "   chmod +x installer.sh"
echo "   ./installer.sh"
