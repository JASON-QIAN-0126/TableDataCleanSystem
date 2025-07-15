const jwt = require('jsonwebtoken');
const db = require('../config/database');

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const getUserById = (req, res, next) => {
  const userId = req.user.id;
  
  db.get('SELECT id, username, email, avatar FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.currentUser = user;
    next();
  });
};

// 生成JWT token的辅助函数
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = { 
  authenticateToken, 
  getUserById, 
  JWT_SECRET, 
  JWT_EXPIRES_IN,
  generateToken 
}; 