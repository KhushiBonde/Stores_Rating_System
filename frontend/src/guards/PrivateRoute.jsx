import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute: Redirects to /login if not authenticated
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * RoleRoute: Checks if user has the required role
 * Redirects to their correct dashboard if role mismatch
 */
export const RoleRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to the correct dashboard based on role
    const dashboardMap = {
      ADMIN: '/admin/dashboard',
      NORMAL_USER: '/user/stores',
      STORE_OWNER: '/owner/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

/**
 * PublicRoute: Redirects authenticated users to their dashboard
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const dashboardMap = {
      ADMIN: '/admin/dashboard',
      NORMAL_USER: '/user/stores',
      STORE_OWNER: '/owner/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/'} replace />;
  }

  return children;
};
