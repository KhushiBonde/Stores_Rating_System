const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createUserRules, createStoreRules } = require('../utils/validators');

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireRole('ADMIN'));

// GET /api/admin/dashboard — Dashboard stats
router.get('/dashboard', adminController.getDashboard);

// POST /api/admin/users — Create user (any role)
router.post('/users', createUserRules, validate, adminController.createUser);

// GET /api/admin/users — List users with filters + sort + pagination
router.get('/users', adminController.getUsers);

// GET /api/admin/users/:id — User detail
router.get('/users/:id', adminController.getUserById);

// POST /api/admin/stores — Create store
router.post('/stores', createStoreRules, validate, adminController.createStore);

// GET /api/admin/stores — List stores with filters + sort + pagination
router.get('/stores', adminController.getStores);

module.exports = router;
