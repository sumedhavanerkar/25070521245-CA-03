import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { itemsApi } from '../services/api';
import ItemCard from '../components/ItemCard';
import { LoadingGrid } from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';
import { CATEGORIES, LOCATIONS, STATUSES } from '../utils/constants';

const DEFAULT_PARAMS = {
  search: '', type: '', category: '', location: '', status: '', sort: 'newest', page: 1, limit: 12,
};

function FilterSidebar({ filters, setFilters, onClear, mobileOpen, setMobileOpen }) {
  const hasActive = filters.type || filters.category || filters.location || filters.status;

  return (
    <>
      {/* Mobile filter toggle */}
      <div style={{ display: 'none' }} className="filter-toggle-mobile">
        <button className="btn btn-ghost" onClick={() => setMobileOpen(true)}>
          <SlidersHorizontal size={16} /> Filters {hasActive && <span className="badge badge-active" style={{ marginLeft: '0.25rem' }}>Active</span>}
        </button>
      </div>

      <aside className={`filter-sidebar${mobileOpen ? ' mobile-visible' : ''}`} aria-label="Filter options">
        <h3>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Filter size={16} /> Filters</span>
          {hasActive && (
            <button className="btn btn-ghost btn-sm" onClick={onClear} style={{ fontSize: '0.8rem' }}>
              <X size={13} /> Clear
            </button>
          )}
        </h3>

        {/* Type */}
        <div className="filter-group">
          <div className="filter-group-label">Type</div>
          {[{ value: '', label: 'All Items' }, { value: 'lost', label: '🔴 Lost' }, { value: 'found', label: '🟢 Found' }].map((opt) => (
            <label key={opt.value} className={`filter-option${filters.type === opt.value ? ' active' : ''}`}>
              <input
                type="radio"
                name="type"
                value={opt.value}
                checked={filters.type === opt.value}
                onChange={() => setFilters((f) => ({ ...f, type: opt.value, page: 1 }))}
                aria-label={opt.label}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Status */}
        <div className="filter-group">
          <div className="filter-group-label">Status</div>
          {[{ value: '', label: 'All Statuses' }, ...STATUSES].map((opt) => (
            <label key={opt.value} className={`filter-option${filters.status === opt.value ? ' active' : ''}`}>
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={filters.status === opt.value}
                onChange={() => setFilters((f) => ({ ...f, status: opt.value, page: 1 }))}
                aria-label={opt.label}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Category */}
        <div className="filter-group">
          <div className="filter-group-label">Category</div>
          <select
            className="form-control"
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Location */}
        <div className="filter-group">
          <div className="filter-group-label">Location</div>
          <select
            className="form-control"
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value, page: 1 }))}
            aria-label="Filter by location"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </aside>
    </>
  );
}

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...DEFAULT_PARAMS,
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || '',
  });
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchItems = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      // Build clean query (strip empty values)
      const query = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined)
      );
      if (params.sort === 'newest') query.sort = 'newest';
      const res = await itemsApi.getAll(query);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load items. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(filters);
    // Update URL params
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;
    if (filters.status) params.status = filters.status;
    setSearchParams(params, { replace: true });
  }, [filters, fetchItems, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_PARAMS);
    setSearchInput('');
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="container">
          <h1>Browse Lost &amp; Found Items</h1>
          <p>Search through all reported items on campus</p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-bar" role="search" aria-label="Search items">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Search by name, description, or features..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search query"
            style={{ paddingLeft: '2.75rem' }}
          />
        </form>

        <div className="browse-layout">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClear={clearFilters}
            mobileOpen={mobileFiltersOpen}
            setMobileOpen={setMobileFiltersOpen}
          />

          {/* Results */}
          <div>
            <div className="results-header">
              <p className="results-count" aria-live="polite" aria-atomic="true">
                {loading ? 'Loading...' : `${pagination?.total ?? 0} item${pagination?.total !== 1 ? 's' : ''} found`}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label htmlFor="sort-select" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sort:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
                  aria-label="Sort order"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingGrid count={12} />
            ) : error ? (
              <div className="error-state">
                <div style={{ fontSize: '2.5rem', margin: '0 auto 1rem' }}>⚠️</div>
                <h3>Could not load items</h3>
                <p>{error}</p>
                <button className="btn btn-primary btn-sm" onClick={() => fetchItems(filters)}>Try Again</button>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', margin: '0 auto 1rem' }}>🔍</div>
                <h3>No items found</h3>
                <p>Try adjusting your filters or search terms. The item you're looking for might not have been reported yet.</p>
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="items-grid">
                  {items.map((item) => <ItemCard key={item._id} item={item} />)}
                </div>
                <Pagination
                  pagination={pagination}
                  onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
