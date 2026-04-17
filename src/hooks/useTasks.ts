import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================
// TIPOS
// ============================================

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'urgente';
export type TipoTarefa = 'unica' | 'projeto';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string | null;
  responsavel?: string | null;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  // DB column is data_limite (timestamptz)
  data_limite?: string | null;
  deadline?: string | null; // kept for backward compat
  proxima_execucao?: string | null;
  ultima_execucao?: string | null;
  ultimo_resultado?: string | null;
  created_at?: string;
  updated_at?: string;
  subtarefas: Subtarefa[];
  tags: string[];
  projeto_id?: string | null;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  responsavel_id?: string;
  status: 'ativo' | 'pausado' | 'concluido' | 'cancelado';
  data_inicio?: string;
  data_fim?: string;
  created_at?: string;
}

export interface Comentario {
  id: string;
  tarefa_id: string;
  conteudo: string;
  autor_id: string;
  autor_nome?: string;
  autor?: string;
  criado_em?: string;
  created_at?: string;
}

export interface Subtarefa {
  id: string;
  tarefa_id: string;
  titulo: string;
  concluida: boolean;
  created_at?: string;
}

// ============================================
// CONSTANTES
// ============================================

export const PRIORIDADES = [
  { id: 'baixa', label: 'Baixa', cor: '#78716C' },
  { id: 'media', label: 'Média', cor: '#F59E0B' },
  { id: 'alta', label: 'Alta', cor: '#F97316' },
  { id: 'urgente', label: 'Urgente', cor: '#EF4444' },
];

export const STATUS_LIST = [
  { id: 'pendente', label: 'Pendente' },
  { id: 'em_andamento', label: 'Em Andamento' },
  { id: 'concluida', label: 'Concluída' },
  { id: 'cancelada', label: 'Cancelada' },
];

export const COLUNAS_KANBAN = [
  { id: 'pendente' as StatusTarefa, titulo: 'Pendente', cor: '#78716C' },
  { id: 'em_andamento' as StatusTarefa, titulo: 'Em Andamento', cor: '#F59E0B' },
  { id: 'concluida' as StatusTarefa, titulo: 'Concluída', cor: '#22C55E' },
  { id: 'cancelada' as StatusTarefa, titulo: 'Cancelada', cor: '#EF4444' },
];

export const RESPONSAVEIS = [
  'Lucas', 'Ana', 'Pedro', 'Maria', 'João', 'Carla'
];

// ============================================
// HOOK
// ============================================

