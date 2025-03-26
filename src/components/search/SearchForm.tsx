import React, { useState } from 'react';
import { Search, Home, Car, Menu, X } from 'lucide-react';

interface SearchFormProps {
  postcode: string;
  service: string;
  searching: boolean;
  onPostcodeChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SearchForm({
  postcode,
  service,
  searching,
  onPostcodeChange,
  onServiceChange,
  onSubmit,
}: SearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-20 p-2 bg-white rounded-full shadow-md lg:hidden"
        aria-label={isExpanded ? 'Collapse search' : 'Expand search'}
      >
        {isExpanded ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Search Panel */}
      <div
        className={`fixed top-0 left-0 z-10 h-full transition-transform duration-300 lg:transition-none lg:transform-none lg:top-4 lg:left-4 lg:h-auto ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl w-80 h-full lg:h-auto">
          <div className="p-5">
            {/* Close button for mobile */}
            <div className="flex justify-end lg:hidden -mt-2 -mr-2 mb-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Enter your Postcode
                </label>
                <input
                  type="text"
                  placeholder="e.g., SW1A 1AA"
                  value={postcode}
                  onChange={(e) => onPostcodeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <div className="flex w-full">
                  <button
                    type="button"
                    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-l-md border ${
                      service === 'home' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } flex-1`}
                    onClick={() => onServiceChange('home')}
                  >
                    <Home className="w-4 h-4 mr-2" /> Home
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-r-md border ${
                      service === 'car' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } flex-1`}
                    onClick={() => onServiceChange('car')}
                  >
                    <Car className="w-4 h-4 mr-2" /> Vehicle
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  searching ? 'opacity-75' : ''
                }`}
                disabled={searching}
              >
                {!searching && <Search className="w-4 h-4 mr-2" />}
                {searching ? 'Searching...' : 'Find Locksmiths'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
