import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface Tradesperson {
  id: string;
  user_id: string;
  fullname: string;
  phone: string | null;
  email: string | null;
  is_authorized: boolean;
  is_activated: boolean;
  created_at: string;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  company_name: string | null;
  subscription_status: string | null;
  service_type: string | null;
  company_postcode: string | null;
}

const TradespeopleManagement = () => {
  const [tradespeople, setTradespeople] = useState<Tradesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorizationFilter, setAuthorizationFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchTradespeople();
  }, []);

  const fetchTradespeople = async () => {
    try {
      setLoading(true);
      
      // Fetch all tradespeople from the users table
      const { data: tradespeopleData, error: tradespeopleError } = await supabase
        .from('users')
        .select('*')
        .not('service_type', 'is', null)
        .order('created_at', { ascending: false });
      
      if (tradespeopleError) throw tradespeopleError;
      
      if (tradespeopleData && tradespeopleData.length > 0) {
        // Extract unique service types for filtering
        const uniqueServiceTypes = [...new Set(tradespeopleData
          .map(tp => tp.service_type)
          .filter(Boolean))] as string[];
        
        setServiceTypes(uniqueServiceTypes);
        setTradespeople(tradespeopleData as Tradesperson[]);
      } else {
        setTradespeople([]);
      }
      
    } catch (err: any) {
      console.error('Error fetching tradespeople:', err);
      setError(err.message || 'Failed to load tradesperson data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTradespeople = () => {
    return tradespeople.filter(tp => {
      // Filter by authorization status
      if (authorizationFilter === 'authorized' && !tp.is_authorized) {
        return false;
      }
      if (authorizationFilter === 'unauthorized' && tp.is_authorized) {
        return false;
      }
      
      // Filter by service type
      if (serviceTypeFilter !== 'all' && tp.service_type !== serviceTypeFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !(
        (tp.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (tp.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tp.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tp.company_postcode || '').toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getSubscriptionStatusClass = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAuthorizeTradesperson = async (tradespersonId: string) => {
    try {
      // Update the tradesperson's authorization status
      const { error } = await supabase
        .from('users')
        .update({
          is_authorized: 1
        })
        .eq('id', tradespersonId);
      
      if (error) throw error;
      
      // Refresh the tradespeople list
      fetchTradespeople();
    } catch (err: any) {
      console.error('Error authorizing tradesperson:', err);
      setError(err.message || 'Failed to authorize tradesperson');
    }
  };

  const handleActivateTradesperson = async (tradespersonId: string) => {
    try {
      // Update the tradesperson's activation status
      // Using 1 instead of true since is_activated is a smallint in the database
      const { error } = await supabase
        .from('users')
        .update({
          is_activated: 1
        })
        .eq('id', tradespersonId);
      
      if (error) throw error;
      
      // Refresh the tradespeople list
      fetchTradespeople();
    } catch (err: any) {
      console.error('Error activating tradesperson:', err);
      setError(err.message || 'Failed to activate tradesperson');
    }
  };

  const handleDeleteTradesperson = async (tradespersonId: string) => {
    try {
      // Delete the tradesperson
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', tradespersonId);
      
      if (userError) throw userError;
      
      // Refresh the tradespeople list
      fetchTradespeople();
    } catch (err: any) {
      console.error('Error deleting tradesperson:', err);
      setError(err.message || 'Failed to delete tradesperson');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tradesperson Management</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, business, or postcode"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <select
                value={authorizationFilter}
                onChange={(e) => setAuthorizationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Authorization</option>
                <option value="authorized">Authorized Only</option>
                <option value="unauthorized">Unauthorized Only</option>
              </select>
            </div>
            
            <div>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Service Types</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tradesperson
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Postcode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredTradespeople().length > 0 ? (
                getFilteredTradespeople().map((tradesperson) => (
                  <tr key={tradesperson.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-semibold">
                              {tradesperson.fullname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tradesperson.fullname}
                          </div>
                          {tradesperson.company_name && (
                            <div className="text-sm text-gray-500">
                              {tradesperson.company_name}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            {tradesperson.email || 'No email'}
                          </div>
                          {tradesperson.phone && (
                            <div className="text-sm text-gray-500">
                              {tradesperson.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tradesperson.service_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tradesperson.is_authorized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tradesperson.is_authorized ? 'Authorized' : 'Unauthorized'}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tradesperson.is_activated ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tradesperson.is_activated ? 'Activated' : 'Not Activated'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tradesperson.company_postcode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {tradesperson.subscription_status && (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getSubscriptionStatusClass(tradesperson.subscription_status)
                          }`}>
                            {tradesperson.subscription_status}
                          </span>
                        )}
                        {tradesperson.subscription_end_date && (
                          <span className="text-xs text-gray-500">
                            Expires: {formatDate(tradesperson.subscription_end_date)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tradesperson.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        {!tradesperson.is_authorized && (
                          <button
                            onClick={() => handleAuthorizeTradesperson(tradesperson.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Authorize
                          </button>
                        )}
                        {tradesperson.is_authorized && !tradesperson.is_activated && (
                          <button
                            onClick={() => handleActivateTradesperson(tradesperson.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTradesperson(tradesperson.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tradespeople found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradespeopleManagement;
