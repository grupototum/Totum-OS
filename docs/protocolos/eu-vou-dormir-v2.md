# 🌙 Protocolo "Eu Vou Dormir" v2.0

**Autor:** TOT (Totum Operative Technology)  
**Criado:** 2026-04-04  
**Versão:** 2.0  
**Status:** Ativo

---

## 📋 Visão Geral

O Protocolo "Eu Vou Dormir" é o sistema noturno de inteligência da Totum. Enquanto Israel descansa, os agentes trabalham coletando informações, analisando tendências e preparando briefings estratégicos.

> 💡 *"Eu durmo, você descansa, mas a informação nunca dorme."* - TOT

---

## 🕐 Fluxo Noturno Completo

```
22:00 - Israel vai dormir
    ↓
22:05 - Ativação do Protocolo Noturno
    │
    ├─ 🤗 HUG (Hugging Face Scout)
    │   └─ Busca novos modelos, datasets, papers
    │
    ├─ 🛠️ TOOLIFY (Ferramentas Scout)
    │   └─ Monitora Product Hunt, alternativas, novas ferramentas
    │
    ├─ 🐙 GIT (GitHub Scout) 
    │   └─ Repositórios trending em automation, n8n, AI agents
    │
    ├─ 🐦 SABIÁ (Trends Brasil)
    │   └─ Eco do que brasileiros buscam sobre automação e IA
    │
    ├─ 🛰️ RADAR (Trends Global)
    │   └─ Movimentações globais em IA e frameworks
    │
    ├─ 🎬 TRANSCRITOR (Vídeos pendentes)
    │   └─ Processa vídeos acumulados para análise
    │
    └─ 🧠 ANALISTA (Análise Estratégica)
        └─ Compila insights cruzados de todos os agentes
    ↓
03:00 - Compilação do Relatório Matinal
    └─ Consolida todos os dados em briefing único
    ↓
08:00 - Israel recebe briefing completo
    └─ Via Discord/Notion/email (formato definido)
```

---

## 🤖 Agentes do Protocolo

### 1. HUG - Hugging Face Scout
- **Arquivo:** `scripts/hug_scout.py`
- **Função:** Monitorar Hugging Face por novos modelos e datasets
- **Output:** `/tmp/openclaw/hug_report.md`

### 2. TOOLIFY - Ferramentas Scout  
- **Arquivo:** `scripts/tool_scout.py`
- **Função:** Rastrear novas ferramentas no Product Hunt e alternativas
- **Output:** `/tmp/openclaw/tool_report.md`

### 3. GIT - GitHub Scout *(NOVO)*
- **Arquivo:** `scripts/git_scout.py`
- **Documentação:** `agents/git.md`
- **Função:** Repositórios trending em automation, n8n, supabase, AI agents
- **Output:** `/tmp/openclaw/git_scout_report.md`
- **Keywords:** automation, n8n, supabase, ai-agent, low-code, crm

### 4. SABIÁ - Trend Brasil *(NOVO)*
- **Arquivo:** `scripts/trend_br.py`
- **Documentação:** `agents/sabia.md`
- **Função:** Monitorar tendências brasileiras (Google Trends, Reddit, notícias)
- **Output:** `/tmp/openclaw/sabia_report.md`
- **Fontes:** Google Trends BR, r/brasil, r/desenvolvimento, notícias tech BR

### 5. RADAR - Trend Global *(NOVO)*
- **Arquivo:** `scripts/trend_global.py`
- **Documentação:** `agents/radar.md`
- **Função:** Tendências globais em IA, frameworks, automação
- **Output:** `/tmp/openclaw/radar_report.md`
- **Fontes:** GitHub Trending, Hacker News, Product Hunt, Reddit tech

### 6. TRANSCRITOR - Processamento de Vídeos
- **Arquivo:** `scripts/transcriptor.py`
- **Função:** Transcrever e sumarizar vídeos pendentes
- **Output:** `/tmp/openclaw/transcriptions/`

