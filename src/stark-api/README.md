# 🚀 Stark API

API REST para gerenciamento de tarefas e integrações do sistema Totum.

## 📋 Endpoints

### Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tarefas` | Listar todas as tarefas |
| GET | `/api/tarefas/estatisticas` | Obter estatísticas |
| GET | `/api/tarefas/:id` | Obter tarefa por ID |
| POST | `/api/tarefas` | Criar nova tarefa |
| PATCH | `/api/tarefas/:id` | Atualizar tarefa |
| DELETE | `/api/tarefas/:id` | Deletar tarefa |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar status da API |

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📦 Variáveis de Ambiente

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-chave-de-servico
CORS_ORIGIN=http://localhost:5173,http://localhost:4173
```

## 📊 Estrutura da Tabela

### tarefas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Chave primária |
| titulo | TEXT | Título da tarefa |
| descricao | TEXT | Descrição detalhada |
| status | TEXT | pendente/em_andamento/concluida |
| responsavel | TEXT | Nome do responsável |
| prioridade | TEXT | baixa/media/alta/critica |
| deadline | TIMESTAMP | Data/hora limite |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

## 🔒 Segurança

- Helmet.js para headers de segurança
- CORS configurável
- RLS habilitado no Supabase
- Validação de entrada com Zod

## 📝 Exemplos de Uso

### Criar Tarefa
```bash
curl -X POST http://localhost:3001/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nova Tarefa",
    "descricao": "Descrição opcional",
    "status": "pendente",
    "prioridade": "alta",
    "responsavel": "Felipe",
    "deadline": "2026-04-10T18:00:00"
  }'
```

### Listar Tarefas
```bash
curl "http://localhost:3001/api/tarefas?status=pendente&prioridade=alta"
```

### Atualizar Tarefa
```bash
curl -X PATCH http://localhost:3001/api/tarefas/UUID_AQUI \
  -H "Content-Type: application/json" \
  -d '{"status": "concluida"}'
```

## 🚀 Deploy com PM2

```bash
# Instalar PM2
npm install -g pm2

# Criar configuração
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'stark-api',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

# Iniciar
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📄 Licença

MIT - Totum