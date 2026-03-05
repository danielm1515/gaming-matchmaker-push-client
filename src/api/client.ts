import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);
