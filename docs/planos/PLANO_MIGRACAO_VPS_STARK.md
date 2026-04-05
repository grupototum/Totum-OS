# 🖥️ PLANO MIGRAÇÃO VPS - STARK
> Guia completo para configurar o novo VPS Stark

---

## 📋 PRÉ-REQUISITOS

**Antes de começar, tenha:**
- [ ] Acesso SSH ao VPS Stark (IP, usuário, senha/chave)
- [ ] Acesso ao VPS atual (para backup)
- [ ] GitHub repo clonado localmente
- [ ] Credenciais do Supabase

---

## 🚀 CHECKLIST DE CONFIGURAÇÃO

### ETAPA 1: Acesso Inicial (5 min)

```bash
# Conectar ao VPS Stark
ssh root@IP_DO_STARK

# Atualizar sistema
apt update && apt upgrade -y

# Instalar ferramentas básicas
apt install -y curl wget git vim htop nginx certbot python3-certbot-nginx
```

---

### ETAPA 2: Instalar Docker (5 min)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
apt install -y docker-compose-plugin

# Verificar instalação
docker --version
docker compose version

# Adicionar usuário ao grupo docker
usermod -aG docker $USER
```

---

### ETAPA 3: Configurar Firewall (3 min)

```bash
# Instalar UFW
apt install -y ufw

# Configurar regras
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Habilitar
ufw enable
```

---

### ETAPA 4: Clonar Repositório (2 min)

```bash
# Criar diretório
mkdir -p /opt/totum
cd /opt/totum

# Clonar repo
git clone https://github.com/grupototum/Apps_totum_Oficial.git .

# Instalar dependências (para teste local)
npm install
```

---

### ETAPA 5: Configurar Nginx (10 min)

```bash
# Criar configuração
nano /etc/nginx/sites-available/totum
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.COM;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
ln -s /etc/nginx/sites-available/totum /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### ETAPA 6: SSL (Let's Encrypt) (5 min)

```bash
# Gerar certificado
certbot --nginx -d SEU_DOMINIO.COM

# Verificar renovação automática
certbot renew --dry-run
```

---

### ETAPA 7: PM2 (Process Manager) (5 min)

```bash
# Instalar PM2
npm install -g pm2

# Criar ecosystem file
nano /opt/totum/ecosystem.config.js
```

**Conteúdo:**
```javascript
module.exports = {
  apps: [{
    name: 'totum-apps',
    script: 'npm',
    args: 'run preview',
    cwd: '/opt/totum',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5173
    },
    error_file: '/var/log/totum/err.log',
    out_file: '/var/log/totum/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

```bash
# Criar diretório de logs
mkdir -p /var/log/totum

# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### ETAPA 8: Variáveis de Ambiente (3 min)

```bash
# Criar .env
nano /opt/totum/.env
```

**Adicionar:**
```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Outras variáveis
NODE_ENV=production
```

---

### ETAPA 9: Build da Aplicação (5 min)

```bash
cd /opt/totum

# Build
npm run build

# Verificar se build foi bem sucedido
ls -la dist/
```

---

### ETAPA 10: Testar (5 min)

```bash
# Verificar se está rodando
pm2 status
curl http://localhost:5173

# Ver logs
pm2 logs
```

---

## 🔄 MIGRAÇÃO DE DADOS (se necessário)

### Se tiver dados no VPS antigo:

```bash
# No VPS antigo - criar backup
tar -czf totum_backup_$(date +%Y%m%d).tar.gz /opt/totum/

# Transferir para Stark
scp totum_backup_*.tar.gz root@IP_DO_STARK:/opt/

# No Stark - restaurar
cd /opt
tar -xzf totum_backup_*.tar.gz
```

---

## 📊 MONITORAMENTO

### Instalar monitoramento básico:

```bash
# htop (já instalado)
htop

# Para monitoramento avançado, considerar:
# - Netdata
# - Prometheus + Grafana
```

---

## 🔄 DEPLOY AUTOMÁTICO (GitHub Actions)

### Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Stark

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Stark
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.STARK_HOST }}
        username: root
        key: ${{ secrets.STARK_SSH_KEY }}
        script: |
          cd /opt/totum
          git pull
          npm install
          npm run build
          pm2 restart totum-apps
```

### Adicionar secrets no GitHub:
- `STARK_HOST` = IP do VPS
- `STARK_SSH_KEY` = Chave SSH privada

---

## ✅ VERIFICAÇÃO FINAL

Após configurar, verifique:

- [ ] Site acessível via HTTP
- [ ] Site acessível via HTTPS (SSL)
- [ ] PM2 rodando (`pm2 status`)
- [ ] Nginx configurado (`nginx -t`)
- [ ] Firewall ativo (`ufw status`)
- [ ] Logs sendo gerados (`/var/log/totum/`)
- [ ] Deploy automático funcionando

---

## 🆘 TROUBLESHOOTING

### Site não carrega:
```bash
# Verificar Nginx
systemctl status nginx
nginx -t

# Verificar PM2
pm2 logs

# Verificar porta
netstat -tulpn | grep 5173
```

### SSL não funciona:
```bash
# Verificar certificado
certbot certificates

# Renovar manualmente
certbot renew
```

### Permissões:
```bash
# Corrigir permissões
chown -R www-data:www-data /opt/totum
chmod -R 755 /opt/totum
```

---

## 📞 PRÓXIMOS PASSOS

Após configurar o VPS:
1. [ ] Criar issues no GitHub (usar arquivo GITHUB_ISSUES_APPS_TOTUM.md)
2. [ ] Configurar GitHub Actions
3. [ ] Testar deploy automático
4. [ ] Configurar agentes no Supabase
5. [ ] Implementar integrações (n8n, Kommo)

---

*Tempo estimado de configuração: 30-45 minutos*
*Criado em: 2026-04-01*