export const useTasks = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTarefas = useCallback(async (filtros?: {
    responsavel?: string;
    status?: string;
    prioridade?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = (supabase as any)
        .from('tarefas')
        .select('*, subtarefas(*)')
        .order('created_at', { ascending: false });

      if (filtros?.responsavel) query = query.eq('responsavel', filtros.responsavel);
      if (filtros?.status)      query = query.eq('status', filtros.status);
      if (filtros?.prioridade)  query = query.eq('prioridade', filtros.prioridade);

      const { data, error: supaError } = await query;
      if (supaError) throw supaError;

      const tarefasFormatadas: Tarefa[] = (data || []).map((t: any) => ({
        ...t,
        prioridade: t.prioridade as PrioridadeTarefa,
        status: t.status as StatusTarefa,
        data_limite: t.data_limite,
        deadline: t.data_limite,        // backward compat alias
        subtarefas: Array.isArray(t.subtarefas) ? t.subtarefas : [],
        tags: Array.isArray(t.tags) ? t.tags : [],
      }));

      setTarefas(tarefasFormatadas);
      return tarefasFormatadas;
    } catch (_err: any) {
      setError(_err.message);
      toast.error('Erro ao carregar tarefas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarTarefa = useCallback(async (tarefa: Partial<Tarefa>): Promise<Tarefa | null> => {
    try {
      const dbData: any = {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        responsavel: tarefa.responsavel,
        prioridade: tarefa.prioridade || 'media',
        status: tarefa.status || 'pendente',
        data_limite: tarefa.data_limite || tarefa.deadline || null,
        tags: tarefa.tags || [],
      };

      const { data, error } = await (supabase as any)
        .from('tarefas')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Tarefa criada com sucesso');
      await fetchTarefas();
      return data as any;
    } catch (_err: any) {
      toast.error('Erro ao criar tarefa: ' + _err.message);
      return null;
    }
  }, [fetchTarefas]);

  const atualizarTarefa = useCallback(async (
    id: string,
    updates: Partial<Tarefa>
  ): Promise<boolean> => {
    try {
      const dbUpdates: any = {};
      if (updates.titulo     !== undefined) dbUpdates.titulo      = updates.titulo;
      if (updates.descricao  !== undefined) dbUpdates.descricao   = updates.descricao;
      if (updates.responsavel !== undefined) dbUpdates.responsavel = updates.responsavel;
      if (updates.prioridade  !== undefined) dbUpdates.prioridade  = updates.prioridade;
      if (updates.status      !== undefined) dbUpdates.status      = updates.status;
      if (updates.data_limite !== undefined) dbUpdates.data_limite = updates.data_limite;
      if (updates.deadline    !== undefined) dbUpdates.data_limite = updates.deadline;
      if (updates.tags        !== undefined) dbUpdates.tags        = updates.tags;

      const { error } = await (supabase as any)
        .from('tarefas')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Tarefa atualizada');
      await fetchTarefas();
      return true;
    } catch (_err: any) {
      toast.error('Erro ao atualizar tarefa: ' + _err.message);
      return false;
    }
  }, [fetchTarefas]);

  const deletarTarefa = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Tarefa removida');
      await fetchTarefas();
      return true;
    } catch (_err: any) {
      toast.error('Erro ao remover tarefa: ' + _err.message);
      return false;
    }
  }, [fetchTarefas]);

  // ── Projetos (stub — tabela não existe ainda) ───────────────────────────────
  const fetchProjetos = useCallback(async (): Promise<Projeto[]> => {
    setProjetos([]);
    return [];
  }, []);

  const criarProjeto = useCallback(async (_projeto: Partial<Projeto>): Promise<Projeto | null> => {
    toast.error('Projetos ainda não disponíveis');
    return null;
  }, []);

  const atualizarProjeto = useCallback(async (_id: string, _updates: Partial<Projeto>): Promise<boolean> => {
    toast.error('Projetos ainda não disponíveis');
    return false;
  }, []);

  const deletarProjeto = useCallback(async (_id: string): Promise<boolean> => {
    toast.error('Projetos ainda não disponíveis');
    return false;
  }, []);

  // ── Comentários ─────────────────────────────────────────────────────────────
  const fetchComentarios = useCallback(async (tarefaId: string): Promise<Comentario[]> => {
    const { data, error } = await (supabase as any)
      .from('comentarios_tarefa')
      .select('*')
      .eq('tarefa_id', tarefaId)
      .order('criado_em', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar comentários');
      return [];
    }
    return (data || []).map((c: any) => ({
      ...c,
      autor_nome: c.autor,
      created_at: c.criado_em,
    }));
  }, []);

  const adicionarComentario = useCallback(async (
    tarefaId: string,
    conteudo: string,
    autorId?: string
  ): Promise<Comentario | null> => {
    try {
      const { data, error } = await (supabase as any)
        .from('comentarios_tarefa')
        .insert({
          tarefa_id: tarefaId,
          conteudo,
          autor: autorId || 'Usuário',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Comentário adicionado');
      return data as Comentario;
    } catch (_err: any) {
      toast.error('Erro ao adicionar comentário');
      return null;
    }
  }, []);

  const removerComentario = useCallback(async (comentarioId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('comentarios_tarefa')
        .delete()
        .eq('id', comentarioId);

      if (error) throw error;
      return true;
    } catch {
      toast.error('Erro ao remover comentário');
      return false;
    }
  }, []);

  // ── Subtarefas ──────────────────────────────────────────────────────────────
  const adicionarSubtarefa = useCallback(async (
    tarefaId: string,
    titulo: string
  ): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('subtarefas')
        .insert({ tarefa_id: tarefaId, titulo, concluida: false });

      if (error) throw error;

      toast.success('Subtarefa adicionada');
      await fetchTarefas();
      return true;
    } catch (_err: any) {
      toast.error('Erro ao adicionar subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  const toggleSubtarefa = useCallback(async (
    _tarefaId: string,
    subtarefaId: string,
    concluida?: boolean
  ): Promise<boolean> => {
    try {
      // If concluida not passed, fetch current state and flip it
      let newValue = concluida;
      if (newValue === undefined) {
        const { data } = await (supabase as any)
          .from('subtarefas')
          .select('concluida')
          .eq('id', subtarefaId)
          .single();
        newValue = !data?.concluida;
      }

      const { error } = await (supabase as any)
        .from('subtarefas')
        .update({ concluida: newValue, updated_at: new Date().toISOString() })
        .eq('id', subtarefaId);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch {
      toast.error('Erro ao atualizar subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  const removerSubtarefa = useCallback(async (
    _tarefaId: string,
    subtarefaId: string
  ): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('subtarefas')
        .delete()
        .eq('id', subtarefaId);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch {
      toast.error('Erro ao remover subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  // ── Estatísticas ─────────────────────────────────────────────────────────────
  const getEstatisticas = useCallback(() => {
    const total       = tarefas.length;
    const pendentes   = tarefas.filter(t => t.status === 'pendente').length;
    const emAndamento = tarefas.filter(t => t.status === 'em_andamento').length;
    const concluidas  = tarefas.filter(t => t.status === 'concluida').length;
    const urgentes    = tarefas.filter(t => t.prioridade === 'urgente').length;

    return {
      total,
      pendentes,
      emAndamento,
      concluidas,
      urgentes,
      taxaConclusao: total > 0 ? Math.round((concluidas / total) * 100) : 0,
    };
  }, [tarefas]);

  useEffect(() => {
    fetchTarefas();
    fetchProjetos();
  }, [fetchTarefas, fetchProjetos]);

  return {
    tarefas,
    projetos,
    loading,
    error,
    fetchTarefas,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    fetchProjetos,
    criarProjeto,
    atualizarProjeto,
    deletarProjeto,
    fetchComentarios,
    adicionarComentario,
    removerComentario,
    adicionarSubtarefa,
    toggleSubtarefa,
    removerSubtarefa,
    getEstatisticas,
  };
};

export default useTasks;
