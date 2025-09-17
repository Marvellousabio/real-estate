import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL,});

export const createProperty= (propertyData)=>API.post("/properties",propertyData);
export const getProperties = async (filters = {}) => {
  const res = await API.get("/properties", { params: filters });
  return res.data; // ✅ only return the array from backend
};
export const createBlog= (blogData)=>
  API.post("/blog", blogData,{
    headers:{"Content-Type":"multipart/form-data"},
  });

export const getBlogs = async ()=> {
  const res=await API.get("/blog");
  return res.data;
};

export const getBlogById= async (id)=>{
  const res = await API.get(`/blog/${id}`);
  return res.data;
}

