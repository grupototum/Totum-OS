import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types
export interface Subtarefa {
  id: string;
  titulo: string;
  concluida: boolean;
}

export type StatusTarefa = 'a_fazer' | 'fazendo' | 'revisao' | 'feito';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta' | 'urgente';
export type TipoTarefa = 'unica' | 'projeto';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  responsavel?: string;
  data_limite?: string;
  projeto_id?: string | null;
  tipo: TipoTarefa;
  tags: string[];
  subtarefas: Subtarefa[];
  criado_em: string;
  atualizado_em: string;
  criado_por?: string;
  posicao: number;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  criado_em: string;
}

export interface Comentario {
  id: string;
  tarefa_id: string;
  autor: string;
  conteudo: string;
  criado_em: string;
}

// Status columns config
export const COLUNAS_KANBAN: { id: StatusTarefa; titulo: string; cor: string }[] = [
  { id: 'a_fazer', titulo: 'A Fazer', cor: '#78716C' },
  { id: 'fazendo', titulo: 'Fazendo', cor: '#3B82F6' },
  { id: 'revisao', titulo: 'Revisão', cor: '#F59E0B' },
  { id: 'feito', titulo: 'Feito', cor: '#22C55E' },
];

export const PRIORIDADES: { id: PrioridadeTarefa; label: string; cor: string }[] = [
  { id: 'baixa', label: 'Baixa', cor: '#78716C' },
  { id: 'media', label: 'Média', cor: '#3B82F6' },
  { id: 'alta', label: 'Alta', cor: '#F59E0B' },
  { id: 'urgente', label: 'Urgente', cor: '#EF4444' },
];

