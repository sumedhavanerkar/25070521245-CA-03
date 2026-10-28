import mongoose from 'mongoose';

const CATEGORIES = [
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

const LOCATIONS = [
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

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['lost', 'found'],
        message: 'Type must be either "lost" or "found"',
      },
      required: [true, 'Item type (lost/found) is required'],
    },
    category: {
      type: String,
      enum: {
        values: CATEGORIES,
        message: 'Invalid category',
      },
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Date lost/found is required'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    distinguishingFeatures: {
      type: String,
      trim: true,
      maxlength: [500, 'Distinguishing features cannot exceed 500 characters'],
      default: '',
    },
    // Contact info — stored but not exposed publicly
    contactName: {
      type: String,
      trim: true,
      maxlength: [60, 'Contact name cannot exceed 60 characters'],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      select: false, // Hidden from public queries
    },
    contactPhone: {
      type: String,
      trim: true,
      select: false, // Hidden from public queries
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'claimed', 'resolved'],
        message: 'Status must be active, claimed, or resolved',
      },
      default: 'active',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Store reporter's name for display without exposing private data
    reporterDisplayName: {
      type: String,
      trim: true,
      maxlength: [60, 'Reporter display name cannot exceed 60 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient searching and filtering
itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text', distinguishingFeatures: 'text' });

// Virtual for formatted event date
itemSchema.virtual('eventDateFormatted').get(function () {
  return this.eventDate
    ? this.eventDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;
});

export const ITEM_CATEGORIES = CATEGORIES;
export const ITEM_LOCATIONS = LOCATIONS;

const Item = mongoose.model('Item', itemSchema);
export default Item;
