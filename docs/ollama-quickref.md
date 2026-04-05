# ⚡ Quick Reference - Ollama Server

## 🖥️ Servidor
- **Hardware:** i5-2400
- **Local:** Escritório Israel
- **Porta:** 11434
- **IP:** (preencher após instalação)

## 🚀 Comandos Rápidos

### Verificar Status
```bash
# Status do serviço
sudo systemctl status ollama

# Ver logs em tempo real
sudo journalctl -u ollama -f

# Modelos instalados
ollama list
```

### Usar Modelos
```bash
# Modo interativo
ollama run llama3.2

# Comando único
ollama run llama3.2 "Sua pergunta aqui"

# Sair do modo interativo: /bye
```

### Testar Acesso Remoto
```bash
# Do servidor
ip addr show

# De outro PC na rede
curl http://<IP_SERVIDOR>:11434/api/tags
```

## 🔧 Configuração Alexandria

```env
OLLAMA_BASE_URL=http://<IP_SERVIDOR>:11434
OLLAMA_DEFAULT_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

## 📊 Modelos

| Modelo | Tamanho | Uso |
|--------|---------|-----|
| llama3.2 | 2GB | Geral/Rápido |
| qwen2.5 | 4.7GB | Análise complexa |
| deepseek-coder | 4.2GB | Código |
| nomic-embed-text | 274MB | Embeddings |

## 🆘 Troubleshooting

**Não conecta?**
```bash
sudo systemctl restart ollama
```

**Modelo não encontrado?**
```bash
ollama pull <nome-do-modelo>
```

**Sem acesso remoto?**
```bash
# Verificar IP
ip addr show

# Verificar porta
sudo netstat -tlnp | grep 11434
```

---
*Atualizado: 2026-04-04*
