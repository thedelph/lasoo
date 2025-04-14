/**
 * Represents a user record from the users table in the database
 */
export interface User {
  id: number;                // Database primary key
  user_id: string;           // Unique user identifier (from Clerk)
  fullname: string;          // Full name of the user
  phone: string;             // Contact phone number
  email: string;             // Contact email address
  is_authorized: number;     // Authorization status (1=true, 0=false)
  is_activated: number;      // Activation status (1=true, 0=false)
  created_at: string;        // Creation timestamp
  subscription_start_date?: string | null; // Start date of subscription
  subscription_end_date?: string | null;   // End date of subscription
  company_name: string | null; // Company or business name
  subscription_status?: string | null;      // Status of subscription
  service_type: string;      // Type of service provided (e.g., "Locksmith")
  company_postcode: string;  // HQ/business location postcode
  service_radius?: number;   // Service radius in kilometers
  share_location?: boolean;  // Whether to share current location
}
