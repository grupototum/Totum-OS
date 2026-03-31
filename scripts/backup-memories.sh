#!/bin/bash
# backup-memories.sh - Script para backup do banco de dados e memórias
# Uso: ./backup-memories.sh

BACKUP_DIR="$HOME/.openclaw/backups"
DATA_DIR="$HOME/.openclaw/workspace/data"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Backup do banco de dados SQLite
if [ -f "$DATA_DIR/totum_claw.db" ]; then
    cp "$DATA_DIR/totum_claw.db" "$BACKUP_DIR/totum_claw_$DATE.db"
    echo "✓ Banco de dados backup: totum_claw_$DATE.db"
fi

# Backup das memórias diárias
if [ -d "$HOME/.openclaw/workspace/memory" ]; then
    tar -czf "$BACKUP_DIR/memory_$DATE.tar.gz" -C "$HOME/.openclaw/workspace" memory/
    echo "✓ Memórias backup: memory_$DATE.tar.gz"
fi

# Limpar backups antigos (manter últimos 30 dias)
find "$BACKUP_DIR" -name "*.db" -mtime +30 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup concluído em: $BACKUP_DIR"
ls -lh "$BACKUP_DIR" | tail -5
