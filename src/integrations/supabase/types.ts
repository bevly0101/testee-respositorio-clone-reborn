export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      archived_periods: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          period_type: string
          total_balance: number
          total_expenses: number
          total_income: number
          transactions_data: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          period_type: string
          total_balance?: number
          total_expenses?: number
          total_income?: number
          transactions_data?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          total_balance?: number
          total_expenses?: number
          total_income?: number
          transactions_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      email_verification_logs: {
        Row: {
          created_at: string | null
          email: string
          enviado_em: string | null
          id: string
          status: string | null
          token_hash: string
          user_id: string | null
          verificado_em: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          enviado_em?: string | null
          id?: string
          status?: string | null
          token_hash: string
          user_id?: string | null
          verificado_em?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          enviado_em?: string | null
          id?: string
          status?: string | null
          token_hash?: string
          user_id?: string | null
          verificado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_verification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      entradas: {
        Row: {
          created_at: string | null
          data_entrada: string | null
          id: number
          nome: string
          tipo: string | null
          tipo_especificado: string | null
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_entrada?: string | null
          id?: number
          nome: string
          tipo?: string | null
          tipo_especificado?: string | null
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_entrada?: string | null
          id?: number
          nome?: string
          tipo?: string | null
          tipo_especificado?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      gastos: {
        Row: {
          created_at: string | null
          data_gasto: string | null
          id: number
          nome: string
          tipo: string
          tipo_especificado: string | null
          user_id: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_gasto?: string | null
          id?: number
          nome: string
          tipo: string
          tipo_especificado?: string | null
          user_id?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          data_gasto?: string | null
          id?: number
          nome?: string
          tipo?: string
          tipo_especificado?: string | null
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      lembretes_pagamento: {
        Row: {
          criado_em: string | null
          data_vencimento: string
          descricao: string | null
          id: number
          recorrente: boolean | null
          titulo: string
          user_id: string | null
          valor: number | null
        }
        Insert: {
          criado_em?: string | null
          data_vencimento: string
          descricao?: string | null
          id?: number
          recorrente?: boolean | null
          titulo: string
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          criado_em?: string | null
          data_vencimento?: string
          descricao?: string | null
          id?: number
          recorrente?: boolean | null
          titulo?: string
          user_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      metas: {
        Row: {
          created_at: string | null
          id: number
          periodo_referencia: string
          tipo: string
          user_id: string | null
          valor_limite: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          periodo_referencia: string
          tipo: string
          user_id?: string | null
          valor_limite: number
        }
        Update: {
          created_at?: string | null
          id?: number
          periodo_referencia?: string
          tipo?: string
          user_id?: string | null
          valor_limite?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          email_verificado: boolean | null
          especificar_tipo: boolean | null
          family_plan: string | null
          id: string
          last_reset_date: string | null
          nome: string | null
          on_tutorial: boolean | null
          plan: number | null
          reset_option: string | null
          senha: string | null
          telefone_whatsapp: string | null
          token_expira_em: string | null
          token_verificacao: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_verificado?: boolean | null
          especificar_tipo?: boolean | null
          family_plan?: string | null
          id: string
          last_reset_date?: string | null
          nome?: string | null
          on_tutorial?: boolean | null
          plan?: number | null
          reset_option?: string | null
          senha?: string | null
          telefone_whatsapp?: string | null
          token_expira_em?: string | null
          token_verificacao?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_verificado?: boolean | null
          especificar_tipo?: boolean | null
          family_plan?: string | null
          id?: string
          last_reset_date?: string | null
          nome?: string | null
          on_tutorial?: boolean | null
          plan?: number | null
          reset_option?: string | null
          senha?: string | null
          telefone_whatsapp?: string | null
          token_expira_em?: string | null
          token_verificacao?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_consistency_check: {
        Row: {
          auth_created_at: string | null
          email: string | null
          id: string | null
          public_created_at: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user_completely: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      tipo:
        | "Mercado"
        | "Transporte"
        | "Assinatura"
        | "Diversão"
        | "Comida"
        | "Educação"
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
      tipo: [
        "Mercado",
        "Transporte",
        "Assinatura",
        "Diversão",
        "Comida",
        "Educação",
      ],
    },
  },
} as const
