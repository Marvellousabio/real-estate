import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      blog: process.env.BLOG_SERVICE_URL || 'http://localhost:5001',
      property: process.env.PROPERTY_SERVICE_URL || 'http://localhost:5002',
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5003'
    }
  });
});

// Service URLs
const BLOG_SERVICE_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:5001';
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:5002';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5003';

// Proxy middleware options
const proxyOptions = {
  changeOrigin: true,
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      error: 'Service temporarily unavailable'
    });
  }
};

// Blog service proxy
app.use('/api/blog', createProxyMiddleware({
  target: BLOG_SERVICE_URL,
  ...proxyOptions,
  pathRewrite: {
    '^/api/blog': '/api/blog'
  }
}));

// Property service proxy
app.use('/api/properties', createProxyMiddleware({
  target: PROPERTY_SERVICE_URL,
  ...proxyOptions,
  pathRewrite: {
    '^/api/properties': '/api/properties'
  }
}));

// Auth service proxy (for now, we'll keep auth in the main backend)
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  ...proxyOptions,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  }
}));

// Favorites proxy (for now, keep in main backend)
app.use('/api/favorites', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  ...proxyOptions,
  pathRewrite: {
    '^/api/favorites': '/api/favorites'
  }
}));

// Admin routes proxy
app.use('/api/admin', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  ...proxyOptions,
  pathRewrite: {
    '^/api/admin': '/api/admin'
  }
}));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found in API Gateway',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Blog Service: ${BLOG_SERVICE_URL}`);
  console.log(`🏠 Property Service: ${PROPERTY_SERVICE_URL}`);
  console.log(`🔐 Auth Service: ${AUTH_SERVICE_URL}`);
});

export default app;