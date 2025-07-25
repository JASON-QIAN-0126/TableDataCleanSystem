import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db, { ensureDbReady } from '../config/database.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', ensureDbReady, [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error' 
        });
      }
      
      if (user) {
        return res.status(400).json({ 
          success: false,
          error: 'Username or email already exists' 
        });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user
        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function(err) {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ 
                success: false,
                error: 'Failed to create user' 
              });
            }

            // Generate JWT token
            const token = generateToken({ id: this.lastID, username, email });

            res.status(201).json({
              success: true,
              message: 'User created successfully',
              token,
              user: {
                id: this.lastID,
                username,
                email,
                avatar: 'default-avatar.png'
              }
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({ 
          success: false,
          error: 'Server error' 
        });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Login
router.post('/login', ensureDbReady, [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error' 
        });
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid credentials' 
        });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ 
            success: false,
            error: 'Invalid credentials' 
          });
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, username: user.username, email: user.email });

        res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
          }
        });
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        res.status(500).json({ 
          success: false,
          error: 'Server error' 
        });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Get current user
router.get('/me', ensureDbReady, authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  });
});

// Update user profile
router.put('/update-profile', ensureDbReady, authenticateToken, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { username } = req.body;
    const userId = req.user.id;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    // Check if username is already taken by another user
    db.get('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId], (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error' 
        });
      }
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: 'Username already taken' 
        });
      }

      // Update username
      db.run('UPDATE users SET username = ? WHERE id = ?', [username, userId], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Database error' 
          });
        }

        // Get updated user data
        db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [userId], (err, user) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
              success: false,
              error: 'Database error' 
            });
          }

          res.json({
            success: true,
            message: 'Profile updated successfully',
            user
          });
        });
      });
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Logout (client-side token removal, but we can add server-side blacklist if needed)
router.post('/logout', ensureDbReady, authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router; 