### 7. ANALISTA - Análise Estratégica
- **Arquivo:** `scripts/analyst_compiler.py`
- **Função:** Cruzar dados de todos os agentes e gerar insights
- **Output:** `/tmp/openclaw/morning_briefing.md`

---

## ⏰ Cronograma

| Horário (Brasília) | Agente(s) | Duração |
|-------------------|-----------|---------|
| 22:05 | HUG, TOOLIFY, GIT | 5 min |
| 22:15 | SABIÁ, RADAR | 10 min |
| 22:30 | TRANSCRITOR | 30 min |
| 23:00 | (processamento paralelo) | - |
| 03:00 | ANALISTA (compilação) | 10 min |
| 08:00 | Entrega ao Israel | - |

---

## 🚀 Execução Manual

### Rodar todos os agentes:
```bash
cd /root/.openclaw/workspace

# Agentes principais
python3 scripts/hug_scout.py
python3 scripts/tool_scout.py
python3 scripts/git_scout.py
python3 scripts/trend_br.py
python3 scripts/trend_global.py

# Compilador
python3 scripts/analyst_compiler.py
```

### Rodar agente específico:
```bash
python3 scripts/git_scout.py      # GitHub
echo $?

python3 scripts/trend_br.py       # SABIÁ Brasil
echo $?

python3 scripts/trend_global.py   # RADAR Global
echo $?
```

---

## 📁 Estrutura de Arquivos

```
workspace/
├── agents/
│   ├── git.md          # Documentação GitHub Scout
│   ├── sabia.md        # Documentação Trend BR
│   └── radar.md        # Documentação Trend Global
├── scripts/
│   ├── git_scout.py    # Agente GIT
│   ├── trend_br.py     # Agente SABIÁ
│   └── trend_global.py # Agente RADAR
├── protocolos/
│   └── eu-vou-dormir-v2.md  # Este arquivo
└── sql/
    └── agentes_novos.sql    # Inserção na tabela
```

---

## 📊 Output dos Relatórios

Cada agente gera relatórios em `/tmp/openclaw/`:

```
/tmp/openclaw/
├── hug_report.md
├── tool_report.md
├── git_scout_report.md
├── sabia_report.md
├── radar_report.md
├── morning_briefing.md    # Compilação final
└── cache/
    ├── hug_cache.json
    ├── git_scout_cache.json
    ├── sabia_cache.json
    └── radar_cache.json
```

---

## 🔧 Configuração

### Variáveis de Ambiente Necessárias:
```bash
# GitHub (opcional, aumenta rate limit)
export GITHUB_TOKEN="ghp_xxx"

# Notificações (opcional)
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Permissões:
```bash
chmod +x /root/.openclaw/workspace/scripts/*.py
```

---

## 🔄 Atualizações da v1 → v2

### Novos Agentes:
- ✅ GIT - GitHub Scout
- ✅ SABIÁ - Trend Brasil
- ✅ RADAR - Trend Global

### Melhorias:
- 🕐 Cronograma mais eficiente (22:30 consolidado)
- 📊 Categorização de relevância para Totum
- 🎯 Ações recomendadas (estudar/implementar/ignorar)
- 💾 Sistema de cache para evitar duplicados

---

## 📝 Notas de Operação

1. **Rate Limits:** Scripts respeitam rate limits com delays de 1s entre requisições
2. **Cache:** Cada agente mantém cache local para não reportar os mesmos itens
3. **Falhas:** Se um agente falha, os outros continuam (independência)
4. **Logs:** Saída em stdout + arquivo markdown
5. **Fallback:** Dados simulados disponíveis se APIs falharem

---

## 🎯 Métricas de Sucesso

- [ ] Todos os agentes executam sem erro
- [ ] Relatórios gerados diariamente às 03:00
- [ ] Zero duplicados na compilação final
- [ ] Israel recebe briefing antes das 08:00
- [ ] Pelo menos 1 insight acionável por semana

---

*Protocolo ativo desde 2026-04-04*  
*Mantido por: TOT (Totum Operative Technology)*
