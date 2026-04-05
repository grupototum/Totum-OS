# 📖 A BÍBLIA - POP/SLA TOTUM (CONTEÚDO COMPLETO)
## Extraído de: Pop_Totum_Unificado.pdf
## Data: Abril 2026

---

## 1. ADM / FINANCEIRO (ADM TOTUM)

### 🔗 GATILHO 1 — RECEBIMENTO DE NOVO CLIENTE / DEMANDA FINANCEIRA
**Origem:**
- comercial (venda fechada)
- renovação
- cobrança recorrente

**Ações:**
- Criar registro financeiro do cliente
- Validar dados básicos (nome, CPF/CNPJ, contato)

---

### 🔗 GATILHO 2 — FORMALIZAÇÃO CONTRATUAL
- Gerar contrato
- Enviar para assinatura
- Validar: assinatura concluída, dados corretos

📌 **Sem contrato validado, não inicia operação.**

---

### 🔗 GATILHO 3 — CONFIGURAÇÃO DE COBRANÇA
- Definir: valor, forma de pagamento (PIX, boleto, cartão), recorrência
- Configurar em: Asaas / Stripe / sistema utilizado

---

### 🔗 GATILHO 4 — EMISSÃO DE COBRANÇA
- Gerar cobrança
- Enviar para cliente
- Registrar: data de vencimento, status

---

### 🔗 GATILHO 5 — CONFIRMAÇÃO DE PAGAMENTO
- Validar pagamento recebido
- Atualizar status: pago/pendente
- Informar equipe interna (liberação de onboarding)

---

### 🔗 GATILHO 6 — CONTROLE DE INADIMPLÊNCIA
- Monitorar pagamentos em atraso
- Ações: lembrete automático, contato direto
- Classificar: atraso leve, risco, inadimplente

---

### 🔗 GATILHO 7 — BLOQUEIO OPERACIONAL (QUANDO NECESSÁRIO)
Em caso de inadimplência:
- Sinalizar no CRM
- Comunicar equipe
- Possíveis ações: pausa de serviços, bloqueio parcial

📌 **Sempre com comunicação clara ao cliente.**

---

### 🔗 GATILHO 8 — CONTROLE FINANCEIRO INTERNO
- Atualizar entradas e saídas
- Classificar: custos, despesas, receitas
- Alimentar sistema (ERP/planilha)

---

### 🔗 GATILHO 9 — RELATÓRIOS FINANCEIROS
- Gerar: faturamento, lucro, inadimplência
- Periodicidade: semanal, mensal

---

### 🔗 GATILHO 10 — ORGANIZAÇÃO E ARQUIVO
- Armazenar: contratos, comprovantes, notas
- Garantir fácil acesso, organização por cliente

---

### 🔗 GATILHO 11 — REGISTRO E ENCERRAMENTO
- Registrar ações realizadas
- Atualizar status
- Encerrar task no sistema

---

### ⏱️ SLA — ADM / FINANCEIRO

| Item | Prazo |
|------|-------|
| Envio de contrato | até 24h após venda |
| Configuração de cobrança | até 24h após assinatura |
| Emissão de cobrança | imediata ou até 24h |
| Confirmação de pagamento | até 12h úteis |
| Cobrança de inadimplência | início em até 1 dia após vencimento |

---

### 📊 KPIs
- taxa de inadimplência
- tempo médio de pagamento
- faturamento mensal
- margem de lucro
- fluxo de caixa

---

### ⚠️ REGRAS
- ❌ não iniciar serviço sem pagamento (quando aplicável)
- ❌ não deixar cobrança sem controle
- ❌ não perder contratos ou registros
- ✅ manter organização financeira
- ✅ comunicar atrasos rapidamente
- ✅ garantir previsibilidade

---

## 2. ATENDIMENTO / SUPORTE AO CLIENTE
**🎯 FUNÇÃO:** Gerenciar toda comunicação com o cliente, garantir organização das demandas, controle de SLA e proteção de escopo.

