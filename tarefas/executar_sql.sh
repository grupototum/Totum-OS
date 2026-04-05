#!/bin/bash

# Script para executar SQL no Supabase via psql
# Requer: postgresql-client (psql)
# Requer: Senha do banco PostgreSQL (disponível no Dashboard do Supabase > Settings > Database)

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Setup Tarefas no Supabase"
echo "========================================"
echo ""

# Verificar se psql está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ psql não encontrado${NC}"
    echo "Instalando postgresql-client..."
    apt-get update && apt-get install -y postgresql-client
fi

# Configurações
SUPABASE_HOST="db.cgpkfhrqprqptvehatad.supabase.co"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"
SQL_FILE="setup_tarefas_supabase.sql"

# Verificar se arquivo SQL existe
if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}✗ Arquivo $SQL_FILE não encontrado${NC}"
    exit 1
fi

# Solicitar senha
if [ -z "$SUPABASE_PASSWORD" ]; then
    echo -e "${YELLOW}Digite a senha do PostgreSQL (encontrada no Dashboard do Supabase):${NC}"
    read -s SUPABASE_PASSWORD
    echo ""
fi

# Construir connection string
CONN_STRING="postgresql://${SUPABASE_USER}:${SUPABASE_PASSWORD}@${SUPABASE_HOST}:5432/${SUPABASE_DB}"

echo ""
echo "Conectando ao Supabase..."
echo "Host: $SUPABASE_HOST"
echo "Database: $SUPABASE_DB"
echo ""

# Executar SQL
if PGPASSWORD="$SUPABASE_PASSWORD" psql "$CONN_STRING" -f "$SQL_FILE" -v ON_ERROR_STOP=1; then
    echo ""
    echo -e "${GREEN}✓ SQL executado com sucesso!${NC}"
    echo ""
    echo "Verificando tarefas inseridas:"
    PGPASSWORD="$SUPABASE_PASSWORD" psql "$CONN_STRING" -c "SELECT titulo, prioridade, deadline::date, status FROM public.tarefas ORDER BY deadline;"
else
    echo ""
    echo -e "${RED}✗ Erro ao executar SQL${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo -e "${GREEN}✓ Setup concluído!${NC}"
echo "========================================"
