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
      profiles: {
        Row: {
          id: string
          company_name: string | null
          telephone_number: string | null
          website: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          county: string | null
          postcode: string | null
          country: string
          service_radius: number
          share_location: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          company_name?: string | null
          telephone_number?: string | null
          website?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          county?: string | null
          postcode?: string | null
          country?: string
          service_radius?: number
          share_location?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string | null
          telephone_number?: string | null
          website?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          county?: string | null
          postcode?: string | null
          country?: string
          service_radius?: number
          share_location?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      services: {
        Row: {
          id: string
          profile_id: string
          service_name: string
          price: number | null
          is_offered: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          service_name: string
          price?: number | null
          is_offered?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          service_name?: string
          price?: number | null
          is_offered?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      working_hours: {
        Row: {
          id: string
          profile_id: string
          day_of_week: string
          start_time: string | null
          end_time: string | null
          is_closed: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          profile_id: string
          day_of_week: string
          start_time?: string | null
          end_time?: string | null
          is_closed?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile_id?: string
          day_of_week?: string
          start_time?: string | null
          end_time?: string | null
          is_closed?: boolean
          created_at?: string
          updated_at?: string | null
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
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type WorkingHours = Database['public']['Tables']['working_hours']['Row']