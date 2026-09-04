const authService = require('../services/auth.service');

/**
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;
    const user = await authService.registerUser({ name, email, password, address });
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'Account created successfully. Please log in.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser({ email, password });
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      data: { token, user },
      message: 'Login successful.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  res.json({
    success: true,
    data: null,
    message: 'Logged out successfully.',
    errors: [],
  });
};

/**
 * PUT /api/auth/password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(req.user.id, currentPassword, newPassword);
    
    res.json({
      success: true,
      data: null,
      message: 'Password updated successfully.',
      errors: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, logout, changePassword };
