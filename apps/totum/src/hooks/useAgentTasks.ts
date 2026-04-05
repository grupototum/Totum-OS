import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tarefa, RESPONSAVEIS } from './useTasks';

// ============================================
// TYPES - Sistema de Agendamento de Agentes
// ============================================

export type AgenteType = 'Pablo' | 'Data' | 'Hug' | 'TOT';

export interface AgenteConfig {
  id: AgenteType;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  capabilities: string[];
  status: 'online' | 'offline' | 'ocupado';
  ultimaExecucao?: string;
}

export interface TarefaAgente extends Tarefa {
  tipo: 'agente';
  agente_id: AgenteType;
  recorrencia: 'unica' | 'diaria' | 'semanal' | 'mensal';
  horario_execucao: string; // "HH:MM"
  params: {
    comando: string;
    args?: Record<string, any>;
    timeout?: number; // minutos
    retry?: number;
  };
  proxima_execucao?: string;
  ultima_execucao?: string;
  ultimo_resultado?: {
    sucesso: boolean;
    mensagem: string;
    timestamp: string;
    output?: any;
  };
}

export interface LogExecucao {
  id: string;
  tarefa_id: string;
  agente_id: AgenteType;
  status: 'sucesso' | 'erro' | 'executando';
  mensagem: string;
  output?: any;
  iniciado_em: string;
  finalizado_em?: string;
  duracao_segundos?: number;
}

// Configuração dos agentes
export const AGENTES: AgenteConfig[] = [
  {
    id: 'Pablo',
    nome: 'Pablo',
    descricao: 'Agente de Operações - Executa tarefas administrativas e operacionais',
    cor: '#F97316',
    icone: '⚙️',
    capabilities: ['backup', 'relatorio', 'sync', 'limpeza'],
    status: 'online',
  },
  {
    id: 'Data',
    nome: 'Data',
    descricao: 'Agente Tech - Análise de dados, scripts e automações técnicas',
    cor: '#8B5CF6',
    icone: '💻',
    capabilities: ['scraping', 'analise', 'script', 'deploy', 'teste'],
    status: 'online',
  },
  {
    id: 'Hug',
    nome: 'Hug',
    descricao: 'Agente Radar - Monitoramento, pesquisa e inteligência',
    cor: '#10B981',
    icone: '🔍',
    capabilities: ['monitoramento', 'pesquisa', 'alerta', 'trend', 'huggingface'],
    status: 'online',
  },
  {
    id: 'TOT',
    nome: 'TOT',
    descricao: 'Orquestrador - Coordenação e supervisão de outros agentes',
    cor: '#6B7280',
    icone: '🎛️',
    capabilities: ['orquestrar', 'validar', 'delegar', 'relatorio_geral'],
    status: 'online',
  },
];

// ============================================
// HOOK - useAgentTasks
// ============================================

