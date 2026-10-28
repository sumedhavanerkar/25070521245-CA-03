import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute guards all internal portal pages.
 * Unauthenticated users are redirected to /login immediately.
 * Direct access by typing the URL in the browser address bar is prevented.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font)',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '3px solid rgba(79, 70, 229, 0.2)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          Verifying campus session...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve the attempted URL in state for redirect after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
