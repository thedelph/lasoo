/**
 * @file LocksmithDetails.tsx
 * @description Component that displays detailed information about a locksmith/tradesperson
 * shown when a user clicks on a map marker or search result
 */

import { Phone, Globe, Home, Car, ArrowLeft } from 'lucide-react'
import type { Locksmith } from '../../types/locksmith'
import LiveIndicator from '../ui/LiveIndicator'
import VanIcon3D from '../map/SimplifiedVanIcon3D'
import ShopIcon3D from '../map/SimplifiedShopIcon3D'

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
        <h2 className="text-2xl font-bold mb-1">
          {locksmith.companyName}
        </h2>


        <div className="flex flex-col gap-2 mb-3">
          {/* Location Information with icons */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Location Information</h3>
            
            {/* Live Location Info - shown only if actively displaying live location */}
            {locksmith.isDisplayingLive && (
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  <VanIcon3D className="w-6 h-6" animate={false} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{locksmith.isDisplayingLive ? 'Current Location' : 'Last Known Live Location'}</span>
                    {/* LiveIndicator will only be shown if isDisplayingLive or liveLocationUpdatedAt is true due to parent conditional */}
                    {(() => {
                      if (locksmith.isDisplayingLive) {
                        return <LiveIndicator status="live" />;
                      } else if (locksmith.liveLocationUpdatedAt) {
                        const lastUpdateDate = new Date(locksmith.liveLocationUpdatedAt);
                        const today = new Date();
                        let formattedLastUpdate: string;
                        const lastUpdateDayStart = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate()).getTime();
                        const todayDayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                        const yesterdayDayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).getTime();

                        if (lastUpdateDayStart === todayDayStart) {
                          formattedLastUpdate = lastUpdateDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                        } else if (lastUpdateDayStart === yesterdayDayStart) {
                          formattedLastUpdate = 'Yesterday';
                        } else {
                          const diffDays = Math.floor((todayDayStart - lastUpdateDayStart) / (1000 * 60 * 60 * 24));
                          if (diffDays < 7) {
                            formattedLastUpdate = lastUpdateDate.toLocaleDateString([], { weekday: 'short' });
                          } else {
                            formattedLastUpdate = lastUpdateDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
                          }
                        }
                        return <LiveIndicator status="last_live" lastLiveTimestamp={formattedLastUpdate.toUpperCase()} />;
                      }
                      return null;
                    })()}
                  </div>
                  {/* Details relevant if displaying live location */}
                  {locksmith.isDisplayingLive && (
                    <>
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
                    </>
                  )}
                  {/* The 'Last update:' text is now part of the LiveIndicator when status is 'last_live' */}
                </div>
              </div>
            )}
            
            {/* HQ Location - from the company postcode */}
            {locksmith.hqPostcode && (
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-0.5">
                  <ShopIcon3D className="w-6 h-6" />
                </div>
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
        {/* Call Now button - full width on mobile */}
        {locksmith.telephoneNumber && (
          <div className="flex justify-center px-2">
            <a 
              href={`tel:${locksmith.telephoneNumber}`}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-base"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          </div>
        )}
        
        {/* Website button - shown below Call Now button */}
        {locksmith.website && (
          <div className="flex justify-center">
            <a 
              href={locksmith.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
            </a>
          </div>
        )}
 



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