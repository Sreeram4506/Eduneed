const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function to make authenticated requests
const authRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${API_BASE_URL}${url}`, { ...options, headers });
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (email, password, role = 'user') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
};

// Files API
export const filesAPI = {
  upload: async (formData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
  getFiles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await authRequest(`/files?${query}`);
    return response.json();
  },
  getFile: async (id) => {
    const response = await authRequest(`/files/${id}`);
    return response.json();
  },
  downloadFile: async (id) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/files/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  shareFile: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/files/${id}/share`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await authRequest('/admin/users');
    return response.json();
  },
  getFiles: async () => {
    const response = await authRequest('/admin/files');
    return response.json();
  },
  deleteFile: async (id) => {
    const response = await authRequest(`/admin/files/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
