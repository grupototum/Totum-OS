import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface LogExecucao {
  id: string;
  tarefa_id: string;
  agente_id: string;
  status: string;
  resultado?: string;
  erro?: string;
  duracao_ms?: number;
  iniciado_em: string;
  finalizado_em?: string;
  created_at: string;
}

export interface AgentTask {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  agente_id?: string;
  recorrencia?: string;
  horario_execucao?: string;
  proxima_execucao?: string;
  ultima_execucao?: string;
  ultimo_resultado?: string;
}

function mapRowToAgentTask(row: any): AgentTask {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao || undefined,
    status: row.status,
    agente_id: row.responsavel || undefined,
    proxima_execucao: row.proxima_execucao || undefined,
    ultima_execucao: row.ultima_execucao || undefined,
    ultimo_resultado: row.ultimo_resultado || undefined,
  };
}

export function useAgentTasks(agenteId?: string) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [logs, setLogs] = useState<LogExecucao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      let query = (supabase as any).from('tarefas').select('*');
      if (agenteId) {
        query = query.eq('responsavel', agenteId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setTasks((data || []).map(mapRowToAgentTask));
    } catch (err: any) {
      console.warn('Erro ao buscar tarefas do agente:', err?.message);
      setTasks([]);
    }
  }, [agenteId]);

  const fetchLogs = useCallback(async (tarefaId?: string) => {
    try {
      let query = (supabase as any).from('logs_execucao_agente').select('*');
      if (tarefaId) {
        query = query.eq('tarefa_id', tarefaId);
      }
      if (agenteId) {
        query = query.eq('agente_id', agenteId);
      }
      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      console.warn('Erro ao buscar logs:', err?.message);
      setLogs([]);
    }
  }, [agenteId]);

  const executarTarefa = useCallback(async (tarefaId: string, agenteNome: string) => {
    try {
      const log = {
        tarefa_id: tarefaId,
        agente_id: agenteNome,
        status: 'executando',
        iniciado_em: new Date().toISOString(),
      };

      const { error } = await (supabase as any)
        .from('logs_execucao_agente')
        .insert([log]);

      if (error) throw error;

      await (supabase as any)
        .from('tarefas')
        .update({ 
          ultima_execucao: new Date().toISOString(),
          ultimo_resultado: 'executando',
          updated_at: new Date().toISOString()
        })
        .eq('id', tarefaId);

      toast({ title: '🚀 Tarefa em execução', description: `Agente ${agenteNome} iniciou a tarefa` });
      await fetchTasks();
      await fetchLogs(tarefaId);
    } catch (err: any) {
      console.error('Erro ao executar tarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
    }
  }, [fetchTasks, fetchLogs]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchLogs()]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('agent-tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logs_execucao_agente' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchTasks, fetchLogs]);

  return { tasks, logs, loading, fetchTasks, fetchLogs, executarTarefa };
}
