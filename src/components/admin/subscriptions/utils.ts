import { supabase } from '../../../lib/supabase/client';
import { format, addMonths } from 'date-fns';

/**
 * Format a date string to local date format
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format currency with proper symbol and format
 */
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency || 'GBP'
  }).format(amount);
};

/**
 * Get CSS class for subscription status badge
 */
export const getStatusBadgeClass = (status: string) => {
  // Convert to lowercase for case-insensitive comparison
  const statusLower = status.toLowerCase();
  switch (statusLower) {
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

/**
 * Calculate end date based on start date and duration in months
 */
export const calculateEndDate = (start: Date, durationMonths: number): string => {
  const endDate = addMonths(start, durationMonths);
  return format(endDate, 'yyyy-MM-dd');
};

/**
 * Check for expired subscriptions and update their status
 */
export const checkAndUpdateExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    const nowStr = now.toISOString();
    
    // Find all active subscriptions with end dates in the past
    const { data: expiredSubs, error: expiredError } = await supabase
      .from('users')
      .select('id, subscription_end_date')
      .eq('subscription_status', 'Active')
      .lt('subscription_end_date', nowStr);
      
    if (expiredError) {
      console.error('Error checking for expired subscriptions:', expiredError);
      return;
    }
    
    // Update all expired subscriptions to 'Expired' status
    if (expiredSubs && expiredSubs.length > 0) {
      console.log(`Found ${expiredSubs.length} expired subscriptions to update`);
      
      // Update each expired subscription
      for (const sub of expiredSubs) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription_status: 'Expired' }) // Using capitalized status to match existing db values
          .eq('id', sub.id);
          
        if (updateError) {
          console.error(`Error updating expired subscription for user ${sub.id}:`, updateError);
        } else {
          console.log(`Updated subscription status to Expired for user ${sub.id}`);
        }
      }
    }
  } catch (err) {
    console.error('Error in checkAndUpdateExpiredSubscriptions:', err);
  }
};
