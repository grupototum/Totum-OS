# 🤖 AGENTES FALTANTES - ANÁLISE COMPLETA
## Identificação de agentes necessários para implementação total do POP/SLA

**Baseado em:** Pop_Totum_Unificado.pdf (43 páginas, 8 departamentos)  
**Análise:** Comparativo Trindade × Bíblia  
**Data:** Abril 2026

---

## 📊 RESUMO EXECUTIVO

| Status | Quantidade | Departamentos |
|--------|------------|---------------|
| 🟢 POP Final + Agente definido | 2 | Atendimento, Tráfego Pago |
| 🟡 POP Final + Agente necessário | 1 | Automação & CRM |
| 🟠 POP Em desenvolvimento + Agente necessário | 4 | ADM, Comercial, Criação, Governança |
| 🔵 POP Em desenvolvimento + Agente definido | 1 | Planejamento |

**Total de novos agentes necessários:** 4 especialistas  
**Prioridade imediata:** Controlador (ADM), Vendedor Totum (Comercial), Diretor de Arte (Criação)  
**Prioridade média:** Especialista CRM (Automação)

---

## 🔴 PRIORIDADE 1 - URGENTE (Contratar em 30 dias)

### 1. CONTROLADOR TOTUM
**Departamento:** ADM / Financeiro  
**Status POP:** 🟡 Em desenvolvimento (11 gatilhos)  
**Impacto:** 🔴 Crítico - Sem dono = caos financeiro

#### 🎯 Responsabilidades (11 Gatilhos)

| Gatilho | Descrição | Tempo SLA |
|---------|-----------|-----------|
| G1 | Recebimento novo cliente/demanda financeira | - |
| G2 | Formalização contratual | 24h após venda |
| G3 | Configuração cobrança | 24h após assinatura |
| G4 | Emissão cobrança | Imediata ou 24h |
| G5 | Confirmação pagamento | 12h úteis |
| G6 | Controle inadimplência | Contínuo |
| G7 | Bloqueio operacional | Quando necessário |
| G8 | Controle financeiro interno | Diário |
| G9 | Relatórios financeiros | Semanal/Mensal |
| G10 | Organização e arquivo | Contínuo |
| G11 | Registro e encerramento | - |

#### 📋 Descrição da Função
> Gerenciar todo o ciclo financeiro do cliente: desde o fechamento da venda até a cobrança recorrente. Garantir que contratos sejam emitidos, cobranças configuradas, pagamentos acompanhados e inadimplências controladas.

#### 🛠️ Skills Obrigatórias
- **Sistemas de cobrança:** Asaas, Stripe (configuração e operação)
- **Gestão financeira:** Contas a pagar/receber, fluxo de caixa
- **Controle de inadimplência:** Processos de cobrança, negociação
- **Organização documental:** Contratos, comprovantes, notas fiscais
- **Excel/Planilhas:** Relatórios, projeções, análises
- **CRM básico:** Kommo (atualização de status financeiro)

#### 📊 KPIs de Sucesso
- Taxa de inadimplência < 5%
- Tempo médio de pagamento < 5 dias
- Faturamento registrado em até 24h após venda
- 100% dos contratos armazenados e organizados

#### 👥 Relacionamentos
- **Reporta para:** Liz (validações, aprovações)
- **Trabalha com:** Vendedor Totum (dados de venda), Especialista CRM (status no sistema)
- **Clientes internos:** Todos os departamentos (liberação de serviços)

#### 💰 Custo Estimado (mensal)
- **CLT PJ:** R$ 4.000 - 6.000
- **Tempo necessário:** 80-120h/mês (crescendo com base de clientes)

#### 🎬 Plano de Implementação

**Semana 1: Setup**
- [ ] Acesso a Asaas/Stripe
- [ ] Acesso a Kommo (visualização financeira)
- [ ] Reunião com Liz para alinhamento de escopo
- [ ] Leitura completa do POP de ADM

**Semana 2-3: Documentação**
- [ ] Organizar contratos existentes
- [ ] Criar planilha de controle financeiro
- [ ] Mapear clientes ativos e status de pagamento
- [ ] Estabelecer rotina de relatórios

**Semana 4: Operação**
- [ ] Assumir novos contratos
- [ ] Implementar processo de cobrança
- [ ] Criar ritual semanal de revisão com Liz

---

### 2. VENDEDOR TOTUM
**Departamento:** Comercial  
**Status POP:** 🟡 Em desenvolvimento (12 gatilhos)  
**Impacto:** 🔴 Crítico - Sem vendas = sem receita

#### 🎯 Responsabilidades (12 Gatilhos)

