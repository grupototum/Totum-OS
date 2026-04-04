import { Agente, Tarefa, WorkflowN8N, Comando, MetricaSistema, Evento, Documento, MetricaConhecimento } from '../types';

export const mockAgentes: Agente[] = [
  {
    id: 'agt-miguel',
    nome: 'Miguel',
    apelido: 'Arquiteto CEO',
    emoji: '🎯',
    status: 'ativo',
    tarefasAtribuidas: 12,
    tarefasConcluidas: 89,
    tarefasPendentes: 3,
    efetividade: 96.7,
    creditosConsumidos: 2450,
    ultimaAtividade: '2025-04-05T06:30:00Z',
    ultimasAcoes: ['Revisou proposta comercial', 'Aprovou novo workflow', 'Atualizou KPIs']
  },
  {
    id: 'agt-liz',
    nome: 'Liz',
    apelido: 'Guardiã COO',
    emoji: '🛡️',
    status: 'ativo',
    tarefasAtribuidas: 8,
    tarefasConcluidas: 156,
    tarefasPendentes: 2,
    efetividade: 98.2,
    creditosConsumidos: 1890,
    ultimaAtividade: '2025-04-05T06:45:00Z',
    ultimasAcoes: ['Validou processo de onboarding', 'Revisou SLAs', 'Atualizou protocolos']
  },
  {
    id: 'agt-jarvis',
    nome: 'Jarvis',
    apelido: 'Executor Tech Lead',
    emoji: '⚡',
    status: 'ativo',
    tarefasAtribuidas: 15,
    tarefasConcluidas: 234,
    tarefasPendentes: 5,
    efetividade: 94.5,
    creditosConsumidos: 3200,
    ultimaAtividade: '2025-04-05T06:50:00Z',
    ultimasAcoes: ['Deploy em produção', 'Corrigiu bug crítico', 'Otimizou queries']
  },
  {
    id: 'agt-data',
    nome: 'Data',
    apelido: 'Especialista em Dashboards',
    emoji: '🖖',
    status: 'ativo',
    tarefasAtribuidas: 6,
    tarefasConcluidas: 67,
    tarefasPendentes: 1,
    efetividade: 99.1,
    creditosConsumidos: 1450,
    ultimaAtividade: '2025-04-05T07:00:00Z',
    ultimasAcoes: ['Criou dashboard de métricas', 'Implementou gráficos', 'Configurado Recharts']
  },
  {
    id: 'agt-giles',
    nome: 'Giles',
    apelido: 'Arquiteto de Informação',
    emoji: '🧙‍♂️',
    status: 'ativo',
    tarefasAtribuidas: 4,
    tarefasConcluidas: 98,
    tarefasPendentes: 0,
    efetividade: 97.8,
    creditosConsumidos: 890,
    ultimaAtividade: '2025-04-05T06:15:00Z',
    ultimasAcoes: ['Indexou novos documentos', 'Catalogou skills', 'Atualizou Alexandria']
  },
  {
    id: 'agt-tot',
    nome: 'TOT',
    apelido: 'Orquestrador',
    emoji: '🎛️',
    status: 'ativo',
    tarefasAtribuidas: 3,
    tarefasConcluidas: 312,
    tarefasPendentes: 1,
    efetividade: 99.5,
    creditosConsumidos: 2100,
    ultimaAtividade: '2025-04-05T07:05:00Z',
    ultimasAcoes: ['Monitorou sistema', 'Coordenou agentes', 'Gerou relatório']
  }
];

