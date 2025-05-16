import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'owner' | 'staff';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // If still loading auth state, show nothing yet
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have it
  if (requireRole && user?.role !== requireRole) {
    // For admin routes, redirect to dashboard
    if (requireRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    // For owner routes, staff can't access
    if (requireRole === 'owner' && user?.role === 'staff') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;