| Gatilho | Descrição | Tempo SLA |
|---------|-----------|-----------|
| G1 | Geração/recebimento lead | Imediato |
| G2 | Abordagem inicial | 2h úteis |
| G3 | Conexão e qualificação | - |
| G4 | Proposta de valor | - |
| G5 | Chamada para ação | - |
| G6 | Agendamento | 48h ideal |
| G7 | Preparação reunião | - |
| G8 | Reunião de venda | - |
| G9 | Follow-up | 24h úteis |
| G10 | Fechamento | - |
| G11 | Transição onboarding | - |
| G12 | Registro e encerramento | - |

#### 📋 Descrição da Função
> Executar o processo completo de vendas: desde o primeiro contato com o lead até o fechamento e transição para o onboarding. Qualificar leads, conduzir reuniões consultivas, negociar propostas e garantir que novos clientes entrem na operação de forma fluida.

#### 🛠️ Skills Obrigatórias
- **Prospecção ativa:** LinkedIn, Instagram, listas, indicações
- **CRM:** Kommo (registro, tags, atualização de status)
- **Comunicação escrita:** WhatsApp, email (tom consultivo, não vendedor)
- **Reuniões de vendas:** Sondagem, diagnóstico, apresentação consultiva
- **Follow-up:** Persistência sem ser insistente, gatilhos de urgência
- **Negociação:** Condições de pagamento, escopo, expectativas

#### 📊 KPIs de Sucesso
- Taxa de resposta aos leads > 30%
- Taxa de agendamento > 20%
- Taxa de comparecimento > 70%
- Taxa de fechamento > 15%
- Ticket médio alinhado à meta
- Tempo médio de venda < 15 dias

#### 👥 Relacionamentos
- **Reporta para:** Jarvis (tática, otimização)
- **Trabalha com:** Controlador (dados financeiros), Atendente (transição)
- **Recebe leads de:** Gestor de Tráfego, captação ativa

#### 💰 Custo Estimado (mensal)
- **Fixo:** R$ 3.000 - 5.000
- **Variável:** 5-10% sobre vendas
- **Total estimado:** R$ 6.000 - 12.000 (com comissões)

#### 🎬 Plano de Implementação

**Semana 1: Treinamento**
- [ ] Estudo do POP Comercial
- [ ] Leitura de Roteiro_Vendas.pdf
- [ ] Shadow com Jarvis (entender tom)
- [ ] Acesso a Kommo

**Semana 2: Prática**
- [ ] 10 abordagens supervisionadas
- [ ] 2 reuniões com Jarvis presente
- [ ] Análise de leads antigos
- [ ] Criação de script próprio

**Semana 3: Autonomia parcial**
- [ ] Abordagens independentes
- [ ] Reuniões com aprovação prévia
- [ ] Follow-ups supervisionados

**Semana 4: Autonomia total**
- [ ] Ciclo completo independente
- [ ] Primeiras vendas solo
- [ ] Revisão semanal com Jarvis

---

### 3. DIRETOR DE ARTE TOTUM
**Departamento:** Criação (Design + Web + UX)  
**Status POP:** 🟡 Em desenvolvimento (11 gatilhos)  
**Impacto:** 🔴 Crítico - Sem criação = sem campanhas

#### 🎯 Responsabilidades (11 Gatilhos)

| Gatilho | Descrição | Tempo SLA |
|---------|-----------|-----------|
| G1 | Recebimento demanda | Imediato |
| G2 | Validação escopo | - |
| G3 | Entendimento e direção | - |
| G4 | Pesquisa e referências | - |
| G5 | Construção ideia | - |
| G6 | Produção | Varia |
| G7 | Revisão interna | - |
| G8 | Envio aprovação | - |
| G9 | Ajustes | - |
| G10 | Entrega final | 24h-15 dias |
| G11 | Registro e encerramento | - |

#### 📋 Descrição da Função
> Produzir todos os materiais visuais da operação: criativos para redes sociais, peças de anúncio, landing pages e sites completos. Garantir consistência de marca, qualidade visual e conversão (design que vende, não só que é bonito).

#### 🛠️ Skills Obrigatórias
- **Adobe Creative Suite:** Photoshop, Illustrator (obrigatório)
- **Figma:** Prototipação, UI/UX (diferencial)
- **Design para conversão:** Hierarquia visual, CTA, princípios Gestalt
- **Branding:** Consistência de marca, diretrizes visuais
- **Web:** Landing pages, sites (conhecimento de no-code/low-code)
- **Social media:** Formatos específicos (feed, stories, reels)

#### 📊 KPIs de Sucesso
- Tempo de entrega conforme SLA (criativos: 24-48h, LP: 3-7 dias)
- Taxa de aprovação na primeira entrega > 60%
- CTR dos criativos > média do nicho
- Retrabalho < 20%

#### 👥 Relacionamentos
- **Reporta para:** Liz (revisão, qualidade, escopo)
- **Trabalha com:** Gestor de Tráfego (especificações), Radar Estratégica (direção)
- **Recebe demandas de:** Todos os departamentos (prioridade: Tráfego)

