import { Request, Response } from 'express';
export declare class TarefasController {
    /**
     * Listar todas as tarefas com filtros opcionais
     */
    listar(req: Request, res: Response): Promise<void>;
    /**
     * Obter uma tarefa por ID
     */
    obterPorId(req: Request, res: Response): Promise<void>;
    /**
     * Criar uma nova tarefa
     */
    criar(req: Request, res: Response): Promise<void>;
    /**
     * Atualizar uma tarefa existente
     */
    atualizar(req: Request, res: Response): Promise<void>;
    /**
     * Deletar uma tarefa
     */
    deletar(req: Request, res: Response): Promise<void>;
    /**
     * Obter estatísticas das tarefas
     */
    estatisticas(_req: Request, res: Response): Promise<void>;
}
declare const _default: TarefasController;
export default _default;
//# sourceMappingURL=tarefasController.d.ts.map