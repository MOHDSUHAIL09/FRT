// src/services/apiClient.js
import axios from "axios";
import toast from "react-hot-toast"; 

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  maxBodyLength: Infinity,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired!");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export default apiClient;