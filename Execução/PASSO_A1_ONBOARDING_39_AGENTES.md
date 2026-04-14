# 🤖 PASSO A1 — ONBOARDING 39 AGENTES

**Tempo Estimado**: 2-4 semanas (paralelo com Passo B)  
**Esforço**: 🔴 Alto  
**Complexidade**: 🟡 Média (repetitivo, mas claro)  
**Status**: Começar AGORA (durante deploy)

---

## 📌 RESUMO EXECUTIVO

Você vai transformar lista teórica de 39 agentes em agentes elizaOS **funcionais e testados**.

**Fases:**
1. **Inventário** (2-3 dias) — Mapear todos os 39 agentes
2. **DNAs** (3-5 dias) — Criar documentação técnica de cada um
3. **Criação elizaOS** (5-10 dias) — Configurar em dashboard
4. **Validação** (2-3 dias) — Testar cada agente
5. **Deploy** (1 dia) — Publicar tudo

**Total**: ~2-4 semanas se fizer steadily

---

## 📋 OS 39 AGENTES (Sua Lista)

Referência: `AGENTES_TOTUM_CATALOGO_COMPLETO.md` (arquivo que você tem)

### Tier 1 — Lab (Claude/Gemini — 5-6 agentes)

```
1.  LOKI        | Vendas & CRM
2.  MINERVA     | Análise de dados & BI
3.  ARCHIMEDES  | Arquitetura & Design de sistemas
4.  SHERLOCK    | Investigação & pesquisa
5.  EINSTEIN    | Criatividade & ideação
6.  (?) | Talvez mais um
```

### Tier 2 — Mid (Groq/OxyB — 10+ agentes)

```
7.   WANDA           | Social media content (Groq)
8.   KVIRTUALOSO    | Post generation (OxyB)
9.   SCRIVO         | Copywriting (Groq)
10.  VISU           | Image prompts (OxyB + Stable Diffusion)
11.  AUDITOR        | BI & auditoria (OxyB)
12.  PABLO          | Lead prospecting (OxyB)
13.  ANALYST        | Análise de tendências (Groq)
14.  MENTOR         | Mentorship & guidance (OxyB)
15.  GUARDIAN       | Compliance & governance (Groq)
16.  TRANSLATOR     | Multi-language translation (Groq)
(+ mais 3-4 em definição)
```

### Tier 3 — Fab (Ollama/Local — 24+ agentes)

```
Mechanical/Repetitive work (24/7 execution):

17.  SCRAPER-WEB       | Web scraping
18.  PROCESSOR-CSV     | CSV processing & validation
19.  MONITOR-NEWS      | News monitoring
20.  SCHEDULER         | Task scheduling & orchestration
21.  VALIDATOR         | Data validation
22.  CLEANER          | Data cleaning & normalization
23.  TAGGER           | Auto-tagging
24.  FORMATTER        | Output formatting
25.  LOGGER           | Structured logging
26.  RETRY-HANDLER    | Retry logic & backoff
27-39. [12 agentes a definir]
```

---

## ✅ FASE 1: INVENTÁRIO (2-3 dias)

### Objetivo

Criar spreadsheet/documento com informações de cada agente:

```
Nome | Tier | Modelo | Bio | Canais | Conhecimento | Status
```

### Passo 1: Abrir Seu Catalog

Você tem arquivo: `AGENTES_TOTUM_CATALOGO_COMPLETO.md`

Abra-o e revise os 39 agentes.

**Checkpoint**: Você tem a lista de 39? [ ] SIM → Continue

### Passo 2: Criar Inventário

Crie arquivo: `INVENTARIO_39_AGENTES.md`

Copie este template:

```markdown
# 📋 INVENTÁRIO DE 39 AGENTES

## TIER 1 — Lab (Claude/Gemini)

### 1. LOKI
- **Bio**: Agente especializado em vendas e CRM
- **Modelo**: Claude 3.7 Sonnet
- **Tier**: 1 (Lab)
- **Canais**: Telegram, Email, CRM webhook
- **Sistema Prompt**: "Você é LOKI, especialista em vendas..."
- **Conhecimento**: [Lista de docs]
- **Status**: ⏳ Pendente criação em elizaOS

### 2. MINERVA
- **Bio**: Análise de dados e BI
- **Modelo**: Gemini 2.5 Pro (context grande para análise)
- **Tier**: 1 (Lab)
- **Canais**: Dashboard, Email, Slack
- **Sistema Prompt**: "Você é MINERVA, analista de dados..."
- **Conhecimento**: [docs financeiros, métricas]
- **Status**: ⏳ Pendente criação em elizaOS

[... continue para todos os 39]
```

