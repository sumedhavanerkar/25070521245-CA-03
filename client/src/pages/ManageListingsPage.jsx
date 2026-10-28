import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, CheckCircle, Clock, AlertTriangle, RefreshCw, Search, Filter } from 'lucide-react';
import { itemsApi } from '../services/api';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../utils/constants';

// Status badge component — shows colored badge for each status
function StatusBadge({ status }) {
  const config = {
    active: { label: 'Active', className: 'badge badge-active', icon: <Clock size={11} /> },
    claimed: { label: 'Claimed', className: 'badge badge-claimed', icon: <AlertTriangle size={11} /> },
    resolved: { label: 'Resolved', className: 'badge badge-resolved', icon: <CheckCircle size={11} /> },
  };
  const s = config[status] || config.active;
  return (
    <span className={s.className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {s.icon} {s.label}
    </span>
  );
}

// Confirmation dialog component for delete action
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        style={{
          background: 'white', borderRadius: '16px', padding: '2rem',
          maxWidth: '420px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>🗑️</div>
        <h3 id="dialog-title" style={{ margin: '0 0 0.5rem', textAlign: 'center', fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            style={{ background: '#ef4444', color: 'white', border: 'none' }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Status update selector shown inline in the table
function StatusSelector({ itemId, currentStatus, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      await itemsApi.updateStatus(itemId, newStatus);
      onUpdate(itemId, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={updating}
      className="form-control"
      style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', minWidth: '110px' }}
      aria-label={`Change status for item`}
    >
      <option value="active">Active</option>
      <option value="claimed">Claimed</option>
      <option value="resolved">Resolved</option>
    </select>
  );
}

export default function ManageListingsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null, itemTitle: '' });
  const [deleting, setDeleting] = useState(false);

  // Fetch all items from the backend
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 100 };
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (search) params.search = search;
      const res = await itemsApi.getAll(params);
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load listings. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Update a single item's status in the local list
  const handleStatusUpdate = (itemId, newStatus) => {
    setItems((prev) => prev.map((i) => i._id === itemId ? { ...i, status: newStatus } : i));
  };

  // Open the delete confirmation dialog
  const openDeleteDialog = (item) => {
    setDeleteDialog({ open: true, itemId: item._id, itemTitle: item.title });
  };

  // Execute the delete after confirmation
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await itemsApi.delete(deleteDialog.itemId);
      setItems((prev) => prev.filter((i) => i._id !== deleteDialog.itemId));
      toast.success('Item deleted successfully');
      setDeleteDialog({ open: false, itemId: null, itemTitle: '' });
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>Manage Listings</h1>
          <p>View, edit, delete, and update the status of all reported items</p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Educational disclaimer */}
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px',
          padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400e',
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>📌</span>
          <span>
            <strong>Educational Project Notice:</strong> This Manage Listings page allows anyone to edit or delete any item.
            In a real application, users would only be able to manage their own listings after logging in.
          </span>
        </div>

        {/* Filters and search */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.25rem',
          marginBottom: '1.5rem', border: '1px solid var(--border)',
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end',
        }}>
          {/* Search input */}
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="search"
                className="form-control"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
                aria-label="Search items"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>

          {/* Type filter */}
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ minWidth: '130px', width: 'auto' }}
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            <option value="lost">🔴 Lost</option>
            <option value="found">🟢 Found</option>
          </select>

          {/* Category filter */}
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ minWidth: '160px', width: 'auto' }}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Refresh button */}
          <button className="btn btn-ghost btn-sm" onClick={fetchItems} aria-label="Refresh listings">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading listings...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="error-state">
            <div style={{ fontSize: '2.5rem', margin: '0 auto 1rem' }}>⚠️</div>
            <h3>Could not load listings</h3>
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={fetchItems}>Try Again</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3>No listings found</h3>
            <p>No items have been reported yet. Be the first to report a lost or found item!</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
              <Link to="/report-lost" className="btn btn-ghost btn-sm">Report Lost Item</Link>
              <Link to="/report-found" className="btn btn-primary btn-sm">Report Found Item</Link>
            </div>
          </div>
        )}

        {/* Items table */}
        {!loading && !error && items.length > 0 && (
          <div>
            <p style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Showing {items.length} listing{items.length !== 1 ? 's' : ''}
            </p>
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border)' }}>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      {/* Item title + reporter */}
                      <td style={tdStyle}>
                        <div>
                          <Link
                            to={`/items/${item._id}`}
                            style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                          >
                            {item.title}
                          </Link>
                          {item.reporterDisplayName && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              by {item.reporterDisplayName}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Type badge */}
                      <td style={tdStyle}>
                        <span className={`badge badge-type-${item.type}`}>
                          {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                        </span>
                      </td>

                      {/* Category */}
                      <td style={tdStyle}>{item.category}</td>

                      {/* Location */}
                      <td style={tdStyle}>{item.location}</td>

                      {/* Date */}
                      <td style={tdStyle}>{formatDate(item.eventDate || item.createdAt)}</td>

                      {/* Status selector */}
                      <td style={tdStyle}>
                        <StatusSelector
                          itemId={item._id}
                          currentStatus={item.status}
                          onUpdate={handleStatusUpdate}
                        />
                      </td>

                      {/* Action buttons */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate(`/items/${item._id}/edit`)}
                            title="Edit item"
                            aria-label={`Edit ${item.title}`}
                            style={{ padding: '0.4rem 0.6rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm"
                            onClick={() => openDeleteDialog(item)}
                            title="Delete item"
                            aria-label={`Delete ${item.title}`}
                            style={{ padding: '0.4rem 0.6rem', background: '#fee2e2', color: '#ef4444', border: 'none' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete this listing?"
        message={`Are you sure you want to permanently delete "${deleteDialog.itemTitle}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteDialog({ open: false, itemId: null, itemTitle: '' })}
      />
    </div>
  );
}

// Table header and cell styles
const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  verticalAlign: 'middle',
};
