import React, { useState, useEffect } from 'react';
import { Subscription } from './types';
import { SubscriptionService } from './SubscriptionService';
import SubscriptionList from './SubscriptionList';
import NewSubscriptionModal from './NewSubscriptionModal';

/**
 * Main component for subscription management
 */
const SubscriptionManagement: React.FC = () => {
  // State for subscription data and UI
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch subscriptions on initial load
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch subscriptions from service
  const fetchSubscriptions = async () => {
    setLoading(true);
    const { subscriptions, error } = await SubscriptionService.fetchSubscriptions();
    
    setSubscriptions(subscriptions);
    setError(error);
    setLoading(false);
  };

  // Handle subscription extension
  const handleExtendSubscription = async (subscriptionId: string) => {
    try {
      const { error: extendError } = await SubscriptionService.extendSubscription(subscriptionId);
      
      if (extendError) {
        setError(extendError);
        return;
      }
      
      // Refresh subscriptions after extension
      await fetchSubscriptions();
    } catch (err: any) {
      console.error('Error extending subscription:', err);
      setError(err.message || 'Failed to extend subscription');
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error: cancelError } = await SubscriptionService.cancelSubscription(subscriptionId);
      
      if (cancelError) {
        setError(cancelError);
        return;
      }
      
      // Refresh subscriptions after cancellation
      await fetchSubscriptions();
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      setError(err.message || 'Failed to cancel subscription');
    }
  };

  // Modal control functions
  const openNewSubscriptionModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
          <button
            onClick={openNewSubscriptionModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            New Subscription
          </button>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center mb-4">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search by name or email"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-2/3 flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${
                  statusFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All Statuses
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  statusFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                }`}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  statusFilter === 'expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                }`}
                onClick={() => setStatusFilter('expired')}
              >
                Expired
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  statusFilter === 'cancelled' ? 'bg-gray-300 text-gray-800' : 'bg-gray-100'
                }`}
                onClick={() => setStatusFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        <SubscriptionList 
          subscriptions={subscriptions}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onExtend={handleExtendSubscription}
          onCancel={handleCancelSubscription}
        />

        <NewSubscriptionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubscriptionCreated={fetchSubscriptions}
        />
      </div>
    </div>
  );
};

export default SubscriptionManagement;