### Passo 3: Preencher Inventário

Para cada um dos 39 agentes:

```
Informação necessária:
✅ Nome (já tem)
✅ Bio (1-2 frases do que faz)
✅ Tier (1, 2, ou 3)
✅ Modelo (Claude, Gemini, Groq, OxyB, Ollama)
✅ Canais (Telegram, Discord, Email, HTTP, Slack, etc)
✅ Sistema Prompt (prototipado)
✅ Conhecimento (docs/skills necessárias)
```

**Use este comando para cada agente:**

```
Para Tier 1 (LOKI, MINERVA, etc):
├─ Tire info do seu histórico de documentos
├─ Se não tem: use Claude (chat) para gerar
│  Prompt: "Crie bio e system prompt para agente LOKI (vendas/CRM)"
└─ Adicione ao inventário

Para Tier 2 (WANDA, KVIRTUALOSO, etc):
├─ Padrão: mais específico que Tier 1
├─ Exemplo: "Gere posts de 280 caracteres em tom descontraído"
└─ Adicione ao inventário

Para Tier 3 (SCRAPER-WEB, PROCESSOR-CSV):
├─ Altamente mecânico/específico
├─ Exemplo: "Valide CSVs contra schema X, retorne erros em JSON"
└─ Adicione ao inventário
```

**Checkpoint**: Inventário completo com 39 agentes? [ ] SIM → Continue | [ ] NÃO → Completar agora

---

## ✅ FASE 2: DNAs (3-5 dias)

### Objetivo

Criar documentação técnica para cada agente que será usada na criação em elizaOS.

**DNA de Agente** = Documento com tudo que elizaOS precisa saber.

### Template DNA

Crie arquivo: `DNAS_39_AGENTES/LOKI.md`

```markdown
# 🧬 DNA DO AGENTE — LOKI

## Identidade
- **Nome**: LOKI
- **Emoji**: 🦊
- **Bio**: Especialista em vendas e CRM. Qualifica leads, propõe estratégias, fecha deals.
- **Lore**: "Antigo nórdico do comércio, agora domina persuasão digital"
- **Adjectives**: ["strategic", "persuasive", "analytical", "fast-thinking"]

## Implementação
- **Tier**: 1 (Lab)
- **Modelo**: Claude 3.7 Sonnet
- **Temperature**: 0.7 (criativo mas consistente)
- **Max Tokens**: 1500
- **Cost Estimation**: ~R$ 0.10 por execução (alto, é Tier 1)

## System Prompt

```
Você é LOKI, especialista em vendas B2B.

Sua missão: Qualificar leads, analisar oportunidades, propor estratégias de venda.

Estilo:
- Direto e estratégico
- Baseado em dados
- Criativo em soluções
- Nunca promete demais

Quando receber lead:
1. Analise: Empresa, setor, tamanho, desafio
2. Qualifique: ICP match? Potencial? Timeline?
3. Estratégia: Qual abordagem? Quem deve falar? Quando?
4. Output: JSON com score, recomendação, próximos passos

Sempre respeite: Nunca menta, sempre valide antes de afirmar
```

## Canais

### Telegram
- **Status**: Ativo
- **Bot Token**: [será preenchido em elizaOS]
- **Comportamento**: Responde com análise de leads

### CRM Webhook
- **Status**: Ativo (V2)
- **Endpoint**: POST /webhook/loki-crmupdate
- **Behavior**: Atualiza campos de lead no Pipedrive

## Conhecimento (Alexandria)

```
Documentos:
1. Sales_Framework_2026.md (nossa metodologia)
2. ICP_Profiles.json (perfis de clientes ideais)
3. Competitor_Analysis_2026.md (análise concorrencial)
4. Email_Templates_Sales.md (templates validados)

RAG Mode: Static (atualizar manualmente a cada trimestre)
Vector Search: Enabled (busca por similaridade)
```

## Skills

```
1. lead-qualifier
   - Input: lead JSON
   - Output: score + análise
   
