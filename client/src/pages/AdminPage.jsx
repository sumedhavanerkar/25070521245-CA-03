import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trash2, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { itemsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatRelativeTime, CATEGORY_ICONS } from '../utils/constants';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="error-state">
          <Shield size={48} color="var(--danger)" style={{ margin: '0 auto 1.25rem' }} aria-hidden="true" />
          <h3>Access Denied</h3>
          <p>You must be an administrator to view this page.</p>
          <Link to="/" className="btn btn-primary btn-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes] = await Promise.all([
        itemsApi.getStats(),
        itemsApi.getAll({ limit: 20, page }),
      ]);
      setStats(statsRes.data.data);
      setItems(itemsRes.data.data);
      setTotalPages(itemsRes.data.pagination.pages);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await itemsApi.delete(deleteTarget._id);
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      toast.success('Item deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await itemsApi.updateStatus(id, 'resolved');
      setItems((prev) => prev.map((i) => i._id === id ? { ...i, status: 'resolved' } : i));
      toast.success('Marked as resolved');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ borderBottom: '3px solid var(--primary)' }}>
        <div className="container">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Shield size={24} color="var(--primary)" aria-hidden="true" /> Admin Dashboard
          </h1>
          <p>Manage all reported items and oversee portal activity</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            {[
              { label: 'Total Lost', value: stats.totalLost, color: 'var(--danger)' },
              { label: 'Total Found', value: stats.totalFound, color: 'var(--success)' },
              { label: 'Active', value: stats.totalActive, color: 'var(--primary)' },
              { label: 'Resolved', value: stats.totalResolved, color: '#10b981' },
              { label: 'This Week', value: stats.recentActivity, color: '#8b5cf6' },
            ].map((s) => (
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>All Items</h2>

        <div className="card">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }} aria-label="All reported items">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Item</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reporter</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</th>
                    <th style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span aria-hidden="true">{CATEGORY_ICONS[item.category] || '📦'}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category} · {item.location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge badge-${item.type}`}>{item.type}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge badge-${item.status}`}>{item.status}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)' }}>
                        {item.reporterDisplayName || '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {formatRelativeTime(item.createdAt)}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <Link to={`/items/${item._id}`} className="btn btn-ghost btn-sm" aria-label={`View ${item.title}`} title="View">
                            <Eye size={14} />
                          </Link>
                          {item.status !== 'resolved' && (
                            <button className="btn btn-success btn-sm" onClick={() => handleResolve(item._id)} aria-label={`Resolve ${item.title}`} title="Resolve">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.title}`} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                  <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                  <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                  <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Item"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Delete"
        confirmClass="btn-danger"
        loading={deleteLoading}
      />
    </div>
  );
}
