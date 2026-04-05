# 🖥️ TAREFA: INSTALAR OLLAMA NO SERVIDOR DEDICADO

**Responsável:** Israel  
**Data:** Assim que possível  
**Prioridade:** MÉDIA  
**Hardware:** Servidor Dedicado (Intel i5-2400 @ 3.10GHz, 8GB DDR3, 224GB SSD + 1.82TB HDD)

---

## 🎯 OBJETIVO
Instalar Ollama e modelos de IA no servidor dedicado físico do escritório.

---

## ✅ PASSO A PASSO

### 1. Acessar o Servidor
```bash
# Via SSH (presumido)
ssh usuario@IP_DO_SERVIDOR
```

### 2. Instalar Ollama
```bash
# Download e instalação automática
curl -fsSL https://ollama.com/install.sh | sh
```

### 3. Verificar instalação
```bash
ollama --version
```

### 4. Baixar modelos (GGUF otimizados para CPU)
```bash
# Modelo principal - Qwen 2.5 7B (4-bit)
ollama pull qwen2.5:7b

# Modelo de embeddings
ollama pull nomic-embed-text

# Opcional: Whisper para transcrição (se precisar)
# ollama pull whisper
```

### 5. Testar modelos
```bash
# Testar Qwen
ollama run qwen2.5:7b

# Dentro do chat, testar:
# "Olá, tudo bem? Responda em português."
```

### 6. Configurar acesso remoto (opcional)
```bash
# Se quiser acessar de outros dispositivos na rede
# Editar /etc/systemd/system/ollama.service
# Adicionar: Environment="OLLAMA_HOST=0.0.0.0:11434"
# Reload: sudo systemctl daemon-reload && sudo systemctl restart ollama
```

---

## 💾 REQUISITOS E ESPAÇO

### Modelos a instalar:
| Modelo | Tamanho | Uso |
|--------|---------|-----|
| qwen2.5:7b | ~4.5 GB | Chat, raciocínio, código |
| nomic-embed-text | ~250 MB | Embeddings, busca semântica |
| **Total** | **~5 GB** | |

### Hardware disponível:
- **CPU:** Intel i5-2400 (4 cores, 4 threads) ✅ Suficiente
- **RAM:** 8GB DDR3 ⚠️ Limitado, mas funciona (modelos 7B ok)
- **Disco:** 224GB SSD ✅ Mais que suficiente

---

## ⚠️ NOTAS IMPORTANTES

1. **Não tem GPU** - Modelos serão lentos (2-5 tokens/segundo), mas funcionam
2. **Prefira modelos quantizados** (Q4) - Menor uso de RAM
3. **Teste um por vez** - Não carregue todos na RAM de uma vez
4. **Servidor nunca desliga** - Ollama fica disponível 24/7

---

## 🔧 COMANDOS ÚTEIS

```bash
# Listar modelos instalados
ollama list

# Remover modelo
ollama rm qwen2.5:7b

# Ver logs
journalctl -u ollama -f

# Parar serviço
sudo systemctl stop ollama

# Iniciar serviço
sudo systemctl start ollama
```

---

## ✅ CHECKLIST DE CONCLUSÃO

- [ ] Ollama instalado
- [ ] qwen2.5:7b baixado
- [ ] nomic-embed-text baixado
- [ ] Teste de chat realizado
- [ ] Acesso remoto configurado (se necessário)

---

**Criado por:** TOT  
**Data:** 2026-04-04  
**Status:** Aguardando execução por Israel