# 💻 PROMPT PARA LOVABLE - PÁGINAS DOS AGENTES + CADASTRO CLIENTE
## Prompt completo para desenvolvimento no Lovable.dev

---

## PROMPT 1: PÁGINA INICIAL - DASHBOARD DOS AGENTES

```markdown
Crie uma página inicial/dashboard moderna e profissional para a Totum, 
uma agência de marketing digital e automação. A página deve ser o 
"Mission Control" onde mostramos todos os agentes de IA disponíveis.

### DESIGN
- Estilo: Clean, moderno, tech-forward mas acessível
- Cores: Laranja #f76926 (cor principal da Totum), cinza escuro, branco
- Layout: Grid de cards com os agentes
- Referência visual: Dashboard de administração moderno (tipo Vercel, Linear)

### CONTEÚDO
Header com:
- Logo "Totum" 
- Subtítulo: "Centro de Controle de Agentes IA"

Grid de 8 agentes (cards clicáveis):

1. 🤖 MIGUEL - O Arquiteto
   - Supervisor Estratégico
   - Função: Governança, visão de longo prazo
   - Status: 🟢 Online
   - Ícone: Coroa/Trono

2. 👁️ LIZ - A Guardiã  
   - Protetora do Escopo
   - Função: Qualidade, processos, validações
   - Status: 🟢 Online
   - Ícone: Escudo

3. ⚡ JARVIS - O Executor
   - Especialista em Resultados
   - Função: Tráfego, otimização, eficiência
   - Status: 🟢 Online  
   - Ícone: Relâmpago/Bolt

4. 🗺️ CARTÓGRAFO - O Etnógrafo Digital
   - Análise Semântica
   - Função: Mapear audiência, sentimentos, nichos
   - Status: 🟢 Online
   - Ícone: Mapa/Bússola

5. 💰 CONTROLADOR - O Guardião Financeiro
   - ADM/Financeiro
   - Função: Contratos, cobranças, inadimplência
   - Status: 🟢 Online
   - Ícone: Gráfico/Chart

6. 💼 VENDEDOR - O Arquiteto de Oportunidades
   - Comercial
   - Função: Qualificação, negociação, fechamento
   - Status: 🟢 Online
   - Ícone: Mão em concha/Handshake

7. 🎨 DIRETOR DE ARTE - O Visual Strategist
   - Criação/Design
   - Função: Criativos, branding, landing pages
   - Status: 🟢 Online
   - Ícone: Paleta/Pincel

8. 🔧 ESPECIALISTA CRM - O Engenheiro de Fluxos
   - Automações/Integrações
   - Função: n8n, Kommo, bots
   - Status: 🟢 Online
   - Ícone: Engrenagens/Gears

### FUNCIONALIDADES
- Cada card deve ser clicável e abrir modal com detalhes do agente
- Status visual (online/offline/trabalhando)
- Estatísticas rápidas: "12 tasks hoje", "5 pendentes"
- Botão "Novo Projeto" no header
- Sidebar com: Dashboard, Clientes, Projetos, Configurações

### INTERAÇÕES
- Hover nos cards: efeito sutil de elevação + glow na cor do agente
- Clique: abre modal com:
  - Personalidade completa
  - Funções detalhadas
  - SLAs
  - KPIs
  - Botão "Atribuir Task"
```

---

## PROMPT 2: PÁGINA DE CADASTRO DE CLIENTE

