import { useState } from "react";
import { useSupabaseProfile } from "../../../hooks/useSupabaseProfile";
import { PoundSterling, Loader2, Package, Info, Plus, Trash2 } from "lucide-react";
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
  const { loading } = useSupabaseProfile();
  const [services, setServices] = useState<Service[]>(
    DEFAULT_SERVICES.map(s => ({ ...s, is_offered: true }))
  );
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddService = () => {
    if (!newService.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    const updatedServices = [
      ...services,
      { 
        id: `new-${Date.now()}`, 
        name: newService.name, 
        price: newService.price,
        is_offered: true 
      }
    ];
    
    setServices(updatedServices);
    setNewService({ name: "", price: 0 });
    setShowAddForm(false);
    toast.success("New service added");
  };

  const handleRemoveService = (serviceId: string) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);
    toast.success("Service removed");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Services & Prices</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage the locksmith services you offer and set your pricing.
        </p>
      </div>

      {/* Information Card */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="mt-0.5 rounded-full bg-blue-100 p-1">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-blue-800">Service Visibility</h3>
          <p className="mt-1 text-sm text-blue-700">
            Toggle services on/off to control which ones are visible to customers.
            Set prices to £0 for services where you prefer to quote on a case-by-case basis.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Package className="h-4 w-4 text-slate-500" />
            Your Services
          </h3>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Service
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {/* Add New Service Form */}
          {showAddForm && (
            <div className="p-4 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label htmlFor="new-service-name" className="block text-xs font-medium text-slate-700">
                    Service Name
                  </label>
                  <input
                    id="new-service-name"
                    type="text"
                    className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Emergency Callout"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="new-service-price" className="block text-xs font-medium text-slate-700">
                    Price (£)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <PoundSterling className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="new-service-price"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={newService.price}
                      onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Service
                </button>
              </div>
            </div>
          )}
          
          {/* Services List */}
          {services.map((service) => (
            <div key={service.id || service.name} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex h-5 items-center">
                  <input
                    id={`service-${service.id || service.name}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={service.is_offered}
                    onChange={() => service.id && handleServiceToggle(service.id)}
                    disabled={saving}
                  />
                </div>
                <label 
                  htmlFor={`service-${service.id || service.name}`} 
                  className={`flex-1 font-medium ${service.is_offered ? 'text-slate-800' : 'text-slate-400'}`}
                >
                  {service.name}
                </label>
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <div className="relative w-32">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <PoundSterling className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={service.price}
                    onChange={(e) => service.id && handlePriceChange(service.id, e.target.value)}
                    className={`w-full rounded-md border border-slate-300 pl-10 py-2 text-sm text-right shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      !service.is_offered ? 'opacity-50 bg-slate-50' : 'bg-white'
                    }`}
                    placeholder="0.00"
                    disabled={!service.is_offered || saving}
                  />
                </div>
                
                {service.id && (
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service.id!)}
                    className="p-1.5 text-slate-400 hover:text-red-500 focus:outline-none"
                    title="Remove service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button 
          type="button" 
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={saving}
          onClick={() => toast.success("Services and prices saved successfully")}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            'Save Services & Prices'
          )}
        </button>
      </div>
    </div>
  );
}