// ── Constants shared between frontend and backend logic ───────────────────────

export const CATEGORIES = [
  'ID Card',
  'Books & Notebooks',
  'Mobile Phone',
  'Wallet',
  'Keys',
  'Earphones & Headphones',
  'Bag & Backpack',
  'Water Bottle',
  'Watch',
  'Electronic Accessories',
  'Clothing',
  'Stationery',
  'Other',
];

export const LOCATIONS = [
  'Main Gate',
  'Library',
  'Cafeteria / Canteen',
  'Computer Lab',
  'Lecture Hall Block A',
  'Lecture Hall Block B',
  'Seminar Hall',
  'Sports Ground',
  'Parking Area',
  'Boys Hostel',
  'Girls Hostel',
  'Admin Block',
  'Garden / Open Area',
  'Auditorium',
  'Other',
];

export const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'resolved', label: 'Resolved' },
];

export const CATEGORY_ICONS = {
  'ID Card': '🪪',
  'Books & Notebooks': '📚',
  'Mobile Phone': '📱',
  'Wallet': '👛',
  'Keys': '🔑',
  'Earphones & Headphones': '🎧',
  'Bag & Backpack': '🎒',
  'Water Bottle': '🧴',
  'Watch': '⌚',
  'Electronic Accessories': '🔌',
  'Clothing': '👕',
  'Stationery': '✏️',
  'Other': '📦',
};

// High-quality reliable photos for college lost & found belongings
export const CATEGORY_DEFAULT_IMAGES = {
  'ID Card': 'https://images.unsplash.com/photo-1578852612716-854e527abf50?auto=format&fit=crop&w=700&q=80',
  'Books & Notebooks': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
  'Mobile Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80',
  'Wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
  'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80',
  'Earphones & Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  'Bag & Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  'Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
  'Watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  'Electronic Accessories': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
  'Clothing': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
  'Stationery': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=700&q=80',
  'Other': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
  return formatDate(dateStr);
};