**🧠 PRINCÍPIO-CHAVE:** Atendimento não resolve tudo. Atendimento organiza, direciona e protege a operação.

---

### 🔗 GATILHO 1 — RECEBIMENTO DA DEMANDA
**Origem:** WhatsApp, E-mail, Reunião, Kommo/CRM, Freedcamp (quando interno)

**Ações obrigatórias:**
- Registrar a demanda como task no Freedcamp
- Identificar: cliente, origem, tipo de solicitação

📌 **Nenhuma demanda existe fora do sistema.**

---

### 🔗 GATILHO 2 — CLASSIFICAÇÃO DA DEMANDA
**Tipo:** organizacional

**Classificar como:**
- Suporte (dúvida/erro)
- Ajuste (pequena alteração)
- Nova demanda (fora do escopo)
- Urgência (impacto direto no cliente)

**Definir prioridade:** Alta, Média, Baixa

📌 **Classificação define SLA.**

---

### 🔗 GATILHO 3 — VALIDAÇÃO DE ESCOPO
**Tipo:** proteção operacional

**Ações:**
- Verificar contrato/pacote
- Validar se está incluso, é extra, precisa de aprovação

**Saídas:** ✅ Executar | ⚠️ Solicitar aprovação | ❌ Negar (fora do escopo)

📌 **Atendimento protege a empresa de escopo infinito.**

---

### 🔗 GATILHO 4 — DEFINIÇÃO DE RESPONSÁVEL
**Tipo:** operacional

**Ações:**
- Atribuir responsável no Freedcamp
- Adicionar prazo conforme SLA
- Garantir que a task está clara

📌 **Task sem responsável = task esquecida.**

---

### 🔗 GATILHO 5 — COMUNICAÇÃO COM CLIENTE
**Tipo:** relacional

**Ações:**
- Confirmar recebimento
- Informar prazo estimado
- Alinhar expectativa

**Exemplo:** "Recebemos sua solicitação, já estamos analisando e te retorno até [prazo]."

---

### 🔗 GATILHO 6 — ACOMPANHAMENTO DA DEMANDA
**Tipo:** controle

**Ações:**
- Monitorar andamento no Freedcamp
- Cobrar responsável se necessário
- Atualizar cliente se houver atraso

📌 **Cliente nunca pode ficar no escuro.**

---

### 🔗 GATILHO 7 — ENTREGA / RESPOSTA
**Tipo:** conclusão

**Ações:**
- Validar entrega internamente
- Comunicar cliente com clareza
- Confirmar se está resolvido

---

### 🔗 GATILHO 8 — REGISTRO E ENCERRAMENTO
**Tipo:** rastreabilidade

**Ações:**
- Registrar: o que foi feito, ajustes realizados
- Marcar task como concluída

📌 **Se não foi registrado, não existe.**

---

### ⏱️ SLA — ATENDIMENTO / SUPORTE

| Item | Prazo |
|------|-------|
| Resposta inicial ao cliente | Até 2 horas úteis |
| Classificação e direcionamento | Até 4 horas úteis |
| Suporte simples | Até 24h úteis |
| Ajustes médios | Até 48h úteis |
| Demandas maiores | Definido por escopo + comunicado ao cliente |

---

### 🚨 SLA DE URGÊNCIA
Quando há:
- erro em campanha ativa
- sistema fora do ar
- perda de lead

👉 **Atendimento imediato + priorização total**

---

### 📊 INDICADORES (KPIs)
- tempo médio de resposta
- tempo médio de resolução
- volume de demandas por cliente
- % de demandas fora do escopo
- satisfação do cliente

---

### ⚠️ REGRAS IMPORTANTES
- ❌ Nunca executar demanda sem registro
- ❌ Nunca prometer prazo sem validar
- ❌ Nunca assumir demanda fora do escopo
- ✅ Sempre registrar tudo
- ✅ Sempre alinhar expectativa

---

### 🧠 VISÃO DE DONO
Esse departamento:
- evita caos,
- protege margem,
- mantém cliente informado,
- e sustenta todos os outros.

---

