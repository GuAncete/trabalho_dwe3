import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição (Request Interceptor)
// Isso é executado ANTES de CADA requisição
apiClient.interceptors.request.use(
  (config) => {
    // Instancia a store DENTRO do interceptor
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      // Adiciona o cabeçalho de autorização
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Response Interceptor)
// Isso é executado DEPOIS de CADA resposta
apiClient.interceptors.response.use(
  (response) => {
    // Qualquer status code 2xx cai aqui
    return response;
  },
  (error) => {
    // Se o erro for 401 (Não Autorizado) ou 403 (Proibido)
    // significa que o token é inválido ou expirou.
    if (error.response && [401, 403].includes(error.response.status)) {
      const authStore = useAuthStore();
      console.warn('Token inválido ou expirado. Fazendo logout.');
      authStore.logout(); // Desloga o usuário
    }
    
    // Qualquer status code fora de 2xx cai aqui
    return Promise.reject(error);
  }
);

export default apiClient;