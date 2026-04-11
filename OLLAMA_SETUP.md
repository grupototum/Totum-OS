# 🚀 CONFIGURAÇÃO OLLAMA PARA PRODUÇÃO REAL

**Status:** Pronto para ativar Ollama com real AI

---

## ✅ O Que Já Está Pronto

Os scripts de processamento estão **100% preparados** para usar Ollama real:

```javascript
// process-transcriptions.mjs detecta automaticamente
const MOCK_MODE = process.env.MOCK_MODE !== 'false';
// false = usa Ollama real
// true ou não definido = usa mock mode com fallback
```

---

## 📦 Instalação de Ollama (macOS)

### Opção 1: Via Homebrew (Recomendado)

```bash
# Instalar
brew install ollama

# Verificar instalação
ollama --version

# Iniciar servidor (em terminal separado)
ollama serve
```

**Esperado:**
```
time=... level=INFO msg="Listening on 127.0.0.1:11434"
```

### Opção 2: Download Direto

1. Acesse: https://ollama.ai/download
2. Selecione macOS
3. Instale e execute a aplicação

**Esperado:**
- Ícone do Ollama na barra de menu
- Servidor rodando na porta 11434

---

## 🤖 Modelos Recomendados

### Modelo Padrão (7B - Balanceado)

```bash
# Download e configuração automática
ollama pull neural-chat

# Ou alternativas:
ollama pull llama2          # Excelente qualidade
ollama pull mistral         # Rápido (7B)
ollama pull openchat        # Especializado
```

**Tempo de download:** 5-15 minutos (depende do modelo)
**Tamanho:** ~4-7 GB em disco

### Modelo Leve (3B - Rápido)

```bash
ollama pull orca-mini
# ou
ollama pull phi
```

**Tempo:** 1-3 minutos
**Tamanho:** ~2 GB

---

## ✅ Verificação de Conexão

**Script de teste:**

```bash
# Testar conexão com Ollama
curl http://localhost:11434/api/tags

# Esperado: JSON com lista de modelos
{
  "models": [
    {
      "name": "neural-chat:latest",
      "modified_at": "2024-04-11T...",
      "size": ...
    }
  ]
}
```

---

## 🔧 Ativar MODO REAL

### 1️⃣ Configure a variável de ambiente

```bash
# Editar .env
echo "MOCK_MODE=false" >> .env

# Ou exportar direto
export MOCK_MODE=false
```

### 2️⃣ Certifique-se de que Ollama está rodando

```bash
# Em outro terminal, deixar rodando:
ollama serve

# Esperado na porta 11434
curl http://localhost:11434/api/tags
```

### 3️⃣ Execute o script com Ollama real

```bash
cd /Users/israellemos/Documents/Totum\ Dev

# Com Ollama rodando
node process-transcriptions.mjs

# Você verá:
# ✅ Ollama conectado com sucesso
# 🤖 Usando Ollama REAL para processamento...
```

---

## 📊 Modo Real vs Mock

| Aspecto | Modo Real (Ollama) | Modo Mock |
|--------|-------------------|----------|
| **Qualidade** | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐⭐ Bom |
| **Velocidade** | 10-30s por vídeo | <1s por vídeo |
| **Custodependências | Locais, grátis | Nenhuma |
| **Conhecimento** | Modelo treinado | Determinístico |
| **Criatividade** | Alta | Média |

---

## 🚀 Execução Completa com Ollama Real

**Fluxo:**

```bash
# Terminal 1: Iniciar Ollama
ollama serve

# Terminal 2: Aguardar "Listening on 127.0.0.1:11434"

# Terminal 3: Configurar variável
export MOCK_MODE=false

# Terminal 3: Executar processamento
node process-transcriptions.mjs

# Esperado:
# 🔍 Verificando Ollama em http://localhost:11434...
# ✅ Ollama conectado com sucesso!
# 🤖 Modelo disponível: neural-chat:latest
# 📊 Iniciando processamento com OLLAMA REAL...
# [1/10] Processando vídeo 1...
```

---

## ⚠️ Troubleshooting

### Erro: "Não consegui conectar com Ollama"

**Causa:** Ollama não está rodando ou na porta errada

**Solução:**
```bash
# Verificar se Ollama está rodando
ps aux | grep ollama

# Se não estiver, iniciar:
ollama serve

# Se porta está diferente, editar .env:
OLLAMA_URL=http://localhost:11434
```

### Erro: "Modelo não encontrado"

**Causa:** Modelo não foi baixado

**Solução:**
```bash
# Download automático (escolher um):
ollama pull neural-chat
ollama pull llama2
ollama pull mistral
```

### Erro: "Timeout ao conectar"

**Causa:** Ollama demorando demais para responder

**Solução:**
```bash
# Aumentar timeout em process-transcriptions.mjs
const OLLAMA_TIMEOUT = 60000; // 60 segundos

# Ou usar modelo mais leve:
ollama pull orca-mini  # 3B, mais rápido
```

---

## 📈 Performance Esperado

**Com Ollama real (neural-chat 7B):**

- **Extraction de insights:** 5-10s
- **Classificação:** 3-5s
- **Geração de tags:** 2-3s
- **Summary:** 8-15s
- **CTA extraction:** 3-5s
- **Trending topics:** 4-6s
- **Script generation:** 10-15s

**Total por vídeo:** 35-60 segundos (depende do hardware)
**Total para 10 vídeos:** 6-10 minutos

---

## 💡 Otimizações

### 1. Usar modelo mais leve (3B)
```bash
erlama pull orca-mini
# Reduz tempo em ~50%, qualidade reduzida em ~15%
```

### 2. Aumentar VRAM alocada
```bash
# Editar Docker settings se usar container
# Ou defaut: Ollama usa até 8GB
```

### 3. Usar GPU (se disponível)
```bash
# Ollama detecta e usa automaticamente
# Metal (Apple Silicon) - suportado nativamente
# CUDA (NVIDIA) - suportado automaticamente
```

---

## ✅ Próximas Etapas

1. ✅ Instalar Ollama: `brew install ollama`
2. ⏳ Iniciar servidor: `ollama serve`
3. ⏳ Download modelo: `ollama pull neural-chat`
4. ⏳ Configurar `.env`: `MOCK_MODE=false`
5. ⏳ Executar com Ollama: `node process-transcriptions.mjs`
6. ⏳ Validar outputs com processamento real

---

## 🔗 Recursos

- **Site oficial:** https://ollama.ai
- **Modelos disponíveis:** https://ollama.ai/library
- **Documentação:** https://github.com/ollama/ollama
- **Comunidade:** https://github.com/ollama/ollama/discussions

---

**Status:** System ready for Ollama real production. Awaiting model download and server startup.

*Última atualização: 11 de Abril de 2026*
