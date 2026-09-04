import api from './axios';

// ==================== AUTH ====================

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  changePassword: (data) => api.put('/auth/password', data),
};

// ==================== ADMIN ====================

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  createUser: (data) => api.post('/admin/users', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  createStore: (data) => api.post('/admin/stores', data),
  getStores: (params) => api.get('/admin/stores', { params }),
};

// ==================== STORES (Normal User) ====================

export const storeAPI = {
  getStores: (params) => api.get('/stores', { params }),
  submitRating: (storeId, data) => api.post(`/stores/${storeId}/ratings`, data),
  modifyRating: (storeId, data) => api.put(`/stores/${storeId}/ratings`, data),
};

// ==================== OWNER ====================

export const ownerAPI = {
  getDashboard: () => api.get('/owner/dashboard'),
};
