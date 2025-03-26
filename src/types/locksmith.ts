export interface Locksmith {
  id: string;
  companyName: string;
  telephoneNumber: string;
  website?: string;
  servicesOffered: string[];
  latitude: number;
  longitude: number;
  eta?: number;
  serviceRadius: number;
}