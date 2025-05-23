/**
 * Special case handling for specific tradespeople
 */

import type { Locksmith } from '../../../types/locksmith';
import { LocationData } from './mapHelpers';

/**
 * Process special case handling for any tradesperson that needs it
 */
export function processSpecialCases(
  _locksmith: Locksmith, // Prefixed with _ to indicate intentionally unused parameter
  hqLocation: LocationData | undefined,
  currentLocation: LocationData | undefined
): { hqLocation: LocationData | undefined; currentLocation: LocationData | undefined } {
  // Add special cases here as needed
  
  // Return original values if no special case applies
  return { hqLocation, currentLocation };
}
