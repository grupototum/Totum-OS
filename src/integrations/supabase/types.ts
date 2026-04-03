export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      action_plan_tasks: {
        Row: {
          code: string
          created_at: string | null
          day_end: number
          day_start: number
          id: string
          phase: number
          phase_name: string
          progress: number
          responsible: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          day_end?: number
          day_start?: number
          id?: string
          phase?: number
          phase_name: string
          progress?: number
          responsible?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          day_end?: number
          day_start?: number
          id?: string
          phase?: number
          phase_name?: string
          progress?: number
          responsible?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_stats: {
        Row: {
          created_at: string | null
          date: string
          deployments: number
          id: string
          messages: number
          requests: number
        }
        Insert: {
          created_at?: string | null
          date: string
          deployments?: number
          id?: string
          messages?: number
          requests?: number
        }
        Update: {
          created_at?: string | null
          date?: string
          deployments?: number
          id?: string
          messages?: number
          requests?: number
        }
        Relationships: []
      }
      agent_interactions: {
        Row: {
          agent_name: string
          created_at: string | null
          date: string
          id: string
          interactions: number
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          date?: string
          id?: string
          interactions?: number
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          date?: string
          id?: string
          interactions?: number
        }
        Relationships: []
      }
      agents: {
        Row: {
          category: string | null
          created_at: string | null
          daily_tasks: number | null
          emoji: string | null
          id: string
          name: string
          role: string
          status: string
          success_rate: number | null
          tasks: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          daily_tasks?: number | null
          emoji?: string | null
          id?: string
          name: string
          role: string
          status?: string
          success_rate?: number | null
          tasks?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          daily_tasks?: number | null
          emoji?: string | null
          id?: string
          name?: string
          role?: string
          status?: string
          success_rate?: number | null
          tasks?: number
        }
        Relationships: []
      }
      clients: {
        Row: {
          additional_info: string | null
          age_max: number | null
          age_min: number | null
          brand_tone: string | null
          business_description: string | null
          business_hours_end: string | null
          business_hours_start: string | null
          cnpj: string | null
          company_name: string
          company_size: string | null
          contact_name: string | null
          created_at: string | null
          crm_used: string | null
          desires: string | null
          email: string | null
          fonts: string | null
          gender: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          main_niche: string | null
          main_pains: string | null
          monthly_revenue: string | null
          phone: string | null
          primary_color: string | null
          products_services: string | null
          secondary_color: string | null
          sla_response: string | null
          social_class: string | null
          status: string
          support_channels: string[] | null
          terms_accepted: boolean | null
          time_in_market: string | null
          updated_at: string | null
          user_id: string
          visual_elements: string | null
          visual_personality: string | null
          website: string | null
          working_days: string[] | null
        }
        Insert: {
          additional_info?: string | null
          age_max?: number | null
          age_min?: number | null
          brand_tone?: string | null
          business_description?: string | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          cnpj?: string | null
          company_name: string
          company_size?: string | null
          contact_name?: string | null
          created_at?: string | null
          crm_used?: string | null
          desires?: string | null
          email?: string | null
          fonts?: string | null
          gender?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          main_niche?: string | null
          main_pains?: string | null
          monthly_revenue?: string | null
          phone?: string | null
          primary_color?: string | null
          products_services?: string | null
          secondary_color?: string | null
          sla_response?: string | null
          social_class?: string | null
          status?: string
          support_channels?: string[] | null
          terms_accepted?: boolean | null
          time_in_market?: string | null
          updated_at?: string | null
          user_id: string
          visual_elements?: string | null
          visual_personality?: string | null
          website?: string | null
          working_days?: string[] | null
        }
        Update: {
          additional_info?: string | null
          age_max?: number | null
          age_min?: number | null
          brand_tone?: string | null
          business_description?: string | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          cnpj?: string | null
          company_name?: string
          company_size?: string | null
          contact_name?: string | null
          created_at?: string | null
          crm_used?: string | null
          desires?: string | null
          email?: string | null
          fonts?: string | null
          gender?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          main_niche?: string | null
          main_pains?: string | null
          monthly_revenue?: string | null
          phone?: string | null
          primary_color?: string | null
          products_services?: string | null
          secondary_color?: string | null
          sla_response?: string | null
          social_class?: string | null
          status?: string
          support_channels?: string[] | null
          terms_accepted?: boolean | null
          time_in_market?: string | null
          updated_at?: string | null
          user_id?: string
          visual_elements?: string | null
          visual_personality?: string | null
          website?: string | null
          working_days?: string[] | null
        }
        Relationships: []
      }
      content_pipeline: {
        Row: {
          approval_status: string
          assignee: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          sort_order: number
          stage: string
          title: string
          user_id: string
        }
        Insert: {
          approval_status?: string
          assignee?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          stage?: string
          title: string
          user_id: string
        }
        Update: {
          approval_status?: string
          assignee?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          stage?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      cost_history: {
        Row: {
          created_at: string | null
          hosting: number
          ia: number
          id: string
          month: string
          tools: number
        }
        Insert: {
          created_at?: string | null
          hosting?: number
          ia?: number
          id?: string
          month: string
          tools?: number
        }
        Update: {
          created_at?: string | null
          hosting?: number
          ia?: number
          id?: string
          month?: string
          tools?: number
        }
        Relationships: []
      }
      dashboard_activities: {
        Row: {
          created_at: string | null
          id: string
          message: string
          time: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          time: string
          type?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          time?: string
          type?: string
        }
        Relationships: []
      }
      dashboard_apps: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number | null
          status?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          status?: string
        }
        Relationships: []
      }
      dashboard_costs: {
        Row: {
          created_at: string | null
          id: string
          label: string
          month: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          month?: string
          value?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          month?: string
          value?: number
        }
        Relationships: []
      }
      github_config: {
        Row: {
          created_at: string | null
          id: string
          repo: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          repo: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          repo?: string
          status?: string
        }
        Relationships: []
      }
      mex_sync: {
        Row: {
          created_at: string | null
          id: string
          label: string
          last_sync: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          last_sync?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          last_sync?: string | null
          status?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          created_at: string
          deadline: string | null
          descricao: string | null
          id: string
          prioridade: string
          responsavel: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vps_servers: {
        Row: {
          cpu: number
          created_at: string | null
          description: string | null
          disk: number
          id: string
          name: string
          ram: number
          status: string
        }
        Insert: {
          cpu?: number
          created_at?: string | null
          description?: string | null
          disk?: number
          id?: string
          name: string
          ram?: number
          status?: string
        }
        Update: {
          cpu?: number
          created_at?: string | null
          description?: string | null
          disk?: number
          id?: string
          name?: string
          ram?: number
          status?: string
        }
        Relationships: []
      }
      vps_usage_history: {
        Row: {
          cpu: number
          disk: number
          id: string
          ram: number
          recorded_at: string
          vps_name: string
        }
        Insert: {
          cpu?: number
          disk?: number
          id?: string
          ram?: number
          recorded_at?: string
          vps_name: string
        }
        Update: {
          cpu?: number
          disk?: number
          id?: string
          ram?: number
          recorded_at?: string
          vps_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
