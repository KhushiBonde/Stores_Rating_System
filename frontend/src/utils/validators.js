/**
 * Frontend validation rules matching backend express-validator rules
 */

export const validateName = (name) => {
  if (!name || name.trim().length < 20) {
    return 'Name must be at least 20 characters.';
  }
  if (name.trim().length > 60) {
    return 'Name must not exceed 60 characters.';
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address.';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least 1 uppercase letter.';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least 1 special character (!@#$%^&*).';
  }
  return '';
};

export const validateAddress = (address) => {
  if (address && address.length > 400) {
    return 'Address must not exceed 400 characters.';
  }
  return '';
};

export const validateRating = (rating) => {
  const num = parseInt(rating);
  if (isNaN(num) || num < 1 || num > 5) {
    return 'Rating must be between 1 and 5.';
  }
  return '';
};

export const validateStoreName = (name) => {
  if (!name || name.trim().length < 1) {
    return 'Store name is required.';
  }
  if (name.trim().length > 60) {
    return 'Store name must not exceed 60 characters.';
  }
  return '';
};
