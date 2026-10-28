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
