# 🤖 POP - RADAR DE ANÚNCIOS

**Nome:** Radar de Anúncios  
**Tipo:** Agente de Inteligência Competitiva  
**Nível:** N1 (Subagente de TOT)  
**Emoji:** 🕵️  
**Status:** Em planejamento

---

## 🎯 OBJETIVO
Monitorar e analisar anúncios de concorrentes automaticamente, combinando dados capturados automaticamente com inteligência do AdSpy.

---

## 📝 DESCRIÇÃO
O Radar coleta anúncios de múltiplas fontes (Meta Ads Library, TikTok, etc), cruza com dados do AdSpy (quando disponível), e gera relatórios de inteligência competitiva para a equipe criativa.

---

## 🚀 FUNCIONALIDADES PRINCIPAIS

### 1. Captura Automática
- **Meta Ads Library** - API pública
- **TikTok Creative Center** - Anúncios em destaque
- **LinkedIn Ads** - B2B monitoring
- **Google Ads** - Pesquisa de concorrentes

### 2. Integração AdSpy (Manual/Cakto)
Quando Israel acessa o AdSpy via Cakto:
- Exportar dados manualmente
- Upload no Radar
- Cruzamento automático com capturas

### 3. Análise e Insights
- **Criativos:** Quais formatos estão bombando?
- **Copy:** Quais gatilhos mentais usam?
- **CTA:** Quais chamadas funcionam?
- **Spend estimado:** Quanto estão investindo?

### 4. Relatórios
- Dashboard em tempo real
- Alertas de novos anúncios (diário)
- Benchmark semanal
- Sugestões de variações

---

## 🛠️ STACK TECNOLÓGICO

| Componente | Tecnologia |
|------------|------------|
| Captura | Puppeteer/Playwright (scraping) |
| Análise | Claude API (para insights) |
| Dashboard | React + Supabase |
| Alertas | N8N + WhatsApp |

---

## 🔄 WORKFLOW

```
Configurar concorrentes para monitorar
         ↓
Radar captura anúncios automaticamente (diário)
         ↓
Israel acessa AdSpy via Cakto → exporta dados
         ↓
Upload no Radar → cruzamento de dados
         ↓
Claude analisa padrões e gera insights
         ↓
Relatório enviado no WhatsApp (daily)
         ↓
Sugestões de variações para criar
```

---

## 💡 CASOS DE USO

1. **Novo cliente** → Analisar o que concorrentes fazem
2. **Campanha nova** → Verificar se já existe algo similar
3. **Criativo esgotado** → Buscar inspiração no que está funcionando
4. **Benchmark mensal** → Relatório de inteligência para cliente

---

## 📊 DADOS COLETADOS

### Automáticos:
- Imagem/vídeo do anúncio
- Texto/copy
- CTA
- Data de início
- Plataforma

### Do AdSpy (manual):
- Spend estimado
- Impressões
- Engajamento
- Targeting (se disponível)

---

## ⚠️ LIMITAÇÕES

- Meta Ads Library não mostra spend real (somente estimativas)
- Dados do AdSpy requerem acesso manual (via Cakto)
- Scraping pode ter limitações técnicas
- Não captura anúncios dark (não aprovados)

---

## 📋 PRÓXIMOS PASSOS

- [ ] Definir lista de concorrentes para monitorar
- [ ] Criar script de scraping Meta Ads
- [ ] Integrar com Claude para análise
- [ ] Criar dashboard de visualização
- [ ] Configurar alertas diários

---

**Criado por:** TOT  
**Data:** 2026-04-04  
**Status:** POP criado, aguardando implementação