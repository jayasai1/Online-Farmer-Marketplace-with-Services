import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/auth - Check active session
router.get('/', async (req, res) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.json(null);
  }
});

// POST /api/auth - Login / Register / Logout depending on body action parameter (AJAX Fetch compatibility)
router.post('/', async (req, res) => {
  const { action } = req.body;

  if (action === 'login') {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        req.session.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
        };
        res.json({ success: true, user: req.session.user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server auth login error.' });
    }
  } 
  
  else if (action === 'register') {
    const { username, email, phone, role, location, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Registration failed. Email might already exist.' });
      }

      const user = await User.create({
        username,
        email,
        phone,
        role,
        location,
        password,
      });

      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
      };

      res.status(201).json({ success: true, user: req.session.user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Registration database error.' });
    }
  } 
  
  else if (action === 'logout') {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed.' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  } 
  
  else {
    res.status(400).json({ success: false, message: 'Invalid action.' });
  }
});

export default router;
