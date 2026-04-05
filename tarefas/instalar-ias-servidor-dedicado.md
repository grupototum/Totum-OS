# TAREFA PENDENTE: Instalar IAs no Servidor Dedicado

**Data de criação:** 2026-04-03  
**Prioridade:** 🔴 Alta  
**Responsável:** TOT + Israel  

## Hardware do Servidor Dedicado
- **CPU:** Intel i5-2400 (4 cores, 3.1GHz) - 2011
- **RAM:** 8GB DDR3
- **GPU:** Intel HD Graphics (32MB) - ❌ Sem GPU dedicada
- **Storage:** 224GB SSD + 1.82TB HDD

## O que Instalar (do relatório Hug)

### Fase 1: Essenciais (Hoje)
- [ ] **Ollama** - Runtime para modelos GGUF
- [ ] **Qwen2.5:7b** - LLM em português
- [ ] **nomic-embed-text** - Embeddings
- [ ] **Whisper Base** - Transcrição de áudio

### Fase 2: Complementos (Semana que vem)
- [ ] **CodeLlama-7B** - Assistente de código
- [ ] **ChromaDB** - Banco vetorial
- [ ] **LlamaIndex** - Framework RAG

## Script de Instalação
```bash
# Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Modelos
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
ollama pull tinyllama
```

## Sobre a Placa de Vídeo
Ver discussão abaixo - servidor atual funciona sem GPU, mas com limitações.

## Quando Executar
- Quando Israel tiver acesso ao servidor dedicado
- Ou: Remotamente se tiver SSH configurado
