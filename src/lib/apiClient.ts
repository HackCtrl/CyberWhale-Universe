import axios, { AxiosInstance } from 'axios';

const BASE_URL = process.env.VITE_API_URL || process.env.REACT_APP_API_URL || '/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore (server-side or storage not available)
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.pathname = '/auth';
        }
      } catch (e) {
        // noop
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    try {
      localStorage.setItem('token', token);
    } catch {}
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    try {
      localStorage.removeItem('token');
    } catch {}
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