## 3. AUTOMAÇÃO & CRM
**🎯 FUNÇÃO:** Estruturar, implementar e manter o sistema de vendas dos clientes, garantindo: captação organizada, atendimento eficiente, automação inteligente, e evolução contínua.

**🧠 PRINCÍPIO-CHAVE:** CRM não é ferramenta. É sistema de receita.

---

### 🔗 GATILHO 1 — RECEBIMENTO DA DEMANDA
**Origem:** onboarding (novo cliente), atendimento (ajuste ou problema), planejamento (nova estratégia), comercial (promessa feita)

**Ações:**
- Criar task no projeto Automação
- Identificar: cliente, tipo (onboarding/ajuste/melhoria/erro), origem da demanda

---

### 🔗 GATILHO 2 — VALIDAÇÃO COMERCIAL E CONTRATUAL
**Tipo:** proteção de escopo

**Ações:**
- Confirmar: produto contratado, limites do pacote
- Validar: se está incluso, se precisa de aprovação extra
- Checar: pendências financeiras

**Saídas:** ✅ aprovado | ⚠️ precisa aprovação | ❌ bloqueado

📌 **Automação sem validação = prejuízo.**

---

### 🔗 GATILHO 3 — COLETA DE ACESSOS E PRÉ-REQUISITOS
**Tipo:** técnico

**Ações:**
- Coletar e testar: Kommo, WhatsApp, Instagram/Meta, APIs/integrações, e-mail
- Validar: permissões, ambiente (produção/teste)

**Segurança:** armazenar dados sensíveis corretamente

📌 **Sem acesso validado, não começa.**

---

### 🔗 GATILHO 4 — DESENHO DA LÓGICA DA AUTOMAÇÃO
**Tipo:** estratégico

**Ações:**
- Definir objetivo da automação
- Mapear jornada: entrada → processamento → saída
- Identificar: pontos de falha, dependências externas
- Definir sucesso: o que precisa acontecer para considerar "funcionando"

📌 **Automação sem lógica = gambiarra.**

---

### 🔗 GATILHO 5 — APROVAÇÃO INTERNA DO FLUXO
**Tipo:** governança

**Ações:**
- Revisar tecnicamente
- Validar impacto operacional
- Garantir: simplicidade, aderência ao cliente, conformidade com políticas

📌 **Só implementa o que foi aprovado.**

---

### 🔗 GATILHO 6 — IMPLEMENTAÇÃO TÉCNICA
**Tipo:** execução

**Ações:**
- Construir no: Kommo (funil, tags, bots), n8n (lógica, integrações, delays)
- Configurar: variáveis, gatilhos, condições
- Ativar: logs, rastreabilidade

📌 **Sempre que possível, testar em ambiente controlado.**

---

### 🔗 GATILHO 7 — TESTES FUNCIONAIS
**Tipo:** validação

**Testes obrigatórios:**
- Entrada de lead
- Fluxo completo
- Saída (mensagem, ação, registro)
- Erros e exceções

**Evidência:** registrar testes (print ou log)

📌 **Se não testou erro, não testou de verdade.**

---

### 🔗 GATILHO 8 — VALIDAÇÃO COM CLIENTE (quando necessário)
**Tipo:** alinhamento

**Ações:**
- Demonstrar funcionamento
- Validar: lógica, mensagens, fluxo

**Saída:** ajustes finos aprovados

---

### 🔗 GATILHO 9 — PUBLICAÇÃO EM PRODUÇÃO
**Tipo:** ativação

**Ações:**
- Ativar automação
- Monitorar primeiros eventos
- Validar: funcionamento real, ausência de erro crítico

📌 **Primeiras horas são críticas.**

---

### 🔗 GATILHO 10 — DOCUMENTAÇÃO E ENCERRAMENTO
**Tipo:** governança

**Ações:**
- Registrar: o que foi feito, como funciona, riscos
- Atualizar Wiki/documentação
- Encerrar task apenas após estabilidade

📌 **Automação sem documentação vira problema futuro.**

---

### ⏱️ SLA — AUTOMAÇÃO & CRM

