import axios from "axios";

const axiosInstance = axios.create({
  baseURL : import.meta.env.VITE_BACKEND_HOST,
  headers : {
    'Content-Type' : 'application/json',
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  console.log('axios token', token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance; 