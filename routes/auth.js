const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const validation = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, UnauthorizedError, ConflictError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const emailService = require('../utils/emailService');

const prisma = new PrismaClient();

// Register
router.post('/register', 
  validation.validateRegistration,
  asyncHandler(async (req, res) => {
    const { email, username, password, firstName, lastName, role = 'ASHA_WORKER', phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictError(
        existingUser.email === email ? 'Email already registered' : 'Username already taken'
      );
    }

    // Hash password
    const hashedPassword = await authMiddleware.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        profile: {
          create: {
            phone
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = authMiddleware.generateTokens(user);

    // Set cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send welcome email (async, don't wait)
    emailService.sendWelcomeEmail(user.email, user.firstName).catch(error => {
      logger.error('Failed to send welcome email:', error);
    });

    logger.info(`New user registered: ${user.email}`, { userId: user.id });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    });
  })
);

// Login
router.post('/login',
  authMiddleware.loginLimiter,
  authMiddleware.checkAccountLockout,
  validation.validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        password: true,
        isActive: true,
        failedLoginAttempts: true,
        lockoutUntil: true
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isValidPassword = await authMiddleware.comparePassword(password, user.password);

    if (!isValidPassword) {
      // Handle failed login
      const isLocked = await authMiddleware.handleFailedLogin(user.id);
      
      if (isLocked) {
        throw new UnauthorizedError('Account locked due to too many failed attempts');
      }
      
      throw new UnauthorizedError('Invalid credentials');
    }

    // Handle successful login
    await authMiddleware.handleSuccessfulLogin(user.id);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Generate tokens
    const { accessToken, refreshToken } = authMiddleware.generateTokens(userWithoutPassword);

    // Set cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Store session data
    req.session.user = userWithoutPassword;
    req.session.token = accessToken;

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken
      }
    });
  })
);

// Logout
router.post('/logout',
  asyncHandler(async (req, res) => {
    // Clear cookie
    res.clearCookie('token');

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        logger.error('Session destruction error:', err);
      }
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

// Refresh token
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    try {
      const decoded = authMiddleware.verifyRefreshToken(refreshToken);
      
      // Find user
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

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new tokens
      const tokens = authMiddleware.generateTokens(user);

      // Set cookie
      res.cookie('token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        success: true,
        tokens
      });
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  })
);

// Verify token
router.get('/verify',
  authMiddleware.authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      user: req.user
    });
  })
);

// Get current user profile
router.get('/profile',
  authMiddleware.authenticate,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        profile: {
          select: {
            phone: true,
            address: true,
            district: true,
            state: true,
            pincode: true,
            profilePicture: true,
            bio: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      user
    });
  })
);

// Update profile
router.put('/profile',
  authMiddleware.authenticate,
  validation.validateProfileUpdate,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, phone, address, district, state, pincode, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        profile: {
          upsert: {
            create: {
              phone,
              address,
              district,
              state,
              pincode,
              bio
            },
            update: {
              phone,
              address,
              district,
              state,
              pincode,
              bio
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        profile: {
          select: {
            phone: true,
            address: true,
            district: true,
            state: true,
            pincode: true,
            bio: true
          }
        }
      }
    });

    logger.info(`Profile updated: ${req.user.email}`, { userId: req.user.id });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  })
);

// Change password
router.put('/password',
  authMiddleware.authenticate,
  validation.validatePasswordChange,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValidPassword = await authMiddleware.comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await authMiddleware.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    logger.info(`Password changed: ${req.user.email}`, { userId: req.user.id });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

// Forgot password
router.post('/forgot-password',
  validation.validatePasswordReset,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        isActive: true
      }
    });

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send reset email (async, don't wait)
    emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken).catch(error => {
      logger.error('Failed to send password reset email:', error);
    });

    logger.info(`Password reset requested: ${email}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
  })
);

// Reset password
router.post('/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ValidationError('Token and new password are required');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        },
        isActive: true
      }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await authMiddleware.hashPassword(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockoutUntil: null
      }
    });

    logger.info(`Password reset completed: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  })
);

module.exports = router;