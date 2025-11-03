import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios'; 
import router from '@/router'; 

const authApi = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
});

export const useAuthStore = defineStore('auth', () => {
  
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const isAuthenticated = computed(() => !!token.value);
  const authHeader = computed(() => ({
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }));

 
  async function login(credentials) {
    try {
      const response = await authApi.post('/login', credentials);
      const { token: newToken, usuario } = response.data;

      token.value = newToken;
      user.value = usuario;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(usuario));

      router.push('/');
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error.response?.data?.error || error.message);
      alert('Erro no login: ' + (error.response?.data?.error || 'Verifique suas credenciais.'));
      return false;
    }
  }

 
  async function register(userData) {
    try {
      await authApi.post('/register', userData);
      router.push('/login');
      alert('Registro efetuado com sucesso! Faça o login.');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error.response?.data?.error || error.message);
       alert('Erro no registro: ' + (error.response?.data?.error || 'Tente novamente.'));
      return false;
    }
  }


  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  function updateUser(newUserData) {
    const updatedUser = { ...user.value, ...newUserData };

    user.value = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return { token, user, isAuthenticated, authHeader, login, register, logout, updateUser };
});