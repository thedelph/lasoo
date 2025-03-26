import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  console.group('Distance Calculation');
  try {
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    // Earth's radius in kilometers
    const R = 6371;
    
    // Calculate the distance
    const distance = R * c;
    
    console.log('Distance calculation:', {
      from: { lat: lat1.toFixed(6), lon: lon1.toFixed(6) },
      to: { lat: lat2.toFixed(6), lon: lon2.toFixed(6) },
      distance: distance.toFixed(2) + ' km'
    });

    return distance;
  } finally {
    console.groupEnd();
  }
}