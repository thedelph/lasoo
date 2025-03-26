import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import type { Locksmith } from '@/types/locksmith';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const latitude1 = Number(lat1);
  const longitude1 = Number(lon1);
  const latitude2 = Number(lat2);
  const longitude2 = Number(lon2);

  console.log('---------- DISTANCE CHECK ----------');
  console.log(`Search Location: ${latitude1}, ${longitude1}`);
  console.log(`Locksmith Location: ${latitude2}, ${longitude2}`);

  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude2 - latitude1) * Math.PI / 180;
  const dLon = (longitude2 - longitude1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  console.log(`Calculated Distance: ${distance.toFixed(2)}km`);
  console.log('-----------------------------------');

  return distance;
}

export function useLocksmiths() {
  const [loading, setLoading] = useState(false);

  const findNearby = async (
    latitude: number,
    longitude: number,
    radiusKm: number = 25,
    serviceType?: string
  ): Promise<Locksmith[]> => {
    setLoading(true);
    
    try {
      console.log('Fetching profiles from Supabase...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          company_name,
          telephone_number,
          website,
          service_radius,
          latitude,
          longitude,
          share_location,
          postcode,
          services (
            service_name,
            is_offered
          )
        `);

      if (error) {
        console.error('Database Error:', error);
        throw error;
      }

      console.log('Raw Supabase response:', profiles);

      const inRangeProfiles = profiles?.filter(profile => {
        console.log('\nChecking profile:', {
          id: profile.id,
          company_name: profile.company_name,
          share_location: profile.share_location,
          coords: `${profile.latitude}, ${profile.longitude}`,
          radius: profile.service_radius
        });
        
        if (!profile.share_location) {
          console.log('-> Filtered out: Location sharing disabled');
          return false;
        }

        if (!profile.latitude || !profile.longitude) {
          console.log('-> Filtered out: Missing coordinates');
          return false;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          Number(profile.latitude),
          Number(profile.longitude)
        );

        const isInRange = distance <= Number(profile.service_radius);
        console.log('-> Distance check:', {
          calculated: distance.toFixed(2) + 'km',
          serviceRadius: profile.service_radius + 'km',
          inRange: isInRange
        });

        return isInRange;
      }) || [];

      const mappedResults = inRangeProfiles.map(profile => {
        console.log('\nMapping profile:', {
          id: profile.id,
          company_name: profile.company_name,
          raw_profile: profile
        });

        const result = {
          id: profile.id,
          companyName: profile.company_name || 'Unknown Company',
          telephoneNumber: profile.telephone_number || '',
          website: profile.website || undefined,
          servicesOffered: profile.services
            ?.filter(s => s.is_offered)
            .map(s => s.service_name.toLowerCase()) || [],
          latitude: Number(profile.latitude),
          longitude: Number(profile.longitude),
          serviceRadius: Number(profile.service_radius),
          distance: calculateDistance(
            latitude,
            longitude,
            Number(profile.latitude),
            Number(profile.longitude)
          ),
          eta: Math.round(calculateDistance(
            latitude,
            longitude,
            Number(profile.latitude),
            Number(profile.longitude)
          ) * 2 + 10)
        };

        console.log('Mapped to:', result);
        return result;
      });

      console.log('\nFinal results:', mappedResults);
      return mappedResults;

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { findNearby, loading };
}