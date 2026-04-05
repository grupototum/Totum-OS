# PROMPTS LOVABLE - TOTUM AGENTS
## Arquivo pronto para copiar e colar no Lovable.dev

---

## PROMPT 1: DASHBOARD DE AGENTES

```
Crie um dashboard moderno e profissional para gerenciamento de agentes de IA chamado "Totum Agents".

LAYOUT:
- Header fixo no topo com logo "Totum" (laranja #f76926), navegação principal (Dashboard, Agentes, Clientes, Workflows), e botão de perfil do usuário
- Sidebar esquerda com menu de navegação (Dashboard, Agentes, Clientes, Workflows, Configurações)
- Área principal em grid de cards

CONTEÚDO PRINCIPAL:
1. Seção de estatísticas (4 cards no topo):
   - Total de Agentes: 8 (com ícone 🤖)
   - Workflows Ativos: 24 (com ícone ⚡)
   - Clientes Atendidos: 156 (com ícone 👥)
   - Taxa de Sucesso: 94% (com ícone 📈)

2. Grid de Agentes (8 cards em grid 4x2):
   Cada card deve conter:
   - Avatar do agente (círculo com iniciais ou ícone)
   - Nome do agente (ex: Controlador, Cartógrafo, Vendedor)
   - Status (Online/Offline com bolinha verde/cinza)
   - Badge de categoria (ADM, Comercial, Criação, etc)
   - Estatísticas rápidas (tarefas hoje, taxa de sucesso)
   - Botão "Ver detalhes"

   Agentes a exibir:
   1. Controlador (ADM/Financeiro) - 💰
   2. Cartógrafo (Mapa Semântico) - 🗺️
   3. Vendedor (Comercial) - 💼
   4. Diretor de Arte (Criação) - 🎨
   5. Especialista CRM (Automações) - 🔧
   6. Orquestrador (Coordenação) - 🎼
   7. Atendente (Suporte) - 🎧
   8. Gestor de Tráfego (Ads) - 📊

3. Gráfico de uso (lado direito, altura completa):
   - Gráfico de linha mostrando uso dos agentes nos últimos 7 dias
   - Eixo Y: número de interações
   - Eixo X: dias da semana
   - Linhas coloridas por agente
   - Tooltip ao passar o mouse

4. Ações rápidas (bottom bar):
   - Botão "Novo Workflow" (primário, laranja #f76926)
   - Botão "Adicionar Cliente" (secundário)
   - Botão "Ver Relatórios" (secundário)

DESIGN SYSTEM:
- Cores: primária #f76926 (laranja), secundária #1a1a2e (azul escuro), background #fafafa
- Fonte: Inter (Google Fonts)
- Cards: branco com sombra suave (shadow-md), borda sutil, border-radius 12px
- Espaçamento: padding 24px, gap entre cards 16px
- Hover nos cards: elevação sutil (shadow-lg) e scale 1.02

INTERAÇÕES:
- Cards clicáveis levam para página de detalhes do agente
- Filtros por categoria (tabs: Todos, ADM, Comercial, Criação, Técnico)
- Search bar para buscar agentes por nome
- Toggle de visualização (grid/list)

RESPONSIVIDADE:
- Desktop: grid 4 colunas
- Tablet: grid 2 colunas
- Mobile: 1 coluna, cards empilhados

ESTADOS:
- Loading: skeleton screens nos cards
- Empty: ilustração amigável com "Nenhum agente encontrado"
- Error: mensagem de erro com botão de retry
```

---

## PROMPT 2: CADASTRO DE CLIENTE (5 ETAPAS)

