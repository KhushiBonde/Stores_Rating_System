const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

/**
 * Get dashboard counts: total users, total stores, total ratings
 */
const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

/**
 * Create a new user (any role) — Admin only
 */
const createUser = async ({ name, email, password, address, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      address: address || null,
      role,
    },
    select: { id: true, name: true, email: true, role: true, address: true, createdAt: true },
  });

  return user;
};

/**
 * List users with filters, sorting, and pagination
 */
const getUsers = async ({ name, email, address, role, sortBy, order, page, limit }) => {
  const where = {};

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }
  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }
  if (address) {
    where.address = { contains: address, mode: 'insensitive' };
  }
  if (role) {
    where.role = role;
  }

  const orderBy = {};
  const sortField = sortBy || 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';
  orderBy[sortField] = sortOrder;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, address: true, createdAt: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get user by ID with store rating if store owner
 */
const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // If store owner, also fetch their store's average rating
  if (user.role === 'STORE_OWNER') {
    const store = await prisma.store.findFirst({
      where: { ownerId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ratings: {
          select: { rating: true },
        },
      },
    });

    if (store) {
      const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : null;

      user.store = {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
        totalRatings: store.ratings.length,
      };
    }
  }

  return user;
};

/**
 * Create a new store — Admin only
 */
const createStore = async ({ name, email, address, ownerId }) => {
  const existing = await prisma.store.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('A store with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // If ownerId provided, verify the user exists and is a STORE_OWNER
  if (ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: parseInt(ownerId) } });
    if (!owner) {
      const error = new Error('Owner user not found.');
      error.statusCode = 404;
      throw error;
    }
    if (owner.role !== 'STORE_OWNER') {
      const error = new Error('The assigned owner must have the STORE_OWNER role.');
      error.statusCode = 400;
      throw error;
    }
    // Check if owner already has a store
    const existingStore = await prisma.store.findFirst({ where: { ownerId: parseInt(ownerId) } });
    if (existingStore) {
      const error = new Error('This store owner already has a store assigned.');
      error.statusCode = 409;
      throw error;
    }
  }

  const store = await prisma.store.create({
    data: {
      name,
      email,
      address: address || null,
      ownerId: ownerId ? parseInt(ownerId) : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ownerId: true,
      createdAt: true,
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return store;
};

/**
 * List stores with filters, sorting, and pagination — Admin view
 */
const getStores = async ({ name, email, address, sortBy, order, page, limit }) => {
  const where = {};

  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }
  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }
  if (address) {
    where.address = { contains: address, mode: 'insensitive' };
  }

  const orderBy = {};
  const sortField = sortBy || 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';
  
  // Handle sorting by rating (computed field)
  if (sortField === 'rating') {
    // We'll sort after fetching
  } else {
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
        ownerId: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
        ratings: {
          select: { rating: true },
        },
      },
      orderBy: sortField !== 'rating' ? orderBy : undefined,
      skip,
      take: limit,
    }),
    prisma.store.count({ where }),
  ]);

  // Compute average rating for each store
  const storesWithRating = stores.map((store) => {
    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : null;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.ownerId,
      owner: store.owner,
      averageRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
      totalRatings: store.ratings.length,
      createdAt: store.createdAt,
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

module.exports = {
  getDashboardStats,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
