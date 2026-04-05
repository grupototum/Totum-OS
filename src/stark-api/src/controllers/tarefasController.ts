import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { 
  CriarTarefaDTO, 
  AtualizarTarefaDTO, 
  RespostaAPI, 
  Tarefa,
  ListarTarefasQuery 
} from '../types/tarefas.js';

export class TarefasController {
  /**
   * Listar todas as tarefas com filtros opcionais
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { 
        status, 
        responsavel, 
        prioridade,
        ordenarPor = 'created_at',
        ordem = 'desc'
      } = req.query as ListarTarefasQuery;

      let query = supabase
        .from('tarefas')
        .select('*');

      // Aplicar filtros
      if (status) {
        query = query.eq('status', status);
      }
      if (responsavel) {
        query = query.eq('responsavel', responsavel);
      }
      if (prioridade) {
        query = query.eq('prioridade', prioridade);
      }

      // Aplicar ordenação
      query = query.order(ordenarPor, { ascending: ordem === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao listar tarefas:', error);
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Erro ao buscar tarefas',
          message: error.message
        };
        res.status(500).json(resposta);
        return;
      }

      const resposta: RespostaAPI<Tarefa[]> = {
        success: true,
        data: (data || []) as Tarefa[],
        message: `${data?.length || 0} tarefa(s) encontrada(s)`
      };
      res.json(resposta);
    } catch (err) {
      console.error('Erro inesperado:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro interno do servidor'
      };
      res.status(500).json(resposta);
    }
  }

  /**
   * Obter uma tarefa por ID
   */
  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const resposta: RespostaAPI<never> = {
            success: false,
            error: 'Tarefa não encontrada'
          };
          res.status(404).json(resposta);
          return;
        }
        throw error;
      }

      const resposta: RespostaAPI<Tarefa> = {
        success: true,
        data: data as Tarefa,
        message: 'Tarefa encontrada'
      };
      res.json(resposta);
    } catch (err) {
      console.error('Erro ao obter tarefa:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro ao buscar tarefa'
      };
      res.status(500).json(resposta);
    }
  }

  /**
   * Criar uma nova tarefa
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dto: CriarTarefaDTO = req.body;

      // Validação básica
      if (!dto.titulo || dto.titulo.trim() === '') {
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Título é obrigatório'
        };
        res.status(400).json(resposta);
        return;
      }

      const { data, error } = await supabase
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

      if (error) {
        console.error('Erro ao criar tarefa:', error);
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Erro ao criar tarefa',
          message: error.message
        };
        res.status(500).json(resposta);
        return;
      }

      const resposta: RespostaAPI<Tarefa> = {
        success: true,
        data: data as Tarefa,
        message: 'Tarefa criada com sucesso'
      };
      res.status(201).json(resposta);
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro interno do servidor'
      };
      res.status(500).json(resposta);
    }
  }

  /**
   * Atualizar uma tarefa existente
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: AtualizarTarefaDTO = req.body;

      // Verificar se a tarefa existe
      const { data: existente, error: erroBusca } = await supabase
        .from('tarefas')
        .select('id')
        .eq('id', id)
        .single();

      if (erroBusca || !existente) {
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Tarefa não encontrada'
        };
        res.status(404).json(resposta);
        return;
      }

      // Montar objeto de atualização
      const atualizacao: Record<string, unknown> = {};
      
      if (dto.titulo !== undefined) atualizacao.titulo = dto.titulo.trim();
      if (dto.descricao !== undefined) atualizacao.descricao = dto.descricao?.trim() || null;
      if (dto.status !== undefined) atualizacao.status = dto.status;
      if (dto.responsavel !== undefined) atualizacao.responsavel = dto.responsavel?.trim() || null;
      if (dto.prioridade !== undefined) atualizacao.prioridade = dto.prioridade;
      if (dto.deadline !== undefined) atualizacao.deadline = dto.deadline || null;

      // Atualizar updated_at automaticamente
      atualizacao.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('tarefas')
        .update(atualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Erro ao atualizar tarefa',
          message: error.message
        };
        res.status(500).json(resposta);
        return;
      }

      const resposta: RespostaAPI<Tarefa> = {
        success: true,
        data: data as Tarefa,
        message: 'Tarefa atualizada com sucesso'
      };
      res.json(resposta);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro interno do servidor'
      };
      res.status(500).json(resposta);
    }
  }

  /**
   * Deletar uma tarefa
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verificar se a tarefa existe
      const { data: existente, error: erroBusca } = await supabase
        .from('tarefas')
        .select('id')
        .eq('id', id)
        .single();

      if (erroBusca || !existente) {
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Tarefa não encontrada'
        };
        res.status(404).json(resposta);
        return;
      }

      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar tarefa:', error);
        const resposta: RespostaAPI<never> = {
          success: false,
          error: 'Erro ao deletar tarefa',
          message: error.message
        };
        res.status(500).json(resposta);
        return;
      }

      const resposta: RespostaAPI<{ id: string }> = {
        success: true,
        data: { id },
        message: 'Tarefa deletada com sucesso'
      };
      res.json(resposta);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro interno do servidor'
      };
      res.status(500).json(resposta);
    }
  }

  /**
   * Obter estatísticas das tarefas
   */
  async estatisticas(_req: Request, res: Response): Promise<void> {
    try {
      const { data: todas, error } = await supabase
        .from('tarefas')
        .select('status, prioridade');

      if (error) {
        throw error;
      }

      const estatisticas = {
        total: todas?.length || 0,
        porStatus: {
          pendente: todas?.filter(t => t.status === 'pendente').length || 0,
          em_andamento: todas?.filter(t => t.status === 'em_andamento').length || 0,
          concluida: todas?.filter(t => t.status === 'concluida').length || 0,
        },
        porPrioridade: {
          baixa: todas?.filter(t => t.prioridade === 'baixa').length || 0,
          media: todas?.filter(t => t.prioridade === 'media').length || 0,
          alta: todas?.filter(t => t.prioridade === 'alta').length || 0,
          critica: todas?.filter(t => t.prioridade === 'critica').length || 0,
        }
      };

      const resposta: RespostaAPI<typeof estatisticas> = {
        success: true,
        data: estatisticas,
        message: 'Estatísticas obtidas com sucesso'
      };
      res.json(resposta);
    } catch (err) {
      console.error('Erro ao obter estatísticas:', err);
      const resposta: RespostaAPI<never> = {
        success: false,
        error: 'Erro ao obter estatísticas'
      };
      res.status(500).json(resposta);
    }
  }
}

export default new TarefasController();