export const mockTarefas: Tarefa[] = [
  {
    id: 'tsk-001',
    titulo: 'Revisar proposta comercial',
    descricao: 'Análise detalhada da proposta para cliente novo',
    status: 'em_execucao',
    agenteId: 'agt-miguel',
    agenteNome: 'Miguel',
    prioridade: 'alta',
    criadaEm: '2025-04-05T05:00:00Z',
    atualizadaEm: '2025-04-05T06:30:00Z',
    tempoExecucao: 90
  },
  {
    id: 'tsk-002',
    titulo: 'Validar processo de onboarding',
    descricao: 'Revisão do fluxo de integração de novos clientes',
    status: 'concluida',
    agenteId: 'agt-liz',
    agenteNome: 'Liz',
    prioridade: 'media',
    criadaEm: '2025-04-05T04:00:00Z',
    atualizadaEm: '2025-04-05T06:45:00Z',
    tempoExecucao: 165
  },
  {
    id: 'tsk-003',
    titulo: 'Deploy em produção',
    descricao: 'Subir nova versão do dashboard',
    status: 'concluida',
    agenteId: 'agt-jarvis',
    agenteNome: 'Jarvis',
    prioridade: 'alta',
    criadaEm: '2025-04-05T05:30:00Z',
    atualizadaEm: '2025-04-05T06:50:00Z',
    tempoExecucao: 80
  },
  {
    id: 'tsk-004',
    titulo: 'Criar dashboard de métricas',
    descricao: 'Desenvolver painéis para visualização de dados dos agentes',
    status: 'em_execucao',
    agenteId: 'agt-data',
    agenteNome: 'Data',
    prioridade: 'alta',
    criadaEm: '2025-04-05T05:00:00Z',
    atualizadaEm: '2025-04-05T07:00:00Z',
    tempoExecucao: 120
  },
  {
    id: 'tsk-005',
    titulo: 'Indexar documentação nova',
    descricao: 'Catalogar novos POPs e Skills na Alexandria',
    status: 'fila',
    agenteId: 'agt-giles',
    agenteNome: 'Giles',
    prioridade: 'baixa',
    criadaEm: '2025-04-05T06:00:00Z',
    atualizadaEm: '2025-04-05T06:00:00Z'
  },
  {
    id: 'tsk-006',
    titulo: 'Corrigir bug no parser de contexto',
    descricao: 'Erro ao processar arquivos JSON grandes',
    status: 'fila',
    agenteId: 'agt-jarvis',
    agenteNome: 'Jarvis',
    prioridade: 'alta',
    criadaEm: '2025-04-05T06:30:00Z',
    atualizadaEm: '2025-04-05T06:30:00Z'
  },
  {
    id: 'tsk-007',
    titulo: 'Monitoramento de saúde do sistema',
    descricao: 'Verificar métricas de todos os serviços',
    status: 'em_execucao',
    agenteId: 'agt-tot',
    agenteNome: 'TOT',
    prioridade: 'alta',
    criadaEm: '2025-04-05T06:00:00Z',
    atualizadaEm: '2025-04-05T07:05:00Z',
    tempoExecucao: 65
  }
];

export const mockWorkflows: WorkflowN8N[] = [
  {
    id: 'wf-001',
    nome: 'Agente → Agente: Comando',
    status: 'ativo',
    ultimaExecucao: '2025-04-05T07:00:00Z',
    execucoesTotais: 15432,
    execucoesSucesso: 15389,
    execucoesErro: 43
  },
  {
    id: 'wf-002',
    nome: 'Notificação Slack',
    status: 'ativo',
    ultimaExecucao: '2025-04-05T06:58:00Z',
    execucoesTotais: 8934,
    execucoesSucesso: 8930,
    execucoesErro: 4
  },
  {
    id: 'wf-003',
    nome: 'Indexação Alexandria',
    status: 'ativo',
    ultimaExecucao: '2025-04-05T06:45:00Z',
    execucoesTotais: 3421,
    execucoesSucesso: 3419,
    execucoesErro: 2
  },
  {
    id: 'wf-004',
    nome: 'Backup Diário',
    status: 'ativo',
    ultimaExecucao: '2025-04-05T04:00:00Z',
    execucoesTotais: 890,
    execucoesSucesso: 889,
    execucoesErro: 1
  },
  {
    id: 'wf-005',
    nome: 'Integração Supabase',
    status: 'ativo',
    ultimaExecucao: '2025-04-05T07:02:00Z',
    execucoesTotais: 12456,
    execucoesSucesso: 12450,
    execucoesErro: 6
  },
  {
    id: 'wf-006',
    nome: 'Relatório Automático',
    status: 'erro',
    ultimaExecucao: '2025-04-05T05:00:00Z',
    execucoesTotais: 365,
    execucoesSucesso: 350,
    execucoesErro: 15
  }
];

export const mockComandos: Comando[] = [
  {
    id: 'cmd-001',
    origem: 'Miguel',
    destino: 'Jarvis',
    comando: 'deploy:production',
    status: 'concluido',
    timestamp: '2025-04-05T06:50:00Z'
  },
  {
    id: 'cmd-002',
    origem: 'Liz',
    destino: 'Giles',
    comando: 'index:documentos',
    status: 'concluido',
    timestamp: '2025-04-05T06:45:00Z'
  },
  {
    id: 'cmd-003',
    origem: 'TOT',
    destino: 'Data',
    comando: 'create:dashboard',
    status: 'processando',
    timestamp: '2025-04-05T07:00:00Z'
  },
  {
    id: 'cmd-004',
    origem: 'Jarvis',
    destino: 'TOT',
    comando: 'report:status',
    status: 'concluido',
    timestamp: '2025-04-05T06:55:00Z'
  },
  {
    id: 'cmd-005',
    origem: 'Giles',
    destino: 'Liz',
    comando: 'sync:protocols',
    status: 'enviado',
    timestamp: '2025-04-05T07:05:00Z'
  },
  {
    id: 'cmd-006',
    origem: 'Data',
    destino: 'Giles',
    comando: 'query:schema',
    status: 'concluido',
    timestamp: '2025-04-05T06:40:00Z'
  }
];