2. strategy-recommender
   - Input: lead score + histórico
   - Output: estratégia de venda
   
3. email-generator
   - Input: lead info + template
   - Output: email personalizado
```

## Executores (Onde Roda)

```
Primário: Claude API (em produção, via n8n)
Fallback: Ollama local (backup se Claude indisponível)
```

## Observabilidade

```
Métricas rastreadas:
- Leads processados por dia
- Score médio de qualificação
- Taxa de conversão (depois)
- Tempo médio de resposta

Alertas:
- < 5 leads/dia: investigar
- Erro em CRM webhook: notificar
```

## Versioning

```
v1.0: Release inicial
v1.1: [Placeholder para futuras iterações]
```

## Próximos Passos

1. Criar em elizaOS dashboard
2. Testar com 5 leads reais
3. Calibrar temperature se necessário
4. Conectar com Pipedrive (V2)
5. Monitorar métricas
```

### Criar DNAs para Todos

```
Pasta: DNAS_39_AGENTES/
├─ LOKI.md
├─ MINERVA.md
├─ ARCHIMEDES.md
├─ ... (até 39 agentes)
└─ INDEX.md (índice dos 39)
```

**Onde conseguir info para preencher DNAs?**

```
Opção 1: Você tem documentação anterior
└─ Procure em seus arquivos: PERSONALIDADE_JARVIS_REAL.md, etc
└─ Use como base

Opção 2: Claude gera para você
└─ Prompt: "Crie DNA completo para agente WANDA (social media content)
           baseado no Vibe-Coding Playbook 2026"
└─ Claude gera, você revisa e ajusta

Opção 3: Híbrido (recomendado)
└─ Você preenche estrutura básica
└─ Claude complementa detalhes
└─ Você valida e publica
```

**Checkpoint**: DNAs criados para todos os 39? [ ] SIM → Continue | [ ] NÃO → Priorize Tier 1 e 2 primeiro

---

## ✅ FASE 3: CRIAÇÃO EM ELIZAOS (5-10 dias)

### Objetivo

Transformar cada DNA em agente funcional no dashboard elizaOS.

### Processo por Agente

Para cada um dos 39 agentes:

```
1. Abrir: https://seu-projeto.vercel.app/agents
2. Clicar: "Novo Agente"
3. Ir para: /agents/new/edit
4. Preencher 6 abas:
```

#### **ABA 1: Identidade**

```
Preencher:
- Nome: [do inventário]
- Bio: [do DNA]
- Emoji: [do DNA]
- Lore: [do DNA]
- Adjectives: [do DNA, separadas por vírgula]

Validar:
- Nome único (não repetido)
- Bio ≤ 200 caracteres
- Emoji válido (emoji único)
```

#### **ABA 2: Canais**

```
Se Telegram:
- [ ] Marcar checkbox "Telegram"
- [ ] Adicionar bot token (se configurado)
- [ ] Testar com bot

Se Discord:
- [ ] Marcar checkbox "Discord" (V2 para essa fase)

Se HTTP/Webhook:
- [ ] Adicionar endpoint (v2)

Se Email:
- [ ] Configurar (v2)
```

#### **ABA 3: Cérebro**

```
Preencher:
- Tier: [1, 2, ou 3 - do DNA]
- Modelo Override: [deixar em branco = usar padrão]
- Temperature: [0.3 para determinístico, 0.7-0.9 para criativo]
- Max Tokens: [típico: 1000-2000]
- System Prompt: [do DNA, completo]

Validar:
- System Prompt não está vazio
- Temperature entre 0 e 1
- Max Tokens > 0 e < 8000
```

#### **ABA 4: Alexandria**

```
Selecionar documentos de conhecimento:
- [ ] Checkbox documentos relevantes
- RAG Mode: "Static" (por enquanto)
- [ ] Validar seleção

Se agente é LOKI:
  [ ] Sales_Framework
  [ ] ICP_Profiles
  [ ] Competitor_Analysis

Se agente é WANDA:
  [ ] Social_Media_Guidelines
  [ ] Trending_Topics
  [ ] Brand_Voice_Guide
```

#### **ABA 5: Ações**

```
Deixar vazio por enquanto (V2 feature)
ou adicionar placeholder de skills se souber
```

#### **ABA 6: Preview**

