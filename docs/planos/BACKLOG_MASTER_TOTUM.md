# 📋 BACKLOG MASTER - TOTUM
> Tudo que está em aberto. Se não está marcado como "CANCELADO", está pendente.

**Última atualização:** 2026-04-01  
**Regra:** Se não disser "não vamos fazer" → É para fazer!

---

## 🎯 STATUS GERAL

| Categoria | Total | Concluído | Pendente |
|-----------|-------|-----------|----------|
| **Documentação** | 25+ | 25 | 0 |
| **GitHub Issues** | 20 | 0 | 20 |
| **VPS/Infra** | 10 | 0 | 10 |
| **Agentes** | 8 | 0 | 8 |
| **Integrações** | 6 | 0 | 6 |
| **Ferramentas Externas** | 5 | 0 | 5 |

---

## 📚 DOCUMENTAÇÃO (Criada - Pronta para Uso)

### ✅ Arquivos Prontos (Baixar e Usar)

| Arquivo | Tamanho | Status | Para quê |
|---------|---------|--------|----------|
| `BIBLIA_CONTEUDO_COMPLETO.md` | 26KB | ✅ | Todo POP/SLA dos 8 departamentos |
| `BIBLIA_POP_SLA_ESTRUTURA.md` | 5KB | ✅ | Índice organizado da Bíblia |
| `GLOSSARIO_COMPENDIO_TOTUM_COMPLETO.md` | 20KB | ✅ | Manual de consulta rápida |
| `ANALISE_TRINDADE_X_BIBLIA_DETALHADA.md` | 16KB | ✅ | Scorecard Miguel/Liz/Jarvis |
| `AGENTES_FALTANTES_COMPLETO.md` | 17KB | ✅ | 4 agentes necessários + planos |
| `DICAS_PROMPTS_CLAUDE_V2.md` | 16KB | ✅ | Dicas do Notebook LLM (7 seções) |
| `PERSONALIDADE_MIGUEL_REAL.md` | 11KB | ✅ | Israel → Miguel |
| `PERSONALIDADE_LIZ_REAL.md` | 12KB | ✅ | Mylena → Liz |
| `PERSONALIDADE_JARVIS_REAL.md` | 12KB | ✅ | Felipe → Jarvis |
| `PERSONALIDADE_ORQUESTRADOR_TOTUM.md` | 10KB | ✅ | TARS |
| `PERSONALIDADE_CONTROLADOR_TOTUM.md` | 11KB | ✅ | ADM/Financeiro |
| `PERSONALIDADE_CARTOGRAFO_TOTUM.md` | 19KB | ✅ | Mapa Semântico |
| `PERSONALIDADE_VENDEDOR_TOTUM.md` | 10KB | ✅ | Comercial |
| `PERSONALIDADE_DIRETOR_ARTE.md` | 6KB | ✅ | Criação |
| `PERSONALIDADE_ESPECIALISTA_CRM.md` | 5KB | ✅ | Automações |
| `ANALISE_TOTUM_SYSTEM.md` | 12KB | ✅ | Análise do sistema existente |
| `LOVABLE_PROMPTS_PRONTOS.md` | 19KB | ✅ | 5 prompts para Lovable |
| `GITHUB_ISSUES_APPS_TOTUM.md` | 13KB | ✅ | 20 issues para GitHub |
| `PLANO_MIGRACAO_VPS_STARK.md` | 6KB | ✅ | Guia configuração VPS |
| `PLANO_IMPLEMENTACAO_30DIAS.md` | 32KB | ✅ | Cronograma completo |
| `RESEARCH_INOVACAO.md` | 16KB | ✅ | 15 ideias, cases, anti-patterns |
| `ANALISE_CRITICA_SISTEMA.md` | 31KB | ✅ | Score 67/100, problemas, roadmap |
| `PLANO_DE_ACAO_INTERATIVO.md` | 14KB | ✅ | Dashboard calendário + checklist |
| `CENTRAL_CLIENTES_ARQUITETURA.md` | 19KB | ✅ | Arquitetura da Central |
| `TOTUM_AGENTS_MASTER_PLAN.md` | 13KB | ✅ | Plano mestre de agentes |

---

## 🔧 GITHUB ISSUES (Criar no Repo)

**Repo:** https://github.com/grupototum/Apps_totum_Oficial

### FASE 1 - Setup (Semana 1)
- [ ] **#1** - Configurar tabelas do sistema de agentes no Supabase
- [ ] **#2** - Configurar Edge Functions para execução de agentes
- [ ] **#3** - Configurar variáveis de ambiente para agentes

