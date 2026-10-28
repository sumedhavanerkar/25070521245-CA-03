import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }} aria-hidden="true">🔍</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Looks like this page got lost too! Don't worry — head back to the portal and try again.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/browse" className="btn btn-ghost">
            <Search size={16} /> Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
}