```
Testar agente:
1. Digitar mensagem de teste no input
2. Clicar "Enviar"
3. Agente responde (ou erro aparece)
4. Se responde OK: ✓ Pronto para publicar
5. Se erro: debugar e voltar
```

### Batch Processing

**Não faça um por um!** Use estratégia:

```
Dia 1: Tier 1 (5-6 agentes)
       └─ Claude, Gemini — testes mais demorados
       └─ Depois de cada: validar em produção

Dia 2-4: Tier 2 (10+ agentes)
         └─ Groq, OxyB — mais rápidos
         └─ Batch de 3-4 por dia

Dia 5-9: Tier 3 (24+ agentes)
         └─ Ollama — bem mais rápidos
         └─ Batch de 5-8 por dia
         └─ Muitos copiam padrões de outros
```

### Checklist Criação elizaOS

Para cada agente criado:

```
[ ] Nome adicionado
[ ] Bio adicionada
[ ] Emoji selecionado
[ ] Tier correto (1, 2 ou 3)
[ ] Modelo correto (Claude, Gemini, Groq, OxyB, Ollama)
[ ] Temperature configurada
[ ] Max tokens configurado
[ ] System prompt completo
[ ] Alexandria documentos selecionados
[ ] Canais configurados (Telegram ou outro)
[ ] Preview testado (responde corretamente)
[ ] "Publicar" clicado
[ ] Agente aparece no dashboard ✓
[ ] DNA em pasta DNAS_39_AGENTES ✓
[ ] Documentação atualizada ✓
```

**Checkpoint**: Quantos agentes criados até agora? ___/39

---

## ✅ FASE 4: VALIDAÇÃO (2-3 dias)

### Objetivo

Confirmar que cada agente funciona corretamente em produção.

### Teste por Agente

Para cada um dos 39:

```
TESTE 1: Teste Isolado
└─ Abrir dashboard → clicar no agente
└─ Enviar 3 mensagens de teste
└─ Validar respostas coerentes
└─ Documentar resultado: ✅ PASS ou ❌ FAIL

TESTE 2: Teste em Supabase
└─ Abrir Supabase
└─ Tabela agents_config
└─ Procurar agente por nome
└─ Validar campos preenchidos:
   - name ✓
   - status = "active" ✓
   - exported_character = JSON válido ✓
   - tier correto ✓

TESTE 3: Teste de Exportação
└─ Clique menu "Exportar JSON"
└─ Validar character.json baixou
└─ Abrir arquivo, confirmar elizaOS format válido

TESTE 4: Teste de Persistência
└─ Editar algo no agente (ex: temperatura)
└─ Publicar
└─ Recarregar página
└─ Verificar mudança foi salva ✓
```

### Matriz de Validação

Crie documento: `VALIDACAO_39_AGENTES.md`

```markdown
# ✅ MATRIZ DE VALIDAÇÃO — 39 AGENTES

| # | Nome | Tier | Modelo | Teste Isolado | Supabase | Export | Persistência | Status |
|----|------|------|--------|---------------|----------|--------|--------------|--------|
| 1 | LOKI | 1 | Claude | ✅ | ✅ | ✅ | ✅ | PRONTO |
| 2 | MINERVA | 1 | Gemini | ✅ | ✅ | ✅ | ✅ | PRONTO |
| 3 | ARCHIMEDES | 1 | Claude | ⏳ | ⏳ | ⏳ | ⏳ | PENDENTE |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 39 | [último] | 3 | Ollama | ⏳ | ⏳ | ⏳ | ⏳ | PENDENTE |

RESUMO:
- Completos: _/39
- Pendentes: _/39
```

### Remediação

Se um agente falhar:

```
Erro: "Agent não responde"
└─ Verificar: Supabase está online?
└─ Verificar: Modelo tem quota (Claude, Gemini)?
└─ Debugar: Abrir DevTools → Console → Ver erro
└─ Corrigir: Editar agente, salvar novamente
└─ Reteste: Validar resposta

Erro: "JSON export inválido"
└─ Verificar: Adapter está gerando JSON?
└─ Debugar: Ver Supabase exported_character field
└─ Corrigir: Pode ser problema no sistema
└─ Escalar: Claude (chat) para debugar

Erro: "Persistência não funciona"
└─ Verificar: Supabase RLS policies?
└─ Verificar: SERVICE_ROLE_KEY tem permissão?
└─ Corrigir: Atualizar env vars se necessário
└─ Reteste: Tentar editar novamente
```

