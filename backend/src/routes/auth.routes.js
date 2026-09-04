const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { signupRules, loginRules, changePasswordRules } = require('../utils/validators');

// POST /api/auth/signup — Public normal user registration
router.post('/signup', signupRules, validate, authController.signup);

// POST /api/auth/login — Unified login for all roles
router.post('/login', loginRules, validate, authController.login);

// POST /api/auth/logout — Clear session/JWT
router.post('/logout', authController.logout);

// PUT /api/auth/password — Change own password (authenticated)
router.put('/password', authenticate, changePasswordRules, validate, authController.changePassword);

module.exports = router;
