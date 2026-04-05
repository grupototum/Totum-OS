# 🐳 PLANO MIGRAÇÃO STARK - COM DOCKER
> Docker para novos serviços + Evolution existente (separados)

**Decisão:** Usar Docker para todos os novos serviços ✅  
**Benefícios:** Isolamento, fácil backup, padronizado  
**Evolution:** Continua no container dele (intacto)

---

## 📋 ARQUITETURA COM DOCKER

```
STARK VPS
├── Docker Network: evolution_net (existe)
├── Docker Network: upixel_net (novo)
├── Docker Network: totum_net (novo)
└── Docker Network: apps_net (novo)

Nginx (container ou nativo)
├── Port 80/443 → Reverse Proxy
│   ├── /evo → evolution:8080 (EXISTENTE)
│   ├── /upixel → upixel:3000 (NOVO)
│   ├── /totum → totum:3000 (NOVO)
│   └── /apps → apps:3000 (NOVO)
```

---

## 🗂️ ESTRUTURA DE PASTAS

```bash
/opt/
├── evolution/                    # JÁ EXISTE - NÃO TOCAR
│   └── docker-compose.yml
│
├── upixel/                       # NOVO
│   ├── docker-compose.yml
│   ├── app/                     # Código
│   ├── data/                    # Dados persistentes
│   └── logs/                    # Logs
│
├── totum-system/                 # NOVO
│   ├── docker-compose.yml
│   ├── app/
│   ├── data/
│   └── logs/
│
└── apps-totum/                   # NOVO
    ├── docker-compose.yml
    ├── app/
    ├── data/
    └── logs/
```

---

## 🔧 PASSO A PASSO

### PASSO 1: Verificar Estado Atual

```bash
# Ver containers existentes
docker ps -a

# Ver networks
docker network ls

# Ver volumes
docker volume ls

# Ver portas em uso
sudo netstat -tulpn | grep -E ":(80|443|3000|8080)"
```

---

### PASSO 2: Docker Compose Upixel

**Arquivo:** `/opt/upixel/docker-compose.yml`

```yaml
version: '3.8'

services:
  upixel:
    image: node:20-alpine
    container_name: upixel-app
    working_dir: /app
    volumes:
      - ./app:/app
      - ./logs:/logs
      - /app/node_modules  # Persiste node_modules
    ports:
      - "3001:3000"  # Host:3001 → Container:3000
    environment:
      - NODE_ENV=production
      - PORT=3000
    command: sh -c "npm install && npm start"
    restart: unless-stopped
    networks:
      - upixel_net

  # Opcional: Banco próprio do Upixel
  # upixel-db:
  #   image: postgres:15-alpine
  #   container_name: upixel-db
  #   environment:
  #     POSTGRES_DB: upixel
  #     POSTGRES_USER: upixel
  #     POSTGRES_PASSWORD: ${DB_PASSWORD}
  #   volumes:
  #     - ./data/postgres:/var/lib/postgresql/data
  #   networks:
  #     - upixel_net

networks:
  upixel_net:
    driver: bridge
```

**Deploy:**
```bash
mkdir -p /opt/upixel/{app,logs,data}
cd /opt/upixel

# Clonar código
git clone https://github.com/grupototum/upixelcrm.git app/

# Subir container
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

### PASSO 3: Docker Compose Totum System

**Arquivo:** `/opt/totum-system/docker-compose.yml`

```yaml
version: '3.8'

services:
  totum:
    image: node:20-alpine
    container_name: totum-system
    working_dir: /app
    volumes:
      - ./app:/app
      - ./logs:/logs
      - /app/node_modules
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    command: sh -c "npm install && npm run build && npm run preview"
    restart: unless-stopped
    networks:
      - totum_net

networks:
  totum_net:
    driver: bridge
```

**Deploy:**
```bash
mkdir -p /opt/totum-system/{app,logs}
cd /opt/totum-system

# Clonar
git clone https://github.com/grupototum/totum-system.git app/

# Criar .env
cat > .env << EOF
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-aqui
EOF

# Subir
docker-compose up -d
```

---

### PASSO 4: Docker Compose Apps Totum

**Arquivo:** `/opt/apps-totum/docker-compose.yml`

```yaml
version: '3.8'

services:
  apps-totum:
    image: node:20-alpine
    container_name: apps-totum
    working_dir: /app
    volumes:
      - ./app:/app
      - ./logs:/logs
      - /app/node_modules
    ports:
      - "3003:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    command: sh -c "npm install && npm run build && npm run preview"
    restart: unless-stopped
    networks:
      - apps_net

