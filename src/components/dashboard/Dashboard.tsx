import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/clerk-react";
import DashboardTabs from "./DashboardTabs";
import { useProfile } from "../../hooks/useProfile";
import LoadingSpinner from "../LoadingSpinner";

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
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-lg overflow-auto">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre className="text-xs whitespace-pre-wrap">
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
    return <LoadingSpinner />;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Locksmith Dashboard</h1>
          <p className="text-base-content/60">
            {profile?.company_name || 'Complete your profile'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-outline">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <button 
            className="btn btn-outline" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
      <DashboardTabs />
      <AuthDebugger />
    </div>
  );
}