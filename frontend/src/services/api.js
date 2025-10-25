import axios from "axios";

// Environment validation
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL environment variable is not defined");
}

// Create axios instance with default config
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
API.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    console.error("API Error:", errorDetails);

    // Handle specific error types
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      // Could redirect to login page here
    }

    return Promise.reject(error);
  }
);

// Properties API
export const propertyAPI = {
  create: async (propertyData) => {
    const response = await API.post("/properties", propertyData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await API.get("/properties", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/properties/${id}`);
    return response.data;
  },

  update: async (id, propertyData) => {
    const response = await API.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/properties/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await API.get("/properties/stats/summary");
    return response.data;
  },
};

// Blogs API
export const blogAPI = {
  create: async (blogData) => {
    const response = await API.post("/blog", blogData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await API.get("/blog", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/blog/${id}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await API.get(`/blog/slug/${slug}`);
    return response.data;
  },

  update: async (id, blogData) => {
    const response = await API.put(`/blog/${id}`, blogData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/blog/${id}`);
    return response.data;
  },
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },

  updateDetails: async (userData) => {
    const response = await API.put("/auth/updatedetails", userData);
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await API.put("/auth/updatepassword", passwordData);
    return response.data;
  },

  logout: async () => {
    const response = await API.get("/auth/logout");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post("/auth/forgotpassword", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await API.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  addFavorite: async (propertyId) => {
    const response = await API.post('/favorites', { propertyId });
    return response.data;
  },

  removeFavorite: async (favoriteId) => {
    const response = await API.delete(`/favorites/${favoriteId}`);
    return response.data;
  },

  getFavorites: async (params = {}) => {
    const response = await API.get('/favorites', { params });
    return response.data;
  },

  checkFavorite: async (propertyId) => {
    const response = await API.get(`/favorites/check/${propertyId}`);
    return response.data;
  },
};

// Legacy exports for backward compatibility
export const createProperty = propertyAPI.create;
export const getProperties = propertyAPI.getAll;
export const createBlog = blogAPI.create;
export const getBlogs = blogAPI.getAll;
export const getBlogById = blogAPI.getById;

// Export the axios instance for advanced usage
export { API };
export default API;
