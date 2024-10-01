// authServices.ts
import axios from "axios";

const APP_URL = import.meta.env.VITE_APP_URL; // Adjust according to your env

// Login function
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${APP_URL}/login`, {
    email,
    password,
  });
  return response.data; // Adjust based on your API response structure
};

// Register function
export const register = async ({
  name,
  email,
  password,
  password_confirmation,
}: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await axios.post(`${APP_URL}/register`, {
    name,
    email,
    password,
    password_confirmation,
  });
  return response.data;
};
