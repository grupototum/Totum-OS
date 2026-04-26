# Totum OS

Sistema operacional de agência com AI Command Center, Alexandria como second brain, agentes, fluxos e ferramentas operacionais.

## Direção do Produto

- **AI Command Center:** chat único para chamar agentes, trocar motor/IA, enviar contexto ou skill em Markdown e acompanhar um log resumido do que o agente está fazendo.
- **Alexandria:** central Knowledge First para fontes, artefatos, skills, POPs, decisões e pacotes de contexto exportáveis para Claude, Kimi, ChatGPT, Gemini e apps locais via MCP/exportadores futuros.
- **Agentes Input -> Output:** formulários guiados para gerar planejamento social, copy de ads, posts, SEO/growth, atendimento e carrosséis em Markdown revisável.
- **Fluxos:** área inspirada em Flowise/OpenClaw/Suna para automações e infraestrutura de agentes.

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

## Quick Start

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
git clone https://github.com/grupototum/Totum-OS.git
cd Totum-OS

# Deploy
./deploy.sh
```

## AnythingLLM como serviço interno

O AnythingLLM deve ficar fora deste repositório, em diretório irmão:

```bash
cd "/Users/israellemos/Documents/Pixel Systems"
git clone https://github.com/mintplex-labs/anything-llm anything-llm
```

O Totum OS conversa com ele pela Supabase Edge Function `agent-chat`, sem expor token no frontend.

Variáveis da função:

```env
ANYTHINGLLM_API_BASE=http://127.0.0.1:3001/api
ANYTHINGLLM_API_KEY=sua-chave-developer-api
ANYTHINGLLM_DEFAULT_WORKSPACE=totum-agents
ANYTHINGLLM_DEFAULT_MODE=chat
DISABLE_TELEMETRY=true
```

## URLs

- **Local:** http://localhost:5173 (frontend), http://localhost:3003 (api)
- **Produção:** http://apps.grupototum.com

## API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/health` | GET | Health check |
| `/api/transcribe` | POST | Processar transcrições |
| `/api/ingest` | POST | Ingerir no Supabase |
| `/api/webhook/:agent` | POST | Chamar agente |
| `/api/outputs` | GET | Listar outputs |

## Variáveis de Ambiente

Crie `.env` na pasta `api/`:

```env
SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_KEY=sua-chave-aqui
OLLAMA_URL=http://localhost:11434
MOCK_MODE=false
```

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** Node.js + Express
- **Processamento:** Ollama (IA local)
- **Database:** Supabase (PostgreSQL)
- **Deploy:** PM2 + Nginx
