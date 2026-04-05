# Integração OpenClaw: Kimi Claw + VPS Local

## 📋 Sumário Executivo

Este documento descreve a arquitetura completa de integração entre o **Kimi Claw** (instância OpenClaw na nuvem com acesso ao modelo Kimi) e um **VPS Local** (instância OpenClaw em servidor dedicado/VPS próprio). Esta configuração permite orquestrar capacidades de IA avançadas do Kimi com infraestrutura local controlada.

---

## 1️⃣ Arquitetura de Comunicação

### 1.1 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITETURA DE INTEGRAÇÃO                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│    KIMI CLAW         │         │     VPS LOCAL        │
│  (Cloud/Nuvem)       │◄───────►│  (Servidor Próprio)  │
├──────────────────────┤         ├──────────────────────┤
│ • Modelo Kimi AI     │         │ • Gateway OpenClaw   │
│ • Gateway OpenClaw   │         │ • Ferramentas locais │
│ • Canais externos    │         │ • Bancos de dados    │
│ • Redis (broker)     │         │ • Arquivos/Sistemas  │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │    ┌────────────────────┐      │
           └───►│   REDIS BROKER     │◄─────┘
                │  (Message Queue)   │
                └────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │   HTTP   │  │ WebSocket│  │  Pub/Sub │
    │  REST    │  │  Realtime│  │  Redis   │
    └──────────┘  └──────────┘  └──────────┘
```

### 1.2 Componentes Principais

| Componente | Kimi Claw (Cloud) | VPS Local |
|------------|-------------------|-----------|
| **Gateway** | OpenClaw Gateway | OpenClaw Gateway |
| **Modelo IA** | Kimi (via API) | - (ou local) |
| **Redis** | Conexão remota | Conexão local/remota |
| **Função** | Processamento IA, Orquestração | Execução local, Dados privados |
| **Canais** | Feishu, Discord, Telegram, etc. | Automação interna, DBs |

### 1.3 Fluxo de Comunicação

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO TÍPICO DE MENSAGEM                     │
└─────────────────────────────────────────────────────────────────┘

1. USUÁRIO envia mensagem via Feishu/Discord
         │
         ▼
2. KIMI CLAW recebe e processa com modelo Kimi
         │
         ▼
3. KIMI CLAW determina necessidade de ação local
         │
         ▼
4. KIMI CLAW publica mensagem no Redis (canal: vps:tasks)
         │
         ▼
5. VPS LOCAL (subscriber) recebe mensagem do Redis
         │
         ▼
6. VPS LOCAL executa ferramenta local (ex: consulta DB)
         │
         ▼
7. VPS LOCAL publica resultado no Redis (canal: vps:results)
         │
         ▼
8. KIMI CLAW recebe resultado e formata resposta
         │
         ▼
9. KIMI CLAW responde ao usuário via canal original
```

---

## 2️⃣ Protocolos de Comunicação

### 2.1 Redis (Message Broker)

O Redis serve como coração da comunicação assíncrona entre as instâncias.

#### 2.1.1 Configuração do Redis

```yaml
# /etc/redis/redis.conf (VPS Local)
# ou redis.conf do container Redis

# Bind para aceitar conexões externas (cuidado com segurança!)
bind 0.0.0.0
port 6379

# Senha de autenticação (OBRIGATÓRIO para produção)
requirepass sua_senha_forte_aqui

# Persistência (opcional para filas)
save 900 1
save 300 10
save 60 10000

# Habilitar Pub/Sub
notify-keyspace-events KEA
```

#### 2.1.2 Estrutura de Canais Redis

