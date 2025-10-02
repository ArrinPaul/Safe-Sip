const logger = require('../utils/logger');

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS for production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Request ID middleware
const requestId = (req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// IP filtering middleware
const ipFilter = (req, res, next) => {
  const blockedIPs = process.env.BLOCKED_IPS?.split(',') || [];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (blockedIPs.includes(clientIP)) {
    logger.warn(`Blocked IP attempt: ${clientIP}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// User agent validation
const userAgentValidation = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  
  if (!userAgent) {
    logger.warn(`Request without User-Agent from IP: ${req.ip}`);
    return res.status(400).json({ error: 'User-Agent header required' });
  }
  
  // Block suspicious user agents
  const suspiciousAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i
  ];
  
  const isSuspicious = suspiciousAgents.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious && !req.path.startsWith('/api/health')) {
    logger.warn(`Suspicious User-Agent: ${userAgent} from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Request size validation
const requestSizeLimit = (req, res, next) => {
  const maxSize = parseInt(process.env.MAX_REQUEST_SIZE) || 10485760; // 10MB
  const contentLength = parseInt(req.get('Content-Length') || 0);
  
  if (contentLength > maxSize) {
    logger.warn(`Request too large: ${contentLength} bytes from IP: ${req.ip}`);
    return res.status(413).json({ error: 'Request entity too large' });
  }
  
  next();
};

// SQL injection detection
const sqlInjectionDetection = (req, res, next) => {
  const sqlPatterns = [
    /(\s*(=|'|--|#|\/\*|\*\/|;)|\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i
  ];
  
  const checkForSQLInjection = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        for (const pattern of sqlPatterns) {
          if (pattern.test(obj[key])) {
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkForSQLInjection(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };
  
  if (checkForSQLInjection(req.body) || checkForSQLInjection(req.query)) {
    logger.warn(`SQL injection attempt detected from IP: ${req.ip}`);
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  next();
};

// XSS detection
const xssDetection = (req, res, next) => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];
  
  const checkForXSS = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        for (const pattern of xssPatterns) {
          if (pattern.test(obj[key])) {
            return true;
          }
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkForXSS(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };
  
  if (checkForXSS(req.body) || checkForXSS(req.query)) {
    logger.warn(`XSS attempt detected from IP: ${req.ip}`);
    return res.status(400).json({ error: 'Invalid request' });
  }
  
  next();
};

// Path traversal detection
const pathTraversalDetection = (req, res, next) => {
  const pathTraversalPatterns = [
    /\.\./g,
    /\.\.\/|\.\.\\./g,
    /%2e%2e%2f|%2e%2e%5c/gi
  ];
  
  const fullUrl = req.originalUrl || req.url;
  
  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(fullUrl)) {
      logger.warn(`Path traversal attempt detected: ${fullUrl} from IP: ${req.ip}`);
      return res.status(400).json({ error: 'Invalid request' });
    }
  }
  
  next();
};

// Request logging for security analysis
const securityLogging = (req, res, next) => {
  const startTime = Date.now();
  
  // Log suspicious requests
  const suspiciousIndicators = [
    req.path.includes('admin'),
    req.path.includes('config'),
    req.path.includes('backup'),
    req.get('User-Agent')?.includes('scanner'),
    Object.keys(req.query).length > 10,
    JSON.stringify(req.body).length > 100000
  ];
  
  const isSuspicious = suspiciousIndicators.some(indicator => indicator);
  
  if (isSuspicious) {
    logger.warn('Suspicious request detected', {
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      requestId: req.id
    });
  }
  
  // Log response time for slow requests
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) { // Log requests taking more than 5 seconds
      logger.warn('Slow request detected', {
        ip: req.ip,
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        requestId: req.id
      });
    }
  });
  
  next();
};

// Honeypot middleware (detect automated attacks)
const honeypot = (req, res, next) => {
  // Check for honeypot field in forms
  if (req.body && req.body.website) {
    logger.warn(`Honeypot triggered from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Content type validation
const contentTypeValidation = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    
    if (!contentType) {
      return res.status(400).json({ error: 'Content-Type header required' });
    }
    
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ];
    
    const isAllowed = allowedTypes.some(type => contentType.startsWith(type));
    
    if (!isAllowed) {
      logger.warn(`Invalid Content-Type: ${contentType} from IP: ${req.ip}`);
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }
  }
  
  next();
};

// Combine all security middleware
const securityMiddleware = [
  requestId,
  securityHeaders,
  ipFilter,
  userAgentValidation,
  requestSizeLimit,
  sqlInjectionDetection,
  xssDetection,
  pathTraversalDetection,
  honeypot,
  contentTypeValidation,
  securityLogging
];

module.exports = securityMiddleware;