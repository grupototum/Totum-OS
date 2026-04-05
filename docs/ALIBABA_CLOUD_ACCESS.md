# ☁️ ACESSO ALIBABA CLOUD - TOTUM

> Documentação de acesso ao servidor na Alibaba Cloud  
> Criado: 2026-04-05  
> Responsável: TOT (Totum Operative Technology)

---

## 🎯 SUMÁRIO EXECUTIVO

| Item | Status | Detalhes |
|------|--------|----------|
| **Acesso SSH** | ✅ Funcionando | Via chave pública configurada |
| **Console Web** | ⚠️ Necessita configuração | Acesso via Alibaba Cloud Console |
| **Apps Totum** | ✅ Funcionando | Portas 4173-4175 ativas |
| **Monitoramento** | ✅ Ativo | Sentinela + PM2 configurados |

---

## 🖥️ SERVIDOR ALIBABA CLOUD

### Especificações Técnicas
```
Hostname:     iZt4nikbefyhl6jyuczexzZ
IP Interno:   10.184.5.43
IP Público:   (Variável/NAT - ver nota abaixo)
Região:       China (provavelmente Shanghai ou Hangzhou)
SO:           Ubuntu/Debian Linux
Uptime:       2+ dias (estável)
```

### ⚠️ NOTA IMPORTANTE SOBRE IP
A Alibaba Cloud utiliza **NAT para IPs públicos**, o que significa:
- O IP público pode mudar após reboots
- Acesso externo direto por IP pode ser instável
- **Solução recomendada:** Cloudflare Tunnel (documentado abaixo)

---

## 🔐 ACESSO SSH

### ✅ Status: CONFIGURADO E FUNCIONANDO

#### Chave SSH Configurada
- **Local:** `~/.ssh/authorized_keys`
- **Tipo:** RSA 2048 bits
- **Fingerprint:** `SHA256:DgxpbMGizSDZoDawUtc5gJHu3pgc0bzC9/HJvrMrva+ZThI9X6XNJkt5fd9ZTNih+tkMVntrtgEDz/JBpwS41iDSgAab/1Sx9wERsQharkdHisGdkoxszPWnBm+U0jn0GeKaJkSwFpN0/n8XYspzSFxkG9HHmrR3YHgR0sq8J2AmRLABpzfDCJZyiNfcjFoQ6Puppk+0QeACnS/fdqLl++qYroQWmNIkTf3R9Nk+hKEbhdHxCwphlbxK9NmSb0qz5FxNPAhGYgqGdF8bkjK7jVaKy9UivaZBrehWUv8G9gSNQElYwhkwUl21bAZdU6Eo5yA4GhVsMoFlRTg5gmddLh`

#### Comando de Conexão SSH
```bash
# Acesso padrão (a partir de máquina com chave privada)
ssh root@<IP_PUBLICO_ALIBABA>

# Exemplo (quando IP é conhecido):
# ssh root@47.242.123.45

# Com chave específica (se necessário)
ssh -i ~/.ssh/totum_alibaba root@<IP_PUBLICO>
```

#### O que está instalado
- [x] OpenSSH Server
- [x] Chave pública autorizada
- [x] Acesso root via SSH habilitado

---

## 🌐 CONSOLE WEB ALIBABA CLOUD

### ⚠️ Status: NECESSITA CONFIGURAÇÃO

#### Para Acessar o Console:
1. Acesse: https://www.alibabacloud.com/
2. Faça login com as credenciais da conta
3. Navegue até: **Elastic Compute Service (ECS)**
4. Selecione a instância: `iZt4nikbefyhl6jyuczexzZ`

#### Informações Necessárias
```yaml
Conta Alibaba Cloud:
  - Email: (a ser preenchido pelo Israel)
  - Senha: (a ser preenchido pelo Israel)
  - 2FA: (se habilitado)

Instância ECS:
  - ID: iZt4nikbefyhl6jyuczexzZ
  - Região: (verificar no console)
  - Tipo: (verificar no console)
  - IP Interno: 10.184.5.43
```

#### Ações Disponíveis no Console
- [ ] Start/Stop/Reboot da instância
- [ ] Configurar Security Groups (firewall)
- [ ] Gerenciar IPs elásticos (fixos)
- [ ] Criar snapshots/backup
- [ ] Monitorar métricas (CPU, memória, rede)
- [ ] Console VNC (acesso emergencial)

---

## 🚀 APPS TOTUM - STATUS DOS SERVIÇOS

### Portas e Aplicações

| Aplicação | Porta | Status | Descrição |
|-----------|-------|--------|-----------|
| **upixel** | 4173 | ✅ Ativo | App principal Totum |
| **totum** | 4174 | ✅ Ativo | App secundário |
| **apps-totum** | 4175 | ✅ Ativo | Novo app MEX |
| **stark-api** | 3000 | ✅ Ativo | API backend |
| **totum-backend** | 5000 | ✅ Ativo | Backend principal |
| **codeflow** | 8001 | ✅ Ativo | Serviço CodeFlow |
| **kimi-connector** | 9001 | ✅ Ativo | Conector Kimi AI |

### Comandos de Verificação
```bash
# Verificar todos os serviços PM2
pm2 list

# Ver status completo do sistema
totum-status

# Ver logs em tempo real
totum-logs [nome-do-app]

# Verificar monitoramento Sentinela
tail -f /var/log/sentinela-monitor.log
```

---

