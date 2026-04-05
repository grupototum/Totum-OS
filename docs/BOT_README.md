# 🤖 Bot Atendente Totum

Bot do Telegram para atendimento da equipe com IA local (Ollama + Llama 3.2).

## 🚀 Instalação Rápida

```bash
# 1. Clone ou copie os arquivos
cd /root/.openclaw/workspace

# 2. Execute o setup
chmod +x setup_bot.sh
./setup_bot.sh

# 3. Configure os responsáveis
nano .env  # Adicione os IDs do Telegram

# 4. Inicie o bot
./start_bot.sh
```

## 📋 Requisitos

- Python 3.8+
- Ollama instalado e rodando
- Modelo Llama 3.2: `ollama pull llama3.2`
- Token do Bot do Telegram (já configurado)

## 🎯 Funcionalidades

### 1. Roteamento Inteligente
- Classifica automaticamente: dúvida, tarefa, reclamação
- Decide: responde direto OU escala para humano
- Urgência: Score 1-5

### 2. Base de Conhecimento
- Processos internos da empresa
- FAQ automatizado
- Respostas contextuais

### 3. Criação de Tarefas
- Cria tarefas automaticamente
- Notifica responsáveis por departamento
- Histórico no banco SQLite

### 4. Escalonamento
- Escalona para humano quando necessário
- Notifica responsáveis via DM
- Registra tudo no histórico

## 📁 Estrutura

```
.
├── bot_atendente_totum.py    # Código principal
├── data/
│   ├── atendimento_bot.db    # Banco SQLite
│   └── base_conhecimento.txt # FAQ e processos
├── .env                      # Configurações (criar do .env.example)
├── setup_bot.sh              # Script de instalação
└── start_bot.sh              # Script de inicialização
```

## 🔧 Comandos do Bot

| Comando | Descrição |
|---------|-----------|
| `/start` | Iniciar atendimento |
| `/help` | Ver ajuda |
| `/status` | Ver minhas solicitações |

## 🎨 Fluxo do Usuário

```
/start
   ↓
[Menu Principal]
   ↓
├─ ❓ Dúvida → LLM responde → [✅ Resolveu?] [⚡ Criar tarefa] [📞 Humano]
├─ ⚡ Tarefa → Classifica → Cria no sistema → Notifica responsável
└─ 📞 Humano → Seleciona depto → Envia DM para responsável
```

## 📝 Personalização

### Adicionar novo processo à base de conhecimento:

Edite `data/base_conhecimento.txt`:
```
categoria|Pergunta?|Resposta completa|palavra1, palavra2, palavra3
```

Exemplo:
```
ferias|Como solicitar férias?|Para solicitar férias: 1) Avisar com 30 dias...|ferias, folga, descanso
```

### Configurar responsáveis:

1. Peça para cada responsável mandar `/start` para @userinfobot
2. Copie o ID numérico
3. Cole no arquivo `.env`:
```
TELEGRAM_ID_SUPORTE=123456789
TELEGRAM_ID_COMERCIAL=987654321
```

## 🐛 Troubleshooting

**Bot não responde:**
```bash
# Verificar se está rodando
ps aux | grep bot_atendente

# Reiniciar
./start_bot.sh
```

**Erro no LLM:**
```bash
# Verificar Ollama
curl http://localhost:11434/api/tags

# Se não estiver rodando:
ollama serve

# Se não tiver o modelo:
ollama pull llama3.2
```

**Erro no Telegram:**
- Verificar se token está correto no `.env`
- Verificar conexão com internet

## 📊 Monitoramento

Logs são salvos em tempo real. Para ver:
```bash
tail -f logs/bot.log  # se configurado logging para arquivo
```

Ou use pm2 para produção:
```bash
pm2 start bot_atendente_totum.py --name totum-bot
pm2 logs totum-bot
```

## 🔒 Segurança

- Token do bot nunca commitado (usar .env)
- Banco SQLite local (não exposto)
- Acesso apenas via Telegram

## 🚀 Roadmap

- [ ] Integração com WhatsApp Business
- [ ] Dashboard web de métricas
- [ ] Análise de sentimento
- [ ] Voz para texto (Whisper)
- [ ] Agendamento automático

---

**Feito com ❤️ pela equipe Totum**

---

## 📊 Opik Integration (Tracing e Monitoramento)

O bot agora possui integração com **Opik** (by Comet) para tracing e monitoramento das interações LLM.

### O que é Opik?
Plataforma open-source para observabilidade de aplicações LLM:
- 📈 Tracing de todas as chamadas
- 🧪 Avaliação de qualidade das respostas
- 📊 Dashboard em tempo real
- 🔍 Detecção de anomalias

### Modo Leve (Cloud)
Por padrão, o bot usa o modo **cloud** (mais leve):
- Não consome recursos locais
- Dados enviados para Comet.com
- Setup mínimo

### Configuração

```bash
# 1. Crie conta gratuita em:
# https://www.comet.com/signup

# 2. Obtenha sua API key e configure no .env:
nano .env
# Adicione: OPIK_API_KEY=sua-api-key

# 3. Inicie o bot normalmente
./start_bot.sh
```

✅ **API Key já configurada!** O Opik está pronto para uso.

### Acessar Dashboard
- **Cloud**: https://www.comet.com/opik
- Projeto: `totum-atendente-bot`

### Modo Self-Hosted (Opcional)
Se preferir dados 100% locais (consome mais recursos):

```bash
# Requer Docker + 4GB RAM extra
git clone https://github.com/comet-ml/opik.git
cd opik && ./opik.sh
# Acesse: http://localhost:5173
```

### Métricas Coletadas
- Tempo de resposta do LLM
- Tamanho de prompts e respostas
- Classificação das demandas
- Taxa de satisfação estimada
- Urgência das tarefas

---

