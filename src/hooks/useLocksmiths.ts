import { useState } from 'react';
import { supabase } from '../utils/supabase';
import type { Locksmith } from '../types/locksmith';
import { calculateDistance } from '../lib/utils';

export function useLocksmiths() {
  const [loading, setLoading] = useState(false);

  const findNearby = async (
    latitude: number,
    longitude: number,
    radiusKm: number = 25,
    serviceType?: string
  ): Promise<Locksmith[]> => {
    setLoading(true);
    console.group('🔍 Locksmith Search');
    
    try {
      console.log('Search Parameters:', {
        searchLocation: { latitude, longitude },
        radiusKm,
        serviceType: serviceType || 'any'
      });

      // Query profiles without services join
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('share_location', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }

      console.log(`Found ${profiles?.length || 0} active profiles`);

      // Filter profiles within radius
      const inRangeProfiles = profiles?.filter(profile => {
        if (!profile.latitude || !profile.longitude) {
          console.log(`Skipping ${profile.company_name}: Missing coordinates`);
          return false;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          Number(profile.latitude),
          Number(profile.longitude)
        );

        // Check if the search location is within the locksmith's service radius
        const inRange = distance <= (profile.service_radius || radiusKm);
        console.log(`${profile.company_name}: ${distance.toFixed(2)}km - ${inRange ? 'IN RANGE' : 'OUT OF RANGE'}`);
        
        return inRange;
      }) || [];

      // Map to Locksmith type
      const locksmiths: Locksmith[] = inRangeProfiles.map(profile => {
        const distance = calculateDistance(
          latitude,
          longitude,
          Number(profile.latitude),
          Number(profile.longitude)
        );

        return {
          id: profile.id,
          companyName: profile.company_name || 'Unknown Company',
          telephoneNumber: profile.telephone_number || '',
          website: profile.website || undefined,
          servicesOffered: [], // We'll fetch services separately if needed
          latitude: Number(profile.latitude),
          longitude: Number(profile.longitude),
          serviceRadius: profile.service_radius || radiusKm,
          eta: Math.round(distance * 2 + 10)
        };
      });

      console.log(`Returning ${locksmiths.length} locksmiths`);
      return locksmiths;

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  return { findNearby, loading };
}