| Item | Prazo |
|------|-------|
| Setup inicial (onboarding) | até 7 a 14 dias úteis |
| Ajustes simples | até 24h úteis |
| Ajustes médios | até 48h úteis |
| Novas automações | até 3 a 7 dias úteis |
| Correções críticas (erro em produção) | imediato / prioridade máxima |

---

### 📊 INDICADORES (KPIs)
- tempo de implementação
- taxa de erro em automações
- tempo de resposta a falhas
- % de automações utilizadas pelo cliente
- conversão do funil
- taxa de resposta dos leads

---

### ⚠️ REGRAS IMPORTANTES
- ❌ não automatizar sem entender o processo
- ❌ não criar fluxos complexos sem necessidade
- ❌ não ignorar experiência do usuário
- ❌ não publicar sem teste
- ✅ priorizar automação simples e funcional
- ✅ sempre documentar
- ✅ sempre pensar em escala

---

### 🧠 VISÃO DE DONO
Esse departamento:
- gera receita,
- reduz esforço manual,
- aumenta conversão,
- e diferencia totalmente a Totum.

---

## 4. COMERCIAL

### 🔗 GATILHO 1 — GERAÇÃO / RECEBIMENTO DE LEAD
- Lead vindo de: tráfego pago, captação ativa (Gleads/listas), indicação, inbound (site, redes)
- Registrar no CRM (Kommo)
- Aplicar TAGs iniciais: origem, nicho, temperatura

---

### 🔗 GATILHO 2 — ABORDAGEM INICIAL
- Enviar primeira mensagem: leve, curta, sem venda direta
- Objetivo: iniciar conversa, gerar resposta

📌 **Ex: "Olá, aí é da [empresa]?"**

---

### 🔗 GATILHO 3 — CONEXÃO E QUALIFICAÇÃO
- Apresentar: quem é a Totum, contexto da abordagem
- Identificar: interesse, momento, necessidade
- Atualizar TAGs no CRM

---

### 🔗 GATILHO 4 — PROPOSTA DE VALOR
- Enviar sequência de valor:
  - Áudio 1: empatia e experiência
  - Áudio 2: diferenciais e posicionamento
- Objetivo: gerar confiança, preparar para reunião

---

### 🔗 GATILHO 5 — CHAMADA PARA AÇÃO
- Convidar para: ligação rápida, reunião estratégica
- Se não aceitar: enviar material (vídeo, PDF, VSL)

---

### 🔗 GATILHO 6 — AGENDAMENTO
- Marcar reunião em até: 48h ideal
- Confirmar: data, horário
- Garantir: envio de lembrete

---

### 🔗 GATILHO 7 — PREPARAÇÃO PARA REUNIÃO
- Analisar: respostas do lead, presença digital, informações no CRM
- Levantar: possíveis dores, oportunidades

---

### 🔗 GATILHO 8 — REUNIÃO DE VENDA
**Estrutura:**
- abertura leve
- sondagem
- diagnóstico
- apresentação consultiva
- convite para ação

📌 **Foco: resolver problema, não "vender serviço"**

---

### 🔗 GATILHO 9 — FOLLOW-UP
- Enviar: resumo da reunião, reforço de valor
- Aplicar: gatilhos de urgência
- Manter contato até decisão

---

### 🔗 GATILHO 10 — FECHAMENTO
- Formalizar: proposta, condições
- Confirmar: pagamento, dados do cliente
- Aplicar TAG: Cliente Confirmado

---

### 🔗 GATILHO 11 — TRANSIÇÃO PARA ONBOARDING
- Atualizar CRM: etapa: onboarding
- Criar: grupo de WhatsApp
- Iniciar: processo de onboarding

---

### 🔗 GATILHO 12 — REGISTRO E ENCERRAMENTO
- Registrar: histórico da venda, decisões
- Atualizar dados no CRM
- Encerrar ciclo comercial

---

### ⏱️ SLA — COMERCIAL

