const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');

// Import the auth middleware correctly - it's exported as an object
const { auth } = require('../middleware/auth'); // Note: destructuring here

// Public routes (no auth needed)
router.post('/login', login);
router.post('/register', register);

// Protected routes (auth required)
router.get('/me', auth, getMe);  // Use 'auth' not 'authMiddleware'

module.exports = router;