```
Crie um wizard de cadastro de cliente em 5 etapas, moderno e intuitivo, chamado "Novo Cliente Totum".

ESTRUTURA GERAL:
- Header com progresso visual (5 steps, linha conectada)
- Área principal com formulário da etapa atual
- Footer com botões de navegação (Voltar/Próximo/Concluir)
- Sidebar direita com preview card do cliente sendo criado

ETAPA 1: DADOS BÁSICOS
- Título: "Informações da Empresa"
- Subtítulo: "Comece com os dados principais"
- Campos:
  * Nome da empresa (input text, obrigatório)
  * CNPJ (input com máscara, obrigatório)
  * Nome do responsável (input text, obrigatório)
  * Email corporativo (input email, obrigatório)
  * Telefone (input com máscara, obrigatório)
  * Site (input url, opcional)

ETAPA 2: CONTEXTO DE NEGÓCIO
- Título: "Sobre o Negócio"
- Subtítulo: "Nos ajude a entender o cliente"
- Campos:
  * Ramo de atuação (select: Saúde, Tecnologia, Educação, E-commerce, Serviços, Outros)
  * Descrição do negócio (textarea, placeholder: "O que a empresa faz?")
  * Produtos/Serviços oferecidos (textarea)
  * Tempo de mercado (select: Menos de 1 ano, 1-3 anos, 3-5 anos, 5+ anos)
  * Tamanho da empresa (select: Startup, PME, Grande empresa)
  * Faturamento mensal aproximado (select: Ranges)

ETAPA 3: PÚBLICO-ALVO (MAPA SEMÂNTICO)
- Título: "Público-Alvo"
- Subtítulo: "Quem são seus clientes ideais?"
- Campos:
  * Nicho principal (input text, placeholder: "Ex: Mães de primeira viagem")
  * Dores principais (textarea, placeholder: "Liste 3-5 dores do público")
  * Desejos/Objetivos (textarea)
  * Segmentação:
    - Idade (range slider: 18-65+)
    - Gênero (checkbox: Masculino, Feminino, Ambos)
    - Localização (select: Nacional, Regional, Internacional)
    - Classe social (select: A, B, C, D/E)
  * Tom de voz da marca (select: Formal, Descontraído, Técnico, Empático, Irreverente)

ETAPA 4: IDENTIDADE VISUAL
- Título: "Identidade Visual"
- Subtítulo: "Aparência da marca"
- Campos:
  * Upload de logo (dropzone com preview)
  * Paleta de cores primária (color picker, default: #f76926)
  * Paleta de cores secundária (color picker)
  * Fontes utilizadas (input text)
  * Key visual/Elementos gráficos (textarea)
  * Upload de materiais de referência (dropzone múltiplo)
  * Descrição da personalidade visual (textarea)

ETAPA 5: CONTEXTO OPERACIONAL
- Título: "Operação e Contatos"
- Subtítulo: "Últimos detalhes"
- Campos:
  * Canais de atendimento atuais (checkboxes: WhatsApp, Email, Telefone, Chat, Redes Sociais)
  * CRM utilizado (select: Kommo, HubSpot, Pipedrive, Salesforce, Outro, Nenhum)
  * SLA de resposta esperado (select: 1h, 2h, 4h, 8h, 24h)
  * Horário de funcionamento (time picker)
  * Dias de atendimento (checkboxes: Seg-Sex, Sáb, Dom)
  * Informações adicionais (textarea, opcional)
  * Termos de aceite (checkbox com link)

PREVIEW CARD (sidebar direita):
Card que atualiza em tempo real mostrando:
- Logo da empresa (uploaded ou placeholder)
- Nome da empresa
- Ramo de atuação (badge)
- Status: "Configurando..."
- Mini timeline: Etapa X de 5
- Próximo passo indicado

NAVEGAÇÃO:
- Botão "Voltar" (disabled na etapa 1)
- Botão "Próximo" (primário laranja, valida campos obrigatórios)
- Botão "Concluir" (última etapa, ícone de check)
- Steps clicáveis (se já preenchido)
- Indicador de progresso (% completo)

VALIDAÇÕES:
- Campos obrigatórios com asterisco vermelho
- Validação em tempo real (borda vermelha se inválido)
- Mensagens de erro claras abaixo dos campos
- Bloqueio de avanço se campos obrigatórios vazios

DESIGN:
- Cores: #f76926 primária, #fafafa background
- Formulário em card branco centralizado
- Inputs com border-radius 8px, padding 12px
- Labels em cima dos inputs, font-weight 500
- Espaçamento entre campos: 16px
- Animação suave entre etapas (fade/translate)

ESTADOS:
- Loading ao salvar: spinner + "Processando..."
- Sucesso: modal de confirmação + redirecionamento
- Erro: toast notification com mensagem
```

---

## PROMPT 3: PERFIL DO AGENTE

