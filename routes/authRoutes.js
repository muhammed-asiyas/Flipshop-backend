const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;