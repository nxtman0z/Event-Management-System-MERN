const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/events
router.get('/', getEvents);

// @route   GET /api/events/my-events (must be before /:id to avoid conflict)
router.get('/my-events', auth, getMyEvents);

// @route   GET /api/events/:id
router.get('/:id', getEvent);

// @route   POST /api/events
router.post(
  '/',
  auth,
  authorize('organizer', 'admin'),
  upload.single('bannerImage'),
  [
    body('title', 'Event title is required').notEmpty().trim(),
    body('date', 'Event date is required').notEmpty(),
  ],
  createEvent
);

// @route   PUT /api/events/:id
router.put(
  '/:id',
  auth,
  upload.single('bannerImage'),
  updateEvent
);

// @route   DELETE /api/events/:id
router.delete('/:id', auth, deleteEvent);

module.exports = router;