| Item | Prazo |
|------|-------|
| Primeiro contato | até 2h úteis |
| Follow-up inicial | até 24h úteis |
| Agendamento de reunião | até 48h |
| Envio de proposta | até 24h após reunião |
| Follow-up pós-reunião | até 24h úteis |

---

### 📊 KPIs
- taxa de resposta
- taxa de agendamento
- taxa de comparecimento
- taxa de fechamento
- tempo médio de venda
- ticket médio

---

### ⚠️ REGRAS
- ❌ não vender no primeiro contato
- ❌ não ignorar follow-up
- ❌ não deixar lead sem resposta
- ❌ não perder histórico
- ✅ sempre registrar no CRM
- ✅ sempre qualificar
- ✅ sempre conduzir para próxima etapa

---

## 5. CRIAÇÃO (DESIGN + WEB + UX)

### 🔗 GATILHO 1 — RECEBIMENTO DA DEMANDA
- Criar task no projeto Criação
- Identificar: cliente, tipo (criativo, social, LP, site, ajuste), origem (tráfego, planejamento, atendimento)

---

### 🔗 GATILHO 2 — VALIDAÇÃO DE ESCOPO
- Conferir contrato/pacote
- Definir: o que entra, o que não entra
- Solicitar aprovação se necessário

---

### 🔗 GATILHO 3 — ENTENDIMENTO E DIREÇÃO
- Analisar briefing (ou solicitar se não houver)
- Entender: objetivo da peça, público, canal de uso
- Validar alinhamento com estratégia

---

### 🔗 GATILHO 4 — PESQUISA E REFERÊNCIAS
- Buscar referências (Pinterest, Behance, etc.)
- Analisar concorrentes
- Definir direção visual

---

### 🔗 GATILHO 5 — CONSTRUÇÃO DA IDEIA
- Definir conceito criativo
- Estruturar: layout, hierarquia visual, CTA
- Aplicar princípios: Gestalt, contraste, leitura

---

### 🔗 GATILHO 6 — PRODUÇÃO
- Criar peça nos apps (Adobe/Photoshop)
- Garantir: qualidade visual, consistência de marca, adaptação para formato

---

### 🔗 GATILHO 7 — REVISÃO INTERNA
- Revisar: ortografia, alinhamento visual, coerência com objetivo
- Ajustar antes de enviar

---

### 🔗 GATILHO 8 — ENVIO PARA APROVAÇÃO
- Enviar para responsável interno ou cliente
- Registrar feedback
- Evitar múltiplas versões soltas

---

### 🔗 GATILHO 9 — AJUSTES
- Aplicar feedback
- Validar novamente
- Garantir que não distorceu a ideia inicial

---

### 🔗 GATILHO 10 — ENTREGA FINAL
- Exportar nos formatos corretos
- Garantir: resolução, peso, padrão do canal
- Enviar e registrar no Freedcamp

---

### 🔗 GATILHO 11 — REGISTRO E ENCERRAMENTO
- Registrar o que foi feito
- Armazenar arquivos (Drive/sistema)
- Marcar task como concluída

---

### ⏱️ SLA — CRIAÇÃO (DESIGN + WEB + UX)

| Item | Prazo |
|------|-------|
| Criativos simples (post, anúncio) | até 24 a 48h úteis |
| Criativos médios (carrossel, múltiplas peças) | até 2 a 4 dias úteis |
| Landing pages | até 3 a 7 dias úteis |
| Sites completos | até 7 a 15 dias úteis |
| Ajustes simples | até 24h úteis |

🚨 **PRIORIDADE:** demandas de tráfego ativo → prioridade máxima

---

### 📊 KPIs
- tempo de entrega
- taxa de aprovação sem retrabalho
- tempo médio de revisão
- performance dos criativos (CTR, conversão)

---

### ⚠️ REGRAS
- ❌ não criar sem objetivo claro
- ❌ não pular etapa de revisão
- ❌ não ignorar estratégia
- ✅ seguir padrão visual
- ✅ priorizar clareza e conversão
- ✅ manter organização de arquivos

---

## 6. GOVERNANÇA / GESTÃO

