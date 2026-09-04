const prisma = require('../config/prisma');

/**
 * List stores with search, pagination, and user's own rating per store
 */
const getStoresForUser = async (userId, { name, address, sortBy, order, page, limit }) => {
  const where = {};

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }
  if (address) {
    where.address = { contains: address, mode: 'insensitive' };
  }

  const orderBy = {};
  const sortField = sortBy || 'name';
  const sortOrder = order === 'desc' ? 'desc' : 'asc';

  if (sortField !== 'rating') {
    orderBy[sortField] = sortOrder;
  }

  const skip = (page - 1) * limit;

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ratings: {
          select: { rating: true, userId: true },
        },
      },
      orderBy: sortField !== 'rating' ? orderBy : undefined,
      skip,
      take: limit,
    }),
    prisma.store.count({ where }),
  ]);

  // Compute average rating and find user's own rating per store
  const storesWithRating = stores.map((store) => {
    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : null;

    const userRating = store.ratings.find((r) => r.userId === userId);

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
      totalRatings: store.ratings.length,
      userRating: userRating ? userRating.rating : null,
    };
  });

  // Sort by rating if requested
  if (sortField === 'rating') {
    storesWithRating.sort((a, b) => {
      const rA = a.averageRating || 0;
      const rB = b.averageRating || 0;
      return sortOrder === 'asc' ? rA - rB : rB - rA;
    });
  }

  return {
    stores: storesWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Submit or update rating (upsert — one rating per user per store)
 */
const submitRating = async (userId, storeId, ratingValue) => {
  // Check store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    const error = new Error('Store not found.');
    error.statusCode = 404;
    throw error;
  }

  // Upsert: create or update the user's rating for this store
  const rating = await prisma.rating.upsert({
    where: {
      unique_user_store_rating: {
        userId,
        storeId,
      },
    },
    update: {
      rating: ratingValue,
    },
    create: {
      userId,
      storeId,
      rating: ratingValue,
    },
    select: {
      id: true,
      userId: true,
      storeId: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Get updated average
  const allRatings = await prisma.rating.findMany({
    where: { storeId },
    select: { rating: true },
  });
  const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

  return {
    rating,
    storeAverageRating: parseFloat(avgRating.toFixed(1)),
    totalRatings: allRatings.length,
  };
};

module.exports = { getStoresForUser, submitRating };
