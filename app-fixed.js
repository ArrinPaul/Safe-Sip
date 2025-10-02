// SafeSip Server - Fixed Version
const express = require('express');
const path = require('path');
const http = require('http');
require('dotenv').config();

console.log('🚀 Starting SafeSip Server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Environment variables with defaults
const {
  NODE_ENV = 'development',
  PORT = 5000,
  JWT_SECRET,
  SESSION_SECRET
} = process.env;

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Root route - fix for 404 errors
app.get('/', (req, res) => {
  res.json({
    message: '🌊 SafeSip Server is running!',
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    server: 'SafeSip',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connecting...',
      api: 'active',
      ml: 'initializing...'
    }
  });
});

// Test data endpoint
app.get('/api/test-data', (req, res) => {
  res.json({
    message: 'Test data endpoint',
    data: {
      waterQuality: {
        ph: 7.2,
        turbidity: 2.1,
        chlorine: 0.5,
        status: 'safe'
      },
      location: 'Delhi',
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handler
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.log('❌ Forcing exit...');
    process.exit(1);
  }, 10000);
});

// Start server
const startServer = async () => {
  try {
    // Validate required environment variables
    if (!JWT_SECRET || !SESSION_SECRET) {
      console.warn('⚠️  Missing JWT_SECRET or SESSION_SECRET - using defaults for development');
    }

    server.listen(PORT, () => {
      console.log('🌊 SafeSip Server running on port', PORT);
      console.log('📊 Environment:', NODE_ENV);
      console.log('🔒 Security: Enhanced');
      console.log('🚀 Ready for connections');
      console.log(`📍 URL: http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();