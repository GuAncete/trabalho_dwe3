import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios'; // Usamos o axios normal aqui, não o 'apiClient' ainda
import router from '@/router'; // Importamos o router para redirecionar

// Criamos uma instância base do axios SÓ para o login/registro
// pois o 'apiClient' (que criaremos depois) depende desta store.
const authApi = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
});

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  // Tenta carregar do localStorage ao iniciar
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value);
  const authHeader = computed(() => ({
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }));

  // --- Actions ---

  /**
   * Tenta fazer login.
   * Salva o token e o usuário no state e no localStorage em caso de sucesso.
   */
  async function login(credentials) {
    try {
      const response = await authApi.post('/login', credentials);
      const { token: newToken, usuario } = response.data;

      // Salva no Pinia
      token.value = newToken;
      user.value = usuario;

      // Salva no LocalStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(usuario));

      // Redireciona para o Dashboard
      router.push('/');
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error.response?.data?.error || error.message);
      alert('Erro no login: ' + (error.response?.data?.error || 'Verifique suas credenciais.'));
      return false;
    }
  }

  /**
   * Tenta registrar um novo usuário.
   */
  async function register(userData) {
    try {
      await authApi.post('/register', userData);
      // Redireciona para o login após registro
      router.push('/login');
      alert('Registro efetuado com sucesso! Faça o login.');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error.response?.data?.error || error.message);
       alert('Erro no registro: ' + (error.response?.data?.error || 'Tente novamente.'));
      return false;
    }
  }

  /**
   * Limpa o state e o localStorage, fazendo logout.
   */
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  function updateUser(newUserData) {
    // Atualiza apenas os campos que a API retornou (id, nome, email)
    const updatedUser = { ...user.value, ...newUserData };

    user.value = updatedUser;
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return { token, user, isAuthenticated, authHeader, login, register, logout, updateUser };
});