### 🔗 GATILHO 1 — DEFINIÇÃO DE REGRAS OPERACIONAIS
- Criar e atualizar: POPs, SLAs, padrões de execução
- Garantir: clareza, aplicabilidade, acesso para o time

---

### 🔗 GATILHO 2 — PADRONIZAÇÃO DE PROCESSOS
- Definir: estrutura de tasks, nomenclaturas, fluxos padrão
- Garantir consistência entre departamentos

📌 **Sem padrão = caos operacional**

---

### 🔗 GATILHO 3 — AUDITORIA DE TASKS
- Revisar tasks nos projetos: preenchimento correto, responsáveis definidos, prazos coerentes
- Identificar: tasks paradas, gargalos, falhas de execução

---

### 🔗 GATILHO 4 — CONTROLE DE SLA
- Monitorar: cumprimento de prazos, atrasos
- Identificar: departamentos com problema, clientes em risco

---

### 🔗 GATILHO 5 — ANÁLISE DE PERFORMANCE OPERACIONAL
- Avaliar: eficiência dos processos, tempo médio de entrega, volume de retrabalho
- Identificar oportunidades de melhoria

---

### 🔗 GATILHO 6 — GESTÃO DE DOCUMENTAÇÃO (WIKI)
- Criar e atualizar: POPs, manuais, fluxos
- Garantir: organização, fácil acesso, versionamento

---

### 🔗 GATILHO 7 — IDENTIFICAÇÃO DE GARGALOS
- Mapear: onde a operação trava, onde há perda de tempo, onde há erro recorrente

---

### 🔗 GATILHO 8 — MELHORIA CONTÍNUA
- Propor: ajustes de processo, automações, simplificações
- Validar e implementar melhorias

---

### 🔗 GATILHO 9 — INTEGRAÇÃO ENTRE DEPARTAMENTOS
- Garantir alinhamento entre: atendimento, comercial, tráfego, criação, automação
- Corrigir desalinhamentos

---

### 🔗 GATILHO 10 — GESTÃO DE RISCOS
- Identificar: clientes em risco, falhas operacionais, dependências críticas
- Definir ações preventivas

---

### 🔗 GATILHO 11 — VISÃO EXECUTIVA
- Consolidar: dados dos departamentos, indicadores
- Gerar visão: operacional, estratégica

---

### 🔗 GATILHO 12 — REGISTRO E EVOLUÇÃO
- Registrar: melhorias implementadas, mudanças de processo
- Atualizar documentação

---

### ⏱️ SLA — GOVERNANÇA / GESTÃO

| Item | Prazo |
|------|-------|
| Auditoria de tasks | mínimo 1x por semana |
| Revisão de processos | mínimo quinzenal |
| Atualização de documentação | contínuo / até 48h após mudança |
| Identificação de gargalos | contínuo |
| Implementação de melhorias | até 3 a 7 dias úteis |

---

### 📊 KPIs
- % de cumprimento de SLA
- tempo médio de execução por departamento
- volume de retrabalho
- número de falhas operacionais
- tempo de resposta ao cliente
- eficiência geral da operação

---

### ⚠️ REGRAS
- ❌ não operar sem padrão
- ❌ não ignorar falhas recorrentes
- ❌ não deixar processos desatualizados
- ❌ não permitir tasks sem dono
- ✅ documentar tudo
- ✅ padronizar sempre
- ✅ melhorar continuamente
- ✅ manter visão sistêmica

---

### 🧠 VISÃO FINAL DE DONO
Esse departamento:
- garante qualidade,
- evita caos,
- sustenta escala,
- e transforma operação em sistema.

---

## 7. PLANEJAMENTO (SOCIAL MEDIA + CAMPANHAS)

### 🔗 GATILHO 1 — RECEBIMENTO DA DEMANDA / CICLO DE PLANEJAMENTO
- Criar task no projeto Planejamento
- Identificar: cliente, período (semanal/mensal/campanha), objetivo principal

---