## 🔧 SOLUÇÃO RECOMENDADA: CLOUDFLARE TUNNEL

### Por que Cloudflare Tunnel?
- ✅ Não depende de IP fixo
- ✅ Funciona atrás de NAT/firewall
- ✅ SSL automático (HTTPS)
- ✅ Proteção DDoS incluída
- ✅ Domínio personalizado: `grupototum.com`

### Instalação (Passo a Passo)

#### 1. Instalar cloudflared
```bash
# Download e instalação
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Verificar instalação
cloudflared --version
```

#### 2. Autenticar
```bash
# Login (vai gerar um link para autorização)
cloudflared tunnel login

# Copie o link exibido, abra no navegador
# Autorize com sua conta Cloudflare
# O certificado será salvo em ~/.cloudflared/
```

#### 3. Criar Tunnel
```bash
# Criar tunnel nomeado
cloudflared tunnel create totum-apps

# Nota o UUID gerado (será usado na configuração)
```

#### 4. Configurar DNS
```bash
# Configurar rota DNS
cloudflared tunnel route dns totum-apps grupototum.com
cloudflared tunnel route dns totum-apps *.grupototum.com
```

#### 5. Arquivo de Configuração
```bash
# Criar arquivo de configuração
mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: <UUID_DO_TUNNEL>
credentials-file: /root/.cloudflared/<UUID_DO_TUNNEL>.json

ingress:
  # App principal - upixel
  - hostname: app.grupototum.com
    service: http://localhost:4173
  
  # Totum app
  - hostname: totum.grupototum.com
    service: http://localhost:4174
  
  # Apps Totum (MEX)
  - hostname: apps.grupototum.com
    service: http://localhost:4175
  
  # API Stark
  - hostname: api.grupototum.com
    service: http://localhost:3000
  
  # Backend
  - hostname: backend.grupototum.com
    service: http://localhost:5000
  
  # Catch-all (redireciona para app principal)
  - hostname: grupototum.com
    service: http://localhost:4173
  
  # Default (se nada corresponder)
  - service: http_status:404
EOF
```

#### 6. Instalar como Serviço
```bash
# Instalar serviço systemd
cloudflared service install

# Iniciar serviço
systemctl start cloudflared

# Habilitar início automático
systemctl enable cloudflared

# Verificar status
systemctl status cloudflared
```

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Concluído ✅
- [x] Servidor ECS criado na Alibaba Cloud
- [x] Acesso SSH configurado
- [x] Chave pública instalada
- [x] PM2 configurado com todos os apps
- [x] Sentinela de monitoramento ativo
- [x] Scripts de gestão instalados
- [x] Apps rodando nas portas 4173-4175

### Pendente ⚠️
- [ ] Obter credenciais Alibaba Cloud do Israel
- [ ] Configurar IP elástico (opcional)
- [ ] Configurar Security Groups (firewall)
- [ ] Instalar e configurar Cloudflare Tunnel
- [ ] Configurar DNS grupototum.com
- [ ] Testar acesso externo estável
- [ ] Configurar backup automático (snapshots ECS)

---

## 🔒 SEGURANÇA

### Recomendações
1. **Mudar porta SSH** (opcional, mas recomendado)
   ```bash
   # Editar /etc/ssh/sshd_config
   Port 2222  # ou outra porta não padrão
   
   # Reiniciar SSH
   systemctl restart sshd
   ```

2. **Desabilitar login root por senha** (já está assim)
   ```bash
   # Verificar em /etc/ssh/sshd_config
   PermitRootLogin prohibit-password  # ou without-password
   ```

3. **Ativar firewall UFW**
   ```bash
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow 2222/tcp  # porta SSH
   ufw allow 4173/tcp  # app upixel
   ufw allow 4174/tcp  # app totum
   ufw allow 4175/tcp  # app apps-totum
   ufw enable
   ```

4. **Fail2ban** (proteção contra brute force)
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   ```

---

## 📞 CONTATOS E SUPORTE

### Alibaba Cloud Support
- URL: https://www.alibabacloud.com/support
- Documentação: https://www.alibabacloud.com/help

### Cloudflare
- URL: https://dash.cloudflare.com
- Docs Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

---

## 📝 NOTAS

### Registro de Alterações
| Data | Alteração | Responsável |
|------|-----------|-------------|
| 2026-04-05 | Documentação inicial criada | TOT |
| | | |

### Observações Importantes
1. **IP Público:** A Alibaba Cloud usa NAT, então o IP pode mudar. Prioridade: configurar Cloudflare Tunnel.
2. **Acesso SSH:** Funcionando perfeitamente com chave pública.
3. **Apps:** Todos os serviços estão estáveis com PM2.
4. **Próximo passo:** Configurar Cloudflare Tunnel para acesso estável via domínio.

---

## 🔗 ARQUIVOS RELACIONADOS

- `/root/.openclaw/workspace/docs/SOLUCAO_DEFINITIVA_ESTABILIDADE.md` - Solução de estabilidade completa
- `/root/.openclaw/workspace/docs/CLOUD_SETUP.md` - Configuração de backup
- `/root/.openclaw/workspace/docs/INTEGRACAO_OPENCLAW_KIMI_VPS.md` - Arquitetura de integração
- `/opt/totum-scripts/` - Scripts de gestão do sistema

---

**Documento mantido por:** TOT (Totum Operative Technology)  
**Última atualização:** 2026-04-05  
**Status:** ✅ Documentação completa - Aguardando configuração de acesso web
