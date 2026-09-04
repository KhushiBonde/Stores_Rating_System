const adminService = require('../services/admin.service');

/**
 * GET /api/admin/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({
      success: true,
      data: stats,
      message: 'Dashboard data retrieved.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;
    const user = await adminService.createUser({ name, email, password, address, role });
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await adminService.getUsers({
      name, email, address, role,
      sortBy, order,
      page, limit,
    });

    res.json({
      success: true,
      data: result,
      message: 'Users retrieved.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await adminService.getUserById(userId);
    res.json({
      success: true,
      data: user,
      message: 'User details retrieved.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/stores
 */
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await adminService.createStore({ name, email, address, ownerId });
    res.status(201).json({
      success: true,
      data: store,
      message: 'Store created successfully.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stores
 */
const getStores = async (req, res, next) => {
  try {
    const { name, email, address, sortBy, order } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await adminService.getStores({
      name, email, address,
      sortBy, order,
      page, limit,
    });

    res.json({
      success: true,
      data: result,
      message: 'Stores retrieved.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
