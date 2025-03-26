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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}