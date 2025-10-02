const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies.token || 
                  req.session.token;

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true
        }
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ 
          error: 'User not found or inactive.',
          code: 'USER_INACTIVE'
        });
      }

      req.user = user;
      next();
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired.',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Authentication service error' });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies.token || 
                  req.session.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true
          }
        });

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (tokenError) {
        // Ignore token errors for optional auth
      }
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even if auth fails
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Generate JWT tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'safesip',
    audience: 'safesip-users'
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'safesip',
    audience: 'safesip-users'
  });

  return { accessToken, refreshToken };
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Login attempt limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many login attempts, please try again later.',
    code: 'TOO_MANY_ATTEMPTS'
  }
});

// Account lockout functionality
const checkAccountLockout = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        isActive: true,
        failedLoginAttempts: true,
        lockoutUntil: true
      }
    });

    if (!user) {
      return next();
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const lockoutTime = Math.ceil((user.lockoutUntil - new Date()) / 60000);
      return res.status(423).json({
        error: `Account is locked. Try again in ${lockoutTime} minutes.`,
        code: 'ACCOUNT_LOCKED',
        lockoutTime
      });
    }

    // Clear lockout if time has passed
    if (user.lockoutUntil && user.lockoutUntil <= new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null
        }
      });
    }

    req.userForLockout = user;
    next();
  } catch (error) {
    logger.error('Account lockout check error:', error);
    next();
  }
};

// Handle failed login
const handleFailedLogin = async (userId) => {
  try {
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockoutTime = parseInt(process.env.LOCKOUT_TIME) || 15; // minutes

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true }
    });

    const attempts = (user?.failedLoginAttempts || 0) + 1;
    const updateData = { failedLoginAttempts: attempts };

    if (attempts >= maxAttempts) {
      updateData.lockoutUntil = new Date(Date.now() + lockoutTime * 60 * 1000);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return attempts >= maxAttempts;
  } catch (error) {
    logger.error('Handle failed login error:', error);
    return false;
  }
};

// Handle successful login
const handleSuccessfulLogin = async (userId) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLogin: new Date()
      }
    });
  } catch (error) {
    logger.error('Handle successful login error:', error);
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  generateTokens,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
  loginLimiter,
  checkAccountLockout,
  handleFailedLogin,
  handleSuccessfulLogin
};