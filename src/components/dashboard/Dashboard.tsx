import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, User, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/clerk-react";
import DashboardTabs from "./DashboardTabs";
import { useProfile } from "../../hooks/useProfile";
import LoadingSpinner from "../LoadingSpinner";
import { supabase, testConnection, debugAuth } from "../../utils/supabase";

// Auth Debug Component
function AuthDebugger() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function runDebug() {
      try {
        // Test basic connection
        const connected = await testConnection();
        console.log('Supabase connection:', connected);

        // Get Clerk token
        let token = null;
        if (user) {
          token = await getToken({ template: 'supabase' });
          console.log('Clerk token received:', token ? 'Yes' : 'No');
          
          if (token) {
            // Set Supabase session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: ''
            });
            
            if (sessionError) {
              console.error('Session error:', sessionError);
            }
            
            // Get debug info
            const authDebug = await debugAuth();
            console.log('Auth debug:', authDebug);

            setDebugInfo({
              connected,
              hasToken: !!token,
              clerkUser: user.id,
              authDebug,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          setDebugInfo({
            connected,
            hasToken: false,
            message: 'No user logged in',
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Debug failed:', err);
        setDebugInfo({
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    runDebug();
  }, [user]);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-lg overflow-auto rounded-lg bg-black/80 p-4 text-white">
      <h3 className="mb-2 font-bold">Auth Debug</h3>
      <pre className="whitespace-pre-wrap text-xs">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading, error } = useProfile();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/locksmith/login');
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    }
  }, [error]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
                L
              </div>
              <span className="text-lg font-semibold">Lasoo</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
            </button>
            <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={18} />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.fullName || user.firstName || 'User'}</div>
                <div className="text-xs text-slate-500">{profile?.company_name || 'Complete your profile'}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Locksmith Dashboard</h1>
            <p className="mt-1 text-slate-500">
              Manage your locksmith business details and services
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/" 
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <button 
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <DashboardTabs />
        </div>
      </div>
      
      <AuthDebugger />
    </div>
  );
}