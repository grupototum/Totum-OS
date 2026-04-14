# 🔗 PASSO D1 — N8N ORQUESTRAÇÃO

**Tempo Estimado**: 1-2 semanas (paralelo com Passo A)  
**Esforço**: 🟡 Médio  
**Complexidade**: 🟡 Média (lógica de workflows, não código)  
**Status**: Começar após Passo A ter 10-15 agentes

---

## 📌 RESUMO EXECUTIVO

n8n = **Ferramenta de Orquestração** que conecta seus 39 agentes em workflows automáticos.

**O que você vai fazer:**

```
Agentes isolados:
LOKI (vendas) → responde sozinho
WANDA (social) → responde sozinha
ANALYZER → responde sozinho

Com n8n:
Lead chega → LOKI analisa → ANALYZER valida → NOTIFIER avisa
Tudo automático, 24/7, sem cliques manuais!
```

---

## 🏗️ ARQUITETURA

```
┌──────────────────┐
│  Canais Externos │
├──────────────────┤
│ • Telegram       │
│ • Discord        │
│ • Email          │
│ • Webhooks       │
│ • API Externas   │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────┐
    │  n8n (Orquestração)     │
    │  ┌─────────────────┐    │
    │  │ Workflows       │    │
    │  │ ├─ Validação    │    │
    │  │ ├─ Lógica       │    │
    │  │ ├─ Transformação│    │
    │  │ └─ Roteamento   │    │
    │  └─────────────────┘    │
    └────────┬────────────────┘
             │
    ┌────┬───┴────┬────┐
    ▼    ▼        ▼    ▼
  LOKI WANDA ANALYZER NOTIFIER
  (API) (API) (API)  (API)
  
  Cada agente = endpoint HTTP
  n8n chama cada um conforme workflow
```

---

## ✅ ETAPA 1: Setup n8n (1 dia)

### Opção 1: n8n Cloud (Recomendado - Mais Fácil)

```bash
# 1. Abra: https://n8n.io/cloud
# 2. Clique "Sign up"
# 3. Crie conta (email + senha)
# 4. Email de confirmação (abra e confirme)
# 5. Dashboard n8n aberto ✓

Plano:
- Free: 50 execuções/mês (OK para começar)
- Pro: $25/mês (recomendado se usa muito)
```

### Opção 2: Self-Hosted (VPS - Mais Controle)

```bash
# No seu VPS (187.127.4.140)

# 1. SSH
ssh root@187.127.4.140

# 2. Instalar Docker (se não tem)
apt update && apt install -y docker.io docker-compose

# 3. Criar docker-compose.yml
cat > /root/n8n/docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=israel
      - N8N_BASIC_AUTH_PASSWORD=sua_senha_aqui
      - DB_TYPE=sqlite
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
EOF

# 4. Rodar
docker-compose up -d

# 5. Acessar em: http://187.127.4.140:5678
```

**Recomendação**: Se é primeira vez, use **n8n Cloud** (menos config).

**Checkpoint**: n8n rodando? [ ] SIM → Continue

---

## ✅ ETAPA 2: Conectar elizaOS APIs (1 dia)

Seu n8n precisa de acesso às APIs do elizaOS.

### Passo 1: Expor APIs elizaOS

Seu elizaOS já tem APIs (Passo 1 do começo):

```bash
# Suas APIs são:

GET    /api/agents                    # Listar agentes
POST   /api/agents                    # Criar agente
GET    /api/agents/:id                # Obter detalhes
PATCH  /api/agents/:id                # Atualizar
DELETE /api/agents/:id                # Deletar
POST   /api/agents/:id/execute        # IMPORTANTE: Executar agente!
```

O endpoint **CRÍTICO** é:

```bash
POST /api/agents/:id/execute
├─ Input:  { message: string, context?: object }
└─ Output: { response: string, metadata: object }
```

### Passo 2: Testar Executar Agente

```bash
# No seu terminal, teste a API:

curl -X POST https://seu-projeto.vercel.app/api/agents/loki/execute \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Novo lead: João Silva, empresa XYZ",
    "context": {"source": "telegram"}
  }'

# Você deve receber:
{
  "success": true,
  "response": "Análise: João é qualified lead. Score 8.5...",
  "metadata": { "tokens": 450, "model": "claude", ... }
}
```

**Se funcionar**: ✓ Pronto para n8n

