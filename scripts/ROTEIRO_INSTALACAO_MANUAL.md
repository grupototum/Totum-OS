# 📋 ROTEIRO MANUAL - INSTALAÇÃO CYBERPANEL + OPENCLAW

**Data:** 2026-04-03  
**VPS:** Stark (187.127.4.140)  
**Objetivo:** Instalar CyberPanel sem perder Docker + OpenClaw + Criar Bot

---

## ✅ PRÉ-REQUISITOS

- Acesso SSH ao VPS: `ssh root@187.127.4.140`
- 2GB+ RAM livre
- 30 minutos disponíveis
- Senha root anotada

---

## 🔧 PASSO 1: Acessar VPS

```bash
ssh root@187.127.4.140

# Verificar espaço e recursos
df -h
free -h
docker ps  # Confirmar que Docker está rodando
```

---

## 🔧 PASSO 2: Instalar CyberPanel (Manual)

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Baixar instalador
wget -O installer.sh https://cyberpanel.net/install.sh
chmod +x installer.sh

# Executar instalador
./installer.sh
```

### Opções durante instalação:

```
CyberPanel Installer v2.3

1. Install CyberPanel with OpenLiteSpeed.
2. Install CyberPanel with LiteSpeed Enterprise.
3. Exit.

Please enter the number[1-3]: 1
```
**Digite:** `1` ↵

```
Install Full service for CyberPanel? [Y/n]: 
```
**Digite:** `Y` ↵

```
Do you want to setup Remote MySQL? [y/N]: 
```
**Digite:** `N` ↵

```
Please choose to use default admin password 1234567
1. Yes
2. No
```
**Digite:** `2` ↵

```
Please enter your password: 
```
**Digite:** `StarkCyberPanel2024!` ↵

```
Please confirm your password: 
```
**Digite:** `StarkCyberPanel2024!` ↵

### ⏰ Aguarde 15-30 minutos...

---

## 🔧 PASSO 3: Anotar Credenciais

Ao final, você verá:

```
CyberPanel Successfully Installed

Panel URL: https://187.127.4.140:8090
Username: admin
Password: StarkCyberPanel2024!
MySQL Password: [alguma_senha]
```

**📸 TIRE PRINT ou COPIE PARA ARQUIVO!**

---

## 🔧 PASSO 4: Instalar Node.js 22

```bash
# Instalar NodeSource repo
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

# Instalar Node.js
apt install -y nodejs

# Verificar
node --version  # Deve mostrar v22.x.x
npm --version   # Deve mostrar 10.x.x
```

---

## 🔧 PASSO 5: Instalar OpenClaw

```bash
# Instalar globalmente
npm install -g openclaw

# Verificar
openclaw --version

# Inicializar
mkdir -p /opt/openclaw
openclaw init --name stark-local --path /opt/openclaw

# Configurar porta
cd /opt/openclaw
openclaw config set gateway.bind 0.0.0.0:8080

# Iniciar gateway
openclaw gateway start
```

---

## 🔧 PASSO 6: Verificar OpenClaw

```bash
# Verificar se está rodando
curl http://localhost:8080/health

# Deve retornar: {"status":"ok"}
```

---

## 🔧 PASSO 7: Criar Bot no Kimi Claw

1. Acesse: https://kimi.moonshot.cn
2. Clique no seu perfil (canto superior direito)
3. **Settings**
4. **Create New Bot**
5. Preencha:

```yaml
Name: Data Local
Description: Agente técnico no VPS Stark para execução de tarefas pesadas

System Prompt: |
  Você é Data Local, agente técnico da Totum rodando no VPS Stark.
  
  PERSONALIDADE:
  - Preciso, técnico, focado em execução
  - Acesso direto ao filesystem e Docker
  - Reporta para TOT (Kimi Claw)
  
  FUNÇÃO:
  - Executar scripts e automações
  - Gerenciar Docker containers
  - Acessar bancos de dados locais
  - Monitorar servidor (Beszel)
  
  CAPACIDADES:
  - Acesso SSH completo
  - Docker daemon
  - Node.js, Python, Bash
  - Redis, PostgreSQL
  
  REGRAS:
  - Sempre confirmar antes de comandos destrutivos
  - Logar todas as ações
  - Reportar erros detalhadamente

