import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Tag, User, ArrowLeft,
  Edit, Trash2, CheckCircle, Package, AlertTriangle, Share2
} from 'lucide-react';
import { itemsApi } from '../services/api';
import { CATEGORY_ICONS, CATEGORY_DEFAULT_IMAGES, formatDate, formatRelativeTime } from '../utils/constants';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const STATUS_TRANSITIONS = {
  active: [{ value: 'claimed', label: 'Mark as Claimed', icon: '✓' }, { value: 'resolved', label: 'Mark as Resolved', icon: '✅' }],
  claimed: [{ value: 'active', label: 'Reopen', icon: '↺' }, { value: 'resolved', label: 'Mark as Resolved', icon: '✅' }],
  resolved: [{ value: 'active', label: 'Reopen', icon: '↺' }],
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // No auth needed — anyone can view/manage listings (educational project)
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await itemsApi.getById(id);
        setItem(res.data.data);
      } catch (err) {
        setError(err.friendlyMessage || 'Item not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Anyone can manage listings in this educational project (no login required)
  const canManage = true;

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemsApi.delete(id);
      toast.success('Item deleted successfully');
      navigate('/browse');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete item');
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      await itemsApi.updateStatus(id, newStatus);
      setItem((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="skeleton-line" style={{ height: '20px', width: '120px', marginBottom: '2rem', borderRadius: 8 }} />
          <div className="detail-layout">
            <div>
              <div className="skeleton-img" style={{ height: 380, borderRadius: 'var(--radius-md)' }} />
              <div className="skeleton-body" style={{ paddingLeft: 0 }}>
                <div className="skeleton-line" style={{ height: 32, width: '70%' }} />
                <div className="skeleton-line" />
                <div className="skeleton-line medium" />
              </div>
            </div>
            <div>
              <div className="skeleton-line short" style={{ marginBottom: '1rem' }} />
              <div className="skeleton-line" style={{ height: 120, borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="error-state">
          <AlertTriangle size={48} color="var(--danger)" style={{ margin: '0 auto 1.25rem' }} aria-hidden="true" />
          <h3>Item Not Found</h3>
          <p>{error}</p>
          <Link to="/browse" className="btn btn-primary btn-sm">Browse All Items</Link>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const emoji = CATEGORY_ICONS[item.category] || '📦';
  const transitions = STATUS_TRANSITIONS[item.status] || [];

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleShare} aria-label="Share this item">
                <Share2 size={14} /> Share
              </button>
              {canManage && (
                <>
                  <Link to={`/items/${id}/edit`} className="btn btn-ghost btn-sm" aria-label="Edit item">
                    <Edit size={14} /> Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteDialog(true)} aria-label="Delete item">
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="detail-layout">
            {/* Left column */}
            <div>
              {/* Image */}
              <div className="detail-image-section card">
                {item.imageUrl || CATEGORY_DEFAULT_IMAGES[item.category] ? (
                  <img
                    src={item.imageUrl || CATEGORY_DEFAULT_IMAGES[item.category]}
                    alt={item.title}
                    className="detail-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="detail-image-placeholder"
                  style={{ display: item.imageUrl || CATEGORY_DEFAULT_IMAGES[item.category] ? 'none' : 'flex' }}
                >
                  <span style={{ fontSize: '5rem' }} aria-hidden="true">{emoji}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No image available</span>
                </div>
              </div>

              {/* Item info */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className={`badge badge-${item.type}`}>
                    {item.type === 'lost' ? '🔴 Lost Item' : '🟢 Found Item'}
                  </span>
                  <span className={`badge badge-${item.status}`}>
                    {item.status === 'active' ? '● Active' : item.status === 'claimed' ? '✓ Claimed' : '✅ Resolved'}
                  </span>
                </div>

                <h1 className="detail-info" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.25 }}>
                  {item.title}
                </h1>

                {/* Meta grid */}
                <div className="detail-meta-grid">
                  <div className="detail-meta-item">
                    <div className="detail-meta-label">Category</div>
                    <div className="detail-meta-value">{emoji} {item.category}</div>
                  </div>
                  <div className="detail-meta-item">
                    <div className="detail-meta-label">Location</div>
                    <div className="detail-meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} aria-hidden="true" /> {item.location}
                    </div>
                  </div>
                  <div className="detail-meta-item">
                    <div className="detail-meta-label">{item.type === 'lost' ? 'Date Lost' : 'Date Found'}</div>
                    <div className="detail-meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} aria-hidden="true" /> {formatDate(item.eventDate)}
                    </div>
                  </div>
                  <div className="detail-meta-item">
                    <div className="detail-meta-label">Reported</div>
                    <div className="detail-meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} aria-hidden="true" /> {formatRelativeTime(item.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="detail-section">
                  <h2 className="detail-section-title">Description</h2>
                  <p className="detail-description">{item.description}</p>
                </div>

                {/* Distinguishing features */}
                {item.distinguishingFeatures && (
                  <div className="detail-section">
                    <h2 className="detail-section-title">Distinguishing Features</h2>
                    <p className="detail-description">{item.distinguishingFeatures}</p>
                  </div>
                )}

                {/* Reported by */}
                {item.reporterDisplayName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <User size={14} aria-hidden="true" />
                    Reported by <strong style={{ color: 'var(--text-secondary)' }}>{item.reporterDisplayName}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Status update card (owner/admin only) */}
              {canManage && transitions.length > 0 && (
                <div className="card" style={{ marginBottom: '1.25rem' }}>
                  <div className="card-body">
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.875rem', color: 'var(--text-primary)' }}>
                      Update Status
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {transitions.map((t) => (
                        <button
                          key={t.value}
                          className={`btn ${t.value === 'resolved' ? 'btn-success' : 'btn-ghost'}`}
                          style={{ justifyContent: 'flex-start' }}
                          onClick={() => handleStatusChange(t.value)}
                          disabled={statusLoading}
                          aria-label={t.label}
                        >
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact card */}
              <div className="contact-card">
                <h3>
                  {item.type === 'lost'
                    ? '🙋 Is this your item?'
                    : '📬 Did you lose this?'}
                </h3>
                {item.status === 'resolved' ? (
                  <div style={{ background: '#d1fae5', borderRadius: 'var(--radius)', padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="var(--success)" aria-hidden="true" />
                    <span style={{ fontSize: '0.9rem', color: '#065f46', fontWeight: 600 }}>This item has been resolved.</span>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                      {item.type === 'lost'
                        ? 'If you found this item, contact the reporter through the information below.'
                        : 'If this is your lost item, contact the finder below. Be ready to describe identifying features.'}
                    </p>
                    {item.contactName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <User size={15} color="var(--primary)" aria-hidden="true" />
                        <strong>Contact:</strong> {item.contactName}
                      </div>
                    )}
                    {!contactRevealed ? (
                      <div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem', padding: '0.625rem', background: 'rgba(79,70,229,0.06)', borderRadius: 'var(--radius-sm)' }}>
                          🔒 Contact details are protected. Click below to reveal contact information for this item.
                        </p>
                        <button className="btn btn-primary w-full" onClick={() => setContactRevealed(true)}>
                          Reveal Contact Info
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '0.875rem', border: '1px solid var(--primary-100)' }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Contact the reporter directly. Please mention the item details and any identifying features.
                        </p>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {item.reporterDisplayName || 'Anonymous Reporter'}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                          ℹ️ For privacy, detailed contact info is provided only after verification. 
                          Visit the admin office or use the campus community board to connect.
                        </p>
                      </div>
                    )}
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
                      <p style={{ fontSize: '0.8rem', color: '#92400e' }}>
                        ⚠️ <strong>Safety reminder:</strong> Always meet in a public place to exchange items. Never share sensitive personal information online.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Report this listing */}
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  onClick={() => toast('Report submitted. Our team will review this listing.', { icon: '🚩' })}
                  aria-label="Report this listing as inappropriate"
                >
                  🚩 Report this listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Item"
        message={`Are you sure you want to delete "${item?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete Item"
        confirmClass="btn-danger"
        loading={deleteLoading}
      />
    </div>
  );
}
