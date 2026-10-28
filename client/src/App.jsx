import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportItemPage from './pages/ReportItemPage';
import ManageListingsPage from './pages/ManageListingsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

// AppLayout wraps every page with the shared Navbar and Footer
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

// Main application component with all routes
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Browse all lost and found items */}
          <Route path="/browse" element={<BrowsePage />} />

          {/* View details of a single item */}
          <Route path="/items/:id" element={<ItemDetailPage />} />

          {/* Edit an existing item */}
          <Route path="/items/:id/edit" element={<ReportItemPage />} />

          {/* Report a lost item */}
          <Route path="/report-lost" element={<ReportItemPage itemType="lost" />} />

          {/* Report a found item */}
          <Route path="/report-found" element={<ReportItemPage itemType="found" />} />

          {/* Manage all listings (view, edit, delete, update status) */}
          <Route path="/manage" element={<ManageListingsPage />} />

          {/* About / How It Works page */}
          <Route path="/about" element={<AboutPage />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>

      {/* Toast notification system */}
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
    </BrowserRouter>
  );
}
