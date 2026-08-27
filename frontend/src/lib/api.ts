import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' 
    ? '/api' 
    : 'http://localhost:5000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth JWT token (admin token or Supabase session) to Flask backend calls
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const localToken = localStorage.getItem('admin_token');
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
        return config;
      }

      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error fetching auth session for API request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

