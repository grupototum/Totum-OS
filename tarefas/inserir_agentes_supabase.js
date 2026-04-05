const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://cgpkfhrqprqptvehatad.supabase.co';
const supabaseKey = 'sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr';

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados dos 52 agentes
const agentes = [
  // DEPARTAMENTO: ATENDIMENTO (9 agentes)
  {
    nome: 'Atendente Totum',
    departamento: 'Atendimento',
    funcao: 'Monitorar grupos, classificar demandas, criar tarefas',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N', 'Redis'],
    position_x: 100,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Classificador de Demandas',
    departamento: 'Atendimento',
    funcao: 'Classificar por tipo, departamento, urgência',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 300,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Verificador de Churn',
    departamento: 'Atendimento',
    funcao: 'Análise de risco de churn',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 500,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Mataburro Atendimento',
    departamento: 'Atendimento',
    funcao: 'Escalar quando necessário',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 700,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Auditor de SLA',
    departamento: 'Atendimento',
    funcao: 'Monitorar tempos de resposta',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 100,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Agendador de Compromissos',
    departamento: 'Atendimento',
    funcao: 'Marcar reuniões, follow-ups',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 300,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Gestor de Tarefas por Data',
    departamento: 'Atendimento',
    funcao: 'Organizar deadlines',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 500,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Transcritor de Áudio',
    departamento: 'Atendimento',
    funcao: 'Converter áudio em texto',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama'],
    position_x: 700,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Gerador de Relatórios Atendimento',
    departamento: 'Atendimento',
    funcao: 'Relatórios de atendimento',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 100,
    position_y: 400,
    is_new: true
  },

  // DEPARTAMENTO: TRÁFEGO (10 agentes)
  {
    nome: 'Gestor de Tráfego',
    departamento: 'Tráfego',
    funcao: 'Orquestrador de tráfego',
    tipo: 'conversacional',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N', 'Redis', 'Ollama'],
    position_x: 100,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Auditor Diário de Performance',
    departamento: 'Tráfego',
    funcao: 'Check diário das contas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Beszel'],
    position_x: 300,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Detector de Anomalias',
    departamento: 'Tráfego',
    funcao: 'Alertar quando algo sai do normal',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Beszel'],
    position_x: 500,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Protetor de Contas',
    departamento: 'Tráfego',
    funcao: 'Prevenir bloqueios, pausas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Vaultwarden'],
    position_x: 700,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Gerador de Insight Semanal',
    departamento: 'Tráfego',
    funcao: 'Análises automáticas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 100,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Escala Inteligente',
    departamento: 'Tráfego',
    funcao: 'Otimizar investimentos por horário',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 300,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Analisador de Criativos',
    departamento: 'Tráfego',
    funcao: 'Performance por criativo',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 500,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Diagnóstico de Conversão',
    departamento: 'Tráfego',
    funcao: 'Funil de conversão',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 700,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Relatório Executivo para Cliente',
    departamento: 'Tráfego',
    funcao: 'Relatórios automatizados',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 100,
    position_y: 850,
    is_new: true
  },
  {
    nome: 'Mataburro SLA Tráfego',
    departamento: 'Tráfego',
    funcao: 'Escalar problemas',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 300,
    position_y: 850,
    is_new: true
  },

  // DEPARTAMENTO: RADAR ESTRATÉGICO (19 agentes)
  {
    nome: 'Radar Estratégico (por cliente)',
    departamento: 'Radar Estratégico',
    funcao: 'Análise estratégica individual',
    tipo: 'conversacional',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N', 'Ollama'],
    position_x: 900,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Entrada de Referências',
    departamento: 'Radar Estratégico',
    funcao: 'Capturar referências visuais',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Immich', 'N8N'],
    position_x: 1100,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Entrada de Metadados',
    departamento: 'Radar Estratégico',
    funcao: 'Dados do cliente, histórico',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 1300,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Rastreador de Conteúdo Pendente',
    departamento: 'Radar Estratégico',
    funcao: 'Monitorar planejamento anterior',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 900,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Analisador de Melhores Dias',
    departamento: 'Radar Estratégico',
    funcao: 'Relatório de performance por dia',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 1100,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Otimizador de Relatório Cliente',
    departamento: 'Radar Estratégico',
    funcao: 'Comentários, insights',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 1300,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Sugestor de Stories',
    departamento: 'Radar Estratégico',
    funcao: 'Ideias com dias e temas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 900,
    position_y: 400,
    is_new: true
  },
  {
    nome: 'Apoio Tráfego Pago',
    departamento: 'Radar Estratégico',
    funcao: 'Integração CRM + Ads',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1100,
    position_y: 400,
    is_new: true
  },
  {
    nome: 'Informador de Eventos Sazonais',
    departamento: 'Radar Estratégico',
    funcao: 'Calendário de datas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1300,
    position_y: 400,
    is_new: true
  },
  {
    nome: 'Pesquisador de Trends TikTok',
    departamento: 'Radar Estratégico',
    funcao: 'Trends automáticas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 900,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Pesquisador de Trends Instagram',
    departamento: 'Radar Estratégico',
    funcao: 'Trends automáticas',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1100,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Pesquisador Google Newsletter',
    departamento: 'Radar Estratégico',
    funcao: 'Conteúdo para newsletter',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 1300,
    position_y: 550,
    is_new: true
  },
  {
    nome: 'Sugestor de Hooks',
    departamento: 'Radar Estratégico',
    funcao: 'Frases de impacto',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama'],
    position_x: 900,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Criador de Matriz de Reaproveitamento',
    departamento: 'Radar Estratégico',
    funcao: 'Reusar conteúdo',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 1100,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Gerador de Estrutura de Carrossel',
    departamento: 'Radar Estratégico',
    funcao: 'Templates carrossel',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 1300,
    position_y: 700,
    is_new: true
  },
  {
    nome: 'Criador de Ideias de Reels',
    departamento: 'Radar Estratégico',
    funcao: 'Ângulos estratégicos',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama'],
    position_x: 900,
    position_y: 850,
    is_new: true
  },
  {
    nome: 'Indicador de Conteúdo para Ads',
    departamento: 'Radar Estratégico',
    funcao: 'Qual virar tráfego pago',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Ollama'],
    position_x: 1100,
    position_y: 850,
    is_new: true
  },
  {
    nome: 'Agente Geral de Captação',
    departamento: 'Radar Estratégico',
    funcao: 'Dicas prontas de referências',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 1300,
    position_y: 850,
    is_new: true
  },

  // DEPARTAMENTO: INFRA/RECURSOS (6 agentes)
  {
    nome: 'Recurso Central (Embedded)',
    departamento: 'Infra',
    funcao: 'Acesso níveis hierárquicos',
    tipo: 'infra',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'Vaultwarden', 'N8N'],
    position_x: 1500,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Integrador Notebook LM',
    departamento: 'Infra',
    funcao: 'Conexão com Notebook LM',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1700,
    position_y: 100,
    is_new: true
  },
  {
    nome: 'Integrador Google Drive',
    departamento: 'Infra',
    funcao: 'Sync com Drive',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Duplicati'],
    position_x: 1500,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Backup Sincronizador',
    departamento: 'Infra',
    funcao: 'Backup automático',
    tipo: 'processamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Duplicati', 'N8N'],
    position_x: 1700,
    position_y: 250,
    is_new: true
  },
  {
    nome: 'Integrador Alexa',
    departamento: 'Infra',
    funcao: 'Comandos de voz',
    tipo: 'hibrido',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1500,
    position_y: 400,
    is_new: true
  },
  {
    nome: 'MEX - Motor de Execução',
    departamento: 'Infra',
    funcao: 'Sistema de segundo plano',
    tipo: 'infra',
    status: 'pendente',
    prioridade: 'critica',
    responsavel: 'Data',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N', 'Redis', 'Ollama'],
    position_x: 1700,
    position_y: 400,
    is_new: true
  },

  // AGENTES EXISTENTES (7 agentes - marcados como ativos, não novos)
  {
    nome: 'TOT',
    departamento: 'Orquestração',
    funcao: 'Orquestrador geral do sistema',
    tipo: 'orquestrador',
    status: 'ativo',
    prioridade: 'critica',
    responsavel: 'Sistema',
    deadline: null,
    apps_integrados: ['Docmost', 'N8N', 'Redis', 'Ollama'],
    position_x: 800,
    position_y: 500,
    is_new: false,
    uso_7dias: 100,
    creditos_gastos: 0,
    tarefas_concluidas: 150
  },
  {
    nome: 'Data',
    departamento: 'Desenvolvimento',
    funcao: 'Programador e analista',
    tipo: 'conversacional',
    status: 'ativo',
    prioridade: 'critica',
    responsavel: 'Sistema',
    deadline: null,
    apps_integrados: ['Docmost', 'N8N', 'Redis', 'Ollama'],
    position_x: 600,
    position_y: 600,
    is_new: false,
    uso_7dias: 85,
    creditos_gastos: 45.50,
    tarefas_concluidas: 89
  },
  {
    nome: 'Hug',
    departamento: 'Radar',
    funcao: 'Radar de ferramentas',
    tipo: 'conversacional',
    status: 'ativo',
    prioridade: 'alta',
    responsavel: 'Sistema',
    deadline: null,
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 1000,
    position_y: 600,
    is_new: false,
    uso_7dias: 60,
    creditos_gastos: 12.00,
    tarefas_concluidas: 45
  },
  {
    nome: 'Fignaldo',
    departamento: 'Design',
    funcao: 'Design System → Figma',
    tipo: 'conversacional',
    status: 'desenvolvimento',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 700,
    position_y: 750,
    is_new: false,
    uso_7dias: 30,
    creditos_gastos: 8.00,
    tarefas_concluidas: 12
  },
  {
    nome: 'Reportei',
    departamento: 'Tráfego',
    funcao: 'Relatórios Meta',
    tipo: 'hibrido',
    status: 'desenvolvimento',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Docmost', 'N8N'],
    position_x: 900,
    position_y: 750,
    is_new: false,
    uso_7dias: 20,
    creditos_gastos: 5.00,
    tarefas_concluidas: 8
  },
  {
    nome: 'KVirtuoso',
    departamento: 'Conteúdo',
    funcao: 'Gerador de Posts',
    tipo: 'processamento',
    status: 'desenvolvimento',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['Ollama', 'N8N'],
    position_x: 1100,
    position_y: 750,
    is_new: false,
    uso_7dias: 15,
    creditos_gastos: 3.50,
    tarefas_concluidas: 5
  },
  {
    nome: 'Radar de Anúncios',
    departamento: 'Tráfego',
    funcao: 'Spy Competitivo',
    tipo: 'processamento',
    status: 'desenvolvimento',
    prioridade: 'critica',
    responsavel: 'Pablo',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    apps_integrados: ['N8N'],
    position_x: 1300,
    position_y: 750,
    is_new: false,
    uso_7dias: 10,
    creditos_gastos: 2.00,
    tarefas_concluidas: 3
  }
];

// Função para inserir agentes
async function inserirAgentes() {
  console.log('🚀 Iniciando inserção de', agentes.length, 'agentes...\n');
  
  let inseridos = 0;
  let erros = 0;
  
  for (const agente of agentes) {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .insert([agente])
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir ${agente.nome}:`, error.message);
        erros++;
      } else {
        console.log(`✅ ${agente.nome} - ${agente.departamento} (${agente.prioridade})`);
        inseridos++;
      }
    } catch (err) {
      console.error(`❌ Erro inesperado ${agente.nome}:`, err.message);
      erros++;
    }
  }
  
  console.log('\n📊 RESUMO:');
  console.log(`✅ Inseridos: ${inseridos}`);
  console.log(`❌ Erros: ${erros}`);
  console.log(`📈 Total: ${agentes.length}`);
}

// Executar
inserirAgentes();