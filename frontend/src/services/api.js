import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      window.dispatchEvent(new Event('storage'));
      // Redirect to login so user sees login page (reliable across tabs and when storage event doesn't fire in same tab)
      const loginPath = '/login';
      if (window.location.pathname !== loginPath && !window.location.pathname.startsWith('/login')) {
        window.location.replace(loginPath);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
