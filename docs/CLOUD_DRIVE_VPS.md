# ☁️ Totum Sync - Google Drive & VPS

## 📋 O Que Temos Agora

```
┌─────────────────────────────────────────┐
│  TOTUM CLAW (VPS Atual)                 │
│  ┌─────────────┐  ┌──────────────┐      │
│  │ SQLite DB   │  │ totum-sync   │◄─────┼──► Google Drive
│  │ Arquivos    │  │ (novo)       │◄─────┼──► Outra VPS
│  └─────────────┘  └──────────────┘      │
└─────────────────────────────────────────┘
```

---

## 🟨 Opção 1: Google Drive (Recomendado)

### Vantagens
- ✅ 15GB grátis
- ✅ Acesso fácil de qualquer lugar
- ✅ Interface web amigável
- ✅ Compartilhamento simples

### Configuração Passo a Passo

```bash
cd /root/.openclaw/workspace
./totum-sync setup
# Escolha: 2 (Google Drive)
```

**Ou manual:**

```bash
# 1. Instalar rclone
curl https://rclone.org/install.sh | bash

# 2. Configurar
rclone config
#   - n (new remote)
#   - name: gdrive
#   - storage: drive
#   - client_id: (deixe em branco)
#   - client_secret: (deixe em branco)
#   - scope: 1 (Full access)
#   - root_folder_id: (deixe em branco)
#   - edit advanced: n
#   - auto config: y (se tiver browser) ou n (para link manual)

# 3. Testar
rclone ls gdrive:

# 4. Configurar Totum Sync
./totum-sync setup
# Escolha Google Drive
```

### Uso
```bash
./totum-sync push      # Envia para Drive
./totum-sync pull      # Baixa do Drive
./totum-sync test      # Testa conexão
```

---

## 🖥️ Opção 2: Outra VPS (Sync Entre Servidores)

### Vantagens
- ✅ Controle total dos dados
- ✅ Sem depender de terceiros
- ✅ Sync rápido (depende da latência)
- ✅ Pode automatizar entre múltiplos servidores

### Configuração Passo a Passo

```bash
cd /root/.openclaw/workspace
./totum-sync setup
# Escolha: 3 (VPS Remota)
```

**Será solicitado:**
- IP/Hostname da VPS
- Usuário (padrão: root)
- Caminho remoto (padrão: /backups/totum-claw)
- Chave SSH (pode criar nova ou usar existente)

### Criar Chave SSH Nova (Recomendado)

Se escolher "Criar nova chave", o script vai:
1. Gerar `~/.ssh/totum_vps`
2. Mostrar a chave pública
3. Você copia e adiciona em `~/.ssh/authorized_keys` na VPS remota

**Na VPS remota:**
```bash
# Adicionar chave pública
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC... totum@claw" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Uso
```bash
./totum-sync push      # Envia para VPS
./totum-sync pull      # Baixa da VPS
./totum-sync test      # Testa conexão SSH
```

---

## 🔄 Arquitetura Multi-VPS (Avançado)

Se quiser sincronizar entre **várias VPS**:

```
VPS 1 (Principal) ◄────► VPS 2 (Backup)
       ▲
       │
       ▼
   Google Drive (Cloud)
```

### Configuração

**VPS 1 (Principal):**
```bash
./totum-sync setup
# Configure Google Drive OU VPS 2 como destino
```

**VPS 2 (Backup):**
```bash
./totum-sync setup  
# Configure VPS 1 como origem
# Modo: "pull" para baixar de VPS 1
```

### Script de Sync Bidirecional

```bash
#!/bin/bash
# sync-multi-vps.sh

# Na VPS 2, agendar para rodar a cada hora:
./totum-sync pull

# Se quiser merge inteligente (SQLite), usar:
# - rclone bisync (para arquivos)
# - ou script custom de merge de DB
```

---

## 📊 Comparativo Rápido

| Recurso | Google Drive | VPS Remota |
|---------|-------------|------------|
| **Custo** | Grátis (15GB) | Custo da VPS |
| **Setup** | Médio (rclone) | Fácil (SSH) |
| **Acesso Web** | ✅ Excelente | ❌ Apenas SSH |
| **Privacidade** | ⚠️ Google | ✅ Seu servidor |
| **Velocidade** | Boa | Ótima (mesma região) |
| **Limite** | 15GB | Ilimitado (disco da VPS) |

---

## 💡 Recomendação

### Cenário Ideal: **Ambos!**

```bash
# 1. Google Drive (backup primário)
./totum-sync setup  # Configure Drive
./totum-sync push   # Primeiro backup

# 2. VPS Remota (backup secundário)
# Edite .totum-sync.conf e adicione:
# VPS_BACKUP=true
# VPS_HOST=seu-ip
# ...
```

Ou use **rclone** para espelhar Drive → VPS:
```bash
# Na VPS remota
rclone sync gdrive:TotumClaw-Backups /backups/totum-claw/
```

---

## 🚨 Segurança

### Criptografia (Opcional)

Para proteger o SQLite com senha:
```bash
# Antes de enviar para nuvem
gpg --symmetric --cipher-algo AES256 data/totum_claw.db
# Envia o .gpg
```

### O Que NUNCA Enviar
- ❌ `.env` ou arquivos de segredos
- ❌ `auth-profiles.json` (tokens OAuth)
- ❌ Chaves SSH privadas
- ❌ Senhas em texto

O `totum-sync` já exclui esses automaticamente!

---

## 🎯 Próximos Passos

1. **Escolha sua nuvem:**
   - [ ] Google Drive
   - [ ] VPS Remota
   - [ ] Ambas

2. **Execute:**
   ```bash
   ./totum-sync setup
   ```

3. **Teste:**
   ```bash
   ./totum-sync test
   ./totum-sync push
   ```

4. **Ative automático:**
   ```bash
   ./totum-sync cron
   ```

**Qual você prefere?** Me diz que vamos configurar agora! 🔧
