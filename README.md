# 🚀 Totum - Pipeline + Apps Unificado

Sistema unificado de pipeline de processamento de conteúdo + aplicação React.

## 📁 Estrutura

```
.
├── api/                    # Backend Node.js
│   ├── routes/            # Scripts de processamento
│   ├── services/          # Serviços API
│   ├── outputs/           # Dados processados
│   ├── server.js          # Express server
│   └── package.json
├── src/                   # Frontend React
├── dist/                  # Build do frontend
├── ecosystem.config.js    # PM2 config
├── nginx.conf            # Configuração Nginx
└── deploy.sh             # Script de deploy
```

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd api && npm install && npm run dev
```

### Produção (VPS)

```bash
# Clone
git clone https://github.com/grupototum/Apps_totum_Oficial.git
cd Apps_totum_Oficial

# Deploy
./deploy.sh
```

## 🌐 URLs

- **Local:** http://localhost:5173 (frontend), http://localhost:3000 (api)
- **Produção:** http://apps.grupototum.com

## 📡 API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/health` | GET | Health check |
| `/api/transcribe` | POST | Processar transcrições |
| `/api/ingest` | POST | Ingerir no Supabase |
| `/api/webhook/:agent` | POST | Chamar agente |
| `/api/outputs` | GET | Listar outputs |

## ⚙️ Variáveis de Ambiente

Crie `.env` na pasta `api/`:

```env
SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_KEY=sua-chave-aqui
OLLAMA_URL=http://localhost:11434
MOCK_MODE=false
```

## 🛠️ Stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** Node.js + Express
- **Processamento:** Ollama (IA local)
- **Database:** Supabase (PostgreSQL)
- **Deploy:** PM2 + Nginx