### FASE 2 - Frontend (Semanas 2-3)
- [ ] **#4** - Criar página /agents (Dashboard de Agentes)
- [ ] **#5** - Modificar ClientHub para incluir abas de Agentes
- [ ] **#6** - Criar componente de chat com agente
- [ ] **#7** - Implementar design system com cor #f76926

### FASE 3 - Backend (Semanas 3-4)
- [ ] **#8** - Criar API para execução de agentes
- [ ] **#9** - Implementar sistema de contexto para agentes
- [ ] **#10** - Configurar webhooks para n8n e Kommo

### FASE 4 - Agentes (Semanas 4-6)
- [ ] **#11** - Implementar personalidade do Miguel (Israel)
- [ ] **#12** - Implementar personalidade da Liz (Mylena)
- [ ] **#13** - Implementar personalidade do Jarvis (Felipe)
- [ ] **#14** - Implementar agente Orquestrador (TARS)
- [ ] **#15** - Implementar demais agentes especialistas
- [ ] **#16** - Criar sistema de memória para agentes

### FASE 5 - Deploy (Semana 6)
- [ ] **#17** - Configurar deploy no VPS Stark
- [ ] **#18** - Migrar dados do sistema antigo
- [ ] **#19** - Criar documentação técnica
- [ ] **#20** - Testes end-to-end antes do go live

---

## 🖥️ VPS STARK (Configurar)

**Status:** ⏳ Aguardando configuração (guia pronto)

