#!/bin/bash
# =============================================================================
# BACKUP ESPECÍFICO DOS APPS - EVOLUTION API E OUTROS
# VPS Stark - Totum
# Data: 2026-04-03
# =============================================================================

set -e

BACKUP_DIR="/root/backups/apps-$(date +%Y%m%d_%H%M%S)"
mkdir -p ${BACKUP_DIR}

echo "🚀 BACKUP DOS APPS - ESPECIAL EVOLUTION API"
echo "=========================================="
echo "Diretório: ${BACKUP_DIR}"
echo "Data: $(date)"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 PASSO 1: Listando containers ativos...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" > ${BACKUP_DIR}/containers-ativos.txt
cat ${BACKUP_DIR}/containers-ativos.txt
echo ""

echo -e "${YELLOW}📦 PASSO 2: Backup dos volumes do Evolution API...${NC}"
# Evolution API normalmente tem volumes para:
# - Dados da aplicação
# - Logs
# - Uploads/arquivos

# Verificar se existe volume do evolution
EVOLUTION_VOLUME=$(docker volume ls -q | grep -i evolution || true)

if [ ! -z "$EVOLUTION_VOLUME" ]; then
    echo "✅ Volume Evolution encontrado: ${EVOLUTION_VOLUME}"
    
    # Backup do volume
    docker run --rm \
        -v ${EVOLUTION_VOLUME}:/data \
        -v ${BACKUP_DIR}:/backup \
        busybox tar czf /backup/evolution-volume.tar.gz -C /data .
    
    echo "✅ Volume Evolution backup concluído"
else
    echo "⚠️ Volume específico do Evolution não encontrado"
    echo "   Fazendo backup de todos os volumes..."
fi
echo ""

echo -e "${YELLOW}📦 PASSO 3: Backup dos volumes de todos os apps...${NC}"
VOLUMES=$(docker volume ls -q)

for VOLUME in $VOLUMES; do
    echo "   → Backup: ${VOLUME}"
    
    docker run --rm \
        -v ${VOLUME}:/data \
        -v ${BACKUP_DIR}:/backup \
        busybox tar czf /backup/volume-${VOLUME}.tar.gz -C /data . 2>/dev/null || {
            echo "   ⚠️ Erro no volume ${VOLUME} (pode estar vazio)"
        }
done
echo ""

echo -e "${YELLOW}⚙️ PASSO 4: Backup das configurações...${NC}"

# Backup dos docker-compose
if [ -d "/opt/docker-apps" ]; then
    echo "   → Copiando /opt/docker-apps..."
    cp -r /opt/docker-apps ${BACKUP_DIR}/docker-apps-configs
fi

# Backup de outros diretórios de config
for DIR in /opt/totum-scripts /opt/totum-agents /root/.openclaw; do
    if [ -d "$DIR" ]; then
        echo "   → Copiando ${DIR}..."
        cp -r $DIR ${BACKUP_DIR}/$(basename $DIR)-configs 2>/dev/null || true
    fi
done
echo ""

echo -e "${YELLOW}💾 PASSO 5: Exportando bancos de dados (se houver)...${NC}"

# Redis - se estiver rodando
if docker ps | grep -q redis; then
    echo "   → Backup Redis..."
    docker exec $(docker ps -q -f name=redis) redis-cli BGSAVE 2>/dev/null || true
    sleep 2
    # Copiar dump.rdb se existir
    REDIS_VOLUME=$(docker volume ls -q | grep redis | head -1)
    if [ ! -z "$REDIS_VOLUME" ]; then
        docker run --rm \
            -v ${REDIS_VOLUME}:/data \
            -v ${BACKUP_DIR}:/backup \
            busybox cp /data/dump.rdb /backup/redis-dump.rdb 2>/dev/null || true
    fi
fi

# PostgreSQL/MySQL - se houver
for DB in postgres mysql mariadb; do
    if docker ps | grep -q ${DB}; then
        echo "   → Container ${DB} detectado"
        echo "   ⚠️ Faça backup do banco manualmente ou adicione credenciais ao script"
    fi
done
echo ""

echo -e "${YELLOW}📊 PASSO 6: Gerando relatório...${NC}"
cat > ${BACKUP_DIR}/README.txt << EOF
BACKUP DOS APPS TOTUM
====================
Data: $(date)
Servidor: $(hostname)

CONTÉM:
- Volumes Docker (dados dos apps)
- Configurações (docker-compose, .env)
- Lista de containers
- Banco Redis (se aplicável)

APPS INCLUÍDOS:
EOF

docker ps --format "  - {{.Names}} ({{.Image}})" >> ${BACKUP_DIR}/README.txt

echo "   → README.txt criado"
echo ""

echo -e "${YELLOW}🗜️ PASSO 7: Compactando tudo...${NC}"
cd /root/backups
tar czf apps-backup-$(date +%Y%m%d_%H%M%S).tar.gz $(basename ${BACKUP_DIR})
FINAL_FILE="/root/backups/apps-backup-$(date +%Y%m%d_%H%M%S).tar.gz"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ BACKUP CONCLUÍDO!${NC}"
echo "=========================================="
echo ""
echo "📁 Arquivo: ${FINAL_FILE}"
echo "📊 Tamanho: $(du -h ${FINAL_FILE} | cut -f1)"
echo ""
echo "💾 PARA BAIXAR PARA SUA MÁQUINA:"
echo ""
echo "   scp root@187.127.4.140:${FINAL_FILE} ./"
echo ""
echo "   Ou use SFTP/FileZilla:"
echo "   Host: 187.127.4.140"
echo "   Usuário: root"
echo "   Senha: [sua senha]"
echo "   Caminho: /root/backups/"
echo ""
echo "🎉 Pronto!"

# Limpar pasta temporária
rm -rf ${BACKUP_DIR}

# Listar backups existentes
echo ""
echo "📦 Backups disponíveis:"
ls -lh /root/backups/apps-backup-*.tar.gz 2>/dev/null | tail -5 || echo "   (nenhum backup anterior encontrado)"
