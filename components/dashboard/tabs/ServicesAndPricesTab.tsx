'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import {
  getServices,
  updateService,
  createService,
} from '@/lib/supabase/services';
import { toast } from 'sonner';
import { PoundSterling } from 'lucide-react';

const DEFAULT_SERVICES = [
  { name: 'Callout Fee', price: 0 },
  { name: 'Home Lockout', price: 0 },
  { name: 'Car Lockout', price: 0 },
  { name: 'Lock Change', price: 0 },
  { name: 'Lock Repair', price: 0 },
  { name: 'Key Cutting', price: 0 },
  { name: 'Safe Opening', price: 0 },
  { name: 'Security Survey', price: 0 },
];

export default function ServicesAndPricesTab() {
  const { profile, loading: profileLoading } = useProfile();
  const [services, setServices] = useState<
    Array<{
      id?: string;
      name: string;
      price: number;
      is_offered: boolean;
    }>
  >(DEFAULT_SERVICES.map((s) => ({ ...s, is_offered: true })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadServices() {
      if (!profile?.id) return;

      try {
        const data = await getServices(profile.id);
        if (data.length > 0) {
          setServices(data);
        } else {
          // Initialize default services
          const initialServices = await Promise.all(
            DEFAULT_SERVICES.map((service) =>
              createService({
                profile_id: profile.id,
                ...service,
                is_offered: true,
              })
            )
          );
          setServices(initialServices);
        }
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    }

    if (profile?.id) {
      loadServices();
    }
  }, [profile?.id]);

  const handleServiceToggle = async (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    try {
      const updatedService = await updateService(serviceId, {
        is_offered: !service.is_offered,
      });

      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? updatedService : s))
      );
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handlePriceChange = async (serviceId: string, price: string) => {
    try {
      const updatedService = await updateService(serviceId, {
        price: parseFloat(price) || 0,
      });

      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? updatedService : s))
      );
    } catch (error) {
      toast.error('Failed to update price');
    }
  };

  if (loading || profileLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <span>
          Set your service prices and toggle which services you offer.
        </span>
      </div>

      {services.map((service) => (
        <div key={service.id} className="flex items-center gap-4">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={service.is_offered}
              onChange={() => service.id && handleServiceToggle(service.id)}
            />
          </label>

          <span className="flex-1 font-medium">{service.name}</span>

          <div className="join">
            <span className="join-item flex items-center px-3 bg-base-200">
              <PoundSterling className="h-4 w-4" />
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={service.price}
              onChange={(e) =>
                service.id && handlePriceChange(service.id, e.target.value)
              }
              className="input input-bordered join-item w-24 text-right"
              placeholder="0.00"
              disabled={!service.is_offered}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
