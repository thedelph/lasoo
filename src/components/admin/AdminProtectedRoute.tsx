import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import LoadingSpinner from '../LoadingSpinner';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

const AdminProtectedRoute = ({ 
  children, 
  requireSuperAdmin = false 
}: AdminProtectedRouteProps) => {
  const { isAdmin, isSuperAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If super admin is required, check for that permission
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Otherwise just check if they're any kind of admin
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
