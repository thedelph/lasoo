'use client';

import React from 'react';
import {
  Phone,
  Globe,
  Home,
  Car,
  ArrowLeft,
  Clock,
  MapPin,
} from 'lucide-react';
import { Locksmith } from '@/types/locksmith';

interface LocksmithDetailsProps {
  locksmith: Locksmith;
  onBack: () => void;
}

export default function LocksmithDetails({
  locksmith,
  onBack,
}: LocksmithDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to results
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">
          {locksmith.companyName || 'Unknown Company'}
        </h2>
        {locksmith.eta !== undefined && (
          <div className="flex items-center text-base-content/60">
            <Clock className="w-4 h-4 mr-1" />
            <span>ETA: {locksmith.eta} min</span>
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {locksmith.telephoneNumber && (
            <a
              href={`tel:${locksmith.telephoneNumber}`}
              className="btn btn-primary"
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
              className="btn btn-ghost"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit Website
            </a>
          )}
        </div>

        <div className="flex items-center text-base-content/60">
          <MapPin className="w-4 h-4 mr-2" />
          <span>Service radius: {locksmith.serviceRadius}km</span>
        </div>

        <div>
          <h3 className="font-bold mb-2">Services Offered:</h3>
          <div className="flex gap-2">
            {locksmith.servicesOffered.includes('home') && (
              <div className="badge badge-outline gap-1">
                <Home className="w-3 h-3" />
                Home
              </div>
            )}
            {locksmith.servicesOffered.includes('car') && (
              <div className="badge badge-outline gap-1">
                <Car className="w-3 h-3" />
                Vehicle
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
