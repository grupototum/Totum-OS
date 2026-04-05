# ☁️ Configuração de Nuvem - Totum Sync

## ✅ O Que Já Está Funcionando

### Backup Local (ATIVO)
```
./totum-sync push    # Cria backup local + Git commit
./totum-sync status  # Ver status
```

**Último backup:** 2026-03-31 09:16:01
**Tamanho:** 16KB
**Git commits:** 1 (root-commit)

---

## 🔗 Opção 1: GitHub (RECOMENDADO - Grátis)

### Passo 1: Criar Repo no GitHub
1. Acesse https://github.com/new
2. Nome do repo: `totum-claw-backup`
3. **Private** (importante!)
4. Não inicialize com README
5. Clique em "Create repository"

### Passo 2: Configurar SSH Key (se não tiver)
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "totum@claw.local"
cat ~/.ssh/id_ed25519.pub
# Copie essa chave e adicione em: GitHub → Settings → SSH Keys
```

### Passo 3: Configurar Totum Sync
```bash
cd /root/.openclaw/workspace
./totum-sync setup
# Escolha: GitHub
# Cole a URL: git@github.com:SEU_USUARIO/totum-claw-backup.git
```

### Passo 4: Primeiro Push
```bash
./totum-sync push
# Envia tudo para o GitHub!
```

---

## 🔗 Opção 2: AWS S3 (Pago - $0.50/mês)

### Requisitos
- Conta AWS
- AWS CLI instalado

### Configuração
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Configurar credenciais
aws configure
# Cole seu Access Key ID e Secret Key

# Criar bucket
aws s3 mb s3://totum-claw-backup-$(date +%s)

# Configurar Totum Sync
./totum-sync setup
# Escolha: S3
# Digite o nome do bucket
```

---

## 🔄 Backup Automático (Cron)

### Ativar
```bash
./totum-sync cron
```
Isso configura backup automático a cada 6 horas.

### Verificar
```bash
crontab -l | grep totum
```

### Desativar
```bash
./totum-sync uncron
```

---

## 📋 Comandos Disponíveis

| Comando | Função |
|---------|--------|
| `./totum-sync push` | Backup + commit + sync nuvem |
| `./totum-sync pull` | Baixa dados da nuvem |
| `./totum-sync status` | Mostra status do sistema |
| `./totum-sync setup` | Configuração interativa |
| `./totum-sync cron` | Ativa backup automático |
| `./totum-sync uncron` | Desativa backup automático |

---

## 🛡️ O Que é Backupado

✅ **Banco de dados SQLite** (`data/totum_claw.db`)
✅ **Scripts** (`scripts/`)
✅ **Documentação** (`*.md`)
✅ **Configurações** (`.totum-sync.conf`)
✅ **Logs** (`logs/`)

❌ **NÃO inclui:**
- Senhas/tokens de API
- Arquivos temporários
- Backups antigos (mais de 30 dias)

---

## 💡 Dica Pro

Adicione ao seu `HEARTBEAT.md`:
```markdown
- [ ] Verificar se backup automático está rodando
  Comando: ./totum-sync status
```

Assim eu verifico periodicamente se tudo está seguro! 🔒
