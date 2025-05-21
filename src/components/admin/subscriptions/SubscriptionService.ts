import { supabase } from '../../../lib/supabase/client';
import { Subscription, TradespersonOption, SubscriptionPlan } from './types';
import { checkAndUpdateExpiredSubscriptions } from './utils';

/**
 * Service class to handle subscription-related data operations
 */
export class SubscriptionService {
  /**
   * Fetch all subscriptions from the database
   */
  static async fetchSubscriptions(): Promise<{
    subscriptions: Subscription[];
    error: string | null;
  }> {
    try {
      // First check for and update any expired subscriptions
      await checkAndUpdateExpiredSubscriptions();
      
      // The primary source of subscription data is the users table
      // Include all users with any subscription status (Active, Expired, etc.)
      const { data: usersWithSubs, error: usersError } = await supabase
        .from('users')
        .select('*')
        .not('subscription_status', 'is', null)
        .not('service_type', 'is', null)
        .order('subscription_end_date', { ascending: false });
      
      if (usersError) throw usersError;
      
      // Get default plan ID to use if no specific plan is assigned
      const { data: defaultPlan } = await supabase
        .from('subscription_plans')
        .select('id, name, price, currency')
        .eq('name', 'Basic')
        .single();
        
      // Also fetch subscriptions to get the direct subscription records
      const { data: actualSubscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_plans!inner(name, price, currency)
        `)
        .order('end_date', { ascending: false });
        
      if (subError) throw subError;
      
      // Use a Map to track subscriptions by user email - this avoids duplicates
      const subscriptionMap = new Map<string, Subscription>();
      
      // First add all users with subscription status
      if (usersWithSubs && usersWithSubs.length > 0) {
        for (const user of usersWithSubs) {
          if (user.subscription_end_date && user.email) {
            subscriptionMap.set(user.email, {
              id: `user-${user.id}`, // Create a synthetic ID
              user_id: user.id.toString(),
              tradesperson_id: user.id.toString(),
              plan_id: defaultPlan?.id || '',
              status: user.subscription_status?.toLowerCase() || 'active',
              start_date: user.subscription_start_date || new Date().toISOString(),
              end_date: user.subscription_end_date,
              last_payment_date: user.subscription_start_date || new Date().toISOString(),
              next_payment_date: user.subscription_end_date,
              amount: defaultPlan?.price || 9.99,
              currency: defaultPlan?.currency || 'GBP',
              tradesperson_name: user.fullname || 'Unknown',
              tradesperson_email: user.email || 'No email',
              plan_name: defaultPlan?.name || 'Basic'
            });
          }
        }
      }
      
      // Create a lookup map of user_id to user details for quick access
      if (usersWithSubs && usersWithSubs.length > 0) {
        // No need to create a separate map as we can find matching users directly
        // from the usersWithSubs array using the find() method below
      }
      
      // Then add any actual subscription records, enhancing with user info when available
      if (actualSubscriptions && actualSubscriptions.length > 0) {
        for (const sub of actualSubscriptions) {
          // Try to get user info from a matching user by id
          const matchingUser = usersWithSubs?.find(u => u.id.toString() === sub.user_id);
          
          const userInfo = matchingUser ? {
            fullname: matchingUser.fullname || 'Unknown',
            email: matchingUser.email || 'No email'
          } : {
            fullname: 'Unknown', 
            email: 'No email'
          };
          
          // We use the email as key to avoid duplicates - this will update any existing entry
          // or create a new one if this is a standalone subscription
          if (userInfo.email !== 'No email') {
            subscriptionMap.set(userInfo.email, {
              id: sub.id,
              user_id: sub.user_id,
              tradesperson_id: sub.tradesperson_id,
              plan_id: sub.plan_id,
              status: sub.status,
              start_date: sub.start_date,
              end_date: sub.end_date,
              last_payment_date: sub.last_payment_date || sub.start_date,
              next_payment_date: sub.next_payment_date || sub.end_date,
              amount: sub.amount,
              currency: sub.currency,
              tradesperson_name: userInfo.fullname,
              tradesperson_email: userInfo.email,
              plan_name: sub.subscription_plans?.name || 'Basic'
            });
          }
        }
      }
      
      // Convert the Map to an array for state
      return {
        subscriptions: Array.from(subscriptionMap.values()),
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err);
      return {
        subscriptions: [],
        error: err.message || 'Failed to load subscriptions'
      };
    }
  }

  /**
   * Fetch tradespeople options for the subscription form
   */
  static async fetchTradespeople(): Promise<{
    tradespeople: TradespersonOption[];
    error: string | null;
  }> {
    try {
      const { data: tradespeopleData, error: tradespeopleError } = await supabase
        .from('users')
        .select('*')
        .not('service_type', 'is', null)
        .order('fullname', { ascending: true });
      
      if (tradespeopleError) throw tradespeopleError;
      
      if (tradespeopleData && tradespeopleData.length > 0) {
        const formattedTradespeople = tradespeopleData.map(user => ({
          id: user.id,
          fullname: user.fullname || 'Unknown',
          email: user.email || '',
          service_type: user.service_type,
          company_name: user.company_name
        }));
        
        return {
          tradespeople: formattedTradespeople,
          error: null
        };
      }
      
      return {
        tradespeople: [],
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching tradespeople:', err);
      return {
        tradespeople: [],
        error: err.message || 'Failed to load tradespeople'
      };
    }
  }

  /**
   * Fetch subscription plans
   */
  static async fetchSubscriptionPlans(): Promise<{
    plans: SubscriptionPlan[];
    error: string | null;
  }> {
    try {
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*');
      
      if (plansError) throw plansError;
      
      return {
        plans: plansData || [],
        error: null
      };
    } catch (err: any) {
      console.error('Error fetching subscription plans:', err);
      return {
        plans: [],
        error: err.message || 'Failed to load subscription plans'
      };
    }
  }

  /**
   * Extend a subscription's end date
   */
  static async extendSubscription(subscriptionId: string): Promise<{ error: string | null }> {
    try {
      // Check if this is a synthetic ID (starts with 'user-')
      if (subscriptionId.startsWith('user-')) {
        // Extract the user ID from the synthetic ID
        const userId = subscriptionId.replace('user-', '');
        console.log('Extending subscription for user ID:', userId);
        
        // Get the user's current subscription details
        const { data: userData, error: getUserError } = await supabase
          .from('users')
          .select('subscription_end_date')
          .eq('id', userId)
          .single();
          
        if (getUserError || !userData) {
          return { error: getUserError?.message || 'User not found' };
        }
        
        // Calculate new end date (extend by 30 days)
        const currentEndDate = new Date(userData.subscription_end_date);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + 30);
        
        // Update the user's subscription end date
        const { error: updateError } = await supabase
          .from('users')
          .update({
            subscription_end_date: newEndDate.toISOString(),
            subscription_status: 'Active' // Ensure it's active if it was extended
          })
          .eq('id', userId);
          
        if (updateError) throw updateError;
        
        return { error: null };
      } else {
        // This is a real subscription ID in the subscriptions table
        // Get the subscription to extend
        const { data: subscriptionData, error: getError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', subscriptionId)
          .single();
          
        if (getError || !subscriptionData) {
          return { error: getError?.message || 'Subscription not found' };
        }

        // Calculate new end date (extend by 30 days)
        const currentEndDate = new Date(subscriptionData.end_date);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + 30);

        // Update the subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            end_date: newEndDate.toISOString(),
            status: 'active' // Ensure it's active if it was extended
          })
          .eq('id', subscriptionId);

        if (error) throw error;
        
        return { error: null };
      }
    } catch (err: any) {
      console.error('Error extending subscription:', err);
      return { error: err.message || 'Failed to extend subscription' };
    }
  }

  /**
   * Cancel a subscription (change status to cancelled)
   */
  static async cancelSubscription(subscriptionId: string): Promise<{ error: string | null }> {
    try {
      // Update the subscription status to cancelled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
        })
        .eq('id', subscriptionId);

      if (error) throw error;
      
      return { error: null };
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      return { error: err.message || 'Failed to cancel subscription' };
    }
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    tradespersonId: string,
    planId: string,
    startDate: string,
    endDate: string,
    plan: SubscriptionPlan
  ): Promise<{ error: string | null }> {
    try {
      // Create the subscription record with a UUID using the secure admin function
      // We use admin_create_subscription which has SECURITY DEFINER to bypass RLS
      const { error } = await supabase.rpc('admin_create_subscription', {
        p_plan_id: planId,
        p_status: 'active', // Must be lowercase to match subscriptions table constraint
        p_start_date: startDate,
        p_end_date: endDate,
        p_amount: plan.price,
        p_currency: plan.currency,
        p_user_numeric_id: tradespersonId // Pass the numeric ID to the function
      });
      
      if (error) {
        console.error('Error creating subscription:', error);
        return { error: `Subscription creation failed: ${error.message}` };
      }
      
      // Also update the user's subscription status in the users table
      // Keep using 'Active' (capitalized) in the users table to match existing values
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          subscription_status: 'Active', // Capitalized for users table
          subscription_start_date: startDate,
          subscription_end_date: endDate
        })
        .eq('id', tradespersonId);

      if (userUpdateError) {
        return { error: `User update failed: ${userUpdateError.message}` };
      }

      return { error: null };
    } catch (err: any) {
      console.error('Error creating subscription:', err);
      return { error: err.message || 'Failed to create subscription' };
    }
  }
}
