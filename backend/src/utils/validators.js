const { body, param, query } = require('express-validator');

// Password regex: 8-16 chars, at least 1 uppercase, at least 1 special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

/**
 * Signup validation rules
 */
const signupRules = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password must be 8-16 characters with at least 1 uppercase letter and 1 special character (!@#$%^&*).'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
];

/**
 * Login validation rules
 */
const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

/**
 * Change password validation rules
 */
const changePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .matches(passwordRegex)
    .withMessage('New password must be 8-16 characters with at least 1 uppercase letter and 1 special character (!@#$%^&*).'),
];

/**
 * Admin: create user validation rules
 */
const createUserRules = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .matches(passwordRegex)
    .withMessage('Password must be 8-16 characters with at least 1 uppercase letter and 1 special character (!@#$%^&*).'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('role')
    .isIn(['ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be one of: ADMIN, NORMAL_USER, STORE_OWNER.'),
];

/**
 * Admin: create store validation rules
 */
const createStoreRules = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name is required and must not exceed 60 characters.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid store email address.'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('ownerId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Owner ID must be a valid positive integer.'),
];

/**
 * Rating validation rules
 */
const ratingRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a valid positive integer.'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
];

module.exports = {
  signupRules,
  loginRules,
  changePasswordRules,
  createUserRules,
  createStoreRules,
  ratingRules,
};
