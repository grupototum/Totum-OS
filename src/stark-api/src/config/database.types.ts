export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}