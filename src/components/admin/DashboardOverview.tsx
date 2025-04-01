import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalTradespeople: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  newUsersToday: number;
  newTradespeopleToday: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTradespeople: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    newUsersToday: 0,
    newTradespeopleToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Get all users from the users table
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) throw usersError;
      
      if (!allUsers) {
        throw new Error('No users data returned');
      }
      
      // Count tradespeople (those with service_type not null or empty)
      const tradespeople = allUsers.filter(user => user.service_type);
      
      // Count users with active subscriptions
      const activeSubscriptions = allUsers.filter(user => 
        user.subscription_status === 'Active'
      );
      
      // Count users with expired subscriptions
      const expiredSubscriptions = allUsers.filter(user => 
        user.subscription_status === 'Expired'
      );
      
      // Get new users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISOString = today.toISOString();
      
      const newUsersToday = allUsers.filter(user => {
        const createdAt = new Date(user.created_at);
        return createdAt >= today && !user.service_type;
      });
      
      // Get new tradespeople today
      const newTradespeopleToday = allUsers.filter(user => {
        const createdAt = new Date(user.created_at);
        return createdAt >= today && user.service_type;
      });
      
      setStats({
        totalUsers: allUsers.length - tradespeople.length,
        totalTradespeople: tradespeople.length,
        activeSubscriptions: activeSubscriptions.length,
        expiredSubscriptions: expiredSubscriptions.length,
        newUsersToday: newUsersToday.length,
        newTradespeopleToday: newTradespeopleToday.length
      });
      
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(`Failed to load dashboard statistics: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="text-green-500 font-semibold">+{stats.newUsersToday}</span> new today
            </p>
          </div>
        </div>

        {/* Total Tradespeople Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tradespeople</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTradespeople}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="text-green-500 font-semibold">+{stats.newTradespeopleToday}</span> new today
            </p>
          </div>
        </div>

        {/* Subscriptions Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="text-red-500 font-semibold">{stats.expiredSubscriptions}</span> expired
            </p>
          </div>
        </div>
      </div>

      {/* Activity Chart Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg">
          <p className="text-gray-500">Activity chart will be implemented here</p>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <div className="h-48 flex items-center justify-center border border-gray-200 rounded-lg">
            <p className="text-gray-500">User growth chart will be implemented here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subscription Revenue</h2>
          <div className="h-48 flex items-center justify-center border border-gray-200 rounded-lg">
            <p className="text-gray-500">Revenue chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
