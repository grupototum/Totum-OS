# 🦙 Guia de Instalação do Ollama - Servidor Escritório Israel

**Data:** 2026-04-05  
**Servidor:** i5-2400 (Escritório Israel)  
**Responsável:** Israel (com suporte remoto se necessário)  
**Prioridade:** 🔴 ALTA

---

## 📋 PRÉ-REQUISITOS

### Hardware do Servidor
| Componente | Mínimo | Ideal | Status |
|------------|--------|-------|--------|
| CPU | i5-2400 | i5-2400+ | ✅ OK |
| RAM | 8GB | 16GB | ⬜ Verificar |
| Disco | 20GB livre | 50GB+ | ⬜ Verificar |
| Rede | Ethernet/WiFi | Ethernet preferido | ⬜ Verificar |

### Sistema Operacional
- **Preferido:** Ubuntu 20.04+ / Debian 11+
- **Alternativa:** Qualquer Linux com systemd
- **Acesso:** SSH ou terminal físico

---

## 🔧 PASSO A PASSO DE INSTALAÇÃO

### 1. Verificação Inicial do Sistema

```bash
# Verificar espaço em disco
df -h

# Verificar memória RAM
free -h

# Verificar versão do sistema
cat /etc/os-release

# Verificar arquitetura CPU
uname -m
```

**⚠️ IMPORTANTE:** Se RAM < 8GB ou disco < 20GB livre, **PARAR** e reportar para análise.

---

### 2. Instalação do Ollama

```bash
# Baixar e executar script oficial de instalação
curl -fsSL https://ollama.com/install.sh | sh

# Verificar instalação
ollama --version

# Saída esperada: ollama version X.X.X
```

**Tempo estimado:** 2-5 minutos (depende da conexão)

---

### 3. Download dos Modelos

Execute na ordem (menor para maior):

```bash
# 1. Modelo de embeddings (274MB) - Mais rápido para teste
ollama pull nomic-embed-text

# 2. Modelo leve para tarefas simples (2GB)
ollama pull llama3.2

# 3. Modelo de código (4.2GB)
ollama pull deepseek-coder

# 4. Modelo avançado para análise (4.7GB)
ollama pull qwen2.5
```

**Tempo estimado total:** 15-30 minutos (depende da conexão)

**💡 DICA:** Deixe baixando enquanto configura o resto.

---

### 4. Configuração de Rede (Acesso Remoto)

```bash
# Editar configuração do serviço
sudo systemctl edit ollama.service
```

Adicione o seguinte conteúdo no editor:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Salvar (Ctrl+O, Enter, Ctrl+X no nano) e reiniciar:

```bash
# Recarregar configuração do systemd
sudo systemctl daemon-reload

# Reiniciar serviço Ollama
sudo systemctl restart ollama

# Verificar status
sudo systemctl status ollama
```

**✅ Status deve mostrar:** `Active: active (running)`

---

### 5. Configuração do Firewall (se necessário)

```bash
# Ubuntu/Debian com UFW
sudo ufw allow 11434/tcp
sudo ufw reload

# Ou iptables
sudo iptables -I INPUT -p tcp --dport 11434 -j ACCEPT
```

---

### 6. Testes de Funcionamento

#### Teste 1 - Local (no servidor)
```bash
# Teste básico com llama3.2
ollama run llama3.2 "Olá, você está funcionando? Responda em português."

# Resposta esperada: Confirmação em português
```

#### Teste 2 - Via API (no servidor)
```bash
# Testar endpoint da API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Diga 'Funcionando!' em português"
}'
```

#### Teste 3 - Via Rede (de outro computador)
```bash
# Substituir <IP_DO_SERVIDOR> pelo IP real
# Descobrir IP do servidor: ip addr show

curl http://<IP_DO_SERVIDOR>:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Teste de conexão remota"
}'
```

---

## 📊 MODELOS INSTALADOS

| Modelo | Tamanho | Uso Principal | Status |
|--------|---------|---------------|--------|
| nomic-embed-text | 274MB | Embeddings/Busca | ⬜ |
| llama3.2 | 2GB | Tarefas rápidas/simples | ⬜ |
| deepseek-coder | 4.2GB | Código/Programação | ⬜ |
| qwen2.5 | 4.7GB | Análise complexa | ⬜ |

**Total de espaço necessário:** ~11GB

---

## 🌐 CONFIGURAÇÃO FINAL

### Informações do Servidor (PREENCHER APÓS INSTALAÇÃO)

```
IP do Servidor: ________________
Porta: 11434
URL de Acesso: http://<IP>:11434
Status: ⬜ Online
```

### Comandos Úteis

```bash
# Ver modelos instalados
ollama list

# Iniciar modelo interativo
ollama run llama3.2

# Remover um modelo
ollama rm <nome-do-modelo>

# Ver logs do serviço
sudo journalctl -u ollama -f

# Parar serviço
sudo systemctl stop ollama

# Iniciar serviço
sudo systemctl start ollama

# Habilitar início automático
sudo systemctl enable ollama
```

---

## 🔗 INTEGRAÇÃO COM ALEXANDRIA

### Configuração do .env da Alexandria

```bash
# Adicionar/editar no arquivo .env da Alexandria:

OLLAMA_BASE_URL=http://<IP_DO_SERVIDOR>:11434
OLLAMA_DEFAULT_MODEL=llama3.2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

### Teste de Integração

```bash
# Reiniciar Alexandria após configurar .env
pm2 restart alexandria

# Verificar logs
pm2 logs alexandria
```

---

## 🐛 TROUBLESHOOTING

### Problema: "cannot connect to ollama"
```bash
# Verificar se serviço está rodando
sudo systemctl status ollama

# Reiniciar serviço
sudo systemctl restart ollama
```

### Problema: "model not found"
```bash
# Listar modelos disponíveis
ollama list

# Baixar modelo se necessário
ollama pull <nome-do-modelo>
```

### Problema: Acesso negado de outro computador
```bash
# Verificar se está ouvindo em todas as interfaces
sudo netstat -tlnp | grep 11434
# ou
sudo ss -tlnp | grep 11434

# Deve mostrar: 0.0.0.0:11434 (não 127.0.0.1:11434)
```

### Problema: Memória insuficiente
- Modelos grandes (>4GB) precisam de RAM suficiente
- Tentar com llama3.2 primeiro (mais leve)
- Considerar aumentar swap se necessário

### Problema: Download lento/falha
```bash
# Tentar novamente (retoma de onde parou)
ollama pull <modelo>

# Ou remover e baixar novamente
ollama rm <modelo>
ollama pull <modelo>
```

---

## ✅ CHECKLIST FINAL

- [ ] Ollama instalado (`ollama --version` funciona)
- [ ] 4 modelos baixados (`ollama list` mostra todos)
- [ ] Acesso via rede configurado (teste de outro PC)
- [ ] Serviço configurado para iniciar automaticamente
- [ ] Documentação atualizada com IP real
- [ ] Teste de integração com Alexandria (se aplicável)
- [ ] Servidor configurado para ficar ligado 24/7

---

## 📞 SUPORTE

Se houver problemas:
1. Verificar logs: `sudo journalctl -u ollama -f`
2. Documentar erro exato (screenshot ou copiar mensagem)
3. Reportar com informações do sistema

---

## 📁 LOCAL DOS ARQUIVOS

- **Modelos:** `~/.ollama/models/`
- **Configuração systemd:** `/etc/systemd/system/ollama.service.d/`
- **Logs:** `sudo journalctl -u ollama`

---

*Documento criado em: 2026-04-04*  
*Versão: 1.0*  
*Próxima revisão: Após instalação*
