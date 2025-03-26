export interface Profile {
  id: string;
  company_name: string | null;
  telephone_number: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string;
  service_radius: number;
  share_location: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string | null;
}