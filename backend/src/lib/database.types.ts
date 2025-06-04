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
      work_orders: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string | null
          created_by: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          location: string | null
          estimated_hours: number | null
          actual_hours: number | null
          cost_estimate: number | null
          final_cost: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          location?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          cost_estimate?: number | null
          final_cost?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          location?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          cost_estimate?: number | null
          final_cost?: number | null
          notes?: string | null
        }
      }
      work_order_attachments: {
        Row: {
          id: string
          work_order_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          work_order_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          work_order_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          mime_type?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      work_order_comments: {
        Row: {
          id: string
          work_order_id: string
          comment: string
          created_by: string
          created_at: string
          is_internal: boolean
        }
        Insert: {
          id?: string
          work_order_id: string
          comment: string
          created_by: string
          created_at?: string
          is_internal?: boolean
        }
        Update: {
          id?: string
          work_order_id?: string
          comment?: string
          created_by?: string
          created_at?: string
          is_internal?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'manager' | 'technician' | 'customer'
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'technician' | 'customer'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'technician' | 'customer'
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
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
      work_order_status: 'open' | 'in_progress' | 'completed' | 'cancelled'
      work_order_priority: 'low' | 'medium' | 'high' | 'urgent'
      user_role: 'admin' | 'manager' | 'technician' | 'customer'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}