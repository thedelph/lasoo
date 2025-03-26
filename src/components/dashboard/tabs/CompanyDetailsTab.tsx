import { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { Loader2 } from 'lucide-react';
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
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Company Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.company_name || ''}
          onChange={(e) => handleInputChange('company_name', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Contact Telephone Number</span>
        </label>
        <input
          type="tel"
          className="input input-bordered"
          value={formData.telephone_number || ''}
          onChange={(e) => handleInputChange('telephone_number', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Website (Optional)</span>
        </label>
        <input
          type="url"
          className="input input-bordered"
          value={formData.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Address Line 1</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.address_line1 || ''}
          onChange={(e) => handleInputChange('address_line1', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Address Line 2 (Optional)</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.address_line2 || ''}
          onChange={(e) => handleInputChange('address_line2', e.target.value)}
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">City</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">County</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.county || ''}
          onChange={(e) => handleInputChange('county', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Postcode</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={formData.postcode || ''}
          onChange={(e) => handleInputChange('postcode', e.target.value)}
          required
          disabled={saving}
        />
      </div>

      <button 
        type="submit" 
        className={`btn btn-primary w-full ${saving ? 'loading' : ''}`}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
}