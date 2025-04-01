import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  tradesperson_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  start_date: string;
  end_date: string;
  last_payment_date: string;
  next_payment_date: string;
  amount: number;
  currency: string;
  tradesperson_name?: string;
  tradesperson_email?: string;
  plan_name?: string;
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Fetch all subscriptions
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('end_date', { ascending: false });
      
      if (subscriptionError) throw subscriptionError;
      
      if (subscriptionData && subscriptionData.length > 0) {
        // Create an array to hold the complete subscription data
        const completeSubscriptions: Subscription[] = [];
        
        // Process each subscription
        for (const sub of subscriptionData) {
          // Get tradesperson profile
          const { data: tradespersonData, error: tradespersonError } = await supabase
            .from('tradesperson_profiles')
            .select('full_name, user_id')
            .eq('id', sub.tradesperson_id)
            .single();
          
          if (tradespersonError && tradespersonError.code !== 'PGRST116') {
            console.error('Error fetching tradesperson:', tradespersonError);
          }
          
          // Get user email if we have the user_id
          let userEmail = null;
          if (tradespersonData?.user_id) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('email')
              .eq('id', tradespersonData.user_id)
              .single();
            
            if (userError && userError.code !== 'PGRST116') {
              console.error('Error fetching user:', userError);
            }
            
            userEmail = userData?.email;
          }
          
          // Get subscription plan
          const { data: planData, error: planError } = await supabase
            .from('subscription_plans')
            .select('name')
            .eq('id', sub.plan_id)
            .single();
          
          if (planError && planError.code !== 'PGRST116') {
            console.error('Error fetching plan:', planError);
          }
          
          // Add the complete subscription to our array
          completeSubscriptions.push({
            ...sub,
            tradesperson_name: tradespersonData?.full_name || 'Unknown',
            tradesperson_email: userEmail || 'No email',
            plan_name: planData?.name || 'Unknown Plan'
          });
        }
        
        setSubscriptions(completeSubscriptions);
      } else {
        setSubscriptions([]);
      }
      
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSubscriptions = () => {
    return subscriptions.filter(sub => {
      // Filter by status
      if (statusFilter !== 'all' && sub.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !((sub.tradesperson_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (sub.tradesperson_email || '').toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency || 'GBP'
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
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

  const handleExtendSubscription = async (subscriptionId: string) => {
    try {
      // Get the subscription to extend
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) return;
      
      // Calculate new end date (extend by 30 days)
      const currentEndDate = new Date(subscription.end_date);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() + 30);
      
      // Update the subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({
          end_date: newEndDate.toISOString(),
          status: 'active'
        })
        .eq('id', subscriptionId);
      
      if (error) throw error;
      
      // Refresh the subscriptions list
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error extending subscription:', err);
      setError(err.message || 'Failed to extend subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      // Update the subscription status to cancelled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled'
        })
        .eq('id', subscriptionId);
      
      if (error) throw error;
      
      // Refresh the subscriptions list
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      setError(err.message || 'Failed to cancel subscription');
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
          <h2 className="text-xl font-semibold text-gray-800">Subscription Management</h2>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="trial">Trial</option>
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
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredSubscriptions().length > 0 ? (
                getFilteredSubscriptions().map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.tradesperson_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscription.tradesperson_email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subscription.plan_name || 'Unknown Plan'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subscription.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subscription.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(subscription.amount, subscription.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExtendSubscription(subscription.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Extend
                        </button>
                        {subscription.status === 'active' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No subscriptions found matching the current filters.
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

export default SubscriptionManagement;
