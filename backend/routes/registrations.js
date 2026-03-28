const express = require('express');
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
} = require('../controllers/registrationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations/register/:eventId
router.post('/register/:eventId', auth, registerForEvent);

// @route   DELETE /api/registrations/cancel/:eventId
router.delete('/cancel/:eventId', auth, cancelRegistration);

// @route   GET /api/registrations/my-registrations
router.get('/my-registrations', auth, getMyRegistrations);

// @route   GET /api/registrations/event/:eventId
router.get('/event/:eventId', auth, getEventRegistrations);

module.exports = router;
