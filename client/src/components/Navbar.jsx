import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';

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

        {/* Desktop quick-action buttons */}
        <div className="navbar-actions">
          <Link to="/report-lost" className="btn btn-ghost btn-sm">
            🔴 Lost
          </Link>
          <Link to="/report-found" className="btn btn-primary btn-sm">
            🟢 Found
          </Link>
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