```markdown
Crie uma página completa de cadastro de clientes para a Totum.
Esta página será o "Cliente Inteligência" - onde capturamos todos 
os dados necessários para os agentes trabalharem de forma acertiva.

### DESIGN
- Estilo: Form wizard multi-etapas (progresso no topo)
- Cores: Laranja #f76926, cinza, branco
- Layout: Card central com steps
- Progresso visual: Etapa 1 de 5 (indicador)

### ESTRUTURA - 5 ETAPAS

#### ETAPA 1: DADOS BÁSICOS
- Nome do cliente/empresa*
- CNPJ/CPF*
- Nome do responsável*
- E-mail*
- Telefone/WhatsApp*
- Website/Instagram
- Segmento de atuação* (dropdown)
- Tempo de mercado

#### ETAPA 2: CONTEXTO DE NEGÓCIO
- Descrição do produto/serviço*
- Proposta de valor (o que resolve para cliente final)*
- Diferencial competitivo
- Concorrentes diretos (3 principais)
- Ponto de dor atual que nos procura*
- Objetivo com a Totum* (dropdown: escalar, automatizar, estruturar...)

#### ETAPA 3: PÚBLICO-ALVO (Mapa Semântico)
- Quem é o cliente ideal?*
- Idade aproximada
- Gênero predominante
- Localização geográfica
- Nível de renda
- Dores principais do público* (textarea)
- Objeções comuns que ouvem
- Onde esse público está? (Instagram, LinkedIn, etc.)
- Hashtags que usam
- Influenciadores que seguem

#### ETAPA 4: IDENTIDADE VISUAL (Key Visual)
Upload de arquivos:
- Logo (SVG/PNG)*
- Paleta de cores da marca*
- Fontes utilizadas
- Imagens de produto/serviço
- Fotos do time/fundação (para humanizar)
- Vídeos institucionais
- Depoimentos de clientes (vídeo/texto)

Campos de descrição:
- Tom de voz da marca (formal, descontraído, técnico...)*
- O que NÃO pode falar/imagens que NÃO usa
- Inspirações visuais (links Pinterest/Behance)
- Restrições alimentares/culturais (se aplicável)

#### ETAPA 5: CONTEXTO OPERACIONAL
- Já trabalha com marketing digital? (sim/não/parcial)*
- O que já tentou que não funcionou?
- Quanto investe hoje em tráfego? (mensal)
- Qual volume de leads atual? (por mês)
- Taxa de conversão atual (se souber)
- Ticket médio do produto/serviço*
- Ticket médio do cliente (LTV estimado)
- Ciclo de vendas (quanto tempo leva fechar?)*
- Processo de vendas atual (descreva)
- CRM utilizado (se houver)
- Ferramentas de automação (se houver)
- Expectativa de resultado com a Totum* (textarea)

### FUNCIONALIDADES
- Validação em tempo real (campos obrigatórios)
- Salvamento automático (localStorage)
- Pré-visualização de uploads (ícone, imagem)
- Botão "Voltar" em todas etapas (exceto primeira)
- Progresso visual mostrando etapa atual
- Resumo final antes de enviar
- Animações suaves entre etapas

### APÓS ENVIO
- Tela de sucesso com confete/celebração
- "Cliente cadastrado com sucesso!"
- Botões: "Cadastrar novo" ou "Ir para Dashboard"
- Resumo dos próximos passos:
  1. Controlador vai emitir contrato (24h)
  2. Radar vai fazer planejamento inicial
  3. Reunião de kickoff agendada

### DADOS EXIBIDOS NO RESUMO
Após cadastro, mostrar card do cliente com:
- Nome + logo
- Status: "Em onboarding"
- Agente responsável: "Controlador (contrato)"
- Progresso visual do onboarding
- Próxima etapa: "Aguardando assinatura"
```

---

## PROMPT 3: PÁGINA DE PERFIL DO AGENTE (MODAL/DETALHE)

```markdown
Crie uma página/modal de perfil detalhado para cada agente da Totum.
Quando clicar no card do agente no dashboard, abre esta tela.

### DESIGN
- Layout: Sidebar esquerda (perfil) + Conteúdo direito (abas)
- Estilo: Profissional, tipo perfil do LinkedIn meets Notion
- Cores: Cor do agente como accent + neutros

### SIDEBAR ESQUERDA
- Avatar grande (ícone do agente)
- Nome completo do agente
- Função/Role
- Status: 🟢 Online / 🟡 Ocupado / 🔴 Offline
- Estatísticas rápidas:
  - Tasks hoje: X
  - Tasks pendentes: Y
  - Taxa de sucesso: Z%
- Botões de ação:
  - "Atribuir Nova Task"
  - "Ver Histórico"
  - "Configurações"

### ABAS DE CONTEÚDO

#### ABA 1: PERSONALIDADE
- Essência (frase de impacto)
- Traços Core (grid com 5 traços + descrição)
- Estilo de Comunicação
- Tom de Voz (exemplos do ✅ e ❌)

#### ABA 2: FUNÇÕES
- Lista de gatilhos (G1, G2, G3...)
- Para cada gatilho:
  - Nome
  - Descrição breve
  - Tempo SLA
  - Status: Ativo/Pausado

#### ABA 3: SLAs
- Tabela de tempos de resposta
- Indicadores visuais (verde/amarelo/vermelho)
- Histórico de cumprimento (gráfico simples)

#### ABA 4: KPIs
- Métricas principais em cards
- Gráfico de desempenho (últimos 30 dias)
- Comparação com meta

#### ABA 5: RELACIONAMENTOS
- Grid mostrando com quem interage
- Para cada relacionamento:
  - Avatar da outra pessoa/agente
  - Tipo de interação
  - Frequência
  - Última interação

### FUNCIONALIDADES ADICIONAIS
- Toggle "Modo Trabalho" (quando ligado, não recebe notificações não-urgentes)
- Configuração de alertas
- Preferências de comunicação
- Integrações ativas
```

