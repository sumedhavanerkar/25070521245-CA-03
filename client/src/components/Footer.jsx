import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand / Logo section */}
          <div className="footer-brand">
            <div className="logo">
              <svg viewBox="0 0 36 36" fill="none" style={{ width: 32, height: 32 }} aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="#4F46E5"/>
                <circle cx="18" cy="18" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
                <circle cx="18" cy="18" r="2.5" fill="white"/>
                <path d="M18 12v2M18 22v2M12 18h2M22 18h2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Campus Lost &amp; Found
            </div>
            <p>
              A community platform helping students on campus reconnect with their lost belongings.
              Report, search, and recover — all in one place.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['FLEXI CA-3', 'MERN Stack', 'PRN: 25070521245'].map((tag) => (
                <span key={tag} style={{
                  background: 'rgba(79,70,229,0.15)', color: '#a5b4fc',
                  padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick navigation links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/browse">Browse Items</Link></li>
              <li><Link to="/report-lost">Report Lost Item</Link></li>
              <li><Link to="/report-found">Report Found Item</Link></li>
              <li><Link to="/manage">Manage Listings</Link></li>
              <li><Link to="/about">About / How It Works</Link></li>
            </ul>
          </div>

          {/* Project info */}
          <div className="footer-col">
            <h4>Project Info</h4>
            <ul>
              <li><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>PRN: 25070521245</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>FLEXI CA-3 Mini-Project</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>CSE 2nd Year</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Full-Stack Web App</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>MERN Stack</span></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom">
          <span>© {year} Campus Lost &amp; Found Portal — FLEXI CA-3 Project.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <MapPin size={13} /> Built with React &amp; Node.js
          </span>
        </div>
      </div>
    </footer>
  );
}
