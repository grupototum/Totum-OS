import { Database } from './database.types.js';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        tarefas: {
            Row: {
                id: string;
                titulo: string;
                descricao: string | null;
                status: string;
                responsavel: string | null;
                prioridade: string;
                deadline: string | null;
                created_at: string;
                updated_at: string;
            };
            Insert: {
                id?: string;
                titulo: string;
                descricao?: string | null;
                status?: string;
                responsavel?: string | null;
                prioridade?: string;
                deadline?: string | null;
                created_at?: string;
                updated_at?: string;
            };
            Update: {
                id?: string;
                titulo?: string;
                descricao?: string | null;
                status?: string;
                responsavel?: string | null;
                prioridade?: string;
                deadline?: string | null;
                created_at?: string;
                updated_at?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "12";
}>;
export default supabase;
//# sourceMappingURL=supabase.d.ts.map