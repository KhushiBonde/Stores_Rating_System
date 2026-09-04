const storeService = require('../services/store.service');

/**
 * GET /api/stores
 */
const getStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, order } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await storeService.getStoresForUser(req.user.id, {
      name, address, sortBy, order, page, limit,
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

/**
 * POST /api/stores/:id/ratings — Submit rating
 */
const submitRating = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    const { rating } = req.body;

    const result = await storeService.submitRating(req.user.id, storeId, rating);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Rating submitted successfully.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/stores/:id/ratings — Modify rating
 */
const modifyRating = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    const { rating } = req.body;

    const result = await storeService.submitRating(req.user.id, storeId, rating);

    res.json({
      success: true,
      data: result,
      message: 'Rating updated successfully.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStores, submitRating, modifyRating };
