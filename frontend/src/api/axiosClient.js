import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Attach the JWT to every outgoing request, if we have one.
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the backend ever says the token is invalid/expired, log out
// automatically instead of leaving the user stuck on broken pages.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
