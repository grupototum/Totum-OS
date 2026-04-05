#!/bin/bash
# =============================================================================
# SCRIPT DE BACKUP COMPLETO DOCKER - TOTUM
# VPS Stark (187.127.4.140)
# Data: 2026-04-03
# =============================================================================

set -e

# CONFIGURAÇÕES
BACKUP_DIR="/root/backups/docker"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="docker_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=7

echo "🚀 INICIANDO BACKUP DOCKER COMPLETO"
echo "===================================="
echo "Data: $(date)"
echo "Diretório: ${BACKUP_DIR}"
echo "Arquivo: ${BACKUP_FILE}"
echo ""

# Criar diretório de backup
mkdir -p ${BACKUP_DIR}

echo "📦 ETAPA 1/5 - Salvando lista de containers..."
docker ps -a > ${BACKUP_DIR}/containers_${TIMESTAMP}.txt
docker images > ${BACKUP_DIR}/images_${TIMESTAMP}.txt
docker volume ls > ${BACKUP_DIR}/volumes_${TIMESTAMP}.txt
docker network ls > ${BACKUP_DIR}/networks_${TIMESTAMP}.txt

echo "📦 ETAPA 2/5 - Backup dos docker-compose.yml..."
if [ -f "/opt/docker-apps/docker-compose.yml" ]; then
    cp /opt/docker-apps/docker-compose.yml ${BACKUP_DIR}/docker-compose_${TIMESTAMP}.yml
    echo "   ✅ docker-compose.yml copiado"
fi

if [ -f "/opt/docker-apps/.env" ]; then
    cp /opt/docker-apps/.env ${BACKUP_DIR}/env_${TIMESTAMP}.backup
    echo "   ✅ .env copiado"
fi

echo "📦 ETAPA 3/5 - Exportando volumes..."
VOLUMES=$(docker volume ls -q)
for VOLUME in $VOLUMES; do
    echo "   → Backup volume: ${VOLUME}"
    docker run --rm \
        -v ${VOLUME}:/data \
        -v ${BACKUP_DIR}:/backup \
        busybox tar czf /backup/volume_${VOLUME}_${TIMESTAMP}.tar.gz -C /data .
done

echo "📦 ETAPA 4/4 - Compactando tudo..."
cd ${BACKUP_DIR}
tar czf ${BACKUP_FILE} \
    containers_${TIMESTAMP}.txt \
    images_${TIMESTAMP}.txt \
    volumes_${TIMESTAMP}.txt \
    networks_${TIMESTAMP}.txt \
    docker-compose_${TIMESTAMP}.yml \
    env_${TIMESTAMP}.backup \
    volume_*_${TIMESTAMP}.tar.gz

# Limpar arquivos individuais (mantém apenas o compactado)
rm -f containers_${TIMESTAMP}.txt
rm -f images_${TIMESTAMP}.txt
rm -f volumes_${TIMESTAMP}.txt
rm -f networks_${TIMESTAMP}.txt
rm -f docker-compose_${TIMESTAMP}.yml
rm -f env_${TIMESTAMP}.backup
rm -f volume_*_${TIMESTAMP}.tar.gz

echo ""
echo "===================================="
echo "✅ BACKUP CONCLUÍDO!"
echo "===================================="
echo ""
echo "📁 Arquivo: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "📊 Tamanho: $(du -h ${BACKUP_DIR}/${BACKUP_FILE} | cut -f1)"
echo ""
echo "💾 Próximo passo:"
echo "   Baixe o backup para sua máquina local:"
echo "   scp root@187.127.4.140:${BACKUP_DIR}/${BACKUP_FILE} ./"
echo ""
echo "🧹 Backups antigos (>${RETENTION_DAYS} dias) serão removidos automaticamente."

# Limpar backups antigos
find ${BACKUP_DIR} -name "docker_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo ""
echo "🎉 Backup finalizado em: $(date)"