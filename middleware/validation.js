const { body, param, query, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errorMessages
    });
  }
  
  next();
};

// User registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('role')
    .optional()
    .isIn(['ADMIN', 'HEALTH_OFFICIAL', 'ASHA_WORKER', 'PHC_STAFF'])
    .withMessage('Invalid role specified'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Invalid phone number format'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Invalid phone number format'),
  
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  
  body('district')
    .optional()
    .isLength({ max: 100 })
    .withMessage('District must not exceed 100 characters'),
  
  body('state')
    .optional()
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),
  
  body('pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Invalid pincode format'),
  
  handleValidationErrors
];

// Village validation
const validateVillage = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Village name must be between 1 and 100 characters'),
  
  body('district')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('District must be between 1 and 100 characters'),
  
  body('state')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('State must be between 1 and 100 characters'),
  
  body('population')
    .isInt({ min: 1 })
    .withMessage('Population must be a positive integer'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// Health report validation
const validateHealthReport = [
  body('villageId')
    .isUUID()
    .withMessage('Invalid village ID'),
  
  body('disease')
    .isIn(['CHOLERA', 'TYPHOID', 'DIARRHEA', 'HEPATITIS_A', 'DYSENTERY', 'OTHER'])
    .withMessage('Invalid disease type'),
  
  body('cases')
    .isInt({ min: 0 })
    .withMessage('Cases must be a non-negative integer'),
  
  body('deaths')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Deaths must be a non-negative integer'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  
  body('symptoms.*')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Each symptom must not exceed 100 characters'),
  
  handleValidationErrors
];

// Water quality report validation
const validateWaterQualityReport = [
  body('villageId')
    .isUUID()
    .withMessage('Invalid village ID'),
  
  body('source')
    .isIn(['WELL', 'BOREWELL', 'RIVER', 'POND', 'TANK', 'PIPELINE', 'OTHER'])
    .withMessage('Invalid water source'),
  
  body('ph')
    .optional()
    .isFloat({ min: 0, max: 14 })
    .withMessage('pH must be between 0 and 14'),
  
  body('turbidity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Turbidity must be a non-negative number'),
  
  body('chlorine')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Chlorine must be a non-negative number'),
  
  body('ecoli')
    .optional()
    .isBoolean()
    .withMessage('E.coli must be a boolean value'),
  
  body('coliform')
    .optional()
    .isBoolean()
    .withMessage('Coliform must be a boolean value'),
  
  handleValidationErrors
];

// ML prediction validation
const validatePrediction = [
  body('features')
    .isArray({ min: 1 })
    .withMessage('Features must be a non-empty array'),
  
  body('features.*')
    .isNumeric()
    .withMessage('All features must be numeric values'),
  
  body('modelType')
    .optional()
    .isIn(['disease', 'outbreak', 'risk'])
    .withMessage('Invalid model type'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('Sort field must not exceed 50 characters'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either "asc" or "desc"'),
  
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('type')
    .optional()
    .isIn(['villages', 'reports', 'users'])
    .withMessage('Invalid search type'),
  
  handleValidationErrors
];

// Date range validation
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (req.query.startDate && value && new Date(value) < new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Sanitize input
const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        value[key] = sanitizeValue(value[key]);
      }
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validatePasswordChange,
  validateProfileUpdate,
  validateVillage,
  validateHealthReport,
  validateWaterQualityReport,
  validatePrediction,
  validateId,
  validatePagination,
  validateSearch,
  validateDateRange,
  sanitizeInput
};