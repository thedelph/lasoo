import { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { Loader2, Building, Phone, Globe, MapPin, Mail } from 'lucide-react';
import type { Profile } from '../../../types/profile';

export default function CompanyDetailsTab() {
  const { profile, loading, updateProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    company_name: '',
    telephone_number: '',
    website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'United Kingdom'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        telephone_number: profile.telephone_number || '',
        website: profile.website || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        county: profile.county || '',
        postcode: profile.postcode || '',
        country: profile.country || 'United Kingdom'
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Company Information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your company details to help customers find and contact you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information Section */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Building className="h-4 w-4 text-slate-500" />
              Company Details
            </h3>
          </div>
          
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="company_name" className="block text-sm font-medium text-slate-700">
                  Company Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Building className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="company_name"
                    type="text"
                    className="w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.company_name || ''}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    required
                    disabled={saving}
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="telephone_number" className="block text-sm font-medium text-slate-700">
                  Contact Telephone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="telephone_number"
                    type="tel"
                    className="w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.telephone_number || ''}
                    onChange={(e) => handleInputChange('telephone_number', e.target.value)}
                    required
                    disabled={saving}
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-slate-700">
                  Website (Optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Globe className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="website"
                    type="url"
                    className="w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={saving}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-slate-500" />
              Business Address
            </h3>
          </div>
          
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="address_line1" className="block text-sm font-medium text-slate-700">
                  Address Line 1
                </label>
                <input
                  id="address_line1"
                  type="text"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.address_line1 || ''}
                  onChange={(e) => handleInputChange('address_line1', e.target.value)}
                  required
                  disabled={saving}
                  placeholder="Street Address"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="address_line2" className="block text-sm font-medium text-slate-700">
                  Address Line 2 (Optional)
                </label>
                <input
                  id="address_line2"
                  type="text"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.address_line2 || ''}
                  onChange={(e) => handleInputChange('address_line2', e.target.value)}
                  disabled={saving}
                  placeholder="Apartment, Suite, Unit, etc."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  disabled={saving}
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="county" className="block text-sm font-medium text-slate-700">
                  County
                </label>
                <input
                  id="county"
                  type="text"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.county || ''}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  required
                  disabled={saving}
                  placeholder="County"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="postcode" className="block text-sm font-medium text-slate-700">
                  Postcode
                </label>
                <input
                  id="postcode"
                  type="text"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.postcode || ''}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  required
                  disabled={saving}
                  placeholder="Postcode"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                  Country
                </label>
                <select
                  id="country"
                  className="w-full rounded-md border border-slate-300 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={formData.country || 'United Kingdom'}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={saving}
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Ireland">Ireland</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}