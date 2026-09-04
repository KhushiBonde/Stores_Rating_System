const prisma = require('../config/prisma');

/**
 * Get store owner dashboard: list of raters + avg rating for their store
 */
const getOwnerDashboard = async (ownerId) => {
  // Find the store owned by this user
  const store = await prisma.store.findFirst({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          id: true,
          rating: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!store) {
    return {
      store: null,
      raters: [],
      averageRating: null,
      totalRatings: 0,
    };
  }

  const avgRating = store.ratings.length > 0
    ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
    : null;

  const raters = store.ratings.map((r) => ({
    id: r.id,
    userName: r.user.name,
    userEmail: r.user.email,
    rating: r.rating,
    ratedAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    raters,
    averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
    totalRatings: store.ratings.length,
  };
};

module.exports = { getOwnerDashboard };
