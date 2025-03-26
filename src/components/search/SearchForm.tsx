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
        className="fixed top-4 left-4 z-20 btn btn-circle lg:hidden"
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
        <div className="card bg-base-100 shadow-xl w-80 h-full lg:h-auto">
          <div className="card-body">
            {/* Close button for mobile */}
            <div className="flex justify-end lg:hidden -mt-2 -mr-2 mb-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Enter your Postcode</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., SW1A 1AA"
                  value={postcode}
                  onChange={(e) => onPostcodeChange(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Type</span>
                </label>
                <div className="join w-full">
                  <button
                    type="button"
                    className={`join-item btn flex-1 ${
                      service === 'home' ? 'btn-primary' : 'btn-ghost'
                    }`}
                    onClick={() => onServiceChange('home')}
                  >
                    <Home className="w-4 h-4 mr-2" /> Home
                  </button>
                  <button
                    type="button"
                    className={`join-item btn flex-1 ${
                      service === 'car' ? 'btn-primary' : 'btn-ghost'
                    }`}
                    onClick={() => onServiceChange('car')}
                  >
                    <Car className="w-4 h-4 mr-2" /> Vehicle
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full ${searching ? 'loading' : ''}`}
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
