'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface NoResultsProps {
  onReset: () => void;
}

export default function NoResults({ onReset }: NoResultsProps) {
  return (
    <div className="text-center py-6">
      <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-base-content/60" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Locksmiths Found</h3>
      <p className="text-base-content/80 mb-4">
        Sorry, we couldn't find any locksmiths that currently service your area.
        Try searching a different postcode or changing the service type.
      </p>
      <button className="btn btn-primary" onClick={onReset}>
        New Search
      </button>
    </div>
  );
}
