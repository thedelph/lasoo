// Shared types for subscription management components

export interface Subscription {
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

export interface TradespersonOption {
  id: string; 
  fullname: string;
  email: string;
  service_type?: string;
  company_name?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
}
