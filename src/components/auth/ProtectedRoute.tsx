import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Redirects unauthenticated users to /login
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Future: Add role-based access control here
  if (requiredRole) {
    // TODO: Implement role checking when user roles are stored in Supabase
    console.warn(`Role-based access control not yet implemented. Required role: ${requiredRole}`);
  }

  return <>{children}</>;
}

export default ProtectedRoute;
