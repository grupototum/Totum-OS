/**
 * Tipos para o sistema de tarefas
 */
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
export interface RespostaAPI<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface ListarTarefasQuery {
    status?: StatusTarefa;
    responsavel?: string;
    prioridade?: PrioridadeTarefa;
    ordenarPor?: 'created_at' | 'updated_at' | 'deadline' | 'prioridade';
    ordem?: 'asc' | 'desc';
}
//# sourceMappingURL=tarefas.d.ts.map