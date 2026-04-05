# 🔑 ACESSO RÁPIDO - ALIBABA CLOUD TOTUM

> Guia rápido de acesso ao servidor - Mantenha este arquivo seguro!

---

## 🚀 ACESSO SSH (FUNCIONANDO)

### Comando de Conexão
```bash
ssh root@<IP_PUBLICO_ALIBABA>
```

### Verificar IP Público Atual
```bash
# No servidor, executar:
curl -s ifconfig.me
# ou
curl -s ipinfo.io/ip
```

### Chave SSH
- **Local servidor:** `~/.ssh/authorized_keys`
- **Fingerprint:** `SHA256:DgxpbMGizSDZoDawUtc5gJHu3pgc0bzC9/HJvrMrva+ZThI9X6XNJkt5fd9ZTNih+tkMVntrtgEDz/JBpwS41iDSgAab/1Sx9wERsQharkdHisGdkoxszPWnBm+U0jn0GeKaJkSwFpN0/n8XYspzSFxkG9HHmrR3YHgR0sq8J2AmRLABpzfDCJZyiNfcjFoQ6Puppk+0QeACnS/fdqLl++qYroQWmNIkTf3R9Nk+hKEbhdHxCwphlbxK9NmSb0qz5FxNPAhGYgqGdF8bkjK7jVaKy9UivaZBrehWUv8G9gSNQElYwhkwUl21bAZdU6Eo5yA4GhVsMoFlRTg5gmddLh`

---

## 🌐 CONSOLE ALIBABA CLOUD

### URL de Acesso
https://www.alibabacloud.com/

### Credenciais (Preencher)
```yaml
Email: _______________________________
Senha: _______________________________
2FA:   _______________________________
```

### ID da Instância
```
iZt4nikbefyhl6jyuczexzZ
```

---

## 📊 STATUS DOS APPS

### Comandos Rápidos
```bash
# Ver todos os serviços
pm2 list

# Status completo
totum-status

# Logs de um app específico
totum-logs upixel

# Monitoramento em tempo real
pm2 monit
```

### URLs de Acesso (Quando Configurado)
| App | URL Local | URL Pública (Futura) |
|-----|-----------|---------------------|
| upixel | http://localhost:4173 | https://app.grupototum.com |
| totum | http://localhost:4174 | https://totum.grupototum.com |
| apps-totum | http://localhost:4175 | https://apps.grupototum.com |
| stark-api | http://localhost:3000 | https://api.grupototum.com |

---

## 🛠️ COMANDOS ÚTEIS

### Sistema
```bash
# Uptime e carga
echo "Hostname: $(hostname)" && echo "IP Interno: $(hostname -I)" && echo "IP Público: $(curl -s ifconfig.me)" && uptime

# Uso de recursos
free -h && df -h

# Processos
ps aux --sort=-%mem | head -20
```

### Apps Totum
```bash
# Restart de todos os apps
pm2 restart all

# Parar todos
pm2 stop all

# Iniciar todos
pm2 start all

# Salvar configuração
pm2 save
```

### Monitoramento
```bash
# Ver logs do Sentinela
tail -f /var/log/sentinela-monitor.log

# Ver alertas recentes
cat /tmp/sentinela-alerts.txt
```

---

## 🔧 CONFIGURAÇÃO CLOUDFLARE TUNNEL (A FAZER)

### Instalação Rápida
```bash
# 1. Instalar
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# 2. Login
cloudflared tunnel login

# 3. Criar tunnel
cloudflared tunnel create totum-apps

# 4. Configurar DNS
cloudflared tunnel route dns totum-apps grupototum.com

# 5. Instalar serviço
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared
```

---

## ⚠️ NOTAS IMPORTANTES

1. **IP Público varia** - Usar Cloudflare Tunnel para acesso estável
2. **Acesso SSH** - Funcionando com chave pública
3. **Apps** - Todos rodando em PM2 (auto-restart)
4. **Monitoramento** - Sentinela verifica a cada 2 minutos
5. **Segurança** - Nunca compartilhar chaves privadas

---

## 📞 SUPORTE

- **Alibaba Cloud:** https://www.alibabacloud.com/support
- **Cloudflare:** https://dash.cloudflare.com
- **Documentação Completa:** `/root/.openclaw/workspace/docs/ALIBABA_CLOUD_ACCESS.md`

---

**Última atualização:** 2026-04-05  
**Servidor:** iZt4nikbefyhl6jyuczexzZ  
**Status:** ✅ Operacional