networks:
  apps_net:
    driver: bridge
```

**Deploy:**
```bash
mkdir -p /opt/apps-totum/{app,logs}
cd /opt/apps-totum

# Clonar
git clone https://github.com/grupototum/Apps_totum_Oficial.git app/

# Subir
docker-compose up -d
```

---

### PASSO 5: Nginx Reverse Proxy

**Opção A:** Nginx nativo no host
**Opção B:** Nginx em Docker (recomendado)

**Opção B - Docker Nginx:**

```bash
mkdir -p /opt/nginx/{conf,ssl,logs}
cd /opt/nginx
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./conf:/etc/nginx/conf.d
      - ./ssl:/etc/nginx/ssl
      - ./logs:/var/log/nginx
    restart: unless-stopped
    networks:
      - evolution_net
      - upixel_net
      - totum_net
      - apps_net
    depends_on:
      - upixel
      - totum
      - apps

networks:
  evolution_net:
    external: true  # Já existe
  upixel_net:
    external: true
  totum_net:
    external: true
  apps_net:
    external: true
```

**conf/default.conf:**
```nginx
# Evolution API (EXISTENTE)
location /evo/ {
    proxy_pass http://evolution:8080/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Upixel
location /upixel/ {
    proxy_pass http://upixel:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Totum System
location /totum/ {
    proxy_pass http://totum:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Apps Totum
location /apps/ {
    proxy_pass http://apps:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 📊 COMANDOS ÚTEIS

### Ver todos os containers:
```bash
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Logs:
```bash
# Upixel
docker logs -f upixel-app

# Totum
docker logs -f totum-system

# Apps
docker logs -f apps-totum

# Nginx
docker logs -f nginx-proxy
```

### Restart:
```bash
cd /opt/upixel && docker-compose restart
cd /opt/totum-system && docker-compose restart
cd /opt/apps-totum && docker-compose restart
```

### Atualizar (deploy novo):
```bash
cd /opt/upixel/app
git pull
cd /opt/upixel
docker-compose up -d --build
```

### Backup:
```bash
# Backup volumes
docker run --rm -v upixel_data:/data -v $(pwd):/backup alpine tar czf /backup/upixel-backup.tar.gz /data
```

---

## 🔐 SEGURANÇA

### Firewall (UFW):
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp   # SSH
# Não liberar 3001, 3002, 3003 (só localhost/nginx)
```

### SSL (Let's Encrypt):
```bash
# Usar certbot no host ou nginx-proxy com companion
docker run -d \
  --name nginx-proxy-acme \
  --volumes-from nginx-proxy \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  nginxproxy/acme-companion
```

---

## 🚀 CRONOGRAMA COM DOCKER

### Dia 1 (2-3 horas):
```bash
✅ Verificar containers existentes
✅ Criar estrutura de pastas
✅ Docker Compose Upixel
✅ Testar Upixel
```

### Dia 2 (3-4 horas):
```bash
✅ Docker Compose Totum System
✅ Configurar Supabase
✅ Testar Totum
✅ DNS apontando
```

### Dia 3 (4-6 horas):
```bash
✅ Docker Compose Apps Totum
✅ Configurar agentes
✅ Integrações (n8n, Kommo)
✅ Testes finais
```

### Dia 4 (2 horas):
```bash
✅ Configurar Nginx reverse proxy
✅ SSL Let's Encrypt
✅ Monitoramento
```

---

## ⚠️ ROLLBACK

### Parar tudo (exceto Evolution):
```bash
cd /opt/upixel && docker-compose down
cd /opt/totum-system && docker-compose down
cd /opt/apps-totum && docker-compose down
cd /opt/nginx && docker-compose down
```

### Evolution continua intacto:
```bash
docker ps | grep evolution  # Verificar
```

---

## 📝 CHECKLIST

- [ ] Verificar containers existentes
- [ ] Criar pasta /opt/upixel
- [ ] Criar docker-compose.yml Upixel
- [ ] Clonar repositório Upixel
- [ ] Subir container Upixel
- [ ] Criar pasta /opt/totum-system
- [ ] Criar docker-compose.yml Totum
- [ ] Clonar repositório Totum
- [ ] Configurar Supabase
- [ ] Subir container Totum
- [ ] Criar pasta /opt/apps-totum
- [ ] Criar docker-compose.yml Apps
- [ ] Clonar repositório Apps
- [ ] Subir container Apps
- [ ] Configurar Nginx
- [ ] SSL Let's Encrypt
- [ ] Testar tudo

---

*Documento atualizado: 2026-04-01*  
*Evolution protegido em container separado*
