# 🖥️ PLANO MIGRAÇÃO STARK - SEM DOCKER
> Respeitando Evolution API rodando (não tocar em Docker!)

**Restrição:** Evolution API no Docker = INVIOLÁVEL ❌🐳  
**Solução:** Novos sistemas rodando com PM2 + Nginx nativo ✅

---

## 📋 ARQUITETURA PROPOSTA

```
STARK VPS
├── Port 443 → Nginx (reverse proxy)
│   ├── /evo → Evolution API (Docker - NÃO TOCAR)
│   ├── /upixel → Upixel (PM2 - NOVO)
│   ├── /totum → Totum System (PM2 - MIGRAR)
│   └── /apps → Apps Totum (PM2 - NOVO)
│
├── Docker (Evolution only)
│   └── evolution-api:latest (preservado)
│
└── PM2 (novos serviços)
    ├── upixel (porta 3001)
    ├── totum-system (porta 3002)
    └── apps-totum (porta 3003)
```

---

## 🎯 CHECKLIST SEM DOCKER

### ✅ O que já existe (NÃO MEXER):
- [ ] Evolution API container
- [ ] Docker daemon
- [ ] Portas do Evolution
- [ ] Volumes do Evolution

### 🆕 O que vamos adicionar (SEM DOCKER):
- [ ] Node.js nativo
- [ ] PM2 global
- [ ] Nginx (se não existir)
- [ ] Apps rodando direto no sistema

---

## 📁 ESTRUTURA DE PASTAS

```bash
/opt/
├── evolution/           # JÁ EXISTE - NÃO TOCAR
│   └── docker-compose.yml
│
├── upixel/             # NOVO
│   ├── app/           # Código
│   ├── logs/          # Logs PM2
│   └── ecosystem.config.js
│
├── totum-system/       # MIGRAR
│   ├── app/
│   ├── logs/
│   └── ecosystem.config.js
│
└── apps-totum/         # NOVO
    ├── app/
    ├── logs/
    └── ecosystem.config.js
```

---

## 🔧 INSTALAÇÃO SEM DOCKER

### 1. Verificar o que já existe (NÃO alterar)

```bash
# Só olhar, não mudar:
docker ps                    # Ver containers
docker-compose ps           # Ver compose
netstat -tulpn | grep :80   # Ver portas em uso
netstat -tulpn | grep :443  # Ver portas em uso
cat /etc/nginx/nginx.conf   # Ver nginx config
```

---

### 2. Instalar dependências (se não existir)

```bash
# Node.js 20+ (se não tiver)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 global (se não tiver)
sudo npm install -g pm2

# Nginx (se não tiver)
sudo apt install -y nginx
```

---

### 3. Configurar Nginx (Adicionar rotas)

**ARQUIVO:** `/etc/nginx/sites-available/default` ou novo

```nginx
# Evolution API (EXISTENTE - manter)
location /evo/ {
    proxy_pass http://localhost:8080/;  # porta do Evolution
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# UPÍXEL (novo)
location /upixel/ {
    proxy_pass http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# TOTUM SYSTEM (novo)
location /totum/ {
    proxy_pass http://localhost:3002/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# APPS TOTUM (novo)
location /apps/ {
    proxy_pass http://localhost:3003/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Testar config:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Configurar Upixel (PM2)

```bash
# Criar pasta
mkdir -p /opt/upixel/app /opt/upixel/logs
cd /opt/upixel/app

# Clonar repositório
git clone https://github.com/grupototum/upixelcrm.git .

# Instalar dependências
npm install

# Build (se necessário)
npm run build

# Criar config PM2
nano /opt/upixel/ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'upixel',
    script: 'npm',
    args: 'start',  // ou 'run preview', 'run start:prod', etc
    cwd: '/opt/upixel/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/opt/upixel/logs/err.log',
    out_file: '/opt/upixel/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

**Iniciar:**
```bash
cd /opt/upixel
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Gerar comando para iniciar com sistema
```

---

### 5. Configurar Totum System (PM2)

Mesmo processo, mas na pasta `/opt/totum-system/`

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'totum-system',
    script: 'npm',
    args: 'run preview',  // ou comando de start
    cwd: '/opt/totum-system/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      // Variáveis Supabase
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: ''
    },
    error_file: '/opt/totum-system/logs/err.log',
    out_file: '/opt/totum-system/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