**Se não funcionar**: 
- Debugar: Agente LOKI existe em elizaOS?
- Verificar: Endpoint está publicado em produção?
- Testar: `npm run dev` localmente e chamar localhost primeiro

**Checkpoint**: API /execute responde? [ ] SIM → Continue

---

## ✅ ETAPA 3: Criar Primeiro Workflow (1-2 dias)

### Workflow 1: "Lead → Analysis → Notify"

Este workflow:
1. Recebe lead (via Telegram ou webhook)
2. Passa para LOKI analisar
3. LOKI dá score
4. Se score > 7 → notifica via Slack/Email
5. Se score ≤ 7 → arquiva para depois

### Passo 1: Abrir n8n

```
1. Acesse seu n8n: https://n8n.cloud (ou seu VPS)
2. Login
3. Clique "Create new workflow"
4. Você vê canvas branco
```

### Passo 2: Criar Nodes

**Node 1: Webhook (Entrada)**

```
1. Clique "+" no canvas
2. Procure: "Webhook"
3. Clique em "Webhook"
4. Configure:
   - Method: POST
   - Path: /lead-intake (nome customizável)
   - Salve
5. n8n gera URL:
   https://seu-n8n.com/webhook/lead-intake
```

**Node 2: LOKI Execute**

```
1. Clique "+" depois do Webhook
2. Procure: "HTTP Request"
3. Configure:
   - Method: POST
   - URL: https://seu-projeto.vercel.app/api/agents/loki/execute
   - Headers:
     Content-Type: application/json
   - Body:
     {
       "message": "{{$node['Webhook'].json.lead_info}}",
       "context": {
         "source": "n8n",
         "workflow": "lead-analysis"
       }
     }
   - Send Query: No
   - Salve
4. Renomeie para "LOKI Analyze"
```

**Node 3: IF - Score Check**

```
1. Clique "+" depois do LOKI
2. Procure: "IF"
3. Configure:
   - If:
     - Field: $node['LOKI Analyze'].json.metadata.score
     - Operator: >
     - Value: 7
   - Salve
4. Cria dois caminhos: TRUE (score > 7) e FALSE (score ≤ 7)
```

**Node 4a: Notify Slack (TRUE path)**

```
1. No path TRUE, clique "+"
2. Procure: "Slack"
3. Configure:
   - Authentication: Conectar sua workspace Slack
   - Mensagem:
     "🔥 Lead qualificado!
      {{$node['LOKI Analyze'].json.response}}
      Score: {{$node['LOKI Analyze'].json.metadata.score}}"
   - Salve
```

**Node 4b: Archive (FALSE path)**

```
1. No path FALSE, clique "+"
2. Procure: "HTTP Request"
3. Configure (opcional):
   - Salvar lead em database
   - ou enviar para Google Sheets
   - ou apenas logar
```

**Node 5: End (ambos os paths)**

```
1. Clicar fim de cada path
2. Adicionar "End" node
3. Salve
```

### Passo 3: Testar Workflow

```
1. Clique "Test workflow" (botão verde no topo)
2. Clique "Listen"
3. n8n gera URL de teste:
   https://seu-n8n.com/webhook/lead-intake
4. Em outro terminal, teste:
   curl -X POST https://seu-n8n.com/webhook/lead-intake \
     -H "Content-Type: application/json" \
     -d '{
       "lead_info": "João Silva, Empresa XYZ, 50 pessoas"
     }'
5. Você verá workflow executando em tempo real
6. LOKI vai responder
7. Se score > 7, Slack recebe notificação
```

**Checkpoint**: Workflow funciona? [ ] SIM → Continue | [ ] NÃO → Debugar cada node

---

## ✅ ETAPA 4: Criar Mais Workflows (3-5 dias)

Você agora sabe criar workflows. Faça mais:

### Workflow 2: "Daily News Monitoring"

```
Trigger: Scheduler (todo dia às 8h)
├─ Node 1: List top news (HTTP request externa)
├─ Node 2: SCRAPER-WEB processar URLs
├─ Node 3: ANALYZER fazer insights
├─ Node 4: FORMATTER gerar relatório HTML
└─ Node 5: Email enviar para time
```

**Template**:

```
Trigger: Cron (todo dia 08:00 UTC)
├─ Call API: NewsAPI.org
├─ For Each result:
│  ├─ Call SCRAPER-WEB
│  ├─ Call ANALYZER
│  └─ Store resultado
└─ Call FORMATTER
└─ Send Email with HTML
```

