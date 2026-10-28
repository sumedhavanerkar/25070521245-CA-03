import Item from '../models/Item.js';
import { AppError } from '../utils/AppError.js';
import mongoose from 'mongoose';

// Helper: build filter object from query params
const buildFilter = (query) => {
  const filter = {};
  if (query.type && ['lost', 'found'].includes(query.type)) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.status && ['active', 'claimed', 'resolved'].includes(query.status)) filter.status = query.status;
  if (query.location) filter.location = { $regex: query.location, $options: 'i' };
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { distinguishingFeatures: { $regex: query.search, $options: 'i' } },
    ];
  }
  return filter;
};

// GET /api/items
export const getItems = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const filter = buildFilter(req.query);

    const [items, total] = await Promise.all([
      Item.find(filter)
        .select('-contactEmail -contactPhone') // Never expose private contact info
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('reportedBy', 'name')
        .lean(),
      Item.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalLost,
      totalFound,
      totalResolved,
      totalActive,
      recentActivity,
    ] = await Promise.all([
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.countDocuments({ status: 'active' }),
      Item.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const categoryBreakdown = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        totalLost,
        totalFound,
        totalResolved,
        totalActive,
        recentActivity,
        categoryBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id
export const getItemById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid item ID', 400));
    }

    const item = await Item.findById(req.params.id)
      .select('-contactEmail -contactPhone')
      .populate('reportedBy', 'name')
      .lean();

    if (!item) return next(new AppError('Item not found', 404));

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/items
export const createItem = async (req, res, next) => {
  try {
    const {
      title, description, type, category, location,
      eventDate, imageUrl, distinguishingFeatures,
      contactName, contactEmail, contactPhone,
    } = req.body;

    const reporterDisplayName = req.user
      ? req.user.name
      : contactName || 'Anonymous';

    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      eventDate,
      imageUrl: imageUrl || null,
      distinguishingFeatures,
      contactName,
      contactEmail,
      contactPhone,
      reportedBy: req.user ? req.user._id : null,
      reporterDisplayName,
    });

    // Return without private contact fields
    const publicItem = await Item.findById(item._id)
      .select('-contactEmail -contactPhone')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Item reported successfully',
      data: publicItem,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/items/:id
export const updateItem = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid item ID', 400));
    }

    const item = await Item.findById(req.params.id);
    if (!item) return next(new AppError('Item not found', 404));

    // Authorization: owner or admin
    if (
      req.user &&
      item.reportedBy &&
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('You are not authorized to edit this item', 403));
    }

    const allowedFields = [
      'title', 'description', 'category', 'location', 'eventDate',
      'imageUrl', 'distinguishingFeatures', 'contactName', 'contactEmail', 'contactPhone',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    await item.save();

    const publicItem = await Item.findById(item._id)
      .select('-contactEmail -contactPhone')
      .lean();

    res.json({ success: true, message: 'Item updated', data: publicItem });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/items/:id/status
export const updateStatus = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid item ID', 400));
    }

    const { status } = req.body;
    const validStatuses = ['active', 'claimed', 'resolved'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status. Must be active, claimed, or resolved', 400));
    }

    const item = await Item.findById(req.params.id);
    if (!item) return next(new AppError('Item not found', 404));

    // Authorization: owner or admin
    if (
      req.user &&
      item.reportedBy &&
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to update status', 403));
    }

    item.status = status;
    await item.save();

    res.json({
      success: true,
      message: `Status updated to "${status}"`,
      data: { _id: item._id, status: item.status },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id
export const deleteItem = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError('Invalid item ID', 400));
    }

    const item = await Item.findById(req.params.id);
    if (!item) return next(new AppError('Item not found', 404));

    // Authorization: owner or admin
    if (
      req.user &&
      item.reportedBy &&
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to delete this item', 403));
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/mine  (items by logged-in user)
export const getMyItems = async (req, res, next) => {
  try {
    if (!req.user) return next(new AppError('Authentication required', 401));

    const items = await Item.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};