```
┌─────────────────────────────────────────────────────────┐
│              CANAIS REDIS PADRONIZADOS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  vps:tasks      → Kimi Claw envia tarefas para VPS     │
│  vps:results    → VPS envia resultados para Kimi Claw  │
│  vps:heartbeat  → Sinal de vida entre instâncias       │
│  vps:logs       → Logs centralizados                   │
│  vps:commands   → Comandos diretos (com cautela!)      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.1.3 Formato de Mensagem Redis

```json
{
  "id": "msg_001",
  "timestamp": "2026-04-03T14:30:00Z",
  "source": "kimi-claw",
  "target": "vps-local",
  "channel": "vps:tasks",
  "type": "task",
  "priority": "normal",
  "payload": {
    "action": "consulta_db",
    "params": {
      "tabela": "clientes",
      "filtro": "status = 'ativo'",
      "limite": 10
    }
  },
  "callback_channel": "vps:results",
  "timeout": 30
}
```

### 2.2 HTTP REST API

Comunicação síncrona para operações imediatas.

#### 2.2.1 Endpoints VPS Local

```javascript
// VPS Local - API Express.js
const express = require('express');
const app = express();

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Executar ferramenta local
app.post('/api/execute', authenticate, async (req, res) => {
  const { tool, params } = req.body;
  
  try {
    const result = await executeLocalTool(tool, params);
    res.json({
      success: true,
      data: result,
      executed_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Consultar dados locais
app.get('/api/data/:resource', authenticate, async (req, res) => {
  const { resource } = req.params;
  const { query } = req.query;
  
  const result = await queryLocalData(resource, query);
  res.json(result);
});

app.listen(3000, () => {
  console.log('VPS Local API rodando na porta 3000');
});
```

#### 2.2.2 Chamada HTTP do Kimi Claw

```python
# Kimi Claw - Cliente HTTP para VPS Local
import httpx
import json
from typing import Dict, Any

class VPSLocalClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Verifica saúde do VPS Local"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{self.base_url}/health',
                headers=self.headers,
                timeout=5.0
            )
            return response.json()
    
    async def execute_tool(self, tool: str, params: Dict) -> Dict[str, Any]:
        """Executa ferramenta no VPS Local"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f'{self.base_url}/api/execute',
                headers=self.headers,
                json={'tool': tool, 'params': params},
                timeout=30.0
            )
            return response.json()
    
    async def query_data(self, resource: str, query: str = None) -> Dict[str, Any]:
        """Consulta dados no VPS Local"""
        async with httpx.AsyncClient() as client:
            url = f'{self.base_url}/api/data/{resource}'
            if query:
                url += f'?query={query}'
            response = await client.get(url, headers=self.headers, timeout=10.0)
            return response.json()

# Uso
vps = VPSLocalClient('https://vps-local.grupototum.com', 'api_key_segura')
result = await vps.execute_tool('consulta_mysql', {'tabela': 'vendas'})
```

### 2.3 WebSocket (Comunicação Real-time)

Para comunicação bidirecional contínua.

#### 2.3.1 Servidor WebSocket (VPS Local)

```javascript
// VPS Local - WebSocket Server
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Autenticação de conexão
wss.on('connection', (ws, req) => {
  const token = req.url.split('?token=')[1];
  
  if (!validateToken(token)) {
    ws.close(1008, 'Autenticação inválida');
    return;
  }
  
  console.log('Kimi Claw conectado via WebSocket');
  
  // Enviar confirmação
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected',
    timestamp: new Date().toISOString()
  }));
  
  // Handler de mensagens
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      const result = await processMessage(message);
      
      ws.send(JSON.stringify({
        type: 'response',
        id: message.id,
        data: result,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  // Heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  }, 30000);
  
  ws.on('close', () => {
    clearInterval(heartbeat);
    console.log('Kimi Claw desconectado');
  });
});

server.listen(8080, () => {
  console.log('WebSocket server rodando na porta 8080');
});
```

#### 2.3.2 Cliente WebSocket (Kimi Claw)

```python
# Kimi Claw - WebSocket Client
import asyncio
import websockets
import json
from typing import Callable

class VPSWebSocketClient:
    def __init__(self, uri: str, token: str):
        self.uri = f'{uri}?token={token}'
        self.ws = None
        self.handlers: Dict[str, Callable] = {}
        self.connected = False
    
    async def connect(self):
        """Conecta ao VPS Local via WebSocket"""
        self.ws = await websockets.connect(self.uri)
        self.connected = True
        
        # Inicia loop de recebimento
        asyncio.create_task(self._receive_loop())
        
        # Aguarda confirmação
        response = await self.ws.recv()
        data = json.loads(response)
        print(f"Conectado: {data}")
    
    async def _receive_loop(self):
        """Loop contínuo de recebimento"""
        try:
            async for message in self.ws:
                data = json.loads(message)
                await self._handle_message(data)
        except websockets.exceptions.ConnectionClosed:
            self.connected = False
            print("Conexão WebSocket fechada")
    
    async def _handle_message(self, data: dict):
        """Processa mensagens recebidas"""
        msg_type = data.get('type')
        if msg_type in self.handlers:
            await self.handlers[msg_type](data)
    
    async def send(self, action: str, payload: dict) -> dict:
        """Envia mensagem e aguarda resposta"""
        msg_id = f"msg_{asyncio.get_event_loop().time()}"
        message = {
            'id': msg_id,
            'type': 'request',
            'action': action,
            'payload': payload,
            'timestamp': datetime.now().isoformat()
        }
        
        await self.ws.send(json.dumps(message))
        
        # Aguarda resposta com timeout
        # (simplificado - em produção usar Future/awaitable)
        return {'status': 'sent', 'id': msg_id}
    
    def on(self, msg_type: str, handler: Callable):
        """Registra handler para tipo de mensagem"""
        self.handlers[msg_type] = handler
    
    async def close(self):
        """Fecha conexão"""
        if self.ws:
            await self.ws.close()
            self.connected = False

# Uso
client = VPSWebSocketClient('wss://vps-local.grupototum.com:8080', 'token_seguro')
await client.connect()

# Registrar handlers
async def on_response(data):
    print(f"Resposta recebida: {data}")

client.on('response', on_response)

# Enviar mensagem
await client.send('consulta_db', {'tabela': 'clientes'})
```

---

## 3️⃣ Código Exemplo para Troca de Mensagens

### 3.1 Exemplo Completo: Sistema de Orquestração

#### 3.1.1 VPS Local (Consumer)

```python
#!/usr/bin/env python3
"""
VPS Local - Consumer de Tarefas
Escuta fila Redis e executa ferramentas locais
"""

import asyncio
import json
import redis.asyncio as redis
from datetime import datetime
from typing import Dict, Any
import asyncpg  # Para PostgreSQL
import aiomysql  # Para MySQL

class VPSLocalWorker:
    def __init__(self, redis_url: str, redis_password: str):
        self.redis_url = redis_url
        self.redis_password = redis_password
        self.redis_client = None
        self.running = False
        
        # Registro de ferramentas disponíveis
        self.tools = {
            'query_postgres': self.query_postgres,
            'query_mysql': self.query_mysql,
            'execute_shell': self.execute_shell,
            'read_file': self.read_file,
            'write_file': self.write_file,
            'system_info': self.system_info,
        }
    
    async def connect(self):
        """Conecta ao Redis"""
        self.redis_client = await redis.from_url(
            self.redis_url,
            password=self.redis_password,
            decode_responses=True
        )
        print(f"[{datetime.now()}] Conectado ao Redis: {self.redis_url}")
    
    async def start(self):
        """Inicia consumo de mensagens"""
        self.running = True
        print(f"[{datetime.now()}] VPS Local Worker iniciado")
        print(f"[{datetime.now()}] Ferramentas disponíveis: {list(self.tools.keys())}")
        
        # Inicia heartbeat em background
        asyncio.create_task(self._heartbeat())
        
        # Consome mensagens
        async with self.redis_client.pubsub() as pubsub:
            await pubsub.subscribe('vps:tasks')
            
            async for message in pubsub.listen():
                if not self.running:
                    break
                
                if message['type'] == 'message':
                    await self._process_task(message['data'])
    
    async def _process_task(self, data: str):
        """Processa uma tarefa recebida"""
        try:
            task = json.loads(data)
            task_id = task.get('id', 'unknown')
            action = task.get('payload', {}).get('action')
            params = task.get('payload', {}).get('params', {})
            
            print(f"[{datetime.now()}] Processando tarefa {task_id}: {action}")
            
            # Executa ferramenta
            if action in self.tools:
                result = await self.tools[action](params)
                response = {
                    'id': task_id,
                    'status': 'success',
                    'data': result,
                    'timestamp': datetime.now().isoformat()
                }
            else:
                response = {
                    'id': task_id,
                    'status': 'error',
                    'error': f'Ferramenta não encontrada: {action}',
                    'timestamp': datetime.now().isoformat()
                }
            
            # Publica resultado
            callback_channel = task.get('callback_channel', 'vps:results')
            await self.redis_client.publish(callback_channel, json.dumps(response))
            
        except Exception as e:
            print(f"[{datetime.now()}] Erro processando tarefa: {e}")
            error_response = {
                'id': task.get('id', 'unknown'),
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
            await self.redis_client.publish('vps:results', json.dumps(error_response))
    
    async def _heartbeat(self):
        """Envia sinal de vida periodicamente"""
        while self.running:
            await self.redis_client.publish('vps:heartbeat', json.dumps({
                'source': 'vps-local',
                'timestamp': datetime.now().isoformat(),
                'status': 'alive'
            }))
            await asyncio.sleep(30)
    
    # === FERRAMENTAS ===
    
    async def query_postgres(self, params: Dict) -> Any:
        """Executa query PostgreSQL"""
        conn = await asyncpg.connect(
            host='localhost',
            database=params.get('database', 'mydb'),
            user=params.get('user', 'user'),
            password=params.get('password', 'pass')
        )
        try:
            rows = await conn.fetch(params['query'])
            return [dict(row) for row in rows]
        finally:
            await conn.close()
    
    async def query_mysql(self, params: Dict) -> Any:
        """Executa query MySQL"""
        conn = await aiomysql.connect(
            host='localhost',
            db=params.get('database', 'mydb'),
            user=params.get('user', 'user'),
            password=params.get('password', 'pass')
        )
        try:
            async with conn.cursor(aiomysql.DictCursor) as cur:
                await cur.execute(params['query'])
                return await cur.fetchall()
        finally:
            conn.close()
    
    async def execute_shell(self, params: Dict) -> Dict:
        """Executa comando shell (com restrições!)"""
        import subprocess
        
        # Lista branca de comandos permitidos
        allowed_commands = ['ls', 'cat', 'grep', 'ps', 'df', 'free', 'uptime']
        cmd = params.get('command', '')
        
        # Verifica se comando está na whitelist
        base_cmd = cmd.split()[0] if cmd else ''
        if base_cmd not in allowed_commands:
            raise ValueError(f"Comando não permitido: {base_cmd}")
        
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    
    async def read_file(self, params: Dict) -> str:
        """Lê arquivo local"""
        filepath = params.get('path')
        # Validação de segurança básica
        if '..' in filepath or filepath.startswith('/etc'):
            raise ValueError("Caminho não permitido")
        
        with open(filepath, 'r') as f:
            return f.read()
    
    async def write_file(self, params: Dict) -> Dict:
        """Escreve arquivo local"""
        filepath = params.get('path')
        content = params.get('content')
        
        if '..' in filepath:
            raise ValueError("Caminho não permitido")
        
        with open(filepath, 'w') as f:
            f.write(content)
        
        return {'status': 'written', 'path': filepath}
    
    async def system_info(self, params: Dict) -> Dict:
        """Retorna informações do sistema"""
        import psutil
        
        return {
            'cpu_percent': psutil.cpu_percent(),
            'memory': dict(psutil.virtual_memory()._asdict()),
            'disk': dict(psutil.disk_usage('/')._asdict()),
            'boot_time': psutil.boot_time(),
            'timestamp': datetime.now().isoformat()
        }
    
    async def stop(self):
        """Para o worker"""
        self.running = False
        await self.redis_client.close()

# Execução
async def main():
    worker = VPSLocalWorker(
        redis_url='redis://redis.grupototum.com:6379',
        redis_password='sua_senha_forte'
    )
    await worker.connect()
    
    try:
        await worker.start()
    except KeyboardInterrupt:
        print("\nEncerrando...")
        await worker.stop()

if __name__ == '__main__':
    asyncio.run(main())
```

#### 3.1.2 Kimi Claw (Producer)

```python
#!/usr/bin/env python3
"""
Kimi Claw - Producer de Tarefas
Orquestra tarefas e processa resultados
"""

import asyncio
import json
import redis.asyncio as redis
from datetime import datetime
from typing import Dict, Any, Optional
import httpx

class KimiClawOrchestrator:
    def __init__(self, redis_url: str, redis_password: str, openclaw_gateway: str):
        self.redis_url = redis_url
        self.redis_password = redis_password
        self.openclaw_gateway = openclaw_gateway
        self.redis_client = None
        self.pending_tasks: Dict[str, asyncio.Future] = {}
    
    async def connect(self):
        """Conecta ao Redis"""
        self.redis_client = await redis.from_url(
            self.redis_url,
            password=self.redis_password,
            decode_responses=True
        )
        print(f"[{datetime.now()}] Kimi Claw conectado ao Redis")
    
    async def start_result_listener(self):
        """Inicia listener de resultados"""
        asyncio.create_task(self._listen_results())
    
    async def _listen_results(self):
        """Escuta resultados do VPS Local"""
        async with self.redis_client.pubsub() as pubsub:
            await pubsub.subscribe('vps:results')
            
            async for message in pubsub.listen():
                if message['type'] == 'message':
                    await self._handle_result(message['data'])
    
    async def _handle_result(self, data: str):
        """Processa resultado recebido"""
        try:
            result = json.loads(data)
            task_id = result.get('id')
            
            # Resolve Future pendente
            if task_id in self.pending_tasks:
                self.pending_tasks[task_id].set_result(result)
                del self.pending_tasks[task_id]
            
            print(f"[{datetime.now()}] Resultado recebido: {task_id}")
            
        except Exception as e:
            print(f"[{datetime.now()}] Erro processando resultado: {e}")
    
    async def send_task(self, action: str, params: Dict, timeout: int = 30) -> Dict:
        """Envia tarefa para VPS Local e aguarda resultado"""
        task_id = f"task_{datetime.now().timestamp()}"
        
        task = {
            'id': task_id,
            'timestamp': datetime.now().isoformat(),
            'source': 'kimi-claw',
            'target': 'vps-local',
            'channel': 'vps:tasks',
            'type': 'task',
            'priority': 'normal',
            'payload': {
                'action': action,
                'params': params
            },
            'callback_channel': 'vps:results',
            'timeout': timeout
        }
        
        # Cria Future para aguardar resultado
        future = asyncio.Future()
        self.pending_tasks[task_id] = future
        
        # Publica tarefa
        await self.redis_client.publish('vps:tasks', json.dumps(task))
        print(f"[{datetime.now()}] Tarefa enviada: {action}")
        
        try:
            # Aguarda resultado com timeout
            result = await asyncio.wait_for(future, timeout=timeout)
            return result
        except asyncio.TimeoutError:
            del self.pending_tasks[task_id]
            return {'status': 'error', 'error': 'Timeout aguardando resultado'}
    
    async def query_database(self, db_type: str, query: str, **kwargs) -> Dict:
        """Abstração para consulta de banco"""
        action = f'query_{db_type}'
        params = {'query': query, **kwargs}
        return await self.send_task(action, params)
    
    async def get_system_info(self) -> Dict:
        """Obtém informações do sistema VPS"""
        return await self.send_task('system_info', {})
    
    async def read_remote_file(self, path: str) -> Dict:
        """Lê arquivo do VPS"""
        return await self.send_task('read_file', {'path': path})

# Exemplo de uso em resposta a usuário
async def handle_user_request(orchestrator: KimiClawOrchestrator, user_message: str):
    """Processa mensagem do usuário usando Kimi + VPS Local"""
    
    # Análise com Kimi (simulado - na prática usaria API do Kimi)
    if 'relatório de vendas' in user_message.lower():
        # Consulta dados locais
        result = await orchestrator.query_database(
            db_type='mysql',
            query='SELECT * FROM vendas WHERE data >= CURDATE() - INTERVAL 7 DAY',
            database='totum',
            user='totum_user',
            password='***'
        )
        
        if result['status'] == 'success':
            vendas = result['data']
            total = sum(v['valor'] for v in vendas)
            
            # Formata resposta
            return f"""
📊 Relatório de Vendas (Últimos 7 dias)

Total: R$ {total:,.2f}
Quantidade: {len(vendas)} vendas

Detalhes disponíveis no sistema.
            """
        else:
            return f"❌ Erro ao consultar vendas: {result.get('error')}"
    
    elif 'status do servidor' in user_message.lower():
        info = await orchestrator.get_system_info()
        
        if info['status'] == 'success':
            data = info['data']
            memory = data['memory']
            
            return f"""
🖥️ Status do VPS Local

CPU: {data['cpu_percent']}%
Memória: {memory['percent']}% usado ({memory['used'] / 1e9:.1f} GB / {memory['total'] / 1e9:.1f} GB)
Disco: {data['disk']['percent']}% usado
Uptime: {data['boot_time']}
            """
        else:
            return f"❌ Erro: {info.get('error')}"
    
    return "Não entendi o pedido. Tente: 'relatório de vendas' ou 'status do servidor'"

# Execução
async def main():
    orchestrator = KimiClawOrchestrator(
        redis_url='redis://redis.grupototum.com:6379',
        redis_password='sua_senha_forte',
        openclaw_gateway='http://localhost:8080'
    )
    
    await orchestrator.connect()
    await orchestrator.start_result_listener()
    
    # Exemplo de uso
    response = await handle_user_request(orchestrator, "mostrar relatório de vendas")
    print(response)

if __name__ == '__main__':
    asyncio.run(main())
```

### 3.2 Exemplo: OpenClaw Tool Integration

```python
# openclaw_tool_vps_bridge.py
# Ferramenta OpenClaw que faz ponte com VPS Local

from typing import Dict, Any
import redis
import json
import time

class VPSToolBridge:
    """
    Ferramenta OpenClaw para comunicação com VPS Local
    Permite que o agente Kimi execute comandos no VPS
    """
    
    name = "vps_execute"
    description = "Executa ferramentas no VPS Local remoto"
    
    def __init__(self, redis_host: str, redis_port: int = 6379, redis_password: str = None):
        self.redis_client = redis.Redis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            decode_responses=True
        )
    
    def execute(self, tool: str, params: Dict[str, Any], timeout: int = 30) -> Dict:
        """
        Executa ferramenta no VPS Local
        
        Args:
            tool: Nome da ferramenta (query_mysql, system_info, etc.)
            params: Parâmetros da ferramenta
            timeout: Timeout em segundos
        
        Returns:
            Dict com resultado ou erro
        """
        task_id = f"oc_{int(time.time() * 1000)}"
        
        # Prepara mensagem
        task = {
            'id': task_id,
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'source': 'kimi-claw',
            'target': 'vps-local',
            'channel': 'vps:tasks',
            'type': 'tool_execution',
            'payload': {
                'action': tool,
                'params': params
            },
            'callback_channel': 'vps:results',
            'timeout': timeout
        }
        
        # Publica tarefa
        self.redis_client.publish('vps:tasks', json.dumps(task))
        
        # Aguarda resultado (polling simplificado)
        start_time = time.time()
        while time.time() - start_time < timeout:
            # Verifica se há resultado
            # (Em produção, usar pubsub ou fila dedicada)
            result = self.redis_client.get(f'result:{task_id}')
            if result:
                self.redis_client.delete(f'result:{task_id}')
                return json.loads(result)
            time.sleep(0.1)
        
        return {
            'status': 'error',
            'error': f'Timeout após {timeout}s aguardando resposta do VPS'
        }
    
    def query_mysql(self, query: str, database: str = 'default') -> Dict:
        """Shortcut para consulta MySQL"""
        return self.execute('query_mysql', {
            'query': query,
            'database': database
        })
    
    def get_system_status(self) -> Dict:
        """Shortcut para status do sistema"""
        return self.execute('system_info', {})

# Registro na configuração OpenClaw
TOOLS = {
    'vps_execute': VPSToolBridge,
}
```

---

## 4️⃣ Configuração do Gateway OpenClaw

### 4.1 Kimi Claw (Gateway na Nuvem)

```yaml
# ~/.openclaw/config.yaml - Kimi Claw (Cloud)

gateway:
  # Configuração básica
  host: 0.0.0.0
  port: 8080
  
  # Modelo Kimi
  model:
    provider: kimi
    api_key: ${KIMI_API_KEY}
    base_url: https://api.moonshot.cn/v1
    model: kimi-k2.5
  
  # Canais externos
  channels:
    feishu:
      enabled: true
      app_id: ${FEISHU_APP_ID}
      app_secret: ${FEISHU_APP_SECRET}
      encrypt_key: ${FEISHU_ENCRYPT_KEY}
    
    telegram:
      enabled: true
      bot_token: ${TELEGRAM_BOT_TOKEN}
    
    discord:
      enabled: true
      bot_token: ${DISCORD_BOT_TOKEN}
  
  # Configuração Redis (para comunicação com VPS)
  redis:
    enabled: true
    host: redis.grupototum.com  # ou IP do VPS se Redis estiver lá
    port: 6379
    password: ${REDIS_PASSWORD}
    db: 0
    
    # Canais de comunicação
    channels:
      tasks: vps:tasks
      results: vps:results
      heartbeat: vps:heartbeat
      logs: vps:logs
  
  # Integração VPS Local
  vps_local:
    enabled: true
    http_url: https://vps-local.grupototum.com:3000
    websocket_url: wss://vps-local.grupototum.com:8080
    api_key: ${VPS_API_KEY}
    timeout: 30
    
    # Ferramentas disponíveis no VPS
    remote_tools:
      - query_mysql
      - query_postgres
      - execute_shell
      - read_file
      - system_info
  
  # Plugins habilitados
  plugins:
    - name: feishu
    - name: telegram
    - name: discord
    - name: vps-bridge
      config:
        redis_url: redis://redis.grupototum.com:6379
        channels:
          - vps:tasks
          - vps:results

# Logging
logging:
  level: info
  format: json
  output: stdout
```

### 4.2 VPS Local (Gateway Local)

```yaml
# ~/.openclaw/config.yaml - VPS Local

gateway:
  # Configuração básica
  host: 0.0.0.0
  port: 8080
  
  # VPS Local não usa modelo Kimi diretamente
  # (mas pode ter modelos locais se desejado)
  model:
    enabled: false
  
  # Redis (mesmo servidor ou instância local)
  redis:
    enabled: true
    host: localhost  # Redis local ou remoto
    port: 6379
    password: ${REDIS_PASSWORD}
    db: 0
    
    # Este VPS é consumer das tarefas
    consumer:
      enabled: true
      channels:
        - vps:tasks
      group: vps-workers
  
  # Configuração de ferramentas locais
  tools:
    # Banco de dados
    query_mysql:
      enabled: true
      connections:
        default:
          host: localhost
          port: 3306
          user: ${MYSQL_USER}
          password: ${MYSQL_PASSWORD}
          database: totum
    
    query_postgres:
      enabled: true
      connections:
        default:
          host: localhost
          port: 5432
          user: ${POSTGRES_USER}
          password: ${POSTGRES_PASSWORD}
          database: totum
    
    # Sistema de arquivos
    file_system:
      enabled: true
      allowed_paths:
        - /var/www/totum
        - /home/totum/data
        - /var/log/totum
      blocked_paths:
        - /etc
        - /root
        - /var/secrets
    
    # Shell (com restrições)
    shell:
      enabled: true
      whitelist:
        - ls
        - cat
        - grep
        - ps
        - df
        - free
        - uptime
        - tail
        - head
        - wc
      blacklist:
        - rm
        - mv
        - dd
        - mkfs
        - fdisk
  
  # API HTTP para chamadas diretas
  api:
    enabled: true
    port: 3000
    auth:
      type: bearer
      secret: ${API_SECRET}
    
    endpoints:
      - path: /health
        method: GET
        handler: health_check
      
      - path: /api/execute
        method: POST
        handler: execute_tool
        auth: true
      
      - path: /api/data/:resource
        method: GET
        handler: query_data
        auth: true
  
  # WebSocket para comunicação real-time
  websocket:
    enabled: true
    port: 8080
    auth:
      type: token
      secret: ${WS_SECRET}
    
    # Heartbeat
    heartbeat:
      interval: 30
      timeout: 60

# Logging
logging:
  level: info
  format: json
  output: /var/log/openclaw/vps-local.log
  max_size: 100MB
  max_files: 10
```

### 4.3 Docker Compose (VPS Local)

```yaml
# docker-compose.yml - VPS Local
version: '3.8'

services:
  openclaw-gateway:
    image: openclaw/gateway:latest
    container_name: openclaw-vps
    restart: always
    ports:
      - "8080:8080"   # Gateway principal
      - "3000:3000"   # API HTTP
    volumes:
      - ./config.yaml:/root/.openclaw/config.yaml:ro
      - /var/www/totum:/data/www:ro
      - /var/log/openclaw:/var/log/openclaw
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - API_SECRET=${API_SECRET}
      - WS_SECRET=${WS_SECRET}
    networks:
      - openclaw-net
    depends_on:
      - redis
  
  redis:
    image: redis:7-alpine
    container_name: openclaw-redis
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - openclaw-net
  
  # Worker Python para processamento de tarefas
  vps-worker:
    build:
      context: ./worker
      dockerfile: Dockerfile
    container_name: openclaw-worker
    restart: always
    environment:
      - REDIS_URL=redis://redis:6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - MYSQL_HOST=mysql
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - /var/www/totum:/data/www:ro
      - /var/log/totum:/var/log/totum:ro
    networks:
      - openclaw-net
    depends_on:
      - redis

volumes:
  redis-data:

networks:
  openclaw-net:
    driver: bridge
```

### 4.4 Script de Inicialização (Systemd)

```ini
# /etc/systemd/system/openclaw-vps.service
[Unit]
Description=OpenClaw VPS Local Gateway
After=network.target redis.service

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/opt/openclaw
ExecStart=/usr/local/bin/openclaw gateway start --config /opt/openclaw/config.yaml
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5

# Environment
Environment="REDIS_PASSWORD_FILE=/etc/openclaw/redis_password"
Environment="API_SECRET_FILE=/etc/openclaw/api_secret"

# Security
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/openclaw
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

[Install]
WantedBy=multi-user.target
```

---

## 5️⃣ Casos de Uso Práticos

### 5.1 Caso 1: Relatório de Vendas com Dados Locais

```
┌─────────────────────────────────────────────────────────────────┐
│                    RELATÓRIO DE VENDAS                          │
└─────────────────────────────────────────────────────────────────┘

CENÁRIO: Usuário solicita relatório de vendas via Feishu

FLUXO:
1. Usuário: "Quero ver o relatório de vendas da semana"
   │
2. Kimi Claw (Cloud) recebe mensagem via Feishu
   │
3. Kimi processa e identifica necessidade de dados locais
   │
4. Kimi publica tarefa no Redis:
   │
   {
     "id": "task_001",
     "action": "query_mysql",
     "params": {
       "query": "SELECT * FROM vendas WHERE data >= CURDATE() - INTERVAL 7 DAY",
       "database": "totum"
     }
   }
   │
5. VPS Local (Worker) consome tarefa
   │
6. Worker executa query no MySQL local
   │
7. Worker publica resultado:
   │
   {
     "id": "task_001",
     "status": "success",
     "data": [
       {"id": 1, "valor": 1500.00, "data": "2026-04-01"},
       {"id": 2, "valor": 2300.00, "data": "2026-04-02"},
       ...
     ]
   }
   │
8. Kimi Claw recebe resultado
   │
9. Kimi analisa dados e formata resposta:
   │
   📊 Relatório de Vendas (Últimos 7 dias)
   
   Total: R$ 15.430,00
   Ticket médio: R$ 1.286,00
   Melhor dia: 2026-04-02 (R$ 3.200,00)
   
   Crescimento vs semana anterior: +12%
   │
10. Kimi responde ao usuário via Feishu
```

**Código de Implementação:**

```python
# Relatório de Vendas - Implementação
async def generate_sales_report(orchestrator: KimiClawOrchestrator, period: str = '7d'):
    # Mapeia período para SQL
    period_map = {
        '7d': 'CURDATE() - INTERVAL 7 DAY',
        '30d': 'CURDATE() - INTERVAL 30 DAY',
        'mtd': 'DATE_FORMAT(CURDATE(), "%Y-%m-01")',
    }
    
    date_filter = period_map.get(period, period_map['7d'])
    
    # Consulta vendas
    vendas_result = await orchestrator.query_database(
        db_type='mysql',
        query=f'''
            SELECT 
                DATE(data) as dia,
                COUNT(*) as quantidade,
                SUM(valor) as total,
                AVG(valor) as ticket_medio
            FROM vendas 
            WHERE data >= {date_filter}
            GROUP BY DATE(data)
            ORDER BY dia DESC
        ''',
        database='totum'
    )
    
    if vendas_result['status'] != 'success':
        return f"❌ Erro: {vendas_result.get('error')}"
    
    vendas = vendas_result['data']
    
    # Consulta semana anterior para comparação
    comparacao_result = await orchestrator.query_database(
        db_type='mysql',
        query=f'''
            SELECT SUM(valor) as total_anterior
            FROM vendas 
            WHERE data >= {date_filter} - INTERVAL {period.replace('d', ' DAY')}
              AND data < {date_filter}
        ''',
        database='totum'
    )
    
    # Calcula métricas
    total = sum(v['total'] for v in vendas)
    quantidade = sum(v['quantidade'] for v in vendas)
    ticket_medio = total / quantidade if quantidade > 0 else 0
    melhor_dia = max(vendas, key=lambda x: x['total'])
    
    # Calcula variação
    total_anterior = comparacao_result['data'][0]['total_anterior'] or 0
    variacao = ((total - total_anterior) / total_anterior * 100) if total_anterior > 0 else 0
    
    # Formata resposta
    emoji = '📈' if variacao > 0 else '📉' if variacao < 0 else '➡️'
    
    return f"""
📊 Relatório de Vendas ({period})

💰 Total: R$ {total:,.2f}
🛒 Quantidade: {quantidade} vendas
💳 Ticket Médio: R$ {ticket_medio:,.2f}
🏆 Melhor Dia: {melhor_dia['dia']} (R$ {melhor_dia['total']:,.2f})

{emoji} Variação: {variacao:+.1f}% vs período anterior

📅 Detalhamento por dia:
{"\n".join(f"  • {v['dia']}: R$ {v['total']:,.2f} ({v['quantidade']} vendas)" for v in vendas[:5])}
    """
```

### 5.2 Caso 2: Monitoramento de Sistema e Alertas

```
┌─────────────────────────────────────────────────────────────────┐
│                  MONITORAMENTO DE SISTEMA                       │
└─────────────────────────────────────────────────────────────────┘

CENÁRIO: Monitoramento contínuo do VPS com alertas via Feishu

FLUXO:
1. Kimi Claw agenda verificação periódica (a cada 5 min)
   │
2. Kimi solicita system_info do VPS
   │
3. VPS retorna métricas:
   {
     "cpu_percent": 85,
     "memory": {"percent": 92, "used": 14700000000},
     "disk": {"percent": 78}
   }
   │
4. Kimi analisa e detecta alerta (CPU > 80%, Memória > 90%)
   │
5. Kimi envia alerta para Feishu:
   
   🚨 ALERTA DE SISTEMA - VPS Local
   
   CPU: 85% ⚠️
   Memória: 92% (14.7 GB) 🔴
   Disco: 78%
   
   Ações recomendadas:
   • Verificar processos com alto consumo
   • Considerar restart de serviços
   • Analisar logs de aplicação
   │
6. Se problema persistir, Kimi pode executar ações corretivas
   │
7. Kimi agenda follow-up em 10 minutos
```

**Código de Implementação:**

```python
# Sistema de Monitoramento
class VPSMonitor:
    def __init__(self, orchestrator: KimiClawOrchestrator, feishu_channel: str):
        self.orchestrator = orchestrator
        self.feishu_channel = feishu_channel
        self.thresholds = {
            'cpu': {'warning': 70, 'critical': 85},
            'memory': {'warning': 80, 'critical': 90},
            'disk': {'warning': 80, 'critical': 90}
        }
        self.alert_history = []
    
    async def check_system(self):
        """Verifica saúde do sistema"""
        result = await self.orchestrator.get_system_info()
        
        if result['status'] != 'success':
            await self.send_alert("❌ Falha ao consultar sistema VPS", priority='high')
            return
        
        data = result['data']
        alerts = []
        
        # Verifica CPU
        cpu = data['cpu_percent']
        if cpu >= self.thresholds['cpu']['critical']:
            alerts.append(f'🔴 CPU CRÍTICA: {cpu}%')
        elif cpu >= self.thresholds['cpu']['warning']:
            alerts.append(f'⚠️ CPU Alta: {cpu}%')
        
        # Verifica Memória
        mem = data['memory']
        mem_pct = mem['percent']
        if mem_pct >= self.thresholds['memory']['critical']:
            alerts.append(f'🔴 Memória CRÍTICA: {mem_pct}% ({mem["used"]/1e9:.1f} GB)')
        elif mem_pct >= self.thresholds['memory']['warning']:
            alerts.append(f'⚠️ Memória Alta: {mem_pct}%')
        
        # Verifica Disco
        disk = data['disk']
        if disk['percent'] >= self.thresholds['disk']['critical']:
            alerts.append(f'🔴 Disco CRÍTICO: {disk["percent"]}%')
        elif disk['percent'] >= self.thresholds['disk']['warning']:
            alerts.append(f'⚠️ Disco Alto: {disk["percent"]}%')
        
        # Envia alertas se houver
        if alerts:
            message = self.format_alert_message(alerts, data)
            await self.send_alert(message, priority='high')
            
            # Tenta ações corretivas automáticas
            if mem_pct >= 90:
                await self.auto_remediation_memory()
        else:
            # Envia heartbeat silencioso (log apenas)
            print(f"[{datetime.now()}] Sistema OK - CPU: {cpu}%, Mem: {mem_pct}%")
    
    def format_alert_message(self, alerts: list, data: dict) -> str:
        """Formata mensagem de alerta"""
        mem = data['memory']
        disk = data['disk']
        
        return f"""
🚨 ALERTA DE SISTEMA - VPS Local

{chr(10).join(alerts)}

📊 Métricas:
• CPU: {data['cpu_percent']}%
• Memória: {mem['percent']}% ({mem['used']/1e9:.1f} GB / {mem['total']/1e9:.1f} GB)
• Disco: {disk['percent']}% ({disk['used']/1e9:.1f} GB / {disk['total']/1e9:.1f} GB)
• Uptime: {self.format_uptime(data['boot_time'])}

💡 Ações sugeridas:
{self.suggest_actions(alerts)}
        """
    
    def suggest_actions(self, alerts: list) -> str:
        """Sugere ações baseadas nos alertas"""
        suggestions = []
        
        if any('CPU' in a for a in alerts):
            suggestions.append("• `top` - Verificar processos com alto CPU")
            suggestions.append("• Considerar restart de serviços pesados")
        
        if any('Memória' in a for a in alerts):
            suggestions.append("• `free -h` - Verificar uso detalhado")
            suggestions.append("• `ps aux --sort=-%mem | head` - Top processos por memória")
            suggestions.append("• Considerar limpar cache: `sync && echo 3 > /proc/sys/vm/drop_caches`")
        
        if any('Disco' in a for a in alerts):
            suggestions.append("• `df -h` - Verificar uso por partição")
            suggestions.append("• `du -sh /var/log/*` - Verificar logs grandes")
            suggestions.append("• Limpar logs antigos: `journalctl --vacuum-time=7d`")
        
        return chr(10).join(suggestions) if suggestions else "• Monitorar situação"
    
    async def auto_remediation_memory(self):
        """Tenta limpar memória automaticamente"""
        print("[AUTO] Tentando liberar memória...")
        
        # Limpa caches do sistema
        result = await self.orchestrator.send_task('execute_shell', {
            'command': 'sync && echo 3 > /proc/sys/vm/drop_caches'
        })
        
        if result['status'] == 'success':
            await self.send_alert("✅ Memória liberada automaticamente", priority='low')
    
    async def send_alert(self, message: str, priority: str = 'normal'):
        """Envia alerta via Feishu"""
        # Implementação de envio Feishu
        print(f"[ALERTA {priority}] {message}")
    
    def format_uptime(self, boot_time: float) -> str:
        """Formata uptime legível"""
        import time
        uptime_seconds = time.time() - boot_time
        days = int(uptime_seconds // 86400)
        hours = int((uptime_seconds % 86400) // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        return f"{days}d {hours}h {minutes}m"

# Uso em heartbeat
async def heartbeat_monitor():
    orchestrator = KimiClawOrchestrator(...)
    monitor = VPSMonitor(orchestrator, 'feishu://alerts')
    
    while True:
        await monitor.check_system()
        await asyncio.sleep(300)  # 5 minutos
```

### 5.3 Caso 3: Automação de Backup e Logs

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTOMAÇÃO DE BACKUP                           │
└─────────────────────────────────────────────────────────────────┘

CENÁRIO: Backup automático de banco de dados e envio para nuvem

FLUXO:
1. Agendamento (cron) dispara tarefa às 02:00
   │
2. Kimi Claw inicia processo de backup
   │
3. Kimi solicita ao VPS:
   • Dump do MySQL
   • Compactação
   • Cálculo de checksum
   │
4. VPS executa:
   mysqldump totum > backup_$(date).sql
   gzip backup_*.sql
   sha256sum backup_*.sql.gz > checksum.txt
   │
5. VPS retorna metadados do backup
   │
6. Kimi coordena upload para S3/Cloud
   │
7. Kimi verifica integridade
   │
8. Kimi notifica via Feishu:
   
   ✅ Backup Concluído
   
   Arquivo: backup_2026-04-03.sql.gz
   Tamanho: 2.3 GB
   Duração: 12 min
   Checksum: a1b2c3d4...
   Destino: s3://totum-backups/
   
   Próximo backup: 2026-04-04 02:00
   │
9. Kimi agenda verificação de restauração (teste semanal)
```

### 5.4 Caso 4: Chatbot Inteligente com Acesso a Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                 CHATBOT INTELIGENTE                             │
└─────────────────────────────────────────────────────────────────┘

CENÁRIO: Cliente pergunta via WhatsApp/Feishu sobre pedido

FLUXO:
1. Cliente: "Qual o status do meu pedido #12345?"
   │
2. Kimi Claw recebe mensagem
   │
3. Kimi identifica intenção: consulta_pedido
   │
4. Kimi extrai entidade: pedido_id = 12345
   │
5. Kimi consulta VPS Local:
   {
     "action": "query_mysql",
     "params": {
       "query": "SELECT * FROM pedidos WHERE id = 12345",
       "database": "totum"
     }
   }
   │
6. VPS retorna dados do pedido
   │
7. Kimi consulta status de entrega:
   {
     "action": "query_api",
     "params": {"pedido_id": 12345, "tipo": "rastreio"}
   }
   │
8. Kimi consolida informações
   │
9. Kimi responde de forma natural:
   
   Olá! Encontrei seu pedido #12345 🎉
   
   📦 Status: Em transporte
   🚚 Transportadora: Total Express
   📍 Local atual: Centro de Distribuição - São Paulo
   📅 Previsão: 05/04/2026
   
   Última atualização: Hoje às 14:30
   
   Quer que eu te avise quando chegar?
   │
10. Cliente responde e conversa continua...
```

### 5.5 Caso 5: Orquestração Multi-VPS

```
┌─────────────────────────────────────────────────────────────────┐
│                ORQUESTRAÇÃO MULTI-VPS                           │
└─────────────────────────────────────────────────────────────────┘

CENÁRIO: Deploy em múltiplos servidores com Kimi orquestrando

ARQUITETURA:
┌──────────────┐
│  Kimi Claw   │ (Orquestrador Central)
└──────┬───────┘
       │
   ┌───┴───┬─────────┬─────────┐
   ▼       ▼         ▼         ▼
┌─────┐ ┌─────┐  ┌─────┐  ┌─────┐
│VPS 1│ │VPS 2│  │VPS 3│  │VPS 4│
│ Web │ │ API │  │ DB  │  │Cache│
└─────┘ └─────┘  └─────┘  └─────┘

FLUXO DE DEPLOY:
1. Desenvolvedor: "Fazer deploy da v2.5 em produção"
   │
2. Kimi cria plano de deploy:
   - Pre-check em todos os VPS
   - Backup do VPS 3 (DB)
   - Deploy VPS 2 (API) - aguardar health
   - Deploy VPS 1 (Web) - aguardar health
   - Smoke tests
   - Notificação
   │
3. Kimi executa sequencialmente via Redis
   │
4. Cada VPS reporta status
   │
5. Kimi toma decisões baseadas em resultados
   │
6. Em caso de falha: rollback automático
   │
7. Relatório final enviado
```

---

## 📐 Diagrama de Sequência Completo

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌──────┐
│ Usuário │     │Feishu/   │     │Kimi     │     │  Redis   │     │VPS   │
│         │     │Discord   │     │Claw     │     │  Broker  │     │Local │
└────┬────┘     └────┬─────┘     └────┬────┘     └────┬─────┘     └──┬───┘
     │               │                │               │              │
     │ Mensagem      │                │               │              │
     │──────────────►│                │               │              │
     │               │ Event          │               │              │
     │               │───────────────►│               │              │
     │               │                │               │              │
     │               │                │ Análise       │              │
     │               │                │────┐          │              │
     │               │                │    │          │              │
     │               │                │◄───┘          │              │
     │               │                │               │              │
     │               │                │ Publica Tarefa│              │
     │               │                │──────────────►│              │
     │               │                │               │              │
     │               │                │               │ Push         │
     │               │                │               │─────────────►│
     │               │                │               │              │
     │               │                │               │              │ Processa
     │               │                │               │              │────┐
     │               │                │               │              │    │
     │               │                │               │              │◄───┘
     │               │                │               │              │
     │               │                │               │ Publica Result
     │               │                │               │◄─────────────│
     │               │                │               │              │
     │               │                │ Recebe Result │              │
     │               │                │◄──────────────│              │
     │               │                │               │              │
     │               │                │ Formata Resposta             │
     │               │                │────┐          │              │
     │               │                │    │          │              │
     │               │                │◄───┘          │              │
     │               │                │               │              │
     │               │ Resposta       │               │              │
     │               │◄───────────────│               │              │
     │               │                │               │              │
     │ Notificação   │                │               │              │
     │◄──────────────│                │               │              │
     │               │                │               │              │
```

---

## 🔒 Considerações de Segurança

### Autenticação
- **Redis**: Sempre use `requirepass` + SSL/TLS
- **HTTP API**: Bearer tokens com rotação periódica
- **WebSocket**: Token-based auth na URL/query string

### Autorização
- Whitelist de comandos shell (nunca permitir rm/dd/fdisk)
- Path restrictions para operações de arquivo
- Rate limiting por tipo de operação

### Rede
- Redis não deve estar exposto publicamente (use VPN/Tailscale)
- Preferência por conexões TLS em todas as camadas
- Firewall restritivo (apenas portas necessárias)

### Logs e Auditoria
```python
# Exemplo de logging estruturado
log_entry = {
    "timestamp": "2026-04-03T14:30:00Z",
    "level": "INFO",
    "source": "kimi-claw",
    "target": "vps-local",
    "action": "query_mysql",
    "user_id": "user_123",
    "ip": "192.168.1.100",
    "success": True,
    "duration_ms": 45
}
```

---

## 🚀 Próximos Passos

1. **Implementar** o worker Python no VPS Local
2. **Configurar** Redis com autenticação e SSL
3. **Testar** comunicação com health checks
4. **Adicionar** ferramentas específicas do negócio
5. **Implementar** monitoramento e alertas
6. **Documentar** ferramentas customizadas

---

**Documentação criada em:** 2026-04-03  
**Versão:** 1.0  
**Autor:** TOT (Totum Operative Technology)  
**Status:** Draft - Aguardando revisão
