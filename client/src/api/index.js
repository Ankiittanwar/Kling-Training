import axios from 'axios';

// In production (Vercel), VITE_API_URL = your Render backend URL
// In development, falls back to /api (proxied to localhost:3001 by Vite)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://kling-training-api.onrender.com/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('bagsy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bagsy_token');
      localStorage.removeItem('bagsy_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
