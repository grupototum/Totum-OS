# TAREFA: Criar Agente Reportei (Analytics Social Media)

## 🎯 Objetivo
Substituir a ferramenta Reportei (R$ 30/mês) por um agente interno que gere relatórios de social media automaticamente.

## 📊 Funcionalidades do Reportei Atual
- Relatórios de Instagram/Facebook
- Métricas de engajamento
- Análise de crescimento
- Exportação de dados

## 🛠️ Especificação do Agente

### Nome: **REPORTEI** (ou outro nome criativo)

### Funcionalidades:
1. **Coleta de Dados**
   - API Instagram Basic Display
   - API Facebook Graph
   - Google Sheets (armazenamento)

2. **Métricas Calculadas**
   - Crescimento de seguidores
   - Taxa de engajamento (likes + comments / seguidores)
   - Alcance e impressões
   - Melhor horário de postagem
   - Top 5 posts do mês

3. **Geração de Relatório**
   - Formato: PDF ou HTML
   - Design: Clean, profissional
   - Envio: Email automático (semanal/mensal)

4. **Insights com IA**
   - Análise de tendências
   - Sugestões de melhoria
   - Comparação com mês anterior

---

## 📋 Checklist de Desenvolvimento

### Fase 1: Estrutura (Semana 1)
- [ ] Criar conta de desenvolvedor Meta
- [ ] Configurar API Instagram Basic Display
- [ ] Configurar API Facebook Graph
- [ ] Testar acesso às métricas

### Fase 2: Coleta (Semana 2)
- [ ] Script para extrair dados das APIs
- [ ] Armazenar em Supabase (tabela `social_metrics`)
- [ ] Agendamento (diário) via n8n ou cron

### Fase 3: Processamento (Semana 3)
- [ ] Calcular métricas derivadas
- [ ] Comparar períodos
- [ ] Identificar padrões

### Fase 4: Relatório (Semana 4)
- [ ] Template HTML do relatório
- [ ] Geração de PDF (puppeteer ou similar)
- [ ] Envio por email (N8N)

### Fase 5: IA (Semana 5-6)
- [ ] Integrar com Claude/Gemini para insights
- [ ] Análise textual das métricas
- [ ] Sugestões de conteúdo

---

## 💰 Economia Projetada
- **Reportei atual:** R$ 30/mês = R$ 360/ano
- **Custo do agente:** R$ 0 (APIs Meta são gratuitas para uso básico)
- **ROI:** Infinito (depois de pronto, custo zero)

---

## ⚠️ Riscos
- API Meta pode ter rate limits
- Necessita de manutenção se API mudar
- Tempo de desenvolvimento (4-6 semanas)

---

## 🚀 Alternativa Imediata
Enquanto não fica pronto:
- Use planilha Google com importação de dados
- Dashboard simples no Apps Totum
- Export manual mensal das redes

---

**Prioridade:** Baixa (R$ 30 é pouco, mas vale a pena longo prazo)  
**Responsável:** Israel + TOT (quando solicitado)  
**Previsão:** 4-6 semanas  
**Economia:** R$ 360/ano
