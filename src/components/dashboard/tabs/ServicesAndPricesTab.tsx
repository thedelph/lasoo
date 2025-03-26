import { useState } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { PoundSterling } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_SERVICES = [
  { name: "Callout Fee", price: 0 },
  { name: "Home Lockout", price: 0 },
  { name: "Car Lockout", price: 0 },
  { name: "Lock Change", price: 0 },
  { name: "Lock Repair", price: 0 },
  { name: "Key Cutting", price: 0 },
  { name: "Safe Opening", price: 0 },
  { name: "Security Survey", price: 0 }
];

interface Service {
  id?: string;
  name: string;
  price: number;
  is_offered: boolean;
}

export default function ServicesAndPricesTab() {
  const { loading } = useProfile();
  const [services, setServices] = useState<Service[]>(
    DEFAULT_SERVICES.map(s => ({ ...s, is_offered: true }))
  );
  const [saving, setSaving] = useState(false);

  const handleServiceToggle = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      setSaving(true);
      const updatedServices = services.map(s => 
        s.id === serviceId ? { ...s, is_offered: !s.is_offered } : s
      );
      setServices(updatedServices);
      toast.success("Service updated successfully");
    } catch (error) {
      toast.error("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  const handlePriceChange = async (serviceId: string, price: string) => {
    try {
      setSaving(true);
      const updatedServices = services.map(s =>
        s.id === serviceId ? { ...s, price: parseFloat(price) || 0 } : s
      );
      setServices(updatedServices);
      toast.success("Price updated successfully");
    } catch (error) {
      toast.error("Failed to update price");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <span>Set your service prices and toggle which services you offer.</span>
      </div>

      {services.map((service) => (
        <div key={service.id || service.name} className="flex items-center gap-4">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={service.is_offered}
              onChange={() => service.id && handleServiceToggle(service.id)}
              disabled={saving}
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
              onChange={(e) => service.id && handlePriceChange(service.id, e.target.value)}
              className="input input-bordered join-item w-24 text-right"
              placeholder="0.00"
              disabled={!service.is_offered || saving}
            />
          </div>
        </div>
      ))}
    </div>
  );
}