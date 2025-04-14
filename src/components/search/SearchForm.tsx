import React, { useState } from 'react';
import { Home, Car, Menu, X } from 'lucide-react';

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
  // Default to collapsed state on mobile since postcode is pre-filled from landing page
  const [isExpanded, setIsExpanded] = useState(false);

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

            <form className="space-y-4">
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
                  Search For
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center px-4 py-2 border-2 border-blue-500 text-sm font-medium rounded-md shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      searching ? 'opacity-75' : ''
                    }`}
                    disabled={searching}
                    onClick={(e) => {
                      onServiceChange('vehicle');
                      onSubmit(e);
                    }}
                  >
                    {searching && service === 'vehicle' ? (
                      'Searching...'
                    ) : (
                      <>
                        <Car className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span>View Vehicle Locksmiths</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center px-4 py-2 border-2 border-green-500 text-sm font-medium rounded-md shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      searching ? 'opacity-75' : ''
                    }`}
                    disabled={searching}
                    onClick={(e) => {
                      onServiceChange('home');
                      onSubmit(e);
                    }}
                  >
                    {searching && service === 'home' ? (
                      'Searching...'
                    ) : (
                      <>
                        <Home className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span>View Home Locksmiths</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
