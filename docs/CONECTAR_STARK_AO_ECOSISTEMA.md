# 🔌 CONECTANDO STARK AO ECOSISTEMA TOTUM

> Guia completo para integrar StarkClaw (OpenClaw no VPS) com TOT, Apps e GILES

---

## 🎯 O QUE É O STARK?

**Stark** = OpenClaw rodando no VPS Stark (Alibaba Cloud)

Ele é o **guardião da infraestrutura** - monitora, automatiza e mantém tudo funcionando 24/7.

---

## 🏗️ ARQUITETURA DE CONEXÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                        SEU ECOSSISTEMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐         ┌─────────┐ │
│  │   TOT 🤖     │◄───────►│    APPS 📱   │◄───────►│ GILES 📚│ │
│  │  (Alibaba)   │  WS/API │  (Lovable)   │  API    │(Supabase│ │
│  │              │         │              │         │         │ │
│  │ Interface    │         │ Hub Visual   │         │ Memória │ │
│  │ Humana       │         │              │         │         │ │
│  └──────┬───────┘         └──────────────┘         └─────────┘ │
│         │                                                       │
│         │  Comandos de orquestração                            │
│         ▼                                                       │
│  ┌──────────────┐                                              │
│  │ STARK ⚡     │◄─── Você está aqui                            │
│  │  (VPS Stark) │                                              │
│  │              │                                              │
│  │ • Monitora   │                                              │
│  │ • Deploya    │                                              │
│  │ • Alerta     │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 REQUISITOS

### 1. Acesso ao VPS Stark
```bash
# Você precisa de:
- IP do VPS Stark: 187.127.4.140 (exemplo)
- SSH key configurada
- OpenClaw instalado e rodando
```

### 2. Credenciais de Acesso

**Supabase (GILES):**
```bash
# URL e Key do projeto
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service
```

**Apps (Lovable):**
```bash
# URL da API
APPS_API_URL=https://totum-app-harmony.lovable.app/api
# ou webhook para comunicação
```

**TOT (Alibaba):**
```bash
# WebSocket do Gateway OpenClaw
TOT_WS_URL=ws://seu-ip-alibaba:18789
TOT_AUTH_TOKEN=token-de-pairing
```

---

## 🔧 MÉTODOS DE CONEXÃO

### OPÇÃO 1: WebSocket Direto (Recomendado)

Stark se conecta ao Gateway do TOT via WebSocket:

```javascript
// src/services/starkConnector.ts (no Stark)

import WebSocket from 'ws';

class StarkConnector {
  private ws: WebSocket | null = null;
  private totUrl: string;
  private reconnectInterval = 5000;

  constructor(totUrl: string) {
    this.totUrl = totUrl;
  }

  connect() {
    this.ws = new WebSocket(this.totUrl);

    this.ws.on('open', () => {
      console.log('🟢 Stark conectado ao TOT');
      this.authenticate();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(JSON.parse(data.toString()));
    });

    this.ws.on('close', () => {
      console.log('🔴 Conexão com TOT perdida. Reconectando...');
      setTimeout(() => this.connect(), this.reconnectInterval);
    });

    this.ws.on('error', (err) => {
      console.error('Erro na conexão:', err);
    });
  }

  private authenticate() {
    this.send({
      type: 'auth',
      agent: 'stark',
      token: process.env.TOT_AUTH_TOKEN
    });
  }

  private handleMessage(msg: any) {
    switch(msg.type) {
      case 'command':
        this.executeCommand(msg.data);
        break;
      case 'ping':
        this.send({ type: 'pong', timestamp: Date.now() });
        break;
      case 'status_request':
        this.reportStatus();
        break;
    }
  }

  private async executeCommand(cmd: any) {
    // Executar comando no VPS
    const result = await this.runCommand(cmd);
    
    // Enviar resultado de volta
    this.send({
      type: 'command_result',
      id: cmd.id,
      result
    });
  }

  private async runCommand(cmd: any) {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(cmd.command, (error: any, stdout: string, stderr: string) => {
        if (error) {
          resolve({ success: false, error: error.message, stderr });
        } else {
          resolve({ success: true, stdout });
        }
      });
    });
  }

  private reportStatus() {
    const status = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: Date.now()
    };
    
    this.send({
      type: 'status_report',
      agent: 'stark',
      data: status
    });
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default StarkConnector;
```

### OPÇÃO 2: API REST (Alternativa)

Stark expõe endpoints HTTP para TOT chamar:

```javascript
// src/server/starkApi.ts (no Stark)

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Executar comando
app.post('/execute', async (req, res) => {
  const { command, authToken } = req.body;
  
  // Verificar auth
  if (authToken !== process.env.STARK_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { exec } = require('child_process');
    exec(command, (error: any, stdout: string, stderr: string) => {
      if (error) {
        res.json({ success: false, error: error.message, stderr });
      } else {
        res.json({ success: true, stdout });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Execution failed' });
  }
});

// Status detalhado
app.get('/status', (req, res) => {
  res.json({
    disk: getDiskUsage(),
    memory: process.memoryUsage(),
    cpu: getCPUUsage(),
    services: checkServices()
  });
});

// Monitoramento de apps
app.get('/monitor/apps', async (req, res) => {
  const appsStatus = await checkAppsStatus();
  res.json(appsStatus);
});

app.listen(3001, () => {
  console.log('🦞 Stark API rodando na porta 3001');
});
```

### OPÇÃO 3: Supabase Realtime (Pub/Sub)

Usar Supabase como "fio" entre TOT e Stark:

```javascript
// No Stark
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Escutar comandos do TOT
supabase
  .channel('stark-commands')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'agent_commands' },
    async (payload) => {
      if (payload.new.target_agent === 'stark') {
        console.log('📩 Comando recebido do TOT:', payload.new.command);
        
        // Executar
        const result = await executeCommand(payload.new.command);
        
        // Responder
        await supabase.from('agent_responses').insert({
          command_id: payload.new.id,
          agent: 'stark',
          result,
          timestamp: new Date().toISOString()
        });
      }
    }
  )
  .subscribe();

// Enviar status para TOT
async function reportStatus() {
  await supabase.from('agent_status').upsert({
    agent: 'stark',
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}

// Reportar a cada 30 segundos
setInterval(reportStatus, 30000);
```

---

## 📡 COMUNICAÇÃO STARK ↔ APPS

### Apps solicita status do Stark:

```javascript
// No Apps (frontend)
async function getStarkStatus() {
  const { data, error } = await supabase
    .from('agent_status')
    .select('*')
    .eq('agent', 'stark')
    .single();
    
  return data;
}

// Ou via API própria
async function getStarkStatus() {
  const response = await fetch('/api/agents/stark/status');
  return response.json();
}
```

### Stark envia alerta para Apps:

```javascript
// No Stark
async function sendAlert(message: string, severity: 'warning' | 'error') {
  // Via Supabase
  await supabase.from('system_alerts').insert({
    agent: 'stark',
    message,
    severity,
    timestamp: new Date().toISOString(),
    acknowledged: false
  });
  
  // Ou via WhatsApp/Telegram
  await sendWhatsAppAlert(message);
}
```

---

## 🔐 CONFIGURAÇÃO DE SEGURANÇA

### 1. Arquivo .env no Stark

```bash
# /root/.openclaw/.env (ou onde preferir)

# Conexão com TOT
TOT_WS_URL=ws://ip-do-tot:18789
TOT_AUTH_TOKEN=seu-token-secreto

# Conexão com Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-chave-service-role
SUPABASE_ANON_KEY=sua-chave-anon

# Conexão com Apps
APPS_WEBHOOK_URL=https://totum-app-harmony.lovable.app/api/webhooks/stark
APPS_API_TOKEN=token-de-api

# Configurações locais
STARK_API_PORT=3001
STARK_API_TOKEN=token-para-api-local
MONITORING_INTERVAL=300000  # 5 minutos
```

### 2. Firewall (UFW)

```bash
# No VPS Stark
sudo ufw allow 3001/tcp  # API do Stark
sudo ufw allow from IP_DO_TOT to any port 3001  # Só TOT pode acessar
sudo ufw deny 3001/tcp  # Bloquear resto
```

---

## 🚀 IMPLEMENTAÇÃO PASSO A PASSO

### Passo 1: Criar Script de Conexão

```bash
# /root/stark-connector/start.sh

cd /root/stark-connector

# Carregar variáveis
export $(cat .env | xargs)

# Iniciar conector
node dist/index.js
```

### Passo 2: PM2 para manter rodando

```bash
# Instalar PM2 se não tiver
npm install -g pm2

# Criar configuração
pm2 init

# Editar ecosystem.config.js
module.exports = {
  apps: [{
    name: 'stark-connector',
    script: './dist/index.js',
    env: {
      NODE_ENV: 'production'
    },
    log_file: './logs/connector.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M'
  }, {
    name: 'stark-monitor',
    script: './dist/monitor.js',
    cron_restart: '*/5 * * * *',  # A cada 5 min
    log_file: './logs/monitor.log'
  }]
};

# Iniciar
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Passo 3: Testar Conexão

```bash
# Testar conexão com TOT
curl -X POST http://localhost:3001/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "uptime", "authToken": "seu-token"}'

# Verificar logs
pm2 logs stark-connector
```

---

## 📊 COMANDOS DISPONÍVEIS

### TOT pode pedir para Stark executar:

| Comando | Descrição | Retorno |
|---------|-----------|---------|
| `deploy_apps` | Deploy do Apps no Lovable | { success, url, timestamp } |
| `backup_alexandria` | Backup do banco | { success, size, path } |
| `status_apps` | Verificar se Apps está online | { online, uptime, latency } |
| `restart_service [nome]` | Restartar serviço | { success, output } |
| `update_ssl` | Atualizar certificados | { success, expiry_date } |
| `logs [serviço] [linhas]` | Pegar logs | { logs: [...] } |
| `disk_usage` | Uso de disco | { total, used, free, percent } |

---

## 🔔 ALERTAS E NOTIFICAÇÖES

### Stark envia alerta quando:

```javascript
// monitor.ts

async function checkSystems() {
  // 1. Apps caiu?
  const appsStatus = await checkAppsHealth();
  if (!appsStatus.online) {
    await sendAlert('🚨 APPS OFFLINE', 'error');
  }
  
  // 2. Disco cheio?
  const disk = await getDiskUsage();
  if (disk.percent > 90) {
    await sendAlert(`⚠️ Disco 90% cheio (${disk.used}/${disk.total})`, 'warning');
  }
  
  // 3. Memória alta?
  const mem = process.memoryUsage();
  if (mem.heapUsed > 500 * 1024 * 1024) {  # 500MB
    await sendAlert('⚠️ Memória alta no Stark', 'warning');
  }
  
  // 4. Certificado SSL expirando?
  const sslExpiry = await checkSSLExpiry();
  if (sslExpiry.daysLeft < 7) {
    await sendAlert(`⏰ SSL expira em ${sslExpiry.daysLeft} dias`, 'warning');
  }
}

async function sendAlert(message: string, severity: string) {
  // 1. Salvar no Supabase (Apps vê no dashboard)
  await supabase.from('system_alerts').insert({
    agent: 'stark',
    message,
    severity,
    timestamp: new Date().toISOString()
  });
  
  // 2. Enviar WhatsApp (Israel)
  await fetch('https://api.whatsapp.com/v1/messages', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}` },
    body: JSON.stringify({
      to: process.env.ISRAEL_PHONE,
      body: `[STARK] ${message}`
    })
  });
  
  // 3. Log local
  console.error(`[ALERTA ${severity.toUpperCase()}] ${message}`);
}
```

---

## 📱 VISUALIZAÇÃO NO APPS

### Dashboard de Status:

```tsx
// Componente no Apps
export function StarkStatusWidget() {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    // Buscar status em tempo real
    const subscription = supabase
      .channel('stark-status')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'agent_status' },
        (payload) => setStatus(payload.new)
      )
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status?.status === 'online' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          Stark Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span>{formatUptime(status?.uptime)}</span>
          </div>
          <div className="flex justify-between">
            <span>Último ping:</span>
            <span>{formatTime(status?.timestamp)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar pasta `/root/stark-connector/`
- [ ] Instalar dependências (ws, @supabase/supabase-js, express)
- [ ] Criar arquivo `.env` com credenciais
- [ ] Implementar conector WebSocket ou API
- [ ] Criar tabelas no Supabase (agent_status, agent_commands, system_alerts)
- [ ] Configurar PM2 para manter rodando
- [ ] Testar conexão TOT → Stark
- [ ] Testar conexão Stark → Supabase
- [ ] Criar widget de status no Apps
- [ ] Configurar alertas WhatsApp
- [ ] Documentar comandos disponíveis

---

## 🆘 TROUBLESHOOTING

### Problema: Stark não conecta ao TOT
```bash
# Verificar se TOT está acessível
telnet ip-do-tot 18789

# Verificar logs
pm2 logs stark-connector

# Testar manualmente
node -e "
  const ws = new WebSocket('ws://ip-do-tot:18789');
  ws.on('open', () => console.log('OK'));
  ws.on('error', (e) => console.log('ERRO:', e.message));
"
```

### Problema: Supabase rejeita conexão
```bash
# Verificar se IP do Stark está na whitelist do Supabase
# Dashboard Supabase → Settings → API → IP Allowlist
```

### Problema: Comandos não executam
```bash
# Verificar permissões
ls -la /root/stark-connector/

# Verificar se node tem permissão para executar comandos
which node
node --version
```

---

## 📞 SUPORTE

Se travar em algum passo:
1. Verificar logs: `pm2 logs`
2. Testar componentes isoladamente
3. Verificar variáveis de ambiente
4. Confirmar IPs e firewalls

---

*Documento criado por: TOT*  
*Para: StarkClaw e Israel*  
*Data: 2026-04-05*