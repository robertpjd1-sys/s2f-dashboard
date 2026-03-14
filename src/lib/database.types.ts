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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chunks: {
        Row: {
          category: string | null
          chunk_index: number
          client_name: string | null
          content: string
          doc_id: string | null
          embedding: string
          file_name: string | null
          id: string
          ingested_at: string | null
          metadata: Json | null
          source: string | null
        }
        Insert: {
          category?: string | null
          chunk_index?: number
          client_name?: string | null
          content: string
          doc_id?: string | null
          embedding: string
          file_name?: string | null
          id?: string
          ingested_at?: string | null
          metadata?: Json | null
          source?: string | null
        }
        Update: {
          category?: string | null
          chunk_index?: number
          client_name?: string | null
          content?: string
          doc_id?: string | null
          embedding?: string
          file_name?: string | null
          id?: string
          ingested_at?: string | null
          metadata?: Json | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chunks_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      clerks: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          invited_date: string | null
          last_active: string | null
          location: string | null
          phone: string | null
          registered_date: string | null
          registration_token: string | null
          status: string | null
          telegram_access: boolean | null
          telegram_id: string | null
          telegram_username: string | null
          total_questions: number | null
          training_complete: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          invited_date?: string | null
          last_active?: string | null
          location?: string | null
          phone?: string | null
          registered_date?: string | null
          registration_token?: string | null
          status?: string | null
          telegram_access?: boolean | null
          telegram_id?: string | null
          telegram_username?: string | null
          total_questions?: number | null
          training_complete?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          invited_date?: string | null
          last_active?: string | null
          location?: string | null
          phone?: string | null
          registered_date?: string | null
          registration_token?: string | null
          status?: string | null
          telegram_access?: boolean | null
          telegram_id?: string | null
          telegram_username?: string | null
          total_questions?: number | null
          training_complete?: boolean | null
        }
        Relationships: []
      }
      compliance_notifications: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          clerk_id: string | null
          clerk_name: string | null
          created_at: string | null
          id: string
          notified_at: string | null
          run_date: string | null
          urgency: string | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          clerk_id?: string | null
          clerk_name?: string | null
          created_at?: string | null
          id?: string
          notified_at?: string | null
          run_date?: string | null
          urgency?: string | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          clerk_id?: string | null
          clerk_name?: string | null
          created_at?: string | null
          id?: string
          notified_at?: string | null
          run_date?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_notifications_clerk_id_fkey"
            columns: ["clerk_id"]
            isOneToOne: false
            referencedRelation: "clerks"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_updates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          chunk_text: string | null
          clerks_notified: boolean | null
          created_at: string | null
          id: string
          overall_urgency: string | null
          raw_perplexity_response: string | null
          run_date: string
          simplified_updates: Json | null
          status: string | null
          telegram_message: string | null
          title: string | null
          updates_count: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          chunk_text?: string | null
          clerks_notified?: boolean | null
          created_at?: string | null
          id?: string
          overall_urgency?: string | null
          raw_perplexity_response?: string | null
          run_date: string
          simplified_updates?: Json | null
          status?: string | null
          telegram_message?: string | null
          title?: string | null
          updates_count?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          chunk_text?: string | null
          clerks_notified?: boolean | null
          created_at?: string | null
          id?: string
          overall_urgency?: string | null
          raw_perplexity_response?: string | null
          run_date?: string
          simplified_updates?: Json | null
          status?: string | null
          telegram_message?: string | null
          title?: string | null
          updates_count?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          client_name: string
          drive_link: string | null
          file_name: string
          id: string
          ingested_at: string
          source: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string
          client_name?: string
          drive_link?: string | null
          file_name: string
          id: string
          ingested_at?: string
          source?: string | null
          uploaded_by?: string
        }
        Update: {
          category?: string
          client_name?: string
          drive_link?: string | null
          file_name?: string
          id?: string
          ingested_at?: string
          source?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      kb_documents: {
        Row: {
          created_at: string
          file_path: string | null
          file_size: number | null
          filename: string | null
          id: number
          uploaded_at: string | null
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          filename?: string | null
          id?: number
          uploaded_at?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          filename?: string | null
          id?: number
          uploaded_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          read_at: string | null
          source: string | null
          title: string
          type: string | null
          urgency: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          source?: string | null
          title: string
          type?: string | null
          urgency?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          source?: string | null
          title?: string
          type?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      unanswered_queries: {
        Row: {
          ai_draft: string | null
          asked_at: string
          asked_by: string
          chat_id: number | null
          id: string
          question: string
          resolution: string | null
          status: string
        }
        Insert: {
          ai_draft?: string | null
          asked_at?: string
          asked_by: string
          chat_id?: number | null
          id?: string
          question: string
          resolution?: string | null
          status?: string
        }
        Update: {
          ai_draft?: string | null
          asked_at?: string
          asked_by?: string
          chat_id?: number | null
          id?: string
          question?: string
          resolution?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_chunks: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          category: string
          client_name: string
          content: string
          doc_id: string
          file_name: string
          id: string
          ingested_at: string
          similarity: number
          source: string
        }[]
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
