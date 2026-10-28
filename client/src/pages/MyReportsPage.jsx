import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Edit, Trash2, CheckCircle, Circle, PlusCircle } from 'lucide-react';
import { itemsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, formatRelativeTime, CATEGORY_ICONS } from '../utils/constants';
import toast from 'react-hot-toast';

function ReportRow({ item, onDelete, onStatusChange }) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(item._id);
      toast.success('Item deleted');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Delete failed');
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  return (
    <div className="report-item-row" role="listitem">
      <div style={{ fontSize: '1.5rem', flexShrink: 0, width: 40, textAlign: 'center' }} aria-hidden="true">
        {CATEGORY_ICONS[item.category] || '📦'}
      </div>
      <div className="report-item-info">
        <div className="report-item-title">{item.title}</div>
        <div className="report-item-meta">
          <span className={`badge badge-${item.type}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            {item.type}
          </span>
          <span className={`badge badge-${item.status}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
            {item.status}
          </span>
          <span>{item.location}</span>
          <span>{formatRelativeTime(item.createdAt)}</span>
        </div>
      </div>
      <div className="report-actions">
        {item.status !== 'resolved' && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onStatusChange(item._id, 'resolved')}
            aria-label={`Mark ${item.title} as resolved`}
            title="Mark as Resolved"
          >
            <CheckCircle size={15} color="var(--success)" />
          </button>
        )}
        <Link to={`/items/${item._id}/edit`} className="btn btn-ghost btn-sm" aria-label={`Edit ${item.title}`} title="Edit">
          <Edit size={15} />
        </Link>
        <Link to={`/items/${item._id}`} className="btn btn-ghost btn-sm" aria-label={`View ${item.title}`} title="View">
          View
        </Link>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--danger)' }}
          onClick={() => setDeleteDialog(true)}
          aria-label={`Delete ${item.title}`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Item"
        message={`Delete "${item.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        confirmText="Delete"
        confirmClass="btn-danger"
        loading={deleteLoading}
      />
    </div>
  );
}

export default function MyReportsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-reports');
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const res = await itemsApi.getMine();
        setItems(res.data.data);
      } catch (err) {
        setError(err.friendlyMessage || 'Failed to load your reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id) => {
    await itemsApi.delete(id);
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await itemsApi.updateStatus(id, status);
    setItems((prev) => prev.map((item) => item._id === id ? { ...item, status } : item));
    toast.success(`Status updated to "${status}"`);
  };

  const filtered = items.filter((item) => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  const lostCount = items.filter((i) => i.type === 'lost').length;
  const foundCount = items.filter((i) => i.type === 'found').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Reports</h1>
          <p>Manage all your lost and found item reports</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 900 }}>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Report Lost Item
          </Link>
          <Link to="/report-found" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} /> Report Found Item
          </Link>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Reports', value: items.length, color: 'var(--primary)' },
            { label: 'Lost Items', value: lostCount, color: 'var(--danger)' },
            { label: 'Found Items', value: foundCount, color: 'var(--success)' },
            { label: 'Resolved', value: resolvedCount, color: '#6366f1' },
          ].map((s) => (
            <div key={s.label} className="card">
              <div className="card-body" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="reports-tabs" role="tablist" aria-label="Filter reports">
          {[
            { key: 'all', label: `All (${items.length})` },
            { key: 'lost', label: `Lost (${lostCount})` },
            { key: 'found', label: `Found (${foundCount})` },
            { key: 'resolved', label: `Resolved (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`reports-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-label={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="skeleton-line" style={{ width: 200, margin: '0 auto', height: 14 }} />
            </div>
          ) : error ? (
            <div className="error-state" style={{ padding: '2.5rem' }}>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 2rem' }}>
              <Package size={48} aria-hidden="true" />
              <h3>No reports yet</h3>
              <p>You haven't reported any {activeTab !== 'all' ? activeTab : ''} items yet. Help your campus community!</p>
              <Link to="/report-lost" className="btn btn-primary btn-sm">Report an Item</Link>
            </div>
          ) : (
            <div role="list" aria-label="My reported items">
              {filtered.map((item) => (
                <ReportRow
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
