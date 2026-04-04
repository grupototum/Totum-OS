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

// Map DB row to Tarefa
function mapRowToTarefa(t: any): Tarefa {
  return {
    id: t.id,
    titulo: t.titulo || '',
    descricao: t.descricao || undefined,
    status: (t.status as StatusTarefa) || 'a_fazer',
    prioridade: (t.prioridade as PrioridadeTarefa) || 'media',
    responsavel: t.responsavel || undefined,
    data_limite: t.deadline || undefined,
    projeto_id: null,
    tipo: 'unica',
    tags: [],
    subtarefas: [],
    criado_em: t.created_at || new Date().toISOString(),
    atualizado_em: t.updated_at || new Date().toISOString(),
    posicao: 0,
  };
}

// Hook principal
export function useTasks() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos] = useState<Projeto[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todas as tarefas
  const fetchTarefas = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('tarefas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao buscar tarefas:', error.message);
        setTarefas([]);
        return;
      }

      setTarefas((data || []).map(mapRowToTarefa));
    } catch (err: any) {
      console.warn('Erro ao buscar tarefas:', err?.message || err);
      setTarefas([]);
    }
  }, []);

  // Buscar projetos - implementado com dados mockados até criar tabela
  const fetchProjetos = useCallback(async () => {
    try {
      // TODO: Criar tabela 'projetos' no Supabase quando necessário
      // Por enquanto, retorna array vazio
      return [] as Projeto[];
    } catch (err: any) {
      console.warn('Erro ao buscar projetos:', err?.message || err);
      return [];
    }
  }, []);

  // Criar projeto - implementado (dados mockados até criar tabela)
  const criarProjeto = useCallback(async (projeto: Partial<Projeto>): Promise<Projeto | null> => {
    try {
      if (!projeto.nome?.trim()) {
        toast({ title: '❌ Erro', description: 'Nome do projeto é obrigatório', variant: 'destructive' });
        return null;
      }

      // TODO: Implementar criação real quando tabela 'projetos' existir
      const novoProjeto: Projeto = {
        id: crypto.randomUUID(),
        nome: projeto.nome,
        descricao: projeto.descricao,
        cor: projeto.cor || '#3B82F6',
        criado_em: new Date().toISOString(),
      };

      toast({ title: '✅ Projeto criado', description: novoProjeto.nome });
      return novoProjeto;
    } catch (err: any) {
      console.error('Erro ao criar projeto:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  }, []);

  // Buscar comentários de uma tarefa
  const fetchComentarios = useCallback(async (tarefaId: string) => {
    try {
      if (!tarefaId) {
        setComentarios([]);
        return [];
      }

      // TODO: Criar tabela 'comentarios' no Supabase quando necessário
      // Por enquanto, retorna array vazio
      setComentarios([]);
      return [] as Comentario[];
    } catch (err: any) {
      console.warn('Erro ao buscar comentários:', err?.message || err);
      setComentarios([]);
      return [];
    }
  }, []);

  // Criar comentário
  const createComentario = useCallback(async (tarefaId: string, conteudo: string, autor: string): Promise<Comentario | null> => {
    try {
      if (!tarefaId || !conteudo?.trim()) {
        toast({ title: '❌ Erro', description: 'Tarefa e conteúdo são obrigatórios', variant: 'destructive' });
        return null;
      }

      // TODO: Implementar criação real quando tabela 'comentarios' existir
      const novoComentario: Comentario = {
        id: crypto.randomUUID(),
        tarefa_id: tarefaId,
        autor: autor || 'Usuário',
        conteudo: conteudo.trim(),
        criado_em: new Date().toISOString(),
      };

      setComentarios(prev => [...prev, novoComentario]);
      toast({ title: '💬 Comentário adicionado' });
      return novoComentario;
    } catch (err: any) {
      console.error('Erro ao criar comentário:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  }, []);

  // Buscar subtarefas
  const fetchSubtarefas = useCallback(async (tarefaId: string) => {
    try {
      if (!tarefaId) return [] as Subtarefa[];

      // TODO: Criar tabela 'subtarefas' no Supabase quando necessário
      // Por enquanto, retorna array vazio
      return [] as Subtarefa[];
    } catch (err: any) {
      console.warn('Erro ao buscar subtarefas:', err?.message || err);
      return [];
    }
  }, []);

  // Criar subtarefa
  const createSubtarefa = useCallback(async (tarefaId: string, titulo: string): Promise<Subtarefa | null> => {
    try {
      if (!tarefaId || !titulo?.trim()) {
        toast({ title: '❌ Erro', description: 'Tarefa e título são obrigatórios', variant: 'destructive' });
        return null;
      }

      // TODO: Implementar criação real quando tabela 'subtarefas' existir
      const novaSubtarefa: Subtarefa = {
        id: crypto.randomUUID(),
        titulo: titulo.trim(),
        concluida: false,
      };

      // Atualiza a tarefa local com a nova subtarefa
      setTarefas(prev => prev.map(t => {
        if (t.id === tarefaId) {
          return { ...t, subtarefas: [...t.subtarefas, novaSubtarefa] };
        }
        return t;
      }));

      toast({ title: '✅ Subtarefa criada' });
      return novaSubtarefa;
    } catch (err: any) {
      console.error('Erro ao criar subtarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  }, []);

  // Atualizar subtarefa (toggle concluída)
  const updateSubtarefa = useCallback(async (tarefaId: string, subtarefaId: string, concluida?: boolean): Promise<boolean> => {
    try {
      if (!tarefaId || !subtarefaId) return false;

      // TODO: Implementar atualização real quando tabela 'subtarefas' existir
      setTarefas(prev => prev.map(t => {
        if (t.id === tarefaId) {
          return {
            ...t,
            subtarefas: t.subtarefas.map(st => {
              if (st.id === subtarefaId) {
                return { ...st, concluida: concluida !== undefined ? concluida : !st.concluida };
              }
              return st;
            })
          };
        }
        return t;
      }));

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar subtarefa:', err);
      return false;
    }
  }, []);

  // Criar tarefa
  const criarTarefa = async (tarefa: Partial<Tarefa>): Promise<Tarefa | null> => {
    try {
      const insertData = {
        titulo: tarefa.titulo || 'Nova Tarefa',
        descricao: tarefa.descricao || null,
        status: tarefa.status || 'a_fazer',
        prioridade: tarefa.prioridade || 'media',
        responsavel: tarefa.responsavel || null,
        deadline: tarefa.data_limite || null,
      };

      const { data, error } = await (supabase as any)
        .from('tarefas')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const novaTarefa = mapRowToTarefa(data);
      setTarefas(prev => [novaTarefa, ...prev]);
      toast({ title: '✅ Tarefa criada', description: novaTarefa.titulo });
      return novaTarefa;
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      toast({ title: '❌ Erro', description: err.message, variant: 'destructive' });
      return null;
    }
  };

  // Atualizar tarefa
  const atualizarTarefa = async (id: string, updates: Partial<Tarefa>): Promise<boolean> => {
    try {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
      if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.prioridade !== undefined) updateData.prioridade = updates.prioridade;
      if (updates.responsavel !== undefined) updateData.responsavel = updates.responsavel;
      if (updates.data_limite !== undefined) updateData.deadline = updates.data_limite;

      const { error } = await (supabase as any)
        .from('tarefas')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setTarefas(prev => prev.map(t => 
        t.id === id ? { ...t, ...updates, atualizado_em: updateData.updated_at } as Tarefa : t
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
      const { error } = await (supabase as any)
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
  const moverTarefa = async (tarefaId: string, novoStatus: StatusTarefa, _novaPosicao: number): Promise<boolean> => {
    try {
      const { error } = await (supabase as any)
        .from('tarefas')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', tarefaId);

      if (error) throw error;

      setTarefas(prev => prev.map(t =>
        t.id === tarefaId ? { ...t, status: novoStatus } : t
      ));
      return true;
    } catch (err: any) {
      console.error('Erro ao mover tarefa:', err);
      return false;
    }
  };

  // Funções adicionais para projetos
  const atualizarProjeto = async (id: string, updates: Partial<Projeto>): Promise<boolean> => {
    try {
      // TODO: Implementar quando tabela 'projetos' existir
      console.log('Atualizando projeto:', id, updates);
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar projeto:', err);
      return false;
    }
  };

  const deletarProjeto = async (id: string): Promise<boolean> => {
    try {
      // TODO: Implementar quando tabela 'projetos' existir
      console.log('Deletando projeto:', id);
      return true;
    } catch (err: any) {
      console.error('Erro ao deletar projeto:', err);
      return false;
    }
  };

  // Alias para compatibilidade
  const adicionarComentario = createComentario;
  const adicionarSubtarefa = createSubtarefa;
  
  // Toggle subtarefa usa updateSubtarefa
  const toggleSubtarefa = async (tarefaId: string, subtarefaId: string): Promise<boolean> => {
    return updateSubtarefa(tarefaId, subtarefaId);
  };

  // Remover subtarefa
  const removerSubtarefa = async (tarefaId: string, subtarefaId: string): Promise<boolean> => {
    try {
      setTarefas(prev => prev.map(t => {
        if (t.id === tarefaId) {
          return { ...t, subtarefas: t.subtarefas.filter(st => st.id !== subtarefaId) };
        }
        return t;
      }));
      toast({ title: '🗑️ Subtarefa removida' });
      return true;
    } catch (err: any) {
      console.error('Erro ao remover subtarefa:', err);
      return false;
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTarefas();
      setLoading(false);
    };
    loadData();

    const channel = supabase
      .channel('tarefas-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas' }, () => {
        fetchTarefas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTarefas]);

  return {
    tarefas,
    projetos,
    comentarios,
    loading,
    error,
    fetchTarefas,
    fetchProjetos,
    fetchComentarios,
    createComentario,
    fetchSubtarefas,
    createSubtarefa,
    updateSubtarefa,
    criarTarefa,
    atualizarTarefa,
    deletarTarefa,
    moverTarefa,
    criarProjeto,
    atualizarProjeto,
    deletarProjeto,
    adicionarComentario,
    adicionarSubtarefa,
    removerSubtarefa,
    toggleSubtarefa,
  };
}