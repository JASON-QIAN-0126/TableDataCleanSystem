const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS配置
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_PRODUCTION_URL || 'https://data-clean-frontend.vercel.app',
        'https://data-clean-frontend.vercel.app'
      ]
    : [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5173'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: corsOptions.origin
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'DataClean Auth API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      register: '/api/auth/register',
      login: '/api/auth/login',
      me: '/api/auth/me'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Auth server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS origins: ${corsOptions.origin.join(', ')}`);
  });
}

// Export for Vercel
module.exports = app; 