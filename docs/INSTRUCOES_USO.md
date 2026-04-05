# 🚀 Instruções de Uso - Agentes Noturnos v2.0

**Data:** 2026-04-04  
**Versão:** 2.0  
**Autor:** TOT (Totum Operative Technology)

---

## 📦 Resumo dos Novos Agentes

| Agente | Arquivo | Função | Output |
|--------|---------|--------|--------|
| 🐙 GIT | `scripts/git_scout.py` | GitHub trending | `/tmp/openclaw/git_scout_report.md` |
| 🐦 SABIÁ | `scripts/trend_br.py` | Tendências Brasil | `/tmp/openclaw/sabia_report.md` |
| 🛰️ RADAR | `scripts/trend_global.py` | Tendências Globais | `/tmp/openclaw/radar_report.md` |

---

## ⚡ Quick Start

### 1. Instalar Dependências

```bash
pip install requests beautifulsoup4
```

### 2. Configurar Permissões

```bash
chmod +x /root/.openclaw/workspace/scripts/*.py
```

### 3. Testar Individualmente

```bash
cd /root/.openclaw/workspace

# Testar GitHub Scout
python3 scripts/git_scout.py

# Testar SABIÁ (Brasil)
python3 scripts/trend_br.py

# Testar RADAR (Global)
python3 scripts/trend_global.py
```

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente (Opcional)

```bash
# No ~/.bashrc ou ~/.zshrc

# GitHub (aumenta rate limit de 60 para 5000 req/hora)
export GITHUB_TOKEN="ghp_seu_token_aqui"

# Discord Webhook (para notificações)
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Como obter GitHub Token:
1. Acesse: https://github.com/settings/tokens
2. Generate new token (classic)
3. Marque apenas: `public_repo`
4. Copie o token e adicione às variáveis de ambiente

---

## ⏰ Configurar Cron (Automatização)

### Editar crontab:
```bash
crontab -e
```

### Adicionar linhas:
```cron
# Protocolo "Eu Vou Dormir" - Todos os agentes às 22:30 BRT
30 22 * * * cd /root/.openclaw/workspace && /usr/bin/python3 scripts/git_scout.py >> /tmp/openclaw/logs/git.log 2>&1
30 22 * * * cd /root/.openclaw/workspace && /usr/bin/python3 scripts/trend_br.py >> /tmp/openclaw/logs/sabia.log 2>&1
30 22 * * * cd /root/.openclaw/workspace && /usr/bin/python3 scripts/trend_global.py >> /tmp/openclaw/logs/radar.log 2>&1

# Compilador às 03:00
0 3 * * * cd /root/.openclaw/workspace && /usr/bin/python3 scripts/analyst_compiler.py >> /tmp/openclaw/logs/compiler.log 2>&1
```

### Criar pasta de logs:
```bash
mkdir -p /tmp/openclaw/logs
```

---

## 📊 Estrutura dos Relatórios

Cada relatório segue o formato:

```markdown
# [Emoji] [Nome do Agente] - [DATA]

## 📊 Resumo
...

## ⭐ Destaques
...

## 🎯 Análise Totum
- Relevância explicada
- Ação recomendada: [ESTUDAR/IMPLEMENTAR/IGNORAR]

## 📝 Recomendações
...
```

---

## 🗄️ Banco de Dados

### Inserir agentes na tabela:

```bash
# Conectar ao PostgreSQL
psql -U seu_usuario -d seu_banco

# Executar SQL
\i /root/.openclaw/workspace/sql/agentes_novos.sql
```

### Verificar inserção:
```sql
SELECT nome, slug, status, horario_execucao 
FROM public.agentes 
WHERE status = 'ativo';
```

---

## 🔄 Fluxo Completo

```
22:30 → Agentes executam em paralelo
        ├─ GIT: Coleta repos do GitHub (2-3 min)
        ├─ SABIÁ: Coleta trends BR (3-4 min)
        └─ RADAR: Coleta trends global (4-5 min)

03:00 → ANALISTA compila tudo
        └─ Gera morning_briefing.md

08:00 → Israel recebe briefing
        └─ Via Discord/email/Notion
```

---

## 🐛 Troubleshooting

### Erro: "Rate limit exceeded"
```bash
# Solução: Adicionar GITHUB_TOKEN
export GITHUB_TOKEN="ghp_xxx"
```

### Erro: "Module not found"
```bash
# Solução: Instalar dependências
pip install requests beautifulsoup4
```

### Erro: "Permission denied"
```bash
# Solução: Ajustar permissões
chmod +x scripts/*.py
```

### Relatório vazio
- Verifique conexão com internet
- Alguns serviços podem estar indisponíveis
- Scripts têm fallback para dados simulados

---

## 📁 Arquivos Criados

```
workspace/
├── agents/
│   ├── git.md              ✅ Documentação GIT
│   ├── sabia.md            ✅ Documentação SABIÁ
│   └── radar.md            ✅ Documentação RADAR
├── scripts/
│   ├── git_scout.py        ✅ Script Python GIT
│   ├── trend_br.py         ✅ Script Python SABIÁ
│   └── trend_global.py     ✅ Script Python RADAR
├── protocolos/
│   └── eu-vou-dormir-v2.md ✅ Protocolo atualizado
└── sql/
    └── agentes_novos.sql   ✅ SQL de inserção
```

---

## 📞 Suporte

Se algo der errado:
1. Verifique logs em `/tmp/openclaw/logs/`
2. Teste scripts individualmente
3. Verifique variáveis de ambiente
4. Consulte documentação em `agents/*.md`

---

*Feito com 🤖 por TOT*  
*Para Israel dormir tranquilo enquanto a informação trabalha*