- [ ] Etapa 1: Acesso SSH + Update do sistema
- [ ] Etapa 2: Instalar Docker + Docker Compose
- [ ] Etapa 3: Configurar Firewall (UFW)
- [ ] Etapa 4: Clonar repositório
- [ ] Etapa 5: Configurar Nginx
- [ ] Etapa 6: SSL (Let's Encrypt)
- [ ] Etapa 7: PM2 (Process Manager)
- [ ] Etapa 8: Variáveis de ambiente (.env)
- [ ] Etapa 9: Build da aplicação
- [ ] Etapa 10: Testar e verificar
- [ ] Deploy automático (GitHub Actions)
- [ ] Monitoramento (logs, uptime)

---

## 🤖 AGENTES DE IA (Implementar)

### Trindade Principal
- [ ] **Miguel** (baseado no Israel) - Arquiteto/CEO
- [ ] **Liz** (baseado na Mylena) - Guardiã/COO
- [ ] **Jarvis** (baseado no Felipe) - Executor/Tech Lead

### Agente Orquestrador
- [ ] **TARS** - Engenheiro Geral (personalidade Interstellar)

### Agentes Especialistas
- [ ] **Controlador** - ADM/Financeiro
- [ ] **Cartógrafo** - Mapa Semântico/Inteligência
- [ ] **Vendedor** - Comercial/Fechamento
- [ ] **Diretor de Arte** - Criação/Design
- [ ] **Especialista CRM** - Automações/n8n

**Total: 8 agentes**

---

## 🔌 INTEGRAÇÕES (Configurar)

### CRM e Comunicação
- [ ] **Kommo** - Integração completa (API + webhooks)
- [ ] **WhatsApp** - API oficial ou Evolution API
- [ ] **Telegram** - Bot @totum_agents_bot (já criado, configurar)

### Automação
- [ ] **n8n** - Workflows de automação
- [ ] **Zapier** - (opcional, backup)

### IA/ML
- [ ] **Claude API** - Agentes principais
- [ ] **OpenAI API** - (backup/alternativa)
- [ ] **Groq API** - Velocidade (já tem chave)

### Monitoramento
- [ ] **Opik** - Tracing e observabilidade (precisa de API key)
- [ ] **Uptime Robot** - Monitoramento de disponibilidade

---

## 🎨 LOVABLE.DEV (Aguardando Créditos)

**Status:** ⏳ Créditos esgotados, 5/dia renovam amanhã

### Prompts para Gerar (ordem recomendada)
1. [ ] **Dashboard de Agentes** - Grid dos 8 agentes com status
2. [ ] **Cadastro de Cliente** - 5 etapas (básico, negócio, mídias, etc)
3. [ ] **Perfil do Agente** - Detalhes, gatilhos, conversas
4. [ ] **Central de Clientes** - Mapa semântico, entregas, timeline
5. [ ] **Workflow Visual** - Interface n8n-style para workflows

**Obs:** Renomeado de "Blackboard" para "Arquitetura Central"

---

## 🗄️ SUPABASE (Configurar)

### Tabelas a Criar
- [ ] `agents` - Cadastro dos 8 agentes
- [ ] `workflows` - Definição de workflows
- [ ] `workflow_executions` - Execuções
- [ ] `agent_conversations` - Histórico de conversas
- [ ] `client_agents` - Relacionamento cliente-agente

### Edge Functions
- [ ] `agent-executor` - Executa ações dos agentes
- [ ] `workflow-engine` - Gerencia fluxos
- [ ] `agent-webhook` - Recebe eventos externos
- [ ] `agent-auth` - Autenticação

### Campos na Tabela clients (adicionar)
- [ ] `mapa_semantico` - JSON do mapa do negócio
- [ ] `key_visual` - Identidade visual
- [ ] `contexto_negocio` - Contexto para agentes
- [ ] `agente_responsavel` - Agente principal do cliente

---

## 📱 FRONTEND (Desenvolver)

### Novas Páginas
- [ ] `/agents` - Dashboard de gestão dos 8 agentes
- [ ] `/workflows` - Editor visual de workflows
- [ ] `/agent/:id` - Perfil individual do agente

### Modificações no ClientHub
- [ ] Aba "Agentes Ativos"
- [ ] Aba "Workflows"
- [ ] Aba "Conversas"

### Componentes Novos
- [ ] Chat com agente (interface WhatsApp-style)
- [ ] Status dos agentes (online/offline/ocupado)
- [ ] Visualizador de workflows
- [ ] Timeline de execuções

---

## 📊 BÍBLIA POP/SLA (Finalizar)

### Departamentos em VERSÃO FINAL ✅
- [x] Tráfego Pago
- [x] Automação & CRM
- [x] Atendimento/Suporte

### Departamentos em DESENVOLVIMENTO ⏳
- [ ] Governança/Gestão - Criar POP completo
- [ ] ADM/Financeiro - Criar POP completo
- [ ] Comercial - Criar POP completo
- [ ] Planejamento - Expandir POP
- [ ] Criação - Criar POP completo

---

## 🔐 SEGURANÇA E CONFIGURAÇÕES

### Variáveis de Ambiente (Preencher)
```env
# A preencher:
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GROQ_API_KEY=
KOMMO_API_KEY=
KOMMO_SUBDOMAIN=
N8N_WEBHOOK_URL=
TELEGRAM_BOT_TOKEN=
OPIK_API_KEY=
STARK_VPS_IP=
STARK_SSH_KEY=
```

### GitHub Secrets
- [ ] `STARK_HOST`
- [ ] `STARK_SSH_KEY`

---

## 🧪 TESTES E VALIDAÇÃO

### Testes Unitários
- [ ] Configurar Vitest
- [ ] 90%+ coverage

### Testes E2E
- [ ] Configurar Playwright
- [ ] Cenários críticos

### Testes de Agentes
- [ ] Cenários reais de uso
- [ ] Validação de personalidades

---

## 📖 DOCUMENTAÇÃO TÉCNICA (Criar)

- [ ] README.md atualizado
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Guia de deploy
- [ ] Guia de troubleshooting
- [ ] Runbook de incidentes
- [ ] Documentação de agentes (para usuários)

---

## 🔄 BACKUPS E MANUTENÇÃO

### Backup Automático
- [ ] Configurar backup diário do Supabase
- [ ] Backup do VPS (dados + código)
- [ ] Retenção de 30 dias

### Monitoramento
- [ ] Uptime do sistema
- [ ] Logs de erros
- [ ] Métricas de agentes

---

## 🎯 PRÓXIMAS AÇÕES IMEDIATAS

### Amanhã (2026-04-02)
1. [ ] Usar os 5 créditos do Lovable (mandar prompts)
2. [ ] Configurar VPS Stark (seguir guia)

### Esta Semana
3. [ ] Criar issues no GitHub (copiar do arquivo)
4. [ ] Configurar Supabase (tabelas)
5. [ ] Preencher variáveis de ambiente

### Próximas 2 Semanas
6. [ ] Implementar Fase 1 (Setup)
7. [ ] Começar Fase 2 (Frontend)
8. [ ] Testar integrações básicas

---

## 📝 REGRAS DE OURO

1. **Se não disse "não vamos fazer" → É para fazer!**
2. **Prioridade:** VPS > GitHub Issues > Lovable > Agentes
3. **Documentar tudo** que for aprendido
4. **Testar antes** de marcar como concluído
5. **Atualizar este arquivo** quando algo mudar

---

## 🏆 DEFINIÇÃO DE PRONTO

Uma tarefa só está concluída quando:
- [ ] Código implementado
- [ ] Testado localmente
- [ ] Deploy no Stark
- [ ] Documentado
- [ ] Revisado (se necessário)

---

*Documento vivo - atualizar conforme progresso*
*Criado em: 2026-04-01*
*Regra: TUDO em aberto até ordem explícita de cancelamento*
