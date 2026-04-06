// src/hooks/useTasks.ts
// ✅ CORREÇÃO: Funções stub implementadas com Supabase

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      toast({
        title: 'Erro ao carregar tarefas',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Tarefa criada',
        description: 'Tarefa criada com sucesso'
      });
      await fetchTarefas();
      return data;
    } catch (err: any) {
      toast({
        title: 'Erro ao criar tarefa',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Tarefa atualizada',
        description: 'Tarefa atualizada com sucesso'
      });
      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar tarefa',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Tarefa removida',
        description: 'Tarefa removida com sucesso'
      });
      await fetchTarefas();
      return true;
    } catch (err: any) {
      toast({
        title: 'Erro ao remover tarefa',
        description: err.message,
        variant: 'destructive'
      });
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
      toast({
        title: 'Erro ao carregar projetos',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Projeto criado',
        description: 'Projeto criado com sucesso'
      });
      await fetchProjetos();
      return data;
    } catch (err: any) {
      toast({
        title: 'Erro ao criar projeto',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Projeto atualizado',
        description: 'Projeto atualizado com sucesso'
      });
      await fetchProjetos();
      return true;
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar projeto',
        description: err.message,
        variant: 'destructive'
      });
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

      toast({
        title: 'Projeto removido',
        description: 'Projeto removido com sucesso'
      });
      await fetchProjetos();
      return true;
    } catch (err: any) {
      toast({
        title: 'Erro ao remover projeto',
        description: err.message,
        variant: 'destructive'
      });
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
      toast({
        title: 'Erro ao adicionar comentário',
        description: err.message,
        variant: 'destructive'
      });
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
      toast({
        title: 'Erro ao adicionar subtarefa',
        description: err.message,
        variant: 'destructive'
      });
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
      toast({
        title: 'Erro ao atualizar subtarefa',
        description: err.message,
        variant: 'destructive'
      });
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
      toast({
        title: 'Erro ao remover subtarefa',
        description: err.message,
        variant: 'destructive'
      });
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
