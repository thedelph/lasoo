import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/locksmith/login' 
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useSupabaseAuth();
  const location = useLocation();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    // Redirect to login while preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
