// api.ts
import axios from "axios";

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

export default api;