#### 💰 Custo Estimado (mensal)
- **CLT/PJ:** R$ 5.000 - 8.000
- **Tempo necessário:** 120-160h/mês

#### 🎬 Plano de Implementação

**Semana 1: Contexto**
- [ ] Leitura POP Criação
- [ ] Análise de trabalhos anteriores
- [ ] Entendimento de padrão visual Totum
- [ ] Acesso a Adobe, Drive, Freedcamp

**Semana 2: Primeiras peças**
- [ ] 5 criativos simples supervisionados
- [ ] Revisão com Liz (feedback)
- [ ] Ajuste de processo

**Semana 3: Autonomia**
- [ ] Produção independente
- [ ] Revisão por Liz (pós-entrega)
- [ ] Organização de arquivos

**Semana 4: Integração**
- [ ] Trabalho com tráfego ativo
- [ ] Entrega de primeira LP
- [ ] Estabelecer rotina com Gestor de Tráfego

---

## 🟡 PRIORIDADE 2 - MÉDIO PRAZO (Contratar em 60-90 dias)

### 4. ESPECIALISTA CRM / AUTOMAÇÃO
**Departamento:** Automação & CRM  
**Status POP:** 🟢 VERSÃO FINAL (10 gatilhos)  
**Impacto:** 🟡 Alto técnico, mas pode ser gerenciado temporariamente

#### 🎯 Responsabilidades (10 Gatilhos)

| Gatilho | Descrição | Tempo SLA |
|---------|-----------|-----------|
| G1 | Recebimento demanda | - |
| G2 | Validação comercial | - |
| G3 | Coleta acessos | - |
| G4 | Desenho lógica | - |
| G5 | Aprovação interna | - |
| G6 | Implementação técnica | - |
| G7 | Testes funcionais | - |
| G8 | Validação cliente | - |
| G9 | Publicação produção | - |
| G10 | Documentação | - |

#### 📋 Descrição da Função
> Implementar e manter sistemas de automação: funis no Kommo, bots de WhatsApp, integrações com n8n. Garantir que leads fluam corretamente desde a captação até o fechamento, com rastreabilidade total.

#### 🛠️ Skills Obrigatórias
- **Kommo:** Funis, tags, bots, campos personalizados
- **n8n:** Automações, integrações, webhooks, APIs
- **APIs:** Meta (WhatsApp/Instagram), Google, plataformas diversas
- **Lógica de programação:** Condições, loops, variáveis
- **Testes:** Fluxos completos, tratamento de erros
- **Documentação:** Criar e manter wiki técnica

#### 📊 KPIs de Sucesso
- Tempo de implementação dentro do SLA (7-14 dias onboarding)
- Taxa de erro em automações < 2%
- Tempo de resposta a falhas: imediato
- % de automações utilizadas pelo cliente > 80%
- Taxa de resposta dos leads > 70%

#### 👥 Relacionamentos
- **Reporta para:** Jarvis (eficiência, otimização)
- **Trabalha com:** Vendedor (fluxo comercial), Atendente (suporte)
- **Depende de:** Acessos validados (Liz aprova)

#### 💰 Custo Estimado (mensal)
- **PJ/Especializado:** R$ 6.000 - 10.000
- **Observação:** Pode ser parceiro/terceirizado inicialmente

#### 🎬 Plano de Implementação

**Mês 1: Mapeamento**
- [ ] Auditoria de automações existentes
- [ ] Documentação do estado atual
- [ ] Criação de backlog de melhorias

**Mês 2: Padronização**
- [ ] Criar templates de automação
- [ ] Estabelecer padrões de documentação
- [ ] Implementar monitoramento

**Mês 3: Otimização**
- [ ] Revisar taxas de conversão
- [ ] Ajustar fluxos baseado em dados
- [ ] Criar playbook de automações

---

## 📈 MATRIZ DE IMPACTO × COMPLEXIDADE

```
           BAIXA COMPLEXIDADE          ALTA COMPLEXIDADE
          ┌────────────────────┬────────────────────┐
          │                    │                    │
 ALTO     │   Controlador      │   Especialista CRM │
 IMPACTO  │   (ADM)            │   (Automação)      │
          │   ━━━━━━━━━━       │   ━━━━━━━━━━━━━━   │
          │   Prioridade 1     │   Prioridade 2     │
          │                    │                    │
──────────┼────────────────────┼────────────────────┤
          │                    │                    │
 MÉDIO    │   Vendedor Totum   │   Diretor de Arte  │
 IMPACTO  │   (Comercial)      │   (Criação)        │
          │   ━━━━━━━━━━       │   ━━━━━━━━━━━━━━   │
          │   Prioridade 1     │   Prioridade 1     │
          │                    │                    │
          └────────────────────┴────────────────────┘
```

---