export const mockMetricasSistema: MetricaSistema[] = [
  {
    nome: 'Giles (Alexandria)',
    status: 'online',
    latencia: 45,
    uptime: 99.98,
    ultimoCheck: '2025-04-05T07:05:00Z'
  },
  {
    nome: 'Supabase',
    status: 'online',
    latencia: 89,
    uptime: 99.95,
    ultimoCheck: '2025-04-05T07:05:00Z'
  },
  {
    nome: 'N8N',
    status: 'online',
    latencia: 120,
    uptime: 99.87,
    ultimoCheck: '2025-04-05T07:05:00Z'
  },
  {
    nome: 'API Gateway',
    status: 'online',
    latencia: 34,
    uptime: 99.99,
    ultimoCheck: '2025-04-05T07:05:00Z'
  },
  {
    nome: 'OpenClaw',
    status: 'online',
    latencia: 67,
    uptime: 99.92,
    ultimoCheck: '2025-04-05T07:05:00Z'
  }
];

export const mockEventos: Evento[] = [
  {
    id: 'evt-001',
    tipo: 'sucesso',
    mensagem: 'Deploy realizado com sucesso',
    timestamp: '2025-04-05T06:50:00Z',
    agente: 'Jarvis'
  },
  {
    id: 'evt-002',
    tipo: 'info',
    mensagem: 'Dashboard de métricas em desenvolvimento',
    timestamp: '2025-04-05T06:30:00Z',
    agente: 'Data'
  },
  {
    id: 'evt-003',
    tipo: 'sucesso',
    mensagem: 'Processo de onboarding validado',
    timestamp: '2025-04-05T06:45:00Z',
    agente: 'Liz'
  },
  {
    id: 'evt-004',
    tipo: 'alerta',
    mensagem: 'Workflow Relatório Automático apresentando erros',
    timestamp: '2025-04-05T05:00:00Z',
    agente: 'TOT'
  },
  {
    id: 'evt-005',
    tipo: 'info',
    mensagem: 'Novos documentos indexados na Alexandria',
    timestamp: '2025-04-05T06:15:00Z',
    agente: 'Giles'
  },
  {
    id: 'evt-006',
    tipo: 'sucesso',
    mensagem: 'Sistema de comunicação entre agentes operacional',
    timestamp: '2025-04-05T06:00:00Z',
    agente: 'TOT'
  },
  {
    id: 'evt-007',
    tipo: 'erro',
    mensagem: 'Falha na conexão com serviço externo (timeout)',
    timestamp: '2025-04-05T04:30:00Z',
    agente: 'N8N'
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: 'doc-001',
    titulo: 'POP-DATA-001: Protocolo de Desenvolvimento',
    dominio: 'desenvolvimento',
    tamanho: 2450,
    indexadoEm: '2025-04-04T10:00:00Z',
    consultas: 45
  },
  {
    id: 'doc-002',
    titulo: 'POP-GILE-001: Protocolo de Catalogação',
    dominio: 'conhecimento',
    tamanho: 1890,
    indexadoEm: '2025-04-04T09:30:00Z',
    consultas: 67
  },
  {
    id: 'doc-003',
    titulo: 'SLA-LIZ-001: Tempo de Resposta',
    dominio: 'operacao',
    tamanho: 1200,
    indexadoEm: '2025-04-03T14:00:00Z',
    consultas: 34
  },
  {
    id: 'doc-004',
    titulo: 'SKILL-JARVIS-001: Deploy VPS',
    dominio: 'infraestrutura',
    tamanho: 3200,
    indexadoEm: '2025-04-03T11:00:00Z',
    consultas: 89
  },
  {
    id: 'doc-005',
    titulo: 'Contexto: Clientes Ideais',
    dominio: 'vendas',
    tamanho: 2800,
    indexadoEm: '2025-04-02T16:00:00Z',
    consultas: 23
  },
  {
    id: 'doc-006',
    titulo: 'MEX: Sistema de Contexto',
    dominio: 'arquitetura',
    tamanho: 4500,
    indexadoEm: '2025-04-01T10:00:00Z',
    consultas: 112
  }
];

export const mockMetricasConhecimento: MetricaConhecimento[] = [
  { data: '2025-03-01', documentos: 45, consultas: 120 },
  { data: '2025-03-08', documentos: 52, consultas: 145 },
  { data: '2025-03-15', documentos: 58, consultas: 167 },
  { data: '2025-03-22', documentos: 64, consultas: 189 },
  { data: '2025-03-29', documentos: 71, consultas: 212 },
  { data: '2025-04-05', documentos: 78, consultas: 245 }
];

export const mockDominiosAcessados = [
  { nome: 'desenvolvimento', acessos: 156 },
  { nome: 'infraestrutura', acessos: 134 },
  { nome: 'conhecimento', acessos: 112 },
  { nome: 'arquitetura', acessos: 98 },
  { nome: 'operacao', acessos: 76 },
  { nome: 'vendas', acessos: 54 }
];
