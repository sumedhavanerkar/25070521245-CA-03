import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, Clock } from 'lucide-react';
import { CATEGORY_ICONS, formatRelativeTime, formatDate } from '../utils/constants';

function ItemImage({ imageUrl, title, category }) {
  const emoji = CATEGORY_ICONS[category] || '📦';
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div className="placeholder-icon" style={{ fontSize: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      {emoji}
    </div>
  );
}

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item._id}`} className="item-card" aria-label={`View details for ${item.title}`}>
      <div className="card">
        <div className="item-card-img">
          <ItemImage imageUrl={item.imageUrl} title={item.title} category={item.category} />
          <span className={`badge badge-${item.type} item-type-badge`}>
            {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
          </span>
          {item.status !== 'active' && (
            <span className={`badge badge-${item.status} item-status-badge`}>
              {item.status === 'claimed' ? '✓ Claimed' : '✅ Resolved'}
            </span>
          )}
        </div>
        <div className="item-card-body">
          <div className="item-card-category">
            <span>{CATEGORY_ICONS[item.category] || '📦'}</span>
            {item.category}
          </div>
          <h3 className="item-card-title">{item.title}</h3>
          <p className="item-card-description">{item.description}</p>
          <div className="item-card-meta">
            <div className="item-card-meta-row">
              <MapPin size={13} aria-hidden="true" />
              <span>{item.location}</span>
            </div>
            <div className="item-card-meta-row">
              <Calendar size={13} aria-hidden="true" />
              <span>{formatDate(item.eventDate)}</span>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                <Clock size={12} style={{ display: 'inline', marginRight: '0.2rem' }} aria-hidden="true" />
                {formatRelativeTime(item.createdAt)}
              </span>
            </div>
            {item.reporterDisplayName && (
              <div className="item-card-meta-row" style={{ marginTop: '0.1rem' }}>
                <Tag size={12} aria-hidden="true" />
                <span>Reported by {item.reporterDisplayName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