```
Crie uma página de perfil detalhada para um agente de IA, chamada "Perfil do Agente".

LAYOUT:
- Header com breadcrumb (Dashboard > Agentes > Nome do Agente)
- Área principal dividida em tabs
- Sidebar direita com ações e informações rápidas

HEADER DO PERFIL:
- Avatar grande (120px) com status online (bolinha verde pulsante)
- Nome do agente (H1)
- Badge de categoria (ex: ADM/Financeiro)
- Descrição curta (subtítulo)
- Botões de ação: "Editar", "Desativar", "Ver Logs"

TABS DE NAVEGAÇÃO:
1. Visão Geral
2. Personalidade
3. Gatilhos & SLAs
4. KPIs & Métricas
5. Relacionamentos

---

TAB 1: VISÃO GERAL

Card de Status (topo):
- Status atual: Online/Offline/Pausado
- Última atividade: "2 minutos atrás"
- Tarefas hoje: X completadas / Y total
- Taxa de sucesso hoje: Z%
- Tempo médio de resposta: X min

Gráfico de Atividade (7 dias):
- Gráfico de barras com interações diárias
- Eixo Y: número de tarefas
- Eixo X: dias da semana
- Barras coloridas por status (verde=sucesso, vermelho=erro)

Últimas Ações (lista):
- Timeline vertical com últimas 10 ações
- Cada item: timestamp, descrição, status, resultado

---

TAB 2: PERSONALIDADE

Essência do Agente:
- Card com texto descritivo da personalidade
- Citação em destaque (blockquote)
- Tom de voz (badges: Direto, Técnico, Amigável, etc)

Comunicação:
- Lista de "Frases típicas" (3-5 exemplos)
- Lista de "NUNCA diz" (3-5 exemplos)
- Tom de voz por contexto (tabela: com cliente, com equipe, em crise)

DNA:
- 5 princípios fundamentais (cards individuais)
- Cada card: ícone + título + descrição curta

---

TAB 3: GATILHOS & SLAs

Lista de Gatilhos (tabela ou cards):
Cada gatilho mostra:
- Código (ex: G1, G2)
- Nome (ex: "Onboarding Completo")
- Descrição do trigger
- SLA (tempo de resposta)
- Ação executada
- Frequência (diário/semanal/sob demanda)

SLAs Visuais:
- Cards com métricas:
  * Tempo médio de resposta: X min
  * Taxa de cumprimento: Y%
  * Alertas de SLA: Z este mês

Histórico de SLAs (gráfico de linha):
- Evolução do cumprimento de SLAs ao longo do tempo

---

TAB 4: KPIs & MÉTRICAS

Grid de KPIs (6 cards):
1. Workflows Completados (meta vs atual)
2. Taxa de Sucesso (%)
3. Tempo Médio de Execução
4. Satisfação dos Clientes
5. Escalonamentos (taxa)
6. Uptime do Sistema

Cada KPI card:
- Valor atual (grande)
- Meta (comparativo)
- Variação (% com seta up/down)
- Mini gráfico sparkline (7 dias)
- Status: 🟢 Atingido / 🟡 Próximo / 🔴 Abaixo

Radar Chart (habilidades):
- 6 dimensões: Velocidade, Precisão, Comunicação, Proatividade, Colaboração, Inovação
- Nota 0-10 em cada dimensão
- Comparação com média dos outros agentes

---

TAB 5: RELACIONAMENTOS

Mapa de Relacionamentos:
- Visualização em grafo ou lista
- Nós: agentes relacionados
- Arestas: tipo de relação

Lista de Relacionamentos:
Cada item:
- Avatar do agente relacionado
- Nome
- Tipo de relação (reporta, colabora, valida)
- Frequência de interação
- Status da relação (🟢 Saudável / 🟡 Tensão / 🔴 Conflito)

Comunicação por Relação:
- Tabela: com quem, frequência, tom, última interação

SIDEBAR DIREITA:
- Card "Ações Rápidas":
  * Testar Agente (botão)
  * Ver Logs Detalhados
  * Configurar Notificações
  * Clonar Agente
  
- Card "Informações Técnicas":
  * Modelo LLM utilizado
  * Versão do agente
  * Data de criação
  * Última atualização
  * ID do agente

- Card "Status do Sistema":
  * Indicadores de saúde (CPU, Memória, Latência)

DESIGN:
- Tabs estilo "pills" ou "underline"
- Conteúdo em cards separados
- Cores de status consistentes
- Animação suave ao trocar tabs
- Tooltips informativos nos ícones
```

---

## PROMPT 4: CENTRAL DE CLIENTES

