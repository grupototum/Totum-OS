# 💰 MODELO DE COBRANÇA - MENSAGENS FORA DA JANELA
> Como passar o custo WhatsApp para o cliente final

**Cenário:** Cliente da Upixel envia mensagens fora da janela de 24h  
**Problema:** Custo R$ 0,04-0,34 por mensagem sai do bolso da Upixel  
**Solução:** Cobrar do cliente de forma transparente e automatizada

---

## 🎯 ESTRATÉGIAS DE COBRANÇA

### 1️⃣ MODELO DE CRÉDITOS (RECOMENDADO)

**Como funciona:**
- Cliente compra pacote de créditos antecipadamente
- Cada crédito = 1 mensagem fora da janela
- Quando acaba, para de enviar ou compra mais

**Exemplo de Pacotes:**

| Pacote | Créditos | Custo Upixel | Preço Cliente | Margem |
|--------|----------|--------------|---------------|--------|
| Starter | 100 msgs | R$ 4-34 | R$ 59 | 40-90% |
| Basic | 500 msgs | R$ 20-170 | R$ 199 | 15-90% |
| Pro | 1.000 msgs | R$ 40-340 | R$ 349 | 3-90% |
| Enterprise | 5.000 msgs | R$ 200-1.700 | R$ 1.499 | 13-90% |

**Vantagens:**
- ✅ Fluxo de caixa positivo (recebe antes)
- ✅ Cliente controla gasto
- ✅ Sem surpresas para ninguém
- ✅ Margem garantida

---

### 2️⃣ MODELO PÓS-PAGO (CONSUMO)

**Como funciona:**
- Cliente usa e paga no final do mês
- Fatura detalhada com cada mensagem
- Pagamento via Pix, cartão ou boleto

**Estrutura:**
```
Plano Base: R$ 99/mês (inclui 50 mensagens fora janela)
Excedente: R$ 0,50/msg (custo R$ 0,04-0,34 = margem 32-88%)
```

**Vantagens:**
- ✅ Cliente paga só o que usar
- ✅ Boa para empresas com volume variável
- ✅ Mais justo

**Desvantagens:**
- ❌ Risco de inadimplência
- ❌ Fluxo de caixa negativo (paga Meta antes, recebe depois)
- ❌ Cliente pode assustar com conta alta

---

### 3️⃣ MODELO HÍBRIDO (ASSINATURA + CONSUMO)

**Como funciona:**
- Assinatura mensal com franquia inclusa
- Excedente cobrado separadamente

**Exemplo:**
```
Plano Pro: R$ 299/mês
- Inclui: CRM completo + 200 mensagens fora janela
- Excedente: R$ 0,45/msg

Se cliente usar 300 msgs:
- Base: R$ 299
- Excedente: 100 × R$ 0,45 = R$ 45
- Total: R$ 344
- Custo Upixel: 300 × R$ 0,04 = R$ 12
- Lucro: R$ 332 (96% margem)
```

**Vantagens:**
- ✅ Previsibilidade + flexibilidade
- ✅ Cliente não para se ultrapassar um pouco
- ✅ Melhor margem

---

### 4️⃣ MODELO DE MARCAÇÃO D'ÁGUA (FREEMIUM)

**Como funciona:**
- Mensagens dentro da janela: Grátis, sem marca
- Mensagens fora da janela: Grátis, COM marca d'água "Upixel"
- Para remover marca: Assinar plano pago

**Estratégia:**
- Cliente começa grátis
- Quando precisar de profissionalismo, paga
- Upsell natural

