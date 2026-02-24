const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createFeedback,
  getAllFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules for feedback
const feedbackValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['bug', 'feature', 'improvement', 'general'])
    .withMessage('Invalid category'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

// All routes require authentication
router.use(protect);

// User routes
router.post('/', authorize('user'), feedbackValidation, createFeedback);
router.get('/', authorize('user'), getMyFeedback);

// Admin route - get all feedback
router.get('/all', authorize('admin'), getAllFeedback);

// Shared routes
router.get('/:id', getFeedbackById);
router.put('/:id', authorize('user'), feedbackValidation, updateFeedback);
router.delete('/:id', authorize('user'), deleteFeedback);

module.exports = router;
