const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// POST /register - register a new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password, role });

    // Send welcome email
    await sendEmail(email, 'Welcome to Student File Sharing', `Hello ${email},\n\nWelcome to our platform! You have successfully registered.\n\nBest regards,\nThe Team`);

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /login - login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });

      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /logout - logout user (client-side token removal)
router.post('/logout', (req, res) => {
  // Since JWT is stateless, just return success
  // Client should remove token from storage
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