**Vantagens:**
- ✅ Aquisição de clientes fácil
- ✅ Conversão orgânica
- ✅ Marketing viral (marca d'água)

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### 1. Tracking de Mensagens

```javascript
// Tabela: whatsapp_usage
{
  id: uuid,
  client_id: uuid,
  message_id: string,
  type: 'inbound' | 'outbound',
  category: 'service' | 'utility' | 'marketing' | 'authentication',
  cost_usd: decimal,
  cost_brl: decimal,
  within_24h_window: boolean,  // ⭐ IMPORTANTE
  created_at: timestamp
}
```

### 2. Lógica de Cobrança

```javascript
// Antes de enviar mensagem
async function sendMessage(clientId, message) {
  const lastMessage = await getLastMessageFromClient(clientId);
  const hoursSinceLastMessage = calculateHours(lastMessage);
  
  // Verifica se está dentro da janela de 24h
  const withinWindow = hoursSinceLastMessage <= 24;
  
  if (!withinWindow) {
    // FORA DA JANELA - TEM CUSTO
    const hasCredits = await checkClientCredits(clientId);
    
    if (!hasCredits) {
      return {
        error: "Créditos insuficientes",
        message: "Compre mais créditos para enviar mensagens fora da janela de 24h",
        action: "redirect_to_payment"
      };
    }
    
    // Debita crédito
    await debitCredit(clientId, 1);
  }
  
  // Envia mensagem
  return await evolutionAPI.send(message);
}
```

### 3. Sistema de Créditos

```javascript
// Tabela: client_credits
{
  client_id: uuid,
  balance: integer,  // quantidade de créditos disponíveis
  pending_charge: decimal,  // valor a cobrar no fim do mês (modo pós-pago)
  plan_type: 'prepaid' | 'postpaid',
  auto_recharge: boolean,
  auto_recharge_threshold: integer  // ex: quando chegar em 10 créditos
}
```

### 4. Webhook de Recarga Automática

```javascript
// Quando créditos estão baixos
if (credits.balance <= credits.auto_recharge_threshold && credits.auto_recharge) {
  // Gera cobrança
  const payment = await generateInvoice({
    client_id: clientId,
    amount: credits.default_recharge_amount,
    description: "Recarga automática de créditos WhatsApp"
  });
  
  // Envia para cliente aprovar
  await notifyClient(clientId, "Recarga automática solicitada");
}
```

---

## 💳 GATEWAYS DE PAGAMENTO

### Opções para Créditos/Recargas:

| Gateway | Taxa | Integração | Melhor Para |
|---------|------|------------|-------------|
| **Stripe** | 3,99% + R$ 0,50 | Fácil | Cartão internacional |
| **Pagarme** | 3,49% + R$ 0,10 | Média | Cartão nacional |
| **Mercado Pago** | 3,19% | Fácil | Pix + Cartão |
| **Asaas** | 0,99% (boleto) | Fácil | Boleto + Pix |
| **Efí** | 0,99% | Média | Pix prioritário |

**Recomendação:** Mercado Pago (PIX instantâneo) ou Asaas (boleto barato)

---

## 📊 DASHBOARD DO CLIENTE

### O que mostrar:

```
┌─────────────────────────────────────────┐
│  SEUS CRÉDITOS WHATSAPP                 │
│                                         │
│  💳 Saldo: 47 créditos                  │
│  📊 Usado este mês: 153 mensagens       │
│  💰 Custo estimado: R$ 6,12             │
│                                         │
│  [COMPRAR CRÉDITOS]                     │
└─────────────────────────────────────────┘

📈 USO POR CATEGORIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service (grátis)     ████████████████████ 200
Utility              ████████ 47 (R$ 1,88)
Marketing            ███ 15 (R$ 5,10)
Authentication       ██ 8 (R$ 1,36)

⚠️ VOCÊ ESTÁ FORA DA JANELA EM 3 CONVERSAS
   Última mensagem do cliente: há 26 horas
   Responder agora custará 1 crédito (R$ 0,50)
```

---

## 🎨 COMUNICAÇÃO COM O CLIENTE

### Mensagem de "Sem Créditos":

```
⚠️ Você não tem créditos suficientes para enviar esta mensagem.

Tipo: Mensagem fora da janela de 24h
Custo: 1 crédito (R$ 0,50)

[COMPRAR CRÉDITOS AGORA]    [VER PLANOS]

💡 Dica: Responder dentro de 24h após o cliente enviar 
   mensagem é sempre GRÁTIS!
```

### Email de Relatório Mensal:

```
Resumo de Uso WhatsApp - Upixel

Período: 01/04/2026 a 30/04/2026

✅ Mensagens dentro da janela (GRÁTIS): 450
💳 Mensagens fora da janela: 50
   - Utility: 40 × R$ 0,40 = R$ 16,00
   - Marketing: 10 × R$ 0,80 = R$ 8,00

💰 Total cobrado: R$ 24,00

📊 Economia: Você economizou R$ 153,00 respondendo 
   rápido aos seus clientes!

[VER DETALHES COMPLETOS]
```

---

## ⚖️ MODELO DE CONTRATO (CLÁUSULA)

```
CLÁUSULA X - USO DE MENSAGENS WHATSAPP

X.1. As mensagens enviadas dentro de 24h após contato 
     do cliente são gratuitas e ilimitadas.

X.2. Mensagens fora da janela de 24h ("Mensagens Avulsas")
     serão cobradas conforme tabela:
     
     a) Utility (notificações): R$ 0,40/unidade
     b) Marketing (campanhas): R$ 0,80/unidade
     c) Authentication: R$ 0,60/unidade

X.3. O CLIENTE deve manter saldo de créditos positivo 
     para envio de Mensagens Avulsas.

X.4. A UPIXEL poderá suspender o envio de Mensagens Avulsas
     caso o saldo de créditos seja insuficiente.

X.5. Os valores podem ser alterados com 30 dias de 
     antecedência mediante notificação por email.
```

---

## 🚀 IMPLEMENTAÇÃO PASSO A PASSO

### Fase 1: Setup (Semana 1)
- [ ] Criar tabela `whatsapp_usage`
- [ ] Criar tabela `client_credits`
- [ ] Implementar tracking de janela 24h
- [ ] Configurar webhook Evolution API

### Fase 2: Cobrança (Semana 2)
- [ ] Integrar gateway de pagamento
- [ ] Criar endpoint de compra de créditos
- [ ] Implementar débito automático
- [ ] Criar página de checkout

### Fase 3: Dashboard (Semana 3)
- [ ] Dashboard de uso para cliente
- [ ] Relatórios mensais automáticos
- [ ] Alertas de créditos baixos
- [ ] Previsão de gastos

### Fase 4: Regras (Semana 4)
- [ ] Configurar limites por plano
- [ ] Implementar bloqueio quando sem crédito
- [ ] Criar opção de recarga automática
- [ ] Testes finais

---

## 💡 DICAS DE OURO

1. **Sempre mostrar o custo ANTES de enviar**
   - "Responder agora custará 1 crédito. OK?"

2. **Incentivar respostas rápidas**
   - "Responda em 24h para não gastar créditos!"

3. **Pacotes com validade**
   - Créditos expiram em 12 meses (incentiva uso)

4. **Desconto por volume**
   - Comprar 1.000 créditos = 10% desconto

5. **Alertas proativos**
   - "Você tem 10 créditos restantes"

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Definir preços dos pacotes de créditos
- [ ] Escolher gateway de pagamento
- [ ] Criar tabelas no banco de dados
- [ ] Implementar lógica de tracking
- [ ] Criar endpoint de compra de créditos
- [ ] Implementar débito automático
- [ ] Criar dashboard do cliente
- [ ] Configurar alertas
- [ ] Testar fluxo completo
- [ ] Documentar para equipe de suporte
- [ ] Atualizar contrato com cláusula de uso
- [ ] Comunicar clientes sobre mudança

---

## 🎯 MODELO RECOMENDADO PARA UPIXEL

**Plano Híbrido com Créditos:**

```
┌────────────────────────────────────────┐
│ PLANO STARTER - R$ 99/mês              │
├────────────────────────────────────────┤
│ ✅ CRM completo                         │
│ ✅ 50 mensagens fora janela inclusas    │
│ ✅ Suporte por chat                     │
├────────────────────────────────────────┤
│ Créditos extras: R$ 0,50/msg            │
│ [COMPRAR CRÉDITOS]                     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ PLANO PRO - R$ 299/mês                 │
├────────────────────────────────────────┤
│ ✅ CRM completo + Automações           │
│ ✅ 200 mensagens fora janela inclusas   │
│ ✅ Suporte prioritário                  │
│ ✅ Relatórios avançados                 │
├────────────────────────────────────────┤
│ Créditos extras: R$ 0,45/msg            │
│ [COMPRAR CRÉDITOS]                     │
└────────────────────────────────────────┘
```

**Projeção de Receita (100 clientes Pro):**
- Receita mensal: 100 × R$ 299 = R$ 29.900
- Custo estimado WhatsApp: R$ 2.000
- Lucro: R$ 27.900/mês

---

*Documento criado em: 2026-04-01*  
*Próximo passo: Definir preços finais e escolher gateway*