**Checkpoint**: Quantos agentes validados? ___/39 | Erro count: ___

---

## ✅ FASE 5: DEPLOY (1 dia)

### Objetivo

Garantir que todos os 39 agentes estão:
- ✅ Criados em elizaOS
- ✅ Validados e funcionando
- ✅ Documentados
- ✅ Publicados no GitHub

### Passo 1: Atualizar Documentação

```bash
# 1. Criar arquivo de resumo
touch ONBOARDING_39_AGENTES_COMPLETO.md

# 2. Conteúdo:
# - Lista de 39 agentes ✓
# - Status de cada um (PRONTO/PENDENTE)
# - Links para DNAs individuais
# - Métricas (tempo, custo estimado, etc)

# 3. Criar arquivo de versioning
touch AGENTES_VERSIONING.md

# 4. Conteúdo:
# - Versão da lista (v1.0)
# - Data de conclusão
# - Últimas mudanças
# - Próximas atualizações (v1.1)
```

### Passo 2: Commit Final

```bash
# Terminal na pasta do projeto

# 1. Add tudo
git add -A

# 2. Verificar
git status

# 3. Commit
git commit -m "feat: onboarding-39-agents complete

- 39 agentes criados em elizaOS
- 5 Tier 1 (Claude/Gemini)
- 10+ Tier 2 (Groq/OxyB)
- 24+ Tier 3 (Ollama local)
- Todos testados e validados
- Documentação completa em DNAS_39_AGENTES/
- Matriz de validação em VALIDACAO_39_AGENTES.md
- Exportações elizaOS OK"

# 4. Push
git push origin main

# 5. Verificar no GitHub que apareceu
```

### Passo 3: Atualizar Dashboard

```bash
# Na sua página em produção:
# https://seu-site.vercel.app/agents

# Você deve ver:
✓ 39 agentes listados
✓ Filtro funciona
✓ Cada um tem card com info
✓ Click abre editor completo
```

---

## 📊 CHECKLIST FINAL FASE A

```
[ ] Inventário com 39 agentes completo
[ ] DNAs criados para todos (pasta DNAS_39_AGENTES/)
[ ] Tier 1 (5-6) criados em elizaOS ✓
[ ] Tier 2 (10+) criados em elizaOS ✓
[ ] Tier 3 (24+) criados em elizaOS ✓
[ ] Todos testados isoladamente
[ ] Todos validados em Supabase
[ ] Todos exportam character.json válido
[ ] Matriz de validação atualizada (39/39 PRONTO)
[ ] Documentação completa publicada
[ ] Commits feitos no GitHub
[ ] 39 agentes visíveis no dashboard em produção
```

**Todos marcados?** [ ] SIM → PASSO A1 COMPLETO! ✅

---

## 🎯 PRÓXIMAS ETAPAS

Após PASSO A1 estar completo:

**Imediato**:
```
Celebrar ✨ Você tem 39 agentes funcionando!
Compartilhar com time: link do dashboard
```

**Próxima Fase** (OPÇÃO D - n8n):
```
Abrir: N8N_ORQUESTRACAO_WORKFLOWS.md
Começar a conectar agentes via n8n
```

---

## 🆘 FAQ

**P: Leva mesmo 2-4 semanas para 39?**
```
R: Depende de quantas horas/dia você dedica
   2-3h/dia = 4 semanas
   6-8h/dia = 2 semanas
   Fazendo em paralelo com outras coisas = 3-4 semanas
```

**P: E se um agente falhar no meio?**
```
R: Marque como PENDENTE
   Continua criando os outros
   Volta para problemas depois
   Não fica preso em um
```

**P: Preciso testar cada um manualmente?**
```
R: Sim, pelo menos:
   - 1 mensagem de teste
   - Confirmar responde sem erro
   - Pronto (não precisa de bateria inteira de testes)
```

**P: E os agentes Tier 3 (Ollama)?**
```
R: Muito mais rápidos porque:
   - Rodando localmente
   - Sem latência de API
   - Padrões copiam-se fácil
   - Batch de 5-8 por dia OK
```

---

**Pronto? Começamos PASSO A1 agora! 🚀**

Abra seu navegador: https://seu-projeto.vercel.app/agents
Comece criando TIER 1 agora!

