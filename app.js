// SafeSip Production Server - Secure, Scalable, and Feature-Complete
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const { body, validationResult, param, query } = require('express-validator');
const multer = require('multer');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Optional Sharp import for image processing
let sharp = null;
try {
  sharp = require('sharp');
} catch (error) {
  console.warn('Sharp not available, image optimization disabled:', error.message);
}

// Import custom modules with error handling
let apiRoutes, authRoutes, logger, errorHandler, authMiddleware, validationMiddleware, securityMiddleware;

try {
  logger = require('./utils/logger');
  console.log('✅ Logger loaded');
} catch (err) {
  console.warn('⚠️  Logger failed to load:', err.message);
  // Fallback console logger
  logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.log
  };
}

try {
  apiRoutes = require('./routes/api');
  console.log('✅ API routes loaded');
} catch (err) {
  console.warn('⚠️  API routes failed to load:', err.message);
  apiRoutes = null;
}

try {
  authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.warn('⚠️  Auth routes failed to load:', err.message);
  authRoutes = null;
}

try {
  ({ errorHandler } = require('./middleware/errorHandler'));
  console.log('✅ Error handler loaded');
} catch (err) {
  console.warn('⚠️  Error handler failed to load:', err.message);
  errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };
}

try {
  authMiddleware = require('./middleware/auth');
  validationMiddleware = require('./middleware/validation');
  securityMiddleware = require('./middleware/security');
  console.log('✅ Middleware loaded');
} catch (err) {
  console.warn('⚠️  Middleware failed to load:', err.message);
}

// Initialize Express app
const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

// Environment variables with defaults
const {
  NODE_ENV = 'development',
  PORT = 5000,
  REDIS_URL,
  SESSION_SECRET,
  JWT_SECRET,
  CORS_ORIGIN,
  MAX_FILE_SIZE = 10485760, // 10MB
  UPLOAD_PATH = './uploads',
  RATE_LIMIT_WINDOW = 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS = 100
} = process.env;

// Validate required environment variables
const requiredEnvVars = ['SESSION_SECRET', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0 && NODE_ENV === 'production') {
  logger.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Redis client setup (disabled for development)
let redisClient = null;
let RedisStore = null;
if (NODE_ENV === 'production' && REDIS_URL) {
  try {
    const redis = require('redis');
    RedisStore = require('connect-redis')(session);
    redisClient = redis.createClient({ url: REDIS_URL });
    redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
    redisClient.connect().catch(logger.error);
    logger.info('Redis client initialized');
  } catch (error) {
    logger.warn('Redis not available:', error.message);
  }
} else {
  logger.info('Redis disabled for development mode');
}

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Trust proxy (important for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(compression());

// Rate limiting
const createRateLimit = (windowMs, max, skipSuccessfulRequests = false) => rateLimit({
  windowMs,
  max,
  skipSuccessfulRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Global rate limiting
app.use('/api/', createRateLimit(parseInt(RATE_LIMIT_WINDOW), parseInt(RATE_LIMIT_MAX_REQUESTS)));

// Stricter rate limiting for auth endpoints
app.use('/auth/', createRateLimit(900000, 5)); // 5 requests per 15 minutes

// Additional rate limiting for auth endpoints (using express-rate-limit only)
app.use('/auth/', createRateLimit(600000, 3)); // 3 requests per 10 minutes

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Clerk auth middleware attaches req.auth with userId/sessionId
app.use(ClerkExpressWithAuth());

// Logging middleware
const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Session configuration
const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'safesip.sid',
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: NODE_ENV === 'production' ? 'strict' : 'lax'
  }
};

if (redisClient && RedisStore) {
  sessionConfig.store = new RedisStore({ client: redisClient });
}

app.use(session(sessionConfig));

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(UPLOAD_PATH, { recursive: true });
      cb(null, UPLOAD_PATH);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(MAX_FILE_SIZE),
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || 
      ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Static files
app.use('/uploads', express.static(UPLOAD_PATH));
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
}

// Custom middleware
app.use(securityMiddleware);

// Root route for health checks
app.get('/', (req, res) => {
  res.json({
    message: '🌊 SafeSip Server is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Root route - fix for 404 errors
app.get('/', (req, res) => {
  res.json({
    message: '🌊 SafeSip Server is running!',
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    endpoints: {
      health: '/api/health',
      api: '/api',
      auth: '/auth'
    }
  });
});

// API Routes
if (apiRoutes) {
  app.use('/api', apiRoutes);
  console.log('✅ API routes mounted');
} else {
  console.warn('⚠️  API routes not available');
}

if (authRoutes) {
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes mounted');
} else {
  console.warn('⚠️  Auth routes not available');
}

// File upload endpoint
app.post('/api/upload', 
  authMiddleware.authenticate,
  upload.array('files', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const processedFiles = [];
      
      for (const file of req.files) {
        // Process images with Sharp (if available)
        if (file.mimetype.startsWith('image/') && sharp) {
          try {
            const optimizedPath = path.join(UPLOAD_PATH, `optimized-${file.filename}`);
            
            await sharp(file.path)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toFile(optimizedPath);
            
            // Remove original and rename optimized
            await fs.unlink(file.path);
            await fs.rename(optimizedPath, file.path);
          } catch (sharpError) {
            logger.warn('Image optimization failed, keeping original:', sharpError.message);
          }
        }

        processedFiles.push({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: `/uploads/${file.filename}`
        });
      }

      res.json({
        success: true,
        files: processedFiles
      });
    } catch (error) {
      logger.error('File upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  }
);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    let redisStatus = 'disconnected';
    if (redisClient) {
      try {
        await redisClient.ping();
        redisStatus = 'connected';
      } catch (error) {
        redisStatus = 'error';
      }
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: require('./package.json').version,
      environment: NODE_ENV,
      services: {
        database: 'connected',
        redis: redisStatus,
        websocket: 'active'
      },
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-room', (room) => {
    socket.join(room);
    logger.info(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    logger.info(`Socket ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Serve React app for all non-API routes
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
} else {
  // In development, provide a helpful message for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({
      message: 'SafeSip Development Server',
      note: 'React app should be running on http://localhost:3000',
      backend: 'http://localhost:5000',
      health: 'http://localhost:5000/api/health'
    });
  });
}

// Error handling
app.use(errorHandler);

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (dbError) {
      logger.warn('⚠️  Database connection failed, continuing without database:', dbError.message);
    }
    
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`🌊 SafeSip Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${NODE_ENV}`);
      logger.info(`🔒 Security: Enhanced`);
      logger.info(`🚀 Ready for connections`);
      logger.info(`📍 URL: http://localhost:${PORT}`);
      
      // Verify server is actually listening
      const address = server.address();
      if (address) {
        logger.info(`✅ Server bound to ${address.address}:${address.port}`);
      }
    });

    server.on('error', (err) => {
      logger.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
process.on('SIGINT', () => {
  logger.info('🛑 Received SIGINT. Shutting down gracefully...');
  
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('✅ Database disconnected');
      
      if (redisClient) {
        await redisClient.quit();
        logger.info('✅ Redis disconnected');
      }
      
      logger.info('✅ Server closed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('❌ Forcing exit...');
    process.exit(1);
  }, 10000);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Received SIGTERM. Shutting down gracefully...');
  process.kill(process.pid, 'SIGINT');
});

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, server, io, prisma };