/**
 * @file locksmith.ts
 * @description Type definitions for locksmith data used throughout the application
 */

/**
 * Represents a geographical location associated with a locksmith
 * May be either current location (from locations table) or HQ location (from company_postcode)
 */
export interface Location {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Whether this is current location (true) or HQ location (false) */
  isCurrentLocation: boolean;
  /** Timestamp of when the location was last updated (ISO string), primarily for live locations */
  date_updated?: string;
}

/**
 * Core data type representing a locksmith/tradesperson with business and location information
 * Created by combining data from users and locations tables
 */
export interface Locksmith {
  /** Unique identifier (converted from database ID) */
  id: string;
  /** Business or company name */
  companyName: string;
  /** Contact phone number */
  telephoneNumber: string;
  /** Optional website URL */
  website?: string;
  /** Types of services offered (e.g., ["Locksmith", "home"]) */
  servicesOffered: string[];
  
  /** Primary latitude for map positioning (typically current location) */
  latitude: number;
  /** Primary longitude for map positioning (typically current location) */
  longitude: number;
  
  /** All locations associated with this locksmith (current + HQ) */
  locations: Location[];
  
  /** Distance in kilometers from search location to service reference point (HQ) */
  distance: number;
  
  /** Estimated arrival time in minutes (calculated from distance) */
  eta?: number;
  
  /** Service radius in kilometers (max distance they're willing to travel) */
  serviceRadius: number;
  
  /** Original postcode of company headquarters */
  hqPostcode?: string;

  /** Actual latitude of the live location, if available and recent */
  liveLatitude?: number;
  /** Actual longitude of the live location, if available and recent */
  liveLongitude?: number;
  /** Timestamp (ISO string) of the last live location update from the database */
  liveLocationUpdatedAt?: string;
  /** User-facing status of the location (e.g., 'Live @ 10:30 AM', 'Using HQ (Live > 15m ago)') */
  locationStatus?: string;
  /** True if the primary latitude/longitude are from a recent live location, false if HQ or stale live. */
  isDisplayingLive: boolean;
}