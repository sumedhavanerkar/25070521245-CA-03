import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  const getPageNumbers = () => {
    const nums = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
      if (page < pages - 2) nums.push('...');
      nums.push(pages);
    }
    return nums;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((n, i) =>
        n === '...' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>…</span>
        ) : (
          <button
            key={n}
            className={`page-btn${n === page ? ' active' : ''}`}
            onClick={() => onPageChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