```
Crie uma Central de Clientes completa com listagem e detalhes, chamada "Central de Clientes Totum".

LAYOUT GERAL:
- Header com título e botão "Novo Cliente"
- Área de filtros e busca
- Área principal com lista de clientes
- Visualização toggle: Lista / Grid / Kanban

---

SEÇÃO 1: FILTROS E BUSCA

Barra de busca:
- Input com ícone de lupa
- Placeholder: "Buscar por nome, CNPJ ou responsável..."
- Filtros avançados (dropdown)

Filtros:
- Status (todos, ativo, inativo, pendente)
- Ramo (select múltiplo)
- Tamanho (startup, PME, grande)
- Data de cadastro (range)
- Responsável interno (select)

Ações em lote:
- Checkbox "Selecionar todos"
- Botões: Exportar, Enviar mensagem, Alterar status

---

SEÇÃO 2: LISTA DE CLIENTES

Visualização LISTA (tabela):
Colunas:
- Checkbox (seleção)
- Logo/Nome (com avatar e nome da empresa)
- Responsável (nome + avatar)
- Ramo (badge)
- Status (badge colorido: verde=ativo, cinza=inativo, amarelo=pendente)
- Workflows ativos (número)
- Última interação (data relativa: "2h atrás")
- Ações (ícones: ver, editar, mais opções)

Visualização GRID (cards):
Cards em grid 3 colunas, cada card:
- Header: Logo da empresa + menu de ações
- Nome da empresa (H3)
- Ramo (badge pequeno)
- Linha divisória
- Responsável (avatar + nome)
- Status (bolinha + texto)
- Métricas rápidas: X workflows, Y agentes ativos
- Footer: "Ver detalhes" (link)

Visualização KANBAN (boards):
Colunas por status:
- Novos
- Em onboarding
- Ativos
- Inativos

Cada card no kanban:
- Logo mini
- Nome da empresa
- Responsável (avatar)
- Badge de prioridade (alta/média/baixa)
- Drag and drop entre colunas

---

SEÇÃO 3: PÁGINA DE DETALHES DO CLIENTE

Header:
- Logo grande da empresa
- Nome (H1)
- CNPJ
- Badge de status
- Botões: Editar, Desativar, Excluir

Tabs:
1. Visão Geral
2. Workflows
3. Agentes Ativos
4. Timeline
5. Documentos

TAB - VISÃO GERAL:
- Card com dados da empresa (todos os campos do cadastro)
- Card com métricas: tempo como cliente, total de interações, satisfação média
- Card com equipe de contato (foto, nome, cargo, telefone, email)

TAB - WORKFLOWS:
- Lista de workflows ativos para este cliente
- Cada workflow: nome, status, progresso, última atualização
- Botão "Novo Workflow"

TAB - AGENTES ATIVOS:
- Grid dos agentes que atendem este cliente
- Cada agente: avatar, nome, status, última interação
- Toggle para ativar/desativar agente para este cliente

TAB - TIMELINE:
- Timeline vertical completa de todas as interações
- Filtros por tipo (todos, chamados, campanhas, reuniões)
- Cada evento: data, tipo (ícone), descrição, responsável, resultado

TAB - DOCUMENTOS:
- Grid de documentos anexos
- Cada documento: ícone por tipo, nome, tamanho, data, ações (download, excluir)
- Botão "Upload de documento"

---

DESIGN:
- Cores: #f76926 para ações primárias
- Tabela com zebra striping opcional
- Hover nas linhas: background cinza claro
- Ordenação clicável nos headers
- Paginação no footer
- Empty state ilustrado quando sem resultados

INTERAÇÕES:
- Click na linha/card: abre detalhes
- Hover: mostra ações rápidas
- Filtros: aplicam em tempo real
- Busca: debounce de 300ms
- Drag and drop no kanban

RESPONSIVIDADE:
- Desktop: tabela completa
- Tablet: grid 2 colunas
- Mobile: cards empilhados, filtros em modal
```

---

## PROMPT 5: WORKFLOW VISUAL (ORQUESTRAÇÃO)

