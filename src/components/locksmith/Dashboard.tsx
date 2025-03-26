import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import DashboardTabs from "../dashboard/DashboardTabs";
import { useProfile } from "../../hooks/useProfile";
import LoadingSpinner from "../LoadingSpinner";

export default function LocksmithDashboard() {
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const { profile, loading: profileLoading, error } = useProfile();

  useEffect(() => {
    if (userLoaded && !user) {
      navigate('/locksmith/login');
    }
  }, [user, userLoaded, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard. Please try again.');
    }
  }, [error]);

  if (!userLoaded || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Locksmith Dashboard</h1>
          <p className="text-base-content/60">{profile.company_name || 'Complete your profile'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-outline">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <button 
            className="btn btn-outline" 
            onClick={() => {
              navigate('/');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
      <DashboardTabs />
    </div>
  );
}