### Workflow 3: "Social Media Content Generator"

```
Trigger: Manual (você clica "Execute") OU Scheduler (2x/semana)
├─ Node 1: Get trending topics (Twitter API)
├─ Node 2: WANDA gerar ideas
├─ Node 3: KVIRTUALOSO gerar posts
├─ Node 4: VISU gerar image prompts
└─ Node 5: Store em database + notify
```

### Workflow 4: "CRM Lead Sync"

```
Trigger: Webhook (Pipedrive CRM → n8n)
├─ Node 1: Receive lead from Pipedrive
├─ Node 2: LOKI analyze
├─ Node 3: Update Pipedrive com score
├─ Node 4: Assign agente (baseado em especialidade)
└─ Node 5: Notify Slack
```

**Padrão a Copiar**:

```
Para cada novo workflow:
1. Define trigger (webhook, scheduler, manual, API)
2. Define agentes que vão executar (LOKI, WANDA, etc)
3. Define lógica (if/else, loops, transformações)
4. Define saídas (email, Slack, database, CRM)
5. Testa com dados exemplo
6. Ativa e monitora
```

---

## ✅ ETAPA 5: Monitoramento e Logs (2-3 dias)

### Node 6: Logging (em cada workflow)

```
Adicionar ao fim de cada workflow:

Node Final: Supabase Insert
├─ Table: agent_executions
├─ Insert:
   - workflow_name
   - status (success/error)
   - input_data
   - output_data
   - timestamp
   - duration_ms
```

Isso cria histórico completo de todas execuções.

### Visualizar Resultados

```
No dashboard elizaOS:
1. Abrir agente
2. Nova aba "Executions" (se implementar)
3. Ver histórico de quantas vezes executou
4. Ver respostas dadas
5. Ver erros se houver
```

### Alertas

```
Configure em n8n:
- Se workflow falha 3x seguidas → notificar
- Se tempo de execução > 5min → aviso
- Se taxa de erro > 10% → escalar
```

---

## 📊 WORKFLOWS RECOMENDADOS (por ordem de prioridade)

| # | Workflow | Agentes | Trigger | Frequência | Impacto |
|----|----------|---------|---------|-----------|---------|
| 1 | Lead Intake | LOKI | Webhook | Real-time | 🔴 CRÍTICO |
| 2 | Daily Digest | SCRAPER, ANALYZER, FORMATTER | Scheduler | 1x/dia | 🟢 Alto |
| 3 | Social Content | WANDA, KVIRTUALOSO | Scheduler | 2x/semana | 🟢 Alto |
| 4 | CRM Sync | LOKI, NOTIFIER | Webhook | Real-time | 🟡 Médio |
| 5 | Content Review | GUARDIAN, TRANSLATOR | Scheduler | 1x/semana | 🟡 Médio |
| 6 | Data Cleaning | CLEANER, VALIDATOR | Scheduler | 1x/noite | 🟢 Necessário |

**Fazer em ordem?** Comece por 1 e 2, depois expande.

---

## 🔌 INTEGRAÇÃO COM EXTERNOS

Além dos seus 39 agentes, n8n pode chamar:

```
CRMs:
├─ Pipedrive: leadinsert webhook
├─ HubSpot: contact update
├─ Salesforce: record upsert

Comunicação:
├─ Slack: send message
├─ Email: send via SMTP
├─ Discord: webhook
├─ Telegram: send message

Dados:
├─ Google Sheets: insert row
├─ Airtable: insert record
├─ Supabase: insert/update (já tem)
├─ Database: qualquer SQL

Externas:
├─ Twitter/X: post tweet
├─ LinkedIn: share content
├─ NewsAPI: get articles
├─ Weather API: get forecast
```

**Padrão**: Para cada integração, n8n tem node pronto.

---

## 📋 CHECKLIST N8N SETUP

```
[ ] n8n instalado e rodando
[ ] Acesso ao dashboard
[ ] Testei Webhook endpoint
[ ] Conectei elizaOS API
[ ] Criei Workflow 1 (Lead Analysis)
[ ] Workflow 1 testado com dados reais
[ ] Criei Workflow 2 (Daily Digest)
[ ] Criei Workflow 3 (Social Content)
[ ] Criei Workflow 4 (CRM Sync)
[ ] Logging configurado (Supabase agent_executions)
[ ] Alertas configurados
[ ] Todos workflows em produção (ativados)
[ ] 5+ agentes executando via n8n
[ ] Documentação de workflows criada
[ ] Commits no GitHub
```

