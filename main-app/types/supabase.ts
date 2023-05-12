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
          id: string
          last_updated: string | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          user_id?: string | null
        }
      }
      flashcards: {
        Row: {
          backText: string | null
          created_at: string | null
          ease_factor: number
          frontText: string | null
          id: string
          interval: number
          list_id: string
          next_practice_date: string | null
          repetitions: number
          user_id: string
        }
        Insert: {
          backText?: string | null
          created_at?: string | null
          ease_factor?: number
          frontText?: string | null
          id?: string
          interval?: number
          list_id: string
          next_practice_date?: string | null
          repetitions?: number
          user_id: string
        }
        Update: {
          backText?: string | null
          created_at?: string | null
          ease_factor?: number
          frontText?: string | null
          id?: string
          interval?: number
          list_id?: string
          next_practice_date?: string | null
          repetitions?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          last_updated: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_updated?: string | null
          name?: string | null
          user_id?: string | null
        }
      }
      texts: {
        Row: {
          content: string | null
          created_at: string | null
          epub_file: string | null
          id: string
          last_updated: string | null
          name: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          epub_file?: string | null
          id?: string
          last_updated?: string | null
          name?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          epub_file?: string | null
          id?: string
          last_updated?: string | null
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