### 🔗 GATILHO 2 — ANÁLISE DE CONTEXTO
- Analisar: momento do cliente, histórico de campanhas, desempenho anterior
- Levantar: pontos fortes, gargalos, oportunidades

---

### 🔗 GATILHO 3 — DEFINIÇÃO DE OBJETIVOS
- Definir objetivo principal: alcance, engajamento, geração de leads, vendas
- Garantir: objetivo claro, mensurável

---

### 🔗 GATILHO 4 — DEFINIÇÃO DE TEMAS E LINHAS EDITORIAIS
- Definir: pilares de conteúdo, temas estratégicos
- Considerar: tendências, dores do público, posicionamento da marca

---

### 🔗 GATILHO 5 — PESQUISA E INSIGHTS
- Buscar: tendências (redes sociais), referências, concorrentes
- Identificar: formatos que performam, oportunidades de diferenciação

---

### 🔗 GATILHO 6 — ESTRUTURAÇÃO DO PLANO
- Organizar: ideias de conteúdo, campanhas, formatos (reels, carrossel, stories, anúncios)
- Definir: frequência, volume

---

### 🔗 GATILHO 7 — CRIAÇÃO DO CALENDÁRIO
- Montar calendário editorial: datas, temas, formatos
- Integrar com: tráfego pago, CRM, campanhas ativas

---

### 🔗 GATILHO 8 — DEFINIÇÃO DE DIREÇÃO CRIATIVA
- Definir: abordagem, tom de comunicação, estilo visual (em conjunto com criação)

---

### 🔗 GATILHO 9 — VALIDAÇÃO INTERNA
- Revisar: coerência estratégica, viabilidade de execução
- Ajustar se necessário

---

### 🔗 GATILHO 10 — ENVIO PARA APROVAÇÃO
- Apresentar planejamento ao cliente (quando aplicável)
- Coletar feedback
- Ajustar se necessário

---

### 🔗 GATILHO 11 — ENTREGA E DISTRIBUIÇÃO
- Enviar planejamento final
- Distribuir tasks para: criação, tráfego, automação

---

### 🔗 GATILHO 12 — REGISTRO E ENCERRAMENTO
- Registrar planejamento no sistema
- Arquivar histórico
- Marcar task como concluída

---

### ⏱️ SLA — PLANEJAMENTO (SOCIAL + CAMPANHAS)

| Item | Prazo |
|------|-------|
| Planejamento semanal | até 1 a 2 dias úteis |
| Planejamento mensal | até 3 a 5 dias úteis |
| Planejamento de campanha específica | até 2 a 4 dias úteis |
| Ajustes no planejamento | até 24 a 48h úteis |

---

### 📊 KPIs
- cumprimento do calendário
- performance dos conteúdos
- alinhamento com objetivos
- taxa de retrabalho
- engajamento e resultados das campanhas

---

### ⚠️ REGRAS
- ❌ não planejar sem objetivo
- ❌ não copiar concorrentes sem adaptação
- ❌ não ignorar dados anteriores
- ❌ não desconectar do CRM e tráfego
- ✅ planejar com foco em resultado
- ✅ integrar com outros departamentos
- ✅ manter consistência

---

## 8. TRÁFEGO PAGO
**🎯 FUNÇÃO:** Gerar demanda previsível e qualificada, alimentando o CRM com leads com potencial real de conversão.

**🧠 PRINCÍPIO-CHAVE:** Tráfego não é clique. É lead qualificado que vira venda.

---

### 🔗 GATILHO 1 — RECEBIMENTO DA DEMANDA / CAMPANHA
**Origem:** onboarding, planejamento estratégico, cliente (promoção/campanha), otimização interna

**Ações:**
- Criar task no projeto Tráfego
- Definir: objetivo da campanha, tipo (captação/remarketing/institucional)

---

### 🔗 GATILHO 2 — VALIDAÇÃO DE ESCOPO E VERBA
**Tipo:** estratégico / financeiro

**Ações:**
- Confirmar: orçamento disponível, canais (Meta, Google, TikTok)
- Validar: se a campanha está dentro do pacote, expectativa realista de resultado

