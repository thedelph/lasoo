'use client';

import React from 'react';
import { Search, Home, Car } from 'lucide-react';

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
  return (
    <div className="card bg-base-100 shadow-xl w-80">
      <div className="card-body">
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
  );
}