// Hook principal
export function useTasks() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as tarefas
  const fetchTarefas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .order('posicao', { ascending: true })
        .order('criado_em', { ascending: false });

      if (error) {
        console.warn('Erro ao buscar tarefas:', error.message);
        setTarefas([]);
        return;
      }

      // Parse JSON fields
      const parsedData: Tarefa[] = (data || []).map((t: any) => ({
        ...t,
        tags: Array.isArray(t.tags) ? t.tags : JSON.parse(t.tags || '[]'),
        subtarefas: Array.isArray(t.subtarefas) ? t.subtarefas : JSON.parse(t.subtarefas || '[]'),
      }));

      setTarefas(parsedData);
    } catch (err: any) {
      console.warn('Erro ao buscar tarefas:', err?.message || err);
      setTarefas([]);
    }
  }, []);

  // Buscar projetos
  const fetchProjetos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.warn('Erro ao buscar projetos:', error.message);
        setProjetos([]);
        return;
      }
      setProjetos(data || []);
    } catch (err: any) {
      console.warn('Erro ao buscar projetos:', err?.message || err);
      setProjetos([]);
    }
  }, []);

  // Buscar comentários de uma tarefa
  const fetchComentarios = useCallback(async (tarefaId: string) => {
    try {
      const { data, error } = await supabase
        .from('comentarios_tarefa')
        .select('*')
        .eq('tarefa_id', tarefaId)
        .order('criado_em', { ascending: true });

      if (error) throw error;
      setComentarios(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Erro ao buscar comentários:', err);
      return [];
    }
  }, []);

  // Criar tarefa
  const criarTarefa = async (tarefa: Partial<Tarefa>): Promise<Tarefa | null> => {
    try {
      // Get max position for the status column
      const maxPos = tarefas
        .filter(t => t.status === (tarefa.status || 'a_fazer'))
        .reduce((max, t) => Math.max(max, t.posicao || 0), 0);

      const novaTarefa = {
        ...tarefa,
        posicao: maxPos + 1,
        tags: tarefa.tags || [],
        subtarefas: tarefa.subtarefas || [],
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tarefas')
        .insert([novaTarefa])
        .select()
        .single();

      if (error) throw error;

      const parsedTarefa: Tarefa = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || '[]'),
        subtarefas: Array.isArray(data.subtarefas) ? data.subtarefas : JSON.parse(data.subtarefas || '[]'),
      };

      setTarefas(prev => [...prev, parsedTarefa]);
      toast({ title: '✅ Tarefa criada', description: parsedTarefa.titulo });
      return parsedTarefa;
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Atualizar tarefa
  const atualizarTarefa = async (id: string, updates: Partial<Tarefa>): Promise<boolean> => {
    try {
      const updatesComData = {
        ...updates,
        atualizado_em: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tarefas')
        .update(updatesComData)
        .eq('id', id);

      if (error) throw error;

      setTarefas(prev => prev.map(t => 
        t.id === id ? { ...t, ...updatesComData } as Tarefa : t
      ));
      
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar tarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Deletar tarefa
  const deletarTarefa = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTarefas(prev => prev.filter(t => t.id !== id));
      toast({ title: '🗑️ Tarefa excluída' });
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar tarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Mover tarefa (drag & drop)
  const moverTarefa = async (tarefaId: string, novoStatus: StatusTarefa, novaPosicao: number): Promise<boolean> => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId);
      if (!tarefa) return false;

      // Update positions of other tasks in the target column
      const tarefasColuna = tarefas.filter(t => t.status === novoStatus && t.id !== tarefaId);
      
      // Reorder tasks in target column
      const updates = tarefasColuna.map((t, idx) => {
        const pos = idx >= novaPosicao ? idx + 1 : idx;
        return { id: t.id, posicao: pos };
      });

      // Update all positions in batch
      for (const update of updates) {
        await supabase.from('tarefas').update({ posicao: update.posicao }).eq('id', update.id);
      }

      // Update the moved task
      await supabase
        .from('tarefas')
        .update({ 
          status: novoStatus, 
          posicao: novaPosicao,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', tarefaId);

      // Refresh data
      await fetchTarefas();
      return true;
    } catch (err: any) {
      console.error('Erro ao mover tarefa:', err);
      return false;
    }
  };

  // Criar projeto
  const criarProjeto = async (projeto: Partial<Projeto>): Promise<Projeto | null> => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert([{ ...projeto, criado_em: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

      setProjetos(prev => [data, ...prev]);
      toast({ title: '📁 Projeto criado', description: data.nome });
      return data;
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Atualizar projeto
  const atualizarProjeto = async (id: string, updates: Partial<Projeto>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProjetos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar projeto:', err);
      return false;
    }
  };

  // Deletar projeto
  const deletarProjeto = async (id: string): Promise<boolean> => {
    try {
      // First, unlink all tasks from this project
      await supabase
        .from('tarefas')
        .update({ projeto_id: null })
        .eq('projeto_id', id);

      const { error } = await supabase
        .from('projetos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjetos(prev => prev.filter(p => p.id !== id));
      setTarefas(prev => prev.map(t => t.projeto_id === id ? { ...t, projeto_id: null } : t));
      toast({ title: '🗑️ Projeto excluído' });
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar projeto:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return false;
    }
  };

  // Adicionar comentário
  const adicionarComentario = async (tarefaId: string, conteudo: string, autor: string): Promise<Comentario | null> => {
    try {
      const { data, error } = await supabase
        .from('comentarios_tarefa')
        .insert([{ tarefa_id: tarefaId, conteudo, autor, criado_em: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

      setComentarios(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Erro ao adicionar comentário:', err);
      return null;
    }
  };

  // Toggle subtarefa
  const toggleSubtarefa = async (tarefaId: string, subtarefaId: string): Promise<boolean> => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId);
      if (!tarefa) return false;

      const novasSubtarefas = tarefa.subtarefas.map(st =>
        st.id === subtarefaId ? { ...st, concluida: !st.concluida } : st
      );

      return await atualizarTarefa(tarefaId, { subtarefas: novasSubtarefas });
    } catch (err) {
      return false;
    }
  };

  // Adicionar subtarefa
  const adicionarSubtarefa = async (tarefaId: string, titulo: string): Promise<boolean> => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId);
      if (!tarefa) return false;

      const novaSubtarefa: Subtarefa = {
        id: crypto.randomUUID(),
        titulo,
        concluida: false,
      };

      const novasSubtarefas = [...tarefa.subtarefas, novaSubtarefa];
      return await atualizarTarefa(tarefaId, { subtarefas: novasSubtarefas });
    } catch (err) {
      return false;
    }
  };

  // Remover subtarefa
  const removerSubtarefa = async (tarefaId: string, subtarefaId: string): Promise<boolean> => {
    try {
      const tarefa = tarefas.find(t => t.id === tarefaId);
      if (!tarefa) return false;

      const novasSubtarefas = tarefa.subtarefas.filter(st => st.id !== subtarefaId);
      return await atualizarTarefa(tarefaId, { subtarefas: novasSubtarefas });
    } catch (err) {
      return false;
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTarefas(), fetchProjetos()]);
      setLoading(false);
    };
    loadData();

    // Real-time subscription
    const channel = supabase
      .channel('tarefas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas' }, () => {
        fetchTarefas();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projetos' }, () => {
        fetchProjetos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTarefas, fetchProjetos]);

  return {
    tarefas,
    projetos,
    comentarios,
    loading,
    error,
    fetchTarefas,
    fetchProjetos,
    fetchComentarios,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    moverTarefa,
    criarProjeto,
    atualizarProjeto,
    deletarProjeto,
    adicionarComentario,
    toggleSubtarefa,
    adicionarSubtarefa,
    removerSubtarefa,
  };
}
