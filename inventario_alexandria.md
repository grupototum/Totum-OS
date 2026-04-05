# 📚 Inventário Alexandria - Conteúdo para Migração

> **Giles, o Bibliotecário** - Inventário Completo do Workspace  
> Data: 2026-04-05  
> Versão: 1.0  
> Total de Itens: 180+

---

## 📋 ÍNDICE

1. [Sistema Core](#1-sistema-core)
2. [Agentes e Personas](#2-agentes-e-personas)
3. [Aplicações](#3-aplicações)
4. [Conhecimento e Documentação](#4-conhecimento-e-documentação)
5. [Infraestrutura](#5-infraestrutura)
6. [Dados e Bancos](#6-dados-e-bancos)
7. [Tarefas e Projetos](#7-tarefas-e-projetos)
8. [Métricas e Resumo](#8-métricas-e-resumo)

---

## 1. 🧠 SISTEMA CORE

### 1.1 Arquivos de Identidade

| Arquivo | Tipo | Tags | Categoria | Prioridade | Dependências |
|---------|------|------|-----------|------------|--------------|
| `AGENTS.md` | Config | #sistema #regras #behavior | Sistema/Core | 🔴 Alta | - |
| `SOUL.md` | Config | #sistema #personalidade #identidade | Sistema/Core | 🔴 Alta | AGENTS.md |
| `USER.md` | Config | #usuario #perfil #israel | Sistema/Core | 🔴 Alta | - |
| `IDENTITY.md` | Config | #tot #identidade #personalidade | Sistema/Core | 🔴 Alta | SOUL.md, USER.md |
| `TOOLS.md` | Config | #ferramentas #config-local | Sistema/Core | 🟡 Média | - |
| `HEARTBEAT.md` | Config | #monitoramento #automacao | Sistema/Core | 🟡 Média | AGENTS.md |
| `BOOTSTRAP.md` | Config | #inicializacao #setup | Sistema/Core | 🟢 Baixa | - |
| `TODO.md` | State | #tarefas #quadro #pendencias | Sistema/Estado | 🔴 Alta | - |

### 1.2 Memórias Diárias

| Arquivo | Tipo | Tags | Categoria | Data | Tamanho |
|---------|------|------|-----------|------|---------|
| `memory/2026-03-31.md` | Log | #memoria #log #marco | Memória/Histórico | 2026-03-31 | 10.8KB |
| `memory/2026-04-01.md` | Log | #memoria #log | Memória/Histórico | 2026-04-01 | 10.0KB |
| `memory/2026-04-02.md` | Log | #memoria #log | Memória/Histórico | 2026-04-02 | 18.9KB |
| `memory/2026-04-03.md` | Log | #memoria #log #hug #deep-talk | Memória/Histórico | 2026-04-03 | 27.7KB |
| `memory/2026-04-04.md` | Log | #memoria #log #plano-acao | Memória/Histórico | 2026-04-04 | 17.8KB |
| `memory/2026-04-05.md` | Log | #memoria #log #alexandria | Memória/Histórico | 2026-04-05 | 4.7KB |
| `memory/hug-analysis-2026-04-03.md` | Análise | #huggingface #analise #ferramentas | Memória/Análise | 2026-04-03 | 12.2KB |
| `memory/toolify-scan-2026-04-03.md` | Análise | #toolify #analise #ferramentas | Memória/Análise | 2026-04-03 | 12.1KB |

**Tags Comuns:** #memoria #continuidade #sessao #contexto

---

## 2. 🤖 AGENTES E PERSONAS

### 2.1 Agentes com Implementação (Código)

| Agente | Arquivo | Tipo | Tags | Status | Localização |
|--------|---------|------|------|--------|-------------|
| **GILES** | `agents/giles/ARQUITETURA.md` | Doc | #giles #arquitetura #alexandria | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/Modelfile` | Config | #giles #modelo #ollama | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/giles_schema_supabase.sql` | SQL | #giles #schema #supabase | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/schema_sqlite.sql` | SQL | #giles #schema #sqlite | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/giles-client.js` | Código | #giles #cliente #javascript | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/giles-client-supabase.js` | Código | #giles #cliente #supabase | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/teste-giles.js` | Test | #giles #teste | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/teste-giles-supabase.js` | Test | #giles #teste #supabase | ✅ Ativo | agents/giles/ |
| **GILES** | `agents/giles/fix_schema.sql` | SQL | #giles #fix | ✅ Ativo | agents/giles/ |

### 2.2 Definições de Agentes (Markdown)

| Agente | Arquivo | Tags | Personalidade | Localização |
|--------|---------|------|---------------|-------------|
| **TOT** | `src/agents/giles.md` | #tot #orquestrador #sistema | Engenheiro sistêmico, 75% profissional/25% humor | src/agents/ |
| **GILES** | `src/agents/giles.md` | #giles #bibliotecario #alexandria | Cientista da informação, metódico | src/agents/ |
| **MIGUEL** | `src/agents/miguel.md` | #miguel #ceo #arquiteto | Decidido, resiliente, estrategista | src/agents/ |
| **JARVIS** | `src/agents/pablo-marcal.md` | #jarvis #executor #tech | Executor técnico, pragmático | src/agents/ |
| **LIZ** | `src/agents/data.md` | #liz #guardia #coo | Protetora, organizada, operacional | src/agents/ |
| **DATA** | `src/agents/data.md` | #data #analista #metricas | Analítico, focado em dados | src/agents/ |
| **CHANDLER** | `src/agents/chandler.md` | #chandler #copywriter #humor | Copywriter, criativo, humor sarcástico | src/agents/ |
| **CHAPLIN** | `src/agents/chaplin.md` | #chaplin #video #criativo | Video maker, criativo, visual | src/agents/ |
| **WATSON** | `src/agents/watson.md` | #watson #pesquisa #investigacao | Investigador, analítico, detalhista | src/agents/ |
| **SABIA** | `src/agents/sabia.md` | #sabia #atendimento #humana | Atendimento humanizado, empática | src/agents/ |
| **TRANSCRITOR** | `src/agents/transcritor.md` | #transcritor #audio #texto | Transcrição, precisão | src/agents/ |
| **MONK** | `src/agents/monk.md` | #monk #qualidade #qa | Qualidade, perfeccionista | src/agents/ |
| **RADAR** | `src/agents/radar.md` | #radar #monitoramento #alertas | Vigilante, proativo | src/agents/ |
| **GUARDIAO** | `src/agents/guardiao.md` | #guardiao #seguranca #protecao | Protetor, segurança, vigilante | src/agents/ |
| **DONA-CLAWDETE** | `src/agents/dona-clawdete.md` | #dona-clawdete #investigacao #deducao | Detetive, dedutiva, curiosa | src/agents/ |
| **YODA** | `src/agents/yoda.md` | #yoda #sabedoria #mentor | Sábio, mentor, paciente | src/agents/ |
| **GIT** | `src/agents/git.md` | #git #versionamento #codigo | Versionamento, organização | src/agents/ |
| **ANALISTA** | `src/agents/analista.md` | #analista #estrategia #negocios | Estratégia, análise de negócio | src/agents/ |

### 2.3 Personas Detalhadas (docs/personas/)

| Persona | Arquivo | Tags | Descrição |
|---------|---------|------|-----------|
| GILES Cientista | `docs/personas/GILES_CIENTISTA_INFORMACAO.md` | #giles #persona #ciencia-info | Detalhamento profundo do Giles |
| Cartografo Totum | `docs/personas/PERSONALIDADE_CARTOGRAFO_TOTUM.md` | #cartografo #mapas #visual | Especialista em visualização |
| Controlador Totum | `docs/personas/PERSONALIDADE_CONTROLADOR_TOTUM.md` | #controlador #monitor #ops | Operações e controle |
| Diretor de Arte | `docs/personas/PERSONALIDADE_DIRETOR_ARTE.md` | #diretor-arte #design #criativo | Direção criativa |
| Especialista CRM | `docs/personas/PERSONALIDADE_ESPECIALISTA_CRM.md` | #crm #pixel #relacionamento | Especialista em CRM |
| JARVIS Real | `docs/personas/PERSONALIDADE_JARVIS_REAL.md` | #jarvis #executor #tech | Personalidade do Jarvis |
| LIZ Real | `docs/personas/PERSONALIDADE_LIZ_REAL.md` | #liz #guardia #coo | Personalidade da Liz |
| MIGUEL Real | `docs/personas/PERSONALIDADE_MIGUEL_REAL.md` | #miguel #ceo #fundador | Personalidade do Israel |
| Orquestrador | `docs/personas/PERSONALIDADE_ORQUESTRADOR_TOTUM.md` | #orquestrador #sistema #tot | Orquestração |
| Vendedor Totum | `docs/personas/PERSONALIDADE_VENDEDOR_TOTUM.md` | #vendedor #vendas #comercial | Especialista em vendas |

### 2.4 POPs (Protocolos Operacionais)

| POP | Arquivo | Tags | Responsável |
|-----|---------|------|-------------|
| Criação de Agentes | `docs/planos/POP-001-CRIACAO-AGENTES.md` | #pop #agentes #criacao | Sistema |
| Fignaldo | `src/agents/pops/fignaldo-pop.md` | #pop #design #figma | Design System |
| Kvirtuoso | `src/agents/pops/kvirtuoso-pop.md` | #pop #video #capcut | Vídeo |
| Radar Anúncios | `src/agents/pops/radar-anuncios-pop.md` | #pop #ads #monitoramento | Ads |
| Reportei | `src/agents/pops/reportei-pop.md` | #pop #relatorios #dados | Relatórios |

### 2.5 Checklists

| Checklist | Arquivo | Tags | Propósito |
|-----------|---------|------|-----------|
| Pablo Marçal | `src/agents/pablo-marcal-checklist.md` | #checklist #pablo #execucao | Checklist de execução |

---

## 3. 📱 APLICAÇÕES

### 3.1 App Principal - Totum

| Componente | Tipo | Tags | Descrição | Localização |
|------------|------|------|-----------|-------------|
| Aplicação React | Código | #app #react #totum #lovable | App principal Totum | `apps/totum/` |
| Documentação | Doc | #design-system #totum | Design System | `apps/totum/docs/DESIGN_SYSTEM.md` |
| Entrega | Doc | #entrega #tarefas #kanban | Documento de entrega | `apps/totum/ENTREGA_QUADRO_TAREFAS.md` |
| README | Doc | #readme #totum | Documentação principal | `apps/totum/README.md` |
| Quadro Tarefas | Doc | #quadro #tarefas #kanban | README do quadro | `apps/totum/QUADRO_TAREFAS_README.md` |
| Validação Forms | Doc | #forms #validacao #frontend | Validação de formulários | `apps/totum/VALIDACAO_FORMS.md` |
| Relatório Correções | Doc | #bugs #fixes #relatorio | Correções aplicadas | `apps/totum/RELATORIO_CORRECOES_TOTUM.md` |
| Relatório Status | Doc | #status #apps #relatorio | Status dos apps | `apps/totum/RELATORIO_STATUS_APPS_TOTUM.md` |
| Bugfix Agentes | Doc | #bugfix #agentes #tela-branca | Fix tela branca | `apps/totum/src/BUGFIX_AGENTES_TELA_BRANCA.md` |
| Migrations | SQL | #migrations #supabase #tarefas | SQL de migração | `apps/totum/migrations/` |
| Supabase Config | Config | #supabase #config | Configuração Supabase | `apps/totum/supabase/` |

### 3.2 App apps_totum (Duplicação - Consolidar)

| Componente | Tipo | Tags | Nota |
|------------|------|------|------|
| Aplicação | Código | #app #react #totum | ⚠️ CONSOLIDAR COM apps/totum |
| Migrations | SQL | #migrations #supabase | ⚠️ Verificar se há migrations exclusivas |

### 3.3 Stark API

| Componente | Tipo | Tags | Descrição | Localização |
|------------|------|------|-----------|-------------|
| API Backend | Código | #api #backend #stark #typescript | API principal | `src/stark-api/` |
| Deploy Script | Script | #deploy #stark | Script de deploy | `src/stark-api/deploy.sh` |
| README | Doc | #readme #stark | Documentação | `src/stark-api/README.md` |
| SQL Tarefas | SQL | #sql #tarefas #stark | Schema tarefas | `src/stark-api/sql/` |
| PM2 Config | Config | #pm2 #stark | Config PM2 | `src/stark-api/ecosystem.config.js` |

### 3.4 Context Hub

| Componente | Tipo | Tags | Descrição | Localização |
|------------|------|------|-----------|-------------|
| Core | Código | #context-hub #python #vector | Sistema de contexto | `src/context_hub/` |
| Curator Agent | Código | #curator #agente #python | Agente curador | `src/context_hub/core/curator_agent.py` |
| Vector Store | Código | #vector #chroma #python | Store vetorial | `src/context_hub/core/vector_store.py` |
| ChromaDB | Dados | #chroma #vectordb | Banco vetorial | `src/context_hub/data/chromadb/` |

### 3.5 Shared

| Componente | Tipo | Tags | Descrição | Localização |
|------------|------|------|-----------|-------------|
| Bot Atendente | Código | #bot #python #atendimento | Bot de atendimento | `src/shared/bot_atendente_totum.py` |
| Groq Integration | Código | #groq #llm #python | Integração Groq | `src/shared/groq_integration.py` |
| Opik Integration | Código | #opik #monitoring #python | Integração Opik | `src/shared/opik_integration.py` |
| Opik Config | Código | #opik #config | Config Opik | `src/shared/opik_config.py` |
| Whisper Integration | Código | #whisper #audio #python | Integração Whisper | `src/shared/whisper_integration.py` |

### 3.6 TARS Central

| Componente | Tipo | Tags | Descrição | Localização |
|------------|------|------|-----------|-------------|
| README | Doc | #tars #central #memoria | Documentação TARS | `src/tars-central/README.md` |
| Memórias | Doc | #memoria #conversas | Memórias profundas | `src/tars-central/memorias/` |

---

## 4. 📚 CONHECIMENTO E DOCUMENTAÇÃO

### 4.1 Documentação Principal (docs/)

#### Análises

| Documento | Tags | Descrição | Prioridade |
|-----------|------|-----------|------------|
| `ANALISE_ARQUITETURA_TOTUM.md` | #analise #arquitetura #totum | Análise arquitetura | 🔴 Alta |
| `ANALISE_CRITICA_SISTEMA.md` | #analise #critica #sistema | Crítica do sistema | 🔴 Alta |
| `ANALISE_MISSION_CONTROL.md` | #analise #mission-control | Análise Mission Control | 🟡 Média |
| `ANALISE_REPOSITORIOS_AGENTES.md` | #analise #repos #agentes | Análise repositórios | 🟡 Média |
| `ANALISE_TOTUM_SYSTEM.md` | #analise #totum #system | Análise sistema Totum | 🔴 Alta |
| `ANALISE_TRINDADE_X_BIBLIA.md` | #analise #trindade #biblia | Análise Trindade | 🔴 Alta |
| `ANALISE_TRINDADE_X_BIBLIA_DETALHADA.md` | #analise #trindade #biblia | Análise detalhada | 🔴 Alta |
| `ANALISE_VIDEOS_MAPA_SEMANTICO.md` | #analise #videos #mapa | Análise vídeos | 🟡 Média |
| `BIBLIA_CONTEUDO_COMPLETO.md` | #biblia #conteudo #completo | Bíblia de conteúdo | 🔴 Alta |
| `BIBLIA_POP_SLA_ESTRUTURA.md` | #biblia #pop #sla | Estrutura POP/SLA | 🔴 Alta |
| `PARECER_LOVABLE.md` | #parecer #lovable #tecnico | Parecer técnico Lovable | 🟡 Média |
| `PARECER_TECNICO_DASHBOARD.md` | #parecer #dashboard #tecnico | Parecer dashboard | 🟡 Média |
| `credit-farming-ia-visual.md` | #credit-farming #ia #visual | Credit farming visual | 🟢 Baixa |

#### Arquitetura

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `ARQUITETURA_TOTUM_CENTRAL.md` | #arquitetura #totum #central | Arquitetura central |
| `CENTRAL_CLIENTES_ARQUITETURA.md` | #arquitetura #clientes #crm | Arquitetura clientes |
| `CONTEXT_HUB_ARCHITECTURE.md` | #arquitetura #context-hub | Arquitetura Context Hub |
| `DECISAO_FINAL_ARQUITETURA_TOTUM.md` | #arquitetura #decisao #totum | Decisão arquitetura |
| `SLIDES_ARQUITETURA_TOTUM.html` | #arquitetura #slides #totum | Slides arquitetura |

#### Arquivados (Histórico)

| Documento | Tags | Status | Nota |
|-----------|------|--------|------|
| `AGENTES_FALTANTES.md` | #agentes #faltantes | 📦 Arquivado | Histórico |
| `AGENTES_FALTANTES_COMPLETO.md` | #agentes #faltantes | 📦 Arquivado | Histórico |
| `GITHUB_ISSUES_APPS_TOTUM.md` | #github #issues | 📦 Arquivado | Histórico |
| `GLOSSARIO_COMPENDIO_TOTUM.md` | #glossario #totum | 📦 Arquivado | Histórico |
| `GLOSSARIO_COMPENDIO_TOTUM_COMPLETO.md` | #glossario #totum | 📦 Arquivado | Histórico |
| `TOTUM_AGENTS_MASTER_PLAN.md` | #master-plan #agentes | 📦 Arquivado | Histórico |
| `TOTUM_CONTEXT_SYSTEM.md` | #context-system | 📦 Arquivado | Histórico |

#### Planos e Roadmaps

| Documento | Tags | Descrição | Prioridade |
|-----------|------|-----------|------------|
| `BACKLOG_MASTER_TOTUM.md` | #backlog #totum #master | Backlog master | 🔴 Alta |
| `CRONOGRAMA_MIGRACAO_STARK.md` | #cronograma #migracao #stark | Cronograma migração | 🔴 Alta |
| `PLANO_DE_ACAO_INTERATIVO.md` | #plano #acao #interativo | Plano interativo | 🔴 Alta |
| `PLANO_IMPLEMENTACAO_30DIAS.md` | #plano #implementacao #30dias | Plano 30 dias | 🔴 Alta |
| `PLANO_MIGRACAO_COM_DOCKER.md` | #plano #migracao #docker | Plano com Docker | 🟡 Média |
| `PLANO_MIGRACAO_SEM_DOCKER.md` | #plano #migracao | Plano sem Docker | 🟡 Média |
| `PLANO_MIGRACAO_VPS_STARK.md` | #plano #migracao #vps | Plano VPS Stark | 🔴 Alta |
| `ROADMAP_MISSION_CONTROL.md` | #roadmap #mission-control | Roadmap | 🔴 Alta |
| `ROADMAP_TOTUM_UNIFICADO.md` | #roadmap #totum #unificado | Roadmap unificado | 🔴 Alta |

#### Configurações e Setups

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `ALIBABA_ACCESS_QUICK.md` | #alibaba #cloud #access | Acesso rápido Alibaba |
| `ALIBABA_CLOUD_ACCESS.md` | #alibaba #cloud #access | Acesso Alibaba |
| `CLOUD_ALTERNATIVES.md` | #cloud #alternativas | Alternativas cloud |
| `CLOUD_DRIVE_VPS.md` | #cloud #drive #vps | Drive VPS |
| `CLOUD_SETUP.md` | #cloud #setup | Setup cloud |
| `PLUGINS_SETUP.md` | #plugins #setup | Setup plugins |
| `INTEGRACAO_OPENCLAW_KIMI_VPS.md` | #openclaw #kimi #vps | Integração OpenClaw |

#### Bots e Automação

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `BOT_README.md` | #bot #readme | README bot |
| `BOT_DIAGNOSTICO.md` | #bot #diagnostico | Diagnóstico bot |
| `BOT_CONVERSA_NATURAL.md` | #bot #conversa #natural | Conversa natural |
| `ESTRATEGIA_BOTS_TOTUM.md` | #bots #estrategia #totum | Estratégia bots |
| `TESTE_BOT_REALIZADO.md` | #bot #teste | Teste realizado |

#### Lovable e Prompts

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `LOVABLE_PROMPTS_COMPLETOS.md` | #lovable #prompts #completos | Prompts completos |
| `LOVABLE_PROMPTS_PRONTOS.md` | #lovable #prompts #prontos | Prompts prontos |
| `PROMPT_DASHBOARD_TOTUM.md` | #prompt #dashboard #totum | Prompt dashboard |
| `PROMPT_LOVABLE_AGENTES.md` | #prompt #lovable #agentes | Prompt agentes |
| `PROMPT_LOVABLE_FINAL.md` | #prompt #lovable #final | Prompt final |
| `PROMPT_LOVABLE_HIERARQUIA_AGENTES.txt` | #prompt #hierarquia #agentes | Prompt hierarquia |
| `PROMPT_LOVABLE_SIDEBAR_CLAUDE.txt` | #prompt #sidebar #claude | Prompt sidebar |
| `PROMPT_LOVABLE_TOTUM.md` | #prompt #lovable #totum | Prompt Totum |
| `PROMPT_TESTE_DASHBOARD.md` | #prompt #teste #dashboard | Prompt teste |

#### Dicas e Referências

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `DICAS_PROMPTS_CLAUDE.md` | #dicas #prompts #claude | Dicas prompts |
| `DICAS_PROMPTS_CLAUDE_V2.md` | #dicas #prompts #claude | Dicas prompts v2 |
| `EXPLICACAO_DEPLOY.md` | #deploy #explicacao | Explicação deploy |
| `IMPLEMENTACAO_TAREFAS_RESUMO.md` | #implementacao #tarefas | Resumo implementação |
| `INSTRUCOES_USO.md` | #instrucoes #uso | Instruções de uso |
| `LEMBRETES.md` | #lembretes | Lembretes |
| `RESEARCH_INOVACAO.md` | #research #inovacao | Pesquisa inovação |
| `RESUMO_ENTREGAS_FINAIS.md` | #resumo #entregas | Resumo entregas |
| `ROADMAP_FASES_SIMPLES.txt` | #roadmap #fases | Roadmap simples |
| `SOLUCAO_DEFINITIVA_ESTABILIDADE.md` | #solucao #estabilidade | Solução estabilidade |

#### Ollama e TTS

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `ollama-setup.md` | #ollama #setup | Setup Ollama |
| `ollama-quickref.md` | #ollama #quickref | Quick ref Ollama |
| `ollama-checklist.txt` | #ollama #checklist | Checklist Ollama |
| `piper-tts-setup.md` | #piper #tts #setup | Setup Piper TTS |

#### Problemas e Soluções

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `BUG3_FIX_PLANO_ACAO.md` | #bug #fix #plano-acao | Fix bug 3 |
| `MODELO_COBRANCA_WHATSAPP.md` | #cobranca #whatsapp #modelo | Modelo cobrança |
| `sistema-modo-madrugada.md` | #madrugada #sistema | Modo madrugada |
| `protocolo-definido-2026-04-04.md` | #protocolo #definido | Protocolo |
| `protocolo-vou-dormir-2026-04-04.md` | #protocolo #dormir | Protocolo dormir |

### 4.2 Sistema MEX

| Componente | Tipo | Tags | Descrição |
|------------|------|------|-----------|
| `mex/README.md` | Doc | #mex #readme | Documentação MEX |
| `mex/index.json` | JSON | #mex #indice | Índice mestre |
| `mex/schemas/context.schema.json` | Schema | #mex #schema #context | Schema contextos |
| `mex/schemas/metadata.schema.json` | Schema | #mex #schema #metadata | Schema metadata |
| `mex/contexts/alexandria/index.json` | JSON | #mex #alexandria | Contexto Alexandria |
| `mex/contexts/stark/index.json` | JSON | #mex #stark | Contexto Stark |
| `mex/contexts/stark/deploy_react_vps.json` | JSON | #mex #stark #deploy | Deploy React |
| `mex/contexts/totum/index.json` | JSON | #mex #totum | Contexto Totum |

### 4.3 Alexandria (apps/alexandria/)

| Componente | Tipo | Tags | Descrição |
|------------|------|------|-----------|
| `README.md` | Doc | #alexandria #readme | Documentação Alexandria |
| `banco-de-skills.md` | Doc | #skills #banco | Banco de skills |
| `skills/skill-codigos-001.md` | Doc | #skill #codigos | Skill códigos |

---

## 5. 🔧 INFRAESTRUTURA

### 5.1 Docker

| Arquivo | Tags | Descrição |
|---------|------|-----------|
| `docker-compose-final.yml` | #docker #compose #final | Compose final |
| `docker-compose-grupototum-completo.yml` | #docker #compose #completo | Compose completo |
| `docker-compose-simples.yml` | #docker #compose #simples | Compose simples |
| `docker-compose-traefik-upixel.yml` | #docker #compose #traefik | Compose Traefik |

### 5.2 Scripts

| Script | Tags | Descrição |
|--------|------|-----------|
| `bot-monitor.sh` | #bot #monitor #script | Monitor bot |
| `start_bot.sh` | #bot #start | Start bot |
| `setup_bot.sh` | #bot #setup | Setup bot |
| `kickstart.sh` | #kickstart | Kickstart |
| `git-sync` | #git #sync | Sync git |
| `totum-sync` | #sync #totum | Sync Totum |
| `totum-sync-gdrive` | #sync #gdrive | Sync GDrive |
| `setup_groq.sh` | #groq #setup | Setup Groq |
| `setup_opik.sh` | #opik #setup | Setup Opik |

### 5.3 Scripts (pasta scripts/)

| Script | Tags | Descrição |
|--------|------|-----------|
| `analista.py` | #python #analista | Analista |
| `git_scout.py` | #python #git | Git Scout |
| `trend_br.py` | #python #trends | Trends BR |
| `trend_global.py` | #python #trends | Trends Global |
| `health-check.sh` | #health #check | Health check |
| `backup-docker-completo.sh` | #backup #docker | Backup Docker |
| `backup-memories.sh` | #backup #memories | Backup memórias |
| `backup-apps-evolution.sh` | #backup #apps | Backup apps |
| `daily-report-generator.sh` | #daily-report | Daily report |
| `pipeline_conteudo.sh` | #pipeline #conteudo | Pipeline conteúdo |
| `install-ollama.sh` | #install #ollama | Install Ollama |
| `instalar_cyberpanel_openclaw.sh` | #install #cyberpanel | Install CyberPanel |
| `remover-cyberpanel.sh` | #remove #cyberpanel | Remove CyberPanel |

### 5.4 Configs

| Config | Tags | Descrição |
|--------|------|-----------|
| `groq-setup.md` | #groq #setup | Setup Groq |
| `gemini-setup.md` | #gemini #setup | Setup Gemini |

---

## 6. 💾 DADOS E BANCOS

### 6.1 Bancos de Dados

| Banco | Tipo | Tags | Descrição | Tamanho |
|-------|------|------|-----------|---------|
| `totum_claw.db` | SQLite | #sqlite #totum #claw | Banco principal | ~? |
| `atendimento_bot.db` | SQLite | #sqlite #bot #atendimento | Banco atendimento | ~? |

### 6.2 Backups

| Backup | Tipo | Tags | Descrição |
|--------|------|------|-----------|
| `latest.tar.gz` | Arquivo | #backup #latest | Link para último |
| `totum_backup_*.tar.gz` | Arquivo | #backup #totum | Backups diários |

### 6.3 Logs

| Log | Tags | Descrição |
|-----|------|-----------|
| `bot.log` | #log #bot | Log bot |
| `ollama.log` | #log #ollama | Log Ollama |
| `ollama_install.log` | #log #ollama #install | Install log |
| `ollama_pull.log` | #log #ollama #pull | Pull log |
| `persistencia.log` | #log #persistencia | Persistência |
| `totum-sync.log` | #log #sync #totum | Sync Totum |

---

## 7. 📋 TAREFAS E PROJETOS

### 7.1 Tarefas Principais

| Tarefa | Tags | Status | Prioridade |
|--------|------|--------|------------|
| `agente-criador-postagens.md` | #agente #postagens | 🟡 Pendente | Média |
| `agente-fignaldo-design-system.md` | #agente #fignaldo #design | 🟡 Pendente | Média |
| `agente-radar-criador-anuncios.md` | #agente #radar #anuncios | 🟡 Pendente | Média |
| `analisar-syncthing-pos-ferias.md` | #syncthing #pos-ferias | 🟡 Pendente | Baixa |
| `apps-nao-instalados-diagnostico.md` | #apps #diagnostico | ✅ Feito | - |
| `arquitetura-sentinela-subagentes.md` | #arquitetura #sentinela | 🟡 Pendente | Alta |
| `arquitetura-totum-integrada.md` | #arquitetura #totum | 🟡 Pendente | Alta |
| `ativar-canva-ai-magic-studio.md` | #canva #ai #magic | 🟡 Pendente | Baixa |
| `conectar-claudio-claude-api.md` | #claudio #claude #api | 🟡 Pendente | Média |
| `configurar-figma-ai-design-system.md` | #figma #ai #design | 🟡 Pendente | Média |
| `criar-agente-reportei.md` | #agente #reportei | 🟡 Pendente | Média |
| `credit-farming-acoes.md` | #credit-farming | 🟢 Baixa | Baixa |
| `instalar-ias-servidor-dedicado.md` | #ias #servidor | 🟡 Pendente | Alta |
| `instalar-ollama-servidor-dedicado.md` | #ollama #servidor | 🟡 Pendente | Alta |
| `mapear-creditos-manus.md` | #manus #creditos | 🟢 Baixa | Baixa |
| `pablo-prioridades-pos-plano-acao.md` | #pablo #prioridades | 🟡 Pendente | Alta |
| `pablo-tarefas-dia-1.md` | #pablo #tarefas | 🟡 Pendente | Alta |
| `pagina-agentes-hierarquica.md` | #pagina #agentes | ✅ Feito | - |
| `sentinela-monitoramento.md` | #sentinela #monitoring | 🟡 Pendente | Alta |
| `testar-runway-gen3.md` | #runway #gen3 | 🟢 Baixa | Baixa |
| `upgrade-disco-vps.md` | #vps #upgrade | 🟡 Pendente | Média |
| `upload-apps-totum-github.md` | #github #upload | ✅ Feito | - |

### 7.2 SQLs de Tarefas

| Arquivo | Tags | Descrição |
|---------|------|-----------|
| `COPIAR_COLAR_SUPABASE.sql` | #sql #supabase #tarefas | SQL tarefas |
| `EXECUTAR_SUPABASE.sql` | #sql #supabase | Execução |
| `ESQUEMA_N8N_AGENTES.md` | #n8n #agentes #esquema | Esquema N8N |
| `INSERIR_AGENTES_SUPABASE.sql` | #sql #agentes #supabase | Insert agentes |
| `README_SUPABASE.md` | #readme #supabase | README |
| `setup_tarefas_plano_acao.sql` | #sql #tarefas #plano | Setup tarefas |
| `setup_tarefas_supabase.sql` | #sql #tarefas #supabase | Setup Supabase |
| `tarefa_instalar_cyberpanel.sql` | #sql #cyberpanel | Tarefa CyberPanel |
| `tarefa_n8n_supabase_keepalive.sql` | #sql #n8n #keepalive | Keepalive N8N |
| `inserir_tarefas_plano_acao.sql` | #sql #tarefas | Insert tarefas |

### 7.3 Scripts de Tarefas

| Script | Tags | Descrição |
|--------|------|-----------|
| `diagnostico.sh` | #diagnostico | Diagnóstico |
| `executar_sql.sh` | #sql #exec | Executar SQL |
| `inserir_agentes_supabase.js` | #js #agentes #supabase | Insert agentes |
| `insert_tarefas.js` | #js #tarefas | Insert tarefas |
| `supabase_insert_analista.md` | #supabase #analista | Insert analista |
| `supabase_tarefas.js` | #js #tarefas #supabase | Tarefas Supabase |

### 7.4 Documentação Tarefas

| Documento | Tags | Descrição |
|-----------|------|-----------|
| `GUIA_INSTALACAO_CYBERPANEL.md` | #guia #cyberpanel | Guia instalação |
| `INSTRUCOES_SUPABASE.md` | #instrucoes #supabase | Instruções |
| `MAPA_COMPLETO_AGENTES_TOTUM.md` | #mapa #agentes #totum | Mapa agentes |
| `n8n_workflow_supabase_keepalive.json` | #n8n #workflow | Workflow N8N |
| `planilha-maquinas-ia-consolidada.md` | #planilha #ia #maquinas | Planilha |
| `RESUMO_TAREFAS_PLANO_ACAO.md` | #resumo #tarefas | Resumo |
| `CRIAR_BOT_PABLO_KIMI_CLAW.md` | #bot #pablo #kimi | Criar bot |
| `ROTEIRO_INSTALACAO_MANUAL.md` | #roteiro #instalacao | Roteiro |

### 7.5 Relatórios

| Relatório | Tags | Descrição |
|-----------|------|-----------|
| `tarefas-implementacao-2026-04-04.md` | #relatorio #tarefas #implementacao | Implementação |

### 7.6 Especificações

| Especificação | Tags | Descrição |
|---------------|------|-----------|
| `plano-acao-funcional.md` | #plano #acao #funcional | Plano funcional |

---

## 8. 📊 MÉTRICAS E RESUMO

### 8.1 Contagem por Categoria

| Categoria | Quantidade | Tamanho Estimado | Prioridade Média |
|-----------|------------|------------------|------------------|
| **Sistema Core** | 8 arquivos | ~50KB | 🔴 Alta |
| **Memórias** | 8 arquivos | ~130KB | 🔴 Alta |
| **Agentes (defs)** | 18 arquivos | ~100KB | 🔴 Alta |
| **Agentes (código)** | 9 arquivos | ~80KB | 🔴 Alta |
| **Personas** | 10 arquivos | ~150KB | 🟡 Média |
| **POPs** | 5 arquivos | ~50KB | 🔴 Alta |
| **Apps (docs)** | 10 arquivos | ~200KB | 🔴 Alta |
| **Apps (código)** | ~500 arquivos | ~60MB | 🔴 Alta |
| **Documentação** | ~60 arquivos | ~1MB | 🔴 Alta |
| **Infra/Scripts** | ~35 arquivos | ~370KB | 🟡 Média |
| **Dados/DBs** | ~15 arquivos | ~7MB | 🔴 Alta |
| **Tarefas** | ~30 arquivos | ~500KB | 🟡 Média |
| **MEX** | 8 arquivos | ~64KB | 🔴 Alta |
| **Alexandria** | 3 arquivos | ~20KB | 🔴 Alta |
| **TOTAL** | **~720 itens** | **~70MB** (sem node_modules) | - |

### 8.2 Dependências Principais

```
AGENTS.md
  ├── SOUL.md
  ├── USER.md
  └── HEARTBEAT.md

USER.md
  └── IDENTITY.md (deriva)

apps/totum/
  ├── docs/DESIGN_SYSTEM.md
  ├── migrations/
  └── src/

GILES
  ├── agents/giles/ARQUITETURA.md
  ├── agents/giles/giles_schema_supabase.sql
  └── alexandria/ (usa)

MEX
  ├── schemas/*.json
  └── contexts/*/

STARK-API
  ├── src/stark-api/sql/
  └── src/shared/*_integration.py
```

### 8.3 Sugestão de Tags Universais

**Categorias:**
- `#sistema` - Arquivos core do sistema
- `#agente-[nome]` - Documentação de agente específico
- `#alexandria` - Conteúdo da biblioteca
- `#app-[nome]` - Aplicações
- `#infra` - Infraestrutura
- `#doc` - Documentação
- `#codigo` - Código fonte
- `#config` - Configurações
- `#memoria` - Memórias/logs
- `#tarefa` - Tarefas pendentes

**Status:**
- `#ativo` - Em uso
- `#arquivado` - Histórico
- `#pendente` - Aguardando ação
- `#deprecado` - Substituído

**Prioridade:**
- `#p0` - Crítico
- `#p1` - Alto
- `#p2` - Médio
- `#p3` - Baixo

---

## 9. 🎯 RECOMENDAÇÕES DE MIGRAÇÃO

### 9.1 Ordem de Migração

1. **Fase 1 - Sistema Core** (P0)
   - AGENTS.md, SOUL.md, USER.md, IDENTITY.md
   - Memórias recentes (últimos 7 dias)

2. **Fase 2 - Conhecimento** (P0)
   - Toda documentação de docs/
   - Personas
   - POPs
   - Análises e arquiteturas

3. **Fase 3 - Agentes** (P1)
   - Definições de agentes
   - Implementações
   - Schemas

4. **Fase 4 - Aplicações** (P1)
   - Documentação dos apps
   - Migrations importantes

5. **Fase 5 - Infra e Scripts** (P2)
   - Scripts críticos
   - Documentação de infra

6. **Fase 6 - Histórico** (P2)
   - Memórias antigas
   - Arquivos arquivados

### 9.2 Estrutura Sugerida no Alexandria

```
alexandria/
├── 📁 sistema/              # Sistema Core
│   ├── core/               # AGENTS, SOUL, USER...
│   └── memoria/            # Logs diários
├── 📁 agentes/              # Todos os agentes
│   ├── tot/
│   ├── giles/
│   ├── miguel/
│   └── ...
├── 📁 conhecimento/         # Documentação organizada
│   ├── arquitetura/
│   ├── analises/
│   ├── planos/
│   └── processos/
├── 📁 apps/                 # Documentação de apps
│   ├── totum/
│   └── stark-api/
├── 📁 infra/                # Infraestrutura
│   ├── scripts/
│   ├── docker/
│   └── configs/
└── 📁 pop/                  # Protocolos operacionais
    └── POP-*.md
```

---

## 10. ✅ CHECKLIST DE MIGRAÇÃO

- [ ] Verificar duplicações antes de migrar
- [ ] Manter histórico de versões
- [ ] Atualizar links internos
- [ ] Indexar conteúdo para busca
- [ ] Validar integridade pós-migração
- [ ] Documentar decisões de migração
- [ ] Treinar Giles no novo conteúdo

---

*Inventário elaborado por: Giles 🧙‍♂️*  
*Data: 2026-04-05*  
*Total de itens catalogados: 180+*  
*Status: Pronto para migração*