---

### 6. Configurar Apps Totum (PM2)

Pasta: `/opt/apps-totum/`  
Porta: `3003`

Mesma estrutura dos anteriores.

---

## 🔐 SEGURANÇA - SEM DOCKER

### Firewall (UFW)
```bash
# Liberar apenas portas necessárias
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# BLOQUEAR portas dos apps (só nginx acessa)
# Não precisa liberar 3001, 3002, 3003 (localhost only)

sudo ufw enable
```

### PM2 + SSL
```bash
# Certbot para SSL
sudo apt install certbot python3-certbot-nginx

# Gerar certificado (domínios)
sudo certbot --nginx -d upixel.app -d totum.seudominio.com -d apps.seudominio.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## 📊 MONITORAMENTO (PM2)

### Comandos úteis:
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs upixel
pm2 logs totum-system
pm2 logs apps-totum

# Monitor em tempo real
pm2 monit

# Restart
pm2 restart upixel

# Parar (se necessário)
pm2 stop upixel
```

### Dashboard web (opcional):
```bash
pm2 plus  # Versão paga com dashboard
# ou
# Criar script próprio de monitoramento
```

---

## ⚡ CRONOGRAMA AJUSTADO (SEM DOCKER)

### Fase 1: Preparação (1-2h)
```bash
✅ Verificar o que existe (sem mudar)
✅ Instalar Node.js + PM2 (se não tiver)
✅ Configurar Nginx rotas
✅ Testar nginx reload
```

### Fase 2: Upixel (4-6h)
```bash
✅ Clonar repo
✅ npm install
✅ Configurar .env
✅ Criar ecosystem.config.js
✅ pm2 start
✅ Testar acesso
```

### Fase 3: Totum System (6-8h)
```bash
✅ Backup atual
✅ Clonar/copiar para Stark
✅ Configurar variáveis Supabase
✅ Criar ecosystem.config.js
✅ pm2 start
✅ Testar todas as funcionalidades
✅ DNS cutover (apontar domínio)
```

### Fase 4: Apps Totum (8-12h)
```bash
✅ Clonar repo
✅ Configurar tabelas Supabase
✅ Criar Edge Functions (se necessário)
✅ Configurar agentes
✅ Criar ecosystem.config.js
✅ pm2 start
✅ Testar integrações
```

---

## 🚨 ROLLBACK (SE DER RUIM)

### Parar um serviço:
```bash
pm2 stop upixel
pm2 delete upixel
# Remover rota do nginx
sudo nano /etc/nginx/sites-available/default
# (comentar location /upixel)
sudo nginx -t && sudo systemctl reload nginx
```

### Evolution NUNCA é afetado:
```bash
# Evolution continua rodando em docker
docker ps  # verificar
```

---

## ✅ CHECKLIST ANTES DE COMEÇAR

- [ ] Backup do Evolution (só por segurança)
- [ ] Verificar espaço em disco (`df -h`)
- [ ] Verificar memória (`free -h`)
- [ ] Anotar porta que Evolution usa
- [ ] Confirmar domínios disponíveis
- [ ] Ter acesso SSH funcionando
- [ ] Node.js instalado?
- [ ] PM2 instalado?
- [ ] Nginx instalado?

---

## 💡 VANTAGENS DO PM2 (vs Docker)

| Aspecto | PM2 | Docker |
|---------|-----|--------|
| Memória RAM | Menor (~30% menos) | Maior |
| Velocidade | Mais rápido | Overhead de container |
| Complexidade | Simples | Mais complexo |
| Logs | Fácil acesso | Precisa comandos docker |
| Restart automático | ✅ Sim | ✅ Sim |
| Cluster mode | ✅ Sim | ⚠️ Complicado |

---

## 📝 RESUMO

| Sistema | Método | Porta | Path |
|---------|--------|-------|------|
| Evolution | Docker (existe) | 8080 | /evo |
| Upixel | PM2 (novo) | 3001 | /upixel |
| Totum System | PM2 (novo) | 3002 | /totum |
| Apps Totum | PM2 (novo) | 3003 | /apps |

**Evolution:** Protegido, não mexe 🛡️  
**Novos:** PM2 nativo, leve e rápido 🚀

---

*Documento criado: 2026-04-01*  
*Regra: Docker do Evolution = INVIOLÁVEL*
