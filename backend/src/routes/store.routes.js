const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { ratingRules } = require('../utils/validators');

// All store routes require authentication + NORMAL_USER role
router.use(authenticate, requireRole('NORMAL_USER'));

// GET /api/stores — List stores with search
router.get('/', storeController.getStores);

// POST /api/stores/:id/ratings — Submit rating
router.post('/:id/ratings', ratingRules, validate, storeController.submitRating);

// PUT /api/stores/:id/ratings — Modify rating
router.put('/:id/ratings', ratingRules, validate, storeController.modifyRating);

module.exports = router;
