"use client";

import { supabase } from './client';
import type { Locksmith } from '@/types/locksmith';

export async function findNearbyLocksmiths(latitude: number, longitude: number, radiusKm: number): Promise<Locksmith[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        company_name,
        telephone_number,
        website,
        service_radius,
        latitude,
        longitude,
        services (
          service_name,
          is_offered
        )
      `)
      .eq('share_location', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) throw error;

    // Filter locksmiths within radius and format response
    return data
      .filter(profile => {
        const distance = calculateDistance(
          latitude,
          longitude,
          profile.latitude,
          profile.longitude
        );
        return distance <= (profile.service_radius || radiusKm);
      })
      .map(profile => ({
        id: profile.id,
        companyName: profile.company_name || '',
        telephoneNumber: profile.telephone_number || '',
        website: profile.website || undefined,
        servicesOffered: profile.services
          ?.filter(s => s.is_offered)
          .map(s => s.service_name) || [],
        latitude: profile.latitude,
        longitude: profile.longitude,
        serviceRadius: profile.service_radius || radiusKm
      }));
  } catch (error) {
    console.error('Error finding nearby locksmiths:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}