## 💼 ORÇAMENTO CONSOLIDADO

### Investimento Mensal (4 novos agentes)

| Agente | Faixa Salarial | Observação |
|--------|----------------|------------|
| Controlador | R$ 4.000 - 6.000 | Fixo |
| Vendedor Totum | R$ 6.000 - 12.000 | Fixo + comissão |
| Diretor de Arte | R$ 5.000 - 8.000 | Fixo |
| Especialista CRM | R$ 6.000 - 10.000 | Fixo ou projeto |
| **TOTAL** | **R$ 21.000 - 36.000** | Variável com performance |

### Retorno Esperado

| Métrica | Projeção | Prazo |
|---------|----------|-------|
| Novos clientes/mês | +10-20 | 3 meses |
| Taxa de inadimplência | -50% | 2 meses |
| Velocidade de entrega | +30% | 2 meses |
| Taxa de fechamento | +25% | 3 meses |
| Receita adicional | R$ 50.000+/mês | 6 meses |

**ROI estimado:** 150-250% em 6 meses

---

## 🎯 ROTEIRO DE CONTRATAÇÃO

### Fase 1: Fundação (Mês 1)
```
Semana 1-2: Controlador
├─ Publicar vaga
├─ Triagem currículos  
├─ Entrevistas
└─ Contratação

Semana 3-4: Onboarding Controlador
└─ (conforme plano acima)
```

### Fase 2: Crescimento (Mês 2)
```
Semana 1-2: Vendedor Totum + Diretor de Arte (paralelo)
├─ Publicar vagas
├─ Triagem
├─ Entrevistas
└─ Contratações

Semana 3-4: Onboarding
└─ (conforme planos acima)
```

### Fase 3: Escala (Mês 3)
```
Semana 1-2: Especialista CRM
├─ Publicar vaga ou contatar parceiro
├─ Negociação
└─ Contratação

Semana 3-4: Onboarding
└─ (conforme plano acima)
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Contratar

- [ ] Definir orçamento aprovado
- [ ] Criar descrições de vaga detalhadas
- [ ] Preparar testes práticos para cada função
- [ ] Definir processo de entrevista (etapas)
- [ ] Preparar plano de onboarding

### Durante Contratação

- [ ] Publicar vagas (LinkedIn, Indeed, grupos)
- [ ] Triar currículos (filtros objetivos)
- [ ] Aplicar testes práticos
- [ ] Entrevistas com Trindade
- [ ] Verificar referências

### Após Contratação

- [ ] Assinar contrato
- [ ] Liberar acessos (sistemas)
- [ ] Apresentar à equipe
- [ ] Iniciar onboarding estruturado
- [ ] Agendar revisão 30-60-90 dias

---

## 🎬 CENÁRIOS ALTERNATIVOS

### Cenário A: Orçamento Limitado
**Prioridade:** Controlador → Vendedor (meio período) → Diretor de Arte (freelancer)

| Agente | Modelo | Custo |
|--------|--------|-------|
| Controlador | CLT/PJ integral | R$ 5.000 |
| Vendedor | Meio período + comissão agressiva | R$ 4.000 |
| Diretor de Arte | Freelancer (projeto) | R$ 3.000-5.000 |
| Especialista CRM | Terceirizado (hora técnica) | R$ 2.000-3.000 |
| **TOTAL** | | **R$ 14.000 - 17.000** |

### Cenário B: Crescimento Acelerado
**Prioridade:** Contratar os 4 simultaneamente + estagiário de apoio

| Agente | Modelo | Custo |
|--------|--------|-------|
| Controlador | Integral | R$ 6.000 |
| Vendedor (2x) | Integral + comissão | R$ 18.000 |
| Diretor de Arte | Integral | R$ 7.000 |
| Especialista CRM | Integral | R$ 8.000 |
| Estagiário | Meio período | R$ 1.500 |
| **TOTAL** | | **R$ 40.500** |

---

## ✅ CONCLUSÃO

Para executar **A Bíblia** completamente, a Totum precisa de **4 agentes especialistas**:

1. **Controlador** - Fundação financeira
2. **Vendedor Totum** - Máquina de vendas
3. **Diretor de Arte** - Qualidade visual
4. **Especialista CRM** - Escala técnica

**Sem esses agentes:**
- ❌ Processos ficam na teoria (Bíblia) e não na prática
- ❌ Trindade sobrecarregada
- ❌ Crescimento limitado pela capacidade individual

**Com esses agentes:**
- ✅ Cada departamento tem dono e responsável
- ✅ SLAs são cumpridos consistentemente
- ✅ Trindade foca em supervisão e estratégia
- ✅ Escalabilidade operacional

**Próximo passo:** Aprovar orçamento e iniciar processo seletivo para Controlador.

---

*Análise baseada em Pop_Totum_Unificado.pdf - Abril 2026*
