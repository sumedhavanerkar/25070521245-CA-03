import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, AlertCircle, CheckCircle2, Shield, Zap, Users, Package } from 'lucide-react';
import { itemsApi } from '../services/api';
import ItemCard from '../components/ItemCard';
import { LoadingGrid } from '../components/LoadingSkeleton';
import { CATEGORIES, CATEGORY_ICONS } from '../utils/constants';

function StatsBar({ stats, loading }) {
  if (loading) return null;
  const items = [
    { label: 'Items Reported Lost', value: stats?.totalLost ?? '—' },
    { label: 'Items Reported Found', value: stats?.totalFound ?? '—' },
    { label: 'Successfully Resolved', value: stats?.totalResolved ?? '—' },
    { label: 'Active Listings', value: stats?.totalActive ?? '—' },
  ];
  return (
    <div className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {items.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: 1, title: 'Report the Item', desc: 'Fill in the details of the item you lost or found on campus. Add a description, location, and date.' },
    { num: 2, title: 'Browse Listings', desc: 'Search and filter through all reported items. Use categories and locations to find what you need quickly.' },
    { num: 3, title: 'Make Contact', desc: 'Found a match? Use the safe contact workflow to reach the reporter without sharing private details.' },
    { num: 4, title: 'Recover & Resolve', desc: 'Once the item is returned, mark it as resolved so others know it has been recovered.' },
  ];
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Recovering lost items on campus is simple with our 4-step process</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-number" aria-hidden="true">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetyTips() {
  const tips = [
    { icon: '🔒', color: '#ddd6fe', title: 'Keep Contact Private', text: 'Never share your phone number publicly. Use our contact workflow to connect safely.' },
    { icon: '📍', color: '#d1fae5', title: 'Meet in Public', text: 'Always arrange to exchange items in a public, well-lit area like the library or admin block.' },
    { icon: '🏫', color: '#dbeafe', title: 'Report to Admin', text: 'For high-value items like mobile phones or wallets, also inform the campus admin office.' },
    { icon: '⚡', color: '#fef3c7', title: 'Act Quickly', text: 'Report lost items as soon as possible. Prompt reporting increases the chance of recovery.' },
  ];
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-header">
          <h2>Safety Tips</h2>
          <p>Keep yourself and others safe while using the Lost &amp; Found portal</p>
        </div>
        <div className="tips-grid">
          {tips.map((t) => (
            <div className="tip-card" key={t.title}>
              <div className="tip-icon" style={{ background: t.color, fontSize: '1.4rem' }}>{t.icon}</div>
              <div>
                <strong>{t.title}</strong>
                <p>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, lostRes, foundRes] = await Promise.all([
          itemsApi.getStats(),
          itemsApi.getAll({ type: 'lost', limit: 4, status: 'active' }),
          itemsApi.getAll({ type: 'found', limit: 4, status: 'active' }),
        ]);
        setStats(statsRes.data.data);
        setRecentLost(lostRes.data.data);
        setRecentFound(foundRes.data.data);
      } catch {
        // silently fail — show empty state
      } finally {
        setStatsLoading(false);
        setItemsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (cat) => {
    navigate(`/browse?category=${encodeURIComponent(cat)}`);
  };

  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="hero" aria-label="Hero section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              Campus Community Platform
            </div>
            <h1>Lost Something on Campus?<br />We'll Help You Find It.</h1>
            <p>
              The official campus Lost &amp; Found portal. Report lost items, browse found listings, 
              and help your fellow students recover their belongings — all in one safe place.
            </p>
            <div className="hero-actions">
              <Link to="/report-lost" className="btn btn-hero-primary">
                🔴 Report Lost Item
              </Link>
              <Link to="/report-found" className="btn btn-hero-secondary">
                🟢 Report Found Item
              </Link>
            </div>

            {/* Hero search */}
            <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="Search items">
              <Search size={18} style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search for a lost item — phone, wallet, ID card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search query"
              />
              <button type="submit" className="hero-search-btn" aria-label="Search">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <StatsBar stats={stats} loading={statsLoading} />

      {/* Category quick filters */}
      <section className="section-sm" style={{ background: 'white', borderBottom: '1px solid var(--border)' }} aria-label="Browse by category">
        <div className="container">
          <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Browse by Category
          </p>
          <div className="category-pills" role="list">
            {topCategories.map((cat) => (
              <button
                key={cat}
                className={`category-pill${activeCategory === cat ? ' active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
                role="listitem"
                aria-label={`Browse ${cat} items`}
              >
                <span aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
            <Link to="/browse" className="category-pill" style={{ fontStyle: 'italic' }}>
              All Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Lost Items */}
      <section className="section" aria-labelledby="recent-lost-heading">
        <div className="container">
          <div className="section-title-row">
            <h2 id="recent-lost-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem' }}>🔴</span> Recently Lost
            </h2>
            <Link to="/browse?type=lost" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          {itemsLoading ? (
            <LoadingGrid count={4} />
          ) : recentLost.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 0' }}>
              <Package size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} aria-hidden="true" />
              <p>No lost items reported recently.</p>
              <Link to="/report-lost" className="btn btn-primary btn-sm">Report a Lost Item</Link>
            </div>
          ) : (
            <div className="items-grid">
              {recentLost.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      {/* Recent Found Items */}
      <section className="section" style={{ background: 'white' }} aria-labelledby="recent-found-heading">
        <div className="container">
          <div className="section-title-row">
            <h2 id="recent-found-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem' }}>🟢</span> Recently Found
            </h2>
            <Link to="/browse?type=found" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          {itemsLoading ? (
            <LoadingGrid count={4} />
          ) : recentFound.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 0' }}>
              <Package size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} aria-hidden="true" />
              <p>No found items reported recently.</p>
              <Link to="/report-found" className="btn btn-primary btn-sm">Report a Found Item</Link>
            </div>
          ) : (
            <div className="items-grid">
              {recentFound.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
      <SafetyTips />

      {/* CTA Banner */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white' }} aria-label="Call to action">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
            Help Your Campus Community
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 2rem' }}>
            Found something on campus? Report it and help someone get their belongings back.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report-found" className="btn btn-hero-primary">Report Found Item</Link>
            <Link to="/browse" className="btn btn-hero-secondary">Browse All Items</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
