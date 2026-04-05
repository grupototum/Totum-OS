import { Router } from 'express';
import tarefasController from '../controllers/tarefasController.js';

const router = Router();

/**
 * @route   GET /api/tarefas
 * @desc    Listar todas as tarefas
 * @query   status, responsavel, prioridade, ordenarPor, ordem
 */
router.get('/', tarefasController.listar);

/**
 * @route   GET /api/tarefas/estatisticas
 * @desc    Obter estatísticas das tarefas
 */
router.get('/estatisticas', tarefasController.estatisticas);

/**
 * @route   GET /api/tarefas/:id
 * @desc    Obter uma tarefa por ID
 */
router.get('/:id', tarefasController.obterPorId);

/**
 * @route   POST /api/tarefas
 * @desc    Criar uma nova tarefa
 */
router.post('/', tarefasController.criar);

/**
 * @route   PATCH /api/tarefas/:id
 * @desc    Atualizar uma tarefa existente
 */
router.patch('/:id', tarefasController.atualizar);

/**
 * @route   DELETE /api/tarefas/:id
 * @desc    Deletar uma tarefa
 */
router.delete('/:id', tarefasController.deletar);

export default router;