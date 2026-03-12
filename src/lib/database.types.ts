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
      clerks: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          telegram_id: string | null
          telegram_username: string | null
          registration_token: string | null
          status: string | null
          invited_date: string | null
          registered_date: string | null
          training_complete: boolean | null
          telegram_access: boolean | null
          total_questions: number | null
          last_active: string | null
          created_at: string | null
          location: string | null
        }
        Insert: Omit<{
          id: string
          full_name: string
          email: string
          phone: string | null
          telegram_id: string | null
          telegram_username: string | null
          registration_token: string | null
          status: string | null
          invited_date: string | null
          registered_date: string | null
          training_complete: boolean | null
          telegram_access: boolean | null
          total_questions: number | null
          last_active: string | null
          created_at: string | null
          location: string | null
        }, 'id' | 'created_at'>
        Update: Partial<Omit<{
          id: string
          full_name: string
          email: string
          phone: string | null
          telegram_id: string | null
          telegram_username: string | null
          registration_token: string | null
          status: string | null
          invited_date: string | null
          registered_date: string | null
          training_complete: boolean | null
          telegram_access: boolean | null
          total_questions: number | null
          last_active: string | null
          created_at: string | null
          location: string | null
        }, 'id' | 'created_at'>>
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          file_name: string
          client_name: string
          uploaded_by: string
          category: string
          drive_link: string | null
          source: string | null
          ingested_at: string
        }
        Insert: Omit<{
          id: string
          file_name: string
          client_name: string
          uploaded_by: string
          category: string
          drive_link: string | null
          source: string | null
          ingested_at: string
        }, 'id'>
        Update: Partial<Omit<{
          id: string
          file_name: string
          client_name: string
          uploaded_by: string
          category: string
          drive_link: string | null
          source: string | null
          ingested_at: string
        }, 'id'>>
        Relationships: []
      }
      chunks: {
        Row: {
          id: string
          doc_id: string | null
          file_name: string | null
          content: string
          chunk_index: number
        }
        Insert: Omit<{
          id: string
          doc_id: string | null
          file_name: string | null
          content: string
          chunk_index: number
        }, 'id'>
        Update: Partial<Omit<{
          id: string
          doc_id: string | null
          file_name: string | null
          content: string
          chunk_index: number
        }, 'id'>>
        Relationships: []
      }
      unanswered_queries: {
        Row: {
          id: string
          question: string
          asked_by: string
          asked_at: string
          status: string
          resolution: string | null
        }
        Insert: Omit<{
          id: string
          question: string
          asked_by: string
          asked_at: string
          status: string
          resolution: string | null
        }, 'id' | 'asked_at' | 'status'>
        Update: Partial<Omit<{
          id: string
          question: string
          asked_by: string
          asked_at: string
          status: string
          resolution: string | null
        }, 'id' | 'asked_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