Capabilities:
  Web Search: false
  Code Execution: true
  Terminal Access: true
```

6. Clique **Create**
7. Anote o **Bot Token** que aparecer

---

## 🔧 PASSO 8: Conectar Bot ao VPS

No terminal do VPS (SSH):

```bash
# Comando fornecido pelo Kimi Claw (substitua TOKEN pelo real)
bash <(curl -fsSL https://cdn.kimi.com/kimi-claw/install.sh) --bot-token SEU_TOKEN_AQUI
```

Exemplo:
```bash
bash <(curl -fsSL https://cdn.kimi.com/kimi-claw/install.sh) --bot-token sk-ABC123XYZ
```

---

## 🔧 PASSO 9: Testar Conexão

No Kimi Claw, fale com o novo bot:

```
"Data Local, execute: docker ps"
```

**Esperado:** Lista de containers Docker rodando no VPS.

---

## 🔧 PASSO 10: Configurar Comunicação TOT ↔ Data Local

No VPS, crie o arquivo de configuração:

```bash
mkdir -p /opt/openclaw/config

cat > /opt/openclaw/config/tot-bridge.yaml << 'EOF'
# Configuração de Bridge TOT (Kimi) <-> Data Local (VPS)

bridge:
  name: "tot-stark-bridge"
  
  # Comunicação via Supabase (async)
  supabase:
    url: "https://cgpkfhrqprqptvehatad.supabase.co"
    key: "${SUPABASE_ANON_KEY}"
    table: "mensagens_agents"
  
  # Comunicação via Redis (real-time)
  redis:
    host: "localhost"
    port: 6379
    channel: "totum:comandos"
  
  # Heartbeat
  heartbeat:
    interval: 30  # segundos
    timeout: 120  # segundos

agents:
  local:
    name: "data-local"
    role: "executor"
    capabilities:
      - docker
      - filesystem
      - scripts
      - monitoring
  
  remote:
    name: "tot-kimi"
    role: "orquestrador"
    url: "https://kimi.moonshot.cn"
EOF
```

---

## ✅ CHECKLIST FINAL

- [ ] CyberPanel acessível em https://187.127.4.140:8090
- [ ] Docker ainda funcionando (docker ps)
- [ ] Node.js 22 instalado (node --version)
- [ ] OpenClaw instalado (openclaw --version)
- [ ] Bot criado no Kimi Claw
- [ ] Bot conectado ao VPS (comando de link executado)
- [ ] Teste de comunicação bem-sucedido
- [ ] Credenciais salvas em local seguro
- [ ] TOT notificado que está pronto!

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### Erro: "Port 8090 already in use"
```bash
# Verificar conflito
netstat -tlnp | grep 8090

# Se Docker estiver usando, alterar CyberPanel
nano /usr/local/lsws/conf/httpd_config.conf
# Alterar porta 8090 para 8443
systemctl restart lsws
```

### Erro: "OpenClaw not found"
```bash
# Verificar instalação
which openclaw
npm list -g openclaw

# Reinstalar se necessário
npm uninstall -g openclaw
npm install -g openclaw
```

### Erro: "Connection refused" no bot
```bash
# Verificar se OpenClaw está rodando
openclaw gateway status

# Se não estiver, iniciar
cd /opt/openclaw
openclaw gateway start

# Verificar firewall
ufw allow 8080/tcp
```

---

## 📞 SUPORTE

Se travar em algum passo, me envie:
1. O passo que está
2. O erro exibo (print ou texto)
3. O comando que tentou

**TOT pode ajudar remotamente!** 🎛️