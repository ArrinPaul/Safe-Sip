const logger = require('../utils/logger');

// Central error handler
const errorHandler = (err, req, res, next) => {
  // Log error with request context
  logger.error('Application error:', {
    error: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.id || 'anonymous'
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.message === 'jwt expired') {
    statusCode = 401;
    message = 'Unauthorized';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
    code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflict';
    code = 'CONFLICT';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_RESOURCE';
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
      code = 'FILE_TOO_LARGE';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
      code = 'TOO_MANY_FILES';
    } else {
      message = 'File upload error';
      code = 'UPLOAD_ERROR';
    }
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON';
    code = 'INVALID_JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request entity too large';
    code = 'REQUEST_TOO_LARGE';
  }

  // Handle custom errors
  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }
  if (err.code) {
    code = err.code;
  }

  // Error response structure
  const errorResponse = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
    requestId: req.id
  };

  // Add validation details in development
  if (process.env.NODE_ENV === 'development' && err.details) {
    errorResponse.details = err.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id
  });

  res.status(404).json({
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.code = 'UNAUTHORIZED';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.code = 'FORBIDDEN';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = 'CONFLICT';
  }
}

class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.code = 'RATE_LIMIT_EXCEEDED';
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError
};