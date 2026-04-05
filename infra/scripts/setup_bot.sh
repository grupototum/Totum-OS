#!/bin/bash
# ============================================================
# SETUP - Bot Atendente Totum
# ============================================================

set -e

echo "🤖 Instalando Bot Atendente Totum..."
echo "===================================="

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado. Instale o Python 3.8+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Criar diretórios
echo "📁 Criando estrutura de diretórios..."
mkdir -p data
mkdir -p logs

# Instalar dependências
echo "📦 Instalando dependências..."
pip3 install -q python-telegram-bot requests

echo "✅ Dependências instaladas"

# Verificar Ollama
echo "🔍 Verificando Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama está rodando"
    
    # Verificar se Llama 3.2 está disponível
    if curl -s http://localhost:11434/api/tags | grep -q "llama3.2"; then
        echo "✅ Modelo Llama 3.2 encontrado"
    else
        echo "⚠️  Modelo Llama 3.2 não encontrado"
        echo "   Execute: ollama pull llama3.2"
    fi
else
    echo "⚠️  Ollama não está rodando"
    echo "   Inicie com: ollama serve"
    echo "   E instale o modelo: ollama pull llama3.2"
fi

# Configurar variáveis de ambiente
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e preencha os IDs dos responsáveis"
fi

# Popular base de conhecimento
echo "📚 Populando base de conhecimento..."
python3 << 'PYTHON_EOF'
import sqlite3
import os

os.makedirs("data", exist_ok=True)
conn = sqlite3.connect("data/atendimento_bot.db")
cursor = conn.cursor()

# Criar tabela de conhecimento se não existir
cursor.execute("""
    CREATE TABLE IF NOT EXISTS conhecimento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoria TEXT,
        pergunta TEXT,
        resposta TEXT,
        palavras_chave TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

# Ler arquivo de conhecimento
if os.path.exists("data/base_conhecimento.txt"):
    with open("data/base_conhecimento.txt", "r", encoding="utf-8") as f:
        conteudo = f.read()
    
    # Parse simples (categoria|pergunta|resposta|palavras_chave)
    for linha in conteudo.split('\n'):
        if linha.strip() and not linha.startswith('#') and '|' in linha:
            partes = linha.split('|', 3)
            if len(partes) == 4:
                categoria, pergunta, resposta, palavras = partes
                cursor.execute("""
                    INSERT INTO conhecimento (categoria, pergunta, resposta, palavras_chave)
                    VALUES (?, ?, ?, ?)
                """, (categoria.strip(), pergunta.strip(), 
                      resposta.strip(), palavras.strip()))
    
    conn.commit()
    print(f"✅ Base de conhecimento populada")
else:
    print("⚠️  Arquivo base_conhecimento.txt não encontrado")

conn.close()
PYTHON_EOF

# Criar script de inicialização
cat > start_bot.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Iniciando Bot Atendente Totum..."
echo "===================================="
echo ""
echo "Comandos disponíveis:"
echo "  /start - Iniciar atendimento"
echo "  /help  - Ver ajuda"
echo "  /status - Ver suas solicitações"
echo ""
python3 bot_atendente_totum.py
EOF

chmod +x start_bot.sh

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Edite .env e adicione os IDs dos responsáveis"
echo "   2. Inicie o Ollama: ollama serve"
echo "   3. Execute: ./start_bot.sh"
echo ""
echo "📖 Documentação:"
echo "   Bot: @totum_agents_bot"
echo "   Link: https://t.me/totum_agents_bot"
echo ""
