const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');

dotenv.config(); // 加载 .env 文件变量

const app = express();
const PORT = process.env.PORT || 8000;

// 允许的前端域名（本地 + 生产）
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      process.env.FRONTEND_PRODUCTION_URL || 'https://data-clean-frontend.vercel.app',
      'https://data-clean-frontend.vercel.app',
      'https://www.jasonq.fun',
      'https://jasonq.fun'
    ]
  : [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // 允许 Postman / curl 无 origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy does not allow this origin: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
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
    allowedOrigins
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

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 本地运行用 listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Auth server is running at http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Allowed origins:\n${allowedOrigins.join('\n')}`);
  });
}

module.exports = app;