# 🤖 POP - AGENTE REPORTEI

**Nome:** Reportei (Agente Interno Totum)  
**Tipo:** Agente de Relatórios/Analytics  
**Nível:** N1 (Subagente de TOT)  
**Emoji:** 📊  
**Status:** Em planejamento

---

## 🎯 OBJETIVO
Substituir a ferramenta paga Reportei (R$ 30/mês) coletando dados via APIs Meta e gerando relatórios automáticos.

---

## 🔍 ANÁLISE DO REPORTEI ORIGINAL

**URL:** https://reportei.com/  
**Funções principais:**
1. Relatórios de redes sociais (Instagram, Facebook)
2. Métricas de anúncios (Ads)
3. Dashboards automáticos
4. Export PDF/Excel
5. Agendamento de relatórios

---

## 🤖 IA RECOMENDADA: MANUS

**Por que Manus?**
- Excelente para automação de navegação
- Consegue acessar Meta Business Suite
- Extrai dados de forma estruturada
- Pode gerar PDFs e dashboards

**Contas disponíveis:**
- 1 conta Pro paga (R$ 115/mês)
- 4 contas gratuitas (Credit Farming)

---

## 🚀 FUNCIONALIDADES DO AGENTE REPORTEI

### 1. Coleta de Dados (APIs Meta)
- **Instagram Business API** - Posts, stories, alcance, engajamento
- **Facebook Graph API** - Página, anúncios, insights
- **Meta Marketing API** - Campanhas, spend, conversões

### 2. Geração de Relatórios
- **Relatório diário** - Resumo do dia (WhatsApp)
- **Relatório semanal** - PDF detalhado (email)
- **Relatório mensal** - Dashboard interativo

### 3. Métricas Trackeadas
| Métrica | Instagram | Facebook | Ads |
|---------|-----------|----------|-----|
| Seguidores | ✅ | ✅ | - |
| Alcance | ✅ | ✅ | ✅ |
| Engajamento | ✅ | ✅ | - |
| Cliques no link | ✅ | ✅ | ✅ |
| Spend | - | - | ✅ |
| CPC/CPM | - | - | ✅ |
| Conversões | - | - | ✅ |
| ROI | - | - | ✅ |

---

## 🛠️ STACK TECNOLÓGICO

| Componente | Tecnologia |
|------------|------------|
| Coleta | Meta Graph API + Manus |
| Armazenamento | Supabase |
| Dashboard | React + Recharts |
| PDF | Puppeteer + HTML template |
| Envio | N8N + WhatsApp/Email |

---

## 🔄 WORKFLOW

```
Agendamento (cron diário/semanal)
         ↓
Manus acessa Meta Business Suite
         ↓
Extrai métricas estruturadas
         ↓
Salva no Supabase
         ↓
Gera relatório (PDF ou texto)
         ↓
Envia via WhatsApp/Email
         ↓
Dashboard atualizado em tempo real
```

---

## 💡 CASOS DE USO

1. **Cliente pergunta "como foi a semana?"** → Relatório automático no WhatsApp
2. **Reunião mensal** → PDF profissional com gráficos
3. **Monitoramento de campanha** → Alerta se spend estourar
4. **Benchmark** - Comparar performance mês a mês

---

## ⚠️ LIMITAÇÕES

- Requer acesso à conta Meta Business
- APIs Meta têm limites de requisição
- Dados de anúncios podem ter delay de 24-48h
- Não substitui análise humana (é ferramenta)

---

## 📋 PRÓXIMOS PASSOS

- [ ] Criar conta Meta Business (se não tiver)
- [ ] Configurar app no Facebook Developers
- [ ] Testar extração via Manus
- [ ] Criar template de relatório
- [ ] Configurar envio automatizado

---

## 💰 ECONOMIA

**Reportei pago:** R$ 30/mês  
**Agente próprio:** R$ 0 (usa infra existente + Manus free)  
**Economia anual:** R$ 360

---

**Criado por:** TOT  
**Data:** 2026-04-04  
**Status:** POP criado, aguardando implementação