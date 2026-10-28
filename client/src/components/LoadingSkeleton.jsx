export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" aria-hidden="true" />
      <div className="skeleton-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }) {
  return (
    <div className="loading-grid" aria-label="Loading items..." aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