```
Crie um editor visual de workflows para orquestração de agentes, chamado "Workflow Builder Totum".

LAYOUT:
- Header: nome do workflow, status, botões (salvar, executar, publicar)
- Sidebar esquerda: paleta de nodes
- Área central: canvas para construção
- Sidebar direita: propriedades do node selecionado
- Footer: mini-map + zoom controls

---

SIDEBAR ESQUERDA - PALETA DE NODES:

Categorias (accordion):
1. AGENTES (ícone: 🤖)
   - Controlador
   - Cartógrafo
   - Vendedor
   - Diretor de Arte
   - Especialista CRM
   - Orquestrador

2. AÇÕES (ícone: ⚡)
   - Enviar email
   - Criar tarefa
   - Atualizar CRM
   - Webhook
   - Notificação
   - Delay/espera

3. CONDIÇÕES (ícone: 🔀)
   - IF/ELSE
   - Switch (múltiplos caminhos)
   - Validação de dados
   - Check de SLA

4. ENTRADAS (ícone: 📥)
   - Novo lead
   - Formulário preenchido
   - Webhook recebido
   - Agendamento
   - Trigger manual

5. SAÍDAS (ícone: 📤)
   - Fim com sucesso
   - Fim com erro
   - Escalar para humano
   - Registrar log

Cada node na paleta: ícone + nome, draggable para o canvas

---

CANVAS CENTRAL:

Grid de fundo (dots ou lines):
- Área infinita scrollável
- Zoom: 25% a 200%
- Pan com click and drag

Nodes no canvas:
Cada node visual:
- Header: cor por categoria + ícone + nome
- Corpo: inputs/outputs visuais
- Portas de conexão (círculos): entrada (esquerda), saídas (direita)
- Badge de status quando executando
- Contador de execuções

Tipos de Node:

1. NODE DE AGENTE:
   - Avatar do agente
   - Nome do agente
   - Input: prompt/contexto
   - Output: resposta/ação
   - Config: temperatura, modelo, timeout

2. NODE DE AÇÃO:
   - Ícone da ação
   - Título configurável
   - Campos de configuração
   - Output: resultado

3. NODE DE CONDIÇÃO:
   - Formato de diamante
   - Label da condição
   - Múltiplas saídas (verdadeiro/falso ou múltiplos cases)
   - Cores diferentes por caminho

4. NODE DE ENTRADA:
   - Formato arredondado na esquerda
   - Tipo de trigger
   - Configuração do trigger

5. NODE DE SAÍDA:
   - Formato arredondado na direita
   - Tipo de finalização
   - Ações pós-execução

CONEXÕES:
- Linhas entre portas
- Setas indicando direção
- Labels opcionais nas conexões
- Âncoras automáticas (evitar sobreposição)
- Cores por tipo de dados

---

SIDEBAR DIREITA - PROPRIEDADES:

Quando node selecionado:
- Título da seção: "Propriedades: [Nome do Node]"
- Tabs: Geral, Configuração, Avançado

Tab Geral:
- Nome do node (input)
- Descrição (textarea)
- Cor personalizada (color picker)
- Notas internas

Tab Configuração (varia por tipo):
- Para Agentes: seleção do agente, prompt template, variáveis
- Para Ações: campos específicos da ação
- Para Condições: regra/condição, operadores
- Para Triggers: configuração do gatilho

Tab Avançado:
- Timeout
- Retries em caso de erro
- Condição de skip
- Logs detalhados (sim/não)

---

EXECUÇÃO E DEBUG:

Modo Execução:
- Botão "Executar" (play)
- Node sendo executado: animação de pulso, cor amarela
- Node concluído: cor verde (sucesso) ou vermelho (erro)
- Node aguardando: cor azul
- Log de execução em tempo real (panel inferior)

Debug:
- Breakpoints em nodes
- Step-by-step execution
- Inspeção de variáveis
- Replay de execução

---

TOOLBAR SUPERIOR:

Botões:
- Desfazer/refazer
- Copiar/colar nodes
- Deletar seleção
- Agrupar em sub-flow
- Auto-organizar
- Exportar (JSON, PNG)
- Importar

---

FOOTER:

Mini-map:
- Visualização em miniatura de todo o workflow
- Retângulo indicando área visível
- Click no mini-map navega

Zoom:
- Slider de zoom
- Botões +/-
- Porcentagem atual
- Fit to screen

---

DESIGN:
- Canvas: background #f0f0f0 ou #fafafa
- Nodes: branco com sombra, border-radius 8px
- Conexões: linhas cinzas, 2px, setas triangulares
- Portas: círculos 12px, cor da categoria
- Seleção: border azul (#3b82f6) com glow
- Hover: elevação sutil
- Tipografia: Inter, 12-14px nos nodes

INTERAÇÕES:
- Drag and drop da paleta para canvas
- Drag nodes no canvas
- Conectar: arrastar de porta a porta
- Deletar: selecionar + delete ou botão
- Duplo click: abrir propriedades
- Right-click: context menu
- Ctrl+scroll: zoom
- Espaço+drag: pan

ANIMATIONS:
- Node drop: bounce sutil
- Conexão: draw line animation
- Execução: pulse ou glow no node ativo
- Transições suaves em todas as interações
```

---

## COMO USAR ESTES PROMPTS NO LOVABLE:

1. Acesse https://lovable.dev
2. Cole um prompt por vez no chat
3. Aguarde a geração (1-2 minutos)
4. Peça ajustes específicos se necessário
5. Quando satisfeito, peça para "build and deploy"
6. Para a próxima tela, cole o próximo prompt

---

**DICA:** Comece pelo Prompt 1 (Dashboard), depois 2 (Cadastro), 3 (Perfil), 4 (Central), e por último 5 (Workflow) - pois o 5 é o mais complexo.

---

Documento pronto para uso - Totum Agents 2026
