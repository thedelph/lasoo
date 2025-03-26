import { Phone, Globe, Home, Car, ArrowLeft, Clock, MapPin } from 'lucide-react'
import type { Locksmith } from '../../types/locksmith'

interface LocksmithDetailsProps {
  locksmith: Locksmith
  onBack: () => void
}

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
        {locksmith.eta !== undefined && (
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>ETA: {locksmith.eta} min</span>
          </div>
        )}
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

        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Service radius: {locksmith.serviceRadius}km</span>
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