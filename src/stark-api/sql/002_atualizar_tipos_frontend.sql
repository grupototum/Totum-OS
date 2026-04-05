-- Script para atualizar os tipos do Supabase no frontend
-- Execute este script no SQL Editor do Supabase para adicionar a tabela tarefas
-- Depois, atualize o arquivo types.ts do frontend

-- Adicionar tabela tarefas aos tipos existentes
-- Copie este trecho para src/integrations/supabase/types.ts dentro de Tables:

/*
tarefas: {
  Row: {
    id: string
    titulo: string
    descricao: string | null
    status: string
    responsavel: string | null
    prioridade: string
    deadline: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    titulo: string
    descricao?: string | null
    status?: string
    responsavel?: string | null
    prioridade?: string
    deadline?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    titulo?: string
    descricao?: string | null
    status?: string
    responsavel?: string | null
    prioridade?: string
    deadline?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: []
}
*/