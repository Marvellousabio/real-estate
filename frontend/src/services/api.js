import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // avoid hanging
});

// Global error logging
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// Properties
export const createProperty = (propertyData) =>
  API.post("/properties", propertyData);

export const getProperties = async (filters = {}) => {
  const res = await API.get("/properties", { params: filters });
  return res.data;
};

// Blogs
export const createBlog = (blogData) =>
  API.post("/blog", blogData, {
    headers: { "Content-Type": undefined },
  });

export const getBlogs = async () => {
  const res = await API.get("/blog");
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await API.get(`/blog/${id}`);
  return res.data;
};
