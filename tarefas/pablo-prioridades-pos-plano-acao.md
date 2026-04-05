# 📋 TAREFAS PABLO - PRIORIDADES PÓS-PLANO DE AÇÃO

**Data:** 2026-04-04  
**Responsável:** Pablo / Israel  
**Status:** Fila de execução

---

## 🔴 PRIORIDADE 1 - IMPLEMENTAÇÃO DE AGENTES

### Tarefa 1: Criar Agente Reportei
**Descrição:** Implementar agente para substituir ferramenta paga (R$ 30/mês)
**POP:** `/agents/pops/reportei-pop.md`
**IA recomendada:** Manus (acesso ao Meta Business Suite)
**Tempo estimado:** 4-6 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Criar app no Facebook Developers
- [ ] Configurar Meta Business API
- [ ] Implementar coleta de métricas
- [ ] Criar template de relatório
- [ ] Configurar envio automatizado (N8N + WhatsApp)
- [ ] Testar com conta real

---

### Tarefa 2: Criar Agente Fignaldo
**Descrição:** Agente de prototipagem a partir de Design Systems
**POP:** `/agents/pops/fignaldo-pop.md`
**Tempo estimado:** 6-8 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Criar interface de upload de Design System
- [ ] Implementar análise de cores/tipografia
- [ ] Integrar com Claude API para geração de código
- [ ] Criar preview em tempo real
- [ ] Sistema de exportação (HTML/CSS)
- [ ] Testar com Design System da Totum

---

### Tarefa 3: Criar Radar de Anúncios
**Descrição:** Monitorar anúncios de concorrentes + integração AdSpy
**POP:** `/agents/pops/radar-anuncios-pop.md`
**Tempo estimado:** 8-10 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Criar script de scraping Meta Ads Library
- [ ] Implementar análise com Claude API
- [ ] Criar dashboard de visualização
- [ ] Configurar alertas diários (WhatsApp)
- [ ] Integrar com dados do AdSpy (manual upload)
- [ ] Testar com concorrentes reais

---

### Tarefa 4: Criar KVirtuoso
**Descrição:** Gerador de 100-200 postagens a partir de Key Visual
**POP:** `/agents/pops/kvirtuoso-pop.md`
**Tempo estimado:** 10-12 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Criar interface de upload de KV
- [ ] Integrar com Leonardo.AI / Ideogram
- [ ] Implementar variações de formato (feed, story, carrossel)
- [ ] Criar sistema de aprovação/rejeição
- [ ] Export em batch
- [ ] Testar com campanha real

---

## 🟡 PRIORIDADE 2 - INFRAESTRUTURA

### Tarefa 5: Commitar Correções de Bugs no GitHub
**Descrição:** Subir para o GitHub as correções dos bugs 1 e 3
**Arquivos:** AgentsDashboard.tsx, AppLayout.tsx, AppSidebar.tsx, useTarefas.ts
**Status:** ⏳ Aguardando execução do subagente Bug 2
**Tempo estimado:** 10 minutos

**Checklist:**
- [ ] Esperar subagente terminar Bug 2
- [ ] Fazer git add de todos os arquivos corrigidos
- [ ] Commit com mensagem descritiva
- [ ] Push para origin main
- [ ] Verificar sincronização no Lovable

---

### Tarefa 6: Instalar Ollama no Servidor Dedicado
**Descrição:** Configurar IA local no i5-2400
**Guia:** `/tarefas/instalar-ollama-servidor-dedicado.md`
**Responsável:** Israel (acesso físico ao servidor)
**Tempo estimado:** 30 minutos
**Status:** ⏳ Aguardando Israel

**Checklist:**
- [ ] Instalar Ollama via script
- [ ] Baixar qwen2.5:7b
- [ ] Baixar nomic-embed-text
- [ ] Testar chat local
- [ ] Configurar acesso remoto (se necessário)

---

## 🟢 PRIORIDADE 3 - TESTES E AVALIAÇÕES

### Tarefa 7: Testar Runway Gen-3
**Descrição:** Avaliar qualidade de geração de vídeo
**Guia:** `/tarefas/testar-runway-gen3.md`
**Tempo estimado:** 2-3 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Acessar Runway Gen-3
- [ ] Testar 3-5 prompts diferentes
- [ ] Avaliar qualidade vs custo
- [ ] Comparar com alternativas (Pika, HeyGen)
- [ ] Documentar resultados

---

### Tarefa 8: Configurar Figma AI
**Descrição:** Avaliar Figma AI nativo para Design System
**Guia:** `/tarefas/configurar-figma-ai-design-system.md`
**Tempo estimado:** 3-4 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Ativar Figma AI na conta
- [ ] Testar geração de componentes
- [ ] Avaliar criação de protótipos
- [ ] Comparar com Stitch do Google
- [ ] Documentar capacidades

---

### Tarefa 9: Criar Dashboard de Gastos
**Descrição:** Página no Apps Totum para monitorar gastos mensais
**Contexto:** Orçamento R$ 1.500/mês
**Tempo estimado:** 4-6 horas
**Status:** ⏳ Aguardando

**Checklist:**
- [ ] Criar tabela `gastos_mensais` no Supabase
- [ ] Criar componente DashboardGastos.tsx
- [ ] Integrar com gráficos (Recharts)
- [ ] Configurar alertas de limite
- [ ] Testar com dados reais

---

## 📊 RESUMO

| Tarefa | Prioridade | Tempo Estimado | Status |
|--------|------------|----------------|--------|
| Reportei | 🔴 1 | 4-6h | ⏳ |
| Fignaldo | 🔴 1 | 6-8h | ⏳ |
| Radar Anúncios | 🔴 1 | 8-10h | ⏳ |
| KVirtuoso | 🔴 1 | 10-12h | ⏳ |
| Commit Bugs | 🟡 2 | 10min | ⏳ |
| Ollama Servidor | 🟡 2 | 30min | ⏳ |
| Runway Gen-3 | 🟢 3 | 2-3h | ⏳ |
| Figma AI | 🟢 3 | 3-4h | ⏳ |
| Dashboard Gastos | 🟢 3 | 4-6h | ⏳ |

**Total:** ~40-50 horas de trabalho

---

**Criado por:** TOT  
**Data:** 2026-04-04