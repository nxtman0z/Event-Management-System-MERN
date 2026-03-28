const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
router.get('/profile', auth, getProfile);

// @route   PUT /api/users/profile
router.put(
  '/profile',
  auth,
  upload.single('avatar'),
  [
    body('name', 'Name must be at least 2 characters').optional().isLength({ min: 2 }),
    body('email', 'Please provide a valid email').optional().isEmail().normalizeEmail(),
  ],
  updateProfile
);

// @route   PUT /api/users/change-password
router.put('/change-password', auth, changePassword);

module.exports = router;
