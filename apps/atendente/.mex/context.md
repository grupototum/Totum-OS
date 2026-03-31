# Atendente Totum - Contexto
## App: Bot de Atendimento Multi-Canal

---

## 🎯 Propósito

Bot inteligente para atendimento ao cliente via Telegram (futuramente WhatsApp), com IA local para privacidade e baixo custo.

---

## 🏗️ Arquitetura

### Stack
```
Runtime:       Python 3.11
LLM:           Ollama (Llama 3.2 local) / Groq API (cloud)
Telegram:      python-telegram-bot
DB:            SQLite
Transcrição:   Whisper (OpenAI)
Monitoramento: Opik (Comet)
```

### Fluxo de Mensagem
```
Usuário → Telegram
    ↓
Bot recebe mensagem
    ↓
[Se áudio] → Whisper → Texto
    ↓
Classificador (LLM)
    ↓
├── Dúvida → Base de conhecimento → Resposta
├── Tarefa → Criar tarefa → Notificar responsável
└── Reclamação → Escalar → Notificar gestor
    ↓
Resposta enviada
    ↓
Log no Opik
```

---

## 📁 Arquivos Principais

```
workspace/
├── bot_atendente_totum.py      # Código principal
├── opik_integration.py          # Monitoramento
├── whisper_integration.py       # Transcrição
├── opik_config.py              # Config Opik
├── start_bot.sh                # Script de start
└── data/
    ├── atendimento_bot.db      # Banco SQLite
    └── base_conhecimento.txt   # FAQ
```

---

## 🤖 Comportamento

### Personalidade
- Profissional mas amigável
- Respostas concisas
- Sempre oferece escalar para humano
- Usa emojis moderadamente

### Classificação Automática
1. **Dúvida** → Responde com base de conhecimento
2. **Tarefa** → Cria tarefa, notifica responsável
3. **Reclamação** → Prioridade alta, escala imediatamente
4. **Sugestão** → Registra, agradece

### Exemplo de Interação
```
Usuário: "Quando fica pronto o site?"

Bot: "Oi! 🙋‍♂️ Sobre prazos de desenvolvimento, preciso 
verificar com o time técnico. Vou criar uma tarefa 
para te retornarem em até 4h.

[ID: #1234] - Consulta prazo site

Posso ajudar com mais alguma coisa?"
```

---

## 🔧 Configuração

### Variáveis de Ambiente
```bash
TELEGRAM_TOKEN=seu_token_aqui
OPENAI_API_KEY=para_whisper
GROQ_API_KEY=para_alternativa_cloud
OPIK_API_KEY=para_monitoramento
```

### Comandos
```bash
# Iniciar bot
./start_bot.sh

# Ou direto
source venv/bin/activate && python3 bot_atendente_totum.py
```

---

## 📊 Monitoramento (Opik)

Métricas trackeadas:
- Quantidade de mensagens
- Tempo de resposta
- Tipos de classificação
- Urgência estimada
- Satisfação estimada

Dashboard: https://www.comet.com/opik

---

## 📝 Base de Conhecimento

Formato em `data/base_conhecimento.txt`:
```
Q: Qual horário de funcionamento?
A: Segunda a sexta, 9h às 18h.

Q: Como entrar em contato?
A: Por este chat, e-mail ou telefone.
```

---

## 🔄 Integrações Futuras

- [ ] WhatsApp Business API
- [ ] n8n para automações
- [ ] Totum System (tarefas)
- [ ] Cal.com (agendamento)

---

## 🐛 Troubleshooting

### Bot não responde
1. Verificar se Ollama está rodando: `ollama ps`
2. Verificar token no .env
3. Verificar logs: `tail -f logs/bot.log`

### Respostas lentas
- Alternar para Groq: definir `USE_GROQ=true`
- Ou verificar carga do servidor Ollama

---

*Contexto Atendente Totum v1.0*