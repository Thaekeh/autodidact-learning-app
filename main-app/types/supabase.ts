export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flashcardLists: {
        Row: {
          created_at: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          user_id?: string | null
        }
      }
      texts: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
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