**Todos marcados?** [ ] SIM → PASSO D1 COMPLETO! ✅

---

## 🎯 MÉTRICAS MONITORADAS

Após tudo rodando, rastreie:

```
Diariamente:
- Workflows executados: ___ (meta: >50)
- Taxa de sucesso: ___% (meta: >95%)
- Tempo médio de execução: ___ ms (meta: <5000ms)
- Erros: ___ (meta: 0-2)

Semanalmente:
- Total de leads processados: ___
- Leads convertidos: ___
- Tendências de conteúdo descobertas: ___
- Otimizações necessárias: ___

Mensalmente:
- Custo de execução (APIs): R$ ___
- ROI estimado (quanto economizou em automação): R$ ___
- Próximos workflows a adicionar: ___
```

---

## 🚀 PRÓXIMAS INTEGRAÇÕES (V2)

Após estabilizar n8n com workflows básicos:

```
V2 Additions:
├─ Machine Learning (detecção de spam, classificação automática)
├─ Mais CRMs (HubSpot, Salesforce)
├─ Dashboard de métricas (Grafana)
├─ Versionamento de workflows (backup automático)
├─ A/B testing (testar diferentes fluxos)
└─ Advanced scheduling (não just time-based)
```

---

## 📖 DOCUMENTAÇÃO

Crie arquivo: `N8N_WORKFLOWS_DOCUMENTATION.md`

```markdown
# n8n Workflows Documentation

## Workflow: Lead Intake

**Purpose**: Receber leads, analisar com LOKI, notificar team

**Trigger**: POST /webhook/lead-intake
**Frequency**: Real-time
**Agentes**: LOKI
**Output**: Slack notification + database log

**Nodes**:
1. Webhook → lead data
2. LOKI Execute → analysis
3. IF check → score
4. Slack notify → team
5. Log execution

**Teste Com**:
```
curl -X POST https://seu-n8n.com/webhook/lead-intake \
  -d '{"lead_info": "..."}' \
  -H "Content-Type: application/json"
```

[... continue para cada workflow]
```

---

## 🆘 Troubleshooting

### Erro: "Node failed"

```
Verificar:
1. Conexão de internet OK?
2. elizaOS API online?
3. Agente especificado existe?
4. Formato de JSON correto?

Debug:
1. Ver logs do node (clique em node → ver output)
2. Ver logs de n8n (console/logs)
3. Testar API manualmente com curl
```

### Erro: "Timeout"

```
Solução:
1. Aumentar timeout em HTTP node (default 30s)
2. Verificar agente não está travado
3. Ver CPU/memoria do servidor
4. Considerar versão de cache se agente é muito lento
```

### Workflow não executa no scheduler

```
Verificar:
1. Workflow está "ativado" (toggle verde)?
2. Timezone correto em n8n?
3. Horário correto? (cron expression)
4. Ver logs se erro aparece na execução agendada
```

---

## 🎉 RESULTADO FINAL

Após completar PASSO D1:

```
Você tem:
✅ 39 agentes criados em elizaOS
✅ 5+ workflows automatizados em n8n
✅ Agentes executando 24/7 sem intervenção humana
✅ Leads sendo processados automaticamente
✅ Conteúdo gerado automaticamente
✅ Relatórios enviados diariamente
✅ Tudo logado e monitorado

Sistema funciona sozinho!
Você gerencia, não executa.
```

---

## ✅ CHECKLIST FINAL

```
[ ] n8n rodando e acessível
[ ] 5+ agentes integrados (LOKI, WANDA, ANALYZER, etc)
[ ] 3+ workflows criados e testados
[ ] Logging em Supabase funcionando
[ ] Alertas configurados
[ ] Documentação de workflows atualizada
[ ] Commits no GitHub
[ ] Dashboard elizaOS mostra execuções
[ ] Time consegue acompanhar execuções
[ ] Sistema está em produção (não beta)
```

**Todos marcados?** [ ] SIM → PASSO D1 COMPLETO! ✅

---

**Pronto? Começamos PASSO D1! 🚀**

Use este roadmap para:
1. Completar PASSO B1 (Deploy)
2. Iniciar PASSO A1 (39 Agentes - paralelo)
3. Quando A1 tiver 15+ agentes → Começar PASSO D1 (n8n)

**Total: ~4-6 semanas para sistema COMPLETO + orquestrado**

