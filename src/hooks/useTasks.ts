// src/hooks/useTasksFixed.ts
// ✅ CORREÇÃO: Funções stub implementadas com Supabase

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================
// TIPOS
// ============================================

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  data_limite?: string;
  projeto_id?: string;
  created_at?: string;
  updated_at?: string;
  subtarefas?: Subtarefa[];
  comentarios?: Comentario[];
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
// HOOK
// ============================================

export const useTasks = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // TAREFAS
  // ==========================================

  const fetchTarefas = useCallback(async (filtros?: {
    projeto_id?: string;
    responsavel?: string;
    status?: string;
    prioridade?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('tarefas')
        .select(`
          *,
          subtarefas(*),
          comentarios(*, autor:autor_id(nome))
        `)
        .order('created_at', { ascending: false });

      if (filtros?.projeto_id) {
        query = query.eq('projeto_id', filtros.projeto_id);
      }
      if (filtros?.responsavel) {
        query = query.eq('responsavel', filtros.responsavel);
      }
      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros?.prioridade) {
        query = query.eq('prioridade', filtros.prioridade);
      }

      const { data, error: supaError } = await query;

      if (supaError) throw supaError;

      // Formatar dados
      const tarefasFormatadas: Tarefa[] = (data || []).map(t => ({
        ...t,
        comentarios: t.comentarios?.map((c: any) => ({
          ...c,
          autor_nome: c.autor?.nome || 'Usuário'
        }))
      }));

      setTarefas(tarefasFormatadas);
      return tarefasFormatadas;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar tarefas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarTarefa = useCallback(async (tarefa: Partial<Tarefa>): Promise<Tarefa | null> => {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .insert([tarefa])
        .select()
        .single();

      if (error) throw error;

      toast.success('Tarefa criada com sucesso');
      await fetchTarefas(); // Recarregar lista
      return data;
    } catch (err: any) {
      toast.error('Erro ao criar tarefa: ' + err.message);
      return null;
    }
  }, [fetchTarefas]);

  const atualizarTarefa = useCallback(async (
    id: string, 
    updates: Partial<Tarefa>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Tarefa atualizada');
      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar tarefa: ' + err.message);
      return false;
    }
  }, [fetchTarefas]);

  const deletarTarefa = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Tarefa removida');
      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover tarefa: ' + err.message);
      return false;
    }
  }, [fetchTarefas]);

  // ==========================================
  // PROJETOS (IMPLEMENTADO - antes era stub)
  // ==========================================

  const fetchProjetos = useCallback(async (): Promise<Projeto[]> => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projetosList = data || [];
      setProjetos(projetosList);
      return projetosList;
    } catch (err: any) {
      toast.error('Erro ao carregar projetos');
      return [];
    }
  }, []);

  const criarProjeto = useCallback(async (
    projeto: Partial<Projeto>
  ): Promise<Projeto | null> => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert([projeto])
        .select()
        .single();

      if (error) throw error;

      toast.success('Projeto criado com sucesso');
      await fetchProjetos();
      return data;
    } catch (err: any) {
      toast.error('Erro ao criar projeto: ' + err.message);
      return null;
    }
  }, [fetchProjetos]);

  const atualizarProjeto = useCallback(async (
    id: string, 
    updates: Partial<Projeto>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Projeto atualizado');
      await fetchProjetos();
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar projeto: ' + err.message);
      return false;
    }
  }, [fetchProjetos]);

  const deletarProjeto = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Projeto removido');
      await fetchProjetos();
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover projeto: ' + err.message);
      return false;
    }
  }, [fetchProjetos]);

  // ==========================================
  // COMENTÁRIOS (IMPLEMENTADO - antes era stub)
  // ==========================================

  const adicionarComentario = useCallback(async (
    tarefaId: string, 
    conteudo: string, 
    autorId: string
  ): Promise<Comentario | null> => {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .insert([{
          tarefa_id: tarefaId,
          conteudo,
          autor_id: autorId
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTarefas();
      return data;
    } catch (err: any) {
      toast.error('Erro ao adicionar comentário');
      return null;
    }
  }, [fetchTarefas]);

  // ==========================================
  // SUBTAREFAS (IMPLEMENTADO - antes era stub)
  // ==========================================

  const adicionarSubtarefa = useCallback(async (
    tarefaId: string, 
    titulo: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subtarefas')
        .insert([{
          tarefa_id: tarefaId,
          titulo,
          concluida: false
        }]);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast.error('Erro ao adicionar subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  const toggleSubtarefa = useCallback(async (
    tarefaId: string, 
    subtarefaId: string
  ): Promise<boolean> => {
    try {
      // Buscar estado atual
      const { data: subtarefa } = await supabase
        .from('subtarefas')
        .select('concluida')
        .eq('id', subtarefaId)
        .single();

      const novoEstado = !subtarefa?.concluida;

      const { error } = await supabase
        .from('subtarefas')
        .update({ concluida: novoEstado })
        .eq('id', subtarefaId);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast.error('Erro ao atualizar subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  const removerSubtarefa = useCallback(async (
    tarefaId: string, 
    subtarefaId: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subtarefas')
        .delete()
        .eq('id', subtarefaId);

      if (error) throw error;

      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast.error('Erro ao remover subtarefa');
      return false;
    }
  }, [fetchTarefas]);

  // ==========================================
  // ESTATÍSTICAS
  // ==========================================

  const getEstatisticas = useCallback(() => {
    const total = tarefas.length;
    const pendentes = tarefas.filter(t => t.status === 'pendente').length;
    const emAndamento = tarefas.filter(t => t.status === 'em_andamento').length;
    const concluidas = tarefas.filter(t => t.status === 'concluida').length;
    const urgentes = tarefas.filter(t => t.prioridade === 'urgente').length;

    return {
      total,
      pendentes,
      emAndamento,
      concluidas,
      urgentes,
      taxaConclusao: total > 0 ? Math.round((concluidas / total) * 100) : 0
    };
  }, [tarefas]);

  // ==========================================
  // LIFECYCLE
  // ==========================================

  useEffect(() => {
    fetchTarefas();
    fetchProjetos();
  }, [fetchTarefas, fetchProjetos]);

  return {
    // Estados
    tarefas,
    projetos,
    loading,
    error,

    // Tarefas
    fetchTarefas,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,

    // Projetos (✅ Implementados)
    fetchProjetos,
    criarProjeto,
    atualizarProjeto,
    deletarProjeto,

    // Comentários (✅ Implementados)
    adicionarComentario,

    // Subtarefas (✅ Implementados)
    adicionarSubtarefa,
    toggleSubtarefa,
    removerSubtarefa,

    // Estatísticas
    getEstatisticas
  };
};

export default useTasks;
