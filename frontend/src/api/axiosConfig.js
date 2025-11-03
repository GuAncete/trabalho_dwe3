import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      const authStore = useAuthStore();
      console.warn('Token inválido ou expirado. Fazendo logout.');
      authStore.logout(); 
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;