📌 **Tráfego sem verba clara = problema.**

---

### 🔗 GATILHO 3 — ALINHAMENTO COM CRM E FUNIL
**Tipo:** integração crítica

**Ações:**
- Definir: para onde o lead vai (Kommo, WhatsApp, LP), como será tratado
- Validar: tags automáticas, origem do lead, integração com n8n

📌 **Lead sem destino estruturado = dinheiro perdido.**

---

### 🔗 GATILHO 4 — DEFINIÇÃO DE ESTRATÉGIA
**Tipo:** estratégico

**Ações:**
- Definir: público (segmentação), oferta (o que está sendo vendido), criativos necessários, tipo de campanha

**Tipos comuns:**
- captação direta
- geração de leads
- tráfego para WhatsApp
- remarketing

---

### 🔗 GATILHO 5 — CRIAÇÃO DOS ATIVOS
**Tipo:** produção

**Ações:**
- Solicitar ou criar: criativos (vídeo, imagem), copy dos anúncios
- Validar: clareza, coerência com o público, aderência à oferta

📌 **Criativo ruim = campanha morta.**

---

### 🔗 GATILHO 6 — CONFIGURAÇÃO DA CAMPANHA
**Tipo:** técnico

**Ações:**
- Configurar: campanha, conjuntos, anúncios
- Definir: orçamento diário, posicionamento, eventos de conversão

**Integração:** garantir pixel ativo, eventos funcionando, link correto

---

### 🔗 GATILHO 7 — PUBLICAÇÃO E ATIVAÇÃO
**Tipo:** execução

**Ações:**
- Publicar campanha
- Verificar: aprovação da plataforma, entrega inicial

📌 **Primeiras horas são críticas.**

---

### 🔗 GATILHO 8 — MONITORAMENTO INICIAL
**Tipo:** validação

**Ações:**
- Acompanhar: impressões, cliques, custo inicial
- Identificar: erros, baixo desempenho inicial

---

### 🔗 GATILHO 9 — OTIMIZAÇÃO CONTÍNUA
**Tipo:** melhoria

**Ações:**
- Ajustar: criativos, público, orçamento
- Pausar: anúncios ruins
- Escalar: anúncios vencedores

📌 **Tráfego é ajuste constante.**

---

### 🔗 GATILHO 10 — INTEGRAÇÃO COM RESULTADO (CRM)
**Tipo:** estratégico

**Ações:**
- Analisar: qualidade dos leads, taxa de resposta, conversão no CRM
- Alinhar com: equipe de vendas, automação

📌 **Métrica final não é clique. É venda.**

---

### 🔗 GATILHO 11 — RELATÓRIO E REGISTRO
**Tipo:** governança

**Ações:**
- Registrar: resultados principais, aprendizados
- Atualizar: métricas, status da campanha

---

### ⏱️ SLA — TRÁFEGO PAGO

| Item | Prazo |
|------|-------|
| Setup inicial de campanha | até 2 a 5 dias úteis |
| Ajustes simples | até 24h úteis |
| Otimização contínua | análise mínima 3x por semana |
| Correção de erro crítico | imediato |

---

### 📊 KPIs PRINCIPAIS
- CPC (custo por clique)
- CPM (custo por mil)
- CTR
- CPL (custo por lead)
- CPA (custo por aquisição)
- taxa de conversão no CRM
- ROI

---

### ⚠️ REGRAS IMPORTANTES
- ❌ não rodar campanha sem funil estruturado
- ❌ não escalar campanha ruim
- ❌ não ignorar qualidade do lead
- ❌ não tomar decisão com poucos dados
- ✅ sempre testar variações
- ✅ sempre integrar com CRM
- ✅ sempre olhar resultado final

---

### 🧠 VISÃO DE DONO
Esse departamento:
- alimenta toda a operação,
- define crescimento,
- e só funciona quando conectado ao CRM.

---

*Documento extraído e estruturado em: Abril 2026*
*Fonte: Pop_Totum_Unificado.pdf (43 páginas)*
