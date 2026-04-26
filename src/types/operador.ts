// Tipos para Operadores (usuários humanos do Totum OS)

export type OperadorRole = 'admin' | 'gestor' | 'analista' | 'operador' | 'viewer';
export type OperadorStatus = 'ativo' | 'inativo' | 'suspenso';

export interface Operador {
  id: string;
  nome: string;
  email: string;
  role: OperadorRole;
  permissoes: OperadorPermissoes;
  status: OperadorStatus;
  avatar_url?: string;
  telegram_chat_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface OperadorPermissoes {
  dashboard: boolean;
  agentes: boolean;
  tarefas: boolean;
  clientes: boolean;
  alexandria: boolean;
  ferramentas_ia: boolean;
  configuracoes: boolean;
  financeiro: boolean;
}

export const DEFAULT_PERMISSOES: Record<OperadorRole, OperadorPermissoes> = {
  admin: {
    dashboard: true, agentes: true, tarefas: true, clientes: true,
    alexandria: true, ferramentas_ia: true, configuracoes: true, financeiro: true,
  },
  gestor: {
    dashboard: true, agentes: true, tarefas: true, clientes: true,
    alexandria: true, ferramentas_ia: true, configuracoes: false, financeiro: true,
  },
  analista: {
    dashboard: true, agentes: false, tarefas: true, clientes: true,
    alexandria: true, ferramentas_ia: true, configuracoes: false, financeiro: false,
  },
  operador: {
    dashboard: true, agentes: false, tarefas: true, clientes: false,
    alexandria: true, ferramentas_ia: false, configuracoes: false, financeiro: false,
  },
  viewer: {
    dashboard: true, agentes: false, tarefas: false, clientes: false,
    alexandria: true, ferramentas_ia: false, configuracoes: false, financeiro: false,
  },
};

export interface OperadorFormData {
  nome: string;
  email: string;
  role: OperadorRole;
  status: OperadorStatus;
  telegram_chat_id?: string;
  permissoes: OperadorPermissoes;
}
