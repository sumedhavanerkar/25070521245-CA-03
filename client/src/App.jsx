import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportItemPage from './pages/ReportItemPage';
import ManageListingsPage from './pages/ManageListingsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

// AppLayout wraps internal portal pages with the shared Navbar and Footer
function AppLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Redirect already authenticated users away from Login and Register pages
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// All application routes with full authentication protection
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Auth Routes ────────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* ── Protected Portal Routes (Login Required) ──────────────────── */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <AppLayout>
              <BrowsePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ItemDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportItemPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-lost"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportItemPage itemType="lost" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-found"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportItemPage itemType="found" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ManageListingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AboutPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ── 404 Catch-All ────────────────────────────────────────────── */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'custom-toast',
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
