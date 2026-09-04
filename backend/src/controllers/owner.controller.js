const ownerService = require('../services/owner.service');

/**
 * GET /api/owner/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const result = await ownerService.getOwnerDashboard(req.user.id);
    res.json({
      success: true,
      data: result,
      message: 'Owner dashboard data retrieved.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
