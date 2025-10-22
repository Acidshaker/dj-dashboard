import axios from "axios";

const isDev = import.meta.env.VITE_USE_MOCK === "true";

const api = axios.create({
  baseURL: isDev ? "/api" : import.meta.env.VITE_API_URL,
});

export default api;