export function useAgentTasks() {
  const [tarefas, setTarefas] = useState<TarefaAgente[]>([]);
  const [logs, setLogs] = useState<LogExecucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [executando, setExecutando] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Buscar tarefas de agentes
  const fetchTarefas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('tipo', 'agente')
        .order('horario_execucao', { ascending: true });

      if (error) throw error;

      const parsedData: TarefaAgente[] = (data || []).map((t: any) => ({
        ...t,
        tags: Array.isArray(t.tags) ? t.tags : JSON.parse(t.tags || '[]'),
        subtarefas: Array.isArray(t.subtarefas) ? t.subtarefas : JSON.parse(t.subtarefas || '[]'),
        dependencias: Array.isArray(t.dependencias) ? t.dependencias : JSON.parse(t.dependencias || '[]'),
        params: typeof t.params === 'object' ? t.params : JSON.parse(t.params || '{}'),
        tipo: 'agente',
      }));

      setTarefas(parsedData);
    } catch (err: any) {
      console.error('Erro ao buscar tarefas de agentes:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
    }
  }, []);

  // Buscar logs de execução
  const fetchLogs = useCallback(async (tarefaId?: string) => {
    try {
      let query = supabase
        .from('logs_execucao_agente')
        .select('*')
        .order('iniciado_em', { ascending: false })
        .limit(50);

      if (tarefaId) {
        query = query.eq('tarefa_id', tarefaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar logs:', err);
    }
  }, []);

  // Criar tarefa para agente
  const criarTarefaAgente = async (tarefa: Partial<TarefaAgente>): Promise<TarefaAgente | null> => {
    try {
      // Calcular próxima execução
      const proximaExecucao = calcularProximaExecucao(
        tarefa.recorrencia || 'unica',
        tarefa.horario_execucao || '08:00',
        tarefa.data_inicio
      );

      const novaTarefa = {
        ...tarefa,
        tipo: 'agente',
        status: 'a_fazer',
        proxima_execucao: proximaExecucao,
        progresso: 0,
        tags: tarefa.tags || [],
        subtarefas: tarefa.subtarefas || [],
        dependencias: tarefa.dependencias || [],
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tarefas')
        .insert([novaTarefa])
        .select()
        .single();

      if (error) throw error;

      await fetchTarefas();
      toast({ title: '🤖 Tarefa de agente criada', description: `${tarefa.agente_id}: ${tarefa.titulo}` });
      return data as TarefaAgente;
    } catch (err: any) {
      console.error('Erro ao criar tarefa de agente:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Atualizar tarefa de agente
  const atualizarTarefaAgente = async (id: string, updates: Partial<TarefaAgente>): Promise<boolean> => {
    try {
      // Se mudou recorrência ou horário, recalcular próxima execução
      if (updates.recorrencia || updates.horario_execucao) {
        const tarefa = tarefas.find(t => t.id === id);
        if (tarefa) {
          updates.proxima_execucao = calcularProximaExecucao(
            updates.recorrencia || tarefa.recorrencia,
            updates.horario_execucao || tarefa.horario_execucao,
            updates.data_inicio || tarefa.data_inicio
          );
        }
      }

      const { error } = await supabase
        .from('tarefas')
        .update({
          ...updates,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar tarefa de agente:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Executar tarefa manualmente
  const executarTarefa = async (tarefaId: string): Promise<boolean> => {
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (!tarefa) return false;

    setExecutando(prev => new Set(prev).add(tarefaId));

    try {
      // Criar log de início
      const { data: logData, error: logError } = await supabase
        .from('logs_execucao_agente')
        .insert([{
          tarefa_id: tarefaId,
          agente_id: tarefa.agente_id,
          status: 'executando',
          mensagem: 'Iniciando execução...',
          iniciado_em: new Date().toISOString(),
        }])
        .select()
        .single();

      if (logError) throw logError;

      // Simular execução do agente (aqui integraríamos com o agente real)
      const resultado = await simularExecucaoAgente(tarefa);

      // Atualizar log com resultado
      await supabase
        .from('logs_execucao_agente')
        .update({
          status: resultado.sucesso ? 'sucesso' : 'erro',
          mensagem: resultado.mensagem,
          output: resultado.output,
          finalizado_em: new Date().toISOString(),
          duracao_segundos: Math.floor((Date.now() - new Date(logData.iniciado_em).getTime()) / 1000),
        })
        .eq('id', logData.id);

      // Atualizar tarefa
      await supabase
        .from('tarefas')
        .update({
          ultima_execucao: new Date().toISOString(),
          ultimo_resultado: resultado,
          proxima_execucao: calcularProximaExecucao(tarefa.recorrencia, tarefa.horario_execucao),
          status: resultado.sucesso ? 'feito' : 'a_fazer',
          progresso: resultado.sucesso ? 100 : tarefa.progresso,
        })
        .eq('id', tarefaId);

      await fetchTarefas();
      await fetchLogs();

      toast({
        title: resultado.sucesso ? '✅ Agente executou com sucesso' : '⚠️ Agente retornou erro',
        description: resultado.mensagem,
        variant: resultado.sucesso ? 'default' : 'destructive',
      });

      return resultado.sucesso;
    } catch (err: any) {
      console.error('Erro ao executar tarefa:', err);
      toast({ title: '❌ Erro na execução', description: err.message, variant: 'destructive' });
      return false;
    } finally {
      setExecutando(prev => {
        const newSet = new Set(prev);
        newSet.delete(tarefaId);
        return newSet;
      });
    }
  };

  // Verificar e executar tarefas agendadas
  const verificarTarefasAgendadas = useCallback(async () => {
    const agora = new Date();
    const horaAtual = formatHora(agora);

    const tarefasParaExecutar = tarefas.filter(t => {
      if (t.status === 'executando') return false;
      if (!t.proxima_execucao) return false;
      
      const proximaExec = new Date(t.proxima_execucao);
      return proximaExec <= agora;
    });

    for (const tarefa of tarefasParaExecutar) {
      console.log(`🤖 Executando tarefa agendada: ${tarefa.titulo}`);
      await executarTarefa(tarefa.id);
    }
  }, [tarefas]);

  // Iniciar scheduler
  useEffect(() => {
    fetchTarefas();
    fetchLogs();

    // Verificar a cada minuto
    intervalRef.current = setInterval(() => {
      verificarTarefasAgendadas();
    }, 60000);

    // Realtime subscription
    const channel = supabase
      .channel('tarefas-agentes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas' }, () => {
        fetchTarefas();
      })
      .subscribe();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchTarefas, verificarTarefasAgendadas]);

  // Helpers
  const getTarefasPorAgente = (agenteId: AgenteType): TarefaAgente[] => {
    return tarefas.filter(t => t.agente_id === agenteId);
  };

  const getLogsPorTarefa = (tarefaId: string): LogExecucao[] => {
    return logs.filter(l => l.tarefa_id === tarefaId);
  };

  const getEstatisticas = () => {
    const total = tarefas.length;
    const executadasHoje = logs.filter(l => {
      const hoje = new Date().toDateString();
      const dataLog = new Date(l.iniciado_em).toDateString();
      return hoje === dataLog && l.status === 'sucesso';
    }).length;

    const porAgente = AGENTES.map(agente => ({
      ...agente,
      totalTarefas: tarefas.filter(t => t.agente_id === agente.id).length,
      execucoesHoje: logs.filter(l => {
        const hoje = new Date().toDateString();
        return l.agente_id === agente.id && new Date(l.iniciado_em).toDateString() === hoje;
      }).length,
    }));

    return { total, executadasHoje, porAgente };
  };

  return {
    tarefas,
    logs,
    loading,
    executando,
    agentes: AGENTES,
    
    // CRUD
    criarTarefaAgente,
    atualizarTarefaAgente,
    executarTarefa,
    
    // Fetchers
    fetchTarefas,
    fetchLogs,
    
    // Helpers
    getTarefasPorAgente,
    getLogsPorTarefa,
    getEstatisticas,
    verificarTarefasAgendadas,
  };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function calcularProximaExecucao(
  recorrencia: 'unica' | 'diaria' | 'semanal' | 'mensal',
  horario: string,
  dataInicio?: string
): string {
  const [hora, minuto] = horario.split(':').map(Number);
  const agora = new Date();
  let proxima = new Date();

  if (dataInicio) {
    proxima = new Date(dataInicio);
  }

  proxima.setHours(hora, minuto, 0, 0);

  // Se já passou o horário hoje, ir para próxima ocorrência
  if (proxima <= agora) {
    switch (recorrencia) {
      case 'diaria':
        proxima.setDate(proxima.getDate() + 1);
        break;
      case 'semanal':
        proxima.setDate(proxima.getDate() + 7);
        break;
      case 'mensal':
        proxima.setMonth(proxima.getMonth() + 1);
        break;
      case 'unica':
        // Se já passou e é única, não agendar
        return '';
    }
  }

  return proxima.toISOString();
}

function formatHora(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

// Simulação de execução do agente (substituir por integração real)
async function simularExecucaoAgente(tarefa: TarefaAgente): Promise<{
  sucesso: boolean;
  mensagem: string;
  output?: any;
}> {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  const comandos: Record<string, () => { sucesso: boolean; mensagem: string; output?: any }> = {
    'backup': () => ({
      sucesso: true,
      mensagem: 'Backup realizado com sucesso. 50MB salvos.',
      output: { tamanho: '50MB', arquivos: 120 },
    }),
    'relatorio': () => ({
      sucesso: true,
      mensagem: 'Relatório gerado e enviado por email.',
      output: { destinatarios: ['israel@totum.com'], anexos: 1 },
    }),
    'scraping': () => ({
      sucesso: true,
      mensagem: 'Scraping concluído. 15 novos itens encontrados.',
      output: { itens: 15, fonte: 'huggingface.co' },
    }),
    'monitoramento': () => ({
      sucesso: true,
      mensagem: 'Monitoramento executado. Nenhum alerta.',
      output: { checks: 5, alertas: 0 },
    }),
    'default': () => ({
      sucesso: true,
      mensagem: `Tarefa ${tarefa.params.comando} executada com sucesso.`,
      output: { comando: tarefa.params.comando },
    }),
  };

  const executor = comandos[tarefa.params.comando] || comandos['default'];
  return executor();
}
