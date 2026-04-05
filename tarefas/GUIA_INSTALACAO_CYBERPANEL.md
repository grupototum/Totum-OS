# 🚀 GUIA DE INSTALAÇÃO - CYBERPANEL

**Data:** 2026-04-03  
**Versão:** 1.0  
**Responsável:** Israel (com suporte TOT)

---

## 📋 PRÉ-REQUISITOS

- VPS com Ubuntu 20.04/22.04 ou CentOS 7/8
- Mínimo 1GB RAM (recomendado 2GB+)
- 10GB+ espaço em disco
- Acesso root ao servidor

---

## 🔧 OPÇÃO 1: INSTALAÇÃO AUTOMÁTICA (RECOMENDADA)

### Passo 1: Acessar VPS via SSH
```bash
ssh root@187.127.4.140
```

### Passo 2: Baixar e executar instalador
```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar CyberPanel
wget -O installer.sh https://cyberpanel.net/install.sh
chmod +x installer.sh
./installer.sh
```

### Passo 3: Opções de instalação
Durante a instalação, você verá prompts:

```
CyberPanel Installer v2.3

1. Install CyberPanel with OpenLiteSpeed.
2. Install CyberPanel with LiteSpeed Enterprise.
3. Exit.

Please enter the number[1-3]: 1
```
**Resposta:** `1` (OpenLiteSpeed - gratuito)

```
Install Full service for CyberPanel? [Y/n]: Y
```
**Resposta:** `Y`

```
Do you want to setup Remote MySQL? [y/N]: N
```
**Resposta:** `N` (usa MySQL local)

```
Please choose to use default admin password 1234567
1. Yes
2. No
```
**Resposta:** `2` (definir senha própria)

```
Please enter your password: [DIGITE_SENHA_FORTE]
```

### Passo 4: Aguardar instalação
- Tempo estimado: **15-30 minutos**
- O script instala automaticamente:
  - OpenLiteSpeed
  - MySQL/MariaDB
  - CyberPanel
  - Postfix (email)
  - Pure-FTPd
  - Bind DNS

### Passo 5: Anotar informações importantes
Ao final, o instalador mostra:
```
CyberPanel Successfully Installed

Panel URL: https://187.127.4.140:8090
Username: admin
Password: [sua_senha]
MySQL Password: [senha_mysql]
```

**SALVE ISSO EM UM LUGAR SEGURO!**

---

## 🌐 OPÇÃO 2: INSTALAÇÃO VIA HOSTINGER (MAIS FÁCIL)

Se preferir fazer pela interface Hostinger:

### Passo 1: Acessar hPanel
1. Login em https://hpanel.hostinger.com

### Passo 2: Navegar até VPS
1. Menu → VPS → [Seu VPS Stark]

### Passo 3: Change OS Template
1. Botão "Change OS"
2. Selecionar: **Ubuntu 22.04 with CyberPanel**
3. Confirmar (isso apaga tudo no VPS!)
4. Aguardar 5-10 minutos

### Passo 4: Acessar CyberPanel
1. URL: `https://187.127.4.140:8090`
2. Username: `admin`
3. Senha: `hostinger` (padrão, alterar depois)

---

## ⚙️ CONFIGURAÇÃO INICIAL

### 1. Alterar senha padrão
```
CyberPanel → Users → Modify User → admin
Nova senha: [senha_forte_unica]
```

### 2. Configurar hostname
```
Server → Hostname
Novo hostname: stark.grupototum.com
```

### 3. Configurar SSL grátis (Let's Encrypt)
```
SSL → Hostname SSL
Selecionar: stark.grupototum.com
```

### 4. Criar primeiro website
```
Websites → Create Website
- Package: Default
- Owner: admin
- Domain: grupototum.com
- Email: seu@email.com
- PHP: 8.1 ou 8.2
- SSL: ✓ Marcar
```

---

## 🔒 SEGURANÇA ESSENCIAL

### 1. Alterar porta do painel (opcional mas recomendado)
```bash
# SSH no servidor
nano /usr/local/lsws/conf/httpd_config.conf

# Alterar linha:
# De: address *:8090
# Para: address *:8443

# Reiniciar
systemctl restart lsws
```

### 2. Configurar firewall
```
Security → Firewall
- Porta 8090: Apenas seu IP
- Porta 22 (SSH): Apenas seu IP
- Portas 80/443: Todas
```

### 3. Ativar 2FA
```
Users → Two Factor Authentication
```

---

## 📧 CONFIGURAR EMAIL (Opcional)

### Criar email profissional:
```
Email → Create Email
- Domain: grupototum.com
- Email: contato@grupototum.com
- Senha: [senha]
```

### Configurar Webmail:
- Acesso: `https://stark.grupototum.com:8090/snappymail`

---

## 🐳 INTEGRAÇÃO COM DOCKER (IMPORTANTE!)

Se você já tem Docker rodando apps:

### Opção 1: CyberPanel gerencia sites, Docker apps separados
```
CyberPanel: Portas 80/443 (sites)
Docker Apps: Portas 3000, 5000, 5678, etc.
```

### Opção 2: CyberPanel como reverse proxy para Docker
```
Websites → Create Website → Reverse Proxy
- Domain: app.grupototum.com
- Destination: http://localhost:3000
```

---

## ✅ CHECKLIST PÓS-INSTALAÇÃO

- [ ] Instalação concluída sem erros
- [ ] Acesso ao painel funcionando
- [ ] Senha admin alterada
- [ ] Hostname configurado
- [ ] SSL ativado
- [ ] Primeiro website criado
- [ ] Backup automático configurado
- [ ] Firewall configurado
- [ ] 2FA ativado
- [ ] Senhas salvas no Vaultwarden

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### Erro: "Port 8090 already in use"
```bash
# Verificar o que usa a porta
netstat -tlnp | grep 8090

# Matar processo ou alterar porta CyberPanel
```

### Erro: "MySQL connection failed"
```bash
# Reiniciar MySQL
systemctl restart mysql

# Verificar status
systemctl status mysql
```

### Resetar senha admin
```bash
# SSH no servidor
cd /usr/local/CyberCP
python3 manage.py changepassword admin
```

---

## 📞 SUPORTE

- **Documentação:** https://docs.cyberpanel.net
- **Fórum:** https://community.cyberpanel.net
- **Discord:** CyberPanel Community

---

*Guia criado por: TOT*  
*Revisado em: 2026-04-03*  
*Próxima revisão: Após instalação*