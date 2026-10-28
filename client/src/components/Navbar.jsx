import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Navigation links shown in the navbar
const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/browse', label: 'Browse Items' },
  { to: '/report-lost', label: 'Report Lost' },
  { to: '/report-found', label: 'Report Found' },
  { to: '/manage', label: 'Manage Listings' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-logo" aria-label="Campus Lost and Found home">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="36" height="36" rx="10" fill="#4F46E5"/>
            <circle cx="18" cy="18" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="18" cy="18" r="2.5" fill="white"/>
            <path d="M18 12v2M18 22v2M12 18h2M22 18h2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Campus L&amp;F</span>
        </Link>

        {/* Desktop navigation links */}
        <div className="navbar-links">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop user profile & actions */}
        <div className="navbar-actions">
          <Link to="/report-lost" className="btn btn-ghost btn-sm">
            🔴 Lost
          </Link>
          <Link to="/report-found" className="btn btn-primary btn-sm">
            🟢 Found
          </Link>

          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginLeft: '0.5rem',
                paddingLeft: '0.75rem',
                borderLeft: '1.5px solid var(--border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.65rem',
                  background: 'var(--primary-50)',
                  borderRadius: '20px',
                  color: 'var(--primary-dark)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
                title={user.email}
              >
                <User size={14} />
                <span>{user.name?.split(' ')[0]}</span>
                {user.prn && (
                  <span
                    style={{
                      background: 'white',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {user.prn}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                title="Log out of your account"
                style={{
                  padding: '0.4rem 0.65rem',
                  color: '#dc2626',
                  borderColor: '#fecaca',
                  background: '#fef2f2',
                }}
              >
                <LogOut size={14} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="mobile-menu" role="menu">
          {user && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--primary-50)',
                borderRadius: 'var(--radius)',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.prn ? `PRN: ${user.prn} • ` : ''}{user.email}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={handleLogout}
                style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          )}

          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
              role="menuitem"
            >
              {l.label}
            </NavLink>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <Link to="/report-lost" className="btn btn-ghost btn-sm" onClick={() => setMobileOpen(false)}>
              🔴 Report Lost
            </Link>
            <Link to="/report-found" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
              🟢 Report Found
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
