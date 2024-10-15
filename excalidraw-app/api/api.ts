// api.ts
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_AUTH_URL, // Use your environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors if needed
api.interceptors.request.use(
  (config) => {
    // Add authorization token if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status || null;
    if (status === 401) {
      toast.error('Your session has expired. Please login again!');
      setTimeout(() => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
        window.location.reload();
      }, 3000);
    }
    return Promise.reject(err);
  }
);

export default api;
