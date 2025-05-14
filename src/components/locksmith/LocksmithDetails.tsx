/**
 * @file LocksmithDetails.tsx
 * @description Component that displays detailed information about a locksmith/tradesperson
 * shown when a user clicks on a map marker or search result
 */

import { Phone, Globe, Home, Car, ArrowLeft, Navigation } from 'lucide-react'
import type { Locksmith } from '../../types/locksmith'

/**
 * Props for the LocksmithDetails component
 */
interface LocksmithDetailsProps {
  /** The locksmith/tradesperson to display details for */
  locksmith: Locksmith
  /** Callback function for the back button */
  onBack: () => void
}

/**
 * Component that displays detailed information about a selected locksmith/tradesperson
 * Including contact information, distance from search location, and services offered.
 * 
 * Key features:
 * - Distance from search location to HQ (measured from company postcode location)
 * - ETA based on that distance
 * - Contact options (phone call)
 * - Services offered
 * - Service radius/coverage area
 * 
 * @param props - Component props (see LocksmithDetailsProps)
 * @returns React component
 */
export default function LocksmithDetails({ locksmith, onBack }: LocksmithDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to results
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">
          {locksmith.companyName}
        </h2>

        <div className="flex flex-col gap-2 mb-3">
          {/* Location Information with icons */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Location Information</h3>
            
            {/* Current Location - if the locksmith is sharing their current position */}
            {locksmith.locations?.some(loc => loc.isCurrentLocation) && (
              <div className="flex items-start mb-2">
                <Navigation className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Current Location</div>
                  <div className="text-gray-500 text-sm">
                    {typeof locksmith.distance === 'number'
                      ? `${locksmith.distance.toFixed(1)} km from your search location`
                      : 'Distance unknown'}
                  </div>
                  {locksmith.eta !== undefined && (
                    <div className="text-gray-500 text-sm">
                      Estimated arrival time: {locksmith.eta} min
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* HQ Location - from the company postcode */}
            {locksmith.hqPostcode && (
              <div className="flex items-start">
                <Home className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Headquarters</div>
                  <div className="text-gray-500 text-sm">
                    {locksmith.hqPostcode}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Service radius: {locksmith.serviceRadius} km
                    <span className="text-xs italic ml-1">(measured from HQ location)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {locksmith.telephoneNumber && (
            <a 
              href={`tel:${locksmith.telephoneNumber}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          )}
          
          {locksmith.website && (
            <a 
              href={locksmith.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
            </a>
          )}
        </div>



        <div>
          <h3 className="font-bold mb-2">Services Offered:</h3>
          <div className="flex gap-2">
            {locksmith.servicesOffered.includes('home') && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                <Home className="w-3 h-3 mr-1" />
                Home
              </div>
            )}
            {locksmith.servicesOffered.includes('car') && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                <Car className="w-3 h-3 mr-1" />
                Vehicle
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}