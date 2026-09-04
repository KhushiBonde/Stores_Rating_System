const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// All owner routes require authentication + STORE_OWNER role
router.use(authenticate, requireRole('STORE_OWNER'));

// GET /api/owner/dashboard — Avg rating + list of raters
router.get('/dashboard', ownerController.getDashboard);

module.exports = router;
