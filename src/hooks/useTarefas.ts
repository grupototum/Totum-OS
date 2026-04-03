import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'critica';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: StatusTarefa;
  responsavel: string | null;
  prioridade: PrioridadeTarefa;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface CriarTarefaDTO {
  titulo: string;
  descricao?: string;
  status?: StatusTarefa;
  responsavel?: string;
  prioridade?: PrioridadeTarefa;
  deadline?: string;
}

export interface AtualizarTarefaDTO {
  titulo?: string;
  descricao?: string;
  status?: StatusTarefa;
  responsavel?: string;
  prioridade?: PrioridadeTarefa;
  deadline?: string;
}

export interface FiltrosTarefa {
  status?: StatusTarefa;
  responsavel?: string;
  prioridade?: PrioridadeTarefa;
}

const STORAGE_KEY = 'totum:tarefas:filtros';

// Carregar filtros salvos do localStorage
const carregarFiltrosSalvos = (): FiltrosTarefa => {
  try {
    const salvos = localStorage.getItem(STORAGE_KEY);
    if (salvos) {
      return JSON.parse(salvos);
    }
  } catch (err) {
    console.error('Erro ao carregar filtros salvos:', err);
  }
  return {};
};

export function useTarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosTarefa>(carregarFiltrosSalvos);

  // Listar tarefas
  const listarTarefas = useCallback(async (filtrosQuery?: FiltrosTarefa) => {
    try {
      setLoading(true);
      setError(null);

      let query = (supabase as any)
        .from('tarefas')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      const filtrosAplicar = filtrosQuery || filtros;
      if (filtrosAplicar.status) {
        query = query.eq('status', filtrosAplicar.status);
      }
      if (filtrosAplicar.responsavel) {
        query = query.eq('responsavel', filtrosAplicar.responsavel);
      }
      if (filtrosAplicar.prioridade) {
        query = query.eq('prioridade', filtrosAplicar.prioridade);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setTarefas(data || []);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar tarefas';
      setError(mensagem);
      console.error('Erro ao listar tarefas:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Criar tarefa
  const criarTarefa = useCallback(async (dto: CriarTarefaDTO): Promise<boolean> => {
    try {
      if (!dto.titulo.trim()) {
        toast({
          title: 'Erro',
          description: 'Título é obrigatório',
          variant: 'destructive',
        });
        return false;
      }

      const { data, error: supabaseError } = await (supabase as any)
        .from('tarefas')
        .insert([{
          titulo: dto.titulo.trim(),
          descricao: dto.descricao?.trim() || null,
          status: dto.status || 'pendente',
          responsavel: dto.responsavel?.trim() || null,
          prioridade: dto.prioridade || 'media',
          deadline: dto.deadline || null,
        }])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setTarefas(prev => [data as Tarefa, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Tarefa criada com sucesso',
      });
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao criar tarefa';
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  // Atualizar tarefa
  const atualizarTarefa = useCallback(async (id: string, dto: AtualizarTarefaDTO): Promise<boolean> => {
    try {
      const atualizacao: Record<string, unknown> = {};
      
      if (dto.titulo !== undefined) atualizacao.titulo = dto.titulo.trim();
      if (dto.descricao !== undefined) atualizacao.descricao = dto.descricao?.trim() || null;
      if (dto.status !== undefined) atualizacao.status = dto.status;
      if (dto.responsavel !== undefined) atualizacao.responsavel = dto.responsavel?.trim() || null;
      if (dto.prioridade !== undefined) atualizacao.prioridade = dto.prioridade;
      if (dto.deadline !== undefined) atualizacao.deadline = dto.deadline || null;

      const { data, error: supabaseError } = await (supabase as any)
        .from('tarefas')
        .update(atualizacao)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      setTarefas(prev => prev.map(t => t.id === id ? data as Tarefa : t));
      toast({
        title: 'Sucesso',
        description: 'Tarefa atualizada com sucesso',
      });
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao atualizar tarefa';
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  // Deletar tarefa
  const deletarTarefa = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      setTarefas(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Tarefa deletada com sucesso',
      });
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao deletar tarefa';
      toast({
        title: 'Erro',
        description: mensagem,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  // Obter estatísticas
  const obterEstatisticas = useCallback(() => {
    return {
      total: tarefas.length,
      pendentes: tarefas.filter(t => t.status === 'pendente').length,
      emAndamento: tarefas.filter(t => t.status === 'em_andamento').length,
      concluidas: tarefas.filter(t => t.status === 'concluida').length,
      criticas: tarefas.filter(t => t.prioridade === 'critica').length,
      altas: tarefas.filter(t => t.prioridade === 'alta').length,
    };
  }, [tarefas]);

  // Carregar tarefas na montagem
  useEffect(() => {
    listarTarefas();
  }, [listarTarefas]);

  // Persistir filtros no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtros));
    } catch (err) {
      console.error('Erro ao salvar filtros:', err);
    }
  }, [filtros]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('tarefas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tarefas' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTarefas(prev => [payload.new as Tarefa, ...prev]);
            toast({
              title: '🔔 Nova tarefa',
              description: 'Uma nova tarefa foi adicionada',
            });
          } else if (payload.eventType === 'UPDATE') {
            setTarefas(prev => prev.map(t => 
              t.id === payload.new.id ? payload.new as Tarefa : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTarefas(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tarefas,
    loading,
    error,
    filtros,
    setFiltros,
    listarTarefas,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    obterEstatisticas,
  };
}