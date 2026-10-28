import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getItems, getStats, getItemById,
  createItem, updateItem, updateStatus,
  deleteItem,
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ITEM_CATEGORIES } from '../models/Item.js';

const router = Router();

// Protect all /api/items routes — requires valid JWT token
router.use(protect);

// Validation rules for creating a new item (type is required)
const itemBodyRules = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('category').isIn(ITEM_CATEGORIES).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 120 }),
  body('eventDate').isISO8601().toDate().withMessage('Valid date is required'),
  body('contactEmail').optional({ checkFalsy: true }).isEmail().withMessage('Valid contact email required'),
];

// Validation rules for updating an item (type is NOT required for edits)
const itemUpdateRules = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(ITEM_CATEGORIES).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 120 }),
  body('eventDate').isISO8601().toDate().withMessage('Valid date is required'),
  body('contactEmail').optional({ checkFalsy: true }).isEmail().withMessage('Valid contact email required'),
];

const idRule = [
  param('id').isMongoId().withMessage('Invalid item ID'),
];

// GET /api/items/stats  — must come before /:id to avoid being caught by it
router.get('/stats', getStats);

// GET /api/items
router.get('/', getItems);

// GET /api/items/:id
router.get('/:id', validate(idRule), getItemById);

// POST /api/items  — create a new report
router.post('/', validate(itemBodyRules), createItem);

// PUT /api/items/:id  — update an existing item
router.put('/:id', validate([...idRule, ...itemUpdateRules]), updateItem);

// PATCH /api/items/:id/status  — update status only
router.patch(
  '/:id/status',
  validate([
    param('id').isMongoId().withMessage('Invalid item ID'),
    body('status').isIn(['active', 'claimed', 'resolved']).withMessage('Invalid status'),
  ]),
  updateStatus
);

// DELETE /api/items/:id  — delete an item
router.delete('/:id', validate(idRule), deleteItem);

export default router;
