# SKILL: Estratégia de Créditos Gratuitos (Credit Farming)

## 🎯 DEFINIÇÃO
Sistema para maximizar uso de créditos gratuitos de múltiplas plataformas de IA, acumulando e distribuindo tarefas de forma inteligente para minimizar custos.

## 📋 INVENTÁRIO ATUAL DE CRÉDITOS

### Manus AI
- **Conta Pro paga:** Plano $20/mês (R$ 115)
- **Contas gratuitas:** 4 contas com créditos diários acumulando
- **Estratégia:** Usar contas gratuitas para tarefas paralelas, conta Pro para integração Meta

### Outras Plataformas (a explorar)
| Plataforma | Crédito Gratuito | Frequência | Status |
|------------|------------------|------------|--------|
| Groq | $5/mês | Mensal | ✅ Confirmado |
| Google Gemini | 1.500 req/min | Contínuo | ✅ Confirmado |
| SambaNova | 1M tokens/dia | Diário | 🔍 Verificar |
| Together AI | $5 inicial | Único | 🔍 Verificar |
| Fireworks | $25 inicial | Único | 🔍 Verificar |
| Cerebras | Beta gratuito | Indefinido | 🔍 Verificar |

## 🏗️ ARQUITETURA DE ORQUESTRAÇÃO

### Conceito: "Epistotle Unificado"
```
Requisição do Usuário
        ↓
┌─────────────────────┐
│   ORQUESTRADOR      │ ← Decide qual IA usar
│   (Stark API)       │   baseado em: crédito,
│                     │   complexidade, velocidade
└──────────┬──────────┘
           │
    ┌──────┼──────┬────────┐
    ↓      ↓      ↓        ↓
 Manus  Manus  Manus   Manus
(conta1)(conta2)(conta3)(conta4)
  ↓       ↓       ↓        ↓
┌────────────────────────────────┐
│      AGREGADOR DE RESPOSTAS    │
│         (Epistotle)            │
└────────────────────────────────┘
```

### Lógica de Distribuição
1. **Verificar saldo** de cada conta gratuita
2. **Rotacionar** requisições (round-robin)
3. **Fallback** para conta Pro se gratuitas falharem
4. **Consolidar** respostas no Epistotle

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### 1. Rastreador de Créditos
```javascript
// Estrutura de dados no Supabase
{
  conta: "manus_free_1",
  plataforma: "manus",
  creditos_disponiveis: 1500,
  creditos_usados_hoje: 450,
  reset_em: "2026-04-04T00:00:00Z",
  ativa: true
}
```

### 2. API de Orquestração
```
POST /api/epistotle/ask
{
  "prompt": "Analise este lead",
  "prioridade": "baixa",  // baixa = tenta gratuita primeiro
  "timeout": 30000
}
```

### 3. Sistema de Fallback
```
1. Tentar Manus Free 1
   └─ Sucesso? → Retorna
   └─ Falha? → Tentar Manus Free 2
2. Tentar Manus Free 2
   └─ Sucesso? → Retorna
   └─ Falha? → Tentar Manus Free 3
3. ... até conta Pro ou erro
```

## 📊 ECONOMIA PROJETADA

### Cenário Manus (4 contas gratuitas)
| Conta | Crédito Diário | Crédito Mensal | Valor Equivalente |
|-------|----------------|----------------|-------------------|
| Free 1 | ? | ? | R$ ? |
| Free 2 | ? | ? | R$ ? |
| Free 3 | ? | ? | R$ ? |
| Free 4 | ? | ? | R$ ? |
| **Total Free** | - | - | **R$ ?** |
| Pro (paga) | Ilimitado | Ilimitado | R$ 115 |

**Economia potencial:** Substituir parte do uso Pro por Free

### Extensão para outras plataformas
- Groq: $5/mês = R$ 27
- Gemini: Ilimitado (dentro de limites)
- SambaNova: 1M tokens/dia = ~R$ 50-100/mês

**Economia total potencial:** R$ 100-200/mês

## 🎯 REGRAS DE OURO

1. **Nunca usar conta Pro se gratuita aguentar**
2. **Rotacionar** para distribuir carga
3. **Monitorar** créditos diariamente
4. **Ter fallback** sempre (não depende de uma só)
5. **Documentar** limites de cada plataforma

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Mapear créditos exatos das 4 contas Manus
- [ ] Criar tabela `creditos_ia` no Supabase
- [ ] Desenvolver API orquestradora
- [ ] Implementar lógica de fallback
- [ ] Criar dashboard de monitoramento
- [ ] Testar com carga real
- [ ] Documentar limites e restrições

## 🔍 PRÓXIMAS PLATAFORMAS PARA INVESTIGAR

- [ ] Poe AI (créditos gratuitos?)
- [ ] You AI (plano gratuito?)
- [ ] Perplexity API (créditos?)
- [ ] Hugging Face Inference API (gratuito?)
- [ ] Replicate (créditos iniciais?)

---

**Criado em:** 2026-04-03  
**Responsável:** Israel + TOT  
**Status:** Em planejamento  
**Prioridade:** Média (economia a médio prazo)
