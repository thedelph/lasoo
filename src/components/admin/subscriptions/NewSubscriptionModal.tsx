import React, { useState, useEffect } from 'react';
import { TradespersonOption, SubscriptionPlan } from './types';
import { SubscriptionService } from './SubscriptionService';
import { calculateEndDate } from './utils';
import { format } from 'date-fns';

interface NewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionCreated: () => void;
}

/**
 * Modal component for creating new subscriptions
 */
const NewSubscriptionModal: React.FC<NewSubscriptionModalProps> = ({ 
  isOpen, 
  onClose,
  onSubscriptionCreated
}) => {
  // Form state
  const [selectedTradesperson, setSelectedTradesperson] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [customDuration, setCustomDuration] = useState<number>(1);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string>('');
  
  // Data loading state
  const [tradespeople, setTradespeople] = useState<TradespersonOption[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [tradespersonLoading, setTradespersonLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate the end date whenever start date or duration changes
  useEffect(() => {
    if (startDate) {
      const startDateObj = new Date(startDate);
      const endDate = calculateEndDate(startDateObj, customDuration);
      setCalculatedEndDate(endDate);
    }
  }, [startDate, customDuration]);

  // Fetch tradespeople and plans when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTradespeople();
      fetchSubscriptionPlans();
    }
  }, [isOpen]);

  // Handler for form submission
  const handleCreateSubscription = async () => {
    try {
      setIsCreatingSubscription(true);
      setFormError(null);

      if (!selectedTradesperson || !selectedPlan || !startDate) {
        setFormError('Please fill in all required fields');
        return;
      }

      // Get selected plan details
      const plan = subscriptionPlans.find((p) => p.id === selectedPlan);
      if (!plan) {
        setFormError('Selected plan not found');
        return;
      }

      // Calculate end date based on start date and custom duration
      const startDateObj = new Date(startDate);
      const endDateStr = calculateEndDate(startDateObj, customDuration);

      // Get user_id for the selected tradesperson
      // Use toString() to handle case where ID might be a number vs string comparison issue
      const tradesperson = tradespeople.find((t) => String(t.id) === String(selectedTradesperson));
      console.log('Looking for tradesperson with ID:', selectedTradesperson);
      console.log('Available tradespeople:', tradespeople.map(t => ({ id: t.id, name: t.fullname })));
      
      if (!tradesperson) {
        setFormError('Selected tradesperson not found. Please try selecting again.');
        return;
      }

      // Create the subscription using the service
      const { error } = await SubscriptionService.createSubscription(
        selectedTradesperson,
        selectedPlan, 
        startDate, 
        endDateStr, 
        plan
      );

      if (error) {
        setFormError(error);
        return;
      }

      // Notify parent and close modal
      onSubscriptionCreated();
      onClose();
    } catch (err: any) {
      console.error('Error creating subscription:', err);
      setFormError(err.message || 'Failed to create subscription');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  // Fetch tradespeople data
  const fetchTradespeople = async () => {
    setTradespersonLoading(true);
    const { tradespeople, error } = await SubscriptionService.fetchTradespeople();
    
    if (error) {
      setFormError(error);
    } else {
      setTradespeople(tradespeople);
    }
    
    setTradespersonLoading(false);
  };

  // Fetch subscription plans
  const fetchSubscriptionPlans = async () => {
    setPlansLoading(true);
    const { plans, error } = await SubscriptionService.fetchSubscriptionPlans();
    
    if (error) {
      setFormError(error);
    } else {
      setSubscriptionPlans(plans);
      // Set the first plan as default if available
      if (plans.length > 0 && !selectedPlan) {
        setSelectedPlan(plans[0].id);
      }
    }
    
    setPlansLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Issue New Subscription</h2>

        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {formError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tradesperson <span className="text-red-500">*</span>
          </label>
          {tradespersonLoading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
          ) : (
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedTradesperson}
              onChange={(e) => setSelectedTradesperson(e.target.value)}
              disabled={isCreatingSubscription}
            >
              <option value="">Select a tradesperson</option>
              {tradespeople.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.fullname} ({tp.email}) {tp.company_name ? `- ${tp.company_name}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subscription Plan <span className="text-red-500">*</span>
          </label>
          {plansLoading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
          ) : (
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              disabled={isCreatingSubscription}
            >
              <option value="">Select a plan</option>
              {subscriptionPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - £{plan.price} / {plan.duration_months} {plan.duration_months === 1 ? 'month' : 'months'}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isCreatingSubscription}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Duration (months) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="36"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={customDuration}
            onChange={(e) => setCustomDuration(parseInt(e.target.value) || 1)}
            disabled={isCreatingSubscription}
          />
        </div>

        {calculatedEndDate && (
          <div className="mb-6 text-sm text-gray-600">
            Subscription will expire on: {format(new Date(calculatedEndDate), 'yyyy-MM-dd')}
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            onClick={onClose}
            disabled={isCreatingSubscription}
          >
            Cancel
          </button>
          <button
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded ${
              isCreatingSubscription ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleCreateSubscription}
            disabled={isCreatingSubscription}
          >
            {isCreatingSubscription ? 'Creating...' : 'Create Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSubscriptionModal;
