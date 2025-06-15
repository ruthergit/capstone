// services/api.ts
import axios from "axios";
import { useAuthTokenStore } from "../store/useAuthTokenStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach auth token automatically
api.interceptors.request.use((config) => {
  const token = useAuthTokenStore.getState().authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
