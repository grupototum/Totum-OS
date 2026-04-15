import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: ReactNode;
}

/**
 * ProtectedRoute - Protege rotas que exigem autenticação.
 * Uso como layout route (sem children): <Route element={<ProtectedRoute />}>
 * Uso direto (com children): <ProtectedRoute><Component /></ProtectedRoute>
 * Redireciona usuários não autenticados para /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Suporta tanto layout route (Outlet) quanto wrapper direto (children)
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
