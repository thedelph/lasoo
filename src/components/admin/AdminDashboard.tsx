import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminDashboard = () => {
  const { adminUser, adminSignOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-bold">Lasoo Admin</h2>
          <button 
            className="md:hidden p-2 rounded-md hover:bg-indigo-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col space-y-1">
          <Link
            to="/admin/dashboard"
            className={`px-4 py-2 rounded-md ${
              isActive('/admin/dashboard') && !isActive('/admin/dashboard/tradespeople') && !isActive('/admin/dashboard/subscriptions') && !isActive('/admin/dashboard/map')
                ? 'bg-indigo-900 text-white'
                : 'hover:bg-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </div>
          </Link>
          

          
          <Link
            to="/admin/dashboard/tradespeople"
            className={`px-4 py-2 rounded-md ${
              isActive('/admin/dashboard/tradespeople')
                ? 'bg-indigo-900 text-white'
                : 'hover:bg-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Tradespeople</span>
            </div>
          </Link>
          
          <Link
            to="/admin/dashboard/subscriptions"
            className={`px-4 py-2 rounded-md ${
              isActive('/admin/dashboard/subscriptions')
                ? 'bg-indigo-900 text-white'
                : 'hover:bg-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>Subscriptions</span>
            </div>
          </Link>
          
          <Link
            to="/admin/dashboard/map"
            className={`px-4 py-2 rounded-md ${
              isActive('/admin/dashboard/map')
                ? 'bg-indigo-900 text-white'
                : 'hover:bg-indigo-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>God Mode Map</span>
            </div>
          </Link>
        </nav>

        <div className="px-4 mt-auto">
          <div className="pt-4 border-t border-indigo-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{adminUser?.email}</p>
                <p className="text-xs text-indigo-300">
                  {adminUser?.is_super_admin ? 'Super Admin' : 'Admin'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-md hover:bg-indigo-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/admin/dashboard' && 'Dashboard Overview'}
              {location.pathname === '/admin/dashboard/tradespeople' && 'Tradesperson Management'}
              {location.pathname === '/admin/dashboard/subscriptions' && 'Subscription Management'}
              {location.pathname === '/admin/dashboard/map' && 'God Mode Map'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
