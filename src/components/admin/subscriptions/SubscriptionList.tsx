import React from 'react';
import { Subscription } from './types';
import { formatDate, formatCurrency, getStatusBadgeClass } from './utils';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  statusFilter: string;
  searchTerm: string;
  onExtend: (id: string) => void;
  onCancel: (id: string) => void;
}

/**
 * Component to display filtered subscription list with actions
 */
const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  statusFilter,
  searchTerm,
  onExtend,
  onCancel
}) => {
  // Filter subscriptions based on status and search term
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Filter by status if not "all"
    if (statusFilter !== 'all' && sub.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Filter by search term if provided
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return (
        (sub.tradesperson_name && sub.tradesperson_name.toLowerCase().includes(term)) ||
        (sub.tradesperson_email && sub.tradesperson_email.toLowerCase().includes(term))
      );
    }
    
    // Include if it passes all filters
    return true;
  });

  if (filteredSubscriptions.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-sm p-6 mt-4">
        <p className="text-gray-500 text-center py-4">No subscriptions found matching the current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4 mt-4 overflow-x-auto">
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
          {filteredSubscriptions.map(subscription => (
            <tr key={subscription.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {subscription.tradesperson_name}
                </div>
                <div className="text-sm text-gray-500">
                  {subscription.tradesperson_email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{subscription.plan_name}</div>
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
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onExtend(subscription.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Extend
                </button>
                {/* Only show cancel button for subscriptions with actual UUIDs, not synthetic ones */}
                {!subscription.id.startsWith('user-') && (
                  <button
                    onClick={() => onCancel(subscription.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionList;