---

## PROMPT 4: COMPONENTES ADICIONAIS

```markdown
Crie os seguintes componentes reutilizáveis:

### 1. CARD DE CLIENTE
Componente para mostrar cliente na lista:
- Logo + Nome
- Status colorido (Ativo/Onboarding/Pausado/Inativo)
- Barra de progresso do onboarding
- Agente responsável atual
- Próxima tarefa pendente
- Botão "Ver Detalhes"

### 2. TIMELINE DE INTERAÇÃO
Componente vertical mostrando histórico:
- Ícone do agente/envolvido
- Data/hora
- Tipo: Task concluída, Comentário, Arquivo, Decisão
- Descrição breve
- Link para detalhes

### 3. MODAL DE ATRIBUIÇÃO DE TASK
Form para criar nova tarefa:
- Título*
- Descrição*
- Agente responsável* (dropdown)
- Prioridade (Baixa/Média/Alta/Urgente)
- Prazo*
- Cliente relacionado
- Anexos
- Botão "Criar Task"

### 4. NOTIFICAÇÃO TOAST
Toast flutuante para alertas:
- Tipo: Sucesso, Erro, Aviso, Info
- Ícone correspondente
- Mensagem breve
- Botão fechar
- Auto-dismiss após 5s

### 5. HEADER COM BARRA DE BUSCA
Header fixo contendo:
- Logo Totum (esquerda)
- Barra de busca global (centro) - busca em clientes, tasks, agentes
- Ícone de notificações (badge com contador)
- Avatar do usuário logado (dropdown: Perfil, Config, Logout)
```

---

## RESUMO DAS PÁGINAS PARA DESENVOLVER

| # | Página | Prioridade | Tempo Est. |
|---|--------|------------|------------|
| 1 | Dashboard de Agentes | 🔴 Alta | 2-3h |
| 2 | Cadastro de Cliente (Wizard) | 🔴 Alta | 4-5h |
| 3 | Perfil do Agente (Modal) | 🟡 Média | 2-3h |
| 4 | Lista de Clientes | 🟡 Média | 1-2h |
| 5 | Detalhe do Cliente | 🟡 Média | 2-3h |

### DICAS PARA O LOVABLE

1. **Comece pelo Dashboard** - É a página mais visual e impactante
2. **Use dados reais** - Crie mock data com nomes dos agentes reais
3. **Animações suaves** - Transições entre estados, hover effects
4. **Responsivo** - Teste mobile, muitos acessarão pelo celular
5. **Dark mode** - Se possível, implemente toggle tema claro/escuro

### DATAS MOCK PARA TESTE

Clientes de exemplo:
- "Dr. Silva Estética" - Médico, onboarding
- "TechSolutions" - Software house, ativo
- "Moda Express" - E-commerce, ativo
- "Consultório Central" - Fisioterapia, pausado

Tasks de exemplo:
- "Criar automação de boas-vindas" - Especialista CRM
- "Produzir 5 criativos para campanha Q2" - Diretor de Arte
- "Fechar proposta cliente X" - Vendedor

---

*Prompt para desenvolvimento em Lovable.dev*  
*Totum - Centro de Controle de Agentes IA*  
*Abril 2026*
