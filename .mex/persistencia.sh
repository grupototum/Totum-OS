#!/bin/bash
# ============================================
# SISTEMA DE PERSISTÊNCIA TOTUM
# Salva contexto em 5 lugares automaticamente
# ============================================

set -e

WORKSPACE="/root/.openclaw/workspace"
ALEXANDRIA="$WORKSPACE/alexandria"
MEX_DIR="$WORKSPACE/.mex"
LOG_FILE="$WORKSPACE/logs/persistencia.log"

# Criar diretórios necessários
mkdir -p "$ALEXANDRIA/contextos/ativas"
mkdir -p "$ALEXANDRIA/contextos/persistidas"
mkdir -p "$ALEXANDRIA/sync"
mkdir -p "$WORKSPACE/logs"
mkdir -p "$MEX_DIR"

# Timestamp
TS=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y-%m-%d)

echo "[$TS] Iniciando sistema de persistência..." >> "$LOG_FILE"

# ============================================
# FUNÇÃO: Salvar contexto imediato
# ============================================
salvar_contexto() {
    local tipo="$1"          # decisao, erro, aprendizado, tarefa
    local conteudo="$2"      # texto do contexto
    local categoria="$3"     # agente, sistema, projeto
    local origem="$4"        # qual agente/sistema gerou
    
    # Gerar ID único
    local id="ctx_${TS}_$(echo "$conteudo" | md5sum | cut -c1-8)"
    
    # Arquivo temporário (VPS)
    local arquivo_temp="$ALEXANDRIA/contextos/ativas/${id}.md"
    
    cat > "$arquivo_temp" << EOF
---
id: $id
tipo: $tipo
categoria: $categoria
origem: $origem
data: $(date -Iseconds)
status: pendente
---

# Contexto $tipo - $categoria

**Origem:** $origem  
**Data:** $(date '+%Y-%m-%d %H:%M:%S')  
**Status:** ⏳ Pendente de confirmação

## Conteúdo

$conteudo

## Metadados

- Hash: $(echo "$conteudo" | md5sum | awk '{print $1}')
- Tamanho: ${#conteudo} caracteres
- Arquivo: $arquivo_temp
EOF

    echo "$arquivo_temp"
}

# ============================================
# FUNÇÃO: Confirmar/Recusar contexto
# ============================================
confirmar_contexto() {
    local arquivo="$1"
    local decisao="$2"  # confirmar ou recusar
    
    if [ "$decisao" = "confirmar" ]; then
        # Mover para persistidas
        local novo_nome="$ALEXANDRIA/contextos/persistidas/$(basename $arquivo)"
        mv "$arquivo" "$novo_nome"
        
        # Atualizar status
        sed -i 's/status: pendente/status: confirmado/' "$novo_nome"
        sed -i 's/⏳ Pendente/✅ Confirmado/' "$novo_nome"
        
        # Adicionar timestamp de confirmação
        echo "" >> "$novo_nome"
        echo "**Confirmado em:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$novo_nome"
        
        echo "$novo_nome"
    else
        # Mover para recusados
        mkdir -p "$ALEXANDRIA/contextos/recusados"
        mv "$arquivo" "$ALEXANDRIA/contextos/recusados/"
        echo "RECUSADO"
    fi
}

# ============================================
# FUNÇÃO: Sync com Supabase (placeholder)
# ============================================
sync_supabase() {
    local arquivo="$1"
    echo "[SYNC] Supabase: $arquivo (implementar API call)"
    # Aqui vai o código de inserção no Supabase
}

# ============================================
# FUNÇÃO: Commit no Git (placeholder)
# ============================================
sync_github() {
    local arquivo="$1"
    echo "[SYNC] GitHub: $arquivo (implementar git commit)"
}

# ============================================
# Verificar contextos pendentes
# ============================================
listar_pendentes() {
    find "$ALEXANDRIA/contextos/ativas" -name "*.md" -type f 2>/dev/null | wc -l
}

# Exportar funções para uso por agentes
export -f salvar_contexto
export -f confirmar_contexto
export -f listar_pendentes

echo "[$TS] Sistema de persistência carregado" >> "$LOG_FILE"
echo "OK"
