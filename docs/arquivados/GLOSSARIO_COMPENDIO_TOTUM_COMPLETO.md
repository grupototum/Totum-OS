# 📚 GLOSSÁRIO E COMPÊNDIO TOTUM - CONSULTA RÁPIDA
## Manual de referência para A Trindade e agentes especialistas

**Baseado em:** Pop_Totum_Unificado.pdf (A Bíblia)  
**Última atualização:** Abril 2026

---

## 🗂️ ÍNDICE RÁPIDO

1. [A Trindade - Quem é Quem](#1-a-trindade---quem-é-quem)
2. [Agentes Especialistas](#2-agentes-especialistas)
3. [Departamentos e Gatilhos](#3-departamentos-e-gatilhos)
4. [SLAs por Prioridade](#4-slas-por-prioridade)
5. [KPIs Consolidados](#5-kpis-consolidados)
6. [Fluxos Comuns](#6-fluxos-comuns)
7. [Terminologia](#7-terminologia)
8. [Quem Chamar Para...](#8-quem-chamar-para)

---

## 1. A TRINDADE - QUEM É QUEM

### 👤 MIGUEL - O ARQUITETO

| Aspecto | Descrição |
|---------|-----------|
| **Função** | Governança, Estratégia, Visão de longo prazo |
| **Decide** | Direção da empresa, cultura, estrutura organizacional |
| **Não faz** | Execução operacional do dia-a-dia |
| **Quando chamar** | Decisões estruturais, conflitos entre áreas, visão de futuro |
| **Gatilhos Bíblia** | Governança G1-G12, Planejamento G4, G6, G9 |
| **Supervisiona** | Todos os departamentos (visão sistêmica) |

**Frase-guia:** *"Miguel define O QUE e POR QUÊ, não COMO"*

---

### 👤 LIZ - A GUARDIÃ

| Aspecto | Descrição |
|---------|-----------|
| **Função** | Qualidade, Processos, Proteção de escopo, Consistência |
| **Decide** | O que entra no escopo, padrões de qualidade, validações |
| **Não faz** | Criação do zero, execução sem validação prévia |
| **Quando chamar** | Dúvida sobre escopo, aprovação necessária, revisão de qualidade |
| **Gatilhos Bíblia** | Atendimento (todos), Validação de escopo (todos os deptos) |
| **Supervisiona** | Atendimento, Criação (revisão), ADM (validação) |

**Frase-guia:** *"Liz protege a empresa do caos e do escopo infinito"*

---

### 👤 JARVIS - O EXECUTOR

| Aspecto | Descrição |
|---------|-----------|
| **Função** | Execução, Otimização, Eficiência, Resultado rápido |
| **Decide** | Como executar, quando ajustar, o que otimizar |
| **Não faz** | Planejamento estratégico sem contexto, processos burocráticos |
| **Quando chamar** | Precisa de resultados rápidos, otimizações, execução técnica |
| **Gatilhos Bíblia** | Tráfego Pago (todos), Automação G6-G9, Comercial G2, G4, G5 |
| **Supervisiona** | Tráfego Pago, Automação, Comercial (tática) |

**Frase-guia:** *"Jarvis faz acontecer e elimina fricção"*

---

## 2. AGENTES ESPECIALISTAS

### 🆕 AGENTES A CONTRATAR

| Agente | Departamento | Função Principal | Skills Necessários |
|--------|--------------|------------------|-------------------|
| **Controlador** | ADM/Financeiro | 11 gatilhos financeiros | Asaas, Stripe, cobrança, relatórios |
| **Vendedor Totum** | Comercial | 12 gatilhos de vendas | CRM, prospecção, negociação, follow-up |
| **Diretor de Arte** | Criação | 11 gatilhos de design | Adobe, UX, branding, direção criativa |
| **Especialista CRM** | Automação | n8n, Kommo, integrações | APIs, automação, testes técnicos |

### 🟢 AGENTES EXISTENTES

| Agente | Departamento | Função | Reporta para |
|--------|--------------|--------|--------------|
| **Atendente Totum** | Atendimento | 8 gatilhos de suporte | Liz |
| **Gestor de Tráfego** | Tráfego Pago | 11 gatilhos de campanhas | Jarvis |
| **Radar Estratégica** | Planejamento | 12 gatilhos de planejamento | Miguel |

---

## 3. DEPARTAMENTOS E GATILHOS

### 🔷 ADM / FINANCEIRO
**Status:** 🟡 Em desenvolvimento  
**Gatilhos:** 11

| # | Gatilho | Tempo | Dono Ideal |
|---|---------|-------|------------|
| G1 | Recebimento novo cliente | - | Controlador |
| G2 | Formalização contratual | 24h | Controlador |
| G3 | Configuração cobrança | 24h | Controlador |
| G4 | Emissão cobrança | 24h | Controlador |
| G5 | Confirmação pagamento | 12h úteis | Controlador |
| G6 | Controle inadimplência | Contínuo | Controlador |
| G7 | Bloqueio operacional | Quando necessário | Liz (aprova) |
| G8 | Controle financeiro interno | Diário | Controlador |
| G9 | Relatórios financeiros | Semanal/Mensal | Controlador |
| G10 | Organização e arquivo | Contínuo | Controlador |
| G11 | Registro e encerramento | - | Controlador |

**SLA Crítico:** 24h envio contrato, 12h confirmação pagamento

---

### 🔷 ATENDIMENTO / SUPORTE
**Status:** 🟢 VERSÃO FINAL  
**Gatilhos:** 8

| # | Gatilho | Tempo | Dono |
|---|---------|-------|------|
| G1 | Recebimento demanda | Imediato | Atendente Totum |
| G2 | Classificação demanda | 4h úteis | Atendente Totum |
| G3 | Validação escopo | - | Liz (aprova) |
| G4 | Definição responsável | - | Atendente Totum |
| G5 | Comunicação cliente | 2h úteis | Atendente Totum |
| G6 | Acompanhamento demanda | Contínuo | Atendente Totum |
| G7 | Entrega/resposta | Conforme SLA | Responsável pela task |
| G8 | Registro e encerramento | - | Atendente Totum |

**SLA Crítico:** 2h resposta inicial, 4h classificação

**Princípio-chave:** *"Atendimento organiza, direciona e protege a operação"*

---

### 🔷 AUTOMAÇÃO & CRM
**Status:** 🟢 VERSÃO FINAL  
**Gatilhos:** 10

| # | Gatilho | Tempo | Dono Ideal |
|---|---------|-------|------------|
| G1 | Recebimento demanda | - | Especialista CRM |
| G2 | Validação comercial | - | Liz (aprova) |
| G3 | Coleta acessos | - | Especialista CRM |
| G4 | Desenho lógica | - | Especialista CRM |
| G5 | Aprovação interna | - | Liz (aprova) |
| G6 | Implementação técnica | - | Especialista CRM |
| G7 | Testes funcionais | - | Especialista CRM |
| G8 | Validação cliente | - | Especialista CRM |
| G9 | Publicação produção | - | Especialista CRM |
| G10 | Documentação | - | Especialista CRM |

**SLA Crítico:** 7-14 dias onboarding, imediato erros críticos

**Princípio-chave:** *"CRM não é ferramenta. É sistema de receita."*

---

### 🔷 COMERCIAL
**Status:** 🟡 Em desenvolvimento  
**Gatilhos:** 12

| # | Gatilho | Tempo | Dono Ideal |
|---|---------|-------|------------|
| G1 | Geração/recebimento lead | - | Vendedor Totum |
| G2 | Abordagem inicial | 2h úteis | Vendedor Totum |
| G3 | Conexão e qualificação | - | Vendedor Totum |
| G4 | Proposta de valor | - | Vendedor Totum |
| G5 | Chamada para ação | - | Vendedor Totum |
| G6 | Agendamento | 48h | Vendedor Totum |
| G7 | Preparação reunião | - | Vendedor Totum |
| G8 | Reunião de venda | - | Vendedor Totum |
| G9 | Follow-up | 24h úteis | Vendedor Totum |
| G10 | Fechamento | - | Vendedor Totum |
| G11 | Transição onboarding | - | Vendedor Totum |
| G12 | Registro e encerramento | - | Vendedor Totum |

**SLA Crítico:** 2h primeiro contato, 24h follow-up

---

### 🔷 CRIAÇÃO (DESIGN + WEB + UX)
**Status:** 🟡 Em desenvolvimento  
**Gatilhos:** 11

| # | Gatilho | Tempo | Dono Ideal |
|---|---------|-------|------------|
| G1 | Recebimento demanda | - | Diretor de Arte |
| G2 | Validação escopo | - | Liz (aprova) |
| G3 | Entendimento e direção | - | Diretor de Arte |
| G4 | Pesquisa e referências | - | Diretor de Arte |
| G5 | Construção ideia | - | Diretor de Arte |
| G6 | Produção | Varia | Diretor de Arte |
| G7 | Revisão interna | - | Liz (revisa) |
| G8 | Envio aprovação | - | Diretor de Arte |
| G9 | Ajustes | - | Diretor de Arte |
| G10 | Entrega final | 24h-15dias | Diretor de Arte |
| G11 | Registro e encerramento | - | Diretor de Arte |

**SLA Crítico:** 
- Criativos simples: 24-48h
- Landing pages: 3-7 dias
- Sites completos: 7-15 dias

🚨 **Prioridade máxima:** Demandas de tráfego ativo

---

### 🔷 GOVERNANÇA / GESTÃO
**Status:** 🟡 Em desenvolvimento  
**Gatilhos:** 12

| # | Gatilho | Frequência | Dono |
|---|---------|------------|------|
| G1 | Definição regras | Contínuo | Miguel |
| G2 | Padronização processos | Quinzenal | Miguel |
| G3 | Auditoria tasks | 1x/semana | Miguel |
| G4 | Controle SLA | Contínuo | Miguel |
| G5 | Análise performance | Quinzenal | Miguel |
| G6 | Gestão documentação | Contínuo | Miguel |
| G7 | Identificação gargalos | Contínuo | Miguel |
| G8 | Melhoria contínua | Contínuo | Miguel |
| G9 | Integração departamentos | Contínuo | Miguel |
| G10 | Gestão riscos | Contínuo | Miguel |
| G11 | Visão executiva | Semanal | Miguel |
| G12 | Registro e evolução | Contínuo | Miguel |

**SLA Crítico:** Auditoria mínimo 1x/semana, revisão quinzenal

**Princípio-chave:** *"Sem padrão = caos operacional"*

---

### 🔷 PLANEJAMENTO (SOCIAL + CAMPANHAS)
**Status:** 🟡 Em desenvolvimento  
**Gatilhos:** 12

| # | Gatilho | Tempo | Dono |
|---|---------|-------|------|
| G1 | Recebimento demanda | - | Radar Estratégica |
| G2 | Análise contexto | - | Radar Estratégica |
| G3 | Definição objetivos | - | Radar Estratégica |
| G4 | Definição temas | - | Radar Estratégica |
| G5 | Pesquisa e insights | - | Radar Estratégica |
| G6 | Estruturação plano | - | Radar Estratégica |
| G7 | Criação calendário | - | Radar Estratégica |
| G8 | Definição direção criativa | - | Radar Estratégica |
| G9 | Validação interna | - | Miguel (aprova) |
| G10 | Envio aprovação | - | Radar Estratégica |
| G11 | Entrega e distribuição | - | Radar Estratégica |
| G12 | Registro e encerramento | - | Radar Estratégica |

**SLA Crítico:** 
- Semanal: 1-2 dias
- Mensal: 3-5 dias
- Campanha: 2-4 dias

---

### 🔷 TRÁFEGO PAGO
**Status:** 🟢 VERSÃO FINAL  
**Gatilhos:** 11

| # | Gatilho | Tempo | Dono |
|---|---------|-------|------|
| G1 | Recebimento demanda | - | Gestor de Tráfego |
| G2 | Validação escopo/verba | - | Jarvis (valida) |
| G3 | Alinhamento CRM/funil | - | Gestor de Tráfego |
| G4 | Definição estratégia | - | Gestor de Tráfego |
| G5 | Criação ativos | - | Criação (fornece) |
| G6 | Configuração campanha | - | Gestor de Tráfego |
| G7 | Publicação/ativação | - | Gestor de Tráfego |
| G8 | Monitoramento inicial | - | Gestor de Tráfego |
| G9 | Otimização contínua | 3x/semana | Gestor de Tráfego |
| G10 | Integração resultado | - | Gestor de Tráfego |
| G11 | Relatório e registro | - | Gestor de Tráfego |

**SLA Crítico:** 2-5 dias setup, 24h ajustes, imediato erros

**Princípio-chave:** *"Tráfego não é clique. É lead qualificado que vira venda."*

---

## 4. SLAs POR PRIORIDADE

### 🔴 URGENTE (0-4 horas)

| Situação | Tempo | Quem resolve |
|----------|-------|--------------|
| Erro em campanha ativa | Imediato | Gestor de Tráfego + Jarvis |
| Sistema fora do ar | Imediato | Especialista CRM + Jarvis |
| Perda de lead | Imediato | Atendente + Liz |
| Correção erro Automação (produção) | Imediato | Especialista CRM |

### 🟡 RÁPIDO (4-24 horas)

| Situação | Tempo | Quem resolve |
|----------|-------|--------------|
| Resposta atendimento | 2h úteis | Atendente Totum |
| Primeiro contato comercial | 2h úteis | Vendedor Totum |
| Confirmação pagamento | 12h úteis | Controlador |
| Ajuste simples Automação | 24h úteis | Especialista CRM |
| Ajuste simples Criação | 24h úteis | Diretor de Arte |
| Ajuste Tráfego | 24h úteis | Gestor de Tráfego |

### 🟢 PADRÃO (1-7 dias)

| Situação | Tempo | Quem resolve |
|----------|-------|--------------|
| Envio contrato | 24h | Controlador |
| Configuração cobrança | 24h | Controlador |
| Planejamento semanal | 1-2 dias | Radar Estratégica |
| Criativos simples | 24-48h | Diretor de Arte |
| Setup campanha | 2-5 dias | Gestor de Tráfego |
| Planejamento campanha | 2-4 dias | Radar Estratégica |

### 🔵 LONGO PRAZO (7+ dias)

| Situação | Tempo | Quem resolve |
|----------|-------|--------------|
| Onboarding Automação | 7-14 dias | Especialista CRM |
| Nova automação | 3-7 dias | Especialista CRM |
| Landing page | 3-7 dias | Diretor de Arte |
| Site completo | 7-15 dias | Diretor de Arte |

---

## 5. KPIs CONSOLIDADOS

### 📊 POR DEPARTAMENTO

| Departamento | KPI 1 | KPI 2 | KPI 3 | KPI 4 | KPI 5 |
|--------------|-------|-------|-------|-------|-------|
| **ADM** | Taxa inadimplência | Tempo médio pagamento | Faturamento mensal | Margem lucro | Fluxo caixa |
| **Atendimento** | Tempo resposta | Tempo resolução | Volume demandas | % fora escopo | Satisfação cliente |
| **Automação** | Tempo implementação | Taxa erro | Tempo resposta falhas | % automações usadas | Conversão funil |
| **Comercial** | Taxa resposta | Taxa agendamento | Taxa comparecimento | Taxa fechamento | Ticket médio |
| **Criação** | Tempo entrega | Taxa aprovação 1ª vez | Tempo revisão | CTR criativos | Conversão |
| **Governança** | % cumprimento SLA | Tempo médio execução | Volume retrabalho | Falhas operacionais | Eficiência geral |
| **Planejamento** | Cumprimento calendário | Performance conteúdos | Alinhamento objetivos | Taxa retrabalho | Engajamento |
| **Tráfego** | CPC | CPM | CTR | CPL | ROI |

### 🎯 KPIs GERAIS DA TOTUM

| Indicador | Fórmula | Meta | Quem monitora |
|-----------|---------|------|---------------|
| Taxa conversão lead → cliente | (Vendas / Leads) × 100 | 15%+ | Miguel |
| Custo aquisição cliente (CAC) | Gastos marketing / Novos clientes | < 30% ticket | Miguel |
| NPS Cliente | Pesquisa satisfação | > 50 | Liz |
| Churn mensal | Clientes perdidos / Total | < 5% | Liz |
| Receita recorrente (MRR) | Soma mensalidades | Crescimento 10%/mês | Controlador |
| Lucro líquido | Receita - Despesas | > 20% | Controlador |

---

## 6. FLUXOS COMUNS

### 🔄 NOVO CLIENTE (Jornada Completa)

```
1. TRÁFEGO PAGO
   └─ Gera lead qualificado
   
2. COMERCIAL
   └─ Vendedor qualifica, reúne, fecha
   
3. ADM/FINANCEIRO
   └─ Controlador emite contrato, configura cobrança
   
4. AUTOMAÇÃO & CRM
   └─ Especialista configura funil, bots, integrações
   
5. PLANEJAMENTO
   └─ Radar estrutura calendário, conteúdo
   
6. CRIAÇÃO
   └─ Diretor de Arte produz peças
   
7. TRÁFEGO PAGO (novamente)
   └─ Gestor otimiza campanhas
   
8. ATENDIMENTO
   └─ Atendente suporta cliente
   
9. GOVERNANÇA
   └─ Miguel monitora KPIs, ajusta processos
```

### 🔄 NOVA DEMANDA DO CLIENTE

```
1. Origem: WhatsApp/Email/Reunião
   └─
   
2. ATENDIMENTO
   ├─ G1: Registra demanda
   ├─ G2: Classifica (Suporte/Ajuste/Nova)
   └─ G3: Valida escopo com Liz
   
3. Se FORA DO ESCOPO
   └─ Liz nega ou solicita aprovação extra
   
4. Se DENTRO DO ESCOPO
   └─ Direciona para departamento responsável
   
5. Execução pelo departamento
   └─ Segue POP específico
   
6. ATENDIMENTO (retorno)
   ├─ G7: Entrega ao cliente
   └─ G8: Registra e encerra
```

### 🔄 NOVA CAMPANHA

```
1. PLANEJAMENTO
   ├─ Define objetivos, temas, calendário
   └─ Distribui tasks
   
2. CRIAÇÃO
   └─ Produz criativos
   
3. TRÁFEGO PAGO
   ├─ Configura campanha
   ├─ Publica
   └─ Monitora/otimiza
   
4. AUTOMAÇÃO
   └─ Garante fluxo de leads
   
5. COMERCIAL
   └─ Converte leads em vendas
   
6. ATENDIMENTO
   └─ Suporta durante campanha
```

---

## 7. TERMINOLOGIA

### 📝 GLOSSÁRIO

| Termo | Definição | Contexto |
|-------|-----------|----------|
| **Bíblia** | Documento POP/SLA unificado que governa toda a operação | Governança |
| **Gatilho** | Evento que inicia um processo ou ação obrigatória | Todos os POPs |
| **Escopo** | Limites do que está incluído no serviço contratado | Atendimento, Criação |
| **SLA** | Acordo de Nível de Serviço - tempo máximo para entrega | Todos os deptos |
| **KPI** | Indicador Chave de Performance - métrica de sucesso | Governança |
| **Onboarding** | Processo de integração de novo cliente | Automação, Comercial |
| **Lead** | Potencial cliente que demonstrou interesse | Comercial, Tráfego |
| **Funil** | Jornada do lead desde o primeiro contato até a venda | Automação, CRM |
| **TAG** | Etiqueta de classificação no CRM | Comercial, Atendimento |
| **Retrabalho** | Refazer algo que já foi entregue | Criação, Governança |
| **CTR** | Click-Through Rate - taxa de cliques | Tráfego |
| **CPL** | Cost Per Lead - custo por lead | Tráfego |
| **CPA** | Cost Per Acquisition - custo por aquisição | Tráfego |
| **ROI** | Return on Investment - retorno sobre investimento | Tráfego |

### 🎯 ABREVIATURAS

| Sigla | Significado | Usado em |
|-------|-------------|----------|
| **ADM** | Administração | ADM/Financeiro |
| **CRM** | Customer Relationship Management | Automação, Comercial |
| **LP** | Landing Page | Criação, Tráfego |
| **CTA** | Call to Action | Criação, Comercial |
| **VSL** | Video Sales Letter | Comercial |
| **ERP** | Enterprise Resource Planning | ADM |
| **BI** | Business Intelligence | Governança |
| **MRR** | Monthly Recurring Revenue | ADM |
| **NPS** | Net Promoter Score | Atendimento |
| **CAC** | Customer Acquisition Cost | Governança |

---

## 8. QUEM CHAMAR PARA...

### 🆘 SITUAÇÕES DE EMERGÊNCIA

| Situação | Chamar | Backup |
|----------|--------|--------|
| Campanha parada | Jarvis | Gestor de Tráfego |
| Sistema fora do ar | Especialista CRM | Jarvis |
| Cliente irritado | Liz | Atendente Totum |
| Erro grave em produção | Especialista CRM | Jarvis |
| Decisão estrutural urgente | Miguel | - |

### 📋 SITUAÇÕES OPERACIONAIS

| Situação | Chamar | Quando escalar |
|----------|--------|----------------|
| Nova venda | Vendedor Totum | Fechamento → Jarvis |
| Dúvida cliente | Atendente Totum | Fora escopo → Liz |
| Nova peça design | Diretor de Arte | Revisão → Liz |
| Campanha nova | Gestor de Tráfego | Estratégia → Jarvis |
| Configurar automação | Especialista CRM | Complexo → Jarvis |
| Cobrança atrasada | Controlador | Inadimplência → Liz |
| Planejamento mensal | Radar Estratégica | Aprovação → Miguel |
| Relatório financeiro | Controlador | Análise → Miguel |

### ❓ DÚVIDAS E APROVAÇÕES

| Dúvida sobre... | Quem sabe | Se não souber |
|-----------------|-----------|---------------|
| O que está no escopo? | Liz | Ver contrato |
| Como fazer mais rápido? | Jarvis | Simplificar processo |
| Por que fazemos assim? | Miguel | Revisar Bíblia |
| Está bom o suficiente? | Liz | Padrão de qualidade |
| Dá pra vender isso? | Jarvis | Testar com lead |
| Quanto cobrar? | Controlador | Analisar custos |
| Quando entrega? | Responsável pela task | Verificar SLA |

---

## 📎 REFERÊNCIAS RÁPIDAS

### 📄 Documentos Oficiais

| Documento | Localização | Última atualização |
|-----------|-------------|-------------------|
| Bíblia (conteúdo completo) | `BIBLIA_CONTEUDO_COMPLETO.md` | Abril 2026 |
| Análise Trindade | `ANALISE_TRINDADE_X_BIBLIA_DETALHADA.md` | Abril 2026 |
| Agentes Faltantes | `AGENTES_FALTANTES_ATUALIZADO.md` | Abril 2026 |
| Estrutura POP/SLA | `BIBLIA_POP_SLA_ESTRUTURA.md` | Abril 2026 |

### 🔗 Links Úteis

| Sistema | Uso | Quem acessa |
|---------|-----|-------------|
| Kommo | CRM, leads, vendas | Todos |
| Freedcamp | Tasks, projetos | Todos |
| n8n | Automações | Especialista CRM, Jarvis |
| Asaas/Stripe | Cobranças | Controlador |
| Meta Ads | Tráfego pago | Gestor de Tráfego |
| Google Ads | Tráfego pago | Gestor de Tráfego |

---

*Este glossário deve ser consultado sempre que houver dúvida sobre processos, responsabilidades ou SLAs.*

**Versão 1.0 